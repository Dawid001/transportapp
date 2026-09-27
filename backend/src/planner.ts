import type { DatabaseSync } from "node:sqlite";
import type { Alert } from "./alerts.js";
import type { Mode, TripInfo } from "./gtfs/lookup.js";
import { serviceDayStart } from "./time.js";
import type { Timetable } from "./timetable.js";

/**
 * Reisplanner volgens RAPTOR (Delling, Pajor & Werneck, 2012): per ronde één rit extra, dus ronde k
 * = k-1 overstappen. Werkt op de dienstregeling in het geheugen; lopen naar/van haltes en tussen
 * haltes in de buurt gaat hemelsbreed met een omweg-factor.
 */

const WALK_SPEED = 1.2; // m/s (~4,3 km/u)
const WALK_DETOUR = 1.3; // hemelsbreed → echte looproute
const MAX_ACCESS_M = 1000; // lopen naar de eerste / vanaf de laatste halte (~18 min)
const MAX_TRANSFER_M = 400; // lopen tussen haltes bij een overstap
const TRANSFER_BUFFER_S = 60; // minimale overstaptijd bovenop het lopen
const MAX_ROUNDS = 5; // = maximaal 4 overstappen
const MAX_DIRECT_WALK_M = 2000; // korter dan dit: ook "alleen lopen" als optie
const INF = 0x3fffffff;

const M_LAT = 111_320;
const M_LNG = 111_320 * Math.cos((52 * Math.PI) / 180);

export type LatLng = { lat: number; lng: number };

export type PlanPoint = { name: string; lat: number; lng: number; stopIds?: string[] };

export type WalkLeg = { type: "walk"; from: LegPlace; to: LegPlace; departure: number; arrival: number; distance: number };
export type TransitLeg = {
  type: "transit";
  mode: Mode;
  line?: string;
  headsign?: string;
  agencyName?: string;
  tripId: string;
  from: LegPlace;
  to: LegPlace;
  /** Unix-seconden volgens de dienstregeling. */
  departure: number;
  arrival: number;
  /** Verwachte tijden (realtime), als bekend. */
  expectedDeparture?: number;
  expectedArrival?: number;
  canceled?: boolean;
  /** Aantal haltes onderweg (tussen in- en uitstappen). */
  stopsBetween: number;
  /** Volgnummers (stop_sequence) van in- en uitstaphalte, om de live positie van het voertuig te duiden. */
  fromSequence: number;
  toSequence: number;
  /** Meldingen voor dit reisdeel (omleiding, tijdelijke halte, storing). */
  alerts?: Alert[];
  /** Lijn over de kaart: haltes van instappen t/m uitstappen. */
  path: [number, number][];
};
export type LegPlace = { name: string; lat: number; lng: number; stopId?: string; platform?: string };
export type Leg = WalkLeg | TransitLeg;
export type Journey = { departure: number; arrival: number; transfers: number; legs: Leg[] };

type Deps = {
  db: DatabaseSync;
  timetable: Timetable;
  lookup: (tripId: string) => TripInfo | null;
  /** Realtime per rit: verwachte tijd bij een halte (volgnummer) of uitgevallen. */
  realtime: (tripId: string, date: string) => { canceled: boolean; at: (sequence: number) => { dep?: number; arr?: number } | undefined } | undefined;
  /** Weergavelabel van een lijn (treinen: IC/SPR). */
  lineLabel: (info: TripInfo | null, mode: Mode) => string | undefined;
  /** Echte routelijn van een rit (null als die er niet is of alleen rechte stukken bevat). */
  tripShape: (tripId: string) => [number, number][] | null;
};

type DayTripRef = { tripId: string; start: number; dep: Int32Array; arr: Int32Array; date: string; dayStart: number };
type RoutePattern = { id: number; stops: Int32Array; sequences: number[]; trips: DayTripRef[] };

