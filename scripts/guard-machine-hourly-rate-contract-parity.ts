// SectorCalc — Machine Hourly Rate Proof Report Contract Parity Guard
// Verifies schema ↔ formula ↔ golden fixture parity.
// Run: npx tsx scripts/guard-machine-hourly-rate-contract-parity.ts

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { calculate } from "../src/sectorcalc/formulas/pro-v531/machine-hourly-rate-proof-report.formula";

const ROOT = resolve(import.meta.dirname, "..");

function readJSON(rel: string) {
  return JSON.parse(readFileSync(resolve(ROOT, rel), "utf-8"));
}

function allFinite(obj: Record<string, number>): boolean {
  return Object.values(obj).every(v => typeof v === "number" && Number.isFinite(v));
}

const schema = readJSON("src/sectorcalc/schemas/pro-v531/machine-hourly-rate-proof-report.schema.json");
const golden = readJSON("tests/golden/pro-v531-baris/machine-hourly-rate-proof-report.golden.json");

const OPTIONAL_SCENARIO_KEYS = [
  "n_annual_production_volume", "n_cycle_time_seconds",
  "n_setup_time_minutes", "n_average_batch_quantity",
];
const SCENARIO_OUTPUT_KEYS = [
  "out_setup_count_per_year", "out_required_machine_hours",
  "out_capacity_requirement_percent", "out_cost_per_part",
  "out_target_sell_price_per_part", "out_production_scenario_state",
];
const APPROVED_CORE_OUTPUT_COUNT = 28;
const APPROVED_OPTIONAL_OUTPUT_COUNT = 6;
const APPROVED_TOTAL_OUTPUT_COUNT = 34;

const CORE_INPUTS: Record<string, number> = {
  n_planned_operating_hours: 2000, n_utilization_percent: 80,
  n_planned_downtime_percent: 5, n_purchase_price: 85000,
  n_residual_value: 5000, n_economic_life_years: 8,
  n_maintenance_cost: 6000, n_insurance_tax_cost: 2000,
  n_facility_allocation: 18000, n_machine_power_kw: 15,
  n_electricity_price: 0.12, n_consumables_cost_per_hour: 2.5,
  n_tooling_cost_per_hour: 3, n_operator_count: 1,
  n_labor_rate_per_hour: 45, n_current_shop_rate: 85,
  n_target_margin_percent: 25, n_financing_cost_percent: 0,
  n_other_annual_fixed_cost: 0,
};

const failures: string[] = [];
function pass(label: string) { console.log(`  PASS: ${label}`); }
function fail(label: string, detail?: string) {
  const msg = detail ? `${label}: ${detail}` : label;
  failures.push(msg);
  console.log(`  FAIL: ${msg}`);
}
function check(label: string, ok: boolean, detail?: string) {
  ok ? pass(label) : fail(label, detail);
}

// ── 1. Schema ↔ formula input parity ──
console.log("1. Schema ↔ formula input key parity...");
const schemaInputKeys = schema.inputs.map((i: any) => i.normalized_id).filter(Boolean).sort();

const allFormulaKeys: string[] = [
  "n_planned_operating_hours","n_utilization_percent","n_planned_downtime_percent",
  "n_purchase_price","n_residual_value","n_economic_life_years",
  "n_maintenance_cost","n_insurance_tax_cost","n_facility_allocation",
  "n_machine_power_kw","n_electricity_price","n_consumables_cost_per_hour",
  "n_tooling_cost_per_hour","n_operator_count","n_labor_rate_per_hour",
  "n_current_shop_rate","n_target_margin_percent",
  "n_financing_cost_percent","n_other_annual_fixed_cost",
  ...OPTIONAL_SCENARIO_KEYS,
].sort();

check("Input count match",
  schemaInputKeys.length === allFormulaKeys.length,
  `schema=${schemaInputKeys.length} formula=${allFormulaKeys.length}`);

const dead = schemaInputKeys.filter(k => !allFormulaKeys.includes(k));
check("No dead inputs", dead.length === 0, dead.length > 0 ? dead.join(", ") : undefined);

const hidden = allFormulaKeys.filter(k => !schemaInputKeys.includes(k));
check("No hidden required inputs", hidden.length === 0, hidden.length > 0 ? hidden.join(", ") : undefined);

check("n_source_confidence_ratio absent",
  !allFormulaKeys.includes("n_source_confidence_ratio") && !schemaInputKeys.includes("n_source_confidence_ratio"));

// ── 2. Output key parity ──
console.log("2. Schema ↔ formula output key parity...");

