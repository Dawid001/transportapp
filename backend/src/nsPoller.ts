import type { openGtfs } from "./gtfs/lookup.js";
import { createMotionEstimator } from "./motion.js";
import { fetchNsTrains, NsRateLimitError, trainLabel } from "./ns.js";
import { serviceDate } from "./time.js";
import type { ApiVehicle } from "./server.js";

// De NS API heeft een daglimiet per key; elke 20 s is ~4.300 calls per dag. De posities zijn vers
// en bevatten snelheid, dus met doorrijden in de frontend is vaker ophalen niet nodig.
const NS_POLL_INTERVAL_MS = 20_000;
const NS_BACKOFF_MS = 120_000;

type Gtfs = ReturnType<typeof openGtfs>;

export type NsState = { updatedAt: number; vehicles: ApiVehicle[]; unmatched: number } | null;

export function startNsPoller(getGtfs: () => Gtfs, apiKey: string) {
  // Eigen estimator: die van de bussen ruimt historie op van voertuigen die niet in zijn lijst zitten.
  // Bij een nieuwe dienstregeling (andere gtfs) een nieuwe estimator, anders verwijst hij naar de oude database.
  let motionFor: Gtfs | null = null;
  let motion: ReturnType<typeof createMotionEstimator> | null = null;
  let state: NsState = null;
  let lastError: string | null = null;

  async function poll(): Promise<number> {
    try {
      const trains = await fetchNsTrains(apiKey);
      const gtfs = getGtfs();
      if (gtfs !== motionFor || !motion) {
        motion = createMotionEstimator(gtfs.tripRoute);
        motionFor = gtfs;
      }
      const estimator = motion;
      const nowSec = Math.floor(Date.now() / 1000);
      // Na middernacht rijden de laatste treinen nog op de dienstdag van gisteren.
      const dates = [serviceDate(0), serviceDate(1)];

      const vehicles = trains.map((t): ApiVehicle => {
        const tripId = dates.map((d) => gtfs.trainTrip(t.trainNumber, d)).find((id) => id) ?? undefined;
        const info = tripId ? gtfs.lookup(tripId) : null;
        const speedMs = t.speedKmh / 3.6;
        const where = tripId ? estimator.locate(tripId, t.lat, t.lng, speedMs) : null;
        return {
          id: `NS:${t.trainNumber}`,
          operator: t.type === "ARR" ? "ARR" : "NS",
          agencyName: info?.agencyName ?? (t.type === "ARR" ? "Arriva" : "NS"),
          vehicleNumber: t.trainNumber,
          mode: "train",
          line: trainLabel(info?.line, t.type),
          headsign: info?.headsign,
          lat: t.lat,
          lng: t.lng,
          directionId: info?.directionId,
          status: where?.status,
          currentStopSequence: where?.currentStopSequence,
          tripId,
          shapeId: info?.shapeId,
          timestamp: nowSec,
          speed: Math.round(speedMs * 10) / 10,
        };
      });

      const { motions } = estimator.update(
        vehicles.map((v) => ({ ...v, measuredSpeed: v.speed })),
        nowSec,
      );
      for (const v of vehicles) v.path = motions.get(v.id)?.path;

      // De NS API geeft soms een onvolledig antwoord (gezien: 13 i.p.v. ~195 treinen). Bij zo'n plotselinge
      // daling de vorige (hooguit 3 min oude) lijst houden, anders verdwijnen treinen even van de kaart.
      if (state && vehicles.length < state.vehicles.length * 0.5 && Date.now() - state.updatedAt < 180_000) {
        console.warn(`[NS] Onvolledig antwoord (${vehicles.length} i.p.v. ~${state.vehicles.length} treinen), vorige lijst blijft staan`);
        return NS_POLL_INTERVAL_MS;
      }

      const unmatched = vehicles.filter((v) => !v.tripId).length;
      state = { updatedAt: Date.now(), vehicles, unmatched };
      lastError = null;
      return NS_POLL_INTERVAL_MS;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.error(`[NS] Poll mislukt: ${lastError}`);
      return err instanceof NsRateLimitError ? NS_BACKOFF_MS : NS_POLL_INTERVAL_MS;
    }
  }

  let logged = 0;
  async function loop() {
    const delay = await poll();
    // Niet elke 20 s loggen; eens per ~2 minuten is genoeg.
    if (state && Date.now() - logged > 115_000) {
      logged = Date.now();
      const moving = state.vehicles.filter((v) => v.path).length;
      console.log(`[NS] ${state.vehicles.length} treinen (${state.unmatched} zonder rit, ${moving} met voorspelde rit)`);
    }
    setTimeout(loop, delay);
  }
  void loop();

  return {
    get state() {
      return state;
    },
    get lastError() {
      return lastError;
    },
  };
}
