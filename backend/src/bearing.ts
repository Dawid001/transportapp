/**
 * Rijrichting per voertuig (graden, 0 = noord, met de klok mee) voor het pijltje op de kaart.
 * Voorkeur: de route vóór het voertuig; anders de richting uit de feed; anders hoe het sinds de vorige
 * positie bewogen is. Een voertuig dat stilstaat houdt zijn laatst bekende richting.
 */

const M_LAT = 111_320;
const M_LNG = 111_320 * Math.cos((52 * Math.PI) / 180);
/** Pas vanaf zoveel meter verplaatsing een richting afleiden (GPS-ruis is een paar meter). */
const MIN_MOVE_M = 20;

type LngLat = [number, number];

export function bearingBetween(a: LngLat, b: LngLat): number {
  const deg = (Math.atan2((b[0] - a[0]) * M_LNG, (b[1] - a[1]) * M_LAT) * 180) / Math.PI;
  return Math.round((deg + 360) % 360);
}

const distance = (a: LngLat, b: LngLat) => Math.hypot((b[0] - a[0]) * M_LNG, (b[1] - a[1]) * M_LAT);

export function createBearingTracker() {
  const last = new Map<string, { pos: LngLat; bearing?: number }>();

  return function bearingFor(id: string, lat: number, lng: number, opts: { path?: LngLat[]; hint?: number } = {}): number | undefined {
    const pos: LngLat = [lng, lat];
    const prev = last.get(id);
    let bearing: number | undefined;

    // Route vóór het voertuig: eerste punt dat ver genoeg weg ligt.
    const ahead = opts.path?.find((p) => distance(pos, p) >= MIN_MOVE_M);
    if (ahead) bearing = bearingBetween(pos, ahead);
    else if (opts.hint !== undefined && Number.isFinite(opts.hint)) bearing = Math.round(((opts.hint % 360) + 360) % 360);
    else if (prev && distance(prev.pos, pos) >= MIN_MOVE_M) bearing = bearingBetween(prev.pos, pos);
    else bearing = prev?.bearing;

    // Positie alleen bijwerken na echte verplaatsing, zodat langzaam rijden ook een richting oplevert.
    if (!prev || distance(prev.pos, pos) >= MIN_MOVE_M) last.set(id, { pos, bearing });
    else prev.bearing = bearing;
    if (last.size > 20_000) last.clear();
    return bearing;
  };
}
