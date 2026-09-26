"use client";

import { useEffect, useState } from "react";
import type { ApiVehicle, RouteStop, TripRoute } from "@/lib/types";
import { upcomingStops } from "@/lib/routeGeo";
import { MODE_COLORS, MODE_LABELS, STATUS_LABELS, formatAgo } from "@/lib/format";

type Props = {
  vehicle: ApiVehicle;
  /** Route van deze rit; null zolang die laadt of niet in de dienstregeling staat. */
  route: TripRoute | null;
  follow: boolean;
  onToggleFollow: () => void;
  onClose: () => void;
  onStopClick: (stop: RouteStop) => void;
};

export function VehicleSheet({ vehicle, route, follow, onToggleFollow, onClose, onStopClick }: Props) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const age = vehicle.timestamp ? now / 1000 - vehicle.timestamp : undefined;
  const color = MODE_COLORS[vehicle.mode];
  const isTrain = vehicle.mode === "train";

  return (
    <div className="absolute inset-x-0 bottom-0 p-3 pb-9 sm:left-3 sm:right-auto sm:w-96 sm:pb-3">
      <section
        aria-label="Voertuiggegevens"
        className="rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10"
      >
        <div className="flex items-start gap-3">
          <div
            className="flex h-11 min-w-11 shrink-0 items-center justify-center rounded-xl px-2 text-lg font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {vehicle.line ?? "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color }}>
              {MODE_LABELS[vehicle.mode]} · {vehicle.agencyName ?? vehicle.operator}
            </p>
            <h2 className="truncate text-lg font-semibold leading-tight">
              {vehicle.headsign ? `→ ${vehicle.headsign}` : "Bestemming onbekend"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Sluiten"
            className="-mr-1 -mt-1 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <svg aria-hidden viewBox="0 0 20 20" className="size-5 fill-current">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          <dt className="text-neutral-500">Status</dt>
          <dd>{(vehicle.status && STATUS_LABELS[vehicle.status]) ?? "Onbekend"}</dd>
          <dt className="text-neutral-500">Laatste positie</dt>
          <dd className={age && age > 300 ? "text-amber-600" : undefined}>{age !== undefined ? formatAgo(age) : "Onbekend"}</dd>
          {vehicle.vehicleNumber && (
            <>
              <dt className="text-neutral-500">{isTrain ? "Treinnummer" : "Wagennummer"}</dt>
              <dd>{vehicle.vehicleNumber}</dd>
            </>
          )}
          {/* Alleen bij treinen: NS geeft de echte snelheid; bij bussen is het een schatting. */}
          {isTrain && vehicle.speed !== undefined && (
            <>
              <dt className="text-neutral-500">Snelheid</dt>
              <dd>{Math.round(vehicle.speed * 3.6)} km/u</dd>
            </>
          )}
        </dl>

        {route?.approximate && (
          <p className="mt-3 rounded-lg bg-neutral-100 px-3 py-2 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            Route bij benadering: {vehicle.agencyName ?? "deze vervoerder"} levert alleen rechte lijnen tussen de haltes. Het
            voertuig verspringt daarom alleen bij nieuwe posities.
          </p>
        )}
        {route && route.stops.length > 0 && <NextStops vehicle={vehicle} route={route} color={color} onStopClick={onStopClick} />}

        <button
          onClick={onToggleFollow}
          className={`mt-4 w-full rounded-xl py-2.5 text-sm font-medium transition ${
            follow
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
              : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
          }`}
        >
          {follow ? "Volgen aan: kaart beweegt mee" : "Volg dit voertuig"}
        </button>
      </section>
    </div>
  );
}

const COLLAPSED_STOPS = 4;

function NextStops({ vehicle, route, color, onStopClick }: { vehicle: ApiVehicle; route: TripRoute; color: string; onStopClick: (stop: RouteStop) => void }) {
  const [expanded, setExpanded] = useState(false);
  const upcoming = upcomingStops(route, vehicle);
  const shown = expanded ? upcoming : upcoming.slice(0, COLLAPSED_STOPS);
  const atStop = vehicle.status === "STOPPED_AT";

  if (upcoming.length === 0) {
    return <p className="mt-4 text-sm text-neutral-500">Eindhalte bereikt</p>;
  }

  return (
    <div className="mt-4">
      <h3 className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">Volgende haltes</h3>
      <ol className={expanded ? "max-h-56 overflow-y-auto pr-1" : undefined}>
        {shown.map((stop, i) => {
          const isFirst = i === 0;
          const isLast = stop === upcoming[upcoming.length - 1];
          return (
            <li key={`${stop.sequence}-${stop.id}`} className="relative flex">
              {/* Tijdlijn: verticale lijn met een bolletje per halte */}
              <span className="relative flex w-5 shrink-0 justify-center" aria-hidden>
                {!isLast && <span className="absolute top-3 bottom-0 w-0.5" style={{ backgroundColor: color, opacity: 0.35 }} />}
                {!isFirst && <span className="absolute top-0 h-3 w-0.5" style={{ backgroundColor: color, opacity: 0.35 }} />}
                <span
                  className="relative mt-1.5 size-3 rounded-full border-2 bg-white dark:bg-neutral-900"
                  style={{ borderColor: color, backgroundColor: isFirst ? color : undefined }}
                />
              </span>
              <button
                onClick={() => onStopClick(stop)}
                className="-my-0.5 ml-1 min-w-0 flex-1 rounded-md px-1.5 py-1 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <span className={`block truncate ${isFirst ? "font-semibold" : ""}`}>{stop.name}</span>
                {isFirst && <span className="block text-xs text-neutral-500">{atStop ? "Staat nu hier" : "Volgende halte"}</span>}
              </button>
            </li>
          );
        })}
      </ol>
      {upcoming.length > COLLAPSED_STOPS && (
        <button onClick={() => setExpanded((e) => !e)} className="mt-1 ml-6 text-xs font-medium hover:underline" style={{ color }}>
          {expanded ? "Minder tonen" : `Alle ${upcoming.length} haltes tonen`}
        </button>
      )}
    </div>
  );
}
