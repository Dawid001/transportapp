"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Place, SearchResponse, StopSummary } from "@/lib/types";
import { MODE_COLORS, MODE_LABELS } from "@/lib/format";
import { addRecent, recentKey, useRecents } from "@/lib/recent";

const PLACE_LABELS: Record<Place["type"], string> = { woonplaats: "Plaats", weg: "Straat", adres: "Adres", postcode: "Postcode" };
const DEBOUNCE_MS = 200;

/** group: onder welk kopje een keuze staat zolang er nog niets getypt is. */
type Group = "recent" | "fav";
type Result = { kind: "location" } | { kind: "stop"; stop: StopSummary; group?: Group } | { kind: "place"; place: Place; group?: Group };
const GROUP_LABELS: Record<Group, string> = { recent: "Recent", fav: "Favorieten" };

type Props = {
  /** Korte naam voor het veld, bv. "Van" of "Naar". */
  label: string;
  placeholder: string;
  /** Tekst in het veld bij het (opnieuw) tonen, bv. de gekozen halte. Wijzig de `key` om te resetten. */
  initialText?: string;
  /** Verandert deze waarde (en is die > 0), dan krijgt het veld de focus. */
  focusToken?: number;
  /** "Mijn locatie" als eerste keuze aanbieden. */
  offerMyLocation?: boolean;
  /** Favoriete haltes en plaatsen, getoond zolang er nog niets getypt is. */
  favorites?: ({ kind: "stop"; stop: StopSummary } | { kind: "place"; place: Place })[];
  /** Rond dit punt zoeken (bv. het midden van de kaart), zodat haltes in de buurt hoger staan. */
  near?: () => { lat: number; lng: number } | undefined;
  onSelectStop: (stop: StopSummary) => void;
  onSelectPlace: (place: Place) => void;
  onSelectMyLocation?: () => void;
  onClear?: () => void;
};

export function SearchBox({ label, placeholder, initialText = "", focusToken, offerMyLocation, favorites, near, onSelectStop, onSelectPlace, onSelectMyLocation, onClear }: Props) {
  const [query, setQuery] = useState(initialText);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const listId = useId();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (focusToken) inputRef.current?.focus();
  }, [focusToken]);
  // De gekozen naam staat in het vak; daar hoeven we niet opnieuw op te zoeken.
  const [chosen, setChosen] = useState<string | null>(initialText || null);
  const nearRef = useRef(near);
  useEffect(() => {
    nearRef.current = near;
  }, [near]);

  // Zoeken terwijl je typt (met een korte pauze, en oude verzoeken afbreken).
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2 || query === chosen) return;
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
  }, [query, chosen]);

  const recents = useRecents();
  const typed = query.trim().length >= 2 && query !== chosen;
  // Recent gekozen, zonder wat al bij de favorieten staat.
  const favKeys = new Set((favorites ?? []).map(recentKey));
  const items: Result[] = [
    ...(offerMyLocation && !typed ? [{ kind: "location" as const }] : []),
    ...(!typed ? recents.filter((r) => !favKeys.has(recentKey(r))).map((r) => ({ ...r, group: "recent" as const })) : []),
    ...(!typed ? (favorites ?? []).map((f) => ({ ...f, group: "fav" as const })) : []),
    ...(typed && results
      ? [...results.stops.map((stop) => ({ kind: "stop" as const, stop })), ...results.places.map((place) => ({ kind: "place" as const, place }))]
      : []),
  ];

  function choose(item: Result) {
    setOpen(false);
    if (item.kind === "location") {
      setChosen("Mijn locatie");
      setQuery("Mijn locatie");
      onSelectMyLocation?.();
    } else if (item.kind === "stop") {
      setChosen(item.stop.name);
      setQuery(item.stop.name);
      addRecent({ kind: "stop", stop: item.stop });
      onSelectStop(item.stop);
    } else {
      setChosen(item.place.name);
      setQuery(item.place.name);
      addRecent({ kind: "place", place: item.place });
      onSelectPlace(item.place);
    }
  }

  function clear() {
    setChosen(null);
    setQuery("");
    setResults(null);
    setOpen(true);
    onClear?.();
  }

  const showList = open && items.length > 0;

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-3 py-2">
        <label htmlFor={inputId} className="w-14 shrink-0 text-xs font-medium text-neutral-500">
          {label}
        </label>
        <input
          ref={inputRef}
          id={inputId}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={(e) => {
            setOpen(true);
            // Een gekozen waarde in één keer kunnen overschrijven.
            if (query === chosen) e.target.select();
          }}
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
          enterKeyHint="search"
          className={`min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-neutral-400 ${query === "Mijn locatie" ? "text-blue-600 dark:text-blue-400" : ""}`}
        />
        {loading && <span className="size-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />}
        {query && !loading && (
          <button type="button" onClick={clear} aria-label={`${label} wissen`} className="rounded-full px-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
            ✕
          </button>
        )}
      </div>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-20 mt-1 max-h-[55dvh] overflow-y-auto rounded-2xl bg-white py-1.5 shadow-xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10"
        >
          {items.map((item, i) => {
            const prev = items[i - 1];
            const group = item.kind !== "location" ? item.group : undefined;
            const prevGroup = prev && prev.kind !== "location" ? prev.group : undefined;
            const heading = group
              ? group === prevGroup
                ? null
                : GROUP_LABELS[group]
              : item.kind === "stop" && prev?.kind !== "stop"
                ? "Haltes"
                : item.kind === "place" && prev?.kind !== "place"
                  ? "Plaatsen"
                  : null;
            return (
              <li key={item.kind === "location" ? "loc" : `${item.group ?? "r"}-${recentKey(item)}`} role="presentation">
                {heading && <p className="px-4 pt-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-400">{heading}</p>}
                <button
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(item)}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm ${i === active ? "bg-neutral-100 dark:bg-neutral-800" : ""}`}
                >
                  {item.kind === "location" ? <LocationIcon /> : item.group === "recent" ? <ClockIcon /> : item.kind === "stop" ? <StopIcon stop={item.stop} /> : <PinIcon />}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">
                      {item.kind === "location" ? "Mijn locatie" : item.kind === "stop" ? item.stop.name : item.place.name}
                    </span>
                    <span className="block text-xs text-neutral-500">
                      {item.kind === "location"
                        ? "Gebruik waar je nu bent"
                        : item.kind === "stop"
                          ? item.stop.modes.map((m) => MODE_LABELS[m]).join(" · ")
                          : PLACE_LABELS[item.place.type]}
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

function ClockIcon() {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-800">
      <svg aria-hidden viewBox="0 0 20 20" className="size-4 fill-current">
        <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 1.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm-.75 2.75a.75.75 0 0 1 1.5 0v3.44l2.28 2.28a.75.75 0 1 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1-.22-.53V6.25Z" />
      </svg>
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

function LocationIcon() {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
      <svg aria-hidden viewBox="0 0 20 20" className="size-4 fill-current">
        <path d="M10 1.5a.75.75 0 0 1 .75.75v1.3a6.5 6.5 0 0 1 5.7 5.7h1.3a.75.75 0 0 1 0 1.5h-1.3a6.5 6.5 0 0 1-5.7 5.7v1.3a.75.75 0 0 1-1.5 0v-1.3a6.5 6.5 0 0 1-5.7-5.7h-1.3a.75.75 0 0 1 0-1.5h1.3a6.5 6.5 0 0 1 5.7-5.7v-1.3A.75.75 0 0 1 10 1.5ZM10 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
      </svg>
    </span>
  );
}
