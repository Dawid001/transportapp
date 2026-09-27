(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/AlertList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertList",
    ()=>AlertList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function AlertList({ alerts, compact = false }) {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    if (!alerts?.length) return null;
    const shown = compact ? alerts.slice(0, 2) : alerts;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
        className: "space-y-1.5",
        children: [
            shown.map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setOpen((o)=>o === a.id ? null : a.id),
                        className: "w-full rounded-lg bg-amber-50 px-2.5 py-1.5 text-left text-xs text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950 dark:text-amber-100 dark:ring-amber-900",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: [
                                    "⚠ ",
                                    a.title
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AlertList.tsx",
                                lineNumber: 21,
                                columnNumber: 13
                            }, this),
                            a.text && open === a.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mt-1 block whitespace-pre-line opacity-90",
                                children: a.text
                            }, void 0, false, {
                                fileName: "[project]/src/components/AlertList.tsx",
                                lineNumber: 22,
                                columnNumber: 41
                            }, this),
                            a.text && open !== a.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-1 opacity-70",
                                children: "Meer"
                            }, void 0, false, {
                                fileName: "[project]/src/components/AlertList.tsx",
                                lineNumber: 23,
                                columnNumber: 41
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AlertList.tsx",
                        lineNumber: 16,
                        columnNumber: 11
                    }, this)
                }, a.id, false, {
                    fileName: "[project]/src/components/AlertList.tsx",
                    lineNumber: 15,
                    columnNumber: 9
                }, this)),
            compact && alerts.length > shown.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                className: "px-1 text-xs text-amber-700 dark:text-amber-300",
                children: [
                    "+",
                    alerts.length - shown.length,
                    " meer"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/AlertList.tsx",
                lineNumber: 27,
                columnNumber: 51
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/AlertList.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_s(AlertList, "3gHT60S3lHEhyYybFcB05ha95j4=");
_c = AlertList;
var _c;
__turbopack_context__.k.register(_c, "AlertList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/JourneySheet.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JourneySheet",
    ()=>JourneySheet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AlertList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AlertList.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const minutes = (seconds)=>Math.max(1, Math.round(seconds / 60));
const durationText = (seconds)=>{
    const m = Math.round(seconds / 60);
    return m < 60 ? `${m} min` : `${Math.floor(m / 60)} u ${String(m % 60).padStart(2, "0")}`;
};
/** Verwachte vertrektijd van een reisdeel: realtime van de backend, anders dienstregeling + vertraging van het voertuig. */ function expectedDeparture(leg, vehicle) {
    return leg.expectedDeparture ?? (vehicle?.delay !== undefined ? leg.departure + vehicle.delay : leg.departure);
}
function JourneySheet({ journeys, notice, loading, error, selected, vehicles, onSelect, onShowVehicle, onClose, routeSaved, onToggleRoute }) {
    _s();
    const [now, setNow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "JourneySheet.useState": ()=>Date.now()
    }["JourneySheet.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "JourneySheet.useEffect": ()=>{
            const timer = setInterval({
                "JourneySheet.useEffect.timer": ()=>setNow(Date.now())
            }["JourneySheet.useEffect.timer"], 10_000);
            return ({
                "JourneySheet.useEffect": ()=>clearInterval(timer)
            })["JourneySheet.useEffect"];
        }
    }["JourneySheet.useEffect"], []);
    const journey = selected !== null ? journeys?.[selected] : undefined;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute inset-x-0 bottom-0 p-3 pb-9 sm:left-3 sm:right-auto sm:w-[26rem] sm:pb-3",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "flex max-h-[55dvh] flex-col rounded-2xl bg-white shadow-xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "flex items-center gap-2 px-4 pt-3 pb-2",
                    children: [
                        journey ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>onSelect(null),
                            className: "-ml-1 rounded-md px-1.5 py-0.5 text-sm font-medium text-blue-600 hover:bg-neutral-100 dark:text-blue-400 dark:hover:bg-neutral-800",
                            children: "← Opties"
                        }, void 0, false, {
                            fileName: "[project]/src/components/JourneySheet.tsx",
                            lineNumber: 51,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-sm font-semibold",
                            children: "Reisopties"
                        }, void 0, false, {
                            fileName: "[project]/src/components/JourneySheet.tsx",
                            lineNumber: 55,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex-1"
                        }, void 0, false, {
                            fileName: "[project]/src/components/JourneySheet.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onToggleRoute,
                            "aria-pressed": routeSaved,
                            className: `rounded-md px-2 py-1 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 ${routeSaved ? "text-amber-500" : "text-neutral-500"}`,
                            children: routeSaved ? "★ Bewaard" : "☆ Bewaar route"
                        }, void 0, false, {
                            fileName: "[project]/src/components/JourneySheet.tsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            "aria-label": "Sluiten",
                            className: "rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                "aria-hidden": true,
                                viewBox: "0 0 20 20",
                                className: "size-5 fill-current",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/JourneySheet.tsx",
                                    lineNumber: 71,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/JourneySheet.tsx",
                                lineNumber: 70,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/JourneySheet.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/JourneySheet.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-h-0 flex-1 overflow-y-auto px-2 pb-3",
                    children: journey ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(JourneyDetail, {
                        journey: journey,
                        vehicles: vehicles,
                        now: now,
                        onShowVehicle: onShowVehicle
                    }, void 0, false, {
                        fileName: "[project]/src/components/JourneySheet.tsx",
                        lineNumber: 78,
                        columnNumber: 13
                    }, this) : loading && !journeys ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "px-2 py-3 text-sm text-neutral-500",
                        children: "Reis plannen…"
                    }, void 0, false, {
                        fileName: "[project]/src/components/JourneySheet.tsx",
                        lineNumber: 80,
                        columnNumber: 13
                    }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "px-2 py-3 text-sm text-red-600 dark:text-red-400",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/src/components/JourneySheet.tsx",
                        lineNumber: 82,
                        columnNumber: 13
                    }, this) : journeys && journeys.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "px-2 py-3 text-sm text-neutral-500",
                        children: "Geen reis gevonden. Probeer een ander tijdstip of een halte in de buurt."
                    }, void 0, false, {
                        fileName: "[project]/src/components/JourneySheet.tsx",
                        lineNumber: 84,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                        className: "space-y-1.5",
                        children: [
                            notice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "rounded-xl bg-indigo-50 px-3 py-2.5 text-sm text-indigo-900 dark:bg-indigo-950 dark:text-indigo-100",
                                children: notice.kind === "noServiceUntil" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-medium",
                                            children: "🌙 Er rijdt nu niets meer."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/JourneySheet.tsx",
                                            lineNumber: 91,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-0.5",
                                            children: [
                                                "De eerste reis met het OV vertrekt",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold",
                                                    children: [
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dayLabel"])(notice.firstDeparture, now) || "vandaag",
                                                        " om ",
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatClock"])(notice.firstDeparture)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/JourneySheet.tsx",
                                                    lineNumber: 94,
                                                    columnNumber: 25
                                                }, this),
                                                "."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/JourneySheet.tsx",
                                            lineNumber: 92,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/JourneySheet.tsx",
                                    lineNumber: 90,
                                    columnNumber: 21
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-medium",
                                    children: "Er is geen reis met het OV gevonden. Lopen kan wel:"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/JourneySheet.tsx",
                                    lineNumber: 101,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/JourneySheet.tsx",
                                lineNumber: 88,
                                columnNumber: 17
                            }, this),
                            journeys?.map((j, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(JourneyOption, {
                                        journey: j,
                                        vehicles: vehicles,
                                        now: now,
                                        onClick: ()=>onSelect(i)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/JourneySheet.tsx",
                                        lineNumber: 107,
                                        columnNumber: 19
                                    }, this)
                                }, i, false, {
                                    fileName: "[project]/src/components/JourneySheet.tsx",
                                    lineNumber: 106,
                                    columnNumber: 17
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/JourneySheet.tsx",
                        lineNumber: 86,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/JourneySheet.tsx",
                    lineNumber: 76,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/JourneySheet.tsx",
            lineNumber: 48,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/JourneySheet.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
_s(JourneySheet, "2IU6yg86GfAIPaiHfn+vZjj7R4s=");
_c = JourneySheet;
function JourneyOption({ journey: j, vehicles, now, onClick }) {
    const firstTransit = j.legs.find((l)=>l.type === "transit");
    const vehicle = firstTransit && vehicles.get(firstTransit.tripId);
    const leaveIn = Math.round((j.departure - now / 1000) / 60);
    const delay = firstTransit ? firstTransit.expectedDeparture ? firstTransit.expectedDeparture - firstTransit.departure : vehicle?.delay : undefined;
    const canceled = j.legs.some((l)=>l.type === "transit" && l.canceled);
    const alertCount = j.legs.reduce((n, l)=>n + (l.type === "transit" ? l.alerts?.length ?? 0 : 0), 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: "w-full rounded-xl px-3 py-2.5 text-left ring-1 ring-neutral-200 hover:bg-neutral-50 dark:ring-neutral-700 dark:hover:bg-neutral-800",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-baseline gap-2",
                children: [
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dayLabel"])(j.departure, now) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "self-center rounded bg-indigo-50 px-1.5 py-px text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dayLabel"])(j.departure, now)
                    }, void 0, false, {
                        fileName: "[project]/src/components/JourneySheet.tsx",
                        lineNumber: 130,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `text-base font-semibold tabular-nums ${canceled ? "text-neutral-400 line-through" : ""}`,
                        children: [
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatClock"])(j.departure),
                            " → ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatClock"])(j.arrival)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/JourneySheet.tsx",
                        lineNumber: 134,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm text-neutral-500",
                        children: durationText(j.arrival - j.departure)
                    }, void 0, false, {
                        fileName: "[project]/src/components/JourneySheet.tsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex-1"
                    }, void 0, false, {
                        fileName: "[project]/src/components/JourneySheet.tsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-neutral-500",
                        children: j.transfers === 0 ? "direct" : `${j.transfers}× overstappen`
                    }, void 0, false, {
                        fileName: "[project]/src/components/JourneySheet.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/JourneySheet.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-1.5 flex flex-wrap items-center gap-1",
                children: j.legs.map((leg, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LegChip, {
                        leg: leg
                    }, i, false, {
                        fileName: "[project]/src/components/JourneySheet.tsx",
                        lineNumber: 143,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/JourneySheet.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1.5 text-xs text-neutral-500",
                children: canceled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-red-600 dark:text-red-400",
                    children: "Een rit in deze reis valt uit"
                }, void 0, false, {
                    fileName: "[project]/src/components/JourneySheet.tsx",
                    lineNumber: 148,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        leaveIn <= 0 ? "Vertrek nu" : leaveIn < 60 ? `Vertrek over ${leaveIn} min` : `Vertrek ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dayLabel"])(j.departure, now) ? `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dayLabel"])(j.departure, now)} ` : ""}om ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatClock"])(j.departure)}`,
                        vehicle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "ml-1.5 text-emerald-600 dark:text-emerald-400",
                            children: "● live"
                        }, void 0, false, {
                            fileName: "[project]/src/components/JourneySheet.tsx",
                            lineNumber: 156,
                            columnNumber: 25
                        }, this),
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["delayMinutes"])(delay) !== 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `ml-1.5 ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DELAY_TONE_CLASSES"][(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["delayTone"])(delay)]}`,
                            children: [
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDelay"])(delay),
                                " min"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/JourneySheet.tsx",
                            lineNumber: 157,
                            columnNumber: 43
                        }, this),
                        alertCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "ml-1.5 text-amber-600 dark:text-amber-400",
                            children: [
                                "⚠ ",
                                alertCount === 1 ? "melding" : `${alertCount} meldingen`
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/JourneySheet.tsx",
                            lineNumber: 158,
                            columnNumber: 32
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/JourneySheet.tsx",
                    lineNumber: 150,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/JourneySheet.tsx",
                lineNumber: 146,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/JourneySheet.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
}
_c1 = JourneyOption;
function LegChip({ leg }) {
    if (leg.type === "walk") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
            children: [
                "🚶 ",
                minutes(leg.arrival - leg.departure)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/JourneySheet.tsx",
            lineNumber: 168,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "rounded-md px-1.5 py-0.5 text-xs font-bold text-white",
        style: {
            backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODE_COLORS"][leg.mode]
        },
        children: leg.line ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODE_LABELS"][leg.mode]
    }, void 0, false, {
        fileName: "[project]/src/components/JourneySheet.tsx",
        lineNumber: 171,
        columnNumber: 5
    }, this);
}
_c2 = LegChip;
function JourneyDetail({ journey: j, vehicles, now, onShowVehicle }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "px-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-2 text-base font-semibold tabular-nums",
                children: [
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dayLabel"])(j.departure, now) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mr-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dayLabel"])(j.departure, now)
                    }, void 0, false, {
                        fileName: "[project]/src/components/JourneySheet.tsx",
                        lineNumber: 181,
                        columnNumber: 40
                    }, this),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatClock"])(j.departure),
                    " → ",
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatClock"])(j.arrival),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-2 text-sm font-normal text-neutral-500",
                        children: [
                            durationText(j.arrival - j.departure),
                            " · ",
                            j.transfers === 0 ? "direct" : `${j.transfers}× overstappen`
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/JourneySheet.tsx",
                        lineNumber: 183,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/JourneySheet.tsx",
                lineNumber: 180,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                className: "space-y-2",
                children: j.legs.map((leg, i)=>leg.type === "walk" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "flex gap-3 text-sm text-neutral-600 dark:text-neutral-300",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-10 shrink-0 text-right text-xs tabular-nums text-neutral-400",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatClock"])(leg.departure)
                            }, void 0, false, {
                                fileName: "[project]/src/components/JourneySheet.tsx",
                                lineNumber: 191,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "🚶 Loop ",
                                    minutes(leg.arrival - leg.departure),
                                    " min",
                                    leg.distance > 60 ? ` (${leg.distance} m)` : "",
                                    " naar ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium",
                                        children: leg.to.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/JourneySheet.tsx",
                                        lineNumber: 193,
                                        columnNumber: 122
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/JourneySheet.tsx",
                                lineNumber: 192,
                                columnNumber: 15
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/src/components/JourneySheet.tsx",
                        lineNumber: 190,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TransitStep, {
                        leg: leg,
                        vehicle: vehicles.get(leg.tripId),
                        now: now,
                        onShowVehicle: onShowVehicle
                    }, i, false, {
                        fileName: "[project]/src/components/JourneySheet.tsx",
                        lineNumber: 197,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/JourneySheet.tsx",
                lineNumber: 187,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/JourneySheet.tsx",
        lineNumber: 179,
        columnNumber: 5
    }, this);
}
_c3 = JourneyDetail;
function TransitStep({ leg, vehicle, now, onShowVehicle }) {
    const color = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODE_COLORS"][leg.mode];
    const dep = expectedDeparture(leg, vehicle);
    const delay = dep - leg.departure;
    const arr = leg.expectedArrival ?? (vehicle?.delay !== undefined ? leg.arrival + vehicle.delay : leg.arrival);
    const platformWord = leg.mode === "train" ? "spoor" : "perron";
    const status = liveStatus(leg, vehicle, dep, arr, now);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        className: "flex gap-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "w-10 shrink-0 pt-0.5 text-right text-xs tabular-nums",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["delayMinutes"])(delay) !== 0 ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DELAY_TONE_CLASSES"][(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["delayTone"])(delay)] : undefined,
                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatClock"])(dep)
                }, void 0, false, {
                    fileName: "[project]/src/components/JourneySheet.tsx",
                    lineNumber: 216,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/JourneySheet.tsx",
                lineNumber: 215,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0 flex-1 border-l-4 pl-3",
                style: {
                    borderColor: color
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: leg.from.name
                            }, void 0, false, {
                                fileName: "[project]/src/components/JourneySheet.tsx",
                                lineNumber: 220,
                                columnNumber: 11
                            }, this),
                            leg.from.platform && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-neutral-500",
                                children: [
                                    " · ",
                                    platformWord,
                                    " ",
                                    leg.from.platform
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/JourneySheet.tsx",
                                lineNumber: 221,
                                columnNumber: 33
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/JourneySheet.tsx",
                        lineNumber: 219,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 flex items-center gap-1.5 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rounded-md px-1.5 py-0.5 text-xs font-bold text-white",
                                style: {
                                    backgroundColor: color
                                },
                                children: leg.line ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODE_LABELS"][leg.mode]
                            }, void 0, false, {
                                fileName: "[project]/src/components/JourneySheet.tsx",
                                lineNumber: 224,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "truncate",
                                children: [
                                    "→ ",
                                    leg.headsign ?? leg.to.name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/JourneySheet.tsx",
                                lineNumber: 227,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/JourneySheet.tsx",
                        lineNumber: 223,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-0.5 text-xs text-neutral-500",
                        children: [
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODE_LABELS"][leg.mode],
                            leg.agencyName ? ` · ${leg.agencyName}` : "",
                            " · ",
                            leg.stopsBetween + 1,
                            " ",
                            leg.stopsBetween === 0 ? "halte" : "haltes",
                            " ·",
                            " ",
                            minutes(leg.arrival - leg.departure),
                            " min"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/JourneySheet.tsx",
                        lineNumber: 229,
                        columnNumber: 9
                    }, this),
                    leg.alerts && leg.alerts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AlertList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertList"], {
                            alerts: leg.alerts,
                            compact: true
                        }, void 0, false, {
                            fileName: "[project]/src/components/JourneySheet.tsx",
                            lineNumber: 237,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/JourneySheet.tsx",
                        lineNumber: 236,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `mt-1.5 rounded-lg px-2 py-1.5 text-xs ${status.tone === "bad" ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300" : status.live ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: status.text
                            }, void 0, false, {
                                fileName: "[project]/src/components/JourneySheet.tsx",
                                lineNumber: 243,
                                columnNumber: 11
                            }, this),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["delayMinutes"])(delay) !== 0 && !status.tone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `ml-1 font-medium ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DELAY_TONE_CLASSES"][(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["delayTone"])(delay)]}`,
                                children: [
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDelay"])(delay),
                                    " min"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/JourneySheet.tsx",
                                lineNumber: 244,
                                columnNumber: 57
                            }, this),
                            vehicle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onShowVehicle(vehicle),
                                className: "ml-2 font-medium underline underline-offset-2",
                                children: "Toon op kaart"
                            }, void 0, false, {
                                fileName: "[project]/src/components/JourneySheet.tsx",
                                lineNumber: 246,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/JourneySheet.tsx",
                        lineNumber: 242,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1.5 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mr-1 text-xs tabular-nums text-neutral-500",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatClock"])(arr)
                            }, void 0, false, {
                                fileName: "[project]/src/components/JourneySheet.tsx",
                                lineNumber: 253,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: leg.to.name
                            }, void 0, false, {
                                fileName: "[project]/src/components/JourneySheet.tsx",
                                lineNumber: 254,
                                columnNumber: 11
                            }, this),
                            leg.to.platform && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-neutral-500",
                                children: [
                                    " · ",
                                    platformWord,
                                    " ",
                                    leg.to.platform
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/JourneySheet.tsx",
                                lineNumber: 255,
                                columnNumber: 31
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/JourneySheet.tsx",
                        lineNumber: 252,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/JourneySheet.tsx",
                lineNumber: 218,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/JourneySheet.tsx",
        lineNumber: 214,
        columnNumber: 5
    }, this);
}
_c4 = TransitStep;
/**
 * Waar is het voertuig van dit reisdeel nu? OVapi/KV6: bij IN_TRANSIT_TO is currentStopSequence de
 * laatst vertrokken halte; bij STOPPED_AT de halte waar het staat.
 */ function liveStatus(leg, vehicle, dep, arr, nowMs) {
    const now = nowMs / 1000;
    const mode = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODE_LABELS"][leg.mode].toLowerCase();
    if (leg.canceled) return {
        text: "Deze rit valt uit",
        live: false,
        tone: "bad"
    };
    if (!vehicle) {
        if (dep - now > 20 * 60) return {
            text: `Vertrekt om ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatClock"])(dep)}`,
            live: false
        };
        if (arr < now) return {
            text: "Deze rit is al voorbij",
            live: false
        };
        return {
            text: `Nog geen live positie van de ${mode}`,
            live: false
        };
    }
    const seq = vehicle.currentStopSequence;
    const atStop = vehicle.status === "STOPPED_AT";
    const beforeBoard = seq === undefined || seq < leg.fromSequence || seq === leg.fromSequence && atStop;
    const onBoard = !beforeBoard && seq !== undefined && seq < leg.toSequence;
    if (beforeBoard) {
        if (seq === leg.fromSequence && atStop) return {
            text: `● De ${mode} staat nu bij je halte`,
            live: true
        };
        const m = Math.round((dep - now) / 60);
        return {
            text: `● De ${mode} rijdt · bij je halte ${m <= 0 ? "nu" : `over ${m} min`}`,
            live: true
        };
    }
    if (onBoard) {
        const m = Math.round((arr - now) / 60);
        return {
            text: `● Onderweg · uitstappen ${m <= 0 ? "nu" : `over ${m} min`}`,
            live: true
        };
    }
    return {
        text: "● De rit is voorbij je uitstaphalte",
        live: true
    };
}
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "JourneySheet");
__turbopack_context__.k.register(_c1, "JourneyOption");
__turbopack_context__.k.register(_c2, "LegChip");
__turbopack_context__.k.register(_c3, "JourneyDetail");
__turbopack_context__.k.register(_c4, "TransitStep");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/LiveMap.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LiveMap",
    ()=>LiveMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$routeGeo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/routeGeo.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$journeyGeo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/journeyGeo.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$favorites$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/favorites.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/motion.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$JourneySheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/JourneySheet.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PlannerPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/PlannerPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$StatusPill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/StatusPill.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$StopSheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/StopSheet.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$VehicleSheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/VehicleSheet.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
