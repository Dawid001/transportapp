import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { DATA_DIR } from "./gtfs/paths.js";
import type { Journey, Leg, LegPlace } from "./planner.js";
import type { Mode } from "./gtfs/lookup.js";

/**
 * Gedeelde reizen: iemand deelt een link (/?reis=<id>) en een ander volgt die reis live mee.
 * We bewaren alleen de vaste gegevens van de reis; realtime (treintijden, drukte, meldingen) en de
 * voertuigen worden bij het openen opnieuw opgehaald. Een gedeelde reis verloopt 6 uur na aankomst.
 */

const SHARES_FILE = path.join(DATA_DIR, "shares.json");
const KEEP_AFTER_ARRIVAL_S = 6 * 3600;
const MAX_SHARES = 5000;
const MODES: Mode[] = ["tram", "metro", "train", "bus", "ferry", "other"];

type Share = { id: string; created: number; journey: Journey };

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.slice(0, max) : undefined);
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : undefined);
const coord = (v: unknown, min: number, max: number) => {
  const n = num(v);
  return n !== undefined && n >= min && n <= max ? Math.round(n * 1e5) / 1e5 : undefined;
};

function cleanPlace(v: unknown): LegPlace | null {
  const p = v as Record<string, unknown> | null;
  const name = str(p?.name);
  const lat = coord(p?.lat, 45, 56);
  const lng = coord(p?.lng, -2, 12);
  if (!name || lat === undefined || lng === undefined) return null;
  return { name, lat, lng, stopId: str(p?.stopId, 60), platform: str(p?.platform, 10) };
}

function cleanLeg(v: unknown): Leg | null {
  const l = v as Record<string, unknown> | null;
  const from = cleanPlace(l?.from);
  const to = cleanPlace(l?.to);
  const departure = num(l?.departure);
  const arrival = num(l?.arrival);
  if (!from || !to || departure === undefined || arrival === undefined || arrival < departure) return null;
  if (l?.type === "walk") return { type: "walk", from, to, departure, arrival, distance: num(l.distance) ?? 0 };
  if (l?.type !== "transit") return null;
  const mode = MODES.find((m) => m === l.mode);
  const tripId = str(l.tripId, 80);
  const fromSequence = num(l.fromSequence);
  const toSequence = num(l.toSequence);
  if (!mode || !tripId || fromSequence === undefined || toSequence === undefined) return null;
  const path = (Array.isArray(l.path) ? l.path : []).slice(0, 20_000).flatMap((pt): [number, number][] => {
    const x = Array.isArray(pt) ? coord(pt[0], -2, 12) : undefined;
    const y = Array.isArray(pt) ? coord(pt[1], 45, 56) : undefined;
    return x !== undefined && y !== undefined ? [[x, y]] : [];
  });
  return {
    type: "transit",
    mode,
    line: str(l.line, 20),
    headsign: str(l.headsign),
    agencyName: str(l.agencyName, 80),
    tripId,
    from,
    to,
    departure,
    arrival,
    stopsBetween: num(l.stopsBetween) ?? 0,
    fromSequence,
    toSequence,
    path,
  };
}

/** Alleen bekende velden overnemen: de reis komt van de browser en wordt aan anderen getoond. */
export function cleanJourney(v: unknown): Journey | null {
  const j = v as Record<string, unknown> | null;
  if (!Array.isArray(j?.legs) || j.legs.length === 0 || j.legs.length > 12) return null;
  const legs = j.legs.map(cleanLeg);
  if (legs.some((l) => !l)) return null;
  const clean = legs as Leg[];
  return {
    departure: clean[0].departure,
    arrival: clean[clean.length - 1].arrival,
    transfers: Math.max(0, clean.filter((l) => l.type === "transit").length - 1),
    legs: clean,
  };
}

export function createShareStore() {
  let shares: Share[] = [];
  try {
    if (existsSync(SHARES_FILE)) shares = JSON.parse(readFileSync(SHARES_FILE, "utf8")) as Share[];
  } catch {
    shares = [];
  }
  const save = () => writeFileSync(SHARES_FILE, JSON.stringify(shares));
  const expired = (s: Share, now: number) => s.journey.arrival + KEEP_AFTER_ARRIVAL_S < now;

  return {
    create(journey: Journey): string {
      const now = Date.now() / 1000;
      shares = shares.filter((s) => !expired(s, now)).slice(-(MAX_SHARES - 1));
      // 12 tekens, niet te raden: alleen wie de link heeft ziet de reis.
      const id = randomBytes(9).toString("base64url");
      shares.push({ id, created: Math.floor(now), journey });
      save();
      return id;
    },
    get(id: string): Journey | undefined {
      const s = shares.find((x) => x.id === id);
      return s && !expired(s, Date.now() / 1000) ? structuredClone(s.journey) : undefined;
    },
  };
}
