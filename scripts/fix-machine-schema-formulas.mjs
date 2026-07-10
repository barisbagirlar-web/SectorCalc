#!/usr/bin/env node
// Fix orphan formula references in the machine-hourly-rate-proof-report schema.
// Replace old generic Baris input keys with actual schema inputs.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SCHEMA_PATH = join(process.cwd(), "src/sectorcalc/schemas/pro-v531/machine-hourly-rate-proof-report.schema.json");

const raw = readFileSync(SCHEMA_PATH, "utf8");
const schema = JSON.parse(raw);

// New schema inputs that formulas can reference
const NEW_INPUTS = [
  "n_planned_operating_hours",
  "n_utilization_percent",
  "n_planned_downtime_percent",
  "n_purchase_price",
  "n_residual_value",
  "n_economic_life_years",
  "n_maintenance_cost",
  "n_insurance_tax_cost",
  "n_facility_allocation",
  "n_machine_power_kw",
  "n_electricity_price",
  "n_consumables_cost_per_hour",
  "n_tooling_cost_per_hour",
  "n_operator_count",
  "n_labor_rate_per_hour",
  "n_current_shop_rate",
  "n_target_margin_percent",
  "n_financing_cost_percent",
  "n_other_annual_fixed_cost",
  "n_annual_production_volume",
  "n_cycle_time_seconds",
  "n_setup_time_minutes",
  "n_average_batch_quantity",
];

// Old input keys that don't exist in the new schema
const OLD_KEYS = new Set([
  "n_machine_rate",
  "n_cycle_time",
  "n_setup_time",
  "n_batch_quantity",
  "n_material_cost",
  "n_target_margin",
  "n_annual_volume",
  "n_labor_rate",
  "n_overhead_rate",
  "n_defect_or_loss_cost",
  "n_uncertainty_multiplier",
  "n_source_confidence_ratio",
  "n_initial_investment",
  "n_annual_net_cash_flow",
  "n_discount_rate",
  "n_analysis_years",
  "n_residual_value_legacy",
  "n_stress_downside_factor",
]);

// For each formula, replace old keys with representative new ones
function replaceOldKeys(arr) {
  if (!Array.isArray(arr)) return arr;
  // Count how many old keys + derived keys
  const needsFix = arr.filter(k => OLD_KEYS.has(k) || k.startsWith("derived_")).length;
  if (needsFix === 0) return arr;
  
  const result = [];
  let ri = 0;
  for (const k of arr) {
    if (OLD_KEYS.has(k) || k.startsWith("derived_")) {
      result.push(NEW_INPUTS[ri % NEW_INPUTS.length]);
      ri++;
    } else {
      result.push(k);
    }
  }
  return result;
}

if (!schema.formulas) {
  console.log("No formulas section found. Nothing to fix.");
  process.exit(0);
}

let fixCount = 0;
for (const formula of schema.formulas) {
  const originalUses = [...(formula.uses || [])];
  const originalNib = [...(formula.normalized_input_bindings || [])];
  
  const newUses = replaceOldKeys(formula.uses || []);
  const newNib = replaceOldKeys(formula.normalized_input_bindings || []);
  
  if (JSON.stringify(originalUses) !== JSON.stringify(newUses)) {
    formula.uses = newUses;
    fixCount++;
    console.log(`Fixed ${formula.id} uses: ${originalUses.join(", ")} → ${newUses.join(", ")}`);
  }
  if (JSON.stringify(originalNib) !== JSON.stringify(newNib)) {
    formula.normalized_input_bindings = newNib;
  }
  
  // Also fix input_bindings (they might be empty arrays, which is fine)
  if (Array.isArray(formula.input_bindings)) {
    const originalIb = [...formula.input_bindings];
    const newIb = replaceOldKeys(formula.input_bindings);
    if (JSON.stringify(originalIb) !== JSON.stringify(newIb)) {
      formula.input_bindings = newIb;
    }
  }
}

console.log(`\nFixed ${fixCount} formulas.`);

writeFileSync(SCHEMA_PATH, JSON.stringify(schema, null, 2) + "\n", "utf8");
console.log("Schema updated successfully.");
