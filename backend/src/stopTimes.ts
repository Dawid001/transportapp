import type { TripRoute } from "./gtfs/lookup.js";
import { serviceDate, serviceDayStart } from "./time.js";
import type { TripUpdateInfo } from "./tripUpdates.js";

export type StopTime = {
  sequence: number;
  /** Geplande aankomst/vertrek (unix-seconden). */
  scheduledArrival?: number;
  scheduledDeparture?: number;
  /** Verwachte aankomst/vertrek (unix-seconden), alleen met realtime data. */
  expectedArrival?: number;
  expectedDeparture?: number;
  /** Vertraging in seconden (negatief = te vroeg). */
  delay?: number;
  /** De rit komt niet langs deze halte (ingekort of omgeleid). */
  skipped?: boolean;
};

export type TripStopTimes = { tripId: string; serviceDate: string; realtime: boolean; canceled: boolean; stops: StopTime[] };

/**
 * Kiest de dienstdag van een rit zonder realtime data: vandaag, of gisteren als de rit dan nu
 * (nog) zou rijden, zoals nachtbussen met tijden na 24:00.
 */
function guessServiceDate(route: TripRoute, nowSec: number): string {
  const first = route.stops.find((s) => s.departure !== undefined)?.departure;
  const last = route.stops.findLast((s) => s.arrival !== undefined)?.arrival;
  if (first === undefined || last === undefined) return serviceDate(0);
  const yesterday = serviceDate(1);
  const start = serviceDayStart(yesterday);
  return nowSec >= start + first - 3600 && nowSec <= start + last + 3600 ? yesterday : serviceDate(0);
}

/**
 * Geplande en verwachte tijden per halte. Zonder update voor een halte geldt de laatst bekende
 * vertraging van een eerdere halte (zoals de GTFS-realtime-spec voorschrijft).
 */
export function tripStopTimes(route: TripRoute, update: TripUpdateInfo | undefined, nowSec: number): TripStopTimes {
  const date = update?.startDate ?? guessServiceDate(route, nowSec);
  const dayStart = serviceDayStart(date);
  let lastDelay: number | undefined;

  const stops = route.stops.map((stop): StopTime => {
    const t: StopTime = { sequence: stop.sequence };
    if (stop.arrival !== undefined) t.scheduledArrival = dayStart + stop.arrival;
    if (stop.departure !== undefined) t.scheduledDeparture = dayStart + stop.departure;

    const u = update?.stops.get(stop.sequence);
    const hasTimes = u && (u.arrivalTime ?? u.arrivalDelay ?? u.departureTime ?? u.departureDelay) !== undefined;
    if (u?.skipped || update?.canceled) {
      t.skipped = true;
    } else if (u?.noData) {
      lastDelay = undefined; // vanaf hier alleen de dienstregeling
    } else if (u && hasTimes) {
      const arrDelay = u.arrivalDelay ?? (u.arrivalTime && t.scheduledArrival ? u.arrivalTime - t.scheduledArrival : undefined);
      const depDelay = u.departureDelay ?? (u.departureTime && t.scheduledDeparture ? u.departureTime - t.scheduledDeparture : undefined);
      t.expectedArrival = u.arrivalTime ?? (t.scheduledArrival !== undefined && arrDelay !== undefined ? t.scheduledArrival + arrDelay : undefined);
      t.expectedDeparture = u.departureTime ?? (t.scheduledDeparture !== undefined && depDelay !== undefined ? t.scheduledDeparture + depDelay : undefined);
      t.delay = arrDelay ?? depDelay;
      lastDelay = depDelay ?? arrDelay ?? lastDelay;
    } else if (lastDelay !== undefined) {
      if (t.scheduledArrival !== undefined) t.expectedArrival = t.scheduledArrival + lastDelay;
      if (t.scheduledDeparture !== undefined) t.expectedDeparture = t.scheduledDeparture + lastDelay;
      t.delay = lastDelay;
    }
    return t;
  });

  return { tripId: route.tripId, serviceDate: date, realtime: !!update, canceled: !!update?.canceled, stops };
}

/**
 * Vertraging van een voertuig: die bij de halte waar het staat (STOPPED_AT) of naartoe rijdt.
 * Let op: bij IN_TRANSIT_TO is currentStopSequence in OVapi de vertrokken halte (KV6).
 */
export function vehicleDelay(update: TripUpdateInfo | undefined, currentStopSequence: number | undefined, status: string | undefined): number | undefined {
  if (!update || update.stops.size === 0) return undefined;
  const target = currentStopSequence === undefined ? -Infinity : status === "STOPPED_AT" ? currentStopSequence : currentStopSequence + 0.5;
  let best: { seq: number; delay: number } | undefined;
  let before: { seq: number; delay: number } | undefined;
  for (const [seq, u] of update.stops) {
    if (u.skipped) continue;
    const delay = u.arrivalDelay ?? u.departureDelay;
    if (delay === undefined) continue;
    if (seq >= target) {
      if (!best || seq < best.seq) best = { seq, delay };
    } else if (!before || seq > before.seq) {
      before = { seq, delay };
    }
  }
  return (best ?? before)?.delay;
}
