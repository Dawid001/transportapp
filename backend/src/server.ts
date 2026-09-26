import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import path from "node:path";
import { fetchVehicles, RateLimitError } from "./fetchVehicles.js";
import { openGtfs, type Mode } from "./gtfs/lookup.js";
import { DATA_DIR } from "./gtfs/paths.js";
import { createMotionEstimator } from "./motion.js";
import { startNsPoller } from "./nsPoller.js";
import { createAlerts } from "./alerts.js";
import { createDepartures } from "./departures.js";
import { trainLabel } from "./ns.js";
import { createNsRealtime } from "./nsRealtime.js";
import { createPlanner, type PlanPoint } from "./planner.js";
import { searchPlaces } from "./places.js";
import { createStopIndex, type StopGroup } from "./stopIndex.js";
import { tripStopTimes, vehicleDelay } from "./stopTimes.js";
import { createTimetable } from "./timetable.js";
import { fetchTripUpdates, type TripUpdateInfo } from "./tripUpdates.js";

// Geheime instellingen (NS_API_KEY) uit backend/.env.
try {
  process.loadEnvFile(new URL("../.env", import.meta.url));
} catch {
  // Geen .env: dan draait alles behalve de NS-treinen.
}

const PORT = Number(process.env.PORT) || 3001;
// OVapi staat ~2 requests per minuut toe (daarboven 429). Eén poller voor alle gebruikers samen,
// met ETag zodat een ongewijzigde feed alleen een lichte 304 kost. Om de 30 s wisselen we af tussen
// posities en verwachte tijden, dus elk één keer per minuut (OVapi ververst posities ook ~1× per minuut).
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
  /** Vertraging in seconden bij de huidige/volgende halte (uit tripUpdates; negatief = te vroeg). */
  delay?: number;
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

let tripUpdates: { updatedAt: number; etag?: string; updates: Map<string, TripUpdateInfo> } | null = null;

// Dienstregeling in het geheugen + haltezoeker (samen ~1,5 s bij het opstarten).
const timetable = createTimetable(gtfs.db);
const stopIndex = createStopIndex(gtfs.db, timetable);
const departures = createDepartures({
  db: gtfs.db,
  timetable,
  lookup: (tripId) => gtfs.lookup(tripId),
  tripUpdate: (tripId) => tripUpdates?.updates.get(tripId),
  liveTripIds: () => {
    const ids = new Set<string>();
    for (const v of cache?.vehicles ?? []) if (v.tripId) ids.add(v.tripId);
    for (const v of ns?.state?.vehicles ?? []) if (v.tripId) ids.add(v.tripId);
    return ids;
  },
});

const planner = createPlanner({
  db: gtfs.db,
  timetable,
  lookup: (tripId) => gtfs.lookup(tripId),
  lineLabel: (info, mode) => (mode === "train" ? trainLabel(info?.line, info?.line ?? "") : info?.line),
  tripShape: (tripId) => {
    const route = gtfs.tripRoute(tripId);
    return route && !route.approximate ? route.shape : null;
  },
  realtime: (tripId, date) => {
    const u = tripUpdates?.updates.get(tripId);
    if (!u || (u.startDate && u.startDate !== date)) return undefined;
    return {
      canceled: u.canceled,
      at: (sequence) => {
        const st = u.stops.get(sequence);
        if (!st || st.skipped) return undefined;
        return { dep: st.departureTime, arr: st.arrivalTime ?? st.departureTime };
      },
    };
  },
});

/**
 * Begin- of eindpunt van een reis uit de query: een halte (`fromStop=<id>`) of een punt
 * (`fromLat`, `fromLng`, optioneel `fromName`).
 */
function planPoint(params: URLSearchParams, prefix: "from" | "to"): PlanPoint | null {
  const stopId = params.get(`${prefix}Stop`);
  if (stopId) {
    const stop = stopIndex.byId(stopId);
    return stop ? { name: stop.name, lat: stop.lat, lng: stop.lng, stopIds: stop.stopIds } : null;
  }
  const lat = Number(params.get(`${prefix}Lat`));
  const lng = Number(params.get(`${prefix}Lng`));
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat === 0) return null;
  return { name: params.get(`${prefix}Name`) || "Gekozen locatie", lat, lng };
}

// Meldingen: OVapi (bus/tram/metro, via de poller hieronder) en NS-storingen (trein, eigen timer).
const alerts = createAlerts(ns ? nsKey : undefined);

// Realtime treintijden (vertraging, spoor, uitval) via de NS Reisinformatie API.
const nsRealtime = ns && nsKey ? createNsRealtime(nsKey, stopIndex) : null;

/** NS-realtime van een station voor het vertrekbord (leeg als het geen station is of NS uit staat). */
async function trainBoard(stopIds: string[], kind: "departures" | "arrivals") {
  const code = nsRealtime && stopIds.map((id) => nsRealtime.stationCode(id)).find(Boolean);
  return code ? nsRealtime[kind](code) : undefined;
}

