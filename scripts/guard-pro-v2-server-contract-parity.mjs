// Guard: PRO V2 Server Contract Parity
// Required payload keys must match server schema keys.
// Expected outputs must match formula output keys.

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

let allPass = true;

const registerPath = resolve(ROOT, "src/sectorcalc/pro-v2/register-weld-tool.ts");
const registerSrc = readFileSync(registerPath, "utf-8");

// Check required input keys present
const REQUIRED_KEYS = [
  "weld_length_m", "weld_throat_mm", "weld_density",
  "wire_cost_per_kg", "gas_cost_per_min",
  "arc_time_min", "weld_time_min", "labor_rate", "overhead_rate",
  "deposition_efficiency", "source_confidence",
];

for (const key of REQUIRED_KEYS) {
  if (!registerSrc.includes(key)) {
    console.error(`FAIL: Required input key '${key}' not found in register-weld-tool.ts`);
    allPass = false;
  }
}

// Check expected output keys
const EXPECTED_OUTPUTS = [
  "out_evidence_completeness", "out_normalized_demand", "out_reference_deviation",
  "out_derating_factor", "out_demand_metric", "out_capacity_metric",
  "out_utilization_margin", "out_expanded_uncertainty", "out_threshold_crossing",
  "out_sensitivity_driver", "out_fmea_trigger", "out_money_at_risk",
  "out_scenario_delta", "out_audit_hash_payload", "out_final_decision_state",
];

for (const key of EXPECTED_OUTPUTS) {
  if (!registerSrc.includes(key)) {
    console.error(`FAIL: Expected output key '${key}' not found in register-weld-tool.ts`);
    allPass = false;
  }
}

// Load adapter and verify its keys match
const adapterPath = resolve(ROOT, "src/sectorcalc/pro-v2/adapters/weld-procedure-cost-consumable-estimation-suite.adapter.ts");
const adapterSrc = readFileSync(adapterPath, "utf-8");

const ADAPTER_EXPECTED_KEYS = [
  "weld_length", "weld_throat", "wire_cost", "gas_cost",
  "arc_time", "total_job_time", "labor_rate", "shop_overhead_rate",
  "deposition_efficiency", "planned_quote", "contingency",
];

for (const key of ADAPTER_EXPECTED_KEYS) {
  if (!adapterSrc.includes(key)) {
    console.warn(`WARN: Adapter does not reference form field '${key}'`);
  }
}

console.log(`\nGUARD: PRO V2 Server Contract Parity`);
console.log(`====================================`);
if (allPass) {
  console.log(`RESULT: PASS — Server contract keys verified (${REQUIRED_KEYS.length} inputs, ${EXPECTED_OUTPUTS.length} outputs)`);
} else {
  console.error(`\nRESULT: FAIL — Server contract parity violations detected`);
  process.exit(1);
}
