import GtfsRealtimeBindings from "gtfs-realtime-bindings";

const { transit_realtime } = GtfsRealtimeBindings;

const FEED_URL = "https://gtfs.ovapi.nl/nl/vehiclePositions.pb";

export type Vehicle = {
  id: string;
  operator: string;
  label?: string;
  routeId?: string;
  tripId?: string;
  latitude: number;
  longitude: number;
  bearing?: number;
  speed?: number;
  currentStopSequence?: number;
  stopId?: string;
  status?: string;
  timestamp?: number;
};

// protobufjs zet standaardwaarden (0, "") op het prototype; alleen eigen properties zitten echt in de feed.
function present<T extends object, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
  return obj && Object.hasOwn(obj, key) ? obj[key] : undefined;
}

// OVapi entity-id's zien eruit als "2026-09-26:EBS:4071:6017" (datum:vervoerder:lijnplanningsnummer:rit).
function operatorFromEntityId(entityId: string): string {
  return entityId.split(":")[1] ?? "UNKNOWN";
}

export type FeedResult = { feedTimestamp: number; etag?: string; vehicles: Vehicle[]; withoutPosition: string[] };

export class RateLimitError extends Error {}

/**
 * Haalt de vehicle positions op. Met `etag` van de vorige keer doet OVapi een conditional request:
 * is de feed niet veranderd, dan krijg je `null` terug (HTTP 304).
 */
export async function fetchVehicles(etag?: string): Promise<FeedResult | null> {
  const headers: Record<string, string> = { "User-Agent": "live-ov-dev" };
  if (etag) headers["If-None-Match"] = etag;

  const res = await fetch(FEED_URL, { headers });
  if (res.status === 304) return null;
  // OVapi staat maar ~2 requests per minuut toe; daarboven volgt een 429.
  if (res.status === 429) throw new RateLimitError("Feed gaf HTTP 429 (rate limit, even wachten)");
  if (!res.ok) throw new Error(`Feed gaf HTTP ${res.status}`);

  const feed = transit_realtime.FeedMessage.decode(new Uint8Array(await res.arrayBuffer()));
  const vehicles: Vehicle[] = [];
  const withoutPosition: string[] = [];

  for (const entity of feed.entity) {
    const v = entity.vehicle;
    if (!v) continue;
    const operator = operatorFromEntityId(entity.id);

    if (!v.position || (v.position.latitude === 0 && v.position.longitude === 0)) {
      withoutPosition.push(operator);
      continue;
    }

    vehicles.push({
      id: entity.id,
      operator,
      label: v.vehicle?.label ?? undefined,
      routeId: v.trip?.routeId ?? undefined,
      tripId: v.trip?.tripId ?? undefined,
      latitude: v.position.latitude,
      longitude: v.position.longitude,
      bearing: present(v.position, "bearing") ?? undefined,
      speed: present(v.position, "speed") ?? undefined,
      currentStopSequence: v.currentStopSequence ?? undefined,
      stopId: present(v, "stopId") || undefined,
      status: v.currentStatus != null ? transit_realtime.VehiclePosition.VehicleStopStatus[v.currentStatus] : undefined,
      timestamp: v.timestamp != null ? Number(v.timestamp) : undefined,
    });
  }

  return { feedTimestamp: Number(feed.header.timestamp), etag: res.headers.get("etag") ?? undefined, vehicles, withoutPosition };
}
