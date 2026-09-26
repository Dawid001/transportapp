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

/** Halte zoals de reiziger hem ziet (alle perrons/richtingen samen). */
export type StopSummary = { id: string; name: string; lat: number; lng: number; modes: Mode[] };

/** Plaats, straat of adres (PDOK). */
export type Place = { id: string; name: string; type: "woonplaats" | "weg" | "adres" | "postcode"; lat: number; lng: number };

/** GET /api/search */
export type SearchResponse = { stops: StopSummary[]; places: Place[] };

export type Departure = {
  tripId: string;
  line?: string;
  headsign?: string;
  mode: Mode;
  agencyName?: string;
  platform?: string;
  /** Het spoor is gewijzigd t.o.v. de planning. */
  platformChanged?: boolean;
  /** Unix-seconden. */
  scheduled: number;
  expected?: number;
  delay?: number;
  canceled?: boolean;
  skipped?: boolean;
  live?: boolean;
};

/** Melding: omleiding, tijdelijke halte, werkzaamheden of storing. */
export type Alert = { id: string; source: "ov" | "ns"; title: string; text?: string };

/** GET /api/stops/:id/departures */
export type DeparturesResponse = { stop: StopSummary; from: number; updatedAt: number | null; alerts: Alert[]; departures: Departure[] };

/** Begin- of eindpunt in de planner: een halte, een plaats/adres of je eigen locatie. */
export type PlanEndpoint =
  | { kind: "stop"; stop: StopSummary }
  | { kind: "place"; place: Place }
  | { kind: "location"; lat: number; lng: number };

export type LegPlace = { name: string; lat: number; lng: number; stopId?: string; platform?: string };

export type WalkLeg = { type: "walk"; from: LegPlace; to: LegPlace; departure: number; arrival: number; distance: number };

export type TransitLeg = {
  type: "transit";
  mode: Mode;
  line?: string;
  headsign?: string;
  agencyName?: string;
  tripId: string;
  from: LegPlace;
  to: LegPlace;
  departure: number;
  arrival: number;
  expectedDeparture?: number;
  expectedArrival?: number;
  canceled?: boolean;
  stopsBetween: number;
  fromSequence: number;
  toSequence: number;
  path: [number, number][];
  alerts?: Alert[];
};

export type Leg = WalkLeg | TransitLeg;
export type Journey = { departure: number; arrival: number; transfers: number; legs: Leg[] };

/** GET /api/plan */
export type PlanResponse = { from: { name: string }; to: { name: string }; time: number; journeys: Journey[] };
