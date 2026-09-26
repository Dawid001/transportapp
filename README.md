# live-ov

Live kaart van het Nederlandse OV op basis van de OVapi GTFS-Realtime feeds.

## Fase 1 — feed uitlezen

```bash
cd backend
npm install
npm run vehicles
```

Het script haalt `https://gtfs.ovapi.nl/nl/vehiclePositions.pb` op, zet elk voertuig om naar een `Vehicle`-object en telt per vervoerder hoeveel voertuigen er een GPS-positie hebben.

### Bevindingen (26-09-2026)

- Er zijn zo'n 2.600 voertuigen met positie, van 8 vervoerders: CXX, ARR, QBUZZ, EBS, GVB, RET, HTM en KEOLIS.
- De vervoerder staat alleen in het entity-ID: `datum:VERVOERDER:lijn:rit`.
- `routeId` is een intern GTFS-ID (bv. `147039`), geen lijnnummer. Voor "182 Leiden → Alphen" is `routes.txt` of `trips.txt` uit de statische GTFS nodig.
- De feed bevat geen bearing en geen speed. Rijrichting moet je afleiden uit opeenvolgende posities of de route-shape.
- OVapi geeft HTTP 429 bij een paar snelle requests. De backend moet de feed dus één keer centraal ophalen en cachen.

## Fase 2 — dienstregeling + eigen API

```bash
cd backend
npm run gtfs:update   # downloadt de GTFS-zip (266 MB) alleen als er een nieuwe is, en bouwt data/gtfs.db (~8s)
npm run dev           # start de API op http://localhost:3001
```

De GTFS van OVapi wordt elke nacht ververst. Draai `gtfs:update` dus dagelijks; zonder nieuwe versie doet het niets. Met `-- --force` importeer je opnieuw zonder te downloaden.

### Endpoints

| Endpoint | Beschrijving |
|---|---|
| `GET /api/vehicles` | Alle voertuigen, aangevuld met lijnnummer, bestemming, vervoerder en vervoerswijze |
| `GET /api/vehicles?bbox=minLng,minLat,maxLng,maxLat` | Alleen voertuigen binnen het kaartvlak |
| `GET /api/vehicles?line=2&mode=tram` | Filter op lijn en/of vervoerswijze (`bus`, `tram`, `metro`, `train`, `ferry`) |
| `GET /api/health` | Status van de poller |

De server haalt de OVapi-feed één keer per 30 seconden op voor alle gebruikers samen. Dat gaat met `If-None-Match` (ETag), zodat een ongewijzigde feed alleen een 304 kost. OVapi staat ongeveer 2 requests per minuut toe; na een 429 wacht de server 60 seconden.

### Bevindingen

- 98% van de realtime `tripId`'s staat in `trips.txt`. Voor de rest vullen we de lijn aan via `routeId`, waarna ongeveer 20 van de ~2.650 voertuigen zonder lijninfo overblijven.
- `stop_times.txt` is 1,26 GB en wordt nog niet geïmporteerd. Die is pas nodig voor haltes per rit en ETA's.
- `agencyName` is de merknaam (bv. EBS-lijn 71 heet "RRReis"). `operator` is de code uit de realtime feed.

## Fase 3 — live kaart

Start de backend en de frontend elk in een eigen terminal:

```bash
cd backend && npm run dev
```

```bash
cd frontend && npm run dev
```

Open daarna http://localhost:3000.

- De kaart is MapLibre met gratis tiles van OpenFreeMap (geen API-key), licht of donker volgens je systeeminstelling.
- De frontend vraagt elke 10 seconden `/api/vehicles?bbox=…` op voor het zichtbare kaartdeel, en opnieuw na het schuiven of zoomen. Voertuigen glijden in 1,5 seconde naar hun nieuwe positie.
- Next.js stuurt `/api/*` door naar de backend (zie `next.config.ts`). Een andere backend-URL stel je in met `API_URL`.
- Klik op een voertuig voor lijn, bestemming, vervoerder en wagennummer. Met "Volg dit voertuig" beweegt de kaart mee.
- De zoekbalk filtert op lijnnummer en zoomt naar alle voertuigen van die lijn, ook bij meerdere vervoerders.
- Posities die ouder zijn dan 5 minuten worden half doorzichtig getoond.

MapLibre 6 draait in een web worker die Turbopack niet bundelt. `npm install` kopieert die worker via `postinstall` naar `public/maplibre/`.

## Fase 5/6 — routes en haltes

`npm run gtfs:update` importeert nu ook:

- **`shapes.txt`** (8,3 miljoen punten): één rij per route, met de punten als binaire Float32-lijst (~67 MB in plaats van 300 MB).
- **`stop_times.txt`** (21 miljoen rijen): 1,09 miljoen ritten gebruiken samen maar ~20.000 unieke haltepatronen. Elk patroon wordt één keer opgeslagen en de ritten verwijzen ernaar. Tijden worden nog niet opgeslagen; die komen bij de ETA's.

De import duurt ongeveer 70 seconden en de database wordt ongeveer 265 MB. Draait de server tijdens de import, dan staat de nieuwe database klaar als `gtfs.db.new` en wordt die bij de volgende serverstart actief (Windows kan een geopend bestand niet vervangen).

### Endpoints

| Endpoint | Beschrijving |
|---|---|
| `GET /api/trips/:tripId` | Route (`shape`) en alle haltes van één rit |
| `GET /api/lines/:line` | Alle trajecten van een lijnnummer: per vervoerder en richting elke variant die ≥10% van de ritten rijdt, vereenvoudigd tot 5 m nauwkeurig |

