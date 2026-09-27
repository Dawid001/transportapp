"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Voorkeuren die de app onthoudt op dit apparaat (localStorage). */

const WHEELCHAIR_KEY = "live-ov:wheelchair";
const EVENT = "live-ov:preferences";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readWheelchair(): boolean {
  try {
    return localStorage.getItem(WHEELCHAIR_KEY) === "1";
  } catch {
    return false;
  }
}

/** Rolstoeltoegankelijk plannen aan/uit. */
export function useWheelchair(): [boolean, (on: boolean) => void] {
  const on = useSyncExternalStore(subscribe, readWheelchair, () => false);
  const set = useCallback((value: boolean) => {
    try {
      if (value) localStorage.setItem(WHEELCHAIR_KEY, "1");
      else localStorage.removeItem(WHEELCHAIR_KEY);
    } catch {
      // opslag niet beschikbaar: dan geldt het niet na herladen
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return [on, set];
}
