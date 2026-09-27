"use client";

import { useEffect, useState } from "react";
import type { ApiVehicle, Crowd, Journey, Leg, PlanNotice, TrainStock, TransitLeg } from "@/lib/types";
import { AlertList } from "./AlertList";
import { shareJourney } from "@/lib/share";
import { activeWatch, journeyKey, pushSupport, unwatchJourney, watchJourney, type ActiveWatch } from "@/lib/push";
import { DELAY_TONE_CLASSES, MODE_COLORS, MODE_LABELS, dayLabel, delayMinutes, delayTone, formatClock, formatDelay } from "@/lib/format";

type Props = {
  journeys: Journey[] | null;
  /** Rijdt er (voorlopig) niets meer? */
  notice?: PlanNotice;
  /** Gepland via rolstoeltoegankelijke haltes. */
  wheelchair?: boolean;
  /** Een reis die iemand via een link met je deelt: geen opties, alleen deze reis live. */
  shared?: boolean;
  loading: boolean;
  error: string | null;
  selected: number | null;
  /** Live voertuigen van de ritten in de reisopties, per rit-ID. */
  vehicles: Map<string, ApiVehicle>;
  onSelect: (index: number | null) => void;
  onShowVehicle: (vehicle: ApiVehicle) => void;
  onClose: () => void;
  /** Route (van → naar) als favoriet. */
  routeSaved: boolean;
  onToggleRoute: () => void;
};

