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
  CREATE TABLE trip_patterns (trip_id TEXT PRIMARY KEY, pattern_id INTEGER NOT NULL) WITHOUT ROWID;
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

/**
 * stop_times.txt (21 miljoen rijen) → unieke haltepatronen. De meeste ritten van een lijn doen precies
 * dezelfde haltes aan, dus we slaan elk patroon één keer op en koppelen ritten daaraan.
 * Tijden laten we (nog) weg; die zijn pas nodig voor ETA's.
 */
export async function importStopPatterns(db: DatabaseSync, stream: Readable): Promise<{ trips: number; patterns: number }> {
  const insertPattern = db.prepare("INSERT INTO patterns (pattern_id, stops) VALUES (?, ?)");
  const insertTrip = db.prepare("INSERT INTO trip_patterns (trip_id, pattern_id) VALUES (?, ?)");
  const patternIds = new Map<string, number>();
  let currentTrip: string | null = null;
  let stops: [seq: number, stopId: string][] = [];
  let trips = 0;

  const flush = () => {
    if (!currentTrip) return;
    stops.sort((a, b) => a[0] - b[0]);
    const key = JSON.stringify(stops);
    let patternId = patternIds.get(key);
    if (patternId === undefined) {
      patternId = patternIds.size + 1;
      patternIds.set(key, patternId);
      insertPattern.run(patternId, key);
    }
    insertTrip.run(currentTrip, patternId);
    if (++trips % 250_000 === 0) console.log(`  stop_times: ${trips.toLocaleString("nl-NL")} ritten…`);
  };

  db.exec("BEGIN");
  for await (const [tripId, seq, stopId] of readCsv(stream, ["trip_id", "stop_sequence", "stop_id"])) {
    if (tripId !== currentTrip) {
      flush();
      currentTrip = tripId;
      stops = [];
    }
    stops.push([Number(seq), stopId]);
  }
  flush();
  db.exec("COMMIT");
  return { trips, patterns: patternIds.size };
}
