"use client";

import { useEffect, useState } from "react";
import type { ApiVehicle, RouteStop, StopTime, TripRoute, TripStopTimes } from "@/lib/types";
import { upcomingStops } from "@/lib/routeGeo";
import { displayTime, useTripTimes } from "@/lib/useTripTimes";
import {
  DELAY_TONE_CLASSES,
  MODE_COLORS,
  MODE_LABELS,
  STATUS_LABELS,
  delayMinutes,
  delayTone,
  formatAgo,
  formatClock,
  formatDelay,
} from "@/lib/format";

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
  const times = useTripTimes(vehicle.tripId);

  const age = vehicle.timestamp ? now / 1000 - vehicle.timestamp : undefined;
  const color = MODE_COLORS[vehicle.mode];
  const isTrain = vehicle.mode === "train";

  return (
    <div className="absolute inset-x-0 bottom-0 p-3 pb-9 sm:left-3 sm:right-auto sm:w-96 sm:pb-3">
      <section
        aria-label="Voertuiggegevens"
        className="max-h-[70dvh] overflow-y-auto rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10"
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
            <Punctuality delay={vehicle.delay} canceled={times?.canceled} />
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
        {route && route.stops.length > 0 && (
          <NextStops vehicle={vehicle} route={route} times={times} color={color} now={now} onStopClick={onStopClick} />
        )}

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

/** "🟢 Op tijd", "🟠 +3 min", "🔴 +12 min", "Rijdt 2 min te vroeg" of "Uitgevallen". */
function Punctuality({ delay, canceled }: { delay?: number; canceled?: boolean }) {
  if (canceled) {
    return <p className="mt-0.5 text-sm font-medium text-red-600 dark:text-red-400">Rit uitgevallen</p>;
  }
  if (delay === undefined) return null;
  const min = delayMinutes(delay);
  const tone = delayTone(delay);
  const dot = { ok: "bg-emerald-500", late: "bg-amber-500", veryLate: "bg-red-500" }[tone];
  const text = min > 0 ? `+${min} min vertraging` : min < 0 ? `Rijdt ${-min} min te vroeg` : "Op tijd";
  return (
    <p className={`mt-0.5 flex items-center gap-1.5 text-sm font-medium ${DELAY_TONE_CLASSES[tone]}`}>
      <span className={`size-2 rounded-full ${dot}`} aria-hidden />
      {text}
    </p>
  );
}

const COLLAPSED_STOPS = 4;

function NextStops({
  vehicle,
  route,
  times,
  color,
  now,
  onStopClick,
}: {
  vehicle: ApiVehicle;
  route: TripRoute;
  times: TripStopTimes | null;
  color: string;
  now: number;
  onStopClick: (stop: RouteStop) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const upcoming = upcomingStops(route, vehicle);
  const shown = expanded ? upcoming : upcoming.slice(0, COLLAPSED_STOPS);
  const atStop = vehicle.status === "STOPPED_AT";
  const timeBySeq = new Map<number, StopTime>(times?.stops.map((t) => [t.sequence, t]));
  // De eerste halte waar de rit echt langskomt is "volgende halte" (overgeslagen haltes tellen niet).
  const nextSeq = upcoming.find((s) => !timeBySeq.get(s.sequence)?.skipped)?.sequence;

  if (upcoming.length === 0) {
    return <p className="mt-4 text-sm text-neutral-500">Eindhalte bereikt</p>;
  }

  return (
    <div className="mt-4">
      <div className="mb-1 flex items-baseline justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wide text-neutral-500">Volgende haltes</h3>
        {times && !times.realtime && <span className="text-xs text-neutral-400">geplande tijden</span>}
      </div>
      <ol className={expanded ? "max-h-64 overflow-y-auto pr-1" : undefined}>
        {shown.map((stop, i) => {
          const isFirst = i === 0;
          const isLast = stop === upcoming[upcoming.length - 1];
          const isNext = stop.sequence === nextSeq;
          const t = timeBySeq.get(stop.sequence);
          const skipped = !!t?.skipped;
          return (
            <li key={`${stop.sequence}-${stop.id}`} className="relative flex">
              {/* Tijdlijn: verticale lijn met een bolletje per halte */}
              <span className="relative flex w-5 shrink-0 justify-center" aria-hidden>
                {!isLast && <span className="absolute top-3 bottom-0 w-0.5" style={{ backgroundColor: color, opacity: 0.35 }} />}
                {!isFirst && <span className="absolute top-0 h-3 w-0.5" style={{ backgroundColor: color, opacity: 0.35 }} />}
                <span
                  className="relative mt-1.5 size-3 rounded-full border-2 bg-white dark:bg-neutral-900"
                  style={{
                    borderColor: skipped ? "#9ca3af" : color,
                    backgroundColor: isNext ? color : undefined,
                  }}
                />
              </span>
              <button
                onClick={() => onStopClick(stop)}
                className="-my-0.5 ml-1 flex min-w-0 flex-1 items-start gap-2 rounded-md px-1.5 py-1 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <span className="min-w-0 flex-1">
                  <span className={`block truncate ${isNext ? "font-semibold" : ""} ${skipped ? "text-neutral-400 line-through" : ""}`}>
                    {stop.name}
                  </span>
                  {skipped ? (
                    <span className="block text-xs text-red-600 dark:text-red-400">Rijdt niet via deze halte</span>
                  ) : (
                    isNext && <span className="block text-xs text-neutral-500">{atStop ? "Staat nu hier" : "Volgende halte"}</span>
                  )}
                </span>
                {t && !skipped && <StopClock time={t} now={now} showCountdown={isNext} />}
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

/** Rechts in de haltelijst: verwachte tijd, eventueel doorgestreepte geplande tijd en vertraging. */
function StopClock({ time, now, showCountdown }: { time: StopTime; now: number; showCountdown: boolean }) {
  const { time: shown, scheduled } = displayTime(time);
  if (shown === undefined) return null;
  const min = delayMinutes(time.delay);
  const tone = delayTone(time.delay);
  const minutesAway = Math.round((shown - now / 1000) / 60);

  return (
    <span className="shrink-0 text-right tabular-nums">
      <span className="block">
        {min !== 0 && scheduled !== undefined && (
          <span className="mr-1 text-xs text-neutral-400 line-through">{formatClock(scheduled)}</span>
        )}
        <span className={min !== 0 ? `font-medium ${DELAY_TONE_CLASSES[tone]}` : undefined}>{formatClock(shown)}</span>
      </span>
      {showCountdown ? (
        <span className="block text-xs text-neutral-500">{minutesAway <= 0 ? "nu" : `over ${minutesAway} min`}</span>
      ) : (
        min !== 0 && <span className={`block text-xs ${DELAY_TONE_CLASSES[tone]}`}>{formatDelay(time.delay)} min</span>
      )}
    </span>
  );
}
