import { createDepartures } from "./departures.js";
import { openGtfs } from "./gtfs/lookup.js";
import { createMotionEstimator } from "./motion.js";
import { trainLabel } from "./ns.js";
import { createPlanner } from "./planner.js";
import { createStopIndex } from "./stopIndex.js";
import { createTimetable } from "./timetable.js";
import type { TripUpdateInfo } from "./tripUpdates.js";

/** Live gegevens die de context nodig heeft, maar die de server zelf bijhoudt (en die een wissel overleven). */
export type LiveSources = {
  tripUpdate: (tripId: string) => TripUpdateInfo | undefined;
  liveTripIds: () => Set<string>;
};

/**
 * Alles wat uit één versie van de dienstregeling wordt opgebouwd. Bij een nieuwe versie bouwt de server
 * een nieuwe context en wisselt in één keer (zie gtfsUpdater.ts), zonder herstart.
 */
export function buildContext(dbPath: string, live: LiveSources) {
  const started = Date.now();
  const gtfs = openGtfs(dbPath);
  const timetable = createTimetable(gtfs.db);
  const stopIndex = createStopIndex(gtfs.db, timetable);

  const departures = createDepartures({
    db: gtfs.db,
    timetable,
    lookup: (tripId) => gtfs.lookup(tripId),
    tripUpdate: live.tripUpdate,
    liveTripIds: live.liveTripIds,
  });

  const planner = createPlanner({
    db: gtfs.db,
    timetable,
    lookup: (tripId) => gtfs.lookup(tripId),
    lineLabel: (info, mode) => (mode === "train" ? trainLabel(info?.line, info?.line ?? "") : info?.line),
    tripShape: (tripId) => {
      const route = gtfs.tripRoute(tripId);
      return route && !route.approximate ? route.shape : null;
    },
    realtime: (tripId, date) => {
      const u = live.tripUpdate(tripId);
      if (!u || (u.startDate && u.startDate !== date)) return undefined;
      return {
        canceled: u.canceled,
        at: (sequence) => {
          const st = u.stops.get(sequence);
          if (!st || st.skipped) return undefined;
          return { dep: st.departureTime, arr: st.arrivalTime ?? st.departureTime };
        },
      };
    },
  });

  // Snelheid/pad van bussen; de historie begint na een wissel opnieuw (kost 1–2 minuten voorspelling).
  const motion = createMotionEstimator(gtfs.tripRoute);

  console.log(`Dienstregeling geladen uit ${dbPath.split(/[\\/]/).pop()} (${Date.now() - started} ms)`);
  return { dbPath, gtfs, timetable, stopIndex, departures, planner, motion, close: () => gtfs.close() };
}

export type AppContext = ReturnType<typeof buildContext>;
