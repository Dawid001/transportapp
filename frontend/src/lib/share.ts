"use client";

import { formatClock } from "./format";
import type { Journey } from "./types";

/** Reis delen: de backend bewaart de reis, de link opent hem live (ook voor iemand zonder de app). */

export async function createShareLink(journey: Journey): Promise<string> {
  const res = await fetch("/api/share", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(journey),
  });
  if (!res.ok) throw new Error(res.status === 400 ? "Deze reis kan niet (meer) gedeeld worden." : "Delen mislukt.");
  const { id } = (await res.json()) as { id: string };
  return `${window.location.origin}/?reis=${encodeURIComponent(id)}`;
}

/** Via het deelmenu van de telefoon, anders naar het klembord. */
export async function shareJourney(journey: Journey): Promise<"shared" | "copied" | "cancelled"> {
  const url = await createShareLink(journey);
  const last = journey.legs[journey.legs.length - 1];
  const text = `Volg mijn reis naar ${last.to.name} live (aankomst ${formatClock(journey.arrival)}).`;
  if (navigator.share) {
    try {
      await navigator.share({ title: "Mijn reis", text, url });
      return "shared";
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return "cancelled";
      // Delen niet toegestaan hier: dan toch kopiëren.
    }
  }
  await navigator.clipboard.writeText(url);
  return "copied";
}
