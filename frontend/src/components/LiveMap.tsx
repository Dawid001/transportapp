"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ExpressionSpecification, GeoJSONSource, Map as MlMap, MapGeoJSONFeature } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { ApiVehicle, Departure, Journey, Mode, PlanEndpoint, PlanNotice, PlanResponse, RouteStop, StopSummary, TripRoute, VehiclesResponse } from "@/lib/types";
import { boundsOf, tripRouteGeo } from "@/lib/routeGeo";
import { endpointCoords, endpointParams, journeyGeo, journeyPoints } from "@/lib/journeyGeo";
import { toSaved, useFavorites, type Favorite, type SavedEndpoint } from "@/lib/favorites";
import { continueFrom, isMoving, makeMotion, positionAt, type Motion } from "@/lib/motion";
import { MODE_COLORS, STALE_AFTER_SECONDS } from "@/lib/format";
import { JourneySheet } from "./JourneySheet";
import { PlannerPanel } from "./PlannerPanel";
import { StatusPill, type Status } from "./StatusPill";
import { StopSheet } from "./StopSheet";
import { VehicleSheet } from "./VehicleSheet";

// De backend ververst elke 20s; door vaker te vragen zien we nieuwe posities sneller.
const REFRESH_MS = 10_000;
const ANIMATION_MS = 1_500;
/** Vanaf dit zoomniveau rijden voertuigen tussen updates door over hun route. */
const PATHS_MIN_ZOOM = 12;
/** Doorrijden hoeft niet op 60 fps; dit spaart batterij. */
const FRAME_MS = 1000 / 30;
const NL_CENTER: [number, number] = [5.29, 52.13];
/** Vanaf dit zoomniveau staan haltes op de kaart. */
const STOPS_MIN_ZOOM = 14.5;
/** Reizen met "nu vertrekken" regelmatig opnieuw plannen (vertragingen, gemiste bus). */
const REPLAN_MS = 60_000;
/** Live voertuigen van de reisopties verversen. */
const JOURNEY_VEHICLES_MS = 15_000;


const EMPTY: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: [] };

const MODE_COLOR: ExpressionSpecification = [
  "match",
  ["get", "mode"],
  "bus", MODE_COLORS.bus,
  "tram", MODE_COLORS.tram,
  "metro", MODE_COLORS.metro,
  "train", MODE_COLORS.train,
  "ferry", MODE_COLORS.ferry,
  MODE_COLORS.other,
];
const PASSED_COLOR = "#9ca3af";

