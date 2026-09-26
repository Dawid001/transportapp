import type { DatabaseSync } from "node:sqlite";
import type { Mode } from "./gtfs/lookup.js";
import type { Timetable } from "./timetable.js";

/**
 * Een halte zoals een reiziger hem ziet: alle perrons/sporen en beide rijrichtingen samen
 * (bv. "Leiden Centraal" met spoor 1 t/m 8b, of "Leiden, Steenstraat" in beide richtingen).
 */
export type StopGroup = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  stopIds: string[];
  modes: Mode[];
};

/** Haltes met dezelfde naam binnen deze afstand horen bij elkaar (vaak één per rijrichting). */
const MERGE_DISTANCE_M = 400;
const MODE_ORDER: Mode[] = ["train", "metro", "tram", "bus", "ferry", "other"];
// Afkortingen die reizigers typen.
const ALIASES: Record<string, string[]> = { cs: ["centraal"], ns: ["station"], str: ["straat"] };

const M_LAT = 111_320;
const M_LNG = 111_320 * Math.cos((52 * Math.PI) / 180);
const distanceM = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) =>
  Math.hypot((a.lng - b.lng) * M_LNG, (a.lat - b.lat) * M_LAT);

/** "Zuidplein perron A", "Station Leiden Centraal (Perron H)" → zonder perronaanduiding. */
function stripPlatform(name: string): string {
  return name.replace(/\s*\(?\b(perron|platform)\s+[a-z0-9]+\)?/gi, "").trim();
}

/** Sleutel om haltes samen te voegen: het deel na de plaatsnaam, zonder perron ("Rotterdam, Zuidplein" ≈ "Zuidplein"). */
function mergeKey(name: string): string {
  const withoutTown = name.includes(", ") ? name.slice(name.lastIndexOf(", ") + 2) : name;
  return normalize(stripPlatform(withoutTown));
}

