// Guard: PRO V2 Wave Allowlist
// Only approved wave slugs may be activated.
// Prevents premature activation of unmigrated tools.

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

let allPass = true;

// ── Wave 0 (Gold) — Complete, live-verified
const WAVE_0_SLUGS = [
  "weld-procedure-cost-consumable-estimation-suite",
];

// ── Wave 1 (Cost & Quotation) — Live-verified
const WAVE_1_SLUGS = [
  "machine-hourly-rate-proof-report",
  "job-quote-builder-pro-pack",
  "loss-making-job-detector",
];

// ── Future waves (not yet activated)
// Wave 2: product-sku-margin-ranker, customer-sku-profitability-forensics, etc.
// Wave 2: product-sku-margin-ranker, customer-sku-profitability-forensics, etc.

// Read current allowlist
const slugsPath = resolve(ROOT, "src/sectorcalc/pro-v2/proV2Slugs.ts");
const slugsSrc = readFileSync(slugsPath, "utf-8");
const slugMatches = slugsSrc.matchAll(/"([a-z][a-z0-9-]+)"/g);
const activeSlugs = Array.from(slugMatches)
  .map((m) => m[1])
  .filter((s) => s.includes("-") && !s.startsWith("use") && s.length > 10);

// Verify each active slug is in an approved wave
const ALL_APPROVED_SLUGS = new Set([...WAVE_0_SLUGS, ...WAVE_1_SLUGS]);

for (const slug of activeSlugs) {
  if (!ALL_APPROVED_SLUGS.has(slug)) {
    console.error(`FAIL: Slug '${slug}' is in allowlist but not in any approved wave`);
    allPass = false;
  }
}

// Verify no unverified Wave 1+ slugs are activated
for (const wave0 of WAVE_0_SLUGS) {
  if (!activeSlugs.includes(wave0)) {
    console.warn(`WARN: Wave 0 slug '${wave0}' missing from allowlist`);
  }
}

console.log(`\nGUARD: PRO V2 Wave Allowlist`);
console.log(`============================`);
if (allPass) {
  console.log(`RESULT: PASS — Allowlist contains ${activeSlugs.length} slug(s) from approved waves only`);
} else {
  console.error(`\nRESULT: FAIL — Unapproved slugs detected in allowlist. Active: ${activeSlugs.join(", ")}. Approved: ${[...ALL_APPROVED_SLUGS].join(", ")}`);
  process.exit(1);
}
