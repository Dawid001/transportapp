import { existsSync, renameSync, rmSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { GTFS_DB, GTFS_DB_PENDING } from "./paths.js";

export type Mode = "tram" | "metro" | "train" | "bus" | "ferry" | "other";

// https://gtfs.org/documentation/schedule/reference/#routestxt (route_type)
const MODES: Record<number, Mode> = { 0: "tram", 1: "metro", 2: "train", 3: "bus", 4: "ferry" };

export type TripInfo = {
  line?: string;
  headsign?: string;
  mode: Mode;
  agencyName?: string;
  routeColor?: string;
  routeTextColor?: string;
  directionId?: number;
  shapeId?: string;
  /** Ritnummer; bij treinen het treinnummer (koppeling met NS-realtime). */
  shortName?: string;
  routeId?: string;
};

export type LngLat = [number, number];
/** `arrival`/`departure`: geplande tijd in seconden sinds het begin van de dienstdag (kan ≥ 24 uur zijn). */
export type RouteStop = { sequence: number; id: string; name: string; lat: number; lng: number; arrival?: number; departure?: number };
/** `approximate`: de lijn volgt niet de echte weg (rechte stukken tussen haltes), zie isCoarse(). */
export type TripRoute = { tripId: string; shape: LngLat[] | null; approximate: boolean; stops: RouteStop[] };
export type LineVariant = {
  routeId: string;
  directionId?: number;
  headsign?: string;
  agencyName?: string;
  mode: Mode;
  shape: LngLat[];
  approximate: boolean;
};

type Row = Record<string, string | number | null>;

const round5 = (n: number) => Math.round(n * 1e5) / 1e5;

// Meters per graad op Nederlandse breedte (~52°), genoeg voor vereenvoudigen.
const M_PER_DEG_LAT = 111_320;
const M_PER_DEG_LNG = 111_320 * Math.cos((52 * Math.PI) / 180);

/**
 * Een echte routelijn heeft punten om de paar tientallen meters. Sommige vervoerders (o.a. alle 608 shapes
 * van RET) leveren alleen rechte lijnen van halte naar halte: mediaan segment ~500 m. Die tonen we als
 * benadering en gebruiken we niet om voertuigen over te laten rijden.
 */
const COARSE_MEDIAN_SEGMENT_M = 150;

function isCoarse(coords: LngLat[]): boolean {
  if (coords.length < 3) return true;
  const segments: number[] = [];
  for (let i = 1; i < coords.length; i++) {
    segments.push(Math.hypot((coords[i][0] - coords[i - 1][0]) * M_PER_DEG_LNG, (coords[i][1] - coords[i - 1][1]) * M_PER_DEG_LAT));
  }
  segments.sort((a, b) => a - b);
  return segments[segments.length >> 1] > COARSE_MEDIAN_SEGMENT_M;
}

/** Douglas-Peucker: laat punten weg die minder dan `toleranceM` meter van de lijn afwijken. */
function simplify(coords: LngLat[], toleranceM: number): LngLat[] {
  if (coords.length < 3) return coords;
  const keep = new Uint8Array(coords.length);
  keep[0] = keep[coords.length - 1] = 1;
  const stack: [number, number][] = [[0, coords.length - 1]];
  const tol2 = toleranceM * toleranceM;

  while (stack.length) {
    const [start, end] = stack.pop()!;
    const ax = coords[start][0] * M_PER_DEG_LNG, ay = coords[start][1] * M_PER_DEG_LAT;
    const bx = coords[end][0] * M_PER_DEG_LNG, by = coords[end][1] * M_PER_DEG_LAT;
    const dx = bx - ax, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    let maxDist = 0;
    let index = -1;
    for (let i = start + 1; i < end; i++) {
      const px = coords[i][0] * M_PER_DEG_LNG, py = coords[i][1] * M_PER_DEG_LAT;
      const t = len2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2)) : 0;
      const ex = px - (ax + t * dx), ey = py - (ay + t * dy);
      const d = ex * ex + ey * ey;
      if (d > maxDist) {
        maxDist = d;
        index = i;
      }
    }
    if (index !== -1 && maxDist > tol2) {
      keep[index] = 1;
      stack.push([start, index], [index, end]);
    }
  }
  return coords.filter((_, i) => keep[i]);
}

