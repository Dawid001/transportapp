import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import { RateLimitError } from "./fetchVehicles.js";

const { transit_realtime } = GtfsRealtimeBindings;

/**
 * Meldingen: omleidingen, tijdelijke haltes, werkzaamheden, storingen.
 * - Bus/tram/metro: OVapi GTFS-RT alerts (per halte, soms per lijn op die halte).
 * - Trein: NS Reisinformatie API disruptions (per station).
 */

export type Alert = { id: string; source: "ov" | "ns"; title: string; text?: string };

const OVAPI_URL = "https://gtfs.ovapi.nl/nl/alerts.pb";
const NS_URL = "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v3/disruptions?isActive=true";

type OvAlert = Alert & { periods: [number, number][]; entities: { stopId?: string; routeId?: string }[] };
type NsDisruption = Alert & { stations: Set<string>; start?: number; end?: number };

/** Nederlandse tekst uit een GTFS-RT TranslatedString; OVapi zet vaak "NL: … -- Engels" in één tekst. */
function dutch(ts: { translation?: { text?: string | null; language?: string | null }[] | null } | null | undefined): string | undefined {
  const list = ts?.translation ?? [];
  const t = list.find((x) => x.language?.toLowerCase() === "nl") ?? list[0];
  const text = t?.text?.split(" -- ")[0].replace(/^nl:\s*/i, "").trim();
  return text || undefined;
}

export function createAlerts(nsKey: string | undefined) {
  let ov: { etag?: string; alerts: OvAlert[]; byStop: Map<string, OvAlert[]> } | null = null;
  let ns: NsDisruption[] = [];

  /** OVapi-meldingen ophalen (valt binnen de OVapi rate limit; aanroepen vanuit de poller). */
  async function pollOvapi(): Promise<string> {
    const headers: Record<string, string> = { "User-Agent": "live-ov-dev" };
    if (ov?.etag) headers["If-None-Match"] = ov.etag;
    const res = await fetch(OVAPI_URL, { headers });
    if (res.status === 304) return "Meldingen ongewijzigd (304)";
    if (res.status === 429) throw new RateLimitError("alerts gaf HTTP 429 (rate limit)");
    if (!res.ok) throw new Error(`alerts gaf HTTP ${res.status}`);
    const feed = transit_realtime.FeedMessage.decode(new Uint8Array(await res.arrayBuffer()));
    const alerts: OvAlert[] = [];
    const byStop = new Map<string, OvAlert[]>();
    for (const e of feed.entity) {
      const a = e.alert;
      if (!a) continue;
      const title = dutch(a.headerText) ?? dutch(a.descriptionText);
      if (!title) continue;
      const description = dutch(a.descriptionText);
      const alert: OvAlert = {
        id: e.id,
        source: "ov",
        title,
        text: description && description !== title ? description : undefined,
        periods: (a.activePeriod ?? []).map((p) => [Number(p.start ?? 0), Number(p.end ?? 0) || Infinity]),
        entities: (a.informedEntity ?? []).map((i) => ({ stopId: i.stopId || undefined, routeId: i.routeId || undefined })),
      };
      alerts.push(alert);
      for (const ent of alert.entities) {
        if (!ent.stopId) continue;
        const list = byStop.get(ent.stopId);
        if (list) list.push(alert);
        else byStop.set(ent.stopId, [alert]);
      }
    }
    ov = { etag: res.headers.get("etag") ?? undefined, alerts, byStop };
    return `${alerts.length} meldingen`;
  }

  async function pollNs() {
    if (!nsKey) return;
    try {
      const res = await fetch(NS_URL, { headers: { "Ocp-Apim-Subscription-Key": nsKey } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      type Raw = {
        id: string;
        title: string;
        start?: string;
        end?: string;
        publicationSections?: { section?: { stations?: { stationCode: string }[] } }[];
        timespans?: { situation?: { label?: string }; additionalTravelTime?: { label?: string } }[];
      };
      ns = ((await res.json()) as Raw[]).map((d) => ({
        id: `ns:${d.id}`,
        source: "ns" as const,
        title: d.title,
        text: [d.timespans?.[0]?.situation?.label, d.timespans?.[0]?.additionalTravelTime?.label].filter(Boolean).join(" ") || undefined,
        stations: new Set((d.publicationSections ?? []).flatMap((p) => p.section?.stations ?? []).map((s) => s.stationCode)),
        start: d.start ? new Date(d.start).getTime() / 1000 : undefined,
        end: d.end ? new Date(d.end).getTime() / 1000 : undefined,
      }));
    } catch (err) {
      console.error("[NS] Storingen ophalen mislukt:", err instanceof Error ? err.message : err);
    }
  }
  void pollNs();
  setInterval(pollNs, 5 * 60_000);

  const activeNow = (a: OvAlert, now: number) => a.periods.length === 0 || a.periods.some(([s, e]) => now >= s && now <= e);
  const publicAlert = ({ id, source, title, text }: Alert): Alert => ({ id, source, title, text });

  /**
   * Meldingen die nu gelden voor deze haltes. Met `routeIds` alleen meldingen zonder lijn of voor
   * één van deze lijnen; met `stationCodes` ook NS-storingen op die stations.
   */
  function forStops(
    stopIds: string[],
    {
      routeIds,
      stationCodes,
      line,
      allStations = false,
    }: {
      routeIds?: Set<string>;
      stationCodes?: string[];
      /** Lijn van een reisdeel: meldingen die in de tekst alleen andere lijnen noemen, weglaten. */
      line?: string;
      /** NS: alleen storingen waarin álle opgegeven stations liggen (in- én uitstapstation van een reisdeel). */
      allStations?: boolean;
    } = {},
  ): Alert[] {
    const now = Date.now() / 1000;
    const found = new Map<string, Alert>();
    for (const stopId of stopIds) {
      for (const a of ov?.byStop.get(stopId) ?? []) {
        if (found.has(a.id) || !activeNow(a, now)) continue;
        const relevant = a.entities.some((e) => e.stopId === stopId && (!e.routeId || !routeIds || routeIds.has(e.routeId)));
        if (!relevant) continue;
        // Melding op de hele halte, maar de tekst gaat over andere lijnen ("Bus N86 stopt hier niet").
        const mentioned = mentionedLines(a.title);
        if (line && mentioned.size && !mentioned.has(line.toUpperCase())) continue;
        found.set(a.id, publicAlert(a));
      }
    }
    if (stationCodes?.length) {
      for (const d of ns) {
        if (d.end && d.end < now) continue;
        const hit = allStations ? stationCodes.every((c) => d.stations.has(c)) : stationCodes.some((c) => d.stations.has(c));
        if (hit) found.set(d.id, publicAlert(d));
      }
    }
    return [...found.values()];
  }

  return { pollOvapi, forStops };
}

/** Lijnnummers die in een meldingstekst genoemd worden: "Bus N82, N83 en N84 …", "Tram 1, 17 en 27 …". */
export function mentionedLines(text: string): Set<string> {
  const out = new Set<string>();
  for (const m of text.matchAll(/\b(?:bus|tram|metro|lijn|lijnen|buslijn|tramlijn)\s+((?:[A-Z]{0,2}\d{1,4}[a-z]?)(?:\s*(?:,|en|\/)\s*[A-Z]{0,2}\d{1,4}[a-z]?)*)/gi)) {
    for (const n of m[1].split(/\s*(?:,|en|\/)\s*/)) if (n) out.add(n.toUpperCase());
  }
  return out;
}
