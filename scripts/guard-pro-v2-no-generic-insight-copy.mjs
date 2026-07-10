// Guard: PRO V2 No Generic Insight Copy
// Prevent identical welding advice from appearing in non-welding tools.

import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

let allPass = true;

// Welding-specific phrases that must NOT appear outside weld insights
// "consumable/consumables" is excluded because it is a generic industrial term
// that legitimately appears in machine costing, shop rate, and operations tools.
const WELDING_PATTERNS = [
  "Weld procedure",
  "WPS",
  "weld throat",
  "fillet weld",
  "deposition efficiency",
  "shielding gas",
  "arc time",
  "wire stub",
  "weld joint",
  "preheat",
  "interpass",
  "NDE inspection",
  "welder qualification",
];

const insightDir = resolve(ROOT, "src/sectorcalc/pro-v2/insights");

const insightFiles = readdirSync(insightDir).filter((f) => f.endsWith(".ts"));

for (const file of insightFiles) {
  // Skip the weld insight file itself
  if (file.includes("weld")) continue;

  const src = readFileSync(resolve(insightDir, file), "utf-8");

  for (const pattern of WELDING_PATTERNS) {
    if (src.includes(pattern)) {
      console.error(`FAIL: [${file}] Contains welding-specific phrase: "${pattern}"`);
      allPass = false;
    }
  }
}

console.log(`\nGUARD: PRO V2 No Generic Insight Copy`);
console.log(`=====================================`);
if (allPass) {
  console.log(`RESULT: PASS — No generic welding advice found in non-welding tools`);
} else {
  console.error(`\nRESULT: FAIL — Generic welding advice copied to non-welding tool`);
  process.exit(1);
}
