#!/usr/bin/env node
/** Resume translate-generated-schema-copy until queues are empty or max rounds. */
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const MAX_ROUNDS = 80;

function pendingSummary() {
  const result = spawnSync("node", ["scripts/translate-generated-schema-copy.mjs", "--dry-run"], {
    cwd: ROOT,
    encoding: "utf8",
  });
  const line = (result.stdout ?? "").split("\n").find((row) => row.includes("labels_pending=")) ?? "";
  const labels = Number(line.match(/labels_pending=(\d+)/)?.[1] ?? 0);
  const helpers = Number(line.match(/helpers_pending=(\d+)/)?.[1] ?? 0);
  const titles = Number(line.match(/titles_pending=(\d+)/)?.[1] ?? 0);
  return { labels, helpers, titles, line };
}

for (let round = 1; round <= MAX_ROUNDS; round += 1) {
  const before = pendingSummary();
  console.log(`\n=== translate round ${round}/${MAX_ROUNDS} — ${before.line}`);
  if (before.labels === 0 && before.helpers === 0 && before.titles === 0) {
    console.log("translate queues drained");
    process.exit(0);
  }

  const result = spawnSync("node", ["scripts/translate-generated-schema-copy.mjs"], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    console.warn(`round ${round} exited ${result.status ?? 1} — retrying after save checkpoint`);
  }

  const after = pendingSummary();
  if (
    after.labels === before.labels &&
    after.helpers === before.helpers &&
    after.titles === before.titles
  ) {
    console.error("no progress this round — stopping to avoid infinite loop");
    process.exit(1);
  }
}

console.error(`max rounds (${MAX_ROUNDS}) reached with pending work remaining`);
process.exit(1);
