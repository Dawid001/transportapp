"use client";

import { useSyncExternalStore } from "react";
import type { Place, StopSummary } from "./types";

/** Recent gekozen haltes en plaatsen in de zoekvelden (Van en Naar samen), bewaard in de browser. */

export type Recent = { kind: "stop"; stop: StopSummary } | { kind: "place"; place: Place };

const KEY = "live-ov:recent";
const EVENT = "live-ov:recent";
const MAX = 5;

export const recentKey = (r: Recent) => (r.kind === "stop" ? `s:${r.stop.id}` : `p:${r.place.id}`);

function read(): string {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

let cachedRaw = "";
let cachedList: Recent[] = [];
function snapshot(): Recent[] {
  const raw = read();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedList = JSON.parse(raw) as Recent[];
    } catch {
      cachedList = [];
    }
  }
  return cachedList;
}
const EMPTY: Recent[] = [];

export function useRecents(): Recent[] {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY);
}

/** Bovenaan zetten (en een eerdere keer weghalen). */
export function addRecent(item: Recent) {
  const key = recentKey(item);
  const list = [item, ...snapshot().filter((r) => recentKey(r) !== key)].slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // opslag niet beschikbaar: dan geen recente zoekopdrachten
  }
  window.dispatchEvent(new Event(EVENT));
}
