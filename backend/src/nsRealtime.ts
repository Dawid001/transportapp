import type { StopIndex } from "./stopIndex.js";

/**
 * Realtime treininformatie van NS (Reisinformatie API): werkelijke vertrek-/aankomsttijd, spoor(wijziging)
 * en uitval per treinnummer per station. OVapi heeft dit voor treinen niet.
 * Per station 60 s gecachet, zodat de daglimiet van de key niet snel opraakt.
 */

const BASE = "https://gateway.apiportal.ns.nl/reisinformatie-api/api";
const CACHE_MS = 60_000;
const MATCH_RADIUS_M = 600;

export type TrainTime = {
  planned: number;
  actual: number;
  plannedTrack?: string;
  actualTrack?: string;
  cancelled: boolean;
};

type NsStation = { code: string; UICCode: string; lat: number; lng: number; land: string; namen: { lang: string } };
type NsJourney = {
  plannedDateTime: string;
  actualDateTime?: string;
  plannedTrack?: string;
  actualTrack?: string;
  cancelled?: boolean;
  product?: { number?: string };
};

const M_LAT = 111_320;
const M_LNG = 111_320 * Math.cos((52 * Math.PI) / 180);
const toUnix = (iso: string) => Math.floor(new Date(iso).getTime() / 1000);

export function createNsRealtime(apiKey: string, stops: StopIndex) {
  const headers = { "Ocp-Apim-Subscription-Key": apiKey };
  /** Halte-ID (GTFS) → NS-stationscode. */
  let codeByStop = new Map<string, string>();
  let stations: NsStation[] = [];
  let currentStops = stops;

  /** NS-stations koppelen aan het dichtstbijzijnde treinstation in onze haltelijst. */
  function link() {
    const next = new Map<string, string>();
    const trainGroups = [...currentStops.groups.values()].filter((g) => g.modes.includes("train"));
    let matched = 0;
    for (const st of stations) {
      let best: { stopIds: string[]; d: number } | undefined;
      for (const g of trainGroups) {
        const d = Math.hypot((g.lng - st.lng) * M_LNG, (g.lat - st.lat) * M_LAT);
        if (d <= MATCH_RADIUS_M && (!best || d < best.d)) best = { stopIds: g.stopIds, d };
      }
      if (!best) continue;
      for (const id of best.stopIds) next.set(id, st.code);
      matched++;
    }
    codeByStop = next;
    return matched;
  }
  const cache = new Map<string, { at: number; data: Promise<Map<string, TrainTime>> }>();

  // Stations eenmalig ophalen en koppelen aan het dichtstbijzijnde treinstation in onze haltelijst.
  async function loadStations() {
    try {
      const res = await fetch(`${BASE}/v2/stations`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      stations = ((await res.json()) as { payload: NsStation[] }).payload.filter((s) => s.land === "NL");
      const matched = link();
      console.log(`[NS] ${matched} van ${stations.length} stations gekoppeld voor realtime treintijden`);
    } catch (err) {
      console.error("[NS] Stations ophalen mislukt, over 5 min opnieuw:", err instanceof Error ? err.message : err);
      setTimeout(loadStations, 5 * 60_000);
    }
  }
  void loadStations();

  async function fetchBoard(kind: "departures" | "arrivals", code: string): Promise<Map<string, TrainTime>> {
    const res = await fetch(`${BASE}/v2/${kind}?station=${encodeURIComponent(code)}&maxJourneys=60`, { headers });
    if (!res.ok) throw new Error(`NS ${kind} ${code}: HTTP ${res.status}`);
    const body = (await res.json()) as { payload?: Record<string, NsJourney[]> };
    const out = new Map<string, TrainTime>();
    for (const j of body.payload?.[kind] ?? []) {
      const nr = j.product?.number;
      if (!nr) continue;
      out.set(nr, {
        planned: toUnix(j.plannedDateTime),
        actual: toUnix(j.actualDateTime ?? j.plannedDateTime),
        plannedTrack: j.plannedTrack,
        actualTrack: j.actualTrack ?? j.plannedTrack,
        cancelled: !!j.cancelled,
      });
    }
    return out;
  }

  /** Vertrekken of aankomsten op een station, per treinnummer (leeg bij fouten). */
  function board(kind: "departures" | "arrivals", code: string): Promise<Map<string, TrainTime>> {
    const key = `${kind}:${code}`;
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < CACHE_MS) return hit.data;
    const data = fetchBoard(kind, code).catch((err) => {
      console.error("[NS]", err instanceof Error ? err.message : err);
      cache.delete(key);
      return new Map<string, TrainTime>();
    });
    cache.set(key, { at: Date.now(), data });
    if (cache.size > 500) cache.delete(cache.keys().next().value!);
    return data;
  }

  return {
    /** Na een nieuwe dienstregeling: stations opnieuw koppelen (halte-ID's kunnen veranderd zijn). */
    relink: (next: StopIndex) => {
      currentStops = next;
      if (stations.length) link();
    },
    stationCode: (stopId: string) => codeByStop.get(stopId),
    departures: (code: string) => board("departures", code),
    arrivals: (code: string) => board("arrivals", code),
  };
}

export type NsRealtime = ReturnType<typeof createNsRealtime>;
