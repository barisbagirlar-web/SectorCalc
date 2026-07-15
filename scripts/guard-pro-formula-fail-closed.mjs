#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const FORMULA_DIR = path.join(ROOT, "src/sectorcalc/formulas/pro-v531");

const LIVE_FILES = [
  "break-even-survival-cash-calculator.formula.ts",
  "machine-hourly-rate-proof-report.formula.ts",
  "loss-making-job-detector.formula.ts",
  "receivables-cost-payment-term-addendum.formula.ts",
  "setup-time-reduction-roi-smed.formula.ts",
  "product-sku-margin-ranker.formula.ts",
  "true-employee-cost-statement.formula.ts",
  "job-quote-builder-pro-pack.formula.ts",
  "machine-investment-feasibility-buy-lease-keep.formula.ts",
  "capital-equipment-investment-appraisal-npv-irr.formula.ts",
  "customer-sku-profitability-forensics.formula.ts",
  "downtime-scrap-loss-statement.formula.ts",
  "oee-loss-monetization-improvement-business-case.formula.ts",
  "scrap-rework-cost-tracker.formula.ts",
  "outsource-vs-in-house-analyzer.formula.ts",
  "plant-wide-shop-rate-cost-structure-audit.formula.ts",
  "fx-commodity-pass-through-pricer.formula.ts",
  "energy-efficiency-grant-incentive-feasibility-pack.formula.ts",
  "motor-compressor-replacement-roi.formula.ts",
  "weld-procedure-cost-consumable-estimation-suite.formula.ts",
];

const REQUIRED_EXPORTS = [
  "export const toolKey",
  "export const formulaVersion",
  "export const requiredInputKeys",
  "export const declaredOutputKeys",
  "export const sampleInputs",
  "export function calculate",
];

const FORBIDDEN_PATTERNS = [
  {
    pattern: /return\s+isFiniteNumber\([^)]*\)\s*\?[^:]+:\s*0\s*;/,
    reason: "silent missing/non-finite input fallback to zero",
  },
  {
    pattern: /non-finite output corrected to zero/i,
    reason: "non-finite output mutation instead of execution block",
  },
  {
    pattern: /corrected to zero/i,
    reason: "result mutation instead of fail-closed behavior",
  },
  {
    pattern: /\beval\s*\(/,
    reason: "dynamic formula evaluation",
  },
  {
    pattern: /new\s+Function\s*\(/,
    reason: "dynamic formula construction",
  },
  {
    pattern: /Math\.random\s*\(/,
    reason: "non-deterministic formula execution",
  },
  {
    pattern: /Date\.now\s*\(/,
    reason: "time-dependent formula execution",
  },
];

const errors = [];

if (new Set(LIVE_FILES).size !== 20 || LIVE_FILES.length !== 20) {
  errors.push(`Expected exactly 20 unique LIVE formula files, got ${LIVE_FILES.length}.`);
}

for (const filename of LIVE_FILES) {
  const absolutePath = path.join(FORMULA_DIR, filename);
  if (!fs.existsSync(absolutePath)) {
    errors.push(`${filename}: file not found.`);
    continue;
  }

  const source = fs.readFileSync(absolutePath, "utf8");
  if (!source.includes('import "server-only"')) {
    errors.push(`${filename}: missing server-only boundary.`);
  }

  for (const requiredExport of REQUIRED_EXPORTS) {
    if (!source.includes(requiredExport)) {
      errors.push(`${filename}: missing ${requiredExport}.`);
    }
  }

  for (const forbidden of FORBIDDEN_PATTERNS) {
    if (forbidden.pattern.test(source)) {
      errors.push(`${filename}: ${forbidden.reason}.`);
    }
  }

  const inputExportCount = (source.match(/export const requiredInputKeys/g) ?? []).length;
  const outputExportCount = (source.match(/export const declaredOutputKeys/g) ?? []).length;
  if (inputExportCount !== 1) {
    errors.push(`${filename}: requiredInputKeys export count is ${inputExportCount}.`);
  }
  if (outputExportCount !== 1) {
    errors.push(`${filename}: declaredOutputKeys export count is ${outputExportCount}.`);
  }
}

if (errors.length > 0) {
  console.error("PRO_FORMULA_FAIL_CLOSED_GUARD=FAIL");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("PRO_FORMULA_FAIL_CLOSED_GUARD=PASS");
console.log(`LIVE_PRO_FORMULAS_SCANNED=${LIVE_FILES.length}`);
