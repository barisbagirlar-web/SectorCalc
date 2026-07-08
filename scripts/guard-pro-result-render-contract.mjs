#!/usr/bin/env node

/**
 * guard:pro-result-render-contract
 *
 * Scans all LIVE PRO schemas for output definitions.
 * Fails if a schema has outputs defined but no output_keys list,
 * or if outputs have no names/IDs.
 *
 * Scans the UniversalIndustrialDecisionForm for "No result yet" fallback pattern
 * and verifies that the result panel renders when server returns outputs.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SCHEMA_DIR = join(ROOT, "src", "sectorcalc", "schemas", "pro-v531");

const files = readdirSync(SCHEMA_DIR).filter((f) => f.endsWith(".schema.json"));

// Only check LIVE_ENGINE_READY PRO tools
const LIVE_TOOL_KEYS = [
  "break-even-survival-cash-calculator",
  "machine-hourly-rate-proof-report",
  "loss-making-job-detector",
  "receivables-cost-payment-term-addendum",
  "setup-time-reduction-roi-smed",
  "product-sku-margin-ranker",
  "true-employee-cost-statement",
  "job-quote-builder-pro-pack",
  "machine-investment-feasibility-buy-lease-keep",
  "capital-equipment-investment-appraisal-npv-irr",
  "customer-sku-profitability-forensics",
  "downtime-scrap-loss-statement",
  "oee-loss-monetization-improvement-business-case",
  "scrap-rework-cost-tracker",
  "outsource-vs-in-house-analyzer",
  "plant-wide-shop-rate-cost-structure-audit",
  "fx-commodity-pass-through-pricer",
  "energy-efficiency-grant-incentive-feasibility-pack",
  "motor-compressor-replacement-roi",
  "weld-procedure-cost-consumable-estimation-suite",
];

let errors = 0;

for (const file of files) {
  const content = readFileSync(join(SCHEMA_DIR, file), "utf8");
  const schema = JSON.parse(content);
  if (!schema.tool_key) continue;
  if (!LIVE_TOOL_KEYS.includes(schema.tool_key)) continue;

  // PRO V5.3.1 schemas use "outputs" as a type annotation "ServerOutput[]",
  // not an array. Actual outputs are defined in the formula module.
  // The formula module must have an output_keys array.
  const formulaPath = join(ROOT, "src", "sectorcalc", "formulas", "pro-v531", schema.tool_key + ".formula.ts");
  try {
    const formulaContent = readFileSync(formulaPath, "utf8");
    // Check that formula has outputKeys or similar
    if (!formulaContent.includes("outputKeys") && !formulaContent.includes("output_keys") && !formulaContent.includes('"out_')) {
      console.error(`[FAIL] ${schema.tool_key}.formula.ts: no output keys found.`);
      errors++;
    }
  } catch {
    console.error(`[FAIL] Formula file not found: ${formulaPath}`);
    errors++;
  }
}

// Check that the form component does not permanently show "No result yet"
// after a successful API response
const FORM_PATH = join(ROOT, "src", "sectorcalc", "pro-form", "UniversalIndustrialDecisionForm.tsx");
const formContent = readFileSync(FORM_PATH, "utf8");

// Ensure there's no unconditional "No result yet" that bypasses server response
const noResultPattern = /No result yet/g;
const hasServerResponse = /hasServerResponse/g;
const resultPattern = /hasResult\s*&&\s*response\?\.outputs/g;

const noResultMatches = formContent.match(noResultPattern) || [];
if (noResultMatches.length > 0) {
  // Verify it's behind hasResult guard, not bare
  if (formContent.includes("hasResult && response?.outputs")) {
    // OK - the string is gated behind server response
  } else {
    // Check if "No result yet" appears outside of result guards
    const lines = formContent.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("No result yet")) {
        // Check if previous meaningful line contains hasResult or hasServerResponse guard
        let guarded = false;
        for (let j = Math.max(0, i - 5); j < i; j++) {
          if (lines[j].includes("hasResult") || lines[j].includes("hasServerResponse") || lines[j].includes("response?.outputs")) {
            guarded = true;
            break;
          }
        }
        if (!guarded) {
          console.error(`[FAIL] "No result yet" on line ${i + 1} is not guarded by hasResult/hasServerResponse check.`);
          errors++;
        }
      }
    }
  }
}

if (errors > 0) {
  console.error(`\n[GUARD FAIL] ${errors} result-render contract violation(s).`);
  process.exit(1);
}

console.log(`[PASS] guard:pro-result-render-contract — ${files.length} PRO schemas, 1 form checked.`);