const minutes = (seconds: number) => Math.max(1, Math.round(seconds / 60));
const durationText = (seconds: number) => {
  const m = Math.round(seconds / 60);
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} u ${String(m % 60).padStart(2, "0")}`;
};

/** Verwachte vertrektijd van een reisdeel: realtime van de backend, anders dienstregeling + vertraging van het voertuig. */
function expectedDeparture(leg: TransitLeg, vehicle?: ApiVehicle): number {
  return leg.expectedDeparture ?? (vehicle?.delay !== undefined ? leg.departure + vehicle.delay : leg.departure);
}

/** Onderin: reisopties, en na het kiezen de reis stap voor stap met live status. */
export function JourneySheet({ journeys, notice, wheelchair, shared, loading, error, selected, vehicles, onSelect, onShowVehicle, onClose, routeSaved, onToggleRoute }: Props) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 10_000);
    return () => clearInterval(timer);
  }, []);

  const journey = selected !== null ? journeys?.[selected] : undefined;

  return (
    <div className="absolute inset-x-0 bottom-0 p-3 pb-9 sm:left-3 sm:right-auto sm:w-[26rem] sm:pb-3">
      <section className="flex max-h-[55dvh] flex-col rounded-2xl bg-white shadow-xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10">
        <header className="flex items-center gap-2 px-4 pt-3 pb-2">
          {shared ? (
            <h2 className="text-sm font-semibold">📍 Gedeelde reis</h2>
          ) : journey ? (
            <button onClick={() => onSelect(null)} className="-ml-1 rounded-md px-1.5 py-0.5 text-sm font-medium text-blue-600 hover:bg-neutral-100 dark:text-blue-400 dark:hover:bg-neutral-800">
              ← Opties
            </button>
          ) : (
            <h2 className="text-sm font-semibold">Reisopties</h2>
          )}
          <span className="flex-1" />
          {!shared && (
            <button
              onClick={onToggleRoute}
              aria-pressed={routeSaved}
              className={`rounded-md px-2 py-1 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 ${routeSaved ? "text-amber-500" : "text-neutral-500"}`}
            >
              {routeSaved ? "★ Bewaard" : "☆ Bewaar route"}
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Sluiten"
            className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <svg aria-hidden viewBox="0 0 20 20" className="size-5 fill-current">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
          {journey ? (
            <JourneyDetail journey={journey} shared={shared} vehicles={vehicles} now={now} onShowVehicle={onShowVehicle} />
          ) : loading && !journeys ? (
            <p className="px-2 py-3 text-sm text-neutral-500">Reis plannen…</p>
          ) : error ? (
            <p className="px-2 py-3 text-sm text-red-600 dark:text-red-400">{error}</p>
          ) : journeys && journeys.length === 0 ? (
            <p className="px-2 py-3 text-sm text-neutral-500">Geen reis gevonden. Probeer een ander tijdstip of een halte in de buurt.</p>
          ) : (
            <ol className="space-y-1.5">
              {notice && (
                <li className="rounded-xl bg-indigo-50 px-3 py-2.5 text-sm text-indigo-900 dark:bg-indigo-950 dark:text-indigo-100">
                  {notice.kind === "noServiceUntil" ? (
                    <>
                      <p className="font-medium">🌙 Er rijdt nu niets meer.</p>
                      <p className="mt-0.5">
                        De eerste reis met het OV vertrekt{" "}
                        <span className="font-semibold">
                          {dayLabel(notice.firstDeparture, now) || "vandaag"} om {formatClock(notice.firstDeparture)}
                        </span>
                        .
                      </p>
                    </>
                  ) : (
                    <p className="font-medium">Er is geen reis met het OV gevonden. Lopen kan wel:</p>
                  )}
                </li>
              )}
              {wheelchair && journeys && journeys.length > 0 && (
                <li className="rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-900 dark:bg-blue-950 dark:text-blue-100">
                  ♿ Alleen haltes die als rolstoeltoegankelijk bekendstaan, met extra overstaptijd.
                  {journeys.some((j) => j.legs.some((l) => l.type === "transit" && l.mode === "train")) && (
                    <> Met de trein? Vraag vooraf NS Reisassistentie aan.</>
                  )}
                </li>
              )}
              {journeys?.map((j, i) => (
                <li key={i}>
                  <JourneyOption journey={j} vehicles={vehicles} now={now} onClick={() => onSelect(i)} />
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </div>
  );
}

function JourneyOption({ journey: j, vehicles, now, onClick }: { journey: Journey; vehicles: Map<string, ApiVehicle>; now: number; onClick: () => void }) {
  const firstTransit = j.legs.find((l): l is TransitLeg => l.type === "transit");
  const vehicle = firstTransit && vehicles.get(firstTransit.tripId);
  const leaveIn = Math.round((j.departure - now / 1000) / 60);
  const delay = firstTransit ? (firstTransit.expectedDeparture ? firstTransit.expectedDeparture - firstTransit.departure : vehicle?.delay) : undefined;
  const canceled = j.legs.some((l) => l.type === "transit" && l.canceled);
  const crowd = worstCrowd(j);
  const alertCount = j.legs.reduce((n, l) => n + (l.type === "transit" ? (l.alerts?.length ?? 0) : 0), 0);

  return (
    <button onClick={onClick} className="w-full rounded-xl px-3 py-2.5 text-left ring-1 ring-neutral-200 hover:bg-neutral-50 dark:ring-neutral-700 dark:hover:bg-neutral-800">
      <div className="flex items-baseline gap-2">
        {dayLabel(j.departure, now) && (
          <span className="self-center rounded bg-indigo-50 px-1.5 py-px text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            {dayLabel(j.departure, now)}
          </span>
        )}
        <span className={`text-base font-semibold tabular-nums ${canceled ? "text-neutral-400 line-through" : ""}`}>
          {formatClock(j.departure)} → {formatClock(j.arrival)}
        </span>
        <span className="text-sm text-neutral-500">{durationText(j.arrival - j.departure)}</span>
        <span className="flex-1" />
        <span className="text-xs text-neutral-500">{j.transfers === 0 ? "direct" : `${j.transfers}× overstappen`}</span>
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-1">
        {j.legs.map((leg, i) => (
          <LegChip key={i} leg={leg} />
        ))}
        {crowd && <CrowdMeter crowd={crowd} className="ml-auto" />}
      </div>
      <p className="mt-1.5 text-xs text-neutral-500">
        {canceled ? (
          <span className="text-red-600 dark:text-red-400">Een rit in deze reis valt uit</span>
        ) : (
          <>
            {leaveIn <= 0
              ? "Vertrek nu"
              : leaveIn < 60
                ? `Vertrek over ${leaveIn} min`
                : `Vertrek ${dayLabel(j.departure, now) ? `${dayLabel(j.departure, now)} ` : ""}om ${formatClock(j.departure)}`}
            {vehicle && <span className="ml-1.5 text-emerald-600 dark:text-emerald-400">● live</span>}
            {delayMinutes(delay) !== 0 && <span className={`ml-1.5 ${DELAY_TONE_CLASSES[delayTone(delay)]}`}>{formatDelay(delay)} min</span>}
            {alertCount > 0 && <span className="ml-1.5 text-amber-600 dark:text-amber-400">⚠ {alertCount === 1 ? "melding" : `${alertCount} meldingen`}</span>}
          </>
        )}
      </p>
    </button>
  );
}

const CROWD: Record<Crowd, { level: number; text: string; className: string }> = {
  LOW: { level: 1, text: "Rustig", className: "text-emerald-600 dark:text-emerald-400" },
  MEDIUM: { level: 2, text: "Gemiddeld druk", className: "text-amber-600 dark:text-amber-400" },
  HIGH: { level: 3, text: "Druk", className: "text-red-600 dark:text-red-400" },
};

/** Drukste treinrit in de reis (alleen treinen hebben een NS-prognose). */
function worstCrowd(j: Journey): Crowd | undefined {
  let worst: Crowd | undefined;
  for (const l of j.legs) if (l.type === "transit" && l.crowd && (!worst || CROWD[l.crowd].level > CROWD[worst].level)) worst = l.crowd;
  return worst;
}

/** Drie poppetjes zoals bij NS: hoe meer gevuld, hoe drukker. */
function CrowdMeter({ crowd, withText, className = "" }: { crowd: Crowd; withText?: boolean; className?: string }) {
  const c = CROWD[crowd];
  return (
    <span className={`inline-flex items-center gap-1 ${c.className} ${className}`} title={`Verwachte drukte: ${c.text.toLowerCase()}`}>
      <span aria-hidden className="inline-flex">
        {[1, 2, 3].map((n) => (
          <svg key={n} viewBox="0 0 10 14" className={`h-3.5 w-2.5 fill-current ${n > c.level ? "opacity-25" : ""}`}>
            <circle cx="5" cy="3" r="2.5" />
            <path d="M1 13V9a4 4 0 0 1 8 0v4Z" />
          </svg>
        ))}
      </span>
      <span className={withText ? "font-medium" : "sr-only"}>{c.text}</span>
    </span>
  );
}

const FACILITIES: Record<string, string> = { WIFI: "wifi", STILTE: "stiltecoupé", STROOM: "stopcontacten", TOILET: "toilet", FIETS: "fietsen", TOEGANKELIJK: "toegankelijk" };

/** Bv. "VIRM · 6 bakken · 567 zitplaatsen · wifi, stiltecoupé". */
function stockText(s: TrainStock): string {
  const parts = [s.type];
  if (s.parts) parts.push(`${s.parts} bakken`);
  if (s.seats) parts.push(`${s.seats} zitplaatsen`);
  const f = s.facilities.map((x) => FACILITIES[x]).filter(Boolean);
  if (f.length) parts.push(f.join(", "));
  return parts.join(" · ");
}

function LegChip({ leg }: { leg: Leg }) {
  if (leg.type === "walk") {
    return <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">🚶 {minutes(leg.arrival - leg.departure)}</span>;
  }
  return (
    <span className="rounded-md px-1.5 py-0.5 text-xs font-bold text-white" style={{ backgroundColor: MODE_COLORS[leg.mode] }}>
      {leg.line ?? MODE_LABELS[leg.mode]}
    </span>
  );
}

function JourneyDetail({ journey: j, shared, vehicles, now, onShowVehicle }: { journey: Journey; shared?: boolean; vehicles: Map<string, ApiVehicle>; now: number; onShowVehicle: (v: ApiVehicle) => void }) {
  return (
    <div className="px-2">
      <p className="mb-2 text-base font-semibold tabular-nums">
        {dayLabel(j.departure, now) && <span className="mr-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400">{dayLabel(j.departure, now)}</span>}
        {formatClock(j.departure)} → {formatClock(j.arrival)}
        <span className="ml-2 text-sm font-normal text-neutral-500">
          {durationText(j.arrival - j.departure)} · {j.transfers === 0 ? "direct" : `${j.transfers}× overstappen`}
        </span>
      </p>
      {shared && (
        <p className="mb-2 text-sm text-neutral-600 dark:text-neutral-300">
          Iemand deelt deze reis naar <span className="font-medium">{j.legs[j.legs.length - 1].to.name}</span> met je. Je ziet hier live waar de bus of trein is.
        </p>
      )}
      <div className="mb-3 flex gap-2">
        <NotifyButton journey={j} />
        {!shared && <ShareButton journey={j} />}
      </div>
      <ol className="space-y-2">
        {j.legs.map((leg, i) =>
          leg.type === "walk" ? (
            <li key={i} className="flex gap-3 text-sm text-neutral-600 dark:text-neutral-300">
              <span className="w-10 shrink-0 text-right text-xs tabular-nums text-neutral-400">{formatClock(leg.departure)}</span>
              <span>
                🚶 Loop {minutes(leg.arrival - leg.departure)} min{leg.distance > 60 ? ` (${leg.distance} m)` : ""} naar <span className="font-medium">{leg.to.name}</span>
              </span>
            </li>
          ) : (
            <TransitStep key={i} leg={leg} vehicle={vehicles.get(leg.tripId)} now={now} onShowVehicle={onShowVehicle} />
          ),
        )}
      </ol>
    </div>
  );
}

function TransitStep({ leg, vehicle, now, onShowVehicle }: { leg: TransitLeg; vehicle?: ApiVehicle; now: number; onShowVehicle: (v: ApiVehicle) => void }) {
  const color = MODE_COLORS[leg.mode];
  const dep = expectedDeparture(leg, vehicle);
  const delay = dep - leg.departure;
  const arr = leg.expectedArrival ?? (vehicle?.delay !== undefined ? leg.arrival + vehicle.delay : leg.arrival);
  const platformWord = leg.mode === "train" ? "spoor" : "perron";
  const status = liveStatus(leg, vehicle, dep, arr, now);

  return (
    <li className="flex gap-3">
      <span className="w-10 shrink-0 pt-0.5 text-right text-xs tabular-nums">
        <span className={delayMinutes(delay) !== 0 ? DELAY_TONE_CLASSES[delayTone(delay)] : undefined}>{formatClock(dep)}</span>
      </span>
      <div className="min-w-0 flex-1 border-l-4 pl-3" style={{ borderColor: color }}>
        <p className="text-sm">
          <span className="font-medium">{leg.from.name}</span>
          {leg.from.platform && <span className="text-neutral-500"> · {platformWord} {leg.from.platform}</span>}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-sm">
          <span className="rounded-md px-1.5 py-0.5 text-xs font-bold text-white" style={{ backgroundColor: color }}>
            {leg.line ?? MODE_LABELS[leg.mode]}
          </span>
          <span className="truncate">→ {leg.headsign ?? leg.to.name}</span>
        </p>
        <p className="mt-0.5 text-xs text-neutral-500">
          {MODE_LABELS[leg.mode]}
          {leg.agencyName ? ` · ${leg.agencyName}` : ""} · {leg.stopsBetween + 1} {leg.stopsBetween === 0 ? "halte" : "haltes"} ·{" "}
          {minutes(leg.arrival - leg.departure)} min
        </p>

        {(leg.crowd || leg.stock) && (
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-xs text-neutral-500">
            {leg.crowd && <CrowdMeter crowd={leg.crowd} withText />}
            {leg.stock && <span>{stockText(leg.stock)}</span>}
          </p>
        )}

        {leg.alerts && leg.alerts.length > 0 && (
          <div className="mt-1.5">
            <AlertList alerts={leg.alerts} compact />
          </div>
        )}

        {/* Live: waar is het voertuig nu? */}
        <div className={`mt-1.5 rounded-lg px-2 py-1.5 text-xs ${status.tone === "bad" ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300" : status.live ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"}`}>
          <span>{status.text}</span>
          {delayMinutes(delay) !== 0 && !status.tone && <span className={`ml-1 font-medium ${DELAY_TONE_CLASSES[delayTone(delay)]}`}>{formatDelay(delay)} min</span>}
          {vehicle && (
            <button onClick={() => onShowVehicle(vehicle)} className="ml-2 font-medium underline underline-offset-2">
              Toon op kaart
            </button>
          )}
        </div>

        <p className="mt-1.5 text-sm">
          <span className="mr-1 text-xs tabular-nums text-neutral-500">{formatClock(arr)}</span>
          <span className="font-medium">{leg.to.name}</span>
          {leg.to.platform && <span className="text-neutral-500"> · {platformWord} {leg.to.platform}</span>}
        </p>
      </div>
    </li>
  );
}

/**
 * Waar is het voertuig van dit reisdeel nu? OVapi/KV6: bij IN_TRANSIT_TO is currentStopSequence de
 * laatst vertrokken halte; bij STOPPED_AT de halte waar het staat.
 */
function liveStatus(leg: TransitLeg, vehicle: ApiVehicle | undefined, dep: number, arr: number, nowMs: number): { text: string; live: boolean; tone?: "bad" } {
  const now = nowMs / 1000;
  const mode = MODE_LABELS[leg.mode].toLowerCase();
  if (leg.canceled) return { text: "Deze rit valt uit", live: false, tone: "bad" };
  if (!vehicle) {
    if (dep - now > 20 * 60) return { text: `Vertrekt om ${formatClock(dep)}`, live: false };
    if (arr < now) return { text: "Deze rit is al voorbij", live: false };
    return { text: `Nog geen live positie van de ${mode}`, live: false };
  }
  const seq = vehicle.currentStopSequence;
  const atStop = vehicle.status === "STOPPED_AT";
  const beforeBoard = seq === undefined || seq < leg.fromSequence || (seq === leg.fromSequence && atStop);
  const onBoard = !beforeBoard && seq !== undefined && seq < leg.toSequence;
  if (beforeBoard) {
    if (seq === leg.fromSequence && atStop) return { text: `● De ${mode} staat nu bij je halte`, live: true };
    const m = Math.round((dep - now) / 60);
    return { text: `● De ${mode} rijdt · bij je halte ${m <= 0 ? "nu" : `over ${m} min`}`, live: true };
  }
  if (onBoard) {
    const m = Math.round((arr - now) / 60);
    return { text: `● Onderweg · uitstappen ${m <= 0 ? "nu" : `over ${m} min`}`, live: true };
  }
  return { text: "● De rit is voorbij je uitstaphalte", live: true };
}

const SUPPORT_TEXT: Record<Exclude<ReturnType<typeof pushSupport>, "ok">, string> = {
  insecure: "Meldingen werken alleen via een beveiligde verbinding (https). Op deze computer via http://localhost:3000.",
  unsupported: "Deze browser ondersteunt geen pushmeldingen.",
  "ios-install": "Op iPhone: tik op Deel → \"Zet op beginscherm\", open Live OV vanaf je beginscherm en zet daar de meldingen aan.",
  denied: "Meldingen staan uit voor deze site. Zet ze aan in de instellingen van je browser.",
};

/** Link naar deze reis, zodat iemand anders live kan meekijken. */
function ShareButton({ journey }: { journey: Journey }) {
  const [state, setState] = useState<"idle" | "busy" | "copied" | "error">("idle");
  async function share() {
    setState("busy");
    try {
      const result = await shareJourney(journey);
      setState(result === "copied" ? "copied" : "idle");
      if (result === "copied") setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("error");
    }
  }
  return (
    <button
      onClick={share}
      disabled={state === "busy"}
      title="Deel een link waarmee iemand je reis live kan volgen"
      className="shrink-0 self-start rounded-xl bg-neutral-100 px-3 py-2 text-sm font-medium hover:bg-neutral-200 disabled:opacity-60 dark:bg-neutral-800 dark:hover:bg-neutral-700"
    >
      {state === "copied" ? "✓ Link gekopieerd" : state === "error" ? "Delen mislukt" : "↗ Deel reis"}
    </button>
  );
}

/** "Houd me op de hoogte": de backend stuurt meldingen voor deze reis, ook als de app dicht is. */
function NotifyButton({ journey }: { journey: Journey }) {
  const [support] = useState(() => pushSupport());
  const [watch, setWatch] = useState<ActiveWatch | null>(() => activeWatch());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const following = watch?.key === journeyKey(journey);

  if (support !== "ok") {
    return <p className="min-w-0 flex-1 rounded-lg bg-neutral-100 px-3 py-2 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">🔔 {SUPPORT_TEXT[support]}</p>;
  }

  async function toggle() {
    setBusy(true);
    setError(null);
    try {
      if (following && watch) {
        await unwatchJourney(watch);
        setWatch(null);
      } else {
        setWatch(await watchJourney(journey));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Meldingen aanzetten mislukt.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-w-0 flex-1">
      <button
        onClick={toggle}
        disabled={busy}
        className={`w-full rounded-xl py-2 text-sm font-medium transition disabled:opacity-60 ${
          following ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {busy ? "Even geduld…" : following ? "🔔 Je krijgt meldingen voor deze reis · stoppen" : "🔔 Houd me op de hoogte"}
      </button>
      {following && (
        <p className="mt-1 text-xs text-neutral-500">Je krijgt een melding als je moet vertrekken, als je voertuig eraan komt, bij vertraging of uitval en vlak voor het uitstappen.</p>
      )}
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
