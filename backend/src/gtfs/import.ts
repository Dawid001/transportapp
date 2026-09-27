import { existsSync, rmSync, renameSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import type { Readable } from "node:stream";
import { parse } from "csv-parse";
import yauzl from "yauzl";
import { importShapes, importStopPatterns, ROUTE_TABLES_SQL } from "./importRoutes.js";
import { DATA_DIR, GTFS_ZIP, newVersionName, setCurrentDb } from "./paths.js";
import path from "node:path";

// Welke bestanden en kolommen we 1-op-1 uit de GTFS-zip halen. shapes.txt en stop_times.txt
// hebben een eigen, compactere import (zie importRoutes.ts).
const TABLES: Record<string, { file: string; columns: string[]; primaryKey: string }> = {
  agency: { file: "agency.txt", columns: ["agency_id", "agency_name", "agency_url"], primaryKey: "agency_id" },
  routes: {
    file: "routes.txt",
    columns: ["route_id", "agency_id", "route_short_name", "route_long_name", "route_type", "route_color", "route_text_color"],
    primaryKey: "route_id",
  },
  trips: {
    file: "trips.txt",
    columns: ["trip_id", "route_id", "service_id", "realtime_trip_id", "trip_headsign", "trip_short_name", "direction_id", "shape_id"],
    primaryKey: "trip_id",
  },
  stops: {
    file: "stops.txt",
    columns: ["stop_id", "stop_code", "stop_name", "stop_lat", "stop_lon", "location_type", "parent_station", "platform_code"],
    primaryKey: "stop_id",
  },
  // Op welke dagen een service_id rijdt. De OVapi-GTFS heeft geen calendar.txt, alleen calendar_dates.
  // Nodig om een treinnummer (NS) aan de rit van vandaag te koppelen.
  calendar_dates: {
    file: "calendar_dates.txt",
    columns: ["service_id", "date", "exception_type"],
    primaryKey: "",
  },
};

const INTEGER_COLUMNS = new Set(["route_type", "direction_id", "location_type", "exception_type"]);
const REAL_COLUMNS = new Set(["stop_lat", "stop_lon"]);

function columnType(column: string): string {
  if (INTEGER_COLUMNS.has(column)) return "INTEGER";
  if (REAL_COLUMNS.has(column)) return "REAL";
  return "TEXT";
}

function openZipEntries(zipPath: string, wanted: Set<string>, onEntry: (fileName: string, stream: Readable) => Promise<void>): Promise<void> {
  return new Promise((resolve, reject) => {
    yauzl.open(zipPath, { lazyEntries: true }, (err, zip) => {
      if (err) return reject(err);
      zip.on("error", reject);
      zip.on("end", resolve);
      zip.on("entry", (entry: yauzl.Entry) => {
        if (!wanted.has(entry.fileName)) return zip.readEntry();
        zip.openReadStream(entry, (err, stream) => {
          if (err) return reject(err);
          onEntry(entry.fileName, stream).then(() => zip.readEntry(), reject);
        });
      });
      zip.readEntry();
    });
  });
}

async function importTable(db: DatabaseSync, table: string, stream: Readable): Promise<number> {
  const { columns } = TABLES[table];
  const insert = db.prepare(`INSERT OR REPLACE INTO ${table} (${columns.join(",")}) VALUES (${columns.map(() => "?").join(",")})`);

  let count = 0;
  db.exec("BEGIN");
  try {
    for await (const row of stream.pipe(parse({ columns: true, bom: true, relax_column_count: true }))) {
      const values = columns.map((c) => {
        const value: string | undefined = row[c];
        if (value === undefined || value === "") return null;
        if (INTEGER_COLUMNS.has(c)) return Number.parseInt(value, 10);
        if (REAL_COLUMNS.has(c)) return Number.parseFloat(value);
        return value;
      });
      insert.run(...values);
      if (++count % 200_000 === 0) console.log(`  ${table}: ${count.toLocaleString("nl-NL")} rijen…`);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return count;
}

/**
 * Bouwt een nieuwe databaseversie op uit de GTFS-zip (data/gtfs-<datum-tijd>.db) en maakt die actueel.
 * Een draaiende server wisselt daar zelf naartoe (zie gtfsUpdater.ts); de oude versie blijft tot dan bruikbaar.
 */
export async function importGtfs(): Promise<string> {
  if (!existsSync(GTFS_ZIP)) throw new Error(`Geen GTFS-zip gevonden op ${GTFS_ZIP}. Draai eerst de download.`);

  const name = newVersionName();
  const finalPath = path.join(DATA_DIR, name);
  const tmpPath = `${finalPath}.tmp`;
  rmSync(tmpPath, { force: true });
  const db = new DatabaseSync(tmpPath);
  db.exec("PRAGMA journal_mode = OFF; PRAGMA synchronous = OFF;");

  for (const [table, { columns, primaryKey }] of Object.entries(TABLES)) {
    const defs = columns.map((c) => `${c} ${columnType(c)}${c === primaryKey ? " PRIMARY KEY" : ""}`);
    db.exec(`CREATE TABLE ${table} (${defs.join(", ")})`);
  }

  db.exec(ROUTE_TABLES_SQL);

  const tableByFile = new Map(Object.entries(TABLES).map(([table, { file }]) => [file, table]));
  const wanted = new Set([...tableByFile.keys(), "shapes.txt", "stop_times.txt"]);
  const started = Date.now();
  await openZipEntries(GTFS_ZIP, wanted, async (fileName, stream) => {
    if (fileName === "shapes.txt") {
      console.log(`shapes: ${(await importShapes(db, stream)).toLocaleString("nl-NL")} routes`);
    } else if (fileName === "stop_times.txt") {
      const { trips, patterns, profiles } = await importStopPatterns(db, stream);
      console.log(`stop_times: ${trips.toLocaleString("nl-NL")} ritten → ${patterns.toLocaleString("nl-NL")} haltepatronen, ${profiles.toLocaleString("nl-NL")} tijdprofielen`);
    } else {
      const table = tableByFile.get(fileName)!;
      const count = await importTable(db, table, stream);
      console.log(`${table}: ${count.toLocaleString("nl-NL")} rijen`);
    }
  });

  db.exec("CREATE INDEX trips_route_id ON trips (route_id)");
  db.exec("CREATE INDEX trips_realtime_trip_id ON trips (realtime_trip_id)");
  db.exec("CREATE INDEX trips_short_name ON trips (trip_short_name)");
  db.exec("CREATE INDEX calendar_dates_date ON calendar_dates (date, service_id)");
  db.exec("ANALYZE");
  db.close();

  renameSync(tmpPath, finalPath);
  setCurrentDb(name);
  console.log(`GTFS-import klaar in ${((Date.now() - started) / 1000).toFixed(0)}s → ${name}`);
  return finalPath;
}
