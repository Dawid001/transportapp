import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { currentDbAgeHours, currentDbPath } from "./gtfs/paths.js";

/**
 * Houdt de dienstregeling actueel. OVapi publiceert elke nacht een nieuwe versie, en de ritnummers in
 * de live feeds passen alleen bij de nieuwste; met een oude versie missen steeds meer voertuigen hun lijn.
 *
 * - Elke nacht om 04:30, en bij het opstarten als de data ouder is dan een dag: `updateGtfs.ts` draaien
 *   in een apart proces (de import kost ~1,5 min rekenwerk; de API blijft zo gewoon reageren).
 * - Elke minuut kijken of er een nieuwe versie actueel is (ook na een handmatige `npm run gtfs:update`),
 *   en die dan via `onNewVersion` zonder herstart in gebruik nemen.
 */

const UPDATE_SCRIPT = fileURLToPath(new URL("./scripts/updateGtfs.ts", import.meta.url));
const UPDATE_HOUR = 4;
const UPDATE_MINUTE = 30;
const MAX_AGE_HOURS = 24;

export function startGtfsUpdater({ activePath, onNewVersion }: { activePath: () => string; onNewVersion: (path: string) => void }) {
  let running = false;
  let lastRunDay = "";

  function checkForNewVersion() {
    const current = currentDbPath();
    if (current !== activePath()) onNewVersion(current);
  }

  function runUpdate(reason: string) {
    if (running) return;
    running = true;
    console.log(`[GTFS] Dienstregeling bijwerken (${reason})…`);
    // Zelfde Node + loader (tsx) als de server, zodat het .ts-script direct draait.
    const child = spawn(process.execPath, [...process.execArgv, UPDATE_SCRIPT], { stdio: ["ignore", "pipe", "pipe"] });
    const log = (chunk: Buffer) => {
      for (const line of chunk.toString().split(/\r?\n/)) if (line.trim() && !line.includes("…")) console.log(`[GTFS] ${line}`);
    };
    child.stdout.on("data", log);
    child.stderr.on("data", log);
    child.on("exit", (code) => {
      running = false;
      console.log(`[GTFS] Bijwerken ${code === 0 ? "klaar" : `mislukt (code ${code})`}`);
      checkForNewVersion();
    });
  }

  setInterval(() => {
    checkForNewVersion();
    const now = new Date();
    const day = now.toDateString();
    if (now.getHours() === UPDATE_HOUR && now.getMinutes() >= UPDATE_MINUTE && lastRunDay !== day) {
      lastRunDay = day;
      runUpdate("nachtelijke update");
    }
  }, 60_000);

  if (currentDbAgeHours() > MAX_AGE_HOURS) {
    // Even wachten zodat het opstarten zelf niet vertraagt.
    setTimeout(() => runUpdate(`data is ${Math.round(currentDbAgeHours())} uur oud`), 20_000);
  }

  return { runNow: runUpdate };
}
