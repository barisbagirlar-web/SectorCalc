#!/usr/bin/env node
/**
 * Generates scripts/data/marketing-surface-rows-body.json
 * Run: node scripts/gen-marketing-rows-body.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";

const ROOT = join(dirname(import.meta.filename), "..");
const need = JSON.parse(
  readFileSync(join(ROOT, "scripts/data/_need-rows.json"), "utf8"),
);

/** @type {Record<string, [string, string, string, string]>} */
const COMPLETE = JSON.parse(
  readFileSync(join(dirname(import.meta.filename), "data/marketing-surface-rows-complete.json"), "utf8"),
);

const ROWS = {};
const missing = [];

for (const item of need) {
  const row = COMPLETE[item.en];
  if (!row || row.length !== 4) {
    missing.push(item.en);
    continue;
  }
  ROWS[item.en] = row;
}

if (missing.length) {
  console.error("Missing complete rows:", missing.length);
  missing.slice(0, 10).forEach((s) => console.error(" -", s));
  process.exit(1);
}

const outPath = join(ROOT, "scripts/data/marketing-surface-rows-body.json");
writeFileSync(outPath, `${JSON.stringify(ROWS, null, 2)}\n`);
console.log("Written:", outPath, Object.keys(ROWS).length);
