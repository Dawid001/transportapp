"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Place, SearchResponse, StopSummary } from "@/lib/types";
import { MODE_COLORS, MODE_LABELS } from "@/lib/format";

const PLACE_LABELS: Record<Place["type"], string> = { woonplaats: "Plaats", weg: "Straat", adres: "Adres", postcode: "Postcode" };
const DEBOUNCE_MS = 200;

type Result = { kind: "stop"; stop: StopSummary } | { kind: "place"; place: Place };

type Props = {
  placeholder?: string;
  /** Rond dit punt zoeken (bv. het midden van de kaart), zodat haltes in de buurt hoger staan. */
  near?: () => { lat: number; lng: number } | undefined;
  onSelectStop: (stop: StopSummary) => void;
  onSelectPlace: (place: Place) => void;
  onClear?: () => void;
};

export function SearchBox({ placeholder = "Zoek een halte, station of plaats", near, onSelectStop, onSelectPlace, onClear }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const listId = useId();
  // Na het kiezen van een resultaat staat de naam in het vak; daar hoeven we niet opnieuw op te zoeken.
  const chosenRef = useRef<string | null>(null);
  const nearRef = useRef(near);
  useEffect(() => {
    nearRef.current = near;
  }, [near]);

  // Zoeken terwijl je typt (met een korte pauze, en oude verzoeken afbreken).
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2 || query === chosenRef.current) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      const params = new URLSearchParams({ q });
      const p = nearRef.current?.();
      if (p) {
        params.set("lat", p.lat.toFixed(4));
        params.set("lng", p.lng.toFixed(4));
      }
      setLoading(true);
      fetch(`/api/search?${params}`, { signal: controller.signal })
        .then((res) => (res.ok ? (res.json() as Promise<SearchResponse>) : null))
        .then((data) => {
          if (!data) return;
          setResults(data);
          setActive(0);
        })
        .catch(() => {})
        .finally(() => !controller.signal.aborted && setLoading(false));
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const items: Result[] =
    query.trim().length >= 2 && results
      ? [...results.stops.map((stop) => ({ kind: "stop" as const, stop })), ...results.places.map((place) => ({ kind: "place" as const, place }))]
      : [];

  function choose(item: Result) {
    setOpen(false);
    chosenRef.current = item.kind === "stop" ? item.stop.name : item.place.name;
    if (item.kind === "stop") {
      setQuery(item.stop.name);
      onSelectStop(item.stop);
    } else {
      setQuery(item.place.name);
      onSelectPlace(item.place);
    }
  }

  function clear() {
    setQuery("");
    setResults(null);
    setOpen(false);
    onClear?.();
  }

  const showList = open && items.length > 0;

  return (
    <div className="pointer-events-auto relative">
      <div className="flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-2.5 shadow-lg ring-1 ring-black/5 backdrop-blur dark:bg-neutral-900/95 dark:ring-white/10">
        <svg aria-hidden viewBox="0 0 20 20" className="size-4 shrink-0 fill-neutral-400">
          <path d="M8.5 3a5.5 5.5 0 0 1 4.38 8.83l3.65 3.64a.75.75 0 1 1-1.06 1.06l-3.64-3.65A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
        </svg>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, items.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter" && items[active]) {
              e.preventDefault();
              choose(items[active]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label={placeholder}
          enterKeyHint="search"
          className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-neutral-400"
        />
        {loading && <span className="size-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />}
        {query && !loading && (
          <button type="button" onClick={clear} aria-label="Wissen" className="rounded-full px-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
            ✕
          </button>
        )}
      </div>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-10 mt-1.5 max-h-[60dvh] overflow-y-auto rounded-2xl bg-white py-1.5 shadow-xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10"
        >
          {items.map((item, i) => {
            const firstPlace = item.kind === "place" && (i === 0 || items[i - 1].kind === "stop");
            const firstStop = item.kind === "stop" && i === 0;
            return (
              <li key={item.kind === "stop" ? `s-${item.stop.id}` : `p-${item.place.id}`} role="presentation">
                {(firstStop || firstPlace) && (
                  <p className="px-4 pt-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                    {item.kind === "stop" ? "Haltes" : "Plaatsen"}
                  </p>
                )}
                <button
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(item)}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm ${i === active ? "bg-neutral-100 dark:bg-neutral-800" : ""}`}
                >
                  {item.kind === "stop" ? <StopIcon stop={item.stop} /> : <PinIcon />}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{item.kind === "stop" ? item.stop.name : item.place.name}</span>
                    <span className="block text-xs text-neutral-500">
                      {item.kind === "stop" ? item.stop.modes.map((m) => MODE_LABELS[m]).join(" · ") : PLACE_LABELS[item.place.type]}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function StopIcon({ stop }: { stop: StopSummary }) {
  const color = MODE_COLORS[stop.modes[0] ?? "other"];
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: color }}>
      {stop.modes[0] === "train" ? "NS" : "H"}
    </span>
  );
}

function PinIcon() {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-800">
      <svg aria-hidden viewBox="0 0 20 20" className="size-4 fill-current">
        <path d="M10 2a6 6 0 0 0-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 0 0-6-6Zm0 8.25A2.25 2.25 0 1 1 10 5.75a2.25 2.25 0 0 1 0 4.5Z" />
      </svg>
    </span>
  );
}
