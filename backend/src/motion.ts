import type { LngLat, Mode, TripRoute } from "./gtfs/lookup.js";

/**
 * Dead reckoning: schat per voertuig de snelheid over de route en geeft het stuk route vóór het voertuig
 * mee, zodat de frontend het bolletje tussen twee GPS-updates over de weg kan laten doorrijden.
 */

// Meters per graad op Nederlandse breedte (~52°).
const M_LAT = 111_320;
const M_LNG = 111_320 * Math.cos((52 * Math.PI) / 180);

const MAX_SPEED: Partial<Record<Mode, number>> = { bus: 28, tram: 20, metro: 25, train: 45, ferry: 12 }; // m/s
/** Verder dan dit van de route af (omleiding, verkeerde shape): niet voorspellen. */
const MAX_OFF_ROUTE_M = 80;
/** Oudere posities niet meer extrapoleren. */
const MAX_POSITION_AGE_S = 180;
/** Hoe ver vooruit we het pad meesturen: tot de volgende update + marge. */
const LOOKAHEAD_S = 90;
/**
 * Tot hoeveel haltes vooruit we voorspellen. Posities zijn gemiddeld ~1 minuut oud; alleen tot de
 * volgende halte liet ~1 op de 6 rijdende bussen stilstaan omdat de voorspelling die halte al bereikt had.
 */
const STOPS_AHEAD = 2;

type TripGeom = { coords: LngLat[]; cum: number[]; stopDist: Map<number, number> };
type History = { tripId: string; ts: number; dist: number; speed?: number };

export type VehicleMotion = { speed: number; path: LngLat[] };
export type MotionStats = Record<"geenRit" | "geenRoute" | "benaderdeRoute" | "nietOpRoute" | "staatStil" | "nogGeenSnelheid" | "teOud" | "voorspeld", number>;

type VehicleInput = {
  id: string;
  tripId?: string;
  mode: Mode;
  lat: number;
  lng: number;
  status?: string;
  currentStopSequence?: number;
  timestamp?: number;
  /** Gemeten snelheid in m/s (NS geeft die mee); dan is geen historie nodig. */
  measuredSpeed?: number;
};

const toXY = ([lng, lat]: LngLat): [number, number] => [lng * M_LNG, lat * M_LAT];

function cumulative(coords: LngLat[]): number[] {
  const cum = [0];
  for (let i = 1; i < coords.length; i++) {
    const [ax, ay] = toXY(coords[i - 1]);
    const [bx, by] = toXY(coords[i]);
    cum.push(cum[i - 1] + Math.hypot(bx - ax, by - ay));
  }
  return cum;
}

type Projection = { dist: number; offset: number };

/** Projecteer een punt op de route, alleen binnen [fromDist, toDist]. */
function project(g: TripGeom, p: LngLat, fromDist = 0, toDist = Infinity, preferFirstWithin?: number): Projection | null {
  const [px, py] = toXY(p);
  let best: Projection | null = null;
  for (let i = 0; i < g.coords.length - 1; i++) {
    if (g.cum[i + 1] < fromDist) continue;
    if (g.cum[i] > toDist) break;
    const [ax, ay] = toXY(g.coords[i]);
    const [bx, by] = toXY(g.coords[i + 1]);
    const dx = bx - ax, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    const t = len2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2)) : 0;
    const offset = Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
    const dist = Math.min(Math.max(g.cum[i] + t * Math.sqrt(len2), fromDist), toDist);
    // Voor haltes: de eerste passage die dichtbij genoeg is, zodat lussen (heen en terug over dezelfde weg)
    // niet de latere passage kiezen.
    if (preferFirstWithin !== undefined && offset <= preferFirstWithin) return { dist, offset };
    if (!best || offset < best.offset) best = { dist, offset };
  }
  return best;
}

