"use client";

import type { Journey } from "./types";

/**
 * Pushmeldingen voor een gevolgde reis. De backend volgt de reis en stuurt de meldingen, ook als de app
 * dicht is. Werkt alleen in een veilige omgeving (HTTPS of localhost); op iPhone alleen als de app via
 * "Zet op beginscherm" is geïnstalleerd.
 */

const WATCH_KEY = "live-ov:watch";

export type PushSupport = "ok" | "insecure" | "unsupported" | "ios-install" | "denied";

export function pushSupport(): PushSupport {
  if (typeof window === "undefined") return "unsupported";
  if (!window.isSecureContext) return "insecure";
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true;
  if (ios && !standalone) return "ios-install";
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return "unsupported";
  if (Notification.permission === "denied") return "denied";
  return "ok";
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !window.isSecureContext) return null;
  return navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
}

function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  const out = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

/** Toestemming vragen en een push-abonnement maken (of het bestaande teruggeven). */
async function subscription(): Promise<PushSubscriptionJSON> {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Je hebt meldingen niet toegestaan.");
  const reg = (await registerServiceWorker()) ?? (await navigator.serviceWorker.ready);
  await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    const { publicKey } = (await (await fetch("/api/push/key")).json()) as { publicKey: string };
    sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(publicKey) });
  }
  return sub.toJSON();
}

/** Sleutel om te herkennen of dít de gevolgde reis is. */
export const journeyKey = (j: Journey) => j.legs.map((l) => (l.type === "transit" ? `${l.tripId}:${l.fromSequence}` : "w")).join("|");

export type ActiveWatch = { id: string; key: string };

export function activeWatch(): ActiveWatch | null {
  try {
    return JSON.parse(localStorage.getItem(WATCH_KEY) ?? "null") as ActiveWatch | null;
  } catch {
    return null;
  }
}

function storeWatch(w: ActiveWatch | null) {
  try {
    if (w) localStorage.setItem(WATCH_KEY, JSON.stringify(w));
    else localStorage.removeItem(WATCH_KEY);
  } catch {
    // opslag niet beschikbaar: alleen voor deze sessie
  }
}

/** Deze reis volgen: de backend stuurt meldingen tot je er bent. */
export async function watchJourney(journey: Journey): Promise<ActiveWatch> {
  const sub = await subscription();
  const legs = journey.legs.map((l) =>
    l.type === "walk"
      ? { type: "walk", departure: l.departure, arrival: l.arrival, toName: l.to.name }
      : {
          type: "transit",
          tripId: l.tripId,
          mode: l.mode,
          line: l.line,
          headsign: l.headsign,
          fromName: l.from.name,
          toName: l.to.name,
          fromStopId: l.from.stopId,
          toStopId: l.to.stopId,
          fromPlatform: l.from.platform,
          fromSequence: l.fromSequence,
          toSequence: l.toSequence,
          departure: l.departure,
          arrival: l.arrival,
        },
  );
  const res = await fetch("/api/watch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscription: sub, legs }),
  });
  if (!res.ok) throw new Error("De server kon je reis niet volgen.");
  const { id } = (await res.json()) as { id: string };
  const w = { id, key: journeyKey(journey) };
  storeWatch(w);
  return w;
}

export async function unwatchJourney(w: ActiveWatch) {
  storeWatch(null);
  await fetch(`/api/watch/${encodeURIComponent(w.id)}`, { method: "DELETE" }).catch(() => {});
}
