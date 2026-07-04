#!/usr/bin/env node
/** Merge scripts/data/omni-sections/*.txt → omni-expansion-raw.txt + input_calculators.txt */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "../..");
const SECTIONS_DIR = path.join(ROOT, "archive/migration-only/scripts/data/omni-sections");
const RAW = path.join(ROOT, "archive/migration-only/scripts/data/omni-expansion-raw.txt");
const INPUT = path.join(ROOT, "input_calculators.txt");

if (!fs.existsSync(SECTIONS_DIR)) {
  console.error(`Missing ${SECTIONS_DIR}`);
  process.exit(1);
}

const parts = fs
  .readdirSync(SECTIONS_DIR)
  .filter((f) => f.endsWith(".txt"))
  .sort()
  .map((f) => fs.readFileSync(path.join(SECTIONS_DIR, f), "utf8").trim());

const merged = `${parts.join("\n\n")}\n`;
fs.writeFileSync(RAW, merged);
fs.writeFileSync(INPUT, merged);
console.log(`merged ${parts.length} sections → ${merged.split("\n").length} lines`);
