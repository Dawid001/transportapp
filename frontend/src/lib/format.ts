import type { Mode } from "./types";

export const MODE_COLORS: Record<Mode, string> = {
  bus: "#2563eb",
  tram: "#16a34a",
  metro: "#db2777",
  train: "#ca8a04",
  ferry: "#0891b2",
  other: "#6b7280",
};

export const MODE_LABELS: Record<Mode, string> = {
  bus: "Bus",
  tram: "Tram",
  metro: "Metro",
  train: "Trein",
  ferry: "Veerboot",
  other: "Onbekend",
};

// GTFS-RT VehicleStopStatus
export const STATUS_LABELS: Record<string, string> = {
  STOPPED_AT: "Staat bij een halte",
  IN_TRANSIT_TO: "Onderweg naar de volgende halte",
  INCOMING_AT: "Komt aan bij een halte",
};

/** Voertuigen zonder update in deze tijd tonen we half doorzichtig. */
export const STALE_AFTER_SECONDS = 5 * 60;

export function formatAgo(seconds: number): string {
  if (seconds < 5) return "zojuist";
  if (seconds < 60) return `${Math.round(seconds)} s geleden`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} min geleden`;
  return `${Math.round(seconds / 3600)} uur geleden`;
}

/** Unix-seconden → "17:23". */
export function formatClock(unixSec: number): string {
  return new Date(unixSec * 1000).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
}

/** Vertraging in hele minuten; minder dan een halve minuut telt als op tijd. */
export function delayMinutes(delaySec: number | undefined): number {
  return delaySec === undefined ? 0 : Math.round(delaySec / 60);
}

/** Kleur voor een vertraging: groen op tijd/te vroeg, oranje 2–4 min, rood 5+ min. */
export function delayTone(delaySec: number | undefined): "ok" | "late" | "veryLate" {
  const min = delayMinutes(delaySec);
  if (min >= 5) return "veryLate";
  if (min >= 2) return "late";
  return "ok";
}

export const DELAY_TONE_CLASSES = {
  ok: "text-emerald-600 dark:text-emerald-400",
  late: "text-amber-600 dark:text-amber-400",
  veryLate: "text-red-600 dark:text-red-400",
} as const;

/** "+3", "−1" of "" (op tijd). */
export function formatDelay(delaySec: number | undefined): string {
  const min = delayMinutes(delaySec);
  if (min > 0) return `+${min}`;
  if (min < 0) return `−${-min}`;
  return "";
}
