import type { ApiVehicle, LineVariant, LngLat, RouteStop, TripRoute } from "./types";

type FC = GeoJSON.FeatureCollection;
export type RouteGeo = { lines: FC; stops: FC };

// Op NL-breedte is een lengtegraad ~0,6× zo lang als een breedtegraad; genoeg voor "dichtstbijzijnde punt".
const LNG_SCALE = Math.cos((52 * Math.PI) / 180);

const MAX_OFF_ROUTE_M = 80;

function distanceM(a: LngLat, b: LngLat): number {
  return Math.hypot((a[0] - b[0]) * LNG_SCALE, a[1] - b[1]) * 111_320;
}

function nearestIndex(shape: LngLat[], [lng, lat]: LngLat): number {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < shape.length; i++) {
    const dx = (shape[i][0] - lng) * LNG_SCALE;
    const dy = shape[i][1] - lat;
    const d = dx * dx + dy * dy;
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}

/**
 * Is de halte al gepasseerd? OVapi volgt KV6 i.p.v. de GTFS-spec: bij STOPPED_AT staat het voertuig bij
 * currentStopSequence, maar bij IN_TRANSIT_TO is dat de halte waar het net vertrokken is.
 */
function isPassed(stop: RouteStop, vehicle: ApiVehicle | null): boolean {
  const current = vehicle?.currentStopSequence;
  if (current === undefined) return false;
  return stop.sequence < current || (stop.sequence === current && vehicle?.status !== "STOPPED_AT");
}

export function tripRouteGeo(route: TripRoute, vehicle: ApiVehicle | null): RouteGeo {
  const mode = vehicle?.mode ?? "other";
  const approximate = route.approximate;
  const lines: GeoJSON.Feature[] = [];

  if (route.shape && route.shape.length > 1) {
    if (vehicle) {
      // Route splitsen bij het voertuig: gereden deel grijs, nog te rijden deel in kleur.
      const pos: LngLat = [vehicle.lng, vehicle.lat];
      const i = nearestIndex(route.shape, pos);
      // Staat het voertuig (nog) niet op de route, bv. aan het eind van de vorige rit? Dan geen
      // verbindingslijntje naar het voertuig tekenen, want dat loopt dwars door de bebouwing.
      const onRoute = distanceM(route.shape[i], pos) <= MAX_OFF_ROUTE_M;
      const passed = onRoute ? [...route.shape.slice(0, i + 1), pos] : route.shape.slice(0, i + 1);
      const upcoming = onRoute ? [pos, ...route.shape.slice(i + 1)] : route.shape.slice(i);
      if (passed.length > 1) lines.push(line(passed, { passed: true, mode, approximate }));
      if (upcoming.length > 1) lines.push(line(upcoming, { passed: false, mode, approximate }));
    } else {
      lines.push(line(route.shape, { passed: false, mode, approximate }));
    }
  }

  const stops: GeoJSON.Feature[] = route.stops.map((s) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [s.lng, s.lat] },
    properties: { name: s.name, passed: isPassed(s, vehicle), mode },
  }));

  return { lines: { type: "FeatureCollection", features: lines }, stops: { type: "FeatureCollection", features: stops } };
}

export function lineRoutesGeo(variants: LineVariant[]): RouteGeo {
  return {
    lines: { type: "FeatureCollection", features: variants.map((v) => line(v.shape, { passed: false, mode: v.mode, approximate: v.approximate })) },
    stops: { type: "FeatureCollection", features: [] },
  };
}

/** De eerstvolgende haltes (inclusief de halte waar het voertuig nu staat). */
export function upcomingStops(route: TripRoute, vehicle: ApiVehicle | null): RouteStop[] {
  return route.stops.filter((s) => !isPassed(s, vehicle));
}

export function boundsOf(points: LngLat[]): [LngLat, LngLat] | null {
  if (!points.length) return null;
  let [minLng, minLat] = points[0];
  let [maxLng, maxLat] = points[0];
  for (const [lng, lat] of points) {
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}

function line(coordinates: LngLat[], properties: Record<string, unknown>): GeoJSON.Feature {
  return { type: "Feature", geometry: { type: "LineString", coordinates }, properties };
}
