"use client";

import type { Mode } from "@/lib/types";
import { MODE_COLORS, MODE_LABELS } from "@/lib/format";

const ORDER: Mode[] = ["bus", "tram", "metro", "train", "ferry", "other"];

/** Kleurlegenda met aantallen, alleen voor vervoerswijzen die nu in beeld zijn. */
export function Legend({ counts }: { counts: Partial<Record<Mode, number>> }) {
  const modes = ORDER.filter((m) => counts[m]);
  if (!modes.length) return null;

  return (
    <ul
      aria-label="Legenda"
      className="pointer-events-auto flex w-fit flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl bg-white/95 px-3 py-1.5 text-xs text-neutral-700 shadow dark:bg-neutral-900/95 dark:text-neutral-300"
    >
      {modes.map((mode) => (
        <li key={mode} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full ring-1 ring-white dark:ring-neutral-900" style={{ backgroundColor: MODE_COLORS[mode] }} />
          {MODE_LABELS[mode]}
          <span className="tabular-nums text-neutral-400">{counts[mode]!.toLocaleString("nl-NL")}</span>
        </li>
      ))}
    </ul>
  );
}
