import { existsSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export const DATA_DIR = fileURLToPath(new URL("../../data/", import.meta.url));
export const GTFS_ZIP = path.join(DATA_DIR, "gtfs-nl.zip");
export const GTFS_ZIP_META = path.join(DATA_DIR, "gtfs-nl.meta.json");

/**
 * Elke import krijgt een eigen databasebestand (gtfs-20260928-0430.db); dit pointerbestand zegt welke
 * de actuele is. Zo hoeft nooit een geopend bestand vervangen te worden (kan niet op Windows), en kan
 * de server zonder herstart naar een nieuwe versie wisselen.
 */
export const GTFS_POINTER = path.join(DATA_DIR, "gtfs-current.txt");

/** Oude, vaste bestandsnamen van vóór de versies (nog ondersteund als er geen pointer is). */
export const GTFS_DB = path.join(DATA_DIR, "gtfs.db");
export const GTFS_DB_PENDING = `${GTFS_DB}.new`;

/** Pad van de actuele database. */
export function currentDbPath(): string {
  try {
    const name = readFileSync(GTFS_POINTER, "utf8").trim();
    const file = path.join(DATA_DIR, name);
    if (name && existsSync(file)) return file;
  } catch {
    // geen pointer: oude opzet
  }
  return GTFS_DB;
}

/** Nieuwe bestandsnaam voor een import, bv. gtfs-20260928-0430.db. */
export function newVersionName(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
  return `gtfs-${stamp}.db`;
}

/** Een versie actueel maken (atomisch: eerst een tijdelijk bestand, dan hernoemen). */
export function setCurrentDb(fileName: string) {
  const tmp = `${GTFS_POINTER}.tmp`;
  writeFileSync(tmp, fileName);
  renameSync(tmp, GTFS_POINTER);
}

/** Leeftijd van de actuele database in uren (op basis van het bestand). */
export function currentDbAgeHours(): number {
  try {
    return (Date.now() - statSync(currentDbPath()).mtimeMs) / 3_600_000;
  } catch {
    return Infinity;
  }
}

/** Oude databaseversies verwijderen. Bestanden die nog open staan (Windows) blijven staan tot de volgende keer. */
export function cleanupOldVersions(keep: string[]) {
  const keepNames = new Set(keep.map((p) => path.basename(p)));
  for (const name of readdirSync(DATA_DIR)) {
    const isVersion = /^gtfs(-\d{8}-\d{6})?\.db(\.new|\.tmp)?$/.test(name);
    if (!isVersion || keepNames.has(name)) continue;
    try {
      rmSync(path.join(DATA_DIR, name), { force: true });
      console.log(`Oude dienstregeling verwijderd: ${name}`);
    } catch {
      // nog in gebruik
    }
  }
}
