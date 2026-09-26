import type { Journey, LngLat, PlanEndpoint } from "./types";

export function endpointCoords(ep: PlanEndpoint): LngLat {
  return ep.kind === "stop" ? [ep.stop.lng, ep.stop.lat] : ep.kind === "place" ? [ep.place.lng, ep.place.lat] : [ep.lng, ep.lat];
}

/** Query-parameters voor /api/plan (`fromStop=…` of `fromLat/fromLng/fromName`). */
export function endpointParams(prefix: "from" | "to", ep: PlanEndpoint): Record<string, string> {
  if (ep.kind === "stop") return { [`${prefix}Stop`]: ep.stop.id };
  const [lng, lat] = endpointCoords(ep);
  const name = ep.kind === "place" ? ep.place.name : "Mijn locatie";
  return { [`${prefix}Lat`]: lat.toFixed(6), [`${prefix}Lng`]: lng.toFixed(6), [`${prefix}Name`]: name };
}

/** Reis als kaartlagen: ritten in de kleur van de vervoerswijze, lopen gestippeld, in-/uitstaphaltes als punten. */
export function journeyGeo(journey: Journey | undefined, from: PlanEndpoint | null, to: PlanEndpoint | null): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];
  for (const leg of journey?.legs ?? []) {
    if (leg.type === "walk") {
      features.push({
        type: "Feature",
        geometry: { type: "LineString", coordinates: [[leg.from.lng, leg.from.lat], [leg.to.lng, leg.to.lat]] },
        properties: { kind: "walk" },
      });
    } else {
      features.push({ type: "Feature", geometry: { type: "LineString", coordinates: leg.path }, properties: { kind: "transit", mode: leg.mode } });
      for (const p of [leg.from, leg.to]) {
        features.push({ type: "Feature", geometry: { type: "Point", coordinates: [p.lng, p.lat] }, properties: { kind: "stop", mode: leg.mode, name: p.name } });
      }
    }
  }
  if (from) features.push({ type: "Feature", geometry: { type: "Point", coordinates: endpointCoords(from) }, properties: { kind: "from" } });
  if (to) features.push({ type: "Feature", geometry: { type: "Point", coordinates: endpointCoords(to) }, properties: { kind: "to" } });
  return { type: "FeatureCollection", features };
}

/** Alle coördinaten van een reis (om erop in te zoomen). */
export function journeyPoints(journey: Journey): LngLat[] {
  return journey.legs.flatMap((l) => (l.type === "walk" ? [[l.from.lng, l.from.lat] as LngLat, [l.to.lng, l.to.lat] as LngLat] : l.path));
}
