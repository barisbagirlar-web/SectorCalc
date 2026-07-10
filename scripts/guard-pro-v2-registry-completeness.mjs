// Guard: PRO V2 Registry Completeness
// Every allowlisted slug must have contract, adapter, insight, and preset modules.

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

let allPass = true;

// Read the allowlist — look for string literals containing hyphens (PRO slug pattern)
const slugsPath = resolve(ROOT, "src/sectorcalc/pro-v2/proV2Slugs.ts");
const slugsSrc = readFileSync(slugsPath, "utf-8");
const slugMatches = slugsSrc.matchAll(/"([a-z][a-z0-9-]+)"/g);
const allowlistedSlugs = Array.from(slugMatches)
  .map((m) => m[1])
  .filter((s) => s.includes("-") && !s.startsWith("use") && s.length > 10);

if (allowlistedSlugs.length === 0) {
  console.error("FAIL: No allowlisted slugs found in proV2Slugs.ts");
  process.exit(1);
}

for (const slug of allowlistedSlugs) {
  const contractPath = resolve(ROOT, `src/sectorcalc/pro-v2/contracts/${slug}.contract.ts`);
  const adapterPath = resolve(ROOT, `src/sectorcalc/pro-v2/adapters/${slug}.adapter.ts`);
  const insightPath = resolve(ROOT, `src/sectorcalc/pro-v2/insights/${slug}.insight.ts`);
  const presetPath = resolve(ROOT, `src/sectorcalc/pro-v2/presets/${slug}.presets.ts`);

  const missing = [];
  if (!existsSync(contractPath)) missing.push("contract");
  if (!existsSync(adapterPath)) missing.push("adapter");
  if (!existsSync(insightPath)) missing.push("insight");
  if (!existsSync(presetPath)) missing.push("preset");

  if (missing.length > 0) {
    console.error(`FAIL: [${slug}] Missing modules: ${missing.join(", ")}`);
    allPass = false;
  }
}

console.log(`\nGUARD: PRO V2 Registry Completeness`);
console.log(`===================================`);
if (allPass) {
  console.log(`RESULT: PASS — All ${allowlistedSlugs.length} allowlisted slugs have complete module sets`);
} else {
  console.error(`\nRESULT: FAIL — Some slugs have missing modules`);
  process.exit(1);
}
