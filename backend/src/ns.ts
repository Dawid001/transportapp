/**
 * NS Virtual Train API: live posities van (vrijwel) alle treinen van NS, plus een deel van Arriva (via KV6).
 * Anders dan de OVapi-feed geeft deze API ook snelheid en rijrichting, en zijn de posities vers.
 * Key: https://apiportal.ns.nl, product "Ns-App", in backend/.env als NS_API_KEY.
 */

const VEHICLES_URL = "https://gateway.apiportal.ns.nl/virtual-train-api/vehicle";

export type NsTrain = {
  trainNumber: string;
  lat: number;
  lng: number;
  /** km/u */
  speedKmh: number;
  /** graden, 0 = noord */
  bearing: number;
  /** IC, SPR, ARR, … */
  type: string;
  /** OBIS (NS) of KV6 (o.a. Arriva) */
  source: string;
};

export class NsRateLimitError extends Error {}

type RawTrain = {
  treinNummer: number;
  ritId: string;
  lat: number;
  lng: number;
  snelheid: number;
  richting: number;
  type: string;
  bron: string;
};

export async function fetchNsTrains(apiKey: string): Promise<NsTrain[]> {
  const res = await fetch(VEHICLES_URL, { headers: { "Ocp-Apim-Subscription-Key": apiKey } });
  if (res.status === 429) throw new NsRateLimitError("NS API gaf HTTP 429 (rate limit)");
  if (res.status === 401) throw new Error("NS API gaf HTTP 401: klopt NS_API_KEY in backend/.env?");
  if (!res.ok) throw new Error(`NS API gaf HTTP ${res.status}`);

  const body = (await res.json()) as { payload?: { treinen?: RawTrain[] } };
  return (body.payload?.treinen ?? [])
    .filter((t) => Number.isFinite(t.lat) && Number.isFinite(t.lng) && !(t.lat === 0 && t.lng === 0))
    .map((t) => ({
      trainNumber: String(t.ritId ?? t.treinNummer),
      lat: t.lat,
      lng: t.lng,
      speedKmh: t.snelheid ?? 0,
      bearing: t.richting ?? 0,
      type: t.type,
      source: t.bron,
    }));
}

// Treinsoorten zoals ze in de dienstregeling (route_short_name) staan → korte code voor op de kaart.
const TRAIN_ABBREVIATIONS: Record<string, string> = {
  intercity: "IC",
  "intercity direct": "ICD",
  sprinter: "SPR",
  stoptrein: "ST",
  sneltrein: "SNT",
  "ice international": "ICE",
  eurocity: "EC",
  "eurocity direct": "ECD",
  eurostar: "EST",
  nightjet: "NJ",
};

export function trainLabel(routeShortName: string | undefined, apiType: string): string {
  if (routeShortName) {
    const abbr = TRAIN_ABBREVIATIONS[routeShortName.toLowerCase()];
    if (abbr) return abbr;
    if (routeShortName.length <= 4) return routeShortName;
    // Regionale treinen: "Stoptrein RS18", "Sneltrein RE3" → de lijncode, zoals op de stationsborden.
    const code = routeShortName.match(/\s([A-Z]{1,3}\d{1,3})$/)?.[1];
    if (code) return code;
  }
  return apiType;
}
