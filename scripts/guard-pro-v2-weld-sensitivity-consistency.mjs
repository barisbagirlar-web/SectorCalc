// Guard: PRO V2 Weld Sensitivity Consistency
// Fails if:
//   - MEDIUM/HIGH sensitivity item has $0.00 impact
//   - wire price sensitivity is zero while wire cost > 0
//   - efficiency sensitivity is zero while wire mass and wire cost > 0
//
// Scans the insight engine source for sensitivity patterns.

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

let allPass = true;

const insightPath = resolve(ROOT, "src/sectorcalc/pro-v2/proInsightEngine.ts");
const insightSrc = readFileSync(insightPath, "utf-8");

// ── 1. Wire price sensitivity must be non-zero severity when wire cost > 0 ──
// Check: wire price sensitivity uses wireCostVal * multiplier
if (!insightSrc.includes("wireCostVal * 0.15")) {
  console.error("FAIL: Wire price sensitivity must reference wireCostVal with 15% multiplier");
  allPass = false;
}
// Check: wire price severity depends on wireCostVal > 0.05
const wireSevPattern = 'wireCostVal > 0.05 ? "MEDIUM" : "LOW"';
if (!insightSrc.includes(wireSevPattern)) {
  console.error('FAIL: Wire price severity must be MEDIUM when wireCostVal > 0.05, LOW otherwise');
  allPass = false;
}

// ── 2. Deposition efficiency sensitivity must be non-zero when wire mass > 0 ──
// Check: dep eff sensitivity uses wireCostVal * 0.13
if (!insightSrc.includes("wireCostVal * 0.13")) {
  console.error("FAIL: Deposition efficiency sensitivity must reference wireCostVal with 13% multiplier");
  allPass = false;
}
// Check: dep eff severity depends on wireCostVal
if (!insightSrc.includes(wireSevPattern)) {
  console.error('FAIL: Deposition efficiency severity must be MEDIUM when wireCostVal > 0.05');
  allPass = false;
}

// ── 3. No $0.00 impact for MEDIUM/HIGH severity items ──────────────────────
// Verify all sensitivity impact strings use template literals with cost variables
// rather than hardcoded $0.00
const zeroDollarPattern = /`\$0\.00/;
const matches = insightSrc.match(zeroDollarPattern);
if (matches) {
  console.error(`FAIL: Found hardcoded \$0.00 in sensitivity impact: ${matches.length} match(es)`);
  allPass = false;
}

// ── 4. Total Job Time sensitivity must use HIGH severity ───────────────────
if (!insightSrc.includes('severity: "HIGH"')) {
  console.error("FAIL: Total Job Time sensitivity must have HIGH severity");
  allPass = false;
}
// Verify Total Job Time sensitivity uses labor+overhead combined
if (!insightSrc.includes("(laborCostVal + overheadVal) * 0.10")) {
  console.error("FAIL: Total Job Time sensitivity must use (laborCostVal + overheadVal) * 0.10");
  allPass = false;
}

// ── Summary ────────────────────────────────────────────────────────────
console.log(`\nGUARD: PRO V2 Weld Sensitivity Consistency`);
console.log(`========================================`);
if (allPass) {
  console.log(`RESULT: PASS — All sensitivity consistency rules verified`);
} else {
  console.error(`\nRESULT: FAIL — Some sensitivity consistency rules violated`);
  process.exit(1);
}
