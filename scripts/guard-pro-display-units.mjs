#!/usr/bin/env node

/**
 * guard:pro-display-units
 *
 * Fails on visible "Seconds" for fields named:
 *   Analysis Period, Period, Year, Annual
 *
 * Fails on visible "Ratio" for fields named:
 *   Discount Rate, Margin, Utilization, Percentage
 *
 * Checks the default display unit (first in allowed_display_units) for matching fields.
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

// Period-like field names that MUST NOT display Seconds as default unit
const PERIOD_NAMES = ["analysis period", "period", "year", "annual"];
// Rate/percentage-like field names that MUST NOT display Ratio as default unit
const RATE_NAMES = ["discount rate", "margin", "utilization", "percentage"];
// Coverage fields are only flagged if name also contains % or Percent
function isCoverageField(name, id) {
  const lower = (name || "").toLowerCase();
  const idLower = (id || "").toLowerCase();
  return (lower.includes("coverage") || idLower.includes("coverage")) &&
         (lower.includes("%") || lower.includes("percent") || lower.includes("pct"));
}

// kWh/J field IDs
const KWH_FIELD_IDS = ["current_kwh_per_year", "target_kwh_per_year"];
// Rate field IDs that must use per_kWh not per_h
const KWH_RATE_IDS = ["avg_kwh_rate"];

function nameMatches(name, patterns) {
  const lower = (name || "").toLowerCase();
  return patterns.some((p) => lower.includes(p));
}

for (const file of files) {
  const content = readFileSync(join(SCHEMA_DIR, file), "utf8");
  const schema = JSON.parse(content);
  if (!schema.tool_key || !schema.inputs) continue;
  if (!LIVE_TOOL_KEYS.includes(schema.tool_key)) continue;

  for (const input of schema.inputs) {
    const displayUnits = input.allowed_display_units;
    if (!displayUnits || displayUnits.length === 0) continue;

    const defaultUnit = displayUnits[0];
    const id = input.id || "";
    const name = input.name || "";

    // Period fields must not default to seconds (s)
    if (nameMatches(name, PERIOD_NAMES) || nameMatches(id, PERIOD_NAMES)) {
      if (defaultUnit === "s") {
        console.error(`[FAIL] ${file}: "${id}" (${name}) default display unit is "s" (Seconds). Use "year" or "month".`);
        errors++;
      }
    }

    // Rate fields must not default to ratio
    if ((nameMatches(name, RATE_NAMES) || nameMatches(id, RATE_NAMES)) || isCoverageField(name, id)) {
      if (defaultUnit === "ratio") {
        console.error(`[FAIL] ${file}: "${id}" (${name}) default display unit is "ratio". Use "percent".`);
        errors++;
      }
    }

    // Direct check: discount_rate field must have percent first
    if (id === "discount_rate" || id === "target_margin") {
      if (!displayUnits.includes("percent")) {
        console.error(`[FAIL] ${file}: "${id}" must allow "percent" as a display unit.`);
        errors++;
      }
      if (displayUnits[0] !== "percent") {
        console.error(`[FAIL] ${file}: "${id}" first allowed display unit must be "percent" (got "${displayUnits[0]}").`);
        errors++;
      }
    }

    // Direct check: analysis_years field must have year first
    if (id === "analysis_years") {
      if (!displayUnits.includes("year")) {
        console.error(`[FAIL] ${file}: "${id}" must allow "year" as a display unit.`);
        errors++;
      }
      if (displayUnits[0] !== "year") {
        console.error(`[FAIL] ${file}: "${id}" first allowed display unit must be "year" (got "${displayUnits[0]}").`);
        errors++;
      }
    }

    // Direct check: kWh field must not display J
    if (KWH_FIELD_IDS.includes(id)) {
      if (defaultUnit === "J" || defaultUnit === "j") {
        console.error(`[FAIL] ${file}: "${id}" (${name}) default display unit is "J". Must be "kWh".`);
        errors++;
      }
    }

    // Direct check: avg_kwh_rate must not use per_h
    if (KWH_RATE_IDS.includes(id)) {
      if (defaultUnit === "currency_unit_per_h") {
        console.error(`[FAIL] ${file}: "${id}" (${name}) default display unit is "currency_unit_per_h". Must be "currency_unit_per_kWh".`);
        errors++;
      }
    }
  }
}

const liveLive = files.filter(f => {
  try {
    const s = JSON.parse(readFileSync(join(SCHEMA_DIR, f), "utf8"));
    return LIVE_TOOL_KEYS.includes(s.tool_key);
  } catch { return false; }
}).length;

if (errors > 0) {
  console.error(`\n[GUARD FAIL] ${errors} critical display unit violation(s) across LIVE PRO tools.`);
  process.exit(1);
}

console.log(`[PASS] guard:pro-display-units — ${files.length} PRO schemas checked.`);