/** Meldingen per reisdeel: op de in- en uitstaphalte, voor die lijn (en NS-storingen op die stations). */
function addLegAlerts(journeys: ReturnType<typeof planner.plan>) {
  for (const j of journeys) {
    for (const leg of j.legs) {
      if (leg.type !== "transit") continue;
      const stopIds = [leg.from.stopId, leg.to.stopId].filter((x): x is string => !!x);
      const routeId = gtfs.lookup(leg.tripId)?.routeId;
      const stationCodes = leg.mode === "train" && nsRealtime ? stopIds.map((id) => nsRealtime.stationCode(id)).filter((c): c is string => !!c) : undefined;
      const found = alerts.forStops(stopIds, {
        routeIds: routeId ? new Set([routeId]) : undefined,
        stationCodes,
        line: leg.line,
        allStations: true,
      });
      if (found.length) leg.alerts = found;
    }
  }
}

/** Treinstukken in reisadviezen aanvullen met NS-realtime: werkelijke tijden, spoor en uitval. */
async function enrichTrainLegs(journeys: ReturnType<typeof planner.plan>) {
  if (!nsRealtime) return;
  await Promise.all(
    journeys.flatMap((j) =>
      j.legs.map(async (leg) => {
        if (leg.type !== "transit" || leg.mode !== "train") return;
        const nr = gtfs.lookup(leg.tripId)?.shortName;
        if (!nr) return;
        const [deps, arrs] = await Promise.all([
          leg.from.stopId ? trainBoard([leg.from.stopId], "departures") : undefined,
          leg.to.stopId ? trainBoard([leg.to.stopId], "arrivals") : undefined,
        ]);
        const d = deps?.get(nr);
        if (d && Math.abs(d.planned - leg.departure) < 30 * 60) {
          leg.expectedDeparture = d.actual;
          if (d.actualTrack) leg.from.platform = d.actualTrack;
          if (d.cancelled) leg.canceled = true;
        }
        const a = arrs?.get(nr);
        if (a && Math.abs(a.planned - leg.arrival) < 30 * 60) {
          leg.expectedArrival = a.actual;
          if (a.actualTrack) leg.to.platform = a.actualTrack;
        }
      }),
    ),
  );
}

/** Halte zonder de lijst interne halte-ID's (die heeft de frontend niet nodig). */
const publicStop = ({ stopIds: _ids, ...stop }: StopGroup) => stop;

