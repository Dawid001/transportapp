import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { createServer, type ServerResponse } from "node:http";
import path from "node:path";
import { fetchVehicles, RateLimitError } from "./fetchVehicles.js";
import { openGtfs, type Mode } from "./gtfs/lookup.js";
import { DATA_DIR } from "./gtfs/paths.js";
import { createMotionEstimator } from "./motion.js";
import { startNsPoller } from "./nsPoller.js";

// Geheime instellingen (NS_API_KEY) uit backend/.env.
try {
  process.loadEnvFile(new URL("../.env", import.meta.url));
} catch {
  // Geen .env: dan draait alles behalve de NS-treinen.
}

const PORT = Number(process.env.PORT) || 3001;
// OVapi staat ~2 requests per minuut toe (daarboven 429). Eén poller voor alle gebruikers samen,
// met ETag zodat een ongewijzigde feed alleen een lichte 304 kost.
const POLL_INTERVAL_MS = 30_000;
const BACKOFF_AFTER_429_MS = 60_000;

export type ApiVehicle = {
  id: string;
  operator: string;
  agencyName?: string;
  vehicleNumber?: string;
  mode: Mode;
  line?: string;
  headsign?: string;
  routeColor?: string;
  routeTextColor?: string;
  lat: number;
  lng: number;
  directionId?: number;
  status?: string;
  currentStopSequence?: number;
  stopId?: string;
  tripId?: string;
  routeId?: string;
  shapeId?: string;
  timestamp?: number;
  /** Geschatte snelheid over de route (m/s), alleen als het voertuig rijdt. */
  speed?: number;
  /** Route vóór het voertuig tot de volgende halte, beginnend op de positie van `timestamp`. */
  path?: [number, number][];
};

const gtfs = openGtfs();
const motion = createMotionEstimator(gtfs.tripRoute);

const nsKey = process.env.NS_API_KEY?.trim();
const ns = nsKey && !nsKey.startsWith("plak-hier") ? startNsPoller(gtfs, nsKey) : null;
if (!ns) console.log("Geen NS_API_KEY in backend/.env: NS-treinen staan uit.");

type Cache = { updatedAt: number; feedTimestamp: number; etag?: string; vehicles: ApiVehicle[] };

// Laatste feed op schijf bewaren: na een herstart (bv. door `tsx watch`) is er dan meteen data,
// ook als de eerste poll tegen de rate limit aanloopt.
const CACHE_FILE = path.join(DATA_DIR, "live-cache.json");
const MAX_CACHE_AGE_ON_START_MS = 5 * 60_000;

function loadCacheFromDisk(): Cache | null {
  try {
    const saved = JSON.parse(readFileSync(CACHE_FILE, "utf8")) as Cache;
    return Date.now() - saved.updatedAt < MAX_CACHE_AGE_ON_START_MS ? saved : null;
  } catch {
    return null;
  }
}

let cache: Cache | null = loadCacheFromDisk();
let etag: string | undefined = cache?.etag;
let lastError: string | null = null;

const time = () => new Date().toLocaleTimeString("nl-NL");

async function poll(): Promise<number> {
  try {
    const feed = await fetchVehicles(etag);
    if (!feed) {
      lastError = null;
      console.log(`[${time()}] Feed ongewijzigd (304)`);
      return POLL_INTERVAL_MS;
    }
    const { feedTimestamp, vehicles } = feed;
    const enriched = vehicles.map((v): ApiVehicle => {
      const info = gtfs.lookup(v.tripId, v.routeId);
      return {
        id: v.id,
        operator: v.operator,
        agencyName: info?.agencyName,
        vehicleNumber: v.label,
        mode: info?.mode ?? "other",
        line: info?.line,
        headsign: info?.headsign,
        routeColor: info?.routeColor,
        routeTextColor: info?.routeTextColor,
        lat: v.latitude,
        lng: v.longitude,
        directionId: info?.directionId,
        status: v.status,
        currentStopSequence: v.currentStopSequence,
        stopId: v.stopId,
        tripId: v.tripId,
        routeId: v.routeId,
        shapeId: info?.shapeId,
        timestamp: v.timestamp,
      };
    });
    const { motions, stats } = motion.update(enriched, Date.now() / 1000);
    for (const v of enriched) {
      const m = motions.get(v.id);
      if (m) {
        v.speed = m.speed;
        v.path = m.path;
      }
    }
    cache = { updatedAt: Date.now(), feedTimestamp, etag: feed.etag, vehicles: enriched };
    etag = feed.etag;
    writeFile(CACHE_FILE, JSON.stringify(cache)).catch((err) => console.error("Cache opslaan mislukt:", err));
    lastError = null;
    const unmatched = enriched.filter((v) => !v.line).length;
    console.log(`[${time()}] ${enriched.length} voertuigen (${unmatched} zonder lijninfo, ${motions.size} met voorspelde rit)`);
    if (process.env.DEBUG_MOTION) console.log("  beweging:", stats);
    return POLL_INTERVAL_MS;
  } catch (err) {
    lastError = err instanceof Error ? err.message : String(err);
    console.error(`[${time()}] Poll mislukt: ${lastError}`);
    return err instanceof RateLimitError ? BACKOFF_AFTER_429_MS : POLL_INTERVAL_MS;
  }
}

