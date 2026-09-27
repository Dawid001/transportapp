import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import path from "node:path";
import { createBearingTracker } from "./bearing.js";
import { fetchVehicles, RateLimitError } from "./fetchVehicles.js";
import type { Mode } from "./gtfs/lookup.js";
import { cleanupOldVersions, currentDbPath, DATA_DIR } from "./gtfs/paths.js";
import { startNsPoller } from "./nsPoller.js";
import { createAlerts } from "./alerts.js";
import { buildContext, type AppContext } from "./context.js";
import { startGtfsUpdater } from "./gtfsUpdater.js";
import { createJourneyWatcher, type WatchLeg } from "./journeyWatch.js";
import { cleanJourney, createShareStore } from "./shares.js";
import { createNsRealtime, type Crowd, type TrainRun } from "./nsRealtime.js";
import type { Journey, PlanPoint, TransitLeg } from "./planner.js";
import { searchPlaces } from "./places.js";
import type { StopGroup } from "./stopIndex.js";
import { tripStopTimes, vehicleDelay } from "./stopTimes.js";
import { fetchTripUpdates, type TripUpdateInfo } from "./tripUpdates.js";

// Geheime instellingen (NS_API_KEY) uit backend/.env.
try {
  process.loadEnvFile(new URL("../.env", import.meta.url));
} catch {
  // Geen .env: dan draait alles behalve de NS-treinen.
}

// Eigen variabele: PORT is meestal voor de frontend bedoeld (bv. als beide via één commando starten).
const PORT = Number(process.env.BACKEND_PORT) || 3001;
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
  /** Rijrichting in graden (0 = noord), als bekend. */
  bearing?: number;
};

const nsKey = process.env.NS_API_KEY?.trim();
// De poller vraagt de dienstregeling telkens via ctx op, zodat hij een wissel naar een nieuwe versie volgt.
const ns = nsKey && !nsKey.startsWith("plak-hier") ? startNsPoller(() => ctx.gtfs, nsKey) : null;
if (!ns) console.log("Geen NS_API_KEY in backend/.env: NS-treinen staan uit.");

const busBearing = createBearingTracker();

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

// Alles wat uit de dienstregeling komt (in het geheugen, haltezoeker, vertrektijden, planner) zit in één
// context, die bij een nieuwe versie in zijn geheel wordt vervangen (zie swapTo en gtfsUpdater.ts).
const live = {
  tripUpdate: (tripId: string) => tripUpdates?.updates.get(tripId),
  liveTripIds: () => {
    const ids = new Set<string>();
    for (const v of cache?.vehicles ?? []) if (v.tripId) ids.add(v.tripId);
    for (const v of ns?.state?.vehicles ?? []) if (v.tripId) ids.add(v.tripId);
    return ids;
  },
};
let ctx: AppContext = buildContext(currentDbPath(), live);

/** Overstappen op een nieuwe versie van de dienstregeling, zonder herstart. */
function swapTo(dbPath: string) {
  try {
    const next = buildContext(dbPath, live);
    next.planner.warm();
    const old = ctx;
    ctx = next;
    nsRealtime?.relink(next.stopIndex);
    console.log(`[GTFS] Nieuwe dienstregeling in gebruik: ${dbPath.split(/[\\/]/).pop()}`);
    // Lopende verzoeken op de oude versie eerst laten afronden, dan sluiten en opruimen.
    setTimeout(() => {
      old.close();
      cleanupOldVersions([next.dbPath]);
    }, 60_000);
  } catch (err) {
    console.error("[GTFS] Nieuwe dienstregeling laden mislukt, de oude blijft in gebruik:", err);
  }
}

/**
 * Begin- of eindpunt van een reis uit de query: een halte (`fromStop=<id>`) of een punt
 * (`fromLat`, `fromLng`, optioneel `fromName`).
 */