export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function createStopIndex(db: DatabaseSync, timetable: Timetable) {
  const started = Date.now();
  type Row = { stop_id: string; stop_name: string; stop_lat: number; stop_lon: number; parent_station: string | null };
  const rows = db
    .prepare("SELECT stop_id, stop_name, stop_lat, stop_lon, parent_station FROM stops WHERE location_type = 0 OR location_type IS NULL")
    .all() as Row[];
  // Namen van halte-gebieden ("Leiden Centraal"), netter dan die van losse perrons/bushaltes erin.
  const areaNames = new Map(
    (db.prepare("SELECT stop_id, stop_name FROM stops WHERE location_type = 1").all() as { stop_id: string; stop_name: string }[]).map(
      (r) => [r.stop_id, r.stop_name],
    ),
  );

  // Alleen haltes waar echt iets stopt; per halte de vervoerswijzen.
  const modesByStop = new Map<string, Set<Mode>>();
  for (const [stopId, entries] of timetable.patternsByStop) {
    const set = new Set<Mode>();
    for (const e of entries) set.add(timetable.patterns.get(e.patternId)!.mode);
    modesByStop.set(stopId, set);
  }

  // 1. Groeperen per halte-gebied (parent_station), losse haltes apart.
  type Draft = { name: string; stops: Row[] };
  const byParent = new Map<string, Draft>();
  for (const row of rows) {
    if (!modesByStop.has(row.stop_id)) continue;
    const key = row.parent_station ?? `stop:${row.stop_id}`;
    const draft = byParent.get(key);
    if (draft) draft.stops.push(row);
    else byParent.set(key, { name: stripPlatform((row.parent_station && areaNames.get(row.parent_station)) || row.stop_name), stops: [row] });
  }

  // 2. Groepen met dezelfde naam dicht bij elkaar samenvoegen.
  const center = (stops: Row[]) => ({
    lat: stops.reduce((s, r) => s + r.stop_lat, 0) / stops.length,
    lng: stops.reduce((s, r) => s + r.stop_lon, 0) / stops.length,
  });
  const merged: { id: string; names: string[]; stops: Row[] }[] = [];
  const byKey = new Map<string, typeof merged>();
  for (const [key, draft] of byParent) {
    const k = mergeKey(draft.name);
    const sameKey = byKey.get(k) ?? [];
    const c = center(draft.stops);
    const target = sameKey.find((g) => distanceM(center(g.stops), c) <= MERGE_DISTANCE_M);
    if (target) {
      target.stops.push(...draft.stops);
      target.names.push(draft.name);
      // Een halte-gebied-ID is stabieler dan een los halte-ID.
      if (target.id.startsWith("stop:") && !key.startsWith("stop:")) target.id = key;
    } else {
      const group = { id: key, names: [draft.name], stops: [...draft.stops] };
      merged.push(group);
      sameKey.push(group);
      byKey.set(k, sameKey);
    }
  }

  /** Beste weergavenaam: een stationsnaam zonder plaatsprefix, anders "Plaats, Halte", anders de kortste. */
  const displayName = (names: string[], hasTrain: boolean) => {
    const unique = [...new Set(names)];
    if (hasTrain) {
      const station = unique.find((n) => !n.includes(", ") && !n.startsWith("["));
      if (station) return station;
    }
    return unique.find((n) => n.includes(", ") && !n.startsWith("[")) ?? unique.sort((a, b) => a.length - b.length)[0];
  };

  const groups = new Map<string, StopGroup>();
  const groupByStop = new Map<string, StopGroup>();
  const searchEntries: { group: StopGroup; norm: string; place: string; tokens: string[]; weight: number }[] = [];
  for (const g of merged) {
    const modes = new Set<Mode>();
    for (const s of g.stops) for (const m of modesByStop.get(s.stop_id) ?? []) modes.add(m);
    const group: StopGroup = {
      id: g.id,
      name: displayName(g.names, modes.has("train")),
      ...center(g.stops),
      stopIds: g.stops.map((s) => s.stop_id),
      modes: MODE_ORDER.filter((m) => modes.has(m)),
    };
    groups.set(group.id, group);
    for (const id of group.stopIds) groupByStop.set(id, group);
    const norm = normalize(group.name);
    // Stations en grote knooppunten eerst: meer patronen = drukker.
    const patternCount = group.stopIds.reduce((n, id) => n + (timetable.patternsByStop.get(id)?.length ?? 0), 0);
    const weight = (modes.has("train") ? 50 : 0) + (modes.has("metro") ? 20 : 0) + Math.min(30, Math.log2(1 + patternCount) * 4);
    // Naam zonder plaatsprefix: "Amsterdam, Dam" → "dam".
    const place = normalize(group.name.includes(", ") ? group.name.slice(group.name.lastIndexOf(", ") + 2) : group.name);
    searchEntries.push({ group, norm, place, tokens: norm.split(" "), weight });
  }

  console.log(`Haltes: ${groups.size.toLocaleString("nl-NL")} zoekbare haltes (${Date.now() - started} ms)`);

  /** Zoekt haltes: elk woord van de zoekterm moet het begin van een woord in de naam zijn. */
  function search(query: string, limit = 8, near?: { lat: number; lng: number }): StopGroup[] {
    const q = normalize(query);
    if (!q) return [];
    const qTokens = q.split(" ");
    const results: { group: StopGroup; score: number }[] = [];
    for (const e of searchEntries) {
      const ok = qTokens.every((qt) =>
        e.tokens.some((t) => t.startsWith(qt) || (ALIASES[qt] ?? []).some((alias) => t.startsWith(alias))),
      );
      if (!ok) continue;
      let score = e.weight - e.tokens.length * 2;
      // Een heel woord ("dam") telt zwaarder dan alleen het begin ervan ("damwald").
      score += qTokens.filter((qt) => e.tokens.includes(qt)).length * 25;
      // Alleen voor hele woorden: "dam" mag niet "Damwald" boven "Amsterdam, Dam" zetten.
      if (e.norm === q || e.norm.startsWith(q + " ")) score += 60;
      if (e.norm === q || e.place === q) score += 70;
      if (near) score -= Math.min(40, distanceM(near, e.group) / 1000); // dichterbij iets hoger
      results.push({ group: e.group, score });
    }
    return results.sort((a, b) => b.score - a.score).slice(0, limit).map((r) => r.group);
  }

  function inBbox([minLng, minLat, maxLng, maxLat]: [number, number, number, number], limit = 800): StopGroup[] {
    const out: StopGroup[] = [];
    for (const g of groups.values()) {
      if (g.lng >= minLng && g.lng <= maxLng && g.lat >= minLat && g.lat <= maxLat) out.push(g);
      if (out.length >= limit) break;
    }
    return out;
  }

  function nearest(point: { lat: number; lng: number }, radiusM: number, limit = 20): { group: StopGroup; distance: number }[] {
    const out: { group: StopGroup; distance: number }[] = [];
    for (const g of groups.values()) {
      const d = distanceM(point, g);
      if (d <= radiusM) out.push({ group: g, distance: d });
    }
    return out.sort((a, b) => a.distance - b.distance).slice(0, limit);
  }

  return {
    groups,
    byId: (id: string) => groups.get(id),
    groupOfStop: (stopId: string) => groupByStop.get(stopId),
    search,
    inBbox,
    nearest,
  };
}

export type StopIndex = ReturnType<typeof createStopIndex>;
