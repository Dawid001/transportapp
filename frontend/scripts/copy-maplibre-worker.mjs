// MapLibre 6 draait tiles in een web worker. Turbopack bundelt die worker niet mee,
// dus we zetten hem (plus de gedeelde module die hij importeert) in public/ en wijzen er met setWorkerUrl naar.
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const distDir = path.dirname(require.resolve("maplibre-gl/dist/maplibre-gl.mjs"));
const outDir = path.join(import.meta.dirname, "..", "public", "maplibre");

mkdirSync(outDir, { recursive: true });
for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
  copyFileSync(path.join(distDir, file), path.join(outDir, file));
}