const fullInputs: Record<string, number> = { ...CORE_INPUTS,
  n_annual_production_volume: 100000, n_cycle_time_seconds: 720,
  n_setup_time_minutes: 8, n_average_batch_quantity: 500,
};
const result = calculate(fullInputs);
const formulaOutKeys = Object.keys(result.outputs).sort();
const schemaOutKeys = schema.outputs.map((o: any) => o.id).sort();

check("Total output count",
  formulaOutKeys.length === APPROVED_TOTAL_OUTPUT_COUNT,
  `approved=${APPROVED_TOTAL_OUTPUT_COUNT} actual=${formulaOutKeys.length}`);

check("Schema ↔ formula output count",
  schemaOutKeys.length === formulaOutKeys.length,
  `schema=${schemaOutKeys.length} formula=${formulaOutKeys.length}`);

const schemaExtra = schemaOutKeys.filter(k => !formulaOutKeys.includes(k));
const formulaExtra = formulaOutKeys.filter(k => !schemaOutKeys.includes(k));
check("No extra schema outputs", schemaExtra.length === 0, schemaExtra.length > 0 ? schemaExtra.join(", ") : undefined);
check("No extra formula outputs", formulaExtra.length === 0, formulaExtra.length > 0 ? formulaExtra.join(", ") : undefined);

const coreOutKeys = formulaOutKeys.filter(k => !SCENARIO_OUTPUT_KEYS.includes(k));
const optOutKeys = formulaOutKeys.filter(k => SCENARIO_OUTPUT_KEYS.includes(k));
check(`Core count = ${APPROVED_CORE_OUTPUT_COUNT}`, coreOutKeys.length === APPROVED_CORE_OUTPUT_COUNT,
  `actual=${coreOutKeys.length}`);
check(`Optional count = ${APPROVED_OPTIONAL_OUTPUT_COUNT}`, optOutKeys.length === APPROVED_OPTIONAL_OUTPUT_COUNT,
  `actual=${optOutKeys.length}`);

// ── 3. Golden fixture output coverage ──
console.log("3. Golden fixture output coverage...");
for (const fx of golden.fixtures as Array<{ name: string; expected_outputs: Record<string, number> }>) {
  const fxKeys = Object.keys(fx.expected_outputs).sort();
  const missing = formulaOutKeys.filter(k => !fxKeys.includes(k));
  const extra = fxKeys.filter(k => !formulaOutKeys.includes(k));
  check(`[${fx.name}] All outputs covered`, missing.length === 0,
    missing.length > 0 ? `missing: ${missing.join(", ")}` : undefined);
  check(`[${fx.name}] No extra keys`, extra.length === 0,
    extra.length > 0 ? `extra: ${extra.join(", ")}` : undefined);
}

// ── 4. All-or-nothing scenario ──
console.log("4. Optional scenario all-or-nothing...");
const partialResult = calculate({ ...CORE_INPUTS, n_annual_production_volume: 100000 });
check("Partial scenario → NOT_COMPUTED", partialResult.outputs.out_production_scenario_state === -1);
check("Partial scenario → finite", allFinite(partialResult.outputs));

const noScenarioResult = calculate({ ...CORE_INPUTS });
check("No scenario → NOT_COMPUTED", noScenarioResult.outputs.out_production_scenario_state === -1);
check("No scenario → finite", allFinite(noScenarioResult.outputs));

// ── 5. No clamping ──
console.log("5. No output clamping...");
check("Capacity > 100% preserved",
  result.outputs.out_capacity_requirement_percent > 100,
  `value=${result.outputs.out_capacity_requirement_percent}`);

// ── 6. NaN/Infinity guard ──
console.log("6. NaN/Infinity protection...");
const edgeCases: Array<[string, Record<string, number>]> = [
  ["utilization=0", { ...CORE_INPUTS, n_utilization_percent: 0 }],
  ["margin=100%", { ...CORE_INPUTS, n_target_margin_percent: 100 }],
  ["rate_below_variable", { ...CORE_INPUTS, n_current_shop_rate: 5, n_labor_rate_per_hour: 100 }],
  ["negative_economic_life", { ...CORE_INPUTS, n_economic_life_years: -5 }],
  ["zero_inputs", {}],
];
for (const [label, inputs] of edgeCases) {
  const r = calculate(inputs);
  check(`[${label}] no NaN`, !Object.values(r.outputs).some(v => typeof v === "number" && Number.isNaN(v)));
  check(`[${label}] all finite`, allFinite(r.outputs));
}

// ── Summary ──
console.log("");
if (failures.length === 0) {
  console.log("MACHINE_HOURLY_RATE_CONTRACT_PARITY = PASS");
} else {
  console.log(`MACHINE_HOURLY_RATE_CONTRACT_PARITY = FAIL (${failures.length} failures)`);
  process.exit(1);
}