/** Het stuk route tussen twee afstanden, als lijst punten. */
function slice(g: TripGeom, from: number, to: number): LngLat[] {
  const pointAt = (d: number): LngLat => {
    let i = 1;
    while (i < g.cum.length - 1 && g.cum[i] < d) i++;
    const segLen = g.cum[i] - g.cum[i - 1];
    const t = segLen ? (d - g.cum[i - 1]) / segLen : 0;
    const [a, b] = [g.coords[i - 1], g.coords[i]];
    return [round6(a[0] + (b[0] - a[0]) * t), round6(a[1] + (b[1] - a[1]) * t)];
  };
  const path: LngLat[] = [pointAt(from)];
  for (let i = 0; i < g.coords.length; i++) {
    if (g.cum[i] > from && g.cum[i] < to) path.push(g.coords[i]);
  }
  path.push(pointAt(to));
  return path;
}

const round6 = (n: number) => Math.round(n * 1e6) / 1e6;

export function createMotionEstimator(getTripRoute: (tripId: string) => TripRoute | null) {
  // "approximate" = grove routelijn (rechte stukken): daarover laten we niets rijden.
  const geomCache = new Map<string, TripGeom | null | "approximate">();
  const history = new Map<string, History>();

  function geometry(tripId: string): TripGeom | null | "approximate" {
    if (geomCache.has(tripId)) return geomCache.get(tripId)!;
    const route = getTripRoute(tripId);
    let geom: TripGeom | null | "approximate" = null;
    if (route?.approximate) {
      geom = "approximate";
    } else if (route?.shape && route.shape.length > 1) {
      geom = { coords: route.shape, cum: cumulative(route.shape), stopDist: new Map() };
      // Haltes op volgorde op de route leggen; elke halte ligt ná de vorige.
      let prev = 0;
      for (const stop of route.stops) {
        const proj = project(geom, [stop.lng, stop.lat], prev, Infinity, 30);
        if (!proj) continue;
        geom.stopDist.set(stop.sequence, proj.dist);
        prev = proj.dist;
      }
    }
    if (geomCache.size > 20_000) geomCache.clear();
    geomCache.set(tripId, geom);
    return geom;
  }

  /** Berekent snelheid en pad voor alle voertuigen. Aanroepen na elke nieuwe feed. */
  function update(vehicles: VehicleInput[], nowSec: number): { motions: Map<string, VehicleMotion>; stats: MotionStats } {
    const result = new Map<string, VehicleMotion>();
    const stats: MotionStats = { geenRit: 0, geenRoute: 0, benaderdeRoute: 0, nietOpRoute: 0, staatStil: 0, nogGeenSnelheid: 0, teOud: 0, voorspeld: 0 };
    const seen = new Set<string>();

    for (const v of vehicles) {
      seen.add(v.id);
      if (!v.tripId || !v.timestamp) {
        stats.geenRit++;
        continue;
      }
      const g = geometry(v.tripId);
      if (!g) {
        stats.geenRoute++;
        continue;
      }
      if (g === "approximate") {
        stats.benaderdeRoute++;
        continue;
      }

      // Let op: OVapi volgt KV6 i.p.v. de GTFS-spec. Bij IN_TRANSIT_TO is currentStopSequence de halte
      // waar het voertuig net vertrokken is (gemeten: ~75% al voorbij die halte), niet de volgende.
      const seq = v.currentStopSequence;
      const stopped = v.status === "STOPPED_AT";
      const currentStopDist = seq !== undefined ? g.stopDist.get(seq) : undefined;
      // De volgende halte, en de halte daarna (tot waar we maximaal voorspellen).
      let nextStopDist: number | undefined;
      let limitStopDist: number | undefined;
      if (seq !== undefined) {
        const ahead = [...g.stopDist].filter(([s]) => s > seq).sort((a, b) => a[0] - b[0]);
        nextStopDist = ahead[0]?.[1];
        limitStopDist = (ahead[STOPS_AHEAD - 1] ?? ahead[ahead.length - 1])?.[1];
      }

      // Positie op de route bepalen, beperkt tot het stuk tussen de vertrokken en de volgende halte (robuust bij lussen).
      let dist: number | undefined;
      if (stopped && currentStopDist !== undefined) {
        dist = currentStopDist;
      } else {
        const from = currentStopDist !== undefined ? Math.max(0, currentStopDist - 50) : 0;
        const to = nextStopDist !== undefined ? nextStopDist + 50 : Infinity;
        const proj = project(g, [v.lng, v.lat], from, to);
        if (proj && proj.offset <= MAX_OFF_ROUTE_M) dist = proj.dist;
      }
      if (dist === undefined) {
        history.delete(v.id);
        stats.nietOpRoute++;
        continue;
      }

      // Snelheid uit de vorige positie op dezelfde rit (gemiddelde inclusief optrekken/remmen).
      const prev = history.get(v.id);
      let speed: number | undefined;
      if (v.measuredSpeed !== undefined) {
        speed = Math.min(v.measuredSpeed, MAX_SPEED[v.mode] ?? 30);
      } else if (prev && prev.tripId === v.tripId) {
        if (v.timestamp === prev.ts) {
          speed = prev.speed;
          dist = prev.dist;
        } else if (v.timestamp > prev.ts + 5) {
          const raw = (dist - prev.dist) / (v.timestamp - prev.ts);
          if (raw < -2) {
            speed = undefined; // achteruit: waarschijnlijk verkeerd geprojecteerd, opnieuw beginnen
          } else {
            const clamped = Math.min(Math.max(raw, 0), MAX_SPEED[v.mode] ?? 30);
            speed = prev.speed === undefined ? clamped : 0.5 * prev.speed + 0.5 * clamped;
          }
        } else {
          speed = prev.speed;
        }
      }
      history.set(v.id, { tripId: v.tripId, ts: v.timestamp, dist, speed });

      const age = nowSec - v.timestamp;
      if (stopped) {
        stats.staatStil++;
        continue;
      }
      if (age > MAX_POSITION_AGE_S) {
        stats.teOud++;
        continue;
      }
      if (speed === undefined) {
        stats.nogGeenSnelheid++;
        continue;
      }
      if (speed < 0.5) {
        stats.staatStil++;
        continue;
      }

      // Pad over hooguit STOPS_AHEAD haltes, maximaal zo ver als het voertuig tot de volgende update komt.
      // De snelheid is een gemiddelde inclusief stoppen, dus door een halte heen rijden klopt qua tempo ongeveer.
      const end = Math.min(limitStopDist ?? g.cum[g.cum.length - 1], dist + speed * (Math.max(age, 0) + LOOKAHEAD_S));
      if (end - dist < 1) {
        stats.staatStil++;
        continue;
      }
      stats.voorspeld++;
      result.set(v.id, { speed: Math.round(speed * 10) / 10, path: slice(g, dist, end) });
    }

    for (const id of history.keys()) if (!seen.has(id)) history.delete(id);
    return { motions: result, stats };
  }

  /**
   * Bepaalt voor een voertuig zonder haltestatus (NS-treinen) waar het op de rit is, in dezelfde
   * betekenis als OVapi (KV6): de laatst vertrokken halte, of STOPPED_AT als het stilstaat bij een halte.
   */
  function locate(tripId: string, lat: number, lng: number, speedMs: number): { currentStopSequence: number; status: string } | null {
    const g = geometry(tripId);
    if (!g || g === "approximate") return null;
    const proj = project(g, [lng, lat]);
    if (!proj || proj.offset > MAX_OFF_ROUTE_M * 2) return null;

    let passedSeq: number | undefined;
    let nearest: { seq: number; gap: number } | undefined;
    for (const [seq, d] of g.stopDist) {
      const gap = Math.abs(d - proj.dist);
      if (!nearest || gap < nearest.gap) nearest = { seq, gap };
      if (d <= proj.dist + 30 && (passedSeq === undefined || seq > passedSeq)) passedSeq = seq;
    }
    if (nearest && nearest.gap < 250 && speedMs < 1) return { currentStopSequence: nearest.seq, status: "STOPPED_AT" };
    if (passedSeq === undefined) return null;
    return { currentStopSequence: passedSeq, status: "IN_TRANSIT_TO" };
  }

  return { update, locate };
}
