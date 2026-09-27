# live-ov

Live kaart van het Nederlandse OV op basis van de OVapi GTFS-Realtime feeds.


## Snel starten

**Windows**: dubbelklik op **`Start Live OV.cmd`**. Het installeert wat ontbreekt, bouwt de eerste keer de dienstregeling (een paar minuten), start backend + frontend en opent http://localhost:3000.

**Of met de terminal**, vanuit deze map:

```bash
npm install        # eenmalig
npm run setup      # eenmalig: onderdelen installeren + dienstregeling opbouwen
npm run dev        # backend (poort 3001) en frontend (poort 3000) samen
```

Stoppen met Ctrl+C. Voor de NS-treinen is een key nodig in `backend/.env` (zie "Treinen" hieronder). De backend gebruikt `BACKEND_PORT` (standaard 3001), zodat `PORT` voor de frontend blijft.

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
npm run gtfs:update   # eenmalig bij de eerste keer: downloadt de dienstregeling en bouwt de database (~2,5 min)
npm run dev           # start de API op http://localhost:3001
```

De dienstregeling wordt daarna **automatisch** bijgewerkt door de backend (zie "Dienstregeling automatisch bijwerken" hieronder). Met `npm run gtfs:update -- --force` importeer je handmatig opnieuw zonder te downloaden; een draaiende backend neemt dat binnen een minuut over.

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

De import duurt ongeveer 1,5 minuut en de database wordt ongeveer 275 MB.

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

## Aankomsttijden en vertraging

Klik je op een voertuig, dan zie je per halte de verwachte tijd, de vertraging en "over X min" voor de volgende halte. Onder de bestemming staat hoe punctueel het voertuig rijdt: 🟢 op tijd, 🟠 2–4 min, 🔴 5+ min, of "Rit uitgevallen".

- **Geplande tijden**: `gtfs:update` importeert nu ook de tijden uit `stop_times.txt`. De 1,09 miljoen ritten gebruiken samen ~49.000 unieke tijdprofielen; per rit worden alleen de starttijd en een verwijzing naar het profiel opgeslagen (+16 MB).
- **Verwachte tijden**: `tripUpdates.pb` van OVapi (~3,6 MB, ~7.300 ritten van bus, tram en metro). Voor treinen zijn er alleen geplande tijden.
- **Polling**: posities en verwachte tijden worden om en om opgehaald, elk één keer per minuut, om onder de rate limit van OVapi te blijven.
- `GET /api/trips/:tripId/times` geeft per halte de geplande en verwachte tijden (unix-seconden) en de vertraging. `/api/vehicles` geeft per voertuig `delay` (seconden) bij de huidige of volgende halte.
- Heeft een halte geen update, dan loopt de vertraging van de vorige halte door (volgens de GTFS-RT-spec).

### Wat de feed nog meer vertelt

- **SKIPPED**: de rit komt niet langs die halte, door een ingekorte rit of een omleiding. De app streept zulke haltes door ("Rijdt niet via deze halte").
- **CANCELED**: de rit is uitgevallen. Dat geldt voor ~18% van de ritten in de feed, vooral ritten die nog moeten vertrekken.
- **NO_DATA**: vanaf die halte zijn er alleen geplande tijden.

Verder: de NS API geeft soms een onvolledig antwoord (bijvoorbeeld 13 in plaats van ~195 treinen). Dan houdt de backend de vorige lijst vast.

## Reisplanner, vertrekborden, meldingen en favorieten

De app draait nu om **van waar je bent → waar je heen wilt**, met de live voertuigen van jouw reis.

### Zoeken (Van / Naar)
- **Haltes**: eigen index van ~25.000 haltes (`src/stopIndex.ts`). Perrons, sporen en beide rijrichtingen worden per halte-gebied samengevoegd, en haltes met dezelfde naam binnen 400 m ook. Ranking: hele woorden, stations en drukke knooppunten eerst, dichtbij de kaart iets hoger.
- **Plaatsen, straten, adressen**: PDOK Locatieserver (`src/places.ts`, gratis, geen key). Postcodes alleen als je echt een postcode typt.
- **Mijn locatie** via de browser. Is je locatie niet beschikbaar, kies dan een vertrekpunt.

### Reisplanner (`src/planner.ts`, `GET /api/plan`)
- RAPTOR op de dienstregeling in het geheugen (`src/timetable.ts`): maximaal 4 overstappen, lopen naar/van haltes tot 1 km en tussen haltes tot 400 m (+1 min overstapmarge). Uitgevallen ritten worden overgeslagen.
- Geeft ~5 opties: de snelste, en daarna telkens een iets latere vertrektijd. Per reisdeel: tijden, spoor/perron, aantal haltes, realtime (OVapi voor bus/tram/metro, NS voor treinen), meldingen en de lijn over de echte routelijn.
- Na het opstarten ~1,7 s om de dienstregeling klaar te zetten; daarna 10–150 ms per zoekopdracht.
- In de app: kies een optie → de reis op de kaart, de voertuigen van jouw reis groen omrand (de rest vervaagt), en per reisdeel live "bij je halte over 3 min" / "uitstappen over 8 min".

### Vertrekbord per halte (`GET /api/stops/:id/departures`)
Klik een halte op de kaart (vanaf zoom 14,5): vertrekken in de komende 1,5 uur met vertraging, uitval, "stopt hier niet" en spoor/perron. Een rit die live rijdt, kun je aanklikken om het voertuig te zien. Met de knoppen **Hierheen** en **Vanaf hier** plan je een reis.

### Treinen realtime (`src/nsRealtime.ts`)
Per station de NS-vertrektijden en -aankomsttijden (60 s gecachet): werkelijke tijd, spoorwijziging ("gewijzigd") en uitval, gekoppeld via het treinnummer. 396 van de 397 NS-stations zijn aan onze stations gekoppeld (op afstand).

### Meldingen (`src/alerts.ts`)
- OVapi-meldingen (bus/tram/metro, ~590), eens per 5 minuten binnen de rotatie van de poller. Een melding voor een hele halte die in de tekst alleen andere lijnen noemt ("Bus N86 stopt hier niet"), wordt niet aan jouw reisdeel gehangen.
- NS-storingen (trein), eens per 5 minuten. Bij een reisdeel alleen als zowel het in- als het uitstapstation in de storing liggen.

### Favorieten
☆ bij een halte of een route; wordt in je browser bewaard (localStorage). Favoriete haltes staan bovenaan in Van/Naar, bewaarde routes als knop onder het paneel.

### Als er niets (meer) rijdt
- **Vertrekbord**: rijdt er de komende 1,5 uur niets, dan staat er "🌙 Er rijdt nu niets meer vanaf deze halte. Eerste vertrek: morgen 06:05 · 182 → Leiden CS" (`next` in `/api/stops/:id/departures`).
- **Laatste rit**: het label "🌙 laatste rit" staat bij een vertrek als deze lijn in deze richting hier de komende 6 uur niet meer vertrekt. Dit wordt over de dienstdagen heen bekeken, zodat nachttreinen die op de volgende dienstdag staan meetellen.
- **Planner**: vertrekt de eerste OV-reis pas meer dan 2 uur na het gevraagde tijdstip, dan staat er "🌙 Er rijdt nu niets meer. De eerste reis vertrekt morgen om 05:46" (`notice` in `/api/plan`). Reizen op een andere dag krijgen het label "morgen" of een datum.
- Opties die eerder vertrekken maar niet eerder aankomen dan een andere optie, laat de planner weg (bijvoorbeeld 's nachts de laatste trein nemen en dan uren op de eerste bus wachten).

## Dienstregeling automatisch bijwerken

OVapi publiceert elke nacht een nieuwe dienstregeling, en de ritnummers in de live feeds passen alleen bij de nieuwste versie. Met een oude versie missen steeds meer voertuigen hun lijn en tijden. De backend houdt de dienstregeling daarom zelf actueel (`src/gtfsUpdater.ts`):

- **Elke nacht om 04:30**, en bij het opstarten als de data ouder is dan een dag, draait hij `updateGtfs.ts` in een **apart proces**. Dat downloadt alleen als OVapi echt een nieuwe versie heeft (ETag), en de API blijft tijdens de import van ~1,5 minuut gewoon reageren.
- **Elke import krijgt een eigen bestand** (`data/gtfs-20260927-131711.db`); `data/gtfs-current.txt` wijst naar de actuele versie. Zo hoeft nooit een geopend bestand vervangen te worden (dat kan niet op Windows).
- **Wisselen zonder herstart**: elke minuut kijkt de backend of er een nieuwe versie actueel is (ook na een handmatige `gtfs:update`). Is dat zo, dan bouwt hij alles opnieuw op in een nieuwe context (`src/context.ts`), wisselt in één keer, en ruimt de oude versie een minuut later op.
- De versie in gebruik staat in `GET /api/health` (`gtfs`).
- Na een wissel duurt het 1–2 minuten tot bussen weer tussen updates door rijden (de snelheidshistorie begint opnieuw).

## Telefoon-app (PWA) en meldingen

**Installeren als app**: de frontend heeft een app-manifest (`src/app/manifest.ts`), app-iconen (`src/app/icon.tsx`, `apple-icon.tsx`, `/pwa-icon/192|512`, gegenereerd met `next/og`) en een service worker (`public/sw.js`). Chrome/Edge/Android bieden daarmee "App installeren" aan; op iPhone gaat het via Deel → "Zet op beginscherm".

**Meldingen voor een reis** ("🔔 Houd me op de hoogte" in de reis): de backend volgt de reis en stuurt Web Push-meldingen, ook als de app dicht is (`src/journeyWatch.ts`):
- *Vertrek nu*: als je naar je eerste halte moet lopen (loopduur + 2 min speling);
- *… komt over 2 min*;
- *+N min vertraging* / *weer op tijd*, bij een verandering van 3 min of meer;
- *… rijdt niet*, als een rit uitvalt;
- *Stap uit bij …*, ~2 min voor je uitstaphalte, met de overstap erbij.

De VAPID-sleutels worden bij de eerste start gemaakt in `backend/data/vapid.json`; gevolgde reizen staan in `data/watches.json` (beide buiten git). Endpoints: `GET /api/push/key`, `POST /api/watch`, `DELETE /api/watch/:id`, `POST /api/push/test`.

**Let op, HTTPS**: installeren, meldingen en "Mijn locatie" werken alleen via een beveiligde verbinding. Op je eigen computer telt `http://localhost:3000` als veilig. Een telefoon die de app via `http://192.168.x.x:3000` opent niet: daarvoor is hosting met HTTPS nodig (of een HTTPS-tunnel).
