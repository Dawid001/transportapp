import type { DatabaseSync } from "node:sqlite";
import type { Mode } from "./gtfs/lookup.js";

// https://gtfs.org/documentation/schedule/reference/#routestxt (route_type)
const MODES: Record<number, Mode> = { 0: "tram", 1: "metro", 2: "train", 3: "bus", 4: "ferry" };

/** Een haltepatroon: welke haltes een rit aandoet, in volgorde. */
export type Pattern = { id: number; stopIds: string[]; sequences: number[]; mode: Mode };

/** Een rit op een dienstdag. Tijden = start + offsets van het tijdprofiel (seconden sinds begin dienstdag). */
export type DayTrip = { tripId: string; patternId: number; start: number; profileId: number };

/** Aankomst- en vertrekoffsets per halte, in seconden na de start van de rit. */
export type Profile = { arr: Int32Array; dep: Int32Array };

/**
 * De dienstregeling in het geheugen: haltepatronen en tijdprofielen (voor alle dagen), plus per dienstdag
 * welke ritten er rijden. Basis voor vertrektijden per halte en de reisplanner.
 */
export function createTimetable(db: DatabaseSync) {
  const started = Date.now();

  // Patronen met hun vervoerswijze (via één willekeurige rit per patroon).
  const patterns = new Map<number, Pattern>();
  const rows = db
    .prepare(
      `SELECT p.pattern_id, p.stops, r.route_type
       FROM patterns p
       JOIN (SELECT pattern_id, MIN(trip_id) AS trip_id FROM trip_patterns GROUP BY pattern_id) x ON x.pattern_id = p.pattern_id
       JOIN trips t ON t.trip_id = x.trip_id
       JOIN routes r ON r.route_id = t.route_id`,
    )
    .all() as { pattern_id: number; stops: string; route_type: number }[];
  for (const row of rows) {
    const stops = JSON.parse(row.stops) as [number, string][];
    patterns.set(row.pattern_id, {
      id: row.pattern_id,
      stopIds: stops.map((s) => s[1]),
      sequences: stops.map((s) => s[0]),
      mode: MODES[row.route_type] ?? "other",
    });
  }

  // Per halte: in welke patronen (en op welke positie) hij voorkomt.
  const patternsByStop = new Map<string, { patternId: number; index: number }[]>();
  for (const p of patterns.values()) {
    p.stopIds.forEach((stopId, index) => {
      const list = patternsByStop.get(stopId);
      if (list) list.push({ patternId: p.id, index });
      else patternsByStop.set(stopId, [{ patternId: p.id, index }]);
    });
  }

  const profiles = new Map<number, Profile>();
  for (const row of db.prepare("SELECT profile_id, offsets FROM time_profiles").all() as { profile_id: number; offsets: string }[]) {
    const offsets = JSON.parse(row.offsets) as (number | [number, number])[];
    profiles.set(row.profile_id, {
      arr: Int32Array.from(offsets, (o) => (Array.isArray(o) ? o[0] : o)),
      dep: Int32Array.from(offsets, (o) => (Array.isArray(o) ? o[1] : o)),
    });
  }

  const tripsOfDay = db.prepare(`
    SELECT tp.trip_id, tp.pattern_id, tp.start_sec, tp.profile_id
    FROM trips t
    JOIN trip_patterns tp ON tp.trip_id = t.trip_id
    WHERE t.service_id IN (SELECT service_id FROM calendar_dates WHERE date = ? AND exception_type = 1)
      AND tp.start_sec IS NOT NULL`);

  // Per dienstdag (YYYYMMDD): ritten per patroon, gesorteerd op starttijd. We houden een paar dagen vast.
  const days = new Map<string, Map<number, DayTrip[]>>();

  function day(date: string): Map<number, DayTrip[]> {
    let byPattern = days.get(date);
    if (byPattern) return byPattern;
    const t0 = Date.now();
    byPattern = new Map();
    let count = 0;
    for (const row of tripsOfDay.all(date) as { trip_id: string; pattern_id: number; start_sec: number; profile_id: number }[]) {
      const trip: DayTrip = { tripId: row.trip_id, patternId: row.pattern_id, start: row.start_sec, profileId: row.profile_id };
      const list = byPattern.get(row.pattern_id);
      if (list) list.push(trip);
      else byPattern.set(row.pattern_id, [trip]);
      count++;
    }
    for (const list of byPattern.values()) list.sort((a, b) => a.start - b.start);
    if (days.size >= 4) days.delete(days.keys().next().value!);
    days.set(date, byPattern);
    console.log(`Dienstregeling ${date}: ${count.toLocaleString("nl-NL")} ritten geladen (${Date.now() - t0} ms)`);
    return byPattern;
  }

  console.log(
    `Dienstregeling: ${patterns.size.toLocaleString("nl-NL")} patronen, ${profiles.size.toLocaleString("nl-NL")} tijdprofielen (${Date.now() - started} ms)`,
  );

  return { patterns, patternsByStop, profiles, day };
}

export type Timetable = ReturnType<typeof createTimetable>;
