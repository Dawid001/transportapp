import type { DatabaseSync } from "node:sqlite";
import type { Readable } from "node:stream";
import { parse } from "csv-parse";

/** Leest een CSV als arrays (sneller dan objecten) en geeft per rij een getter op kolomnaam. */
async function* readCsv(stream: Readable, columns: string[]): AsyncGenerator<string[]> {
  let indexes: number[] | null = null;
  for await (const row of stream.pipe(parse({ bom: true, relax_column_count: true })) as AsyncIterable<string[]>) {
    if (!indexes) {
      indexes = columns.map((c) => {
        const i = row.indexOf(c);
        if (i === -1) throw new Error(`Kolom ${c} ontbreekt`);
        return i;
      });
      continue;
    }
    yield indexes.map((i) => row[i]);
  }
}

export const ROUTE_TABLES_SQL = `
  CREATE TABLE shapes (shape_id TEXT PRIMARY KEY, coords BLOB NOT NULL) WITHOUT ROWID;
  CREATE TABLE patterns (pattern_id INTEGER PRIMARY KEY, stops TEXT NOT NULL);
  CREATE TABLE time_profiles (profile_id INTEGER PRIMARY KEY, offsets TEXT NOT NULL);
  CREATE TABLE trip_patterns (
    trip_id TEXT PRIMARY KEY,
    pattern_id INTEGER NOT NULL,
    start_sec INTEGER,
    profile_id INTEGER
  ) WITHOUT ROWID;
`;

/**
 * shapes.txt → één rij per shape met de punten als Float32Array [lng, lat, lng, lat, …].
 * 8+ miljoen punten worden zo ~67 MB in plaats van ~300 MB tekst; float32 is nauwkeurig tot <0,5 m.
 * Het bestand is gegroepeerd per shape_id, dus we hoeven maar één shape tegelijk in het geheugen te houden.
 */
export async function importShapes(db: DatabaseSync, stream: Readable): Promise<number> {
  const insert = db.prepare("INSERT INTO shapes (shape_id, coords) VALUES (?, ?)");
  let currentId: string | null = null;
  let points: [seq: number, lng: number, lat: number][] = [];
  let count = 0;

  const flush = () => {
    if (!currentId) return;
    points.sort((a, b) => a[0] - b[0]);
    const coords = new Float32Array(points.length * 2);
    points.forEach(([, lng, lat], i) => {
      coords[i * 2] = lng;
      coords[i * 2 + 1] = lat;
    });
    insert.run(currentId, new Uint8Array(coords.buffer));
    count++;
  };

  db.exec("BEGIN");
  for await (const [id, seq, lat, lng] of readCsv(stream, ["shape_id", "shape_pt_sequence", "shape_pt_lat", "shape_pt_lon"])) {
    if (id !== currentId) {
      flush();
      currentId = id;
      points = [];
    }
    points.push([Number(seq), Number(lng), Number(lat)]);
  }
  flush();
  db.exec("COMMIT");
  return count;
}

/** "HH:MM:SS" → seconden sinds het begin van de dienstdag (uren kunnen ≥ 24 zijn). */
function parseGtfsTime(value: string): number | null {
  if (!value) return null;
  const [h, m, sec] = value.split(":").map(Number);
  return Number.isFinite(h) ? h * 3600 + m * 60 + (sec || 0) : null;
}

/** Lege tijden (haltes zonder tijdpunt) lineair invullen tussen de omliggende bekende tijden. */
function fillGaps(times: (number | null)[]): number[] {
  const out = [...times];
  for (let i = 0; i < out.length; i++) {
    if (out[i] !== null) continue;
    const prev = i - 1;
    let next = i + 1;
    while (next < out.length && out[next] === null) next++;
    const a = prev >= 0 ? out[prev] : null;
    const b = next < out.length ? out[next] : null;
    out[i] = a !== null && b !== null ? Math.round(a + ((b - a) * (i - prev)) / (next - prev)) : (a ?? b ?? 0);
  }
  return out as number[];
}

/**
 * stop_times.txt (21 miljoen rijen) → unieke haltepatronen + unieke tijdprofielen.
 * De meeste ritten van een lijn doen dezelfde haltes aan met dezelfde rijtijden; alleen de vertrektijd
 * verschilt. Per rit slaan we daarom alleen de starttijd op, plus een verwijzing naar een patroon
 * (welke haltes) en een tijdprofiel (aankomst/vertrek per halte, in seconden na de start).
 */
export async function importStopPatterns(
  db: DatabaseSync,
  stream: Readable,
): Promise<{ trips: number; patterns: number; profiles: number }> {
  const insertPattern = db.prepare("INSERT INTO patterns (pattern_id, stops) VALUES (?, ?)");
  const insertProfile = db.prepare("INSERT INTO time_profiles (profile_id, offsets) VALUES (?, ?)");
  const insertTrip = db.prepare("INSERT INTO trip_patterns (trip_id, pattern_id, start_sec, profile_id) VALUES (?, ?, ?, ?)");
  const patternIds = new Map<string, number>();
  const profileIds = new Map<string, number>();
  let currentTrip: string | null = null;
  let stops: [seq: number, stopId: string, arr: number | null, dep: number | null][] = [];
  let trips = 0;

  const flush = () => {
    if (!currentTrip) return;
    stops.sort((a, b) => a[0] - b[0]);

    const key = JSON.stringify(stops.map(([seq, stopId]) => [seq, stopId]));
    let patternId = patternIds.get(key);
    if (patternId === undefined) {
      patternId = patternIds.size + 1;
      patternIds.set(key, patternId);
      insertPattern.run(patternId, key);
    }

    const arr = fillGaps(stops.map((s) => s[2] ?? s[3]));
    const dep = fillGaps(stops.map((s) => s[3] ?? s[2]));
    const start = dep[0] ?? arr[0];
    // Per halte één getal (aankomst = vertrek) of [aankomst, vertrek], in seconden na de start.
    const offsets = arr.map((a, i) => (a === dep[i] ? a - start : [a - start, dep[i] - start]));
    const profileKey = JSON.stringify(offsets);
    let profileId = profileIds.get(profileKey);
    if (profileId === undefined) {
      profileId = profileIds.size + 1;
      profileIds.set(profileKey, profileId);
      insertProfile.run(profileId, profileKey);
    }

    insertTrip.run(currentTrip, patternId, start, profileId);
    if (++trips % 250_000 === 0) console.log(`  stop_times: ${trips.toLocaleString("nl-NL")} ritten…`);
  };

  db.exec("BEGIN");
  for await (const [tripId, seq, stopId, arrival, departure] of readCsv(stream, [
    "trip_id",
    "stop_sequence",
    "stop_id",
    "arrival_time",
    "departure_time",
  ])) {
    if (tripId !== currentTrip) {
      flush();
      currentTrip = tripId;
      stops = [];
    }
    stops.push([Number(seq), stopId, parseGtfsTime(arrival), parseGtfsTime(departure)]);
  }
  flush();
  db.exec("COMMIT");
  return { trips, patterns: patternIds.size, profiles: profileIds.size };
}
