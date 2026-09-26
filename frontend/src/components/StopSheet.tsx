"use client";

import { useEffect, useState } from "react";
import type { Departure, DeparturesResponse, StopSummary } from "@/lib/types";
import { AlertList } from "./AlertList";
import { useFavorites } from "@/lib/favorites";
import { DELAY_TONE_CLASSES, MODE_COLORS, MODE_LABELS, delayMinutes, delayTone, formatClock, formatDelay } from "@/lib/format";

// De backend ververst verwachte tijden eens per minuut.
const REFRESH_MS = 30_000;

type Props = {
  stop: StopSummary;
  onClose: () => void;
  /** Rit aangeklikt waarvan het voertuig live rijdt: toon dat voertuig op de kaart. */
  onShowTrip: (departure: Departure) => void;
  /** Reis plannen naar of vanaf deze halte. */
  onPlanTo: (stop: StopSummary) => void;
  onPlanFrom: (stop: StopSummary) => void;
};

/** Vertrekbord van een halte. */
export function StopSheet({ stop, onClose, onShowTrip, onPlanTo, onPlanFrom }: Props) {
  const [data, setData] = useState<DeparturesResponse | null>(null);
  const [error, setError] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let controller = new AbortController();
    const load = () => {
      controller.abort();
      controller = new AbortController();
      fetch(`/api/stops/${encodeURIComponent(stop.id)}/departures`, { signal: controller.signal })
        .then((res) => (res.ok ? (res.json() as Promise<DeparturesResponse>) : Promise.reject(new Error(`HTTP ${res.status}`))))
        .then((d) => {
          setData(d);
          setError(false);
        })
        .catch(() => !controller.signal.aborted && setError(true));
    };
    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, [stop.id]);

  const departures = data?.stop.id === stop.id ? data.departures : null;
  const { has, toggle } = useFavorites();
  const isFav = has({ kind: "stop", stop });

  return (
    <div className="absolute inset-x-0 bottom-0 p-3 pb-9 sm:left-3 sm:right-auto sm:w-96 sm:pb-3">
      <section
        aria-label={`Vertrektijden ${stop.name}`}
        className="flex max-h-[60dvh] flex-col rounded-2xl bg-white shadow-xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10"
      >
        <header className="flex items-start gap-3 p-4 pb-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              {stop.modes.map((m) => MODE_LABELS[m]).join(" · ")}
            </p>
            <h2 className="truncate text-lg font-semibold leading-tight">{stop.name}</h2>
          </div>
          <button
            onClick={() => toggle({ kind: "stop", stop })}
            aria-label={isFav ? "Verwijder uit favorieten" : "Bewaar als favoriet"}
            aria-pressed={isFav}
            className={`-mt-1 rounded-full p-1.5 text-lg leading-none hover:bg-neutral-100 dark:hover:bg-neutral-800 ${isFav ? "text-amber-500" : "text-neutral-400"}`}
          >
            {isFav ? "★" : "☆"}
          </button>
          <button
            onClick={onClose}
            aria-label="Sluiten"
            className="-mr-1 -mt-1 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <svg aria-hidden viewBox="0 0 20 20" className="size-5 fill-current">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </header>
        <div className="flex gap-2 px-4 pb-2">
          <button onClick={() => onPlanTo(stop)} className="flex-1 rounded-lg bg-blue-600 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
            Hierheen
          </button>
          <button onClick={() => onPlanFrom(stop)} className="flex-1 rounded-lg bg-neutral-100 py-1.5 text-sm font-medium hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700">
            Vanaf hier
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
          {data?.stop.id === stop.id && data.alerts.length > 0 && (
            <div className="px-2 pb-2">
              <AlertList alerts={data.alerts} />
            </div>
          )}
          {!departures && !error && <p className="px-2 py-3 text-sm text-neutral-500">Vertrektijden laden…</p>}
          {error && !departures && <p className="px-2 py-3 text-sm text-red-600">Vertrektijden konden niet worden geladen.</p>}
          {departures && departures.length === 0 && (
            <p className="px-2 py-3 text-sm text-neutral-500">Geen vertrekken in de komende 1,5 uur.</p>
          )}
          {departures && departures.length > 0 && (
            <ol className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {departures.map((d) => (
                <DepartureRow key={`${d.tripId}-${d.scheduled}`} departure={d} now={now} onShow={() => onShowTrip(d)} />
              ))}
            </ol>
          )}
        </div>
      </section>
    </div>
  );
}

function DepartureRow({ departure: d, now, onShow }: { departure: Departure; now: number; onShow: () => void }) {
  const time = d.expected ?? d.scheduled;
  const minutes = Math.round((time - now / 1000) / 60);
  const gone = d.canceled || d.skipped;
  const tone = delayTone(d.delay);
  const delayed = delayMinutes(d.delay) !== 0;
  const platformLabel = d.platform ? `${d.mode === "train" ? "Spoor" : "Perron"} ${d.platform}${d.platformChanged ? " (gewijzigd)" : ""}` : undefined;

  const content = (
    <>
      <span
        className="flex h-7 min-w-10 shrink-0 items-center justify-center rounded-md px-1.5 text-xs font-bold text-white"
        style={{ backgroundColor: MODE_COLORS[d.mode], opacity: gone ? 0.4 : 1 }}
      >
        {d.line ?? "?"}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-sm font-medium ${gone ? "text-neutral-400 line-through" : ""}`}>{d.headsign ?? "Onbekend"}</span>
        <span className="block truncate text-xs text-neutral-500">
          {d.canceled ? (
            <span className="text-red-600 dark:text-red-400">Rijdt niet</span>
          ) : d.skipped ? (
            <span className="text-red-600 dark:text-red-400">Stopt hier niet</span>
          ) : (
            [platformLabel, d.live ? "● live" : undefined].filter(Boolean).join(" · ")
          )}
        </span>
      </span>
      <span className="shrink-0 text-right tabular-nums">
        <span className={`block text-sm font-semibold ${gone ? "text-neutral-400 line-through" : delayed ? DELAY_TONE_CLASSES[tone] : ""}`}>
          {minutes <= 0 ? "nu" : minutes < 60 ? `${minutes} min` : formatClock(time)}
        </span>
        <span className="block text-xs text-neutral-500">
          {delayed && !gone && <span className="mr-1 line-through">{formatClock(d.scheduled)}</span>}
          {minutes < 60 ? formatClock(time) : ""}
          {delayed && !gone && <span className={`ml-1 ${DELAY_TONE_CLASSES[tone]}`}>{formatDelay(d.delay)}</span>}
        </span>
      </span>
    </>
  );

  return (
    <li>
      {d.live && !gone ? (
        <button onClick={onShow} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800">
          {content}
        </button>
      ) : (
        <div className="flex items-center gap-3 px-2 py-2">{content}</div>
      )}
    </li>
  );
}
