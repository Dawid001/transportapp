"use client";

import { useState } from "react";
import type { Alert } from "@/lib/types";

/** Meldingen (omleiding, tijdelijke halte, storing) als inklapbare oranje blokjes. */
export function AlertList({ alerts, compact = false }: { alerts: Alert[] | undefined; compact?: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!alerts?.length) return null;
  const shown = compact ? alerts.slice(0, 2) : alerts;

  return (
    <ul className="space-y-1.5">
      {shown.map((a) => (
        <li key={a.id}>
          <button
            type="button"
            onClick={() => setOpen((o) => (o === a.id ? null : a.id))}
            className="w-full rounded-lg bg-amber-50 px-2.5 py-1.5 text-left text-xs text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950 dark:text-amber-100 dark:ring-amber-900"
          >
            <span className="font-medium">⚠ {a.title}</span>
            {a.text && open === a.id && <span className="mt-1 block whitespace-pre-line opacity-90">{a.text}</span>}
            {a.text && open !== a.id && <span className="ml-1 opacity-70">Meer</span>}
          </button>
        </li>
      ))}
      {compact && alerts.length > shown.length && <li className="px-1 text-xs text-amber-700 dark:text-amber-300">+{alerts.length - shown.length} meer</li>}
    </ul>
  );
}
