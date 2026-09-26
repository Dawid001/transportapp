"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Place, PlanEndpoint, StopSummary } from "./types";

/**
 * Favorieten (haltes, plaatsen en routes), bewaard in de browser (localStorage).
 * "Mijn locatie" in een route wordt zonder coördinaten bewaard en bij gebruik opnieuw bepaald.
 */

export type SavedEndpoint = { kind: "stop"; stop: StopSummary } | { kind: "place"; place: Place } | { kind: "location" };
export type Favorite =
  | { kind: "stop"; stop: StopSummary }
  | { kind: "place"; place: Place }
  | { kind: "route"; from: SavedEndpoint; to: SavedEndpoint };

const KEY = "live-ov:favorites";
const EVENT = "live-ov:favorites";

function read(): string {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function write(list: Favorite[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // privévenster of opslag vol: favorieten gelden dan alleen voor deze sessie niet
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange); // wijzigingen in een ander tabblad
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

let cachedRaw = "";
let cachedList: Favorite[] = [];
function snapshot(): Favorite[] {
  const raw = read();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedList = JSON.parse(raw) as Favorite[];
    } catch {
      cachedList = [];
    }
  }
  return cachedList;
}
const EMPTY: Favorite[] = [];

export function toSaved(ep: PlanEndpoint): SavedEndpoint {
  return ep.kind === "location" ? { kind: "location" } : ep;
}

export const savedName = (ep: SavedEndpoint) => (ep.kind === "stop" ? ep.stop.name : ep.kind === "place" ? ep.place.name : "Mijn locatie");
const savedKey = (ep: SavedEndpoint) => (ep.kind === "stop" ? `s:${ep.stop.id}` : ep.kind === "place" ? `p:${ep.place.id}` : "loc");
export const favoriteKey = (f: Favorite) =>
  f.kind === "stop" ? `s:${f.stop.id}` : f.kind === "place" ? `p:${f.place.id}` : `r:${savedKey(f.from)}>${savedKey(f.to)}`;

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, snapshot, () => EMPTY);

  const toggle = useCallback((fav: Favorite) => {
    const list = snapshot();
    const key = favoriteKey(fav);
    write(list.some((f) => favoriteKey(f) === key) ? list.filter((f) => favoriteKey(f) !== key) : [fav, ...list]);
  }, []);

  const has = useCallback((fav: Favorite) => favorites.some((f) => favoriteKey(f) === favoriteKey(fav)), [favorites]);

  return { favorites, toggle, has };
}