export function createPlanner({ db, timetable, lookup, realtime, lineLabel, tripShape }: Deps) {
  const t0 = Date.now();

  // --- Haltes als getallen, met coördinaten, naam en perron -------------------------------------
  const stopRows = db
    .prepare("SELECT stop_id, stop_name, stop_lat, stop_lon, platform_code FROM stops WHERE location_type = 0 OR location_type IS NULL")
    .all() as { stop_id: string; stop_name: string; stop_lat: number; stop_lon: number; platform_code: string | null }[];
  const stopIdx = new Map<string, number>();
  const stopIds: string[] = [];
  const stopName: string[] = [];
  const stopPlatform: (string | undefined)[] = [];
  const lat = new Float64Array(stopRows.length);
  const lng = new Float64Array(stopRows.length);
  stopRows.forEach((r, i) => {
    stopIdx.set(r.stop_id, i);
    stopIds.push(r.stop_id);
    stopName.push(r.stop_name);
    stopPlatform.push(r.platform_code ?? undefined);
    lat[i] = r.stop_lat;
    lng[i] = r.stop_lon;
  });
  const N = stopIds.length;

  const dist = (aLat: number, aLng: number, bLat: number, bLng: number) => Math.hypot((aLng - bLng) * M_LNG, (aLat - bLat) * M_LAT);
  const walkSeconds = (meters: number) => Math.ceil((meters * WALK_DETOUR) / WALK_SPEED);

  // Ruimtelijk raster (~500 m) om haltes in de buurt snel te vinden.
  const CELL = 0.005;
  const cellKey = (la: number, ln: number) => `${Math.floor(la / CELL)}:${Math.floor(ln / (CELL * 1.6))}`;
  const grid = new Map<string, number[]>();
  for (let i = 0; i < N; i++) {
    if (!timetable.patternsByStop.has(stopIds[i])) continue; // alleen haltes waar iets stopt
    const k = cellKey(lat[i], lng[i]);
    const cell = grid.get(k);
    if (cell) cell.push(i);
    else grid.set(k, [i]);
  }
  function stopsNear(la: number, ln: number, radiusM: number): { stop: number; meters: number }[] {
    const out: { stop: number; meters: number }[] = [];
    const cy = Math.floor(la / CELL);
    const cx = Math.floor(ln / (CELL * 1.6));
    const r = Math.ceil(radiusM / 500) + 1;
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        for (const s of grid.get(`${cy + dy}:${cx + dx}`) ?? []) {
          const d = dist(la, ln, lat[s], lng[s]);
          if (d <= radiusM) out.push({ stop: s, meters: d });
        }
      }
    }
    return out;
  }

  // Overstappen te voet: per halte de buren binnen MAX_TRANSFER_M (compact in één array).
  const footStart = new Int32Array(N + 1);
  const footList: number[] = [];
  const footTime: number[] = [];
  for (let i = 0; i < N; i++) {
    footStart[i] = footList.length;
    if (!timetable.patternsByStop.has(stopIds[i])) continue;
    for (const { stop, meters } of stopsNear(lat[i], lng[i], MAX_TRANSFER_M)) {
      if (stop === i) continue;
      footList.push(stop);
      footTime.push(walkSeconds(meters));
    }
  }
  footStart[N] = footList.length;
  const footTo = Int32Array.from(footList);
  const footSec = Int32Array.from(footTime);

  // Per halte: in welke patronen en op welke positie.
  const routesAtStop: { pattern: number; pos: number }[][] = Array.from({ length: N }, () => []);
  for (const [stopId, entries] of timetable.patternsByStop) {
    const i = stopIdx.get(stopId);
    if (i === undefined) continue;
    for (const e of entries) routesAtStop[i].push({ pattern: e.patternId, pos: e.index });
  }

  console.log(
    `Planner: ${N.toLocaleString("nl-NL")} haltes, ${footTo.length.toLocaleString("nl-NL")} looprelaties (${Date.now() - t0} ms)`,
  );

  // --- Dienstregeling per vertrekdag: ritten van gisteren (na middernacht), vandaag en morgen -------
  const dayCache = new Map<string, Map<number, RoutePattern>>();

  /** Ritten per patroon, met tijden in seconden t.o.v. het begin van dienstdag `date`. */
  function raptorDay(date: string): Map<number, RoutePattern> {
    const cached = dayCache.get(date);
    if (cached) return cached;
    const started = Date.now();
    const base = serviceDayStart(date);
    const routes = new Map<number, RoutePattern>();
    const d = new Date(Date.UTC(+date.slice(0, 4), +date.slice(4, 6) - 1, +date.slice(6, 8)));
    const shiftDate = (days: number) => {
      const x = new Date(d.getTime() + days * 86_400_000);
      return `${x.getUTCFullYear()}${String(x.getUTCMonth() + 1).padStart(2, "0")}${String(x.getUTCDate()).padStart(2, "0")}`;
    };
    for (const day of [shiftDate(-1), date, shiftDate(1)]) {
      const dayStart = serviceDayStart(day);
      const offset = dayStart - base;
      for (const [patternId, trips] of timetable.day(day)) {
        const pattern = timetable.patterns.get(patternId)!;
        let route = routes.get(patternId);
        if (!route) {
          const stops = Int32Array.from(pattern.stopIds, (id) => stopIdx.get(id) ?? -1);
          route = { id: patternId, stops, sequences: pattern.sequences, trips: [] };
          routes.set(patternId, route);
        }
        for (const t of trips) {
          const profile = timetable.profiles.get(t.profileId);
          if (!profile) continue;
          const start = t.start + offset;
          // Ritten van gisteren die vóór middernacht al klaar zijn, zijn niet nodig.
          if (start + profile.arr[profile.arr.length - 1] < -3600) continue;
          route.trips.push({ tripId: t.tripId, start, dep: profile.dep, arr: profile.arr, date: day, dayStart });
        }
      }
    }
    for (const r of routes.values()) r.trips.sort((a, b) => a.start + a.dep[0] - (b.start + b.dep[0]));
    if (dayCache.size >= 2) dayCache.delete(dayCache.keys().next().value!);
    dayCache.set(date, routes);
    console.log(`Planner: dienstregeling rond ${date} klaar (${Date.now() - started} ms)`);
    return routes;
  }

  // --- RAPTOR -----------------------------------------------------------------------------------

  type Access = { stop: number; seconds: number };

  function accessFor(point: PlanPoint): Access[] {
    const out = new Map<number, number>();
    // Gekozen halte: al zijn perrons zonder lopen.
    for (const id of point.stopIds ?? []) {
      const i = stopIdx.get(id);
      if (i !== undefined && timetable.patternsByStop.has(id)) out.set(i, 0);
    }
    const radius = point.stopIds?.length ? MAX_TRANSFER_M : MAX_ACCESS_M;
    for (const { stop, meters } of stopsNear(point.lat, point.lng, radius)) {
      const s = walkSeconds(meters);
      if (!out.has(stop) || out.get(stop)! > s) out.set(stop, s);
    }
    return [...out].map(([stop, seconds]) => ({ stop, seconds }));
  }

  /** Eerste rit op positie `pos` die vertrekt op of na `time` (ritten zijn op vertrektijd gesorteerd). */
  function earliestTrip(route: RoutePattern, pos: number, time: number, canceled: (t: DayTripRef) => boolean): number {
    const trips = route.trips;
    let lo = 0;
    let hi = trips.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (trips[mid].start + trips[mid].dep[pos] < time) lo = mid + 1;
      else hi = mid;
    }
    // Inhalen komt zelden voor maar kan; kijk een paar ritten verder en sla uitgevallen ritten over.
    let best = -1;
    for (let i = lo; i < Math.min(trips.length, lo + 6); i++) {
      const t = trips[i];
      const dep = t.start + t.dep[pos];
      if (dep < time || canceled(t)) continue;
      if (best === -1 || dep < trips[best].start + trips[best].dep[pos]) best = i;
    }
    return best;
  }

  type Label =
    | { kind: "access"; seconds: number }
    | { kind: "transit"; route: RoutePattern; trip: number; boardPos: number; alightPos: number; boardStop: number }
    // Een loopje onthoudt zelf de rit waarmee de vertrekhalte bereikt werd: die halte kan in dezelfde
    // ronde nog door een ander loopje overschreven worden, en dan zou de rit bij het terugrekenen ontbreken.
    | { kind: "walk"; from: number; seconds: number; via: TransitLabel };
  type TransitLabel = { kind: "transit"; route: RoutePattern; trip: number; boardPos: number; alightPos: number; boardStop: number };

  function raptor(routes: Map<number, RoutePattern>, access: Access[], egress: Map<number, number>, depTime: number) {
    const canceledCache = new Map<string, boolean>();
    const isCanceled = (t: DayTripRef) => {
      let c = canceledCache.get(t.tripId);
      if (c === undefined) {
        c = realtime(t.tripId, t.date)?.canceled ?? false;
        canceledCache.set(t.tripId, c);
      }
      return c;
    };

    const best = new Int32Array(N).fill(INF);
    const reach: Int32Array[] = [];
    const labels: Map<number, Label>[] = [];
    let bestTarget = INF;
    const results: { round: number; arrival: number; egressStop: number }[] = [];

    // Ronde 0: lopen naar de eerste haltes.
    const r0 = new Int32Array(N).fill(INF);
    const l0 = new Map<number, Label>();
    let marked = new Set<number>();
    for (const a of access) {
      const t = depTime + a.seconds;
      if (t < r0[a.stop]) {
        r0[a.stop] = t;
        best[a.stop] = t;
        l0.set(a.stop, { kind: "access", seconds: a.seconds });
        marked.add(a.stop);
      }
    }
    reach.push(r0);
    labels.push(l0);

    for (let k = 1; k <= MAX_ROUNDS && marked.size; k++) {
      const prev = reach[k - 1];
      const cur = new Int32Array(N).fill(INF);
      const lab = new Map<number, Label>();
      const newlyMarked = new Set<number>();

      // Welke patronen moeten we scannen, vanaf welke positie?
      const queue = new Map<number, number>();
      for (const s of marked) {
        for (const { pattern, pos } of routesAtStop[s]) {
          if (!routes.has(pattern)) continue;
          const q = queue.get(pattern);
          if (q === undefined || pos < q) queue.set(pattern, pos);
        }
      }

      for (const [patternId, startPos] of queue) {
        const route = routes.get(patternId)!;
        let trip = -1;
        let boardPos = -1;
        let boardStop = -1;
        for (let pos = startPos; pos < route.stops.length; pos++) {
          const s = route.stops[pos];
          if (s < 0) continue;
          if (trip >= 0) {
            const t = route.trips[trip];
            const arr = t.start + t.arr[pos];
            if (arr < best[s] && arr < bestTarget) {
              cur[s] = arr;
              best[s] = arr;
              lab.set(s, { kind: "transit", route, trip, boardPos, alightPos: pos, boardStop });
              newlyMarked.add(s);
            }
          }
          // Kunnen we hier (eerder) instappen?
          if (prev[s] < INF) {
            const ready = prev[s] + (k > 1 ? TRANSFER_BUFFER_S : 0);
            if (trip < 0 || ready <= route.trips[trip].start + route.trips[trip].dep[pos]) {
              const t = earliestTrip(route, pos, ready, isCanceled);
              if (t >= 0 && (trip < 0 || t !== trip)) {
                if (trip < 0 || route.trips[t].start + route.trips[t].arr[route.stops.length - 1] <= route.trips[trip].start + route.trips[trip].arr[route.stops.length - 1]) {
                  trip = t;
                  boardPos = pos;
                  boardStop = s;
                }
              }
            }
          }
        }
      }

      // Overstappen te voet vanaf haltes die deze ronde met een rit bereikt zijn.
      // Alleen vanaf haltes die met een rit bereikt zijn, met de aankomsttijd van die rit (niet verder lopen na lopen).
      const byTransit = [...newlyMarked].flatMap((s) => {
        const l = lab.get(s);
        return l?.kind === "transit" ? [{ s, arr: cur[s], via: l }] : [];
      });
      for (const { s, arr: arrived, via } of byTransit) {
        for (let j = footStart[s]; j < footStart[s + 1]; j++) {
          const t = footTo[j];
          const arr = arrived + footSec[j];
          if (arr < best[t] && arr < bestTarget) {
            cur[t] = arr;
            best[t] = arr;
            lab.set(t, { kind: "walk", from: s, seconds: footSec[j], via });
            newlyMarked.add(t);
          }
        }
      }

      reach.push(cur);
      labels.push(lab);

      // Bestemming bereikt in deze ronde?
      let roundBest = INF;
      let roundStop = -1;
      for (const [s, walk] of egress) {
        if (cur[s] < INF && cur[s] + walk < roundBest) {
          roundBest = cur[s] + walk;
          roundStop = s;
        }
      }
      if (roundStop >= 0 && roundBest < bestTarget) {
        bestTarget = roundBest;
        results.push({ round: k, arrival: roundBest, egressStop: roundStop });
      }
      marked = newlyMarked;
    }

    return { reach, labels, results };
  }

  // --- Reis reconstrueren -------------------------------------------------------------------------

  /**
   * Lijn over de kaart voor een reisdeel: het stuk van de echte routelijn tussen in- en uitstaphalte,
   * of (zonder bruikbare routelijn) rechte stukken tussen de haltes.
   */
  function legPath(tripId: string, route: RoutePattern, boardPos: number, alightPos: number): [number, number][] {
    const stopsPath: [number, number][] = [];
    for (let p = boardPos; p <= alightPos; p++) {
      const s = route.stops[p];
      if (s >= 0) stopsPath.push([lng[s], lat[s]]);
    }
    const shape = tripShape(tripId);
    if (!shape || shape.length < 2 || stopsPath.length < 2) return stopsPath;
    const nearest = (pt: [number, number], from: number) => {
      let best = from;
      let bestD = Infinity;
      for (let i = from; i < shape.length; i++) {
        const d = dist(pt[1], pt[0], shape[i][1], shape[i][0]);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      return { index: best, meters: bestD };
    };
    const a = nearest(stopsPath[0], 0);
    const b = nearest(stopsPath[stopsPath.length - 1], a.index);
    // Ligt een halte ver van de routelijn, dan klopt de lijn niet voor deze rit.
    if (a.meters > 300 || b.meters > 300 || b.index <= a.index) return stopsPath;
    return [stopsPath[0], ...shape.slice(a.index, b.index + 1), stopsPath[stopsPath.length - 1]];
  }

  function place(stop: number): LegPlace {
    return { name: stopName[stop], lat: lat[stop], lng: lng[stop], stopId: stopIds[stop], platform: stopPlatform[stop] };
  }

  function buildJourney(
    run: ReturnType<typeof raptor>,
    result: { round: number; arrival: number; egressStop: number },
    from: PlanPoint,
    to: PlanPoint,
    egress: Map<number, number>,
    base: number,
  ): Journey {
    const legs: Leg[] = [];
    let stop = result.egressStop;
    let k = result.round;
    const toPlace: LegPlace = { name: to.name, lat: to.lat, lng: to.lng };
    const egressWalk = egress.get(stop)!;
    if (egressWalk > 0) {
      const dep = base + run.reach[k][stop];
      legs.unshift({ type: "walk", from: place(stop), to: toPlace, departure: dep, arrival: dep + egressWalk, distance: Math.round((egressWalk * WALK_SPEED) / WALK_DETOUR) });
    }

    while (k > 0) {
      let label = run.labels[k].get(stop)!;
      if (label.kind === "walk") {
        const arr = base + run.reach[k][stop];
        legs.unshift({
          type: "walk",
          from: place(label.from),
          to: place(stop),
          departure: arr - label.seconds,
          arrival: arr,
          distance: Math.round((label.seconds * WALK_SPEED) / WALK_DETOUR),
        });
        stop = label.from;
        label = label.via;
      }
      if (label.kind !== "transit") break;
      const trip = label.route.trips[label.trip];
      const info = lookup(trip.tripId);
      const mode = info?.mode ?? "other";
      const rt = realtime(trip.tripId, trip.date);
      const boardSeq = label.route.sequences[label.boardPos];
      const alightSeq = label.route.sequences[label.alightPos];
      const path = legPath(trip.tripId, label.route, label.boardPos, label.alightPos);
      legs.unshift({
        type: "transit",
        mode,
        line: lineLabel(info, mode),
        headsign: info?.headsign,
        agencyName: info?.agencyName,
        tripId: trip.tripId,
        from: place(label.boardStop),
        to: place(stop),
        departure: base + trip.start + trip.dep[label.boardPos],
        arrival: base + trip.start + trip.arr[label.alightPos],
        expectedDeparture: rt?.at(boardSeq)?.dep,
        expectedArrival: rt?.at(alightSeq)?.arr,
        canceled: rt?.canceled || undefined,
        stopsBetween: Math.max(0, label.alightPos - label.boardPos - 1),
        fromSequence: boardSeq,
        toSequence: alightSeq,
        path,
      });
      stop = label.boardStop;
      k--;
    }

    // Lopen naar de eerste halte.
    const accessLabel = run.labels[0].get(stop);
    if (accessLabel?.kind === "access" && accessLabel.seconds > 0) {
      const firstDep = legs[0]?.departure ?? base;
      legs.unshift({
        type: "walk",
        from: { name: from.name, lat: from.lat, lng: from.lng },
        to: place(stop),
        departure: firstDep - accessLabel.seconds,
        arrival: firstDep,
        distance: Math.round((accessLabel.seconds * WALK_SPEED) / WALK_DETOUR),
      });
    }
    // Twee loopstukken achter elkaar (overstap te voet + laatste stuk) als één stuk tonen.
    const merged: Leg[] = [];
    for (const leg of legs) {
      const prev = merged[merged.length - 1];
      if (leg.type === "walk" && prev?.type === "walk") {
        merged[merged.length - 1] = { ...prev, to: leg.to, arrival: leg.arrival, distance: prev.distance + leg.distance };
      } else {
        merged.push(leg);
      }
    }
    // Loopjes van een paar seconden aan begin/eind (binnen hetzelfde station) weglaten.
    while (merged.length > 1 && merged[0].type === "walk" && merged[0].arrival - merged[0].departure < 45) merged.shift();
    while (merged.length > 1 && merged[merged.length - 1].type === "walk" && merged[merged.length - 1].arrival - merged[merged.length - 1].departure < 45) merged.pop();
    const transfers = Math.max(0, merged.filter((l) => l.type === "transit").length - 1);
    return { departure: merged[0].departure, arrival: merged[merged.length - 1].arrival, transfers, legs: merged };
  }

  /**
   * Plant reizen van `from` naar `to`, vertrekkend vanaf `time` (unix-seconden).
   * Geeft tot `count` opties: telkens de snelste, daarna met een latere vertrektijd opnieuw.
   */
  function plan(from: PlanPoint, to: PlanPoint, time: number, count = 5): Journey[] {
    const started = Date.now();
    const date = dateOf(time);
    const base = serviceDayStart(date);
    const routes = raptorDay(date);
    const access = accessFor(from);
    const egress = new Map(accessFor(to).map((a) => [a.stop, a.seconds]));
    const journeys: Journey[] = [];
    const seen = new Set<string>();

    const direct = dist(from.lat, from.lng, to.lat, to.lng);
    if (direct <= MAX_DIRECT_WALK_M) {
      const secs = walkSeconds(direct);
      journeys.push({
        departure: time,
        arrival: time + secs,
        transfers: 0,
        legs: [{ type: "walk", from: { name: from.name, lat: from.lat, lng: from.lng }, to: { name: to.name, lat: to.lat, lng: to.lng }, departure: time, arrival: time + secs, distance: Math.round(direct * WALK_DETOUR) }],
      });
    }

    let depTime = time - base;
    for (let attempt = 0; attempt < count * 3 && journeys.filter((j) => j.legs.some((l) => l.type === "transit")).length < count + 3; attempt++) {
      const run = raptor(routes, access, egress, depTime);
      if (!run.results.length) break;
      // Per aantal overstappen de snelste; toon de snelste en (als die niet veel langzamer is) ook minder overstappen.
      const fastest = run.results[run.results.length - 1];
      const candidates = run.results.filter((r) => r === fastest || r.arrival - fastest.arrival <= 10 * 60);
      let earliest = INF;
      for (const r of candidates) {
        const j = buildJourney(run, r, from, to, egress, base);
        const key = j.legs.map((l) => (l.type === "transit" ? `${l.tripId}@${l.from.stopId}` : "w")).join("|");
        if (!j.legs.some((l) => l.type === "transit")) continue;
        earliest = Math.min(earliest, j.departure - base);
        if (!seen.has(key)) {
          seen.add(key);
          journeys.push(j);
        }
      }
      if (earliest >= INF) break;
      // Volgende optie: een minuut later van huis vertrekken dan deze optie.
      depTime = Math.max(depTime + 60, earliest + 60);
    }

    console.log(`Planner: ${from.name} → ${to.name}: ${journeys.length} opties in ${Date.now() - started} ms`);
    // Opties waarbij je eerder vertrekt maar niet eerder aankomt dan een andere optie, weglaten
    // (bv. 's nachts de laatste trein nemen en dan uren op de eerste bus wachten). Lopen blijft staan.
    const transitOnly = journeys.filter((j) => j.legs.some((l) => l.type === "transit"));
    const useful = journeys.filter(
      (j) =>
        !j.legs.some((l) => l.type === "transit") ||
        !transitOnly.some(
          (o) => o !== j && o.departure >= j.departure && o.arrival <= j.arrival && (o.departure > j.departure || o.arrival < j.arrival || o.transfers < j.transfers),
        ),
    );
    return useful.sort((a, b) => a.departure - b.departure || a.arrival - b.arrival).slice(0, count + 1);
  }

  /** Dienstregeling van vandaag alvast klaarzetten, zodat de eerste zoekopdracht niet wacht. */
  const warm = () => void raptorDay(dateOf(Date.now() / 1000));

  /** Vroegst mogelijke aankomst bij vertrek op `time` (één RAPTOR-run), of undefined. */
  function earliestArrival(from: PlanPoint, to: PlanPoint, time: number): number | undefined {
    const date = dateOf(time);
    const base = serviceDayStart(date);
    const run = raptor(raptorDay(date), accessFor(from), new Map(accessFor(to).map((a) => [a.stop, a.seconds])), time - base);
    if (!run.results.length) return undefined;
    return base + Math.min(...run.results.map((r) => r.arrival));
  }

  /**
   * "Aankomen om": zoek met een binaire zoektocht het laatste vertrek dat vóór `target` aankomt (vroegste
   * aankomst stijgt met de vertrektijd), en geef de opties die op tijd zijn, de laatste eerst.
   */
  function arriveBy(from: PlanPoint, to: PlanPoint, target: number, count = 5): Journey[] {
    const started = Date.now();
    // Niet eerder dan nu vertrekken: een rit die al weg is heb je niets aan.
    const now = Math.floor(Date.now() / 1000);
    let lo = Math.max(target - 4 * 3600, now);
    if (lo >= target) return [];
    let hi = target;
    if ((earliestArrival(from, to, lo) ?? Infinity) > target) return [];
    while (hi - lo > 60) {
      const mid = Math.floor((lo + hi) / 2);
      if ((earliestArrival(from, to, mid) ?? Infinity) <= target) lo = mid;
      else hi = mid;
    }
    // Een paar opties rond het laatste vertrek dat nog op tijd is.
    // Te weinig? Dan eerder beginnen, want plan() levert maar een beperkt aantal opties vanaf de starttijd.
    const found = new Map<string, Journey>();
    for (let back = 25 * 60; back <= 3 * 3600 && found.size < count; back += 35 * 60) {
      for (const j of plan(from, to, lo - back, count + 4)) {
        if (j.arrival <= target && j.departure >= now && j.legs.some((l) => l.type === "transit")) found.set(`${j.departure}-${j.arrival}`, j);
      }
    }
    const onTime = [...found.values()].sort((a, b) => a.departure - b.departure || a.arrival - b.arrival);
    console.log(`Planner: aankomen om voor ${from.name} → ${to.name} in ${Date.now() - started} ms`);
    return onTime.slice(-count);
  }

  return { plan, arriveBy, warm };
}

/** Dienstdag (YYYYMMDD) waarin een moment valt; vóór 04:00 hoort het nog bij de vorige dag voor nachtritten. */
function dateOf(unixSec: number): string {
  const d = new Date(unixSec * 1000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Amsterdam", year: "numeric", month: "2-digit", day: "2-digit" })
    .format(d)
    .replaceAll("-", "");
}