// De backend ververst elke 20s; door vaker te vragen zien we nieuwe posities sneller.
const REFRESH_MS = 10_000;
const ANIMATION_MS = 1_500;
/** Vanaf dit zoomniveau rijden voertuigen tussen updates door over hun route. */ const PATHS_MIN_ZOOM = 12;
/** Doorrijden hoeft niet op 60 fps; dit spaart batterij. */ const FRAME_MS = 1000 / 30;
const NL_CENTER = [
    5.29,
    52.13
];
/** Vanaf dit zoomniveau staan haltes op de kaart. */ const STOPS_MIN_ZOOM = 14.5;
/** Reizen met "nu vertrekken" regelmatig opnieuw plannen (vertragingen, gemiste bus). */ const REPLAN_MS = 60_000;
/** Live voertuigen van de reisopties verversen. */ const JOURNEY_VEHICLES_MS = 15_000;
const EMPTY = {
    type: "FeatureCollection",
    features: []
};
const MODE_COLOR = [
    "match",
    [
        "get",
        "mode"
    ],
    "bus",
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODE_COLORS"].bus,
    "tram",
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODE_COLORS"].tram,
    "metro",
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODE_COLORS"].metro,
    "train",
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODE_COLORS"].train,
    "ferry",
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODE_COLORS"].ferry,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODE_COLORS"].other
];
const PASSED_COLOR = "#9ca3af";
function LiveMap() {
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Animatiestatus in refs: die verandert elk frame en hoort niet in React-state.
    const vehiclesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const motionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const animStartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const rafRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastFrameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const lastLoadKeyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])("");
    // Verschil tussen server- en browserklok, zodat extrapoleren vanaf de GPS-tijd klopt.
    const clockOffsetRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const abortRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const selectedIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [follow, setFollow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const followRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [selectedStop, setSelectedStop] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Reisplanner
    const [from, setFrom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [to, setTo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [planTime, setPlanTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [plan, setPlan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [planError, setPlanError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedJourney, setSelectedJourney] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [locationError, setLocationError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Telt op als "Mijn locatie" als vertrekpunt mislukt: dan gaat de cursor naar het Van-veld.
    const [focusFrom, setFocusFrom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [journeyVehicles, setJourneyVehicles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Map());
    // Rit-ID's van de gekozen reis: die voertuigen lichten op, de rest vervaagt.
    const journeyTripsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const stopsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const stopsAbortRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        state: "loading"
    });
    const [modeCounts, setModeCounts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const modeCountsKeyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])("");
    const visibleCount = Object.values(modeCounts).reduce((sum, n)=>sum + (n ?? 0), 0);
    const [mapReady, setMapReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tripRoute, setTripRoute] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Alleen tonen als de route bij het huidige voertuig hoort (voorkomt een verouderde route na wisselen).
    const activeTripRoute = tripRoute && tripRoute.tripId === selected?.tripId ? tripRoute : null;
    // State spiegelen naar refs, zodat de map-callbacks (één keer geregistreerd) de actuele waarde zien.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LiveMap.useEffect": ()=>{
            selectedIdRef.current = selected?.id ?? null;
            followRef.current = follow;
        }
    }["LiveMap.useEffect"], [
        selected,
        follow
    ]);
    const progressAt = (now)=>Math.min(1, (now - animStartRef.current) / ANIMATION_MS);
    const serverNow = ()=>Date.now() + clockOffsetRef.current;
    const render = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiveMap.useCallback[render]": (t)=>{
            const source = mapRef.current?.getSource("vehicles");
            if (!source) return;
            const now = serverNow();
            const nowSec = now / 1000;
            const features = [];
            const counts = {};
            for (const v of vehiclesRef.current.values()){
                counts[v.mode] = (counts[v.mode] ?? 0) + 1;
                const motion = motionRef.current.get(v.id);
                features.push({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: motion ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["positionAt"])(motion, now, t) : [
                            v.lng,
                            v.lat
                        ]
                    },
                    properties: {
                        id: v.id,
                        line: v.line ?? "",
                        mode: v.mode,
                        selected: v.id === selectedIdRef.current,
                        mine: !!v.tripId && !!journeyTripsRef.current?.has(v.tripId),
                        dim: !!journeyTripsRef.current && !(v.tripId && journeyTripsRef.current.has(v.tripId)),
                        stale: v.timestamp ? nowSec - v.timestamp > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STALE_AFTER_SECONDS"] : false
                    }
                });
            }
            // Geselecteerd voertuig als laatste, zodat het bovenop ligt.
            features.sort({
                "LiveMap.useCallback[render]": (a, b)=>Number(a.properties.selected) - Number(b.properties.selected)
            }["LiveMap.useCallback[render]"]);
            source.setData({
                type: "FeatureCollection",
                features
            });
            // Draait elk animatieframe: alleen state zetten als de aantallen echt veranderen.
            const key = JSON.stringify(counts);
            if (key !== modeCountsKeyRef.current) {
                modeCountsKeyRef.current = key;
                setModeCounts(counts);
            }
        }
    }["LiveMap.useCallback[render]"], []);
    // Animatielus: draait zolang er gecorrigeerd wordt of er voertuigen doorrijden.
    const animate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiveMap.useCallback[animate]": ()=>{
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            const step = {
                "LiveMap.useCallback[animate].step": (frameTime)=>{
                    const t = progressAt(performance.now());
                    const anyMoving = [
                        ...motionRef.current.values()
                    ].some(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isMoving"]);
                    if (frameTime - lastFrameRef.current >= FRAME_MS || t < 1) {
                        lastFrameRef.current = frameTime;
                        render(t);
                        // Volgen: kaart centreren op de positie zoals die op het scherm staat.
                        const map = mapRef.current;
                        const selectedId = selectedIdRef.current;
                        const motion = selectedId ? motionRef.current.get(selectedId) : undefined;
                        if (followRef.current && map && motion && !map.isZooming()) {
                            map.jumpTo({
                                center: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["positionAt"])(motion, serverNow(), t)
                            });
                        }
                    }
                    rafRef.current = t < 1 || anyMoving ? requestAnimationFrame(step) : null;
                }
            }["LiveMap.useCallback[animate].step"];
            step(performance.now());
        }
    }["LiveMap.useCallback[animate]"], [
        render
    ]);
    const applyVehicles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiveMap.useCallback[applyVehicles]": (list)=>{
            const t = progressAt(performance.now());
            const now = serverNow();
            const next = new Map();
            for (const v of list){
                const prev = motionRef.current.get(v.id);
                const motion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeMotion"])(v);
                // Start vanaf waar het voertuig nu op het scherm staat, ook als een vorige animatie nog liep.
                next.set(v.id, prev ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["continueFrom"])(motion, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["positionAt"])(prev, now, t), now) : motion);
            }
            vehiclesRef.current = new Map(list.map({
                "LiveMap.useCallback[applyVehicles]": (v)=>[
                        v.id,
                        v
                    ]
            }["LiveMap.useCallback[applyVehicles]"]));
            motionRef.current = next;
            animStartRef.current = performance.now();
            animate();
        }
    }["LiveMap.useCallback[applyVehicles]"], [
        animate
    ]);
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiveMap.useCallback[load]": async ()=>{
            const map = mapRef.current;
            if (!map) return;
            // Iets ruimer dan het beeld, zodat voertuigen aan de rand niet opeens verschijnen bij kleine verschuivingen.
            const b = map.getBounds();
            const padLng = (b.getEast() - b.getWest()) * 0.1;
            const padLat = (b.getNorth() - b.getSouth()) * 0.1;
            const bbox = [
                b.getWest() - padLng,
                b.getSouth() - padLat,
                b.getEast() + padLng,
                b.getNorth() + padLat
            ].map({
                "LiveMap.useCallback[load].bbox": (n)=>n.toFixed(4)
            }["LiveMap.useCallback[load].bbox"]).join(",");
            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;
            try {
                const paths = map.getZoom() >= PATHS_MIN_ZOOM ? 1 : 0;
                const res = await fetch(`/api/vehicles?bbox=${bbox}&paths=${paths}`, {
                    signal: controller.signal
                });
                if (!res.ok) throw new Error(res.status === 503 ? "Backend is nog aan het opstarten…" : `HTTP ${res.status}`);
                const data = await res.json();
                clockOffsetRef.current = data.serverTime - Date.now();
                const key = `${data.updatedAt}|${bbox}|${paths}`;
                if (key === lastLoadKeyRef.current) return;
                lastLoadKeyRef.current = key;
                applyVehicles(data.vehicles);
                setStatus({
                    state: "ok",
                    updatedAt: data.updatedAt
                });
                const selectedId = selectedIdRef.current;
                if (selectedId) {
                    const fresh = data.vehicles.find({
                        "LiveMap.useCallback[load].fresh": (v)=>v.id === selectedId
                    }["LiveMap.useCallback[load].fresh"]);
                    // Meebewegen bij "volgen" gebeurt in de animatielus.
                    if (fresh) setSelected(fresh);
                }
            } catch (err) {
                if (controller.signal.aborted) return;
                const message = err instanceof Error ? err.message : String(err);
                setStatus({
                    "LiveMap.useCallback[load]": (s)=>({
                            state: "error",
                            message: message.startsWith("HTTP 5") || message.includes("fetch") ? "Backend niet bereikbaar. Draait `npm run dev` in backend/?" : message,
                            updatedAt: s.state === "ok" ? s.updatedAt : undefined
                        })
                }["LiveMap.useCallback[load]"]);
            }
        }
    }["LiveMap.useCallback[load]"], [
        applyVehicles
    ]);
    // Halte kiezen (uit het zoekvak of op de kaart): vertrekbord openen, voertuigselectie sluiten.
    const selectStop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiveMap.useCallback[selectStop]": (stop, fly = true)=>{
            setSelected(null);
            selectedIdRef.current = null;
            setFollow(false);
            setSelectedStop(stop);
            if (fly) mapRef.current?.flyTo({
                center: [
                    stop.lng,
                    stop.lat
                ],
                zoom: Math.max(mapRef.current.getZoom(), 16),
                duration: 900
            });
        }
    }["LiveMap.useCallback[selectStop]"], []);
    // Haltes in beeld ophalen (alleen vanaf straatniveau).
    const loadStops = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiveMap.useCallback[loadStops]": async ()=>{
            const map = mapRef.current;
            const source = map?.getSource("stops");
            if (!map || !source) return;
            if (map.getZoom() < STOPS_MIN_ZOOM) {
                source.setData(EMPTY);
                return;
            }
            const b = map.getBounds();
            const bbox = [
                b.getWest(),
                b.getSouth(),
                b.getEast(),
                b.getNorth()
            ].map({
                "LiveMap.useCallback[loadStops].bbox": (n)=>n.toFixed(4)
            }["LiveMap.useCallback[loadStops].bbox"]).join(",");
            stopsAbortRef.current?.abort();
            const controller = new AbortController();
            stopsAbortRef.current = controller;
            try {
                const res = await fetch(`/api/stops?bbox=${bbox}`, {
                    signal: controller.signal
                });
                if (!res.ok) return;
                const { stops } = await res.json();
                stopsRef.current = new Map(stops.map({
                    "LiveMap.useCallback[loadStops]": (st)=>[
                            st.id,
                            st
                        ]
                }["LiveMap.useCallback[loadStops]"]));
                source.setData({
                    type: "FeatureCollection",
                    features: stops.map({
                        "LiveMap.useCallback[loadStops]": (st)=>({
                                type: "Feature",
                                geometry: {
                                    type: "Point",
                                    coordinates: [
                                        st.lng,
                                        st.lat
                                    ]
                                },
                                properties: {
                                    id: st.id,
                                    name: st.name,
                                    mode: st.modes[0] ?? "other"
                                }
                            })
                    }["LiveMap.useCallback[loadStops]"])
                });
            } catch  {
            // afgebroken of backend weg: haltes blijven zoals ze waren
            }
        }
    }["LiveMap.useCallback[loadStops]"], []);
    // Kaart opzetten (één keer).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LiveMap.useEffect": ()=>{
            let cancelled = false;
            let map;
            let moveTimer;
            let refreshTimer;
            ({
                "LiveMap.useEffect": async ()=>{
                    // maplibre-gl gebruikt `window`, dus pas in de browser laden.
                    const maplibregl = await __turbopack_context__.A("[project]/node_modules/maplibre-gl/dist/maplibre-gl.mjs [app-client] (ecmascript, async loader)");
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
                            [
                                1.5,
                                49.5
                            ],
                            [
                                9.5,
                                55
                            ]
                        ],
                        attributionControl: {
                            compact: true
                        }
                    });
                    map = m;
                    mapRef.current = m;
                    m.addControl(new maplibregl.NavigationControl({
                        showCompass: false
                    }), "top-right");
                    m.addControl(new maplibregl.GeolocateControl({
                        positionOptions: {
                            enableHighAccuracy: true
                        },
                        trackUserLocation: true
                    }), "top-right");
                    m.on("load", {
                        "LiveMap.useEffect": ()=>{
                            m.addSource("vehicles", {
                                type: "geojson",
                                data: EMPTY
                            });
                            m.addSource("route", {
                                type: "geojson",
                                data: EMPTY
                            });
                            m.addSource("route-stops", {
                                type: "geojson",
                                data: EMPTY
                            });
                            m.addSource("stops", {
                                type: "geojson",
                                data: EMPTY
                            });
                            m.addSource("selected-stop", {
                                type: "geojson",
                                data: EMPTY
                            });
                            m.addSource("journey", {
                                type: "geojson",
                                data: EMPTY
                            });
                            // Routelagen eerst toevoegen, zodat voertuigen er bovenop liggen.
                            m.addLayer({
                                id: "route-casing",
                                type: "line",
                                source: "route",
                                filter: [
                                    "!",
                                    [
                                        "get",
                                        "approximate"
                                    ]
                                ],
                                layout: {
                                    "line-join": "round",
                                    "line-cap": "round"
                                },
                                paint: {
                                    "line-color": dark ? "#0a0a0a" : "#ffffff",
                                    "line-width": [
                                        "interpolate",
                                        [
                                            "linear"
                                        ],
                                        [
                                            "zoom"
                                        ],
                                        8,
                                        3,
                                        12,
                                        6,
                                        16,
                                        11
                                    ]
                                }
                            });
                            m.addLayer({
                                id: "route-line",
                                type: "line",
                                source: "route",
                                filter: [
                                    "!",
                                    [
                                        "get",
                                        "approximate"
                                    ]
                                ],
                                layout: {
                                    "line-join": "round",
                                    "line-cap": "round"
                                },
                                paint: {
                                    "line-color": [
                                        "case",
                                        [
                                            "get",
                                            "passed"
                                        ],
                                        PASSED_COLOR,
                                        MODE_COLOR
                                    ],
                                    "line-width": [
                                        "interpolate",
                                        [
                                            "linear"
                                        ],
                                        [
                                            "zoom"
                                        ],
                                        8,
                                        1.5,
                                        12,
                                        3.5,
                                        16,
                                        7
                                    ],
                                    "line-opacity": [
                                        "case",
                                        [
                                            "get",
                                            "passed"
                                        ],
                                        0.7,
                                        0.9
                                    ]
                                }
                            });
                            // Benaderde route (rechte stukken tussen haltes): gestippeld, zodat niemand denkt dat de bus daar rijdt.
                            m.addLayer({
                                id: "route-line-approximate",
                                type: "line",
                                source: "route",
                                filter: [
                                    "get",
                                    "approximate"
                                ],
                                paint: {
                                    "line-color": [
                                        "case",
                                        [
                                            "get",
                                            "passed"
                                        ],
                                        PASSED_COLOR,
                                        MODE_COLOR
                                    ],
                                    "line-width": [
                                        "interpolate",
                                        [
                                            "linear"
                                        ],
                                        [
                                            "zoom"
                                        ],
                                        8,
                                        1.5,
                                        12,
                                        3,
                                        16,
                                        5
                                    ],
                                    "line-opacity": [
                                        "case",
                                        [
                                            "get",
                                            "passed"
                                        ],
                                        0.6,
                                        0.85
                                    ],
                                    "line-dasharray": [
                                        1.5,
                                        2
                                    ]
                                }
                            });
                            m.addLayer({
                                id: "route-stops",
                                type: "circle",
                                source: "route-stops",
                                minzoom: 10,
                                paint: {
                                    "circle-radius": [
                                        "interpolate",
                                        [
                                            "linear"
                                        ],
                                        [
                                            "zoom"
                                        ],
                                        10,
                                        2,
                                        13,
                                        4,
                                        16,
                                        6
                                    ],
                                    "circle-color": dark ? "#171717" : "#ffffff",
                                    "circle-stroke-color": [
                                        "case",
                                        [
                                            "get",
                                            "passed"
                                        ],
                                        PASSED_COLOR,
                                        MODE_COLOR
                                    ],
                                    "circle-stroke-width": [
                                        "interpolate",
                                        [
                                            "linear"
                                        ],
                                        [
                                            "zoom"
                                        ],
                                        10,
                                        1.5,
                                        14,
                                        2.5
                                    ]
                                }
                            });
                            m.addLayer({
                                id: "route-stop-labels",
                                type: "symbol",
                                source: "route-stops",
                                minzoom: 13,
                                layout: {
                                    "text-field": [
                                        "get",
                                        "name"
                                    ],
                                    "text-font": [
                                        "Noto Sans Regular"
                                    ],
                                    "text-size": 11,
                                    "text-anchor": "left",
                                    "text-offset": [
                                        0.9,
                                        0
                                    ],
                                    "text-optional": true
                                },
                                paint: {
                                    "text-color": [
                                        "case",
                                        [
                                            "get",
                                            "passed"
                                        ],
                                        PASSED_COLOR,
                                        dark ? "#e5e5e5" : "#262626"
                                    ],
                                    "text-halo-color": dark ? "#0a0a0a" : "#ffffff",
                                    "text-halo-width": 1.5
                                }
                            });
                            // Haltes (vanaf straatniveau): wit bolletje met rand in de kleur van de belangrijkste vervoerswijze.
                            m.addLayer({
                                id: "stops",
                                type: "circle",
                                source: "stops",
                                minzoom: STOPS_MIN_ZOOM,
                                paint: {
                                    "circle-radius": [
                                        "interpolate",
                                        [
                                            "linear"
                                        ],
                                        [
                                            "zoom"
                                        ],
                                        14.5,
                                        3.5,
                                        17,
                                        6
                                    ],
                                    "circle-color": dark ? "#171717" : "#ffffff",
                                    "circle-stroke-color": MODE_COLOR,
                                    "circle-stroke-width": 2
                                }
                            });
                            m.addLayer({
                                id: "stop-labels",
                                type: "symbol",
                                source: "stops",
                                minzoom: 16,
                                layout: {
                                    "text-field": [
                                        "get",
                                        "name"
                                    ],
                                    "text-font": [
                                        "Noto Sans Regular"
                                    ],
                                    "text-size": 11,
                                    "text-anchor": "top",
                                    "text-offset": [
                                        0,
                                        0.8
                                    ],
                                    "text-optional": true
                                },
                                paint: {
                                    "text-color": dark ? "#d4d4d4" : "#404040",
                                    "text-halo-color": dark ? "#0a0a0a" : "#ffffff",
                                    "text-halo-width": 1.5
                                }
                            });
                            m.addLayer({
                                id: "selected-stop",
                                type: "circle",
                                source: "selected-stop",
                                paint: {
                                    "circle-radius": [
                                        "interpolate",
                                        [
                                            "linear"
                                        ],
                                        [
                                            "zoom"
                                        ],
                                        10,
                                        6,
                                        16,
                                        9
                                    ],
                                    "circle-color": dark ? "#171717" : "#ffffff",
                                    "circle-stroke-color": "#facc15",
                                    "circle-stroke-width": 4
                                }
                            });
                            // Geplande reis: lopen gestippeld, ritten in de kleur van de vervoerswijze, begin/eind als punten.
                            m.addLayer({
                                id: "journey-walk",
                                type: "line",
                                source: "journey",
                                filter: [
                                    "==",
                                    [
                                        "get",
                                        "kind"
                                    ],
                                    "walk"
                                ],
                                layout: {
                                    "line-cap": "round"
                                },
                                paint: {
                                    "line-color": dark ? "#a3a3a3" : "#525252",
                                    "line-width": 3,
                                    "line-dasharray": [
                                        0.5,
                                        2
                                    ]
                                }
                            });
                            m.addLayer({
                                id: "journey-casing",
                                type: "line",
                                source: "journey",
                                filter: [
                                    "==",
                                    [
                                        "get",
                                        "kind"
                                    ],
                                    "transit"
                                ],
                                layout: {
                                    "line-join": "round",
                                    "line-cap": "round"
                                },
                                paint: {
                                    "line-color": dark ? "#0a0a0a" : "#ffffff",
                                    "line-width": [
                                        "interpolate",
                                        [
                                            "linear"
                                        ],
                                        [
                                            "zoom"
                                        ],
                                        8,
                                        5,
                                        14,
                                        10
                                    ]
                                }
                            });
                            m.addLayer({
                                id: "journey-transit",
                                type: "line",
                                source: "journey",
                                filter: [
                                    "==",
                                    [
                                        "get",
                                        "kind"
                                    ],
                                    "transit"
                                ],
                                layout: {
                                    "line-join": "round",
                                    "line-cap": "round"
                                },
                                paint: {
                                    "line-color": MODE_COLOR,
                                    "line-width": [
                                        "interpolate",
                                        [
                                            "linear"
                                        ],
                                        [
                                            "zoom"
                                        ],
                                        8,
                                        3,
                                        14,
                                        6
                                    ]
                                }
                            });
                            m.addLayer({
                                id: "journey-points",
                                type: "circle",
                                source: "journey",
                                filter: [
                                    "match",
                                    [
                                        "get",
                                        "kind"
                                    ],
                                    [
                                        "stop",
                                        "from",
                                        "to"
                                    ],
                                    true,
                                    false
                                ],
                                paint: {
                                    "circle-radius": [
                                        "match",
                                        [
                                            "get",
                                            "kind"
                                        ],
                                        "stop",
                                        5,
                                        8
                                    ],
                                    "circle-color": [
                                        "match",
                                        [
                                            "get",
                                            "kind"
                                        ],
                                        "from",
                                        "#2563eb",
                                        "to",
                                        "#ef4444",
                                        dark ? "#171717" : "#ffffff"
                                    ],
                                    "circle-stroke-color": [
                                        "match",
                                        [
                                            "get",
                                            "kind"
                                        ],
                                        "stop",
                                        MODE_COLOR,
                                        "#ffffff"
                                    ],
                                    "circle-stroke-width": 3
                                }
                            });
                            m.addLayer({
                                id: "vehicles",
                                type: "circle",
                                source: "vehicles",
                                paint: {
                                    "circle-color": MODE_COLOR,
                                    "circle-radius": [
                                        "interpolate",
                                        [
                                            "linear"
                                        ],
                                        [
                                            "zoom"
                                        ],
                                        6,
                                        [
                                            "case",
                                            [
                                                "get",
                                                "selected"
                                            ],
                                            6,
                                            2.5
                                        ],
                                        10,
                                        [
                                            "case",
                                            [
                                                "get",
                                                "selected"
                                            ],
                                            8,
                                            4
                                        ],
                                        12,
                                        [
                                            "case",
                                            [
                                                "get",
                                                "selected"
                                            ],
                                            14,
                                            11
                                        ],
                                        16,
                                        [
                                            "case",
                                            [
                                                "get",
                                                "selected"
                                            ],
                                            16,
                                            13
                                        ]
                                    ],
                                    "circle-stroke-width": [
                                        "case",
                                        [
                                            "get",
                                            "selected"
                                        ],
                                        4,
                                        [
                                            "get",
                                            "mine"
                                        ],
                                        4,
                                        1.5
                                    ],
                                    "circle-stroke-color": [
                                        "case",
                                        [
                                            "get",
                                            "selected"
                                        ],
                                        "#facc15",
                                        [
                                            "get",
                                            "mine"
                                        ],
                                        "#10b981",
                                        "#ffffff"
                                    ],
                                    "circle-opacity": [
                                        "case",
                                        [
                                            "get",
                                            "dim"
                                        ],
                                        0.2,
                                        [
                                            "get",
                                            "stale"
                                        ],
                                        0.35,
                                        1
                                    ],
                                    "circle-stroke-opacity": [
                                        "case",
                                        [
                                            "get",
                                            "dim"
                                        ],
                                        0.2,
                                        [
                                            "get",
                                            "stale"
                                        ],
                                        0.35,
                                        1
                                    ]
                                }
                            });
                            m.addLayer({
                                id: "vehicle-labels",
                                type: "symbol",
                                source: "vehicles",
                                minzoom: 11.5,
                                layout: {
                                    "text-field": [
                                        "get",
                                        "line"
                                    ],
                                    "text-font": [
                                        "Noto Sans Bold"
                                    ],
                                    "text-size": [
                                        "case",
                                        [
                                            ">",
                                            [
                                                "length",
                                                [
                                                    "get",
                                                    "line"
                                                ]
                                            ],
                                            3
                                        ],
                                        8,
                                        10
                                    ],
                                    "text-allow-overlap": true,
                                    "text-ignore-placement": true
                                },
                                paint: {
                                    "text-color": "#ffffff"
                                }
                            });
                            m.on("click", "vehicles", {
                                "LiveMap.useEffect": (e)=>{
                                    const feature = e.features?.[0];
                                    const vehicle = feature && vehiclesRef.current.get(String(feature.properties.id));
                                    if (!vehicle) return;
                                    setSelectedStop(null);
                                    setSelected(vehicle);
                                    selectedIdRef.current = vehicle.id;
                                    render(progressAt(performance.now()));
                                }
                            }["LiveMap.useEffect"]);
                            m.on("click", "stops", {
                                "LiveMap.useEffect": (e)=>{
                                    // Een voertuig bovenop de halte gaat voor.
                                    if (m.queryRenderedFeatures(e.point, {
                                        layers: [
                                            "vehicles"
                                        ]
                                    }).length) return;
                                    const stop = stopsRef.current.get(String(e.features?.[0]?.properties.id));
                                    if (stop) selectStop(stop, false);
                                }
                            }["LiveMap.useEffect"]);
                            m.on("click", {
                                "LiveMap.useEffect": (e)=>{
                                    if (m.queryRenderedFeatures(e.point, {
                                        layers: [
                                            "vehicles",
                                            "route-stops",
                                            "stops"
                                        ]
                                    }).length) return;
                                    setSelectedStop(null);
                                    setSelected(null);
                                    selectedIdRef.current = null;
                                    setFollow(false);
                                    render(progressAt(performance.now()));
                                }
                            }["LiveMap.useEffect"]);
                            for (const layer of [
                                "vehicles",
                                "stops"
                            ]){
                                m.on("mouseenter", layer, {
                                    "LiveMap.useEffect": ()=>m.getCanvas().style.cursor = "pointer"
                                }["LiveMap.useEffect"]);
                                m.on("mouseleave", layer, {
                                    "LiveMap.useEffect": ()=>m.getCanvas().style.cursor = ""
                                }["LiveMap.useEffect"]);
                            }
                            m.on("moveend", {
                                "LiveMap.useEffect": ()=>{
                                    clearTimeout(moveTimer);
                                    moveTimer = setTimeout({
                                        "LiveMap.useEffect": ()=>{
                                            void load();
                                            void loadStops();
                                        }
                                    }["LiveMap.useEffect"], 250);
                                }
                            }["LiveMap.useEffect"]);
                            // Handmatig slepen stopt het volgen.
                            m.on("dragstart", {
                                "LiveMap.useEffect": ()=>setFollow(false)
                            }["LiveMap.useEffect"]);
                            setMapReady(true);
                            void load();
                            void loadStops();
                            refreshTimer = setInterval(load, REFRESH_MS);
                        }
                    }["LiveMap.useEffect"]);
                }
            })["LiveMap.useEffect"]();
            return ({
                "LiveMap.useEffect": ()=>{
                    cancelled = true;
                    clearTimeout(moveTimer);
                    clearInterval(refreshTimer);
                    abortRef.current?.abort();
                    stopsAbortRef.current?.abort();
                    if (rafRef.current) cancelAnimationFrame(rafRef.current);
                    map?.remove();
                    mapRef.current = null;
                    setMapReady(false);
                }
            })["LiveMap.useEffect"];
        }
    }["LiveMap.useEffect"], [
        load,
        loadStops,
        render,
        selectStop
    ]);
    // Route van het geselecteerde voertuig ophalen.
    const selectedTripId = selected?.tripId;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LiveMap.useEffect": ()=>{
            if (!selectedTripId) return;
            const controller = new AbortController();
            fetch(`/api/trips/${encodeURIComponent(selectedTripId)}`, {
                signal: controller.signal
            }).then({
                "LiveMap.useEffect": (res)=>res.ok ? res.json() : null
            }["LiveMap.useEffect"]).then({
                "LiveMap.useEffect": (route)=>route && setTripRoute(route)
            }["LiveMap.useEffect"]).catch({
                "LiveMap.useEffect": ()=>{}
            }["LiveMap.useEffect"]);
            return ({
                "LiveMap.useEffect": ()=>controller.abort()
            })["LiveMap.useEffect"];
        }
    }["LiveMap.useEffect"], [
        selectedTripId
    ]);
    // Route tekenen van het geselecteerde voertuig.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LiveMap.useEffect": ()=>{
            const map = mapRef.current;
            if (!mapReady || !map) return;
            const geo = activeTripRoute ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$routeGeo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tripRouteGeo"])(activeTripRoute, selected) : null;
            map.getSource("route")?.setData(geo?.lines ?? EMPTY);
            map.getSource("route-stops")?.setData(geo?.stops ?? EMPTY);
        }
    }["LiveMap.useEffect"], [
        mapReady,
        activeTripRoute,
        selected
    ]);
    // Gekozen halte markeren.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LiveMap.useEffect": ()=>{
            const source = mapRef.current?.getSource("selected-stop");
            if (!mapReady || !source) return;
            source.setData(selectedStop ? {
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [
                                selectedStop.lng,
                                selectedStop.lat
                            ]
                        },
                        properties: {}
                    }
                ]
            } : EMPTY);
        }
    }["LiveMap.useEffect"], [
        mapReady,
        selectedStop
    ]);
    // --- Reisplanner ------------------------------------------------------------------------------
    const requestMyLocation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiveMap.useCallback[requestMyLocation]": (target)=>{
            setLocationError(null);
            if (!navigator.geolocation) {
                setLocationError("Je browser kan je locatie niet bepalen. Kies een vertrekpunt.");
                if (target === "from") setFocusFrom({
                    "LiveMap.useCallback[requestMyLocation]": (n)=>n + 1
                }["LiveMap.useCallback[requestMyLocation]"]);
                return;
            }
            navigator.geolocation.getCurrentPosition({
                "LiveMap.useCallback[requestMyLocation]": (pos)=>{
                    const ep = {
                        kind: "location",
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    };
                    if (target === "from") setFrom(ep);
                    else setTo(ep);
                }
            }["LiveMap.useCallback[requestMyLocation]"], {
                "LiveMap.useCallback[requestMyLocation]": ()=>{
                    setLocationError("Je locatie is niet beschikbaar (toestemming geweigerd?). Kies een vertrekpunt.");
                    if (target === "from") setFocusFrom({
                        "LiveMap.useCallback[requestMyLocation]": (n)=>n + 1
                    }["LiveMap.useCallback[requestMyLocation]"]);
                }
            }["LiveMap.useCallback[requestMyLocation]"], {
                enableHighAccuracy: true,
                timeout: 10_000,
                maximumAge: 60_000
            });
        }
    }["LiveMap.useCallback[requestMyLocation]"], []);
    const chooseTo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiveMap.useCallback[chooseTo]": (ep)=>{
            setTo(ep);
            setSelectedJourney(null);
            // Nog geen vertrekpunt? Dan vertrekken we vanaf waar je nu bent.
            if (ep && !from) requestMyLocation("from");
        }
    }["LiveMap.useCallback[chooseTo]"], [
        from,
        requestMyLocation
    ]);
    const chooseFrom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiveMap.useCallback[chooseFrom]": (ep)=>{
            setFrom(ep);
            if (ep) setLocationError(null);
            setSelectedJourney(null);
        }
    }["LiveMap.useCallback[chooseFrom]"], []);
    const swap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiveMap.useCallback[swap]": ()=>{
            setFrom(to);
            setTo(from);
            setSelectedJourney(null);
        }
    }["LiveMap.useCallback[swap]"], [
        from,
        to
    ]);
    const { has: isFavorite, toggle: toggleFavorite } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$favorites$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFavorites"])();
    const routeFavorite = from && to ? {
        kind: "route",
        from: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$favorites$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toSaved"])(from),
        to: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$favorites$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toSaved"])(to)
    } : null;
    const applyRoute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiveMap.useCallback[applyRoute]": (route)=>{
            const apply = {
                "LiveMap.useCallback[applyRoute].apply": (ep, target)=>{
                    if (ep.kind === "location") requestMyLocation(target);
                    else if (target === "from") setFrom(ep);
                    else setTo(ep);
                }
            }["LiveMap.useCallback[applyRoute].apply"];
            apply(route.from, "from");
            apply(route.to, "to");
            setSelectedJourney(null);
        }
    }["LiveMap.useCallback[applyRoute]"], [
        requestMyLocation
    ]);
    const closePlan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiveMap.useCallback[closePlan]": ()=>{
            setTo(null);
            setPlan(null);
            setSelectedJourney(null);
        }
    }["LiveMap.useCallback[closePlan]"], []);
    // Plannen zodra van en naar bekend zijn; bij "nu" elke minuut opnieuw (vertragingen, gemiste bus).
    const planKey = from && to ? JSON.stringify([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$journeyGeo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endpointParams"])("from", from),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$journeyGeo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endpointParams"])("to", to),
        planTime
    ]) : null;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LiveMap.useEffect": ()=>{
            if (!from || !to || !planKey) return;
            let controller = new AbortController();
            const run = {
                "LiveMap.useEffect.run": ()=>{
                    controller.abort();
                    controller = new AbortController();
                    const params = new URLSearchParams({
                        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$journeyGeo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endpointParams"])("from", from),
                        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$journeyGeo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endpointParams"])("to", to)
                    });
                    if (planTime) params.set("time", String(planTime));
                    fetch(`/api/plan?${params}`, {
                        signal: controller.signal
                    }).then({
                        "LiveMap.useEffect.run": (res)=>res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))
                    }["LiveMap.useEffect.run"]).then({
                        "LiveMap.useEffect.run": (data)=>{
                            setPlan({
                                key: planKey,
                                journeys: data.journeys,
                                notice: data.notice
                            });
                            setPlanError(null);
                        }
                    }["LiveMap.useEffect.run"]).catch({
                        "LiveMap.useEffect.run": ()=>!controller.signal.aborted && setPlanError("Plannen mislukt. Draait de backend?")
                    }["LiveMap.useEffect.run"]);
                }
            }["LiveMap.useEffect.run"];
            run();
            const timer = planTime ? undefined : setInterval(run, REPLAN_MS);
            return ({
                "LiveMap.useEffect": ()=>{
                    clearInterval(timer);
                    controller.abort();
                }
            })["LiveMap.useEffect"];
        }
    }["LiveMap.useEffect"], [
        from,
        to,
        planTime,
        planKey
    ]);
    const journeys = plan && plan.key === planKey ? plan.journeys : null;
    // Ook zonder vertrekpunt naar de gekozen bestemming vliegen.
    const toKey = to ? JSON.stringify((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$journeyGeo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endpointParams"])("to", to)) : null;
    const activeJourney = selectedJourney !== null ? journeys?.[selectedJourney] : undefined;
    // Live voertuigen van alle ritten in de reisopties.
    const journeyTripIds = [
        ...new Set((journeys ?? []).flatMap((j)=>j.legs.flatMap((l)=>l.type === "transit" ? [
                    l.tripId
                ] : [])))
    ].join(",");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LiveMap.useEffect": ()=>{
            if (!journeyTripIds) return;
            let controller = new AbortController();
            const load = {
                "LiveMap.useEffect.load": ()=>{
                    controller.abort();
                    controller = new AbortController();
                    fetch(`/api/vehicles?trip=${encodeURIComponent(journeyTripIds)}`, {
                        signal: controller.signal
                    }).then({
                        "LiveMap.useEffect.load": (res)=>res.ok ? res.json() : null
                    }["LiveMap.useEffect.load"]).then({
                        "LiveMap.useEffect.load": (data)=>data && setJourneyVehicles(new Map(data.vehicles.flatMap({
                                "LiveMap.useEffect.load": (v)=>v.tripId ? [
                                        [
                                            v.tripId,
                                            v
                                        ]
                                    ] : []
                            }["LiveMap.useEffect.load"])))
                    }["LiveMap.useEffect.load"]).catch({
                        "LiveMap.useEffect.load": ()=>{}
                    }["LiveMap.useEffect.load"]);
                }
            }["LiveMap.useEffect.load"];
            load();
            const timer = setInterval(load, JOURNEY_VEHICLES_MS);
            return ({
                "LiveMap.useEffect": ()=>{
                    clearInterval(timer);
                    controller.abort();
                }
            })["LiveMap.useEffect"];
        }
    }["LiveMap.useEffect"], [
        journeyTripIds
    ]);
    // Reis op de kaart tekenen; bij het kiezen van een optie erop inzoomen en de andere voertuigen vervagen.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LiveMap.useEffect": ()=>{
            const map = mapRef.current;
            if (!mapReady || !map) return;
            map.getSource("journey")?.setData((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$journeyGeo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["journeyGeo"])(activeJourney, from, to));
            journeyTripsRef.current = activeJourney ? new Set(activeJourney.legs.flatMap({
                "LiveMap.useEffect": (l)=>l.type === "transit" ? [
                        l.tripId
                    ] : []
            }["LiveMap.useEffect"])) : null;
            render(progressAt(performance.now()));
        }
    }["LiveMap.useEffect"], [
        mapReady,
        activeJourney,
        from,
        to,
        render
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LiveMap.useEffect": ()=>{
            const map = mapRef.current;
            if (!map) return;
            const points = activeJourney ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$journeyGeo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["journeyPoints"])(activeJourney) : from && to ? [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$journeyGeo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endpointCoords"])(from),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$journeyGeo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endpointCoords"])(to)
            ] : to ? [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$journeyGeo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endpointCoords"])(to)
            ] : [];
            const bounds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$routeGeo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boundsOf"])(points);
            if (!bounds) return;
            const pad = window.innerWidth < 640 ? {
                top: 190,
                bottom: 320,
                left: 40,
                right: 40
            } : {
                top: 60,
                bottom: 60,
                left: 460,
                right: 60
            };
            map.fitBounds(bounds, {
                padding: pad,
                maxZoom: 16,
                duration: 900
            });
        // Alleen bij een andere reis of ander begin/eind opnieuw inzoomen, niet bij elke herplanning.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["LiveMap.useEffect"], [
        selectedJourney,
        planKey,
        toKey
    ]);
    const showVehicle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiveMap.useCallback[showVehicle]": (vehicle)=>{
            mapRef.current?.flyTo({
                center: [
                    vehicle.lng,
                    vehicle.lat
                ],
                zoom: Math.max(mapRef.current.getZoom(), 15),
                duration: 900
            });
        }
    }["LiveMap.useCallback[showVehicle]"], []);
    // Vanuit het vertrekbord: het voertuig van die rit selecteren en ernaartoe gaan.
    const showTrip = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiveMap.useCallback[showTrip]": async (departure)=>{
            let vehicle = [
                ...vehiclesRef.current.values()
            ].find({
                "LiveMap.useCallback[showTrip].vehicle": (v)=>v.tripId === departure.tripId
            }["LiveMap.useCallback[showTrip].vehicle"]);
            if (!vehicle) {
                const res = await fetch(`/api/vehicles?trip=${encodeURIComponent(departure.tripId)}`).catch({
                    "LiveMap.useCallback[showTrip]": ()=>null
                }["LiveMap.useCallback[showTrip]"]);
                const data = res?.ok ? await res.json() : null;
                vehicle = data?.vehicles[0];
            }
            if (!vehicle) return;
            setSelectedStop(null);
            setSelected(vehicle);
            selectedIdRef.current = vehicle.id;
            mapRef.current?.flyTo({
                center: [
                    vehicle.lng,
                    vehicle.lat
                ],
                zoom: Math.max(mapRef.current.getZoom(), 15),
                duration: 900
            });
        }
    }["LiveMap.useCallback[showTrip]"], []);
    const mapCenter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiveMap.useCallback[mapCenter]": ()=>{
            const c = mapRef.current?.getCenter();
            return c ? {
                lat: c.lat,
                lng: c.lng
            } : undefined;
        }
    }["LiveMap.useCallback[mapCenter]"], []);
    const flyToStop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiveMap.useCallback[flyToStop]": (stop)=>{
            setFollow(false);
            mapRef.current?.flyTo({
                center: [
                    stop.lng,
                    stop.lat
                ],
                zoom: Math.max(mapRef.current.getZoom(), 15)
            });
        }
    }["LiveMap.useCallback[flyToStop]"], []);
    const toggleFollow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiveMap.useCallback[toggleFollow]": ()=>{
            setFollow({
                "LiveMap.useCallback[toggleFollow]": (f)=>{
                    const next = !f;
                    if (next && selected) mapRef.current?.easeTo({
                        center: [
                            selected.lng,
                            selected.lat
                        ],
                        zoom: Math.max(mapRef.current.getZoom(), 14)
                    });
                    return next;
                }
            }["LiveMap.useCallback[toggleFollow]"]);
        }
    }["LiveMap.useCallback[toggleFollow]"], [
        selected
    ]);
    const closeSheet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiveMap.useCallback[closeSheet]": ()=>{
            setSelected(null);
            selectedIdRef.current = null;
            setFollow(false);
            render(progressAt(performance.now()));
        }
    }["LiveMap.useCallback[closeSheet]"], [
        render
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative h-dvh w-full overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: containerRef,
                className: "h-full w-full"
            }, void 0, false, {
                fileName: "[project]/src/components/LiveMap.tsx",
                lineNumber: 782,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute inset-x-0 top-0 flex flex-col gap-2 p-3 pr-14 sm:max-w-md sm:pr-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PlannerPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlannerPanel"], {
                        from: from,
                        to: to,
                        time: planTime,
                        locationError: locationError,
                        focusFrom: focusFrom,
                        near: mapCenter,
                        onFrom: chooseFrom,
                        onTo: chooseTo,
                        onUseMyLocation: requestMyLocation,
                        onSwap: swap,
                        onTime: setPlanTime,
                        onUseRoute: applyRoute
                    }, void 0, false, {
                        fileName: "[project]/src/components/LiveMap.tsx",
                        lineNumber: 785,
                        columnNumber: 9
                    }, this),
                    status.state === "error" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$StatusPill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusPill"], {
                        status: status,
                        visibleCount: visibleCount
                    }, void 0, false, {
                        fileName: "[project]/src/components/LiveMap.tsx",
                        lineNumber: 800,
                        columnNumber: 38
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/LiveMap.tsx",
                lineNumber: 784,
                columnNumber: 7
            }, this),
            !selected && !selectedStop && to && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$JourneySheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JourneySheet"], {
                journeys: journeys,
                notice: plan && plan.key === planKey ? plan.notice : undefined,
                loading: !!from && !journeys && !planError,
                error: !from ? locationError ?? "Kies een vertrekpunt (of Mijn locatie)." : planError,
                selected: selectedJourney,
                vehicles: journeyVehicles,
                onSelect: setSelectedJourney,
                onShowVehicle: showVehicle,
                onClose: closePlan,
                routeSaved: !!routeFavorite && isFavorite(routeFavorite),
                onToggleRoute: ()=>routeFavorite && toggleFavorite(routeFavorite)
            }, void 0, false, {
                fileName: "[project]/src/components/LiveMap.tsx",
                lineNumber: 804,
                columnNumber: 9
            }, this),
            !selected && selectedStop && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$StopSheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StopSheet"], {
                stop: selectedStop,
                onClose: ()=>setSelectedStop(null),
                onShowTrip: showTrip,
                onPlanTo: (stop)=>{
                    setSelectedStop(null);
                    chooseTo({
                        kind: "stop",
                        stop
                    });
                },
                onPlanFrom: (stop)=>{
                    setSelectedStop(null);
                    chooseFrom({
                        kind: "stop",
                        stop
                    });
                }
            }, void 0, false, {
                fileName: "[project]/src/components/LiveMap.tsx",
                lineNumber: 820,
                columnNumber: 9
            }, this),
            selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$VehicleSheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VehicleSheet"], {
                vehicle: selected,
                route: activeTripRoute,
                follow: follow,
                onToggleFollow: toggleFollow,
                onClose: closeSheet,
                onStopClick: flyToStop
            }, void 0, false, {
                fileName: "[project]/src/components/LiveMap.tsx",
                lineNumber: 836,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/LiveMap.tsx",
        lineNumber: 780,
        columnNumber: 5
    }, this);
}
_s(LiveMap, "/aDzMeHsGji2lDqFTH/3DGqUkp0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$favorites$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFavorites"]
    ];
});
_c = LiveMap;
var _c;
__turbopack_context__.k.register(_c, "LiveMap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/PlannerPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PlannerPanel",
    ()=>PlannerPanel,
    "endpointName",
    ()=>endpointName
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$favorites$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/favorites.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SearchBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/SearchBox.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function endpointName(ep) {
    if (!ep) return "";
    return ep.kind === "stop" ? ep.stop.name : ep.kind === "place" ? ep.place.name : "Mijn locatie";
}
const endpointKey = (ep)=>!ep ? "leeg" : ep.kind === "stop" ? `s:${ep.stop.id}` : ep.kind === "place" ? `p:${ep.place.id}` : `l:${ep.lat.toFixed(4)},${ep.lng.toFixed(4)}`;
/** Unix-seconden → waarde voor <input type="datetime-local"> in lokale tijd. */ function toLocalInput(unixSec) {
    const d = new Date(unixSec * 1000);
    const pad = (n)=>String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function PlannerPanel({ from, to, time, locationError, focusFrom, near, onFrom, onTo, onUseMyLocation, onSwap, onTime, onUseRoute }) {
    _s();
    const [later, setLater] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(time !== null);
    const { favorites } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$favorites$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFavorites"])();
    const endpointFavs = favorites.filter((f)=>f.kind !== "route");
    const routes = favorites.filter((f)=>f.kind === "route");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pointer-events-auto rounded-2xl bg-white/95 shadow-lg ring-1 ring-black/5 backdrop-blur dark:bg-neutral-900/95 dark:ring-white/10",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SearchBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SearchBox"], {
                        label: "Van",
                        placeholder: "Vertrekpunt",
                        focusToken: from ? undefined : focusFrom,
                        initialText: endpointName(from),
                        offerMyLocation: true,
                        favorites: endpointFavs,
                        near: near,
                        onSelectStop: (stop)=>onFrom({
                                kind: "stop",
                                stop
                            }),
                        onSelectPlace: (place)=>onFrom({
                                kind: "place",
                                place
                            }),
                        onSelectMyLocation: ()=>onUseMyLocation("from"),
                        onClear: ()=>onFrom(null)
                    }, `van-${endpointKey(from)}`, false, {
                        fileName: "[project]/src/components/PlannerPanel.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-3 border-t border-neutral-200 dark:border-neutral-700"
                    }, void 0, false, {
                        fileName: "[project]/src/components/PlannerPanel.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SearchBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SearchBox"], {
                        label: "Naar",
                        placeholder: "Waar wil je heen?",
                        initialText: endpointName(to),
                        offerMyLocation: true,
                        favorites: endpointFavs,
                        near: near,
                        onSelectStop: (stop)=>onTo({
                                kind: "stop",
                                stop
                            }),
                        onSelectPlace: (place)=>onTo({
                                kind: "place",
                                place
                            }),
                        onSelectMyLocation: ()=>onUseMyLocation("to"),
                        onClear: ()=>onTo(null)
                    }, `naar-${endpointKey(to)}`, false, {
                        fileName: "[project]/src/components/PlannerPanel.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onSwap,
                        "aria-label": "Van en naar omwisselen",
                        className: "absolute top-1/2 right-10 z-10 -translate-y-1/2 rounded-full bg-white p-1.5 text-neutral-500 shadow ring-1 ring-black/10 hover:text-neutral-900 dark:bg-neutral-800 dark:ring-white/10 dark:hover:text-white",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            "aria-hidden": true,
                            viewBox: "0 0 20 20",
                            className: "size-4 fill-current",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M6.5 3.25a.75.75 0 0 1 .75.75v9.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V4a.75.75 0 0 1 .75-.75Zm7 0a.75.75 0 0 1 .53.22l3 3a.75.75 0 0 1-1.06 1.06l-1.72-1.72V15a.75.75 0 0 1-1.5 0V5.81l-1.72 1.72a.75.75 0 1 1-1.06-1.06l3-3a.75.75 0 0 1 .53-.22Z"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PlannerPanel.tsx",
                                lineNumber: 86,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/PlannerPanel.tsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/PlannerPanel.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/PlannerPanel.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 border-t border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "w-14 shrink-0 text-xs font-medium text-neutral-500",
                        children: "Wanneer"
                    }, void 0, false, {
                        fileName: "[project]/src/components/PlannerPanel.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex rounded-lg bg-neutral-100 p-0.5 text-xs font-medium dark:bg-neutral-800",
                        children: [
                            {
                                value: false,
                                text: "Nu"
                            },
                            {
                                value: true,
                                text: "Later"
                            }
                        ].map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>{
                                    setLater(opt.value);
                                    onTime(opt.value ? time ?? Math.floor(Date.now() / 1000) + 30 * 60 : null);
                                },
                                className: `rounded-md px-2.5 py-1 ${later === opt.value ? "bg-white shadow-sm dark:bg-neutral-700" : "text-neutral-500"}`,
                                children: opt.text
                            }, opt.text, false, {
                                fileName: "[project]/src/components/PlannerPanel.tsx",
                                lineNumber: 98,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/PlannerPanel.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this),
                    later && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "datetime-local",
                        "aria-label": "Vertrektijd",
                        value: time !== null ? toLocalInput(time) : "",
                        onChange: (e)=>{
                            const t = new Date(e.target.value).getTime();
                            if (Number.isFinite(t)) onTime(Math.floor(t / 1000));
                        },
                        className: "min-w-0 flex-1 rounded-md bg-transparent text-sm outline-none"
                    }, void 0, false, {
                        fileName: "[project]/src/components/PlannerPanel.tsx",
                        lineNumber: 112,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/PlannerPanel.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            locationError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "px-3 pb-2 text-xs text-red-600 dark:text-red-400",
                children: locationError
            }, void 0, false, {
                fileName: "[project]/src/components/PlannerPanel.tsx",
                lineNumber: 124,
                columnNumber: 25
            }, this),
            !to && routes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-1.5 border-t border-neutral-200 px-3 py-2 dark:border-neutral-700",
                children: routes.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>onUseRoute(r),
                        className: "max-w-full truncate rounded-full bg-neutral-100 px-2.5 py-1 text-xs hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700",
                        children: [
                            "★ ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$favorites$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["savedName"])(r.from),
                            " → ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$favorites$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["savedName"])(r.to)
                        ]
                    }, `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$favorites$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["savedName"])(r.from)}>${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$favorites$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["savedName"])(r.to)}`, true, {
                        fileName: "[project]/src/components/PlannerPanel.tsx",
                        lineNumber: 128,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/PlannerPanel.tsx",
                lineNumber: 126,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/PlannerPanel.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(PlannerPanel, "HBeIQ+I5rhj3eXia4eFwVtg82zo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$favorites$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFavorites"]
    ];
});
_c = PlannerPanel;
var _c;
__turbopack_context__.k.register(_c, "PlannerPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/SearchBox.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SearchBox",
    ()=>SearchBox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const PLACE_LABELS = {
    woonplaats: "Plaats",
    weg: "Straat",
    adres: "Adres",
    postcode: "Postcode"
};
const DEBOUNCE_MS = 200;
function SearchBox({ label, placeholder, initialText = "", focusToken, offerMyLocation, favorites, near, onSelectStop, onSelectPlace, onSelectMyLocation, onClear }) {
    _s();
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialText);
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [active, setActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const listId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const inputId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchBox.useEffect": ()=>{
            if (focusToken) inputRef.current?.focus();
        }
    }["SearchBox.useEffect"], [
        focusToken
    ]);
    // De gekozen naam staat in het vak; daar hoeven we niet opnieuw op te zoeken.
    const [chosen, setChosen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialText || null);
    const nearRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(near);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchBox.useEffect": ()=>{
            nearRef.current = near;
        }
    }["SearchBox.useEffect"], [
        near
    ]);
    // Zoeken terwijl je typt (met een korte pauze, en oude verzoeken afbreken).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchBox.useEffect": ()=>{
            const q = query.trim();
            if (q.length < 2 || query === chosen) return;
            const controller = new AbortController();
            const timer = setTimeout({
                "SearchBox.useEffect.timer": ()=>{
                    const params = new URLSearchParams({
                        q
                    });
                    const p = nearRef.current?.();
                    if (p) {
                        params.set("lat", p.lat.toFixed(4));
                        params.set("lng", p.lng.toFixed(4));
                    }
                    setLoading(true);
                    fetch(`/api/search?${params}`, {
                        signal: controller.signal
                    }).then({
                        "SearchBox.useEffect.timer": (res)=>res.ok ? res.json() : null
                    }["SearchBox.useEffect.timer"]).then({
                        "SearchBox.useEffect.timer": (data)=>{
                            if (!data) return;
                            setResults(data);
                            setActive(0);
                        }
                    }["SearchBox.useEffect.timer"]).catch({
                        "SearchBox.useEffect.timer": ()=>{}
                    }["SearchBox.useEffect.timer"]).finally({
                        "SearchBox.useEffect.timer": ()=>!controller.signal.aborted && setLoading(false)
                    }["SearchBox.useEffect.timer"]);
                }
            }["SearchBox.useEffect.timer"], DEBOUNCE_MS);
            return ({
                "SearchBox.useEffect": ()=>{
                    clearTimeout(timer);
                    controller.abort();
                }
            })["SearchBox.useEffect"];
        }
    }["SearchBox.useEffect"], [
        query,
        chosen
    ]);
    const typed = query.trim().length >= 2 && query !== chosen;
    const items = [
        ...offerMyLocation && !typed ? [
            {
                kind: "location"
            }
        ] : [],
        ...!typed ? (favorites ?? []).map((f)=>({
                ...f,
                fav: true
            })) : [],
        ...typed && results ? [
            ...results.stops.map((stop)=>({
                    kind: "stop",
                    stop
                })),
            ...results.places.map((place)=>({
                    kind: "place",
                    place
                }))
        ] : []
    ];
    function choose(item) {
        setOpen(false);
        if (item.kind === "location") {
            setChosen("Mijn locatie");
            setQuery("Mijn locatie");
            onSelectMyLocation?.();
        } else if (item.kind === "stop") {
            setChosen(item.stop.name);
            setQuery(item.stop.name);
            onSelectStop(item.stop);
        } else {
            setChosen(item.place.name);
            setQuery(item.place.name);
            onSelectPlace(item.place);
        }
    }
    function clear() {
        setChosen(null);
        setQuery("");
        setResults(null);
        setOpen(true);
        onClear?.();
    }
    const showList = open && items.length > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 px-3 py-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: inputId,
                        className: "w-14 shrink-0 text-xs font-medium text-neutral-500",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/SearchBox.tsx",
                        lineNumber: 119,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ref: inputRef,
                        id: inputId,
                        value: query,
                        onChange: (e)=>{
                            setQuery(e.target.value);
                            setOpen(true);
                        },
                        onFocus: (e)=>{
                            setOpen(true);
                            // Een gekozen waarde in één keer kunnen overschrijven.
                            if (query === chosen) e.target.select();
                        },
                        onBlur: ()=>setTimeout(()=>setOpen(false), 150),
                        onKeyDown: (e)=>{
                            if (e.key === "ArrowDown") {
                                e.preventDefault();
                                setActive((a)=>Math.min(a + 1, items.length - 1));
                            } else if (e.key === "ArrowUp") {
                                e.preventDefault();
                                setActive((a)=>Math.max(a - 1, 0));
                            } else if (e.key === "Enter" && items[active]) {
                                e.preventDefault();
                                choose(items[active]);
                            } else if (e.key === "Escape") {
                                setOpen(false);
                            }
                        },
                        placeholder: placeholder,
                        role: "combobox",
                        "aria-expanded": showList,
                        "aria-controls": listId,
                        "aria-autocomplete": "list",
                        enterKeyHint: "search",
                        className: `min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-neutral-400 ${query === "Mijn locatie" ? "text-blue-600 dark:text-blue-400" : ""}`
                    }, void 0, false, {
                        fileName: "[project]/src/components/SearchBox.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this),
                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "size-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600"
                    }, void 0, false, {
                        fileName: "[project]/src/components/SearchBox.tsx",
                        lineNumber: 158,
                        columnNumber: 21
                    }, this),
                    query && !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: clear,
                        "aria-label": `${label} wissen`,
                        className: "rounded-full px-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white",
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/src/components/SearchBox.tsx",
                        lineNumber: 160,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/SearchBox.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            showList && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                id: listId,
                role: "listbox",
                className: "absolute inset-x-0 top-full z-20 mt-1 max-h-[55dvh] overflow-y-auto rounded-2xl bg-white py-1.5 shadow-xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10",
                children: items.map((item, i)=>{
                    const prev = items[i - 1];
                    const isFav = item.kind !== "location" && !!item.fav;
                    const prevFav = !!prev && prev.kind !== "location" && !!prev.fav;
                    const heading = isFav ? prevFav ? null : "Favorieten" : item.kind === "stop" && prev?.kind !== "stop" ? "Haltes" : item.kind === "place" && prev?.kind !== "place" ? "Plaatsen" : null;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        role: "presentation",
                        children: [
                            heading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "px-4 pt-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-400",
                                children: heading
                            }, void 0, false, {
                                fileName: "[project]/src/components/SearchBox.tsx",
                                lineNumber: 187,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                role: "option",
                                "aria-selected": i === active,
                                onMouseDown: (e)=>e.preventDefault(),
                                onMouseEnter: ()=>setActive(i),
                                onClick: ()=>choose(item),
                                className: `flex w-full items-center gap-3 px-4 py-2 text-left text-sm ${i === active ? "bg-neutral-100 dark:bg-neutral-800" : ""}`,
                                children: [
                                    item.kind === "location" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LocationIcon, {}, void 0, false, {
                                        fileName: "[project]/src/components/SearchBox.tsx",
                                        lineNumber: 197,
                                        columnNumber: 47
                                    }, this) : item.kind === "stop" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StopIcon, {
                                        stop: item.stop
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SearchBox.tsx",
                                        lineNumber: 197,
                                        columnNumber: 89
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PinIcon, {}, void 0, false, {
                                        fileName: "[project]/src/components/SearchBox.tsx",
                                        lineNumber: 197,
                                        columnNumber: 121
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "min-w-0 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block truncate",
                                                children: item.kind === "location" ? "Mijn locatie" : item.kind === "stop" ? item.stop.name : item.place.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SearchBox.tsx",
                                                lineNumber: 199,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block text-xs text-neutral-500",
                                                children: item.kind === "location" ? "Gebruik waar je nu bent" : item.kind === "stop" ? item.stop.modes.map((m)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODE_LABELS"][m]).join(" · ") : PLACE_LABELS[item.place.type]
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SearchBox.tsx",
                                                lineNumber: 202,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SearchBox.tsx",
                                        lineNumber: 198,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SearchBox.tsx",
                                lineNumber: 188,
                                columnNumber: 17
                            }, this)
                        ]
                    }, item.kind === "location" ? "loc" : item.kind === "stop" ? `s-${item.stop.id}` : `p-${item.place.id}`, true, {
                        fileName: "[project]/src/components/SearchBox.tsx",
                        lineNumber: 186,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/SearchBox.tsx",
                lineNumber: 167,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/SearchBox.tsx",
        lineNumber: 117,
        columnNumber: 5
    }, this);
}
_s(SearchBox, "dRE9dUaDcN2XFKbdQQnrre7/cEQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c = SearchBox;
function StopIcon({ stop }) {
    const color = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODE_COLORS"][stop.modes[0] ?? "other"];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white",
        style: {
            backgroundColor: color
        },
        children: stop.modes[0] === "train" ? "NS" : "H"
    }, void 0, false, {
        fileName: "[project]/src/components/SearchBox.tsx",
        lineNumber: 223,
        columnNumber: 5
    }, this);
}
_c1 = StopIcon;
function PinIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-800",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            "aria-hidden": true,
            viewBox: "0 0 20 20",
            className: "size-4 fill-current",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M10 2a6 6 0 0 0-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 0 0-6-6Zm0 8.25A2.25 2.25 0 1 1 10 5.75a2.25 2.25 0 0 1 0 4.5Z"
            }, void 0, false, {
                fileName: "[project]/src/components/SearchBox.tsx",
                lineNumber: 233,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/SearchBox.tsx",
            lineNumber: 232,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/SearchBox.tsx",
        lineNumber: 231,
        columnNumber: 5
    }, this);
}
_c2 = PinIcon;
function LocationIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            "aria-hidden": true,
            viewBox: "0 0 20 20",
            className: "size-4 fill-current",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M10 1.5a.75.75 0 0 1 .75.75v1.3a6.5 6.5 0 0 1 5.7 5.7h1.3a.75.75 0 0 1 0 1.5h-1.3a6.5 6.5 0 0 1-5.7 5.7v1.3a.75.75 0 0 1-1.5 0v-1.3a6.5 6.5 0 0 1-5.7-5.7h-1.3a.75.75 0 0 1 0-1.5h1.3a6.5 6.5 0 0 1 5.7-5.7v-1.3A.75.75 0 0 1 10 1.5ZM10 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"
            }, void 0, false, {
                fileName: "[project]/src/components/SearchBox.tsx",
                lineNumber: 243,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/SearchBox.tsx",
            lineNumber: 242,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/SearchBox.tsx",
        lineNumber: 241,
        columnNumber: 5
    }, this);
}
_c3 = LocationIcon;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "SearchBox");
__turbopack_context__.k.register(_c1, "StopIcon");
__turbopack_context__.k.register(_c2, "PinIcon");
__turbopack_context__.k.register(_c3, "LocationIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/StatusPill.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StatusPill",
    ()=>StatusPill
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function StatusPill({ status, visibleCount }) {
    _s();
    const [now, setNow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "StatusPill.useState": ()=>Date.now()
    }["StatusPill.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StatusPill.useEffect": ()=>{
            const timer = setInterval({
                "StatusPill.useEffect.timer": ()=>setNow(Date.now())
            }["StatusPill.useEffect.timer"], 1000);
            return ({
                "StatusPill.useEffect": ()=>clearInterval(timer)
            })["StatusPill.useEffect"];
        }
    }["StatusPill.useEffect"], []);
    const base = "pointer-events-auto inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs shadow";
    if (status.state === "loading") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `${base} bg-white/95 text-neutral-600 dark:bg-neutral-900/95 dark:text-neutral-300`,
            children: "Voertuigen laden…"
        }, void 0, false, {
            fileName: "[project]/src/components/StatusPill.tsx",
            lineNumber: 21,
            columnNumber: 12
        }, this);
    }
    if (status.state === "error") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `${base} bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950 dark:text-red-200 dark:ring-red-900`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "size-2 rounded-full bg-red-500"
                }, void 0, false, {
                    fileName: "[project]/src/components/StatusPill.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, this),
                status.message
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/StatusPill.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, this);
    }
    const age = (now - status.updatedAt) / 1000;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${base} bg-white/95 text-neutral-700 dark:bg-neutral-900/95 dark:text-neutral-300`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "relative flex size-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60"
                    }, void 0, false, {
                        fileName: "[project]/src/components/StatusPill.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "relative inline-flex size-2 rounded-full bg-emerald-500"
                    }, void 0, false, {
                        fileName: "[project]/src/components/StatusPill.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/StatusPill.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-medium",
                children: "Live"
            }, void 0, false, {
                fileName: "[project]/src/components/StatusPill.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-neutral-400",
                children: "·"
            }, void 0, false, {
                fileName: "[project]/src/components/StatusPill.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            visibleCount.toLocaleString("nl-NL"),
            " in beeld",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-neutral-400",
                children: "·"
            }, void 0, false, {
                fileName: "[project]/src/components/StatusPill.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAgo"])(age)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/StatusPill.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_s(StatusPill, "2IU6yg86GfAIPaiHfn+vZjj7R4s=");
_c = StatusPill;
var _c;
__turbopack_context__.k.register(_c, "StatusPill");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/StopSheet.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StopSheet",
    ()=>StopSheet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AlertList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AlertList.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$favorites$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/favorites.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
// De backend ververst verwachte tijden eens per minuut.
const REFRESH_MS = 30_000;
function StopSheet({ stop, onClose, onShowTrip, onPlanTo, onPlanFrom }) {
    _s();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [now, setNow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "StopSheet.useState": ()=>Date.now()
    }["StopSheet.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StopSheet.useEffect": ()=>{
            const timer = setInterval({
                "StopSheet.useEffect.timer": ()=>setNow(Date.now())
            }["StopSheet.useEffect.timer"], 15_000);
            return ({
                "StopSheet.useEffect": ()=>clearInterval(timer)
            })["StopSheet.useEffect"];
        }
    }["StopSheet.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StopSheet.useEffect": ()=>{
            let controller = new AbortController();
            const load = {
                "StopSheet.useEffect.load": ()=>{
                    controller.abort();
                    controller = new AbortController();
                    fetch(`/api/stops/${encodeURIComponent(stop.id)}/departures`, {
                        signal: controller.signal
                    }).then({
                        "StopSheet.useEffect.load": (res)=>res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))
                    }["StopSheet.useEffect.load"]).then({
                        "StopSheet.useEffect.load": (d)=>{
                            setData(d);
                            setError(false);
                        }
                    }["StopSheet.useEffect.load"]).catch({
                        "StopSheet.useEffect.load": ()=>!controller.signal.aborted && setError(true)
                    }["StopSheet.useEffect.load"]);
                }
            }["StopSheet.useEffect.load"];
            load();
            const timer = setInterval(load, REFRESH_MS);
            return ({
                "StopSheet.useEffect": ()=>{
                    clearInterval(timer);
                    controller.abort();
                }
            })["StopSheet.useEffect"];
        }
    }["StopSheet.useEffect"], [
        stop.id
    ]);
    const departures = data?.stop.id === stop.id ? data.departures : null;
    const { has, toggle } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$favorites$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFavorites"])();
    const isFav = has({
        kind: "stop",
        stop
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute inset-x-0 bottom-0 p-3 pb-9 sm:left-3 sm:right-auto sm:w-96 sm:pb-3",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            "aria-label": `Vertrektijden ${stop.name}`,
            className: "flex max-h-[60dvh] flex-col rounded-2xl bg-white shadow-xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "flex items-start gap-3 p-4 pb-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0 flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-medium uppercase tracking-wide text-neutral-500",
                                    children: stop.modes.map((m)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODE_LABELS"][m]).join(" · ")
                                }, void 0, false, {
                                    fileName: "[project]/src/components/StopSheet.tsx",
                                    lineNumber: 66,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "truncate text-lg font-semibold leading-tight",
                                    children: stop.name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/StopSheet.tsx",
                                    lineNumber: 69,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/StopSheet.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>toggle({
                                    kind: "stop",
                                    stop
                                }),
                            "aria-label": isFav ? "Verwijder uit favorieten" : "Bewaar als favoriet",
                            "aria-pressed": isFav,
                            className: `-mt-1 rounded-full p-1.5 text-lg leading-none hover:bg-neutral-100 dark:hover:bg-neutral-800 ${isFav ? "text-amber-500" : "text-neutral-400"}`,
                            children: isFav ? "★" : "☆"
                        }, void 0, false, {
                            fileName: "[project]/src/components/StopSheet.tsx",
                            lineNumber: 71,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            "aria-label": "Sluiten",
                            className: "-mr-1 -mt-1 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                "aria-hidden": true,
                                viewBox: "0 0 20 20",
                                className: "size-5 fill-current",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/StopSheet.tsx",
                                    lineNumber: 85,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/StopSheet.tsx",
                                lineNumber: 84,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/StopSheet.tsx",
                            lineNumber: 79,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/StopSheet.tsx",
                    lineNumber: 64,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2 px-4 pb-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>onPlanTo(stop),
                            className: "flex-1 rounded-lg bg-blue-600 py-1.5 text-sm font-medium text-white hover:bg-blue-700",
                            children: "Hierheen"
                        }, void 0, false, {
                            fileName: "[project]/src/components/StopSheet.tsx",
                            lineNumber: 90,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>onPlanFrom(stop),
                            className: "flex-1 rounded-lg bg-neutral-100 py-1.5 text-sm font-medium hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700",
                            children: "Vanaf hier"
                        }, void 0, false, {
                            fileName: "[project]/src/components/StopSheet.tsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/StopSheet.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-h-0 flex-1 overflow-y-auto px-2 pb-3",
                    children: [
                        data?.stop.id === stop.id && data.alerts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-2 pb-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AlertList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertList"], {
                                alerts: data.alerts
                            }, void 0, false, {
                                fileName: "[project]/src/components/StopSheet.tsx",
                                lineNumber: 101,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/StopSheet.tsx",
                            lineNumber: 100,
                            columnNumber: 13
                        }, this),
                        !departures && !error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "px-2 py-3 text-sm text-neutral-500",
                            children: "Vertrektijden laden…"
                        }, void 0, false, {
                            fileName: "[project]/src/components/StopSheet.tsx",
                            lineNumber: 104,
                            columnNumber: 37
                        }, this),
                        error && !departures && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "px-2 py-3 text-sm text-red-600",
                            children: "Vertrektijden konden niet worden geladen."
                        }, void 0, false, {
                            fileName: "[project]/src/components/StopSheet.tsx",
                            lineNumber: 105,
                            columnNumber: 36
                        }, this),
                        departures && departures.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NoService, {
                            next: data?.stop.id === stop.id ? data.next : undefined,
                            now: now
                        }, void 0, false, {
                            fileName: "[project]/src/components/StopSheet.tsx",
                            lineNumber: 107,
                            columnNumber: 13
                        }, this),
                        departures && departures.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                            className: "divide-y divide-neutral-100 dark:divide-neutral-800",
                            children: departures.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DepartureRow, {
                                    departure: d,
                                    now: now,
                                    onShow: ()=>onShowTrip(d)
                                }, `${d.tripId}-${d.scheduled}`, false, {
                                    fileName: "[project]/src/components/StopSheet.tsx",
                                    lineNumber: 112,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/StopSheet.tsx",
                            lineNumber: 110,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/StopSheet.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/StopSheet.tsx",
            lineNumber: 60,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/StopSheet.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
_s(StopSheet, "XFDCB90b/aTrCxXXCf86SHf27+M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$favorites$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFavorites"]
    ];
});
_c = StopSheet;
/** Er rijdt de komende 1,5 uur niets vanaf deze halte: zeg wanneer wel weer. */ function NoService({ next, now }) {
    if (!next) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "px-2 py-3 text-sm text-neutral-500",
            children: "Er vertrekt vanaf deze halte de komende 30 uur niets volgens de dienstregeling."
        }, void 0, false, {
            fileName: "[project]/src/components/StopSheet.tsx",
            lineNumber: 125,
            columnNumber: 12
        }, this);
    }
    const day = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dayLabel"])(next.scheduled, now);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mx-2 my-2 rounded-xl bg-indigo-50 px-3 py-2.5 text-sm text-indigo-900 dark:bg-indigo-950 dark:text-indigo-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-medium",
                children: "🌙 Er rijdt nu niets meer vanaf deze halte."
            }, void 0, false, {
                fileName: "[project]/src/components/StopSheet.tsx",
                lineNumber: 130,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1",
                children: [
                    "Eerste vertrek: ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-semibold",
                        children: [
                            day ? `${day} ` : "",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatClock"])(next.scheduled)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/StopSheet.tsx",
                        lineNumber: 132,
                        columnNumber: 25
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-1.5 inline-flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rounded px-1.5 py-px text-xs font-bold text-white",
                                style: {
                                    backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODE_COLORS"][next.mode]
                                },
                                children: next.line ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODE_LABELS"][next.mode]
                            }, void 0, false, {
                                fileName: "[project]/src/components/StopSheet.tsx",
                                lineNumber: 134,
                                columnNumber: 11
                            }, this),
                            "→ ",
                            next.headsign
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/StopSheet.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/StopSheet.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/StopSheet.tsx",
        lineNumber: 129,
        columnNumber: 5
    }, this);
}
_c1 = NoService;
function DepartureRow({ departure: d, now, onShow }) {
    const time = d.expected ?? d.scheduled;
    const minutes = Math.round((time - now / 1000) / 60);
    const gone = d.canceled || d.skipped;
    const tone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["delayTone"])(d.delay);
    const delayed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["delayMinutes"])(d.delay) !== 0;
    const platformLabel = d.platform ? `${d.mode === "train" ? "Spoor" : "Perron"} ${d.platform}${d.platformChanged ? " (gewijzigd)" : ""}` : undefined;
    const content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "flex h-7 min-w-10 shrink-0 items-center justify-center rounded-md px-1.5 text-xs font-bold text-white",
                style: {
                    backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODE_COLORS"][d.mode],
                    opacity: gone ? 0.4 : 1
                },
                children: d.line ?? "?"
            }, void 0, false, {
                fileName: "[project]/src/components/StopSheet.tsx",
                lineNumber: 154,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "min-w-0 flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `block truncate text-sm font-medium ${gone ? "text-neutral-400 line-through" : ""}`,
                        children: d.headsign ?? "Onbekend"
                    }, void 0, false, {
                        fileName: "[project]/src/components/StopSheet.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "block truncate text-xs text-neutral-500",
                        children: d.canceled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-red-600 dark:text-red-400",
                            children: "Rijdt niet"
                        }, void 0, false, {
                            fileName: "[project]/src/components/StopSheet.tsx",
                            lineNumber: 164,
                            columnNumber: 13
                        }, this) : d.skipped ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-red-600 dark:text-red-400",
                            children: "Stopt hier niet"
                        }, void 0, false, {
                            fileName: "[project]/src/components/StopSheet.tsx",
                            lineNumber: 166,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                [
                                    platformLabel,
                                    d.live ? "● live" : undefined
                                ].filter(Boolean).join(" · "),
                                d.last && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "ml-1.5 rounded bg-indigo-50 px-1 py-px font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
                                    children: "🌙 laatste rit"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/StopSheet.tsx",
                                    lineNumber: 171,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/StopSheet.tsx",
                            lineNumber: 168,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/StopSheet.tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/StopSheet.tsx",
                lineNumber: 160,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "shrink-0 text-right tabular-nums",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `block text-sm font-semibold ${gone ? "text-neutral-400 line-through" : delayed ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DELAY_TONE_CLASSES"][tone] : ""}`,
                        children: minutes <= 0 ? "nu" : minutes < 60 ? `${minutes} min` : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatClock"])(time)
                    }, void 0, false, {
                        fileName: "[project]/src/components/StopSheet.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "block text-xs text-neutral-500",
                        children: [
                            delayed && !gone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mr-1 line-through",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatClock"])(d.scheduled)
                            }, void 0, false, {
                                fileName: "[project]/src/components/StopSheet.tsx",
                                lineNumber: 184,
                                columnNumber: 32
                            }, this),
                            minutes < 60 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatClock"])(time) : "",
                            delayed && !gone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `ml-1 ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DELAY_TONE_CLASSES"][tone]}`,
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDelay"])(d.delay)
                            }, void 0, false, {
                                fileName: "[project]/src/components/StopSheet.tsx",
                                lineNumber: 186,
                                columnNumber: 32
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/StopSheet.tsx",
                        lineNumber: 183,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/StopSheet.tsx",
                lineNumber: 179,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/StopSheet.tsx",
        lineNumber: 153,
        columnNumber: 5
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        children: d.live && !gone ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onShow,
            className: "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800",
            children: content
        }, void 0, false, {
            fileName: "[project]/src/components/StopSheet.tsx",
            lineNumber: 195,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-3 px-2 py-2",
            children: content
        }, void 0, false, {
            fileName: "[project]/src/components/StopSheet.tsx",
            lineNumber: 199,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/StopSheet.tsx",
        lineNumber: 193,
        columnNumber: 5
    }, this);
}
_c2 = DepartureRow;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "StopSheet");
__turbopack_context__.k.register(_c1, "NoService");
__turbopack_context__.k.register(_c2, "DepartureRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/VehicleSheet.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VehicleSheet",
    ()=>VehicleSheet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$routeGeo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/routeGeo.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$useTripTimes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/useTripTimes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function VehicleSheet({ vehicle, route, follow, onToggleFollow, onClose, onStopClick }) {
    _s();
    const [now, setNow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "VehicleSheet.useState": ()=>Date.now()
    }["VehicleSheet.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VehicleSheet.useEffect": ()=>{
            const timer = setInterval({
                "VehicleSheet.useEffect.timer": ()=>setNow(Date.now())
            }["VehicleSheet.useEffect.timer"], 1000);
            return ({
                "VehicleSheet.useEffect": ()=>clearInterval(timer)
            })["VehicleSheet.useEffect"];
        }
    }["VehicleSheet.useEffect"], []);
    const times = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$useTripTimes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTripTimes"])(vehicle.tripId);
    const age = vehicle.timestamp ? now / 1000 - vehicle.timestamp : undefined;
    const color = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODE_COLORS"][vehicle.mode];
    const isTrain = vehicle.mode === "train";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute inset-x-0 bottom-0 p-3 pb-9 sm:left-3 sm:right-auto sm:w-96 sm:pb-3",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            "aria-label": "Voertuiggegevens",
            className: "max-h-[70dvh] overflow-y-auto rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex h-11 min-w-11 shrink-0 items-center justify-center rounded-xl px-2 text-lg font-bold text-white",
                            style: {
                                backgroundColor: color
                            },
                            children: vehicle.line ?? "?"
                        }, void 0, false, {
                            fileName: "[project]/src/components/VehicleSheet.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0 flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-medium uppercase tracking-wide",
                                    style: {
                                        color
                                    },
                                    children: [
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODE_LABELS"][vehicle.mode],
                                        " · ",
                                        vehicle.agencyName ?? vehicle.operator
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/VehicleSheet.tsx",
                                    lineNumber: 55,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "truncate text-lg font-semibold leading-tight",
                                    children: vehicle.headsign ? `→ ${vehicle.headsign}` : "Bestemming onbekend"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/VehicleSheet.tsx",
                                    lineNumber: 58,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Punctuality, {
                                    delay: vehicle.delay,
                                    canceled: times?.canceled
                                }, void 0, false, {
                                    fileName: "[project]/src/components/VehicleSheet.tsx",
                                    lineNumber: 61,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/VehicleSheet.tsx",
                            lineNumber: 54,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            "aria-label": "Sluiten",
                            className: "-mr-1 -mt-1 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                "aria-hidden": true,
                                viewBox: "0 0 20 20",
                                className: "size-5 fill-current",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/VehicleSheet.tsx",
                                    lineNumber: 69,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/VehicleSheet.tsx",
                                lineNumber: 68,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/VehicleSheet.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/VehicleSheet.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                    className: "mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                            className: "text-neutral-500",
                            children: "Status"
                        }, void 0, false, {
                            fileName: "[project]/src/components/VehicleSheet.tsx",
                            lineNumber: 75,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                            children: (vehicle.status && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STATUS_LABELS"][vehicle.status]) ?? "Onbekend"
                        }, void 0, false, {
                            fileName: "[project]/src/components/VehicleSheet.tsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                            className: "text-neutral-500",
                            children: "Laatste positie"
                        }, void 0, false, {
                            fileName: "[project]/src/components/VehicleSheet.tsx",
                            lineNumber: 77,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                            className: age && age > 300 ? "text-amber-600" : undefined,
                            children: age !== undefined ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAgo"])(age) : "Onbekend"
                        }, void 0, false, {
                            fileName: "[project]/src/components/VehicleSheet.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this),
                        vehicle.vehicleNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                    className: "text-neutral-500",
                                    children: isTrain ? "Treinnummer" : "Wagennummer"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/VehicleSheet.tsx",
                                    lineNumber: 81,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                    children: vehicle.vehicleNumber
                                }, void 0, false, {
                                    fileName: "[project]/src/components/VehicleSheet.tsx",
                                    lineNumber: 82,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/VehicleSheet.tsx",
                            lineNumber: 80,
                            columnNumber: 13
                        }, this),
                        isTrain && vehicle.speed !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                    className: "text-neutral-500",
                                    children: "Snelheid"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/VehicleSheet.tsx",
                                    lineNumber: 88,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                    children: [
                                        Math.round(vehicle.speed * 3.6),
                                        " km/u"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/VehicleSheet.tsx",
                                    lineNumber: 89,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/VehicleSheet.tsx",
                            lineNumber: 87,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/VehicleSheet.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this),
                route?.approximate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-3 rounded-lg bg-neutral-100 px-3 py-2 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
                    children: [
                        "Route bij benadering: ",
                        vehicle.agencyName ?? "deze vervoerder",
                        " levert alleen rechte lijnen tussen de haltes. Het voertuig verspringt daarom alleen bij nieuwe posities."
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/VehicleSheet.tsx",
                    lineNumber: 95,
                    columnNumber: 11
                }, this),
                route && route.stops.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NextStops, {
                    vehicle: vehicle,
                    route: route,
                    times: times,
                    color: color,
                    now: now,
                    onStopClick: onStopClick
                }, void 0, false, {
                    fileName: "[project]/src/components/VehicleSheet.tsx",
                    lineNumber: 101,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onToggleFollow,
                    className: `mt-4 w-full rounded-xl py-2.5 text-sm font-medium transition ${follow ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"}`,
                    children: follow ? "Volgen aan: kaart beweegt mee" : "Volg dit voertuig"
                }, void 0, false, {
                    fileName: "[project]/src/components/VehicleSheet.tsx",
                    lineNumber: 104,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/VehicleSheet.tsx",
            lineNumber: 43,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/VehicleSheet.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_s(VehicleSheet, "Ipu7iSi77RMA81O/ZUaQR5bF7Uw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$useTripTimes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTripTimes"]
    ];
});
_c = VehicleSheet;
/** "🟢 Op tijd", "🟠 +3 min", "🔴 +12 min", "Rijdt 2 min te vroeg" of "Uitgevallen". */ function Punctuality({ delay, canceled }) {
    if (canceled) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "mt-0.5 text-sm font-medium text-red-600 dark:text-red-400",
            children: "Rit uitgevallen"
        }, void 0, false, {
            fileName: "[project]/src/components/VehicleSheet.tsx",
            lineNumber: 122,
            columnNumber: 12
        }, this);
    }
    if (delay === undefined) return null;
    const min = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["delayMinutes"])(delay);
    const tone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["delayTone"])(delay);
    const dot = {
        ok: "bg-emerald-500",
        late: "bg-amber-500",
        veryLate: "bg-red-500"
    }[tone];
    const text = min > 0 ? `+${min} min vertraging` : min < 0 ? `Rijdt ${-min} min te vroeg` : "Op tijd";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: `mt-0.5 flex items-center gap-1.5 text-sm font-medium ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DELAY_TONE_CLASSES"][tone]}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `size-2 rounded-full ${dot}`,
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/VehicleSheet.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this),
            text
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/VehicleSheet.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
_c1 = Punctuality;
const COLLAPSED_STOPS = 4;
function NextStops({ vehicle, route, times, color, now, onStopClick }) {
    _s1();
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const upcoming = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$routeGeo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["upcomingStops"])(route, vehicle);
    const shown = expanded ? upcoming : upcoming.slice(0, COLLAPSED_STOPS);
    const atStop = vehicle.status === "STOPPED_AT";
    const timeBySeq = new Map(times?.stops.map((t)=>[
            t.sequence,
            t
        ]));
    // De eerste halte waar de rit echt langskomt is "volgende halte" (overgeslagen haltes tellen niet).
    const nextSeq = upcoming.find((s)=>!timeBySeq.get(s.sequence)?.skipped)?.sequence;
    if (upcoming.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "mt-4 text-sm text-neutral-500",
            children: "Eindhalte bereikt"
        }, void 0, false, {
            fileName: "[project]/src/components/VehicleSheet.tsx",
            lineNumber: 163,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mt-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-1 flex items-baseline justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xs font-medium uppercase tracking-wide text-neutral-500",
                        children: "Volgende haltes"
                    }, void 0, false, {
                        fileName: "[project]/src/components/VehicleSheet.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    times && !times.realtime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-neutral-400",
                        children: "geplande tijden"
                    }, void 0, false, {
                        fileName: "[project]/src/components/VehicleSheet.tsx",
                        lineNumber: 170,
                        columnNumber: 38
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/VehicleSheet.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                className: expanded ? "max-h-64 overflow-y-auto pr-1" : undefined,
                children: shown.map((stop, i)=>{
                    const isFirst = i === 0;
                    const isLast = stop === upcoming[upcoming.length - 1];
                    const isNext = stop.sequence === nextSeq;
                    const t = timeBySeq.get(stop.sequence);
                    const skipped = !!t?.skipped;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "relative flex",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "relative flex w-5 shrink-0 justify-center",
                                "aria-hidden": true,
                                children: [
                                    !isLast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute top-3 bottom-0 w-0.5",
                                        style: {
                                            backgroundColor: color,
                                            opacity: 0.35
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/VehicleSheet.tsx",
                                        lineNumber: 183,
                                        columnNumber: 29
                                    }, this),
                                    !isFirst && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute top-0 h-3 w-0.5",
                                        style: {
                                            backgroundColor: color,
                                            opacity: 0.35
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/VehicleSheet.tsx",
                                        lineNumber: 184,
                                        columnNumber: 30
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "relative mt-1.5 size-3 rounded-full border-2 bg-white dark:bg-neutral-900",
                                        style: {
                                            borderColor: skipped ? "#9ca3af" : color,
                                            backgroundColor: isNext ? color : undefined
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/VehicleSheet.tsx",
                                        lineNumber: 185,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/VehicleSheet.tsx",
                                lineNumber: 182,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onStopClick(stop),
                                className: "-my-0.5 ml-1 flex min-w-0 flex-1 items-start gap-2 rounded-md px-1.5 py-1 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "min-w-0 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `block truncate ${isNext ? "font-semibold" : ""} ${skipped ? "text-neutral-400 line-through" : ""}`,
                                                children: stop.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/VehicleSheet.tsx",
                                                lineNumber: 198,
                                                columnNumber: 19
                                            }, this),
                                            skipped ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block text-xs text-red-600 dark:text-red-400",
                                                children: "Rijdt niet via deze halte"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/VehicleSheet.tsx",
                                                lineNumber: 202,
                                                columnNumber: 21
                                            }, this) : isNext && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block text-xs text-neutral-500",
                                                children: atStop ? "Staat nu hier" : "Volgende halte"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/VehicleSheet.tsx",
                                                lineNumber: 204,
                                                columnNumber: 31
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/VehicleSheet.tsx",
                                        lineNumber: 197,
                                        columnNumber: 17
                                    }, this),
                                    t && !skipped && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StopClock, {
                                        time: t,
                                        now: now,
                                        showCountdown: isNext
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/VehicleSheet.tsx",
                                        lineNumber: 207,
                                        columnNumber: 35
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/VehicleSheet.tsx",
                                lineNumber: 193,
                                columnNumber: 15
                            }, this)
                        ]
                    }, `${stop.sequence}-${stop.id}`, true, {
                        fileName: "[project]/src/components/VehicleSheet.tsx",
                        lineNumber: 180,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/VehicleSheet.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, this),
            upcoming.length > COLLAPSED_STOPS && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setExpanded((e)=>!e),
                className: "mt-1 ml-6 text-xs font-medium hover:underline",
                style: {
                    color
                },
                children: expanded ? "Minder tonen" : `Alle ${upcoming.length} haltes tonen`
            }, void 0, false, {
                fileName: "[project]/src/components/VehicleSheet.tsx",
                lineNumber: 214,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/VehicleSheet.tsx",
        lineNumber: 167,
        columnNumber: 5
    }, this);
}
_s1(NextStops, "DuL5jiiQQFgbn7gBKAyxwS/H4Ek=");
_c2 = NextStops;
/** Rechts in de haltelijst: verwachte tijd, eventueel doorgestreepte geplande tijd en vertraging. */ function StopClock({ time, now, showCountdown }) {
    const { time: shown, scheduled } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$useTripTimes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["displayTime"])(time);
    if (shown === undefined) return null;
    const min = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["delayMinutes"])(time.delay);
    const tone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["delayTone"])(time.delay);
    const minutesAway = Math.round((shown - now / 1000) / 60);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "shrink-0 text-right tabular-nums",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "block",
                children: [
                    min !== 0 && scheduled !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mr-1 text-xs text-neutral-400 line-through",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatClock"])(scheduled)
                    }, void 0, false, {
                        fileName: "[project]/src/components/VehicleSheet.tsx",
                        lineNumber: 234,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: min !== 0 ? `font-medium ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DELAY_TONE_CLASSES"][tone]}` : undefined,
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatClock"])(shown)
                    }, void 0, false, {
                        fileName: "[project]/src/components/VehicleSheet.tsx",
                        lineNumber: 236,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/VehicleSheet.tsx",
                lineNumber: 232,
                columnNumber: 7
            }, this),
            showCountdown ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "block text-xs text-neutral-500",
                children: minutesAway <= 0 ? "nu" : `over ${minutesAway} min`
            }, void 0, false, {
                fileName: "[project]/src/components/VehicleSheet.tsx",
                lineNumber: 239,
                columnNumber: 9
            }, this) : min !== 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `block text-xs ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DELAY_TONE_CLASSES"][tone]}`,
                children: [
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDelay"])(time.delay),
                    " min"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/VehicleSheet.tsx",
                lineNumber: 241,
                columnNumber: 22
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/VehicleSheet.tsx",
        lineNumber: 231,
        columnNumber: 5
    }, this);
}
_c3 = StopClock;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "VehicleSheet");
__turbopack_context__.k.register(_c1, "Punctuality");
__turbopack_context__.k.register(_c2, "NextStops");
__turbopack_context__.k.register(_c3, "StopClock");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/favorites.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "favoriteKey",
    ()=>favoriteKey,
    "savedName",
    ()=>savedName,
    "toSaved",
    ()=>toSaved,
    "useFavorites",
    ()=>useFavorites
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const KEY = "live-ov:favorites";
const EVENT = "live-ov:favorites";
function read() {
    try {
        return localStorage.getItem(KEY) ?? "[]";
    } catch  {
        return "[]";
    }
}
function write(list) {
    try {
        localStorage.setItem(KEY, JSON.stringify(list));
    } catch  {
    // privévenster of opslag vol: favorieten gelden dan alleen voor deze sessie niet
    }
    window.dispatchEvent(new Event(EVENT));
}
function subscribe(onChange) {
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange); // wijzigingen in een ander tabblad
    return ()=>{
        window.removeEventListener(EVENT, onChange);
        window.removeEventListener("storage", onChange);
    };
}
let cachedRaw = "";
let cachedList = [];
function snapshot() {
    const raw = read();
    if (raw !== cachedRaw) {
        cachedRaw = raw;
        try {
            cachedList = JSON.parse(raw);
        } catch  {
            cachedList = [];
        }
    }
    return cachedList;
}
const EMPTY = [];
function toSaved(ep) {
    return ep.kind === "location" ? {
        kind: "location"
    } : ep;
}
const savedName = (ep)=>ep.kind === "stop" ? ep.stop.name : ep.kind === "place" ? ep.place.name : "Mijn locatie";
const savedKey = (ep)=>ep.kind === "stop" ? `s:${ep.stop.id}` : ep.kind === "place" ? `p:${ep.place.id}` : "loc";
const favoriteKey = (f)=>f.kind === "stop" ? `s:${f.stop.id}` : f.kind === "place" ? `p:${f.place.id}` : `r:${savedKey(f.from)}>${savedKey(f.to)}`;
function useFavorites() {
    _s();
    const favorites = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, snapshot, {
        "useFavorites.useSyncExternalStore[favorites]": ()=>EMPTY
    }["useFavorites.useSyncExternalStore[favorites]"]);
    const toggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFavorites.useCallback[toggle]": (fav)=>{
            const list = snapshot();
            const key = favoriteKey(fav);
            write(list.some({
                "useFavorites.useCallback[toggle]": (f)=>favoriteKey(f) === key
            }["useFavorites.useCallback[toggle]"]) ? list.filter({
                "useFavorites.useCallback[toggle]": (f)=>favoriteKey(f) !== key
            }["useFavorites.useCallback[toggle]"]) : [
                fav,
                ...list
            ]);
        }
    }["useFavorites.useCallback[toggle]"], []);
    const has = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFavorites.useCallback[has]": (fav)=>favorites.some({
                "useFavorites.useCallback[has]": (f)=>favoriteKey(f) === favoriteKey(fav)
            }["useFavorites.useCallback[has]"])
    }["useFavorites.useCallback[has]"], [
        favorites
    ]);
    return {
        favorites,
        toggle,
        has
    };
}
_s(useFavorites, "575kzA+VIFEw2LnKt+upDcPk3tM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/format.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELAY_TONE_CLASSES",
    ()=>DELAY_TONE_CLASSES,
    "MODE_COLORS",
    ()=>MODE_COLORS,
    "MODE_LABELS",
    ()=>MODE_LABELS,
    "STALE_AFTER_SECONDS",
    ()=>STALE_AFTER_SECONDS,
    "STATUS_LABELS",
    ()=>STATUS_LABELS,
    "dayLabel",
    ()=>dayLabel,
    "delayMinutes",
    ()=>delayMinutes,
    "delayTone",
    ()=>delayTone,
    "formatAgo",
    ()=>formatAgo,
    "formatClock",
    ()=>formatClock,
    "formatDelay",
    ()=>formatDelay
]);
const MODE_COLORS = {
    bus: "#2563eb",
    tram: "#16a34a",
    metro: "#db2777",
    train: "#ca8a04",
    ferry: "#0891b2",
    other: "#6b7280"
};
const MODE_LABELS = {
    bus: "Bus",
    tram: "Tram",
    metro: "Metro",
    train: "Trein",
    ferry: "Veerboot",
    other: "Onbekend"
};
const STATUS_LABELS = {
    STOPPED_AT: "Staat bij een halte",
    IN_TRANSIT_TO: "Onderweg naar de volgende halte",
    INCOMING_AT: "Komt aan bij een halte"
};
const STALE_AFTER_SECONDS = 5 * 60;
function formatAgo(seconds) {
    if (seconds < 5) return "zojuist";
    if (seconds < 60) return `${Math.round(seconds)} s geleden`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} min geleden`;
    return `${Math.round(seconds / 3600)} uur geleden`;
}
function formatClock(unixSec) {
    return new Date(unixSec * 1000).toLocaleTimeString("nl-NL", {
        hour: "2-digit",
        minute: "2-digit"
    });
}
function delayMinutes(delaySec) {
    return delaySec === undefined ? 0 : Math.round(delaySec / 60);
}
function delayTone(delaySec) {
    const min = delayMinutes(delaySec);
    if (min >= 5) return "veryLate";
    if (min >= 2) return "late";
    return "ok";
}
const DELAY_TONE_CLASSES = {
    ok: "text-emerald-600 dark:text-emerald-400",
    late: "text-amber-600 dark:text-amber-400",
    veryLate: "text-red-600 dark:text-red-400"
};
function formatDelay(delaySec) {
    const min = delayMinutes(delaySec);
    if (min > 0) return `+${min}`;
    if (min < 0) return `−${-min}`;
    return "";
}
function dayLabel(unixSec, nowMs = Date.now()) {
    const key = (d)=>`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const day = new Date(unixSec * 1000);
    const today = new Date(nowMs);
    if (key(day) === key(today)) return "";
    const tomorrow = new Date(nowMs + 86_400_000);
    if (key(day) === key(tomorrow)) return "morgen";
    return day.toLocaleDateString("nl-NL", {
        weekday: "short",
        day: "numeric",
        month: "short"
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/journeyGeo.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "endpointCoords",
    ()=>endpointCoords,
    "endpointParams",
    ()=>endpointParams,
    "journeyGeo",
    ()=>journeyGeo,
    "journeyPoints",
    ()=>journeyPoints
]);
function endpointCoords(ep) {
    return ep.kind === "stop" ? [
        ep.stop.lng,
        ep.stop.lat
    ] : ep.kind === "place" ? [
        ep.place.lng,
        ep.place.lat
    ] : [
        ep.lng,
        ep.lat
    ];
}
function endpointParams(prefix, ep) {
    if (ep.kind === "stop") return {
        [`${prefix}Stop`]: ep.stop.id
    };
    const [lng, lat] = endpointCoords(ep);
    const name = ep.kind === "place" ? ep.place.name : "Mijn locatie";
    return {
        [`${prefix}Lat`]: lat.toFixed(6),
        [`${prefix}Lng`]: lng.toFixed(6),
        [`${prefix}Name`]: name
    };
}
function journeyGeo(journey, from, to) {
    const features = [];
    for (const leg of journey?.legs ?? []){
        if (leg.type === "walk") {
            features.push({
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: [
                        [
                            leg.from.lng,
                            leg.from.lat
                        ],
                        [
                            leg.to.lng,
                            leg.to.lat
                        ]
                    ]
                },
                properties: {
                    kind: "walk"
                }
            });
        } else {
            features.push({
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: leg.path
                },
                properties: {
                    kind: "transit",
                    mode: leg.mode
                }
            });
            for (const p of [
                leg.from,
                leg.to
            ]){
                features.push({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [
                            p.lng,
                            p.lat
                        ]
                    },
                    properties: {
                        kind: "stop",
                        mode: leg.mode,
                        name: p.name
                    }
                });
            }
        }
    }
    if (from) features.push({
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: endpointCoords(from)
        },
        properties: {
            kind: "from"
        }
    });
    if (to) features.push({
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: endpointCoords(to)
        },
        properties: {
            kind: "to"
        }
    });
    return {
        type: "FeatureCollection",
        features
    };
}
function journeyPoints(journey) {
    return journey.legs.flatMap((l)=>l.type === "walk" ? [
            [
                l.from.lng,
                l.from.lat
            ],
            [
                l.to.lng,
                l.to.lat
            ]
        ] : l.path);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/motion.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "continueFrom",
    ()=>continueFrom,
    "isMoving",
    ()=>isMoving,
    "makeMotion",
    ()=>makeMotion,
    "positionAt",
    ()=>positionAt,
    "predicted",
    ()=>predicted
]);
const M_LAT = 111_320;
const M_LNG = 111_320 * Math.cos(52 * Math.PI / 180);
/** Grotere correcties (bv. ander voertuig met hetzelfde ID) niet animeren maar gewoon verspringen. */ const MAX_CORRECTION_DEG = 0.02;
function makeMotion(v) {
    const motion = {
        base: [
            v.lng,
            v.lat
        ],
        corr: [
            0,
            0
        ]
    };
    if (v.path && v.path.length > 1 && v.speed && v.timestamp) {
        const cum = [
            0
        ];
        for(let i = 1; i < v.path.length; i++){
            const dx = (v.path[i][0] - v.path[i - 1][0]) * M_LNG;
            const dy = (v.path[i][1] - v.path[i - 1][1]) * M_LAT;
            cum.push(cum[i - 1] + Math.hypot(dx, dy));
        }
        Object.assign(motion, {
            path: v.path,
            cum,
            speed: v.speed,
            t0: v.timestamp * 1000
        });
    }
    return motion;
}
function predicted(m, now) {
    if (!m.path || !m.cum || !m.speed || m.t0 === undefined) return m.base;
    const total = m.cum[m.cum.length - 1];
    const d = Math.min(Math.max(m.speed * (now - m.t0) / 1000, 0), total);
    let i = 1;
    while(i < m.cum.length - 1 && m.cum[i] < d)i++;
    const seg = m.cum[i] - m.cum[i - 1];
    const t = seg ? (d - m.cum[i - 1]) / seg : 0;
    const [a, b] = [
        m.path[i - 1],
        m.path[i]
    ];
    return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t
    ];
}
const easeOut = (t)=>1 - (1 - t) ** 3;
function positionAt(m, now, progress) {
    const [lng, lat] = predicted(m, now);
    const k = 1 - easeOut(progress);
    return [
        lng + m.corr[0] * k,
        lat + m.corr[1] * k
    ];
}
function continueFrom(next, displayed, now) {
    const [lng, lat] = predicted(next, now);
    const corr = [
        displayed[0] - lng,
        displayed[1] - lat
    ];
    if (Math.abs(corr[0]) > MAX_CORRECTION_DEG || Math.abs(corr[1]) > MAX_CORRECTION_DEG) return next;
    return {
        ...next,
        corr
    };
}
const isMoving = (m)=>!!m.path;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/routeGeo.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "boundsOf",
    ()=>boundsOf,
    "lineRoutesGeo",
    ()=>lineRoutesGeo,
    "tripRouteGeo",
    ()=>tripRouteGeo,
    "upcomingStops",
    ()=>upcomingStops
]);
// Op NL-breedte is een lengtegraad ~0,6× zo lang als een breedtegraad; genoeg voor "dichtstbijzijnde punt".
const LNG_SCALE = Math.cos(52 * Math.PI / 180);
const MAX_OFF_ROUTE_M = 80;
function distanceM(a, b) {
    return Math.hypot((a[0] - b[0]) * LNG_SCALE, a[1] - b[1]) * 111_320;
}
function nearestIndex(shape, [lng, lat]) {
    let best = 0;
    let bestDist = Infinity;
    for(let i = 0; i < shape.length; i++){
        const dx = (shape[i][0] - lng) * LNG_SCALE;
        const dy = shape[i][1] - lat;
        const d = dx * dx + dy * dy;
        if (d < bestDist) {
            bestDist = d;
            best = i;
        }
    }
    return best;
}
/**
 * Is de halte al gepasseerd? OVapi volgt KV6 i.p.v. de GTFS-spec: bij STOPPED_AT staat het voertuig bij
 * currentStopSequence, maar bij IN_TRANSIT_TO is dat de halte waar het net vertrokken is.
 */ function isPassed(stop, vehicle) {
    const current = vehicle?.currentStopSequence;
    if (current === undefined) return false;
    return stop.sequence < current || stop.sequence === current && vehicle?.status !== "STOPPED_AT";
}
function tripRouteGeo(route, vehicle) {
    const mode = vehicle?.mode ?? "other";
    const approximate = route.approximate;
    const lines = [];
    if (route.shape && route.shape.length > 1) {
        if (vehicle) {
            // Route splitsen bij het voertuig: gereden deel grijs, nog te rijden deel in kleur.
            const pos = [
                vehicle.lng,
                vehicle.lat
            ];
            const i = nearestIndex(route.shape, pos);
            // Staat het voertuig (nog) niet op de route, bv. aan het eind van de vorige rit? Dan geen
            // verbindingslijntje naar het voertuig tekenen, want dat loopt dwars door de bebouwing.
            const onRoute = distanceM(route.shape[i], pos) <= MAX_OFF_ROUTE_M;
            const passed = onRoute ? [
                ...route.shape.slice(0, i + 1),
                pos
            ] : route.shape.slice(0, i + 1);
            const upcoming = onRoute ? [
                pos,
                ...route.shape.slice(i + 1)
            ] : route.shape.slice(i);
            if (passed.length > 1) lines.push(line(passed, {
                passed: true,
                mode,
                approximate
            }));
            if (upcoming.length > 1) lines.push(line(upcoming, {
                passed: false,
                mode,
                approximate
            }));
        } else {
            lines.push(line(route.shape, {
                passed: false,
                mode,
                approximate
            }));
        }
    }
    const stops = route.stops.map((s)=>({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [
                    s.lng,
                    s.lat
                ]
            },
            properties: {
                name: s.name,
                passed: isPassed(s, vehicle),
                mode
            }
        }));
    return {
        lines: {
            type: "FeatureCollection",
            features: lines
        },
        stops: {
            type: "FeatureCollection",
            features: stops
        }
    };
}
function lineRoutesGeo(variants) {
    return {
        lines: {
            type: "FeatureCollection",
            features: variants.map((v)=>line(v.shape, {
                    passed: false,
                    mode: v.mode,
                    approximate: v.approximate
                }))
        },
        stops: {
            type: "FeatureCollection",
            features: []
        }
    };
}
function upcomingStops(route, vehicle) {
    return route.stops.filter((s)=>!isPassed(s, vehicle));
}
function boundsOf(points) {
    if (!points.length) return null;
    let [minLng, minLat] = points[0];
    let [maxLng, maxLat] = points[0];
    for (const [lng, lat] of points){
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
    }
    return [
        [
            minLng,
            minLat
        ],
        [
            maxLng,
            maxLat
        ]
    ];
}
function line(coordinates, properties) {
    return {
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates
        },
        properties
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/useTripTimes.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "displayTime",
    ()=>displayTime,
    "useTripTimes",
    ()=>useTripTimes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
// De backend haalt verwachte tijden eens per minuut op; elke 30 s vragen pikt dat snel genoeg op.
const REFRESH_MS = 30_000;
function useTripTimes(tripId) {
    _s();
    const [times, setTimes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTripTimes.useEffect": ()=>{
            if (!tripId) return;
            let controller = new AbortController();
            const load = {
                "useTripTimes.useEffect.load": ()=>{
                    controller.abort();
                    controller = new AbortController();
                    fetch(`/api/trips/${encodeURIComponent(tripId)}/times`, {
                        signal: controller.signal
                    }).then({
                        "useTripTimes.useEffect.load": (res)=>res.ok ? res.json() : null
                    }["useTripTimes.useEffect.load"]).then({
                        "useTripTimes.useEffect.load": (data)=>data && setTimes(data)
                    }["useTripTimes.useEffect.load"]).catch({
                        "useTripTimes.useEffect.load": ()=>{}
                    }["useTripTimes.useEffect.load"]);
                }
            }["useTripTimes.useEffect.load"];
            load();
            const timer = setInterval(load, REFRESH_MS);
            return ({
                "useTripTimes.useEffect": ()=>{
                    clearInterval(timer);
                    controller.abort();
                }
            })["useTripTimes.useEffect"];
        }
    }["useTripTimes.useEffect"], [
        tripId
    ]);
    // Alleen teruggeven als het bij deze rit hoort (na wisselen van voertuig).
    return times?.tripId === tripId ? times : null;
}
_s(useTripTimes, "KjtGS5pbiwS1lnpQeGdUZ4Pxp7M=");
function displayTime(t) {
    return {
        time: t.expectedArrival ?? t.expectedDeparture ?? t.scheduledArrival ?? t.scheduledDeparture,
        scheduled: t.scheduledArrival ?? t.scheduledDeparture
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_187q5qh._.js.map