import { existsSync } from "node:fs";
import { downloadGtfs } from "../gtfs/download.js";
import { importGtfs } from "../gtfs/import.js";
import { currentDbPath } from "../gtfs/paths.js";

// Gebruik: npm run gtfs:update           → downloaden als er een nieuwe versie is, dan importeren
//          npm run gtfs:update -- --force → altijd opnieuw importeren
// Een draaiende backend pakt de nieuwe versie binnen een minuut zelf op (geen herstart nodig).
// De backend start dit script ook zelf, elke nacht om 04:30 (zie gtfsUpdater.ts).
const force = process.argv.includes("--force");

try {
  const downloaded = await downloadGtfs();
  if (downloaded || force || !existsSync(currentDbPath())) {
    await importGtfs();
  } else {
    console.log("Database is al up-to-date, niets te doen.");
  }
} catch (err) {
  console.error(err);
  process.exit(1);
}