async function pollLoop() {
  const delay = await poll();
  setTimeout(pollLoop, delay);
}

/** bbox=minLng,minLat,maxLng,maxLat (zelfde volgorde als MapLibre's getBounds().toArray().flat()) */
function parseBbox(value: string | null): [number, number, number, number] | null | "invalid" {
  if (!value) return null;
  const parts = value.split(",").map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return "invalid";
  return parts as [number, number, number, number];
}

function sendJson(res: ServerResponse, status: number, body: unknown, cacheSeconds = 0) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    // Frontend draait tijdens development op een andere poort.
    "Access-Control-Allow-Origin": "*",
    // Routes veranderen maar één keer per dag; live posities nooit cachen.
    "Cache-Control": cacheSeconds ? `public, max-age=${cacheSeconds}` : "no-store",
  });
  res.end(JSON.stringify(body));
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  if (req.method !== "GET") return sendJson(res, 405, { error: "Alleen GET" });

  if (url.pathname === "/api/health") {
    return sendJson(res, cache ? 200 : 503, {
      ok: !!cache,
      updatedAt: cache?.updatedAt ?? null,
      vehicles: cache?.vehicles.length ?? 0,
      lastError,
      ns: ns
        ? { trains: ns.state?.vehicles.length ?? 0, unmatched: ns.state?.unmatched ?? 0, updatedAt: ns.state?.updatedAt ?? null, lastError: ns.lastError }
        : "uit (geen NS_API_KEY)",
    });
  }

  if (url.pathname === "/api/vehicles") {
    if (!cache) return sendJson(res, 503, { error: "Nog geen data, probeer het zo opnieuw", lastError });

    const bbox = parseBbox(url.searchParams.get("bbox"));
    if (bbox === "invalid") return sendJson(res, 400, { error: "bbox moet zijn: minLng,minLat,maxLng,maxLat" });
    const line = url.searchParams.get("line");
    const mode = url.searchParams.get("mode");

    const nsState = ns?.state;
    let vehicles = nsState ? [...cache.vehicles, ...nsState.vehicles] : cache.vehicles;
    if (bbox) {
      const [minLng, minLat, maxLng, maxLat] = bbox;
      vehicles = vehicles.filter((v) => v.lng >= minLng && v.lng <= maxLng && v.lat >= minLat && v.lat <= maxLat);
    }
    if (line) vehicles = vehicles.filter((v) => v.line?.toLowerCase() === line.toLowerCase());
    if (mode) vehicles = vehicles.filter((v) => v.mode === mode);
    // Paden alleen op verzoek: op landelijk zoomniveau zie je de beweging niet en scheelt het veel data.
    if (url.searchParams.get("paths") !== "1") vehicles = vehicles.map(({ path: _path, ...v }) => v);

    return sendJson(res, 200, {
      // Nieuwste van beide bronnen, zodat de frontend ook NS-updates oppikt als OVapi niet veranderde.
      updatedAt: Math.max(cache.updatedAt, nsState?.updatedAt ?? 0),
      // Zodat de frontend zijn klok gelijk kan zetten voor het extrapoleren.
      serverTime: Date.now(),
      feedTimestamp: cache.feedTimestamp,
      count: vehicles.length,
      vehicles,
    });
  }

  const tripMatch = url.pathname.match(/^\/api\/trips\/([^/]+)$/);
  if (tripMatch) {
    const route = gtfs.tripRoute(decodeURIComponent(tripMatch[1]));
    if (!route) return sendJson(res, 404, { error: "Rit niet gevonden in de dienstregeling" });
    return sendJson(res, 200, route, 600);
  }

  const lineMatch = url.pathname.match(/^\/api\/lines\/([^/]+)$/);
  if (lineMatch) {
    const line = decodeURIComponent(lineMatch[1]);
    return sendJson(res, 200, { line, variants: gtfs.lineRoutes(line) }, 600);
  }

  sendJson(res, 404, {
    error: "Niet gevonden",
    endpoints: ["/api/vehicles", "/api/trips/:tripId", "/api/lines/:line", "/api/health"],
  });
});

server.listen(PORT, () => {
  console.log(`API draait op http://localhost:${PORT}/api/vehicles`);
  if (cache) {
    // Met bewaarde data wachten tot die een poll-interval oud is, anders lopen snelle herstarts tegen de 429 aan.
    const wait = Math.max(0, POLL_INTERVAL_MS - (Date.now() - cache.updatedAt));
    console.log(`${cache.vehicles.length} voertuigen uit cache geladen; volgende poll over ${Math.round(wait / 1000)}s`);
    setTimeout(pollLoop, wait);
  } else {
    void pollLoop();
  }
});
