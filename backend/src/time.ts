const TZ = "Europe/Amsterdam";

/** Datum als YYYYMMDD in Nederlandse tijd, `daysBack` dagen geleden. */
export function serviceDate(daysBack = 0): string {
  const d = new Date(Date.now() - daysBack * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" })
    .format(d)
    .replaceAll("-", "");
}

/** Verschil tussen Nederlandse tijd en UTC op een moment, in ms (+1 of +2 uur). */
function amsterdamOffsetMs(utcMs: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const get = (type: string) => Number(parts.find((p) => p.type === type)!.value);
  return Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second")) - utcMs;
}

/**
 * Unix-seconden van het begin van een GTFS-dienstdag (YYYYMMDD). GTFS-tijden tellen vanaf
 * "12:00 min 12 uur" lokale tijd; dat is middernacht, behalve op de dagen van de zomertijdwissel.
 */
export function serviceDayStart(date: string): number {
  const y = Number(date.slice(0, 4));
  const m = Number(date.slice(4, 6));
  const d = Number(date.slice(6, 8));
  const noonUtcGuess = Date.UTC(y, m - 1, d, 12);
  const noonLocal = noonUtcGuess - amsterdamOffsetMs(noonUtcGuess);
  return Math.round(noonLocal / 1000) - 12 * 3600;
}
