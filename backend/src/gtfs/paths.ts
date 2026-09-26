import { fileURLToPath } from "node:url";
import path from "node:path";

export const DATA_DIR = fileURLToPath(new URL("../../data/", import.meta.url));
export const GTFS_ZIP = path.join(DATA_DIR, "gtfs-nl.zip");
export const GTFS_ZIP_META = path.join(DATA_DIR, "gtfs-nl.meta.json");
export const GTFS_DB = path.join(DATA_DIR, "gtfs.db");
export const GTFS_DB_PENDING = `${GTFS_DB}.new`;