export function openGtfs() {
  // Een import die klaar was terwijl de server draaide, staat als .new klaar (zie import.ts).
  if (existsSync(GTFS_DB_PENDING)) {
    rmSync(GTFS_DB, { force: true });
    renameSync(GTFS_DB_PENDING, GTFS_DB);
    console.log("Nieuwe GTFS-database geactiveerd.");
  }
  if (!existsSync(GTFS_DB)) {
    throw new Error(`Geen GTFS-database gevonden (${GTFS_DB}). Draai eerst: npm run gtfs:update`);
  }
  const db = new DatabaseSync(GTFS_DB, { readOnly: true });

  const byTrip = db.prepare(`
    SELECT r.route_short_name, r.route_type, r.route_color, r.route_text_color, a.agency_name,
           t.trip_headsign, t.direction_id, t.shape_id, t.trip_short_name, t.route_id
    FROM trips t
    JOIN routes r ON r.route_id = t.route_id
    LEFT JOIN agency a ON a.agency_id = r.agency_id
    WHERE t.trip_id = ?`);
  const byRoute = db.prepare(`
    SELECT r.route_short_name, r.route_type, r.route_color, r.route_text_color, a.agency_name
    FROM routes r
    LEFT JOIN agency a ON a.agency_id = r.agency_id
    WHERE r.route_id = ?`);

  // Trip-ID's blijven tussen polls gelijk, dus resultaten cachen (ook "niet gevonden").
  const cache = new Map<string, TripInfo | null>();

  function toInfo(row: Row): TripInfo {
    const str = (v: Row[string]) => (v == null || v === "" ? undefined : String(v));
    return {
      line: str(row.route_short_name),
      headsign: str(row.trip_headsign),
      mode: MODES[Number(row.route_type)] ?? "other",
      agencyName: str(row.agency_name),
      routeColor: str(row.route_color),
      routeTextColor: str(row.route_text_color),
      directionId: row.direction_id == null ? undefined : Number(row.direction_id),
      shapeId: str(row.shape_id),
      shortName: str(row.trip_short_name),
      routeId: str(row.route_id),
    };
  }

  /** Zoekt lijn/bestemming op via trip-ID, met route-ID als fallback als de rit niet in de dienstregeling staat. */
  function lookup(tripId?: string, routeId?: string): TripInfo | null {
    const key = `${tripId ?? ""}|${routeId ?? ""}`;
    if (cache.has(key)) return cache.get(key)!;

    let row = tripId ? (byTrip.get(tripId) as Row | undefined) : undefined;
    if (!row && routeId) row = byRoute.get(routeId) as Row | undefined;
    const info = row ? toInfo(row) : null;

    if (cache.size > 50_000) cache.clear();
    cache.set(key, info);
    return info;
  }

  // --- Routes en haltes -------------------------------------------------------------------------

  const hasRouteTables = !!db.prepare("SELECT 1 FROM sqlite_master WHERE name = 'trip_patterns'").get();
  if (!hasRouteTables) console.warn("Database heeft nog geen routes/haltes. Draai: npm run gtfs:update -- --force");
  const prepareIf = (sql: string) => (hasRouteTables ? db.prepare(sql) : null);

  const shapeById = prepareIf("SELECT coords FROM shapes WHERE shape_id = ?");
  const tripById = db.prepare("SELECT shape_id FROM trips WHERE trip_id = ?");
  // Geplande tijden zitten sinds de import met tijdprofielen in de database; oudere databases hebben ze niet.
  const hasTimes = !!db.prepare("SELECT 1 FROM sqlite_master WHERE name = 'time_profiles'").get();
  if (hasRouteTables && !hasTimes) console.warn("Database heeft nog geen geplande tijden. Draai: npm run gtfs:update -- --force");
  const patternByTrip = prepareIf(
    hasTimes
      ? `SELECT p.stops, tp.start_sec, tpr.offsets FROM trip_patterns tp
         JOIN patterns p USING (pattern_id)
         LEFT JOIN time_profiles tpr ON tpr.profile_id = tp.profile_id
         WHERE tp.trip_id = ?`
      : "SELECT p.stops FROM trip_patterns tp JOIN patterns p USING (pattern_id) WHERE tp.trip_id = ?",
  );
  const stopById = db.prepare("SELECT stop_id, stop_name, stop_lat, stop_lon FROM stops WHERE stop_id = ?");
  // Per route + richting de shape die door de meeste ritten gereden wordt (= het "normale" traject).
  const shapesByLine = db.prepare(`
    SELECT t.route_id, t.direction_id, t.shape_id, COUNT(*) AS n, r.route_type, a.agency_name
    FROM routes r
    JOIN trips t ON t.route_id = r.route_id
    LEFT JOIN agency a ON a.agency_id = r.agency_id
    WHERE r.route_short_name = ? COLLATE NOCASE AND t.shape_id IS NOT NULL
    GROUP BY t.route_id, t.direction_id, t.shape_id`);
  const headsignByShape = db.prepare(`
    SELECT trip_headsign FROM trips WHERE shape_id = ? AND trip_headsign IS NOT NULL
    GROUP BY trip_headsign ORDER BY COUNT(*) DESC LIMIT 1`);

  function decodeShape(shapeId: string | null | undefined): LngLat[] | null {
    if (!shapeId || !shapeById) return null;
    const row = shapeById.get(shapeId) as { coords: Uint8Array } | undefined;
    if (!row) return null;
    // Kopiëren naar een eigen buffer: de blob hoeft niet op een 4-byte grens te beginnen.
    const floats = new Float32Array(row.coords.slice().buffer);
    const coords: LngLat[] = [];
    for (let i = 0; i < floats.length; i += 2) coords.push([round5(floats[i]), round5(floats[i + 1])]);
    return coords;
  }

  /** Route (shape) en haltes van één rit. */
  function tripRoute(tripId: string): TripRoute | null {
    if (!hasRouteTables) return null;
    const trip = tripById.get(tripId) as { shape_id: string | null } | undefined;
    if (!trip) return null;

    const patternRow = patternByTrip!.get(tripId) as { stops: string; start_sec?: number | null; offsets?: string | null } | undefined;
    const pattern: [number, string][] = patternRow ? JSON.parse(patternRow.stops) : [];
    // Per halte een offset (aankomst = vertrek) of [aankomst, vertrek], in seconden na start_sec.
    const offsets: (number | [number, number])[] | null = patternRow?.offsets ? JSON.parse(patternRow.offsets) : null;
    const start = patternRow?.start_sec ?? null;
    const stops: RouteStop[] = [];
    pattern.forEach(([sequence, stopId], i) => {
      const s = stopById.get(stopId) as Row | undefined;
      if (!s) return;
      const stop: RouteStop = { sequence, id: stopId, name: String(s.stop_name), lat: Number(s.stop_lat), lng: Number(s.stop_lon) };
      const off = offsets?.[i];
      if (start !== null && off !== undefined) {
        stop.arrival = start + (Array.isArray(off) ? off[0] : off);
        stop.departure = start + (Array.isArray(off) ? off[1] : off);
      }
      stops.push(stop);
    });

    // Zonder shape tekenen we rechte lijnen tussen de haltes.
    const decoded = decodeShape(trip.shape_id);
    const shape = decoded ?? (stops.length > 1 ? stops.map((s): LngLat => [s.lng, s.lat]) : null);
    return { tripId, shape, approximate: !decoded || isCoarse(decoded), stops };
  }

  /**
   * Alle trajecten van een lijnnummer. Per route + richting nemen we elke variant die minstens 10% van de
   * ritten rijdt: de drukste variant is vaak een ingekorte rit (bv. 187 alleen Leiden–Roomburg), zo zie je
   * toch het hele traject zonder elke zeldzame omleiding mee te nemen.
   */
  function lineRoutes(line: string): LineVariant[] {
    const rows = shapesByLine.all(line) as Row[];
    const groups = new Map<string, Row[]>();
    for (const row of rows) {
      const key = `${row.route_id}|${row.direction_id}`;
      groups.set(key, [...(groups.get(key) ?? []), row]);
    }
    const chosen: Row[] = [];
    for (const group of groups.values()) {
      const max = Math.max(...group.map((r) => Number(r.n)));
      const common = group.filter((r) => Number(r.n) >= max * 0.1).sort((a, b) => Number(b.n) - Number(a.n));
      chosen.push(...common.slice(0, 5));
    }
    const variants: LineVariant[] = [];
    for (const row of chosen) {
      const full = decodeShape(String(row.shape_id));
      const shape = full && simplify(full, 5);
      if (!shape) continue;
      const headsign = headsignByShape.get(String(row.shape_id)) as { trip_headsign: string } | undefined;
      variants.push({
        routeId: String(row.route_id),
        directionId: row.direction_id == null ? undefined : Number(row.direction_id),
        headsign: headsign?.trip_headsign,
        agencyName: row.agency_name == null ? undefined : String(row.agency_name),
        mode: MODES[Number(row.route_type)] ?? "other",
        shape,
        approximate: isCoarse(full),
      });
    }
    return variants;
  }

  // --- Treinen (NS) -----------------------------------------------------------------------------

  const hasCalendar = !!db.prepare("SELECT 1 FROM sqlite_master WHERE name = 'calendar_dates'").get();
  if (!hasCalendar) console.warn("Database heeft nog geen rijdagen (calendar_dates). Draai: npm run gtfs:update -- --force");
  // Alleen spoorroutes (route_type 2): onder IFF-vervoerders staan ook vervangende bussen met dezelfde nummers.
  const tripByTrainNumber = hasCalendar
    ? db.prepare(`
        SELECT t.trip_id FROM trips t
        JOIN routes r ON r.route_id = t.route_id
        JOIN calendar_dates c ON c.service_id = t.service_id AND c.exception_type = 1
        WHERE t.trip_short_name = ? AND r.route_type = 2 AND c.date = ?
        LIMIT 1`)
    : null;
  const trainTripCache = new Map<string, string | null>();

  /** De rit van een treinnummer op een dienstdag (YYYYMMDD). */
  function trainTrip(trainNumber: string, date: string): string | null {
    if (!tripByTrainNumber) return null;
    const key = `${date}|${trainNumber}`;
    if (trainTripCache.has(key)) return trainTripCache.get(key)!;
    const row = tripByTrainNumber.get(trainNumber, date) as { trip_id: string } | undefined;
    if (trainTripCache.size > 20_000) trainTripCache.clear();
    trainTripCache.set(key, row?.trip_id ?? null);
    return row?.trip_id ?? null;
  }

  return { db, lookup, tripRoute, lineRoutes, trainTrip, close: () => db.close() };
}
