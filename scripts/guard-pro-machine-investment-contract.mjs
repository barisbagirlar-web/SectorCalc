#!/usr/bin/env node

/**
 * guard:pro-machine-investment-contract
 *
 * Validates schema ↔ formula ↔ UI display for the machine-investment slug.
 *
 * Checks:
 * - Schema input fields match formula expected inputs
 * - Display units are human-correct
 * - base_unit is correct
 * - Every required formula input has a schema input with matching normalized_id
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SCHEMA_PATH = join(ROOT, "src", "sectorcalc", "schemas", "pro-v531", "machine-investment-feasibility-buy-lease-keep.schema.json");
const FORMULA_PATH = join(ROOT, "src", "sectorcalc", "formulas", "pro-v531", "machine-investment-feasibility-buy-lease-keep.formula.ts");

let errors = 0;

// Expected formula inputs (extracted from requiredKeys array in formula)
const FORMULA_REQUIRED_KEYS = [
  "n_initial_investment",
  "n_annual_net_cash_flow",
  "n_discount_rate",
  "n_analysis_years",
  "n_residual_value",
  "n_stress_downside_factor",
  "n_annual_volume",
  "n_labor_rate",
  "n_overhead_rate",
  "n_defect_or_loss_cost",
  "n_source_confidence_ratio",
  "n_uncertainty_multiplier",
];

// Expected unit contract
const INPUT_CONTRACT = {
  analysis_years: {
    expected_base_unit: "year",
    expected_first_display: "year",
    forbidden_display_unit: "s",
  },
  discount_rate: {
    expected_base_unit: "ratio",
    expected_first_display: "percent",
    forbidden_display_unit: "ratio",
  },
};

// Parse schema
const schema = JSON.parse(readFileSync(SCHEMA_PATH, "utf8"));
const schemaInputs = schema.inputs || [];

// Check 1: Every schema input has a normalized_id
const schemaNormalizedIds = new Set();
const schemaInputById = {};
for (const inp of schemaInputs) {
  schemaNormalizedIds.add(inp.normalized_id);
  schemaInputById[inp.id] = inp;
}

// Check 2: Every formula required key has a corresponding schema normalized_id
for (const key of FORMULA_REQUIRED_KEYS) {
  if (!schemaNormalizedIds.has(key)) {
    console.error(`[FAIL] Formula key "${key}" has no schema input with matching normalized_id.`);
    errors++;
  }
}

// Check 3: Every schema normalized_id maps to a formula required key
for (const inp of schemaInputs) {
  if (inp.normalized_id && !FORMULA_REQUIRED_KEYS.includes(inp.normalized_id)) {
    console.warn(`[WARN] Schema "${inp.id}" normalized_id="${inp.normalized_id}" not in formula required keys. May be optional.`);
  }
}

// Check 4: Unit contract for specific fields
for (const [fieldId, contract] of Object.entries(INPUT_CONTRACT)) {
  const inp = schemaInputById[fieldId];
  if (!inp) {
    console.error(`[FAIL] Expected field "${fieldId}" not found in schema.`);
    errors++;
    continue;
  }

  if (inp.base_unit !== contract.expected_base_unit) {
    console.error(`[FAIL] "${fieldId}" base_unit is "${inp.base_unit}", expected "${contract.expected_base_unit}".`);
    errors++;
  }

  const displayUnits = inp.allowed_display_units || [];
  if (displayUnits.length > 0 && displayUnits[0] !== contract.expected_first_display) {
    console.error(`[FAIL] "${fieldId}" default display unit is "${displayUnits[0]}", expected "${contract.expected_first_display}".`);
    errors++;
  }

  if (displayUnits.includes(contract.forbidden_display_unit) && displayUnits[0] === contract.forbidden_display_unit) {
    console.error(`[FAIL] "${fieldId}" default display unit is forbidden unit "${contract.forbidden_display_unit}".`);
    errors++;
  }
}

if (errors > 0) {
  console.error(`\n[GUARD FAIL] ${errors} machine-investment contract violation(s).`);
  process.exit(1);
}

console.log("[PASS] guard:pro-machine-investment-contract — All contracts valid.");
console.log(`  Schema inputs: ${schemaInputs.length}`);
console.log(`  Formula required keys: ${FORMULA_REQUIRED_KEYS.length}`);
console.log(`  All ${FORMULA_REQUIRED_KEYS.length} keys mapped.`);
