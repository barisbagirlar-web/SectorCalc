#!/usr/bin/env node

/**
 * guard:pro-initial-validation-neutral
 *
 * Fails if any LIVE PRO schema field has a default_value or example_value
 * that would trigger red/error border on initial load (before user interaction).
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
  if (!schema.tool_key || !schema.inputs) continue;
  if (!LIVE_TOOL_KEYS.includes(schema.tool_key)) continue;

  for (const input of schema.inputs) {
    const defaultValue = input.default_value;
    const exampleValue = input.example_value;
    const bounds = input.physical_hard_bounds;

    if (defaultValue !== null && defaultValue !== undefined && bounds) {
      const min = bounds.min;
      const max = bounds.max;
      if (typeof min === "number" && defaultValue < min) {
        console.error(`[FAIL] ${file}: "${input.id}" default_value=${defaultValue} < bounds min=${min}`);
        errors++;
      }
      if (typeof max === "number" && defaultValue > max) {
        console.error(`[FAIL] ${file}: "${input.id}" default_value=${defaultValue} > bounds max=${max}`);
        errors++;
      }
    }

    if (exampleValue !== null && exampleValue !== undefined && bounds) {
      const min = bounds.min;
      const max = bounds.max;
      if (typeof min === "number" && exampleValue < min) {
        console.error(`[FAIL] ${file}: "${input.id}" example_value=${exampleValue} < bounds min=${min}`);
        errors++;
      }
      if (typeof max === "number" && exampleValue > max) {
        console.error(`[FAIL] ${file}: "${input.id}" example_value=${exampleValue} > bounds max=${max}`);
        errors++;
      }
    }
  }
}

if (errors > 0) {
  console.error(`\n[GUARD FAIL] ${errors} field(s) with problematic initial defaults.`);
  process.exit(1);
}

console.log(`[PASS] guard:pro-initial-validation-neutral — ${files.length} PRO schemas checked.`);
