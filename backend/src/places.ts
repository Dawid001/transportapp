/**
 * Plaatsen, straten en adressen zoeken via de PDOK Locatieserver (overheid, gratis, geen key).
 * https://api.pdok.nl/bzk/locatieserver/search/v3_1/ui/
 */

const SUGGEST_URL = "https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest";
const TIMEOUT_MS = 2500;
const POSTCODE = /\b\d{4}\s?[a-z]{2}\b/i;

export type Place = { id: string; name: string; type: "woonplaats" | "weg" | "adres" | "postcode"; lat: number; lng: number };

type Doc = { id: string; weergavenaam: string; type: Place["type"]; centroide_ll?: string };

const words = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

export async function searchPlaces(query: string, limit = 5): Promise<Place[]> {
  const isPostcode = POSTCODE.test(query);
  const params = new URLSearchParams({
    q: query,
    rows: String(limit * 2),
    fl: "id,weergavenaam,type,centroide_ll",
    // Postcodes alleen als er echt een postcode getypt wordt.
    fq: isPostcode ? "type:(postcode OR adres)" : "type:(woonplaats OR weg OR adres)",
  });
  const res = await fetch(`${SUGGEST_URL}?${params}`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`PDOK gaf HTTP ${res.status}`);
  const body = (await res.json()) as { response?: { docs?: Doc[] } };

  const queryWords = words(query);
  const places: Place[] = [];
  for (const doc of body.response?.docs ?? []) {
    // PDOK matcht ook op postcodeletters ("leiden cs" → "2312CS Leiden"). Zonder postcodezoekopdracht
    // moet elk woord uit de zoekterm het begin van een woord in de naam zijn, de postcode niet meegerekend.
    if (!isPostcode) {
      const nameWords = words(doc.weergavenaam.replace(/\b\d{4}\s?[A-Z]{2}\b/g, " "));
      if (!queryWords.every((q) => nameWords.some((w) => w.startsWith(q)))) continue;
    }
    // centroide_ll = "POINT(lng lat)"
    const m = doc.centroide_ll?.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
    if (!m) continue;
    places.push({ id: doc.id, name: doc.weergavenaam, type: doc.type, lng: Number(m[1]), lat: Number(m[2]) });
    if (places.length >= limit) break;
  }
  return places;
}
