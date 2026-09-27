import type { ApiVehicle, LngLat } from "./types";

/**
 * Beweging van één voertuig op het scherm.
 * - Zonder pad staat het voertuig stil op zijn laatst bekende positie.
 * - Met pad rijdt het met `speed` over het pad, gerekend vanaf de GPS-tijd `t0`, tot het einde (de volgende halte).
 * - `corr` is het verschil met waar het bolletje stond toen deze data binnenkwam; dat ebt weg zodat er niets springt.
 */
export type Motion = {
  base: LngLat;
  path?: LngLat[];
  cum?: number[];
  speed?: number;
  t0?: number;
  corr: LngLat;
  /** Rijrichting van de backend, voor als er geen pad is (stilstaand of onbekend). */
  bearing?: number;
};

const M_LAT = 111_320;
const M_LNG = 111_320 * Math.cos((52 * Math.PI) / 180);
/** Grotere correcties (bv. ander voertuig met hetzelfde ID) niet animeren maar gewoon verspringen. */
const MAX_CORRECTION_DEG = 0.02;

export function makeMotion(v: ApiVehicle): Motion {
  const motion: Motion = { base: [v.lng, v.lat], corr: [0, 0], bearing: v.bearing };
  if (v.path && v.path.length > 1 && v.speed && v.timestamp) {
    const cum = [0];
    for (let i = 1; i < v.path.length; i++) {
      const dx = (v.path[i][0] - v.path[i - 1][0]) * M_LNG;
      const dy = (v.path[i][1] - v.path[i - 1][1]) * M_LAT;
      cum.push(cum[i - 1] + Math.hypot(dx, dy));
    }
    Object.assign(motion, { path: v.path, cum, speed: v.speed, t0: v.timestamp * 1000 });
  }
  return motion;
}

/** Stuk van het pad waar het voertuig op `now` rijdt: index i (segment i-1 → i) en afstand d. */
function segmentAt(m: Motion, now: number): { i: number; d: number } | null {
  if (!m.path || !m.cum || !m.speed || m.t0 === undefined) return null;
  const total = m.cum[m.cum.length - 1];
  const d = Math.min(Math.max((m.speed * (now - m.t0)) / 1000, 0), total);
  let i = 1;
  // Segmenten zonder lengte (dubbele punten) overslaan, anders is er geen richting.
  while (i < m.cum.length - 1 && (m.cum[i] < d || m.cum[i] === m.cum[i - 1])) i++;
  return { i, d };
}

/** Waar het voertuig volgens de voorspelling nu is (zonder correctie). `now` in serverklok-ms. */
export function predicted(m: Motion, now: number): LngLat {
  const at = segmentAt(m, now);
  if (!at || !m.path || !m.cum) return m.base;
  const { i, d } = at;
  const seg = m.cum[i] - m.cum[i - 1];
  const t = seg ? (d - m.cum[i - 1]) / seg : 0;
  const [a, b] = [m.path[i - 1], m.path[i]];
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** Positie op het scherm: voorspelling plus een correctie die in `progress` (0→1) wegebt. */
export function positionAt(m: Motion, now: number, progress: number): LngLat {
  const [lng, lat] = predicted(m, now);
  const k = 1 - easeOut(progress);
  return [lng + m.corr[0] * k, lat + m.corr[1] * k];
}

/** Nieuwe beweging die begint waar het bolletje nu op het scherm staat. */
export function continueFrom(next: Motion, displayed: LngLat, now: number): Motion {
  const [lng, lat] = predicted(next, now);
  const corr: LngLat = [displayed[0] - lng, displayed[1] - lat];
  if (Math.abs(corr[0]) > MAX_CORRECTION_DEG || Math.abs(corr[1]) > MAX_CORRECTION_DEG) return next;
  return { ...next, corr };
}

/** Rijrichting in graden (0 = noord): het stuk route waar het voertuig nu rijdt, anders die van de backend. */
export function headingAt(m: Motion, now: number): number | undefined {
  const at = segmentAt(m, now);
  if (!at || !m.path) return m.bearing;
  const [a, b] = [m.path[at.i - 1], m.path[at.i]];
  const dx = (b[0] - a[0]) * M_LNG;
  const dy = (b[1] - a[1]) * M_LAT;
  if (!dx && !dy) return m.bearing;
  return ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360;
}

export const isMoving = (m: Motion) => !!m.path;