function planPoint(params: URLSearchParams, prefix: "from" | "to"): PlanPoint | null {
  const stopId = params.get(`${prefix}Stop`);
  if (stopId) {
    const stop = ctx.stopIndex.byId(stopId);
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
const nsRealtime = ns && nsKey ? createNsRealtime(nsKey, ctx.stopIndex) : null;

/** NS-realtime van een station voor het vertrekbord (leeg als het geen station is of NS uit staat). */
async function trainBoard(stopIds: string[], kind: "departures" | "arrivals") {
  const code = nsRealtime && stopIds.map((id) => nsRealtime.stationCode(id)).find(Boolean);
  return code ? nsRealtime[kind](code) : undefined;
}

/** Meldingen per reisdeel: op de in- en uitstaphalte, voor die lijn (en NS-storingen op die stations). */
function addLegAlerts(journeys: Journey[]) {
  for (const j of journeys) {
    for (const leg of j.legs) {
      if (leg.type !== "transit") continue;
      const stopIds = [leg.from.stopId, leg.to.stopId].filter((x): x is string => !!x);
      const routeId = ctx.gtfs.lookup(leg.tripId)?.routeId;
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
const CROWD_RANK: Record<Crowd, number> = { LOW: 1, MEDIUM: 2, HIGH: 3 };

/** Drukte van het drukste stuk tussen in- en uitstappen. */
function addCrowd(leg: TransitLeg, run: TrainRun) {
  const fromCode = leg.from.stopId ? nsRealtime?.stationCode(leg.from.stopId) : undefined;
  const toCode = leg.to.stopId ? nsRealtime?.stationCode(leg.to.stopId) : undefined;
  const start = run.stops.findIndex((s) => s.code === fromCode);
  if (start < 0) return;
  const endAt = run.stops.findIndex((s, i) => i > start && s.code === toCode);
  const part = run.stops.slice(start, endAt > start ? endAt : undefined);
  for (const s of part) if (s.crowd && (!leg.crowd || CROWD_RANK[s.crowd] > CROWD_RANK[leg.crowd])) leg.crowd = s.crowd;
}

async function enrichTrainLegs(journeys: Journey[]) {
  if (!nsRealtime) return;
  await Promise.all(
    journeys.flatMap((j) =>
      j.legs.map(async (leg) => {
        if (leg.type !== "transit" || leg.mode !== "train") return;
        const nr = ctx.gtfs.lookup(leg.tripId)?.shortName;
        if (!nr) return;
        const [deps, arrs, run] = await Promise.all([
          leg.from.stopId ? trainBoard([leg.from.stopId], "departures") : undefined,
          leg.to.stopId ? trainBoard([leg.to.stopId], "arrivals") : undefined,
          nsRealtime!.run(nr, leg.departure),
        ]);
        if (run) addCrowd(leg, run);
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

// "Houd me op de hoogte": gevolgde reizen + pushmeldingen. Realtime per reisdeel: NS voor treinen,
// anders de verwachte tijden van OVapi (met doorgeschoven vertraging als een halte geen update heeft).
const shares = createShareStore();

const watcher = createJourneyWatcher(async (leg) => {
  if (leg.mode === "train") {
    const nr = ctx.gtfs.lookup(leg.tripId)?.shortName;
    if (!nr) return undefined;
    const [deps, arrs] = await Promise.all([
      leg.fromStopId ? trainBoard([leg.fromStopId], "departures") : undefined,
      leg.toStopId ? trainBoard([leg.toStopId], "arrivals") : undefined,
    ]);
    const d = deps?.get(nr);
    const a = arrs?.get(nr);
    return { departure: d?.actual, arrival: a?.actual, canceled: d?.cancelled };
  }
  const route = ctx.gtfs.tripRoute(leg.tripId);
  const update = tripUpdates?.updates.get(leg.tripId);
  if (!route || !update) return undefined;
  const times = tripStopTimes(route, update, Date.now() / 1000);
  const from = times.stops.find((s) => s.sequence === leg.fromSequence);
  const to = times.stops.find((s) => s.sequence === leg.toSequence);
  return {
    departure: from?.expectedDeparture ?? from?.expectedArrival,
    arrival: to?.expectedArrival ?? to?.expectedDeparture,
    canceled: times.canceled || from?.skipped,
  };
});

/** JSON-body van een POST lezen (max 64 KB). */
async function readJson(req: IncomingMessage, maxBytes = 64 * 1024): Promise<unknown> {
  let size = 0;
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > maxBytes) throw new Error("Body te groot");
    chunks.push(chunk as Buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

type PushSub = { endpoint: string; keys: { p256dh: string; auth: string } };
const isSubscription = (x: unknown): x is PushSub =>
  !!x && typeof (x as PushSub).endpoint === "string" && /^https:\/\//.test((x as PushSub).endpoint) && !!(x as PushSub).keys?.p256dh && !!(x as PushSub).keys?.auth;

/** Endpoints voor meldingen (niet-GET). Geeft true als het verzoek is afgehandeld. */
async function handlePush(req: IncomingMessage, res: ServerResponse, url: URL): Promise<boolean> {
  if (url.pathname === "/api/push/key" && req.method === "GET") {
    sendJson(res, 200, { publicKey: watcher.publicKey });
    return true;
  }
  if (url.pathname === "/api/push/test" && req.method === "POST") {
    const body = (await readJson(req)) as { subscription?: unknown };
    if (!isSubscription(body.subscription)) return sendJson(res, 400, { error: "Ongeldig abonnement" }), true;
    await watcher.test(body.subscription);
    sendJson(res, 200, { ok: true });
    return true;
  }
  if (url.pathname === "/api/watch" && req.method === "POST") {
    const body = (await readJson(req)) as { subscription?: unknown; legs?: unknown };
    if (!isSubscription(body.subscription) || !Array.isArray(body.legs) || body.legs.length === 0 || body.legs.length > 12) {
      sendJson(res, 400, { error: "Abonnement en reisdelen zijn verplicht" });
      return true;
    }
    sendJson(res, 200, { id: watcher.watch(body.subscription, body.legs as WatchLeg[]) });
    return true;
  }
  const del = url.pathname.match(/^\/api\/watch\/([\w-]+)$/);
  if (del && req.method === "DELETE") {
    watcher.unwatch(del[1]);
    sendJson(res, 200, { ok: true });
    return true;
  }
  return false;
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
      const info = ctx.gtfs.lookup(v.tripId, v.routeId);
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
    const { motions, stats } = ctx.motion.update(enriched, Date.now() / 1000);
    const feedBearing = new Map(vehicles.map((v) => [v.id, v.bearing]));
    for (const v of enriched) {
      const m = motions.get(v.id);
      if (m) {
        v.speed = m.speed;
        v.path = m.path;
      }
      v.bearing = busBearing(v.id, v.lat, v.lng, { path: v.path, hint: feedBearing.get(v.id) });
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

  if (url.pathname.startsWith("/api/push/") || url.pathname.startsWith("/api/watch")) {
    if (await handlePush(req, res, url)) return;
  }
  // Reis delen: de reis bewaren onder een willekeurige code, voor een link als /?reis=<code>.
  if (url.pathname === "/api/share" && req.method === "POST") {
    const journey = cleanJourney(await readJson(req, 1024 * 1024).catch(() => null));
    if (!journey) return sendJson(res, 400, { error: "Ongeldige reis" });
    if (journey.arrival < Date.now() / 1000) return sendJson(res, 400, { error: "Deze reis is al voorbij" });
    return sendJson(res, 200, { id: shares.create(journey) });
  }
  if (req.method !== "GET") return sendJson(res, 405, { error: "Alleen GET" });

  if (url.pathname === "/api/health") {
    return sendJson(res, cache ? 200 : 503, {
      ok: !!cache,
      // Welke versie van de dienstregeling in gebruik is (wisselt zonder herstart, zie gtfsUpdater.ts).
      gtfs: path.basename(ctx.dbPath),
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
    const route = ctx.gtfs.tripRoute(tripId);
    if (!route) return sendJson(res, 404, { error: "Rit niet gevonden in de dienstregeling" });
    return sendJson(res, 200, {
      ...tripStopTimes(route, tripUpdates?.updates.get(tripId), Date.now() / 1000),
      updatedAt: tripUpdates?.updatedAt ?? null,
    });
  }

  const tripMatch = url.pathname.match(/^\/api\/trips\/([^/]+)$/);
  if (tripMatch) {
    const route = ctx.gtfs.tripRoute(decodeURIComponent(tripMatch[1]));
    if (!route) return sendJson(res, 404, { error: "Rit niet gevonden in de dienstregeling" });
    return sendJson(res, 200, route, 600);
  }

  const lineMatch = url.pathname.match(/^\/api\/lines\/([^/]+)$/);
  if (lineMatch) {
    const line = decodeURIComponent(lineMatch[1]);
    return sendJson(res, 200, { line, variants: ctx.gtfs.lineRoutes(line) }, 600);
  }

  // Zoeken op haltes (eigen dienstregeling) en plaatsen/adressen (PDOK).
  if (url.pathname === "/api/search") {
    const q = (url.searchParams.get("q") ?? "").trim();
    if (q.length < 2) return sendJson(res, 200, { stops: [], places: [] });
    const lat = Number(url.searchParams.get("lat"));
    const lng = Number(url.searchParams.get("lng"));
    const near = Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0 ? { lat, lng } : undefined;
    const stops = ctx.stopIndex.search(q, 6, near).map(publicStop);
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
    // Standaard vertrekken om `time`; met arriveBy=1 aankomen vóór `time`.
    const arriveBy = url.searchParams.get("arriveBy") === "1";
    // wheelchair=1: alleen via haltes die als rolstoeltoegankelijk bekendstaan.
    const options = { wheelchair: url.searchParams.get("wheelchair") === "1" };
    const journeys = arriveBy ? ctx.planner.arriveBy(from, to, at, 5, options) : ctx.planner.plan(from, to, at, 5, options);
    await enrichTrainLegs(journeys);
    addLegAlerts(journeys);
    // Rijdt er (voorlopig) niets meer, bv. midden in de nacht? Dan zeggen we dat met de eerste reis erbij.
    const firstTransit = journeys
      .flatMap((j) => j.legs)
      .filter((l) => l.type === "transit")
      .reduce<number | undefined>((min, l) => (min === undefined || l.departure < min ? l.departure : min), undefined);
    const notice =
      arriveBy
        ? journeys.length === 0
          ? { kind: "noTransit" as const }
          : undefined
        : firstTransit === undefined
        ? { kind: "noTransit" as const }
        : firstTransit - at > 2 * 3600
          ? { kind: "noServiceUntil" as const, firstDeparture: firstTransit }
          : undefined;
    return sendJson(res, 200, { from, to, time: at, arriveBy, wheelchair: options.wheelchair, journeys, notice });
  }

  const shareMatch = url.pathname.match(/^\/api\/share\/([\w-]{6,40})$/);
  if (shareMatch) {
    const journey = shares.get(shareMatch[1]);
    if (!journey) return sendJson(res, 404, { error: "Deze gedeelde reis bestaat niet (meer)" });
    // Actuele treintijden, drukte en meldingen, net als bij plannen.
    await enrichTrainLegs([journey]);
    addLegAlerts([journey]);
    return sendJson(res, 200, { journey });
  }

  if (url.pathname === "/api/stops") {
    const bbox = parseBbox(url.searchParams.get("bbox"));
    if (!bbox || bbox === "invalid") return sendJson(res, 400, { error: "bbox is verplicht: minLng,minLat,maxLng,maxLat" });
    return sendJson(res, 200, { stops: ctx.stopIndex.inBbox(bbox).map(publicStop) }, 3600);
  }

  const stopMatch = url.pathname.match(/^\/api\/stops\/([^/]+)(\/departures)?$/);
  if (stopMatch) {
    const stop = ctx.stopIndex.byId(decodeURIComponent(stopMatch[1]));
    if (!stop) return sendJson(res, 404, { error: "Halte niet gevonden" });
    if (!stopMatch[2]) return sendJson(res, 200, publicStop(stop), 3600);
    const time = Number(url.searchParams.get("time"));
    const from = Number.isFinite(time) && time > 0 ? time : Math.floor(Date.now() / 1000);
    const list = ctx.departures.forStop(stop, from, { trains: stop.modes.includes("train") ? await trainBoard(stop.stopIds, "departures") : undefined });
    // Rijdt er de komende 1,5 uur niets? Dan het eerstvolgende vertrek (bv. morgenochtend) erbij.
    const next = list.length === 0 ? ctx.departures.forStop(stop, from, { windowSec: 30 * 3600, limit: 1 })[0] : undefined;
    // Meldingen voor deze halte, alleen voor lijnen die hier (binnenkort) vertrekken of zonder lijn.
    const routeIds = new Set(list.map((d) => ctx.gtfs.lookup(d.tripId)?.routeId).filter((r): r is string => !!r));
    const stationCodes = nsRealtime ? stop.stopIds.map((id) => nsRealtime.stationCode(id)).filter((c): c is string => !!c) : undefined;
    return sendJson(res, 200, {
      stop: publicStop(stop),
      from,
      updatedAt: tripUpdates?.updatedAt ?? null,
      alerts: alerts.forStops(stop.stopIds, { routeIds, stationCodes: stationCodes?.slice(0, 1) }),
      departures: list,
      next,
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
  setTimeout(() => ctx.planner.warm(), 0);
  // Dienstregeling elke nacht bijwerken en zonder herstart overstappen.
  startGtfsUpdater({ activePath: () => ctx.dbPath, onNewVersion: swapTo });
  cleanupOldVersions([ctx.dbPath]);
  if (cache) {
    // Met bewaarde data wachten tot die een poll-interval oud is, anders lopen snelle herstarts tegen de 429 aan.
    const wait = Math.max(0, POLL_INTERVAL_MS - (Date.now() - cache.updatedAt));
    console.log(`${cache.vehicles.length} voertuigen uit cache geladen; volgende poll over ${Math.round(wait / 1000)}s`);
    setTimeout(pollLoop, wait);
  } else {
    void pollLoop();
  }
});
