"use client";

import type { PlanEndpoint } from "@/lib/types";
import { savedName, useFavorites, type Favorite } from "@/lib/favorites";
import { SearchBox } from "./SearchBox";

export function endpointName(ep: PlanEndpoint | null): string {
  if (!ep) return "";
  return ep.kind === "stop" ? ep.stop.name : ep.kind === "place" ? ep.place.name : "Mijn locatie";
}

const endpointKey = (ep: PlanEndpoint | null) =>
  !ep ? "leeg" : ep.kind === "stop" ? `s:${ep.stop.id}` : ep.kind === "place" ? `p:${ep.place.id}` : `l:${ep.lat.toFixed(4)},${ep.lng.toFixed(4)}`;

/** Unix-seconden → waarde voor <input type="datetime-local"> in lokale tijd. */
function toLocalInput(unixSec: number): string {
  const d = new Date(unixSec * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

type Props = {
  from: PlanEndpoint | null;
  to: PlanEndpoint | null;
  /** null = nu vertrekken. */
  time: number | null;
  /** true = `time` is de gewenste aankomsttijd i.p.v. de vertrektijd. */
  arriveBy: boolean;
  /** Alleen via rolstoeltoegankelijke haltes. */
  wheelchair: boolean;
  onWheelchair: (on: boolean) => void;
  locationError?: string | null;
  /** Verandert als het Van-veld de focus moet krijgen (bv. locatie mislukt). */
  focusFrom?: number;
  near: () => { lat: number; lng: number } | undefined;
  onFrom: (ep: PlanEndpoint | null) => void;
  onTo: (ep: PlanEndpoint | null) => void;
  onUseMyLocation: (target: "from" | "to") => void;
  onSwap: () => void;
  onTime: (time: number | null, arriveBy: boolean) => void;
  /** Bewaarde route kiezen. */
  onUseRoute: (route: Extract<Favorite, { kind: "route" }>) => void;
};

/** Bovenin: van waar naar waar, en wanneer. */
export function PlannerPanel({ from, to, time, arriveBy, wheelchair, onWheelchair, locationError, focusFrom, near, onFrom, onTo, onUseMyLocation, onSwap, onTime, onUseRoute }: Props) {
  const mode = time === null ? "nu" : arriveBy ? "aankomst" : "vertrek";
  const { favorites } = useFavorites();
  const endpointFavs = favorites.filter((f): f is Extract<Favorite, { kind: "stop" | "place" }> => f.kind !== "route");
  const routes = favorites.filter((f): f is Extract<Favorite, { kind: "route" }> => f.kind === "route");

  return (
    <div className="pointer-events-auto rounded-2xl bg-white/95 shadow-lg ring-1 ring-black/5 backdrop-blur dark:bg-neutral-900/95 dark:ring-white/10">
      <div className="relative">
        <SearchBox
          key={`van-${endpointKey(from)}`}
          label="Van"
          placeholder="Vertrekpunt"
          focusToken={from ? undefined : focusFrom}
          initialText={endpointName(from)}
          offerMyLocation
          favorites={endpointFavs}
          near={near}
          onSelectStop={(stop) => onFrom({ kind: "stop", stop })}
          onSelectPlace={(place) => onFrom({ kind: "place", place })}
          onSelectMyLocation={() => onUseMyLocation("from")}
          onClear={() => onFrom(null)}
        />
        <div className="mx-3 border-t border-neutral-200 dark:border-neutral-700" />
        <SearchBox
          key={`naar-${endpointKey(to)}`}
          label="Naar"
          placeholder="Waar wil je heen?"
          initialText={endpointName(to)}
          offerMyLocation
          favorites={endpointFavs}
          near={near}
          onSelectStop={(stop) => onTo({ kind: "stop", stop })}
          onSelectPlace={(place) => onTo({ kind: "place", place })}
          onSelectMyLocation={() => onUseMyLocation("to")}
          onClear={() => onTo(null)}
        />
        <button
          type="button"
          onClick={onSwap}
          aria-label="Van en naar omwisselen"
          className="absolute top-1/2 right-10 z-10 -translate-y-1/2 rounded-full bg-white p-1.5 text-neutral-500 shadow ring-1 ring-black/10 hover:text-neutral-900 dark:bg-neutral-800 dark:ring-white/10 dark:hover:text-white"
        >
          <svg aria-hidden viewBox="0 0 20 20" className="size-4 fill-current">
            <path d="M6.5 3.25a.75.75 0 0 1 .75.75v9.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V4a.75.75 0 0 1 .75-.75Zm7 0a.75.75 0 0 1 .53.22l3 3a.75.75 0 0 1-1.06 1.06l-1.72-1.72V15a.75.75 0 0 1-1.5 0V5.81l-1.72 1.72a.75.75 0 1 1-1.06-1.06l3-3a.75.75 0 0 1 .53-.22Z" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2 border-t border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700">
        <span className="w-14 shrink-0 text-xs font-medium text-neutral-500">Wanneer</span>
        <div className="flex rounded-lg bg-neutral-100 p-0.5 text-xs font-medium dark:bg-neutral-800">
          {(
            [
              { value: "nu", text: "Nu" },
              { value: "vertrek", text: "Vertrek" },
              { value: "aankomst", text: "Aankomst" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={mode === opt.value}
              onClick={() => {
                if (opt.value === "nu") return onTime(null, false);
                // Aankomst: standaard over een uur, vertrek: over een half uur (of de tijd die er al stond).
                const soon = Math.floor(Date.now() / 1000) + (opt.value === "aankomst" ? 60 : 30) * 60;
                onTime(time ?? soon, opt.value === "aankomst");
              }}
              className={`rounded-md px-2.5 py-1 ${mode === opt.value ? "bg-white shadow-sm dark:bg-neutral-700" : "text-neutral-500"}`}
            >
              {opt.text}
            </button>
          ))}
        </div>
        {time !== null && (
          <input
            type="datetime-local"
            aria-label={arriveBy ? "Aankomsttijd" : "Vertrektijd"}
            value={time !== null ? toLocalInput(time) : ""}
            onChange={(e) => {
              const t = new Date(e.target.value).getTime();
              if (Number.isFinite(t)) onTime(Math.floor(t / 1000), arriveBy);
            }}
            className="min-w-0 flex-1 rounded-md bg-transparent text-sm outline-none"
          />
        )}
        <button
          type="button"
          onClick={() => onWheelchair(!wheelchair)}
          aria-pressed={wheelchair}
          aria-label="Rolstoeltoegankelijk plannen"
          title="Rolstoeltoegankelijk plannen"
          className={`ml-auto shrink-0 rounded-md p-1 ${wheelchair ? "bg-blue-600 text-white" : "bg-neutral-100 text-neutral-400 hover:text-neutral-900 dark:bg-neutral-800 dark:hover:text-white"}`}
        >
          <svg aria-hidden viewBox="0 0 24 24" className="size-5 fill-current">
            <circle cx="12" cy="4" r="2" />
            <path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.29 1.07 3.25 1.94 5 1.95zm-6.17 5c-.41 1.16-1.52 2-2.83 2-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12.1c-2.28.46-4 2.48-4 4.9 0 2.76 2.24 5 5 5 2.42 0 4.44-1.72 4.9-4h-2.07z" />
          </svg>
        </button>
      </div>
      {locationError && <p className="px-3 pb-2 text-xs text-red-600 dark:text-red-400">{locationError}</p>}
      {!to && routes.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-neutral-200 px-3 py-2 dark:border-neutral-700">
          {routes.map((r) => (
            <button
              key={`${savedName(r.from)}>${savedName(r.to)}`}
              type="button"
              onClick={() => onUseRoute(r)}
              className="max-w-full truncate rounded-full bg-neutral-100 px-2.5 py-1 text-xs hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
            >
              ★ {savedName(r.from)} → {savedName(r.to)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
