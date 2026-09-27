import { randomUUID } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import webpush, { type PushSubscription } from "web-push";
import { DATA_DIR } from "./gtfs/paths.js";

/**
 * "Houd me op de hoogte": de backend volgt een gekozen reis en stuurt pushmeldingen, ook als de app dicht is.
 * - Vertrek nu naar je halte (bij lopen naar de eerste halte)
 * - Je bus/tram/trein komt over 2 minuten
 * - Vertraging veranderd (≥ 3 min)
 * - Rit valt uit
 * - Stap uit bij de volgende halte
 */

const VAPID_FILE = path.join(DATA_DIR, "vapid.json");
const WATCHES_FILE = path.join(DATA_DIR, "watches.json");
const CHECK_MS = 30_000;
const LEAVE_BUFFER_S = 120; // 2 min speling bij "vertrek nu"
const ARRIVING_S = 150; // "komt over 2 min"
const ALIGHT_S = 120; // "stap uit bij de volgende halte"
const DELAY_STEP_S = 180; // melden bij ≥ 3 min verandering

/** Reisdeel zoals de frontend het meestuurt (alleen wat nodig is om te volgen). */
export type WatchLeg =
  | { type: "walk"; departure: number; arrival: number; toName: string }
  | {
      type: "transit";
      tripId: string;
      mode: string;
      line?: string;
      headsign?: string;
      fromName: string;
      toName: string;
      fromStopId?: string;
      toStopId?: string;
      fromPlatform?: string;
      fromSequence: number;
      toSequence: number;
      departure: number;
      arrival: number;
    };

type Watch = {
  id: string;
  subscription: PushSubscription;
  legs: WatchLeg[];
  /** Al verstuurde meldingen (sleutels) en laatst gemelde vertraging per reisdeel. */
  sent: string[];
  lastDelay: Record<number, number>;
};

/** Realtime tijden bij een halte van een rit: verwacht vertrek/aankomst, of uitgevallen. */
export type LegRealtime = (
  leg: Extract<WatchLeg, { type: "transit" }>,
) => Promise<{ departure?: number; arrival?: number; canceled?: boolean; vehicleSequence?: number } | undefined>;

const MODE_WORDS: Record<string, string> = { bus: "bus", tram: "tram", metro: "metro", train: "trein", ferry: "veerboot" };
const clock = (unix: number) =>
  new Date(unix * 1000).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Amsterdam" });
const legName = (leg: Extract<WatchLeg, { type: "transit" }>) =>
  `${(MODE_WORDS[leg.mode] ?? "rit").replace(/^./, (c) => c.toUpperCase())} ${leg.line ?? ""}`.trim();
/** Midden in een zin: "je trein IC" i.p.v. "je Trein IC". */
const legNameInline = (leg: Extract<WatchLeg, { type: "transit" }>) => `${MODE_WORDS[leg.mode] ?? "rit"} ${leg.line ?? ""}`.trim();

function loadVapid(): { publicKey: string; privateKey: string } {
  if (existsSync(VAPID_FILE)) return JSON.parse(readFileSync(VAPID_FILE, "utf8"));
  // Eenmalig een sleutelpaar maken; staat in data/ (niet in git). Nieuwe sleutels = opnieuw aanmelden in de app.
  const keys = webpush.generateVAPIDKeys();
  writeFileSync(VAPID_FILE, JSON.stringify(keys, null, 2));
  console.log("[Push] Nieuwe VAPID-sleutels aangemaakt in data/vapid.json");
  return keys;
}