### In de app

- **Klik op een voertuig**: de route van die rit verschijnt. Het gereden deel en de gepasseerde haltes zijn grijs. Het paneel toont de volgende haltes; klik op een halte om ernaartoe te zoomen.
- **Zoek een lijn**: het hele traject van die lijn verschijnt, in beide richtingen en bij alle vervoerders met dat nummer.

## Vloeiende beweging (dead reckoning)

Vanaf zoomniveau 12 rijden voertuigen tussen twee GPS-updates door over hun route.

- **Backend** (`src/motion.ts`): legt elk voertuig op de route van zijn rit en meet de snelheid over de weg uit twee opeenvolgende posities (gemiddelde inclusief stoppen). `/api/vehicles?paths=1` geeft per rijdend voertuig `speed` (m/s) en `path` mee: het stuk route vanaf de GPS-positie tot hooguit twee haltes verder.
- **Frontend** (`src/lib/motion.ts`): laat het bolletje met die snelheid over het pad rijden, gerekend vanaf de GPS-tijd en met de serverklok. Bij nieuwe data ebt het verschil in 1,5 seconde weg, zodat er niets springt.
- Staat een voertuig volgens de feed bij een halte, ligt het meer dan 80 m naast zijn route, of is de positie ouder dan 3 minuten, dan blijft het staan.
- Zet `DEBUG_MOTION=1` om per poll te zien waarom voertuigen wel of geen voorspelling krijgen.

### Let op: `currentStopSequence` van OVapi

OVapi volgt de Nederlandse KV6-betekenis en niet de GTFS-spec. Bij `STOPPED_AT` staat het voertuig bij die halte, maar bij `IN_TRANSIT_TO` is het de halte waar het **net vertrokken** is, niet de volgende. Gemeten: ongeveer 75% van de voertuigen met `IN_TRANSIT_TO` was al voorbij die halte.

### Bevindingen

- De posities in de feed zijn gemiddeld ~1 minuut oud, en OVapi ververst ze ongeveer eens per minuut (niet bij elke poll).
- Van de ~2.600 voertuigen krijgen er ~1.500 een voorspelling. De rest staat bij een halte, heeft geen route, of er is nog geen snelheid gemeten (dat kost twee verse posities na een herstart).
- De gemeten snelheden zijn realistisch: mediaan 27 km/u, en de snelste 10% rijdt 58 km/u of meer.

### Benaderde routes (o.a. RET)

Sommige vervoerders leveren geen echte routelijn, alleen rechte stukken van halte naar halte. RET doet dat voor al zijn 608 routes (bijvoorbeeld lijn 144: 15 km in 26 punten, stukken tot 1,7 km recht). Een paar kleinere partijen doen het ook (Doeksen, De Lijn, internationale NS-treinen).

- De backend herkent zo'n lijn automatisch: als de mediaan van de afstand tussen twee punten groter is dan 150 m, krijgt de route `approximate: true` (`isCoarse()` in `lookup.ts`).
- De app tekent zo'n route **gestippeld** en legt in het paneel uit dat het een benadering is.
- Voertuigen rijden er **niet** over door, maar verspringen alleen bij nieuwe posities (`benaderdeRoute` in de `DEBUG_MOTION`-telling).
- Mogelijke verbetering: echte routes ophalen uit OpenStreetMap (route-relaties via de Overpass API).

## Treinen (NS Virtual Train API)

Live posities van NS-treinen, plus een deel van de regionale treinen (Arriva, Keolis, R-net, Blauwnet).

**Instellen:** maak een gratis account op https://apiportal.ns.nl en abonneer je op het product "Ns-App". Zet je Primary key in `backend/.env`:

```
NS_API_KEY=...
```

Zonder key draait de rest gewoon; de NS-treinen staan dan uit.

**Hoe het werkt** (`src/ns.ts`, `src/nsPoller.ts`):

- `GET https://gateway.apiportal.ns.nl/virtual-train-api/vehicle` (header `Ocp-Apim-Subscription-Key`) geeft ~190 treinen met positie, **snelheid (km/u) en rijrichting**. De posities zijn vers, in tegenstelling tot de OVapi-busposities van ~1 minuut oud. Het veld `horizontaleNauwkeurigheid` bevat onzinwaarden en wordt genegeerd.
- De backend vraagt elke 20 seconden op (~4.300 calls per dag, vanwege de daglimiet per key).
- Het treinnummer wordt gekoppeld aan de rit van vandaag: `trips.trip_short_name` + `calendar_dates` + `route_type = 2` (vervangende bussen hebben soms hetzelfde nummer). Na middernacht wordt ook de dienstdag van gisteren geprobeerd. Daarvoor importeert `gtfs:update` nu ook `calendar_dates.txt`.
- Waar de trein op zijn rit is (vertrokken station, of stilstaand bij een station) bepaalt de backend door de positie op de route te projecteren. Dat gebeurt in dezelfde KV6-betekenis als bij de bussen, zodat de lijst "Volgende haltes" en de grijze stations gewoon werken.
- Doorrijden gebruikt de **gemeten** snelheid van NS, geen schatting.
- Labels: Intercity → `IC`, Sprinter → `SPR`, regionale treinen → hun lijncode (`RS18`, `RE3`).
- Treinnummers vanaf 300000 (extra treinen en materieelritten) staan niet in de dienstregeling. Die worden getoond zonder route en bestemming.
