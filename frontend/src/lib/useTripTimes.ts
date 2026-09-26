"use client";

import { useEffect, useState } from "react";
import type { StopTime, TripStopTimes } from "./types";

// De backend haalt verwachte tijden eens per minuut op; elke 30 s vragen pikt dat snel genoeg op.
const REFRESH_MS = 30_000;

/** Geplande en verwachte tijden per halte van een rit, ververst zolang de component leeft. */
export function useTripTimes(tripId: string | undefined): TripStopTimes | null {
  const [times, setTimes] = useState<TripStopTimes | null>(null);

  useEffect(() => {
    if (!tripId) return;
    let controller = new AbortController();
    const load = () => {
      controller.abort();
      controller = new AbortController();
      fetch(`/api/trips/${encodeURIComponent(tripId)}/times`, { signal: controller.signal })
        .then((res) => (res.ok ? (res.json() as Promise<TripStopTimes>) : null))
        .then((data) => data && setTimes(data))
        .catch(() => {});
    };
    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, [tripId]);

  // Alleen teruggeven als het bij deze rit hoort (na wisselen van voertuig).
  return times?.tripId === tripId ? times : null;
}

/** Tijd om te tonen: verwacht als dat er is, anders gepland (aankomst, of vertrek bij de beginhalte). */
export function displayTime(t: StopTime): { time?: number; scheduled?: number } {
  return {
    time: t.expectedArrival ?? t.expectedDeparture ?? t.scheduledArrival ?? t.scheduledDeparture,
    scheduled: t.scheduledArrival ?? t.scheduledDeparture,
  };
}