export function createJourneyWatcher(realtime: LegRealtime) {
  const vapid = loadVapid();
  webpush.setVapidDetails("https://github.com/Dawid001/transportapp", vapid.publicKey, vapid.privateKey);

  let watches: Watch[] = [];
  try {
    watches = JSON.parse(readFileSync(WATCHES_FILE, "utf8")) as Watch[];
  } catch {
    // nog geen gevolgde reizen
  }
  const save = () => writeFileSync(WATCHES_FILE, JSON.stringify(watches));

  async function push(watch: Watch, key: string, title: string, body: string) {
    if (watch.sent.includes(key)) return;
    watch.sent.push(key);
    try {
      await webpush.sendNotification(watch.subscription, JSON.stringify({ title, body, tag: `${watch.id}:${key}`, url: "/" }), { TTL: 300, urgency: "high" });
      console.log(`[Push] ${title} — ${body}`);
    } catch (err) {
      const status = (err as { statusCode?: number }).statusCode;
      // 404/410: abonnement bestaat niet meer (app verwijderd, meldingen uitgezet).
      if (status === 404 || status === 410) watches = watches.filter((w) => w !== watch);
      else console.error("[Push] Versturen mislukt:", status ?? (err instanceof Error ? err.message : err));
    }
  }

  async function check() {
    const now = Date.now() / 1000;
    for (const watch of [...watches]) {
      const lastArrival = watch.legs[watch.legs.length - 1]?.arrival ?? 0;
      if (now > lastArrival + 10 * 60) {
        watches = watches.filter((w) => w !== watch);
        continue;
      }
      const transits = watch.legs.map((l, i) => ({ l, i })).filter((x): x is { l: Extract<WatchLeg, { type: "transit" }>; i: number } => x.l.type === "transit");
      for (const [n, { l: leg, i }] of transits.entries()) {
        if (now > leg.arrival + 5 * 60) continue; // dit deel is al voorbij
        const rt = await realtime(leg).catch(() => undefined);
        const dep = rt?.departure ?? leg.departure;
        const arr = rt?.arrival ?? leg.arrival;
        const name = legName(leg);

        if (rt?.canceled) {
          await push(watch, `cancel-${i}`, `${name} rijdt niet`, `Je ${legNameInline(leg)} van ${clock(leg.departure)} naar ${leg.headsign ?? leg.toName} valt uit. Plan je reis opnieuw.`);
          continue;
        }

        // Vertraging veranderd (vóór het instappen).
        const delay = dep - leg.departure;
        const last = watch.lastDelay[i] ?? 0;
        if (now < dep && Math.abs(delay - last) >= DELAY_STEP_S) {
          watch.lastDelay[i] = delay;
          const body =
            delay >= 60
              ? `${name} heeft nu ${Math.round(delay / 60)} min vertraging en vertrekt om ${clock(dep)} van ${leg.fromName}.`
              : `${name} rijdt weer op tijd: vertrek ${clock(dep)} van ${leg.fromName}.`;
          await push(watch, `delay-${i}-${Math.round(delay / 60)}`, delay >= 60 ? `+${Math.round(delay / 60)} min vertraging` : "Weer op tijd", body);
        }

        // Eerste reisdeel: op tijd vertrekken naar de halte (als je daarheen moet lopen).
        if (n === 0) {
          const walk = watch.legs.slice(0, i).reduce((s, l) => s + (l.arrival - l.departure), 0);
          if (walk > 60 && now >= dep - walk - LEAVE_BUFFER_S && now < dep) {
            await push(
              watch,
              "leave",
              "Vertrek nu",
              `Loop ${Math.round(walk / 60)} min naar ${leg.fromName}. ${name} vertrekt om ${clock(dep)}${leg.fromPlatform ? ` (${leg.mode === "train" ? "spoor" : "perron"} ${leg.fromPlatform})` : ""}.`,
            );
          }
        }

        // Voertuig komt eraan.
        if (dep - now <= ARRIVING_S && dep - now > -30) {
          const m = Math.max(1, Math.round((dep - now) / 60));
          await push(watch, `arriving-${i}`, `${name} komt over ${m} min`, `${name} → ${leg.headsign ?? leg.toName} vertrekt om ${clock(dep)} van ${leg.fromName}.`);
        }

        // Onderweg: bijna bij de uitstaphalte.
        if (now > dep && arr - now <= ALIGHT_S && arr - now > -30) {
          const next = transits[n + 1]?.l;
          await push(
            watch,
            `alight-${i}`,
            `Stap uit bij ${leg.toName}`,
            next ? `Daarna overstappen op de ${legNameInline(next)} naar ${next.headsign ?? next.toName} (${clock(next.departure)}).` : `Je bent bijna op je bestemming (${clock(arr)}).`,
          );
        }
      }
    }
    save();
  }

  setInterval(() => void check(), CHECK_MS);

  return {
    publicKey: vapid.publicKey,
    watch(subscription: PushSubscription, legs: WatchLeg[]): string {
      // Eén gevolgde reis per apparaat: een nieuwe vervangt de vorige.
      watches = watches.filter((w) => w.subscription.endpoint !== subscription.endpoint);
      const id = randomUUID();
      watches.push({ id, subscription, legs, sent: [], lastDelay: {} });
      save();
      void check();
      return id;
    },
    unwatch(id: string) {
      watches = watches.filter((w) => w.id !== id);
      save();
    },
    async test(subscription: PushSubscription) {
      await webpush.sendNotification(subscription, JSON.stringify({ title: "Meldingen staan aan", body: "Je krijgt bericht als je moet vertrekken, bij vertraging en bij het uitstappen.", tag: "test", url: "/" }));
    },
  };
}
