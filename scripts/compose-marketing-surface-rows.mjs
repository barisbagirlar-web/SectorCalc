#!/usr/bin/env node
/**
 * Builds scripts/data/marketing-surface-rows.json — en -> [ar, de, fr, es]
 * Run: node scripts/compose-marketing-surface-rows.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";

const ROOT = join(dirname(import.meta.filename), "..");
const items = JSON.parse(
  readFileSync(join(ROOT, "scripts/data/_export-queue-items.json"), "utf8"),
);

/** @type {Record<string, [string, string, string, string]>} */
const ROWS = JSON.parse(
  readFileSync(join(dirname(import.meta.filename), "data/marketing-surface-rows-body.json"), "utf8"),
);

const queue = JSON.parse(
  readFileSync(join(ROOT, "scripts/data/marketing-translation-queue.json"), "utf8"),
);
const uniqueEn = [...new Set(queue.map((i) => i.en))];

const missing = uniqueEn.filter((en) => !ROWS[en]);
if (missing.length) {
  console.error("Missing rows:", missing.length);
  missing.slice(0, 20).forEach((s) => console.error(" -", s));
  process.exit(1);
}

const extra = Object.keys(ROWS).filter((k) => !uniqueEn.includes(k));
if (extra.length) {
  console.error("Extra keys not in queue:", extra.length);
  process.exit(1);
}

const outPath = join(ROOT, "scripts/data/marketing-surface-rows.json");
writeFileSync(outPath, `${JSON.stringify(ROWS, null, 2)}\n`);
console.log("Written:", outPath);
console.log("Keys:", Object.keys(ROWS).length);