export function LiveMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);

  // Animatiestatus in refs: die verandert elk frame en hoort niet in React-state.
  const vehiclesRef = useRef(new Map<string, ApiVehicle>());
  const motionRef = useRef(new Map<string, Motion>());
  const animStartRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const lastLoadKeyRef = useRef("");
  // Verschil tussen server- en browserklok, zodat extrapoleren vanaf de GPS-tijd klopt.
  const clockOffsetRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const [selected, setSelected] = useState<ApiVehicle | null>(null);
  const selectedIdRef = useRef<string | null>(null);
  const [follow, setFollow] = useState(false);
  const followRef = useRef(false);
  const [selectedStop, setSelectedStop] = useState<StopSummary | null>(null);

  // Reisplanner
  const [from, setFrom] = useState<PlanEndpoint | null>(null);
  const [to, setTo] = useState<PlanEndpoint | null>(null);
  const [planTime, setPlanTime] = useState<number | null>(null);
  const [plan, setPlan] = useState<{ key: string; journeys: Journey[]; notice?: PlanNotice } | null>(null);
  const [planError, setPlanError] = useState<string | null>(null);
  const [selectedJourney, setSelectedJourney] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [journeyVehicles, setJourneyVehicles] = useState<Map<string, ApiVehicle>>(new Map());
  // Rit-ID's van de gekozen reis: die voertuigen lichten op, de rest vervaagt.
  const journeyTripsRef = useRef<Set<string> | null>(null);
  const stopsRef = useRef(new Map<string, StopSummary>());
  const stopsAbortRef = useRef<AbortController | null>(null);
  const [status, setStatus] = useState<Status>({ state: "loading" });
  const [modeCounts, setModeCounts] = useState<Partial<Record<Mode, number>>>({});
  const modeCountsKeyRef = useRef("");
  const visibleCount = Object.values(modeCounts).reduce((sum, n) => sum + (n ?? 0), 0);
  const [mapReady, setMapReady] = useState(false);
  const [tripRoute, setTripRoute] = useState<TripRoute | null>(null);
  // Alleen tonen als de route bij het huidige voertuig hoort (voorkomt een verouderde route na wisselen).
  const activeTripRoute = tripRoute && tripRoute.tripId === selected?.tripId ? tripRoute : null;

  // State spiegelen naar refs, zodat de map-callbacks (één keer geregistreerd) de actuele waarde zien.
  useEffect(() => {
    selectedIdRef.current = selected?.id ?? null;
    followRef.current = follow;
  }, [selected, follow]);

  const progressAt = (now: number) => Math.min(1, (now - animStartRef.current) / ANIMATION_MS);
  const serverNow = () => Date.now() + clockOffsetRef.current;

  const render = useCallback((t: number) => {
    const source = mapRef.current?.getSource<GeoJSONSource>("vehicles");
    if (!source) return;
    const now = serverNow();
    const nowSec = now / 1000;
    const features: GeoJSON.Feature[] = [];
    const counts: Partial<Record<Mode, number>> = {};
    for (const v of vehiclesRef.current.values()) {
      counts[v.mode] = (counts[v.mode] ?? 0) + 1;
      const motion = motionRef.current.get(v.id);
      features.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: motion ? positionAt(motion, now, t) : [v.lng, v.lat] },
        properties: {
          id: v.id,
          line: v.line ?? "",
          mode: v.mode,
          selected: v.id === selectedIdRef.current,
          mine: !!v.tripId && !!journeyTripsRef.current?.has(v.tripId),
          dim: !!journeyTripsRef.current && !(v.tripId && journeyTripsRef.current.has(v.tripId)),
          stale: v.timestamp ? nowSec - v.timestamp > STALE_AFTER_SECONDS : false,
        },
      });
    }
    // Geselecteerd voertuig als laatste, zodat het bovenop ligt.
    features.sort((a, b) => Number(a.properties!.selected) - Number(b.properties!.selected));
    source.setData({ type: "FeatureCollection", features });
    // Draait elk animatieframe: alleen state zetten als de aantallen echt veranderen.
    const key = JSON.stringify(counts);
    if (key !== modeCountsKeyRef.current) {
      modeCountsKeyRef.current = key;
      setModeCounts(counts);
    }
  }, []);

  // Animatielus: draait zolang er gecorrigeerd wordt of er voertuigen doorrijden.
  const animate = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const step = (frameTime: number) => {
      const t = progressAt(performance.now());
      const anyMoving = [...motionRef.current.values()].some(isMoving);
      if (frameTime - lastFrameRef.current >= FRAME_MS || t < 1) {
        lastFrameRef.current = frameTime;
        render(t);
        // Volgen: kaart centreren op de positie zoals die op het scherm staat.
        const map = mapRef.current;
        const selectedId = selectedIdRef.current;
        const motion = selectedId ? motionRef.current.get(selectedId) : undefined;
        if (followRef.current && map && motion && !map.isZooming()) {
          map.jumpTo({ center: positionAt(motion, serverNow(), t) });
        }
      }
      rafRef.current = t < 1 || anyMoving ? requestAnimationFrame(step) : null;
    };
    step(performance.now());
  }, [render]);

  const applyVehicles = useCallback(
    (list: ApiVehicle[]) => {
      const t = progressAt(performance.now());
      const now = serverNow();
      const next = new Map<string, Motion>();
      for (const v of list) {
        const prev = motionRef.current.get(v.id);
        const motion = makeMotion(v);
        // Start vanaf waar het voertuig nu op het scherm staat, ook als een vorige animatie nog liep.
        next.set(v.id, prev ? continueFrom(motion, positionAt(prev, now, t), now) : motion);
      }
      vehiclesRef.current = new Map(list.map((v) => [v.id, v]));
      motionRef.current = next;
      animStartRef.current = performance.now();
      animate();
    },
    [animate],
  );

  const load = useCallback(async () => {
    const map = mapRef.current;
    if (!map) return;

    // Iets ruimer dan het beeld, zodat voertuigen aan de rand niet opeens verschijnen bij kleine verschuivingen.
    const b = map.getBounds();
    const padLng = (b.getEast() - b.getWest()) * 0.1;
    const padLat = (b.getNorth() - b.getSouth()) * 0.1;
    const bbox = [b.getWest() - padLng, b.getSouth() - padLat, b.getEast() + padLng, b.getNorth() + padLat]
      .map((n) => n.toFixed(4))
      .join(",");

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const paths = map.getZoom() >= PATHS_MIN_ZOOM ? 1 : 0;
      const res = await fetch(`/api/vehicles?bbox=${bbox}&paths=${paths}`, { signal: controller.signal });
      if (!res.ok) throw new Error(res.status === 503 ? "Backend is nog aan het opstarten…" : `HTTP ${res.status}`);
      const data: VehiclesResponse = await res.json();

      clockOffsetRef.current = data.serverTime - Date.now();
      const key = `${data.updatedAt}|${bbox}|${paths}`;
      if (key === lastLoadKeyRef.current) return;
      lastLoadKeyRef.current = key;

      applyVehicles(data.vehicles);
      setStatus({ state: "ok", updatedAt: data.updatedAt });

      const selectedId = selectedIdRef.current;
      if (selectedId) {
        const fresh = data.vehicles.find((v) => v.id === selectedId);
        // Meebewegen bij "volgen" gebeurt in de animatielus.
        if (fresh) setSelected(fresh);
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      const message = err instanceof Error ? err.message : String(err);
      setStatus((s) => ({
        state: "error",
        message: message.startsWith("HTTP 5") || message.includes("fetch") ? "Backend niet bereikbaar. Draait `npm run dev` in backend/?" : message,
        updatedAt: s.state === "ok" ? s.updatedAt : undefined,
      }));
    }
  }, [applyVehicles]);

  // Halte kiezen (uit het zoekvak of op de kaart): vertrekbord openen, voertuigselectie sluiten.
  const selectStop = useCallback((stop: StopSummary, fly = true) => {
    setSelected(null);
    selectedIdRef.current = null;
    setFollow(false);
    setSelectedStop(stop);
    if (fly) mapRef.current?.flyTo({ center: [stop.lng, stop.lat], zoom: Math.max(mapRef.current.getZoom(), 16), duration: 900 });
  }, []);

  // Haltes in beeld ophalen (alleen vanaf straatniveau).
  const loadStops = useCallback(async () => {
    const map = mapRef.current;
    const source = map?.getSource<GeoJSONSource>("stops");
    if (!map || !source) return;
    if (map.getZoom() < STOPS_MIN_ZOOM) {
      source.setData(EMPTY);
      return;
    }
    const b = map.getBounds();
    const bbox = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()].map((n) => n.toFixed(4)).join(",");
    stopsAbortRef.current?.abort();
    const controller = new AbortController();
    stopsAbortRef.current = controller;
    try {
      const res = await fetch(`/api/stops?bbox=${bbox}`, { signal: controller.signal });
      if (!res.ok) return;
      const { stops } = (await res.json()) as { stops: StopSummary[] };
      stopsRef.current = new Map(stops.map((st) => [st.id, st]));
      source.setData({
        type: "FeatureCollection",
        features: stops.map((st) => ({
          type: "Feature",
          geometry: { type: "Point", coordinates: [st.lng, st.lat] },
          properties: { id: st.id, name: st.name, mode: st.modes[0] ?? "other" },
        })),
      });
    } catch {
      // afgebroken of backend weg: haltes blijven zoals ze waren
    }
  }, []);

  // Kaart opzetten (één keer).
  useEffect(() => {
    let cancelled = false;
    let map: MlMap | undefined;
    let moveTimer: ReturnType<typeof setTimeout> | undefined;
    let refreshTimer: ReturnType<typeof setInterval> | undefined;

    (async () => {
      // maplibre-gl gebruikt `window`, dus pas in de browser laden.
      const maplibregl = await import("maplibre-gl");
      if (cancelled || !containerRef.current) return;
      // Gekopieerd door scripts/copy-maplibre-worker.mjs (Turbopack bundelt de worker niet).
      maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

      const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const m = new maplibregl.Map({
        container: containerRef.current,
        style: `https://tiles.openfreemap.org/styles/${dark ? "dark" : "positron"}`,
        center: NL_CENTER,
        zoom: 7,
        minZoom: 5,
        maxBounds: [
          [1.5, 49.5],
          [9.5, 55],
        ],
        attributionControl: { compact: true },
      });
      map = m;
      mapRef.current = m;

      m.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      m.addControl(
        new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }),
        "top-right",
      );

      m.on("load", () => {
        m.addSource("vehicles", { type: "geojson", data: EMPTY });
        m.addSource("route", { type: "geojson", data: EMPTY });
        m.addSource("route-stops", { type: "geojson", data: EMPTY });
        m.addSource("stops", { type: "geojson", data: EMPTY });
        m.addSource("selected-stop", { type: "geojson", data: EMPTY });
        m.addSource("journey", { type: "geojson", data: EMPTY });

        // Routelagen eerst toevoegen, zodat voertuigen er bovenop liggen.
        m.addLayer({
          id: "route-casing",
          type: "line",
          source: "route",
          filter: ["!", ["get", "approximate"]],
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": dark ? "#0a0a0a" : "#ffffff",
            "line-width": ["interpolate", ["linear"], ["zoom"], 8, 3, 12, 6, 16, 11],
          },
        });
        m.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          filter: ["!", ["get", "approximate"]],
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": ["case", ["get", "passed"], PASSED_COLOR, MODE_COLOR],
            "line-width": ["interpolate", ["linear"], ["zoom"], 8, 1.5, 12, 3.5, 16, 7],
            "line-opacity": ["case", ["get", "passed"], 0.7, 0.9],
          },
        });
        // Benaderde route (rechte stukken tussen haltes): gestippeld, zodat niemand denkt dat de bus daar rijdt.
        m.addLayer({
          id: "route-line-approximate",
          type: "line",
          source: "route",
          filter: ["get", "approximate"],
          paint: {
            "line-color": ["case", ["get", "passed"], PASSED_COLOR, MODE_COLOR],
            "line-width": ["interpolate", ["linear"], ["zoom"], 8, 1.5, 12, 3, 16, 5],
            "line-opacity": ["case", ["get", "passed"], 0.6, 0.85],
            "line-dasharray": [1.5, 2],
          },
        });
        m.addLayer({
          id: "route-stops",
          type: "circle",
          source: "route-stops",
          minzoom: 10,
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 2, 13, 4, 16, 6],
            "circle-color": dark ? "#171717" : "#ffffff",
            "circle-stroke-color": ["case", ["get", "passed"], PASSED_COLOR, MODE_COLOR],
            "circle-stroke-width": ["interpolate", ["linear"], ["zoom"], 10, 1.5, 14, 2.5],
          },
        });
        m.addLayer({
          id: "route-stop-labels",
          type: "symbol",
          source: "route-stops",
          minzoom: 13,
          layout: {
            "text-field": ["get", "name"],
            "text-font": ["Noto Sans Regular"],
            "text-size": 11,
            "text-anchor": "left",
            "text-offset": [0.9, 0],
            "text-optional": true,
          },
          paint: {
            "text-color": ["case", ["get", "passed"], PASSED_COLOR, dark ? "#e5e5e5" : "#262626"],
            "text-halo-color": dark ? "#0a0a0a" : "#ffffff",
            "text-halo-width": 1.5,
          },
        });

        // Haltes (vanaf straatniveau): wit bolletje met rand in de kleur van de belangrijkste vervoerswijze.
        m.addLayer({
          id: "stops",
          type: "circle",
          source: "stops",
          minzoom: STOPS_MIN_ZOOM,
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 14.5, 3.5, 17, 6],
            "circle-color": dark ? "#171717" : "#ffffff",
            "circle-stroke-color": MODE_COLOR,
            "circle-stroke-width": 2,
          },
        });
        m.addLayer({
          id: "stop-labels",
          type: "symbol",
          source: "stops",
          minzoom: 16,
          layout: {
            "text-field": ["get", "name"],
            "text-font": ["Noto Sans Regular"],
            "text-size": 11,
            "text-anchor": "top",
            "text-offset": [0, 0.8],
            "text-optional": true,
          },
          paint: {
            "text-color": dark ? "#d4d4d4" : "#404040",
            "text-halo-color": dark ? "#0a0a0a" : "#ffffff",
            "text-halo-width": 1.5,
          },
        });
        m.addLayer({
          id: "selected-stop",
          type: "circle",
          source: "selected-stop",
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 6, 16, 9],
            "circle-color": dark ? "#171717" : "#ffffff",
            "circle-stroke-color": "#facc15",
            "circle-stroke-width": 4,
          },
        });
        // Geplande reis: lopen gestippeld, ritten in de kleur van de vervoerswijze, begin/eind als punten.
        m.addLayer({
          id: "journey-walk",
          type: "line",
          source: "journey",
          filter: ["==", ["get", "kind"], "walk"],
          layout: { "line-cap": "round" },
          paint: { "line-color": dark ? "#a3a3a3" : "#525252", "line-width": 3, "line-dasharray": [0.5, 2] },
        });
        m.addLayer({
          id: "journey-casing",
          type: "line",
          source: "journey",
          filter: ["==", ["get", "kind"], "transit"],
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": dark ? "#0a0a0a" : "#ffffff", "line-width": ["interpolate", ["linear"], ["zoom"], 8, 5, 14, 10] },
        });
        m.addLayer({
          id: "journey-transit",
          type: "line",
          source: "journey",
          filter: ["==", ["get", "kind"], "transit"],
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": MODE_COLOR, "line-width": ["interpolate", ["linear"], ["zoom"], 8, 3, 14, 6] },
        });
        m.addLayer({
          id: "journey-points",
          type: "circle",
          source: "journey",
          filter: ["match", ["get", "kind"], ["stop", "from", "to"], true, false],
          paint: {
            "circle-radius": ["match", ["get", "kind"], "stop", 5, 8],
            "circle-color": ["match", ["get", "kind"], "from", "#2563eb", "to", "#ef4444", dark ? "#171717" : "#ffffff"],
            "circle-stroke-color": ["match", ["get", "kind"], "stop", MODE_COLOR, "#ffffff"],
            "circle-stroke-width": 3,
          },
        });

        m.addLayer({
          id: "vehicles",
          type: "circle",
          source: "vehicles",
          paint: {
            "circle-color": MODE_COLOR,
            "circle-radius": [
              "interpolate", ["linear"], ["zoom"],
              6, ["case", ["get", "selected"], 6, 2.5],
              10, ["case", ["get", "selected"], 8, 4],
              12, ["case", ["get", "selected"], 14, 11],
              16, ["case", ["get", "selected"], 16, 13],
            ],
            "circle-stroke-width": ["case", ["get", "selected"], 4, ["get", "mine"], 4, 1.5],
            "circle-stroke-color": ["case", ["get", "selected"], "#facc15", ["get", "mine"], "#10b981", "#ffffff"],
            "circle-opacity": ["case", ["get", "dim"], 0.2, ["get", "stale"], 0.35, 1],
            "circle-stroke-opacity": ["case", ["get", "dim"], 0.2, ["get", "stale"], 0.35, 1],
          },
        });

        m.addLayer({
          id: "vehicle-labels",
          type: "symbol",
          source: "vehicles",
          minzoom: 11.5,
          layout: {
            "text-field": ["get", "line"],
            "text-font": ["Noto Sans Bold"],
            "text-size": ["case", [">", ["length", ["get", "line"]], 3], 8, 10],
            "text-allow-overlap": true,
            "text-ignore-placement": true,
          },
          paint: { "text-color": "#ffffff" },
        });

        m.on("click", "vehicles", (e) => {
          const feature = e.features?.[0] as MapGeoJSONFeature | undefined;
          const vehicle = feature && vehiclesRef.current.get(String(feature.properties.id));
          if (!vehicle) return;
          setSelectedStop(null);
          setSelected(vehicle);
          selectedIdRef.current = vehicle.id;
          render(progressAt(performance.now()));
        });
        m.on("click", "stops", (e) => {
          // Een voertuig bovenop de halte gaat voor.
          if (m.queryRenderedFeatures(e.point, { layers: ["vehicles"] }).length) return;
          const stop = stopsRef.current.get(String(e.features?.[0]?.properties.id));
          if (stop) selectStop(stop, false);
        });
        m.on("click", (e) => {
          if (m.queryRenderedFeatures(e.point, { layers: ["vehicles", "route-stops", "stops"] }).length) return;
          setSelectedStop(null);
          setSelected(null);
          selectedIdRef.current = null;
          setFollow(false);
          render(progressAt(performance.now()));
        });
        for (const layer of ["vehicles", "stops"]) {
          m.on("mouseenter", layer, () => (m.getCanvas().style.cursor = "pointer"));
          m.on("mouseleave", layer, () => (m.getCanvas().style.cursor = ""));
        }

        m.on("moveend", () => {
          clearTimeout(moveTimer);
          moveTimer = setTimeout(() => {
            void load();
            void loadStops();
          }, 250);
        });
        // Handmatig slepen stopt het volgen.
        m.on("dragstart", () => setFollow(false));

        setMapReady(true);
        void load();
        void loadStops();
        refreshTimer = setInterval(load, REFRESH_MS);
      });
    })();

    return () => {
      cancelled = true;
      clearTimeout(moveTimer);
      clearInterval(refreshTimer);
      abortRef.current?.abort();
      stopsAbortRef.current?.abort();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      map?.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [load, loadStops, render, selectStop]);

  // Route van het geselecteerde voertuig ophalen.
  const selectedTripId = selected?.tripId;
  useEffect(() => {
    if (!selectedTripId) return;
    const controller = new AbortController();
    fetch(`/api/trips/${encodeURIComponent(selectedTripId)}`, { signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<TripRoute>) : null))
      .then((route) => route && setTripRoute(route))
      .catch(() => {});
    return () => controller.abort();
  }, [selectedTripId]);

  // Route tekenen van het geselecteerde voertuig.
  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;
    const geo = activeTripRoute ? tripRouteGeo(activeTripRoute, selected) : null;
    map.getSource<GeoJSONSource>("route")?.setData(geo?.lines ?? EMPTY);
    map.getSource<GeoJSONSource>("route-stops")?.setData(geo?.stops ?? EMPTY);
  }, [mapReady, activeTripRoute, selected]);

  // Gekozen halte markeren.
  useEffect(() => {
    const source = mapRef.current?.getSource<GeoJSONSource>("selected-stop");
    if (!mapReady || !source) return;
    source.setData(
      selectedStop
        ? { type: "FeatureCollection", features: [{ type: "Feature", geometry: { type: "Point", coordinates: [selectedStop.lng, selectedStop.lat] }, properties: {} }] }
        : EMPTY,
    );
  }, [mapReady, selectedStop]);


  // --- Reisplanner ------------------------------------------------------------------------------

  const requestMyLocation = useCallback((target: "from" | "to") => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Je browser kan je locatie niet bepalen. Kies een vertrekpunt.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const ep: PlanEndpoint = { kind: "location", lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (target === "from") setFrom(ep);
        else setTo(ep);
      },
      () => setLocationError("Je locatie is niet beschikbaar (toestemming geweigerd?). Kies een vertrekpunt."),
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    );
  }, []);

  const chooseTo = useCallback(
    (ep: PlanEndpoint | null) => {
      setTo(ep);
      setSelectedJourney(null);
      // Nog geen vertrekpunt? Dan vertrekken we vanaf waar je nu bent.
      if (ep && !from) requestMyLocation("from");
    },
    [from, requestMyLocation],
  );

  const chooseFrom = useCallback((ep: PlanEndpoint | null) => {
    setFrom(ep);
    setSelectedJourney(null);
  }, []);

  const swap = useCallback(() => {
    setFrom(to);
    setTo(from);
    setSelectedJourney(null);
  }, [from, to]);

  const { has: isFavorite, toggle: toggleFavorite } = useFavorites();
  const routeFavorite: Favorite | null = from && to ? { kind: "route", from: toSaved(from), to: toSaved(to) } : null;

  const applyRoute = useCallback(
    (route: Extract<Favorite, { kind: "route" }>) => {
      const apply = (ep: SavedEndpoint, target: "from" | "to") => {
        if (ep.kind === "location") requestMyLocation(target);
        else if (target === "from") setFrom(ep);
        else setTo(ep);
      };
      apply(route.from, "from");
      apply(route.to, "to");
      setSelectedJourney(null);
    },
    [requestMyLocation],
  );

  const closePlan = useCallback(() => {
    setTo(null);
    setPlan(null);
    setSelectedJourney(null);
  }, []);

  // Plannen zodra van en naar bekend zijn; bij "nu" elke minuut opnieuw (vertragingen, gemiste bus).
  const planKey = from && to ? JSON.stringify([endpointParams("from", from), endpointParams("to", to), planTime]) : null;
  useEffect(() => {
    if (!from || !to || !planKey) return;
    let controller = new AbortController();
    const run = () => {
      controller.abort();
      controller = new AbortController();
      const params = new URLSearchParams({ ...endpointParams("from", from), ...endpointParams("to", to) });
      if (planTime) params.set("time", String(planTime));
      fetch(`/api/plan?${params}`, { signal: controller.signal })
        .then((res) => (res.ok ? (res.json() as Promise<PlanResponse>) : Promise.reject(new Error(`HTTP ${res.status}`))))
        .then((data) => {
          setPlan({ key: planKey, journeys: data.journeys, notice: data.notice });
          setPlanError(null);
        })
        .catch(() => !controller.signal.aborted && setPlanError("Plannen mislukt. Draait de backend?"));
    };
    run();
    const timer = planTime ? undefined : setInterval(run, REPLAN_MS);
    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, [from, to, planTime, planKey]);

  const journeys = plan && plan.key === planKey ? plan.journeys : null;
  const activeJourney = selectedJourney !== null ? journeys?.[selectedJourney] : undefined;

  // Live voertuigen van alle ritten in de reisopties.
  const journeyTripIds = [...new Set((journeys ?? []).flatMap((j) => j.legs.flatMap((l) => (l.type === "transit" ? [l.tripId] : []))))].join(",");
  useEffect(() => {
    if (!journeyTripIds) return;
    let controller = new AbortController();
    const load = () => {
      controller.abort();
      controller = new AbortController();
      fetch(`/api/vehicles?trip=${encodeURIComponent(journeyTripIds)}`, { signal: controller.signal })
        .then((res) => (res.ok ? (res.json() as Promise<VehiclesResponse>) : null))
        .then((data) => data && setJourneyVehicles(new Map(data.vehicles.flatMap((v) => (v.tripId ? [[v.tripId, v]] : [])))))
        .catch(() => {});
    };
    load();
    const timer = setInterval(load, JOURNEY_VEHICLES_MS);
    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, [journeyTripIds]);

  // Reis op de kaart tekenen; bij het kiezen van een optie erop inzoomen en de andere voertuigen vervagen.
  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;
    map.getSource<GeoJSONSource>("journey")?.setData(journeyGeo(activeJourney, from, to));
    journeyTripsRef.current = activeJourney
      ? new Set(activeJourney.legs.flatMap((l) => (l.type === "transit" ? [l.tripId] : [])))
      : null;
    render(progressAt(performance.now()));
  }, [mapReady, activeJourney, from, to, render]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const points = activeJourney
      ? journeyPoints(activeJourney)
      : from && to
        ? [endpointCoords(from), endpointCoords(to)]
        : to
          ? [endpointCoords(to)]
          : [];
    const bounds = boundsOf(points);
    if (!bounds) return;
    const pad = window.innerWidth < 640 ? { top: 190, bottom: 320, left: 40, right: 40 } : { top: 60, bottom: 60, left: 460, right: 60 };
    map.fitBounds(bounds, { padding: pad, maxZoom: 16, duration: 900 });
    // Alleen bij een andere reis of ander begin/eind opnieuw inzoomen, niet bij elke herplanning.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedJourney, planKey]);

  const showVehicle = useCallback((vehicle: ApiVehicle) => {
    mapRef.current?.flyTo({ center: [vehicle.lng, vehicle.lat], zoom: Math.max(mapRef.current.getZoom(), 15), duration: 900 });
  }, []);

  // Vanuit het vertrekbord: het voertuig van die rit selecteren en ernaartoe gaan.
  const showTrip = useCallback(async (departure: Departure) => {
    let vehicle = [...vehiclesRef.current.values()].find((v) => v.tripId === departure.tripId);
    if (!vehicle) {
      const res = await fetch(`/api/vehicles?trip=${encodeURIComponent(departure.tripId)}`).catch(() => null);
      const data = res?.ok ? ((await res.json()) as VehiclesResponse) : null;
      vehicle = data?.vehicles[0];
    }
    if (!vehicle) return;
    setSelectedStop(null);
    setSelected(vehicle);
    selectedIdRef.current = vehicle.id;
    mapRef.current?.flyTo({ center: [vehicle.lng, vehicle.lat], zoom: Math.max(mapRef.current.getZoom(), 15), duration: 900 });
  }, []);

  const mapCenter = useCallback(() => {
    const c = mapRef.current?.getCenter();
    return c ? { lat: c.lat, lng: c.lng } : undefined;
  }, []);

  const flyToStop = useCallback((stop: RouteStop) => {
    setFollow(false);
    mapRef.current?.flyTo({ center: [stop.lng, stop.lat], zoom: Math.max(mapRef.current.getZoom(), 15) });
  }, []);

  const toggleFollow = useCallback(() => {
    setFollow((f) => {
      const next = !f;
      if (next && selected) mapRef.current?.easeTo({ center: [selected.lng, selected.lat], zoom: Math.max(mapRef.current.getZoom(), 14) });
      return next;
    });
  }, [selected]);

  const closeSheet = useCallback(() => {
    setSelected(null);
    selectedIdRef.current = null;
    setFollow(false);
    render(progressAt(performance.now()));
  }, [render]);

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      {/* Geen absolute positionering: maplibre-gl.css zet `position: relative` op de container. */}
      <div ref={containerRef} className="h-full w-full" />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col gap-2 p-3 pr-14 sm:max-w-md sm:pr-3">
        <PlannerPanel
          from={from}
          to={to}
          time={planTime}
          locationError={locationError}
          near={mapCenter}
          onFrom={chooseFrom}
          onTo={chooseTo}
          onUseMyLocation={requestMyLocation}
          onSwap={swap}
          onTime={setPlanTime}
          onUseRoute={applyRoute}
        />
        <StatusPill status={status} visibleCount={visibleCount} />
      </div>

      {!selected && !selectedStop && to && (
        <JourneySheet
          journeys={journeys}
          notice={plan && plan.key === planKey ? plan.notice : undefined}
          loading={!!from && !journeys && !planError}
          error={!from ? (locationError ?? "Kies een vertrekpunt (of Mijn locatie).") : planError}
          selected={selectedJourney}
          vehicles={journeyVehicles}
          onSelect={setSelectedJourney}
          onShowVehicle={showVehicle}
          onClose={closePlan}
          routeSaved={!!routeFavorite && isFavorite(routeFavorite)}
          onToggleRoute={() => routeFavorite && toggleFavorite(routeFavorite)}
        />
      )}

      {!selected && selectedStop && (
        <StopSheet
          stop={selectedStop}
          onClose={() => setSelectedStop(null)}
          onShowTrip={showTrip}
          onPlanTo={(stop) => {
            setSelectedStop(null);
            chooseTo({ kind: "stop", stop });
          }}
          onPlanFrom={(stop) => {
            setSelectedStop(null);
            chooseFrom({ kind: "stop", stop });
          }}
        />
      )}

      {selected && (
        <VehicleSheet
          vehicle={selected}
          route={activeTripRoute}
          follow={follow}
          onToggleFollow={toggleFollow}
          onClose={closeSheet}
          onStopClick={flyToStop}
        />
      )}
    </div>
  );
}
