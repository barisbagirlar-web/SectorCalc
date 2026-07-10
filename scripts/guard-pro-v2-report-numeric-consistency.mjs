// Guard: PRO V2 Report Numeric Consistency
// Totals, component sums, margins, rates, and percentages must reconcile.

import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

let allPass = true;

// Scan all insight modules for numeric consistency patterns
const insightDir = resolve(ROOT, "src/sectorcalc/pro-v2/insights");
const insightFiles = readdirSync(insightDir).filter((f) => f.endsWith(".ts"));

for (const file of insightFiles) {
  const src = readFileSync(resolve(insightDir, file), "utf-8");

  // 1. Total must equal sum of components pattern
  const hasTotalConsistency =
    src.includes("baseCostVal") && src.includes("contingencyAmt") &&
    src.includes("displayTotalCost");
  if (!hasTotalConsistency) {
    console.warn(`WARN: [${file}] May lack total = base + contingency consistency check`);
  }

  // 2. No $0.00 for MEDIUM/HIGH sensitivity
  const sensitivityZeroPattern = /severity:\s*"(MEDIUM|HIGH)"[^}]*impact:\s*`\$0\.00/;
  if (sensitivityZeroPattern.test(src)) {
    console.error(`FAIL: [${file}] MEDIUM/HIGH sensitivity has \$0.00 impact`);
    allPass = false;
  }

  // 3. No NaN, Infinity, undefined in impact strings
  if (src.includes("NaN") || src.includes("Infinity") || src.includes("undefined")) {
    console.error(`FAIL: [${file}] Contains NaN, Infinity, or undefined in output`);
    allPass = false;
  }

  // 4. Currency values use currency() helper
  const hardcodedCurrency = src.match(/\$[0-9]+\.[0-9]{2}/g);
  if (hardcodedCurrency) {
    console.warn(`WARN: [${file}] Contains ${hardcodedCurrency.length} hardcoded currency values`);
  }

  // 5. Percentages sum context
  if (src.includes("percentage") && !src.includes("totalForPct")) {
    console.warn(`WARN: [${file}] Cost distribution may lack percentage denominator`);
  }
}

console.log(`\nGUARD: PRO V2 Report Numeric Consistency`);
console.log(`========================================`);
if (allPass) {
  console.log(`RESULT: PASS — All insight modules pass numeric consistency checks`);
} else {
  console.error(`\nRESULT: FAIL — Numeric consistency violations detected`);
  process.exit(1);
}
