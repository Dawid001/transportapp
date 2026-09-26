import { createWriteStream, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { ReadableStream as NodeReadableStream } from "node:stream/web";
import { DATA_DIR, GTFS_ZIP, GTFS_ZIP_META } from "./paths.js";

const GTFS_URL = "https://gtfs.ovapi.nl/nl/gtfs-nl.zip";

type ZipMeta = { etag?: string; lastModified?: string };

/** Downloadt de landelijke GTFS-zip, maar alleen als OVapi een nieuwere versie heeft. Geeft true terug bij een nieuwe download. */
export async function downloadGtfs(): Promise<boolean> {
  mkdirSync(DATA_DIR, { recursive: true });
  const meta: ZipMeta = existsSync(GTFS_ZIP) && existsSync(GTFS_ZIP_META) ? JSON.parse(readFileSync(GTFS_ZIP_META, "utf8")) : {};

  const headers: Record<string, string> = { "User-Agent": "live-ov-dev" };
  if (meta.etag) headers["If-None-Match"] = meta.etag;
  if (meta.lastModified) headers["If-Modified-Since"] = meta.lastModified;

  const res = await fetch(GTFS_URL, { headers });
  if (res.status === 304) {
    console.log("GTFS-zip is al up-to-date.");
    return false;
  }
  if (!res.ok || !res.body) throw new Error(`GTFS-download gaf HTTP ${res.status}`);

  const total = Number(res.headers.get("content-length")) || 0;
  let received = 0;
  let lastLogged = 0;
  const progress = new Transform({
    transform(chunk: Buffer, _enc, cb) {
      received += chunk.length;
      if (received - lastLogged > 20 * 1024 * 1024) {
        lastLogged = received;
        const mb = (received / 1024 / 1024).toFixed(0);
        console.log(total ? `  ${mb} / ${(total / 1024 / 1024).toFixed(0)} MB` : `  ${mb} MB`);
      }
      cb(null, chunk);
    },
  });

  // Eerst naar een tijdelijk bestand, zodat een afgebroken download de oude zip niet sloopt.
  const tmp = `${GTFS_ZIP}.part`;
  console.log("GTFS-zip downloaden…");
  await pipeline(Readable.fromWeb(res.body as NodeReadableStream), progress, createWriteStream(tmp));
  renameSync(tmp, GTFS_ZIP);

  const newMeta: ZipMeta = {
    etag: res.headers.get("etag") ?? undefined,
    lastModified: res.headers.get("last-modified") ?? undefined,
  };
  writeFileSync(GTFS_ZIP_META, JSON.stringify(newMeta, null, 2));
  console.log(`Klaar: ${(received / 1024 / 1024).toFixed(0)} MB.`);
  return true;
}
