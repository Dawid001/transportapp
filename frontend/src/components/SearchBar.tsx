"use client";

import { useState } from "react";

type Props = {
  /** Geeft een korte melding terug (bv. "12 voertuigen"), of null bij wissen. */
  onSearch: (line: string | null) => Promise<string | null>;
};

export function SearchBar({ onSearch }: Props) {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState(false);

  async function submit(line: string | null) {
    setBusy(true);
    try {
      setMessage(await onSearch(line));
      setActive(!!line);
    } catch {
      setMessage("Zoeken mislukt");
    } finally {
      setBusy(false);
    }
  }

  function clear() {
    setValue("");
    void submit(null);
  }

  return (
    <div className="pointer-events-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const line = value.trim();
          void submit(line || null);
        }}
        className="flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-2.5 shadow-lg ring-1 ring-black/5 backdrop-blur dark:bg-neutral-900/95 dark:ring-white/10"
      >
        <svg aria-hidden viewBox="0 0 20 20" className="size-4 shrink-0 fill-neutral-400">
          <path d="M8.5 3a5.5 5.5 0 0 1 4.38 8.83l3.65 3.64a.75.75 0 1 1-1.06 1.06l-3.64-3.65A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
        </svg>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Zoek een lijn, bv. 22 of 410"
          inputMode="search"
          enterKeyHint="search"
          aria-label="Lijnnummer"
          className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-neutral-400"
        />
        {busy && <span className="size-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />}
        {(value || active) && !busy && (
          <button type="button" onClick={clear} className="rounded-full px-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
            Wis
          </button>
        )}
      </form>
      {message && (
        <p className="mt-1.5 ml-2 inline-block rounded-full bg-white/95 px-3 py-1 text-xs text-neutral-600 shadow dark:bg-neutral-900/95 dark:text-neutral-300">
          {message}
        </p>
      )}
    </div>
  );
}
