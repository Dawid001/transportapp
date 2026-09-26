import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import { RateLimitError } from "./fetchVehicles.js";

const { transit_realtime } = GtfsRealtimeBindings;

const FEED_URL = "https://gtfs.ovapi.nl/nl/tripUpdates.pb";

/**
 * Realtime tijden voor één halte (unix-seconden en vertraging in seconden).
 * `skipped`: de rit komt niet langs deze halte (ingekorte rit of omleiding).
 * `noData`: expliciet geen realtime informatie voor deze halte.
 */
export type StopUpdate = {
  arrivalTime?: number;
  arrivalDelay?: number;
  departureTime?: number;
  departureDelay?: number;
  skipped?: boolean;
  noData?: boolean;
};
/** `canceled`: de hele rit is uitgevallen (~18% van de ritten in de feed, vooral nog niet vertrokken ritten). */
export type TripUpdateInfo = { startDate?: string; canceled: boolean; stops: Map<number, StopUpdate> };

const STOP_SKIPPED = transit_realtime.TripUpdate.StopTimeUpdate.ScheduleRelationship.SKIPPED;
const STOP_NO_DATA = transit_realtime.TripUpdate.StopTimeUpdate.ScheduleRelationship.NO_DATA;
const TRIP_CANCELED = transit_realtime.TripDescriptor.ScheduleRelationship.CANCELED;

// protobufjs zet standaardwaarden op het prototype; alleen eigen properties staan echt in de feed.
const has = (obj: object | null | undefined, key: string) => !!obj && Object.hasOwn(obj, key);

/**
 * Haalt de verwachte tijden per rit op (~3,6 MB, ~7.400 ritten van bus/tram/metro; geen treinen).
 * Met `etag` een conditional request: `null` als de feed niet veranderd is.
 */
export async function fetchTripUpdates(etag?: string): Promise<{ etag?: string; updates: Map<string, TripUpdateInfo> } | null> {
  const headers: Record<string, string> = { "User-Agent": "live-ov-dev" };
  if (etag) headers["If-None-Match"] = etag;

  const res = await fetch(FEED_URL, { headers });
  if (res.status === 304) return null;
  if (res.status === 429) throw new RateLimitError("tripUpdates gaf HTTP 429 (rate limit, even wachten)");
  if (!res.ok) throw new Error(`tripUpdates gaf HTTP ${res.status}`);

  const feed = transit_realtime.FeedMessage.decode(new Uint8Array(await res.arrayBuffer()));
  const updates = new Map<string, TripUpdateInfo>();
  for (const entity of feed.entity) {
    const tu = entity.tripUpdate;
    const tripId = tu?.trip?.tripId;
    if (!tu || !tripId) continue;

    const stops = new Map<number, StopUpdate>();
    for (const u of tu.stopTimeUpdate ?? []) {
      if (!has(u, "stopSequence")) continue;
      const s: StopUpdate = {};
      if (u.scheduleRelationship === STOP_SKIPPED) s.skipped = true;
      if (u.scheduleRelationship === STOP_NO_DATA) s.noData = true;
      if (u.arrival) {
        if (has(u.arrival, "time")) s.arrivalTime = Number(u.arrival.time);
        if (has(u.arrival, "delay")) s.arrivalDelay = u.arrival.delay ?? undefined;
      }
      if (u.departure) {
        if (has(u.departure, "time")) s.departureTime = Number(u.departure.time);
        if (has(u.departure, "delay")) s.departureDelay = u.departure.delay ?? undefined;
      }
      stops.set(u.stopSequence!, s);
    }
    updates.set(tripId, { startDate: tu.trip?.startDate || undefined, canceled: tu.trip?.scheduleRelationship === TRIP_CANCELED, stops });
  }
  return { etag: res.headers.get("etag") ?? undefined, updates };
}
