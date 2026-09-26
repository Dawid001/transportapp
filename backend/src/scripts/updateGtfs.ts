import { existsSync } from "node:fs";
import { downloadGtfs } from "../gtfs/download.js";
import { importGtfs } from "../gtfs/import.js";
import { GTFS_DB } from "../gtfs/paths.js";

// Gebruik: npm run gtfs:update           → downloaden als er een nieuwe versie is, dan importeren
//          npm run gtfs:update -- --force → altijd opnieuw importeren
const force = process.argv.includes("--force");

try {
  const downloaded = await downloadGtfs();
  if (downloaded || force || !existsSync(GTFS_DB)) {
    await importGtfs();
  } else {
    console.log("Database is al up-to-date, niets te doen.");
  }
} catch (err) {
  console.error(err);
  process.exit(1);
}
