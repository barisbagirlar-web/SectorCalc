#!/usr/bin/env node
// Guard: job-quote-builder-pro-pack numeric consistency
// Checks that the stored golden fixture values reconcile correctly
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

let pass = true;

const goldenPath = resolve(ROOT, "tests/golden/pro-v531-baris/job-quote-builder-pro-pack.golden.json");
const golden = JSON.parse(readFileSync(goldenPath, "utf-8"));

const TOLERANCE_CURRENCY = 0.02;

console.log("\n=== JOB QUOTE NUMERIC CONSISTENCY ===\n");

for (const fixture of golden.fixtures) {
  const label = fixture.label;
  const O = fixture.expected_outputs;
  console.log(`Fixture: ${label}`);

  // Check direct_cost = sum of components
  const directSum = (O.out_material_cost_before_scrap ?? 0)
    + (O.out_machine_cost_per_batch ?? 0)
    + (O.out_labor_cost_per_batch ?? 0)
    + (O.out_overhead_cost_per_batch ?? 0)
    + (O.out_tooling_consumables_cost_per_batch ?? 0)
    + (O.out_external_processing_cost_per_batch ?? 0)
    + (O.out_packaging_cost_per_batch ?? 0)
    + (O.out_freight_cost_per_batch ?? 0)
    + (O.out_other_job_cost_per_batch ?? 0);

  if (Math.abs(directSum - O.out_direct_cost_before_scrap) > TOLERANCE_CURRENCY) {
    console.error(`  FAIL: Direct cost sum ${directSum.toFixed(2)} != ${O.out_direct_cost_before_scrap.toFixed(2)}`); pass = false;
  }

  // Check total_job_cost = direct + scrap + contingency
  const totalCheck = (O.out_direct_cost_before_scrap ?? 0)
    + (O.out_scrap_rework_allowance ?? 0)
    + (O.out_contingency_allowance ?? 0);

  if (Math.abs(totalCheck - O.out_total_job_cost_per_batch) > TOLERANCE_CURRENCY) {
    console.error(`  FAIL: Total cost sum ${totalCheck.toFixed(2)} != ${O.out_total_job_cost_per_batch.toFixed(2)}`); pass = false;
  }

  // Check cost_per_good_unit = total / batch_qty
  const bq = fixture.raw_inputs.n_batch_quantity;
  if (bq > 0) {
    const cpu = O.out_total_job_cost_per_batch / bq;
    if (Math.abs(cpu - O.out_cost_per_good_unit) > TOLERANCE_CURRENCY + 0.001) {
      console.error(`  FAIL: Cost per unit ${cpu.toFixed(4)} != ${O.out_cost_per_good_unit.toFixed(4)}`); pass = false;
    }
  }

  // Check profit = target_price - total_cost
  const profitCheck = (O.out_target_sell_price_per_batch ?? 0) - (O.out_total_job_cost_per_batch ?? 0);
  if (Math.abs(profitCheck - O.out_profit_per_batch) > TOLERANCE_CURRENCY) {
    console.error(`  FAIL: Profit ${profitCheck.toFixed(2)} != ${O.out_profit_per_batch.toFixed(2)}`); pass = false;
  }

  // Check margin = profit / target_price
  if (O.out_target_sell_price_per_batch > 0) {
    const marginPct = profitCheck / O.out_target_sell_price_per_batch * 100;
    // margin isn't an output, just a sanity check
  }

  // No NaN, Infinity, null
  for (const [key, val] of Object.entries(O)) {
    if (typeof val === "number" && (!Number.isFinite(val))) {
      console.error(`  FAIL: ${key} is ${val}`); pass = false;
    }
  }

  console.log(`  Direct cost: ${directSum.toFixed(2)} == ${O.out_direct_cost_before_scrap.toFixed(2)}: ${Math.abs(directSum - O.out_direct_cost_before_scrap) <= TOLERANCE_CURRENCY ? "OK" : "FAIL"}`);
  console.log(`  Total cost: ${totalCheck.toFixed(2)} == ${O.out_total_job_cost_per_batch.toFixed(2)}: ${Math.abs(totalCheck - O.out_total_job_cost_per_batch) <= TOLERANCE_CURRENCY ? "OK" : "FAIL"}`);
}

console.log(`\nRESULT: ${pass ? "PASS" : "FAIL"} — Numeric consistency`);
process.exit(pass ? 0 : 1);