async function pollTripUpdates(): Promise<number> {
  try {
    const result = await fetchTripUpdates(tripUpdates?.etag);
    if (!result) {
      console.log(`[${time()}] Verwachte tijden ongewijzigd (304)`);
      return POLL_INTERVAL_MS;
    }
    tripUpdates = { updatedAt: Date.now(), etag: result.etag, updates: result.updates };
    console.log(`[${time()}] Verwachte tijden voor ${result.updates.size} ritten`);
    return POLL_INTERVAL_MS;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[${time()}] Verwachte tijden mislukt: ${message}`);
    return err instanceof RateLimitError ? BACKOFF_AFTER_429_MS : POLL_INTERVAL_MS;
  }
}

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

// Om en om: posities, verwachte tijden, posities, … Met posities uit de cache beginnen we met de
// verwachte tijden, zodat vertragingen na een herstart niet een minuut ontbreken.
let pollTick = cache ? 1 : 0;
async function pollLoop() {
  // Eens per 5 minuten (1 op de 10 rondes) meldingen i.p.v. verwachte tijden: die veranderen weinig.
  const tick = pollTick++;
  const delay = await (tick % 10 === 3 ? pollAlerts() : tick % 2 === 0 ? poll() : pollTripUpdates());
  setTimeout(pollLoop, delay);
}

async function pollAlerts(): Promise<number> {
  try {
    console.log(`[${time()}] ${await alerts.pollOvapi()}`);
  } catch (err) {
    console.error(`[${time()}] Meldingen mislukt: ${err instanceof Error ? err.message : err}`);
    if (err instanceof RateLimitError) return BACKOFF_AFTER_429_MS;
  }
  return POLL_INTERVAL_MS;
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

const server = createServer(async (req, res) => {
  try {
    await handle(req, res);
  } catch (err) {
    console.error("Fout bij", req.url, err);
    if (!res.headersSent) sendJson(res, 500, { error: "Interne fout" });
  }
});

async function handle(req: IncomingMessage, res: ServerResponse) {
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
    // Eén of meer ritten (komma-gescheiden): de voertuigen van een geplande reis.
    const trips = url.searchParams.get("trip")?.split(",").filter(Boolean);
    if (trips?.length) vehicles = vehicles.filter((v) => v.tripId && trips.includes(v.tripId));
    // Paden alleen op verzoek: op landelijk zoomniveau zie je de beweging niet en scheelt het veel data.
    const withPaths = url.searchParams.get("paths") === "1";
    const updates = tripUpdates?.updates;
    vehicles = vehicles.map(({ path, ...v }) => ({
      ...v,
      ...(withPaths && path ? { path } : {}),
      delay: v.tripId ? vehicleDelay(updates?.get(v.tripId), v.currentStopSequence, v.status) : undefined,
    }));

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

  // Geplande + verwachte tijden per halte; verandert elke minuut, dus niet cachen.
  const timesMatch = url.pathname.match(/^\/api\/trips\/([^/]+)\/times$/);
  if (timesMatch) {
    const tripId = decodeURIComponent(timesMatch[1]);
    const route = gtfs.tripRoute(tripId);
    if (!route) return sendJson(res, 404, { error: "Rit niet gevonden in de dienstregeling" });
    return sendJson(res, 200, {
      ...tripStopTimes(route, tripUpdates?.updates.get(tripId), Date.now() / 1000),
      updatedAt: tripUpdates?.updatedAt ?? null,
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

  // Zoeken op haltes (eigen dienstregeling) en plaatsen/adressen (PDOK).
  if (url.pathname === "/api/search") {
    const q = (url.searchParams.get("q") ?? "").trim();
    if (q.length < 2) return sendJson(res, 200, { stops: [], places: [] });
    const lat = Number(url.searchParams.get("lat"));
    const lng = Number(url.searchParams.get("lng"));
    const near = Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0 ? { lat, lng } : undefined;
    const stops = stopIndex.search(q, 6, near).map(publicStop);
    const places = await searchPlaces(q, 5).catch((err) => {
      console.error("PDOK zoeken mislukt:", err instanceof Error ? err.message : err);
      return [];
    });
    return sendJson(res, 200, { stops, places });
  }

  // Reisplanner: /api/plan?fromStop=… | fromLat&fromLng&fromName, idem to…, time=unix-seconden (optioneel).
  if (url.pathname === "/api/plan") {
    const from = planPoint(url.searchParams, "from");
    const to = planPoint(url.searchParams, "to");
    if (!from || !to) return sendJson(res, 400, { error: "Van en naar zijn verplicht (halte of coördinaten)" });
    const time = Number(url.searchParams.get("time"));
    const at = Number.isFinite(time) && time > 0 ? time : Math.floor(Date.now() / 1000);
    const journeys = planner.plan(from, to, at, 5);
    await enrichTrainLegs(journeys);
    addLegAlerts(journeys);
    return sendJson(res, 200, { from, to, time: at, journeys });
  }

  if (url.pathname === "/api/stops") {
    const bbox = parseBbox(url.searchParams.get("bbox"));
    if (!bbox || bbox === "invalid") return sendJson(res, 400, { error: "bbox is verplicht: minLng,minLat,maxLng,maxLat" });
    return sendJson(res, 200, { stops: stopIndex.inBbox(bbox).map(publicStop) }, 3600);
  }

  const stopMatch = url.pathname.match(/^\/api\/stops\/([^/]+)(\/departures)?$/);
  if (stopMatch) {
    const stop = stopIndex.byId(decodeURIComponent(stopMatch[1]));
    if (!stop) return sendJson(res, 404, { error: "Halte niet gevonden" });
    if (!stopMatch[2]) return sendJson(res, 200, publicStop(stop), 3600);
    const time = Number(url.searchParams.get("time"));
    const from = Number.isFinite(time) && time > 0 ? time : Math.floor(Date.now() / 1000);
    const list = departures.forStop(stop, from, { trains: stop.modes.includes("train") ? await trainBoard(stop.stopIds, "departures") : undefined });
    // Meldingen voor deze halte, alleen voor lijnen die hier (binnenkort) vertrekken of zonder lijn.
    const routeIds = new Set(list.map((d) => gtfs.lookup(d.tripId)?.routeId).filter((r): r is string => !!r));
    const stationCodes = nsRealtime ? stop.stopIds.map((id) => nsRealtime.stationCode(id)).filter((c): c is string => !!c) : undefined;
    return sendJson(res, 200, {
      stop: publicStop(stop),
      from,
      updatedAt: tripUpdates?.updatedAt ?? null,
      alerts: alerts.forStops(stop.stopIds, { routeIds, stationCodes: stationCodes?.slice(0, 1) }),
      departures: list,
    });
  }

  sendJson(res, 404, {
    error: "Niet gevonden",
    endpoints: [
      "/api/vehicles",
      "/api/search?q=",
      "/api/stops?bbox=",
      "/api/stops/:id",
      "/api/stops/:id/departures",
      "/api/plan?fromStop=|fromLat&fromLng&toStop=|toLat&toLng&time=",
      "/api/trips/:tripId",
      "/api/trips/:tripId/times",
      "/api/lines/:line",
      "/api/health",
    ],
  });
}

server.listen(PORT, () => {
  console.log(`API draait op http://localhost:${PORT}/api/vehicles`);
  setTimeout(() => planner.warm(), 0);
  if (cache) {
    // Met bewaarde data wachten tot die een poll-interval oud is, anders lopen snelle herstarts tegen de 429 aan.
    const wait = Math.max(0, POLL_INTERVAL_MS - (Date.now() - cache.updatedAt));
    console.log(`${cache.vehicles.length} voertuigen uit cache geladen; volgende poll over ${Math.round(wait / 1000)}s`);
    setTimeout(pollLoop, wait);
  } else {
    void pollLoop();
  }
});
