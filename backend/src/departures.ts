import type { DatabaseSync } from "node:sqlite";
import type { Mode, TripInfo } from "./gtfs/lookup.js";
import { trainLabel } from "./ns.js";
import type { StopGroup } from "./stopIndex.js";
import { serviceDate, serviceDayStart } from "./time.js";
import type { Timetable } from "./timetable.js";
import type { TrainTime } from "./nsRealtime.js";
import type { TripUpdateInfo } from "./tripUpdates.js";

export type Departure = {
  tripId: string;
  line?: string;
  headsign?: string;
  mode: Mode;
  agencyName?: string;
  /** Spoor of perron (bij treinen het actuele spoor van NS). */
  platform?: string;
  /** Het spoor is gewijzigd t.o.v. de planning. */
  platformChanged?: boolean;
  /** Unix-seconden. */
  scheduled: number;
  expected?: number;
  /** Seconden; negatief = te vroeg. */
  delay?: number;
  canceled?: boolean;
  /** De rit komt niet langs deze halte (ingekort/omgeleid). */
  skipped?: boolean;
  /** Er rijdt nu een voertuig van deze rit op de kaart. */
  live?: boolean;
};

type Deps = {
  db: DatabaseSync;
  timetable: Timetable;
  lookup: (tripId: string) => TripInfo | null;
  tripUpdate: (tripId: string) => TripUpdateInfo | undefined;
  liveTripIds: () => Set<string>;
};

export function createDepartures({ db, timetable, lookup, tripUpdate, liveTripIds }: Deps) {
  const platformStmt = db.prepare("SELECT platform_code FROM stops WHERE stop_id = ?");
  const platformCache = new Map<string, string | undefined>();
  const platformOf = (stopId: string) => {
    if (!platformCache.has(stopId)) {
      const row = platformStmt.get(stopId) as { platform_code: string | null } | undefined;
      platformCache.set(stopId, row?.platform_code ?? undefined);
    }
    return platformCache.get(stopId);
  };

  /**
   * Vertrekken vanaf een halte tussen `fromSec` en `fromSec + windowSec` (unix-seconden).
   * Kijkt naar de dienstdagen van gisteren, vandaag en morgen, want ritten na middernacht horen
   * bij de dienstdag van gisteren (tijden ≥ 24:00).
   */
  function forStop(
    group: StopGroup,
    fromSec: number,
    { windowSec = 90 * 60, limit = 40, trains }: { windowSec?: number; limit?: number; trains?: Map<string, TrainTime> } = {},
  ): Departure[] {
    const live = liveTripIds();
    const out: Departure[] = [];
    const dates = [serviceDate(1), serviceDate(0), serviceDate(-1)];

    for (const date of dates) {
      const dayStart = serviceDayStart(date);
      // Snel overslaan als dit venster buiten deze dienstdag valt (ritten duren hooguit ~30 uur na de start van de dag).
      if (fromSec + windowSec < dayStart || fromSec > dayStart + 30 * 3600) continue;
      const trips = timetable.day(date);
      const from = fromSec - dayStart;
      const to = from + windowSec;

      for (const stopId of group.stopIds) {
        for (const { patternId, index } of timetable.patternsByStop.get(stopId) ?? []) {
          const pattern = timetable.patterns.get(patternId)!;
          // Aan de eindhalte vertrekt niets.
          if (index === pattern.stopIds.length - 1) continue;
          for (const trip of trips.get(patternId) ?? []) {
            const profile = timetable.profiles.get(trip.profileId);
            if (!profile) continue;
            const dep = trip.start + profile.dep[index];
            // Ook net vertrokken ritten meenemen: met vertraging kunnen ze nog komen.
            if (dep < from - 30 * 60 || dep > to) continue;

            const update = tripUpdate(trip.tripId);
            const matchesDay = !update?.startDate || update.startDate === date;
            const u = matchesDay ? update?.stops.get(pattern.sequences[index]) : undefined;
            const scheduled = dayStart + dep;
            let expected: number | undefined;
            let delay: number | undefined;
            if (u) {
              delay = u.departureDelay ?? u.arrivalDelay;
              expected = u.departureTime ?? u.arrivalTime ?? (delay !== undefined ? scheduled + delay : undefined);
            } else if (matchesDay && update) {
              // Geen update voor deze halte: de laatste bekende vertraging van een eerdere halte loopt door.
              let last: number | undefined;
              for (let i = index - 1; i >= 0 && last === undefined; i--) {
                const prev = update.stops.get(pattern.sequences[i]);
                if (prev && !prev.skipped) last = prev.departureDelay ?? prev.arrivalDelay;
              }
              if (last !== undefined) {
                delay = last;
                expected = scheduled + last;
              }
            }
            const shown = expected ?? scheduled;
            if (shown < fromSec - 60 || shown > fromSec + windowSec) continue;

            const info = lookup(trip.tripId);
            // Treinen: realtime van NS (op treinnummer, en alleen als het om dezelfde dag gaat).
            const ns = info?.shortName ? trains?.get(info.shortName) : undefined;
            const train = ns && Math.abs(ns.planned - scheduled) < 30 * 60 ? ns : undefined;
            if (train) {
              expected = train.actual;
              delay = train.actual - train.planned;
            }
            out.push({
              tripId: trip.tripId,
              // Treinen als op de kaart: IC, SPR, RS18 … i.p.v. "Intercity".
              line: (info?.mode ?? pattern.mode) === "train" ? trainLabel(info?.line, info?.line ?? "") : info?.line,
              headsign: info?.headsign,
              mode: info?.mode ?? pattern.mode,
              agencyName: info?.agencyName,
              platform: train?.actualTrack ?? platformOf(stopId),
              platformChanged: train && train.actualTrack !== train.plannedTrack ? true : undefined,
              scheduled,
              expected,
              delay,
              canceled: (matchesDay && update?.canceled) || train?.cancelled ? true : undefined,
              skipped: u?.skipped ? true : undefined,
              live: live.has(trip.tripId) || undefined,
            });
          }
        }
      }
    }

    // Dezelfde rit kan in één groep meerdere keren voorkomen (bv. een lus): alleen het eerste vertrek.
    const seen = new Set<string>();
    return out
      .sort((a, b) => (a.expected ?? a.scheduled) - (b.expected ?? b.scheduled))
      .filter((d) => !seen.has(d.tripId) && seen.add(d.tripId))
      .slice(0, limit);
  }

  return { forStop };
}
