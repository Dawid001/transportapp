"use client";

import { useEffect, useState } from "react";
import { formatAgo } from "@/lib/format";

export type Status =
  | { state: "loading" }
  | { state: "ok"; updatedAt: number }
  | { state: "error"; message: string; updatedAt?: number };

export function StatusPill({ status, visibleCount }: { status: Status; visibleCount: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const base = "pointer-events-auto inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs shadow";

  if (status.state === "loading") {
    return <div className={`${base} bg-white/95 text-neutral-600 dark:bg-neutral-900/95 dark:text-neutral-300`}>Voertuigen laden…</div>;
  }

  if (status.state === "error") {
    return (
      <div className={`${base} bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950 dark:text-red-200 dark:ring-red-900`}>
        <span className="size-2 rounded-full bg-red-500" />
        {status.message}
      </div>
    );
  }

  const age = (now - status.updatedAt) / 1000;
  return (
    <div className={`${base} bg-white/95 text-neutral-700 dark:bg-neutral-900/95 dark:text-neutral-300`}>
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </span>
      <span className="font-medium">Live</span>
      <span className="text-neutral-400">·</span>
      {visibleCount.toLocaleString("nl-NL")} in beeld
      <span className="text-neutral-400">·</span>
      {formatAgo(age)}
    </div>
  );
}
