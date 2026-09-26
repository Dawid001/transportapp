import { fetchVehicles } from "../fetchVehicles.js";

// Voertuigen waarvan de laatste positie ouder is dan dit tellen we als "stale".
const STALE_AFTER_SECONDS = 5 * 60;

async function main() {
  const feed = await fetchVehicles();
  if (!feed) throw new Error("Onverwachte 304 zonder ETag");
  const { feedTimestamp, vehicles, withoutPosition } = feed;
  const now = Math.floor(Date.now() / 1000);

  console.log(`Feed-tijd: ${new Date(feedTimestamp * 1000).toLocaleString("nl-NL")} (${now - feedTimestamp}s oud)`);
  console.log(`Voertuigen met positie: ${vehicles.length}, zonder positie: ${withoutPosition.length}\n`);

  console.log("Voorbeeld:");
  console.log(JSON.stringify(vehicles[0], null, 2), "\n");

  // Coverage per vervoerder
  const stats = new Map<string, { withPos: number; withoutPos: number; stale: number }>();
  const get = (op: string) => stats.get(op) ?? stats.set(op, { withPos: 0, withoutPos: 0, stale: 0 }).get(op)!;
  for (const v of vehicles) {
    const s = get(v.operator);
    s.withPos++;
    if (v.timestamp && now - v.timestamp > STALE_AFTER_SECONDS) s.stale++;
  }
  for (const op of withoutPosition) get(op).withoutPos++;

  console.table(
    [...stats.entries()]
      .sort((a, b) => b[1].withPos - a[1].withPos)
      .map(([operator, s]) => ({ operator, "met GPS": s.withPos, "zonder GPS": s.withoutPos, [`> ${STALE_AFTER_SECONDS / 60} min oud`]: s.stale })),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
