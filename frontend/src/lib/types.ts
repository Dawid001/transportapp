// Houd gelijk met ApiVehicle in backend/src/server.ts.
export type Mode = "tram" | "metro" | "train" | "bus" | "ferry" | "other";

export type ApiVehicle = {
  id: string;
  operator: string;
  agencyName?: string;
  vehicleNumber?: string;
  mode: Mode;
  line?: string;
  headsign?: string;
  routeColor?: string;
  routeTextColor?: string;
  lat: number;
  lng: number;
  directionId?: number;
  status?: string;
  currentStopSequence?: number;
  stopId?: string;
  tripId?: string;
  routeId?: string;
  shapeId?: string;
  timestamp?: number;
  /** Geschatte snelheid over de route (m/s). */
  speed?: number;
  /** Route vóór het voertuig tot de volgende halte (alleen met ?paths=1). */
  path?: [number, number][];
  /** Vertraging in seconden bij de huidige/volgende halte (negatief = te vroeg). */
  delay?: number;
};

export type VehiclesResponse = {
  updatedAt: number;
  serverTime: number;
  feedTimestamp: number;
  count: number;
  vehicles: ApiVehicle[];
};

export type LngLat = [number, number];
export type RouteStop = { sequence: number; id: string; name: string; lat: number; lng: number };

/** GET /api/trips/:tripId */
/** `approximate`: de vervoerder levert geen echte routelijn, alleen rechte stukken tussen haltes. */
export type TripRoute = { tripId: string; shape: LngLat[] | null; approximate: boolean; stops: RouteStop[] };

/** GET /api/lines/:line */
export type LineVariant = {
  routeId: string;
  directionId?: number;
  headsign?: string;
  agencyName?: string;
  mode: Mode;
  shape: LngLat[];
  approximate: boolean;
};
export type LineRoutesResponse = { line: string; variants: LineVariant[] };

/** Tijden van één halte van een rit (unix-seconden); `delay` in seconden, negatief = te vroeg. */
export type StopTime = {
  sequence: number;
  scheduledArrival?: number;
  scheduledDeparture?: number;
  expectedArrival?: number;
  expectedDeparture?: number;
  delay?: number;
  /** De rit komt niet langs deze halte (ingekort of omgeleid). */
  skipped?: boolean;
};

/** GET /api/trips/:tripId/times */
export type TripStopTimes = { tripId: string; serviceDate: string; realtime: boolean; canceled: boolean; stops: StopTime[] };
