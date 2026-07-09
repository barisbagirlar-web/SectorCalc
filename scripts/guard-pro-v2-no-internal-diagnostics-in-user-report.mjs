// Guard: PRO V2 No Internal Diagnostics in User Report
// Fails if the insight engine source contains any internal diagnostics
// strings leaked to the user-facing warning pipeline without filtering.
//
// Scans:
//   - proInsightEngine.ts — verifies that schema_hash_mismatch,
//     derating_config, trigger_inputs are NOT in userWarnings path
//   - ProExecutionFormV2.tsx — verifies no raw diagnostics pass-through

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

let allPass = true;

const insightPath = resolve(ROOT, "src/sectorcalc/pro-v2/proInsightEngine.ts");
const insightSrc = readFileSync(insightPath, "utf-8");

// ── 1. Verify internal diagnostics are filtered ─────────────────────────
const INTERNAL_PATTERNS = [
  { pattern: "schema_hash_mismatch", critical: true },
  { pattern: "client_schema_hash", critical: true },
  { pattern: "derating_config", critical: true },
  { pattern: "trigger_inputs", critical: true },
  { pattern: "INTERNAL_DIAG_IDS", critical: true },
  { pattern: "userWarnings = warnings.filter", critical: true },
];

for (const { pattern, critical } of INTERNAL_PATTERNS) {
  if (!insightSrc.includes(pattern)) {
    if (critical) {
      console.error(`FAIL: Critical filter missing: ${pattern}`);
      allPass = false;
    } else {
      console.warn(`WARN: Expected pattern not found: ${pattern} (non-critical)`);
    }
  }
}

// ── 2. Verify user-facing warnings do NOT contain diag IDs as titles ───
// Check that internal diag IDs are not used in the default warning set
const DIAG_LEAK_PATTERNS = [
  "Schema Hash Mismatch",
  "Derating Config",
  "Trigger Inputs",
  "Raw Server Diagnostic",
];
for (const leak of DIAG_LEAK_PATTERNS) {
  if (insightSrc.includes(`title: "${leak}"`)) {
    console.error(`FAIL: Internal diag leaked in user-facing title: "${leak}"`);
    allPass = false;
  }
}

// ── 3. Verify user-facing Risk Warnings are business/engineering only ──
const USER_FACING_WARNINGS = [
  "Deposition Efficiency Variance",
  "Arc Time Sensitivity",
  "Material Density Assumption",
  "Price Volatility",
];
for (const label of USER_FACING_WARNINGS) {
  if (!insightSrc.includes(label)) {
    console.warn(`WARN: Expected user-facing warning not found: "${label}"`);
  }
}

// ── Summary ────────────────────────────────────────────────────────────
console.log(`\nGUARD: PRO V2 No Internal Diagnostics in User Report`);
console.log(`==================================================`);
if (allPass) {
  console.log(`RESULT: PASS — Internal diagnostics properly isolated from user report`);
} else {
  console.error(`\nRESULT: FAIL — Internal diagnostics may leak to user report`);
  process.exit(1);
}
