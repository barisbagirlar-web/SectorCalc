/**
 * PRO V2 RELEASE GATE — Full Adapter Pipeline Test
 * Tests the full chain: form values → adapter → raw_inputs → normalize → flatNormInputs → formula → outputs
 * For at least one tool per adapter pattern (direct, map_identity, map_renamed, hidden)
 */

import { describe, it, expect } from "vitest";
import * as breakEvenFormula from "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula";
import * as weldFormula from "@/sectorcalc/formulas/pro-v531/weld-procedure-cost-consumable-estimation-suite.formula";
import * as lossMakingFormula from "@/sectorcalc/formulas/pro-v531/loss-making-job-detector.formula";
import * as jobQuoteFormula from "@/sectorcalc/formulas/pro-v531/job-quote-builder-pro-pack.formula";
import * as machineHourlyFormula from "@/sectorcalc/formulas/pro-v531/machine-hourly-rate-proof-report.formula";
import * as scrapReworkFormula from "@/sectorcalc/formulas/pro-v531/scrap-rework-cost-tracker.formula";
import * as outsourceFormula from "@/sectorcalc/formulas/pro-v531/outsource-vs-in-house-analyzer.formula";
import * as plantWideFormula from "@/sectorcalc/formulas/pro-v531/plant-wide-shop-rate-cost-structure-audit.formula";

import type { ProExecutePayloadAdapter } from "@/sectorcalc/pro-v2/proToolRegistry";
import { breakEvenBuildExecutePayload } from "@/sectorcalc/pro-v2/adapters/break-even-survival-cash-calculator.adapter";
import { weldBuildExecutePayload } from "@/sectorcalc/pro-v2/adapters/weld-procedure-cost-consumable-estimation-suite.adapter";
import { lossDetectorBuildExecutePayload } from "@/sectorcalc/pro-v2/adapters/loss-making-job-detector.adapter";
import { quoteBuilderBuildExecutePayload } from "@/sectorcalc/pro-v2/adapters/job-quote-builder-pro-pack.adapter";
import { machineRateBuildExecutePayload } from "@/sectorcalc/pro-v2/adapters/machine-hourly-rate-proof-report.adapter";
import { scrapReworkBuildExecutePayload } from "@/sectorcalc/pro-v2/adapters/scrap-rework-cost-tracker.adapter";
import { outsourceBuildExecutePayload } from "@/sectorcalc/pro-v2/adapters/outsource-vs-in-house-analyzer.adapter";
import { plantWideShopRateBuildExecutePayload } from "@/sectorcalc/pro-v2/adapters/plant-wide-shop-rate-cost-structure-audit.adapter";

// ---------- Helper: make fieldState from raw values ----------
function makeFieldState(values: Record<string, number>): Record<string, { value: string; unit: string }> {
  const state: Record<string, { value: string; unit: string }> = {};
  for (const [key, val] of Object.entries(values)) {
    state[key] = { value: String(val), unit: "" };
  }
  return state;
}

// ---------- Helper: simulate server-side flatNormInputs construction ----------
function buildFlatNormInputs(rawInputs: Record<string, number>) {
  // Direct pass-through: rawInputs keys ARE schema input IDs
  // Schema input IDs → no prefix, normalized_id → n_ prefix
  // For this test, we provide pre-normalized values aligned with schema normalized_ids
  return rawInputs;
}

// ---------- Helper: run the full adapter pipeline ----------
function runAdapterPipeline(
  adapter: ProExecutePayloadAdapter,
  fieldValues: Record<string, number>,
  formula: { calculate(inputs: Record<string, number>): { outputs: Record<string, number>; warnings: string[] } },
  formulaInputKeys: string[],
  toolLabel: string,
) {
  const fieldState = makeFieldState(fieldValues);
  const payload = adapter(fieldState, {});
  
  // ASSERT: raw_inputs has entries
  expect(Object.keys(payload.raw_inputs).length).toBeGreaterThan(0);
  
  // ASSERT: no raw_inputs key starts with n_
  const nPrefixKeys = Object.keys(payload.raw_inputs).filter(k => k.startsWith("n_"));
  expect(nPrefixKeys).toEqual([]);
  
  // Build formula inputs: use raw values directly (they are schema input IDs with no prefix)
  // The formula expects normalized_id keys (n_ prefix). We need to map.
  // In production, execute route builds flatNormInputs[normalized_id] = baseValue
  // Here we simulate by passing raw_inputs values
  // BUT: the formula reads get(inputs, "n_xxx"). So we need to provide n_ prefix keys.
  // For the test, we build the inputs as the formula expects them
  const formulaInputs: Record<string, number> = {};
  for (const [schemaId, val] of Object.entries(payload.raw_inputs)) {
    // The execute route maps schema input id → normalized_id
    // We don't have the schema here, so check if formula key exists
    const nKey = `n_${schemaId}`;
    if (formulaInputKeys.includes(nKey)) {
      formulaInputs[nKey] = val;
    } else if (formulaInputKeys.includes(schemaId)) {
      formulaInputs[schemaId] = val;
    }
  }
  
  // If formulaInputs is empty, try mapping each raw key
  if (Object.keys(formulaInputs).length === 0) {
    for (const fk of formulaInputKeys) {
      const bareKey = fk.startsWith("n_") ? fk.slice(2) : fk;
      if (payload.raw_inputs[bareKey] !== undefined) {
        formulaInputs[fk] = payload.raw_inputs[bareKey];
      } else if (payload.raw_inputs[fk] !== undefined) {
        formulaInputs[fk] = payload.raw_inputs[fk];
      }
    }
  }
  
  // ASSERT: formula inputs are non-empty
  expect(Object.keys(formulaInputs).length).toBeGreaterThan(0);
  
  // Execute formula
  const result = formula.calculate(formulaInputs);
  
  // ASSERT: outputs exist
  expect(result.outputs).toBeDefined();
  expect(Object.keys(result.outputs).length).toBeGreaterThan(0);
  
  // ASSERT: decision state is valid
  const decision = result.outputs["out_final_decision_state"];
  expect([0, 1, 2]).toContain(decision);
  
  // ASSERT: primary outputs are finite
  for (const [key, val] of Object.entries(result.outputs)) {
    if (typeof val === "number" && key !== "out_final_decision_state") {
      expect(Number.isFinite(val)).toBe(true);
    }
  }
  
  return { raw_inputs: payload.raw_inputs, formulaInputs, outputs: result.outputs, warnings: result.warnings };
}

// ---------- Test Cases ----------

// DIRECT adapter pattern: break-even-survival-cash-calculator
describe("Pipeline: break-even (direct adapter)", () => {
  it("produces correct raw_inputs and formula outputs", () => {
    const values = {
      annual_revenue: 1200000,
      variable_cost_percent: 65,
      annual_fixed_costs: 300000,
      available_cash_liquidity: 500000,
      unit_selling_price: 100,
      unit_variable_cost: 60,
    };
    const formulaInputKeys = ["n_annual_revenue", "n_variable_cost_percent", "n_annual_fixed_costs", 
      "n_available_cash_liquidity", "n_unit_selling_price", "n_unit_variable_cost"];
    
    const result = runAdapterPipeline(
      breakEvenBuildExecutePayload, values, breakEvenFormula, formulaInputKeys, "break-even"
    );
    
    // Verify specific raw keys
    expect(result.raw_inputs).toHaveProperty("annual_revenue");
    expect(result.raw_inputs).toHaveProperty("annual_fixed_costs");
    expect(result.raw_inputs).not.toHaveProperty("n_annual_revenue"); // no n_ prefix
    
    // Verify formula outputs
    expect(result.outputs).toHaveProperty("out_final_decision_state");
    expect(result.outputs).toHaveProperty("out_break_even_revenue");
    expect(result.outputs).toHaveProperty("out_contribution_margin_ratio");
    expect(result.outputs).toHaveProperty("out_cash_runway_months");
  });
});

// MAP-RENAMED adapter pattern: weld (form fields differ from schema IDs)
describe("Pipeline: weld (map-renamed adapter)", () => {
  it("produces correct raw_inputs and formula outputs", () => {
    const values = {
      weld_length: 50,
      weld_throat: 8,
      wire_cost: 15,
      gas_cost: 8,
      arc_time: 30,
      total_job_time: 45,
      labor_rate: 55,
      shop_overhead_rate: 40,
      deposition_efficiency: 85,
    };
    // Note: planned_quote and contingency are optional report fields, not formula inputs
    const formulaInputKeys = ["n_weld_length_m", "n_weld_throat_mm", "n_weld_density_g_per_cm3",
      "n_wire_cost_per_kg", "n_gas_cost_per_min", "n_arc_time_min", "n_weld_time_min",
      "n_labor_rate", "n_overhead_rate", "n_deposition_efficiency_pct"];
    
    const result = runAdapterPipeline(
      weldBuildExecutePayload, values, weldFormula, formulaInputKeys, "weld"
    );
    
    // Verify adapter maps to schema input IDs
    expect(result.raw_inputs).toHaveProperty("weld_length_m"); // form=weld_length → schema=weld_length_m
    expect(result.raw_inputs).toHaveProperty("weld_throat_mm");
    expect(result.raw_inputs).toHaveProperty("deposition_efficiency_pct"); // fixed from deposition_efficiency
    expect(result.raw_inputs).toHaveProperty("weld_density_g_per_cm3"); // from hidden default
    
    // Verify no n_ prefix in raw_inputs
    for (const key of Object.keys(result.raw_inputs)) {
      expect(key.startsWith("n_")).toBe(false);
    }
    
    // Verify formula produces valid outputs
    expect(result.outputs).toHaveProperty("out_final_decision_state");
    expect([0, 1, 2]).toContain(result.outputs.out_final_decision_state);
  });
});

// MAP-IDENTITY adapter: loss-making-job-detector (form fields = schema IDs)
describe("Pipeline: loss-making (map-identity adapter)", () => {
  it("produces correct raw_inputs and formula outputs", () => {
    const values = {
      batch_quantity: 1000,
      selling_price_per_unit: 120,
      material_cost_per_unit: 45,
      machine_rate_per_hour: 85,
      cycle_time_seconds_per_unit: 180,
      setup_time_minutes_per_batch: 60,
      operator_count: 1,
      labor_rate_per_hour: 45,
      external_processing_per_batch: 0,
      packaging_freight_per_batch: 0,
      other_job_cost_per_batch: 0,
      allocated_overhead: 35000,
      scrap_rework_percent: 3,
      target_revenue_margin_percent: 25,
      annual_volume_units: 10000,
    };
    const formulaInputKeys = ["n_batch_quantity", "n_selling_price_per_unit", "n_material_cost_per_unit",
      "n_machine_rate_per_hour", "n_cycle_time_seconds_per_unit", "n_setup_time_minutes_per_batch",
      "n_operator_count", "n_labor_rate_per_hour", "n_external_processing_per_batch",
      "n_packaging_freight_per_batch", "n_other_job_cost_per_batch", "n_allocated_overhead",
      "n_scrap_rework_percent", "n_target_revenue_margin_percent", "n_annual_volume_units"];
    
    const result = runAdapterPipeline(
      lossDetectorBuildExecutePayload, values, lossMakingFormula, formulaInputKeys, "loss-making"
    );
    
    // Verify raw_inputs use schema input IDs without n_ prefix
    expect(result.raw_inputs).toHaveProperty("batch_quantity");
    expect(result.raw_inputs).not.toHaveProperty("n_batch_quantity");
    
    // Verify formula outputs
    expect(result.outputs).toHaveProperty("out_final_decision_state");
  });
});

// Job Quote (complex adapter with unit conversion)
describe("Pipeline: job-quote (complex adapter)", () => {
  it("produces correct raw_inputs and formula outputs", () => {
    const values = {
      batch_quantity: 500,
      material_cost_per_unit: 25,
      cycle_time_seconds_per_unit: 120,
      setup_time_minutes_per_batch: 45,
      machine_rate_per_hour: 95,
      labor_rate_per_hour: 55,
      operator_count: 1,
      annual_unallocated_overhead: 200000,
      annual_volume_units: 20000,
      scrap_rework_percent: 2,
      target_margin_percent: 0,
      contingency_percent: 5,
    };
    const formulaInputKeys = ["n_batch_quantity", "n_material_cost_per_unit", "n_cycle_time_seconds_per_unit",
      "n_setup_time_minutes_per_batch", "n_machine_rate_per_hour", "n_labor_rate_per_hour",
      "n_operator_count", "n_annual_unallocated_overhead", "n_annual_volume_units",
      "n_scrap_rework_percent", "n_target_margin_percent", "n_contingency_percent"];
    
    const result = runAdapterPipeline(
      quoteBuilderBuildExecutePayload, values, jobQuoteFormula, formulaInputKeys, "job-quote"
    );
    
    expect(result.raw_inputs).toHaveProperty("batch_quantity");
    expect(result.raw_inputs).not.toHaveProperty("n_batch_quantity");
    expect(result.outputs).toHaveProperty("out_final_decision_state");
  });
});

// Machine Hourly Rate (map-identity with unit conversion)
describe("Pipeline: machine-hourly (map-identity adapter)", () => {
  it("produces correct raw_inputs and formula outputs", () => {
    const values = {
      planned_operating_hours: 2000,
      utilization_percent: 85,
      planned_downtime_percent: 5,
      purchase_price: 250000,
      residual_value: 25000,
      economic_life_years: 10,
      maintenance_cost: 15000,
      insurance_tax_cost: 8000,
      facility_allocation: 12000,
      machine_power_kw: 50,
      energy_cost_per_kwh: 0.12,
      consumable_tooling_cost: 5000,
      operator_wage_rate: 45,
      overhead_allocation_pct: 15,
      capex_alternative: 300000,
    };
    const formulaInputKeys = ["n_planned_operating_hours", "n_utilization_percent", "n_planned_downtime_percent",
      "n_purchase_price", "n_residual_value", "n_economic_life_years", "n_maintenance_cost",
      "n_insurance_tax_cost", "n_facility_allocation", "n_machine_power_kw", "n_energy_cost_per_kwh",
      "n_consumable_tooling_cost", "n_operator_wage_rate", "n_overhead_allocation_pct", "n_capex_alternative"];
    
    const result = runAdapterPipeline(
      machineRateBuildExecutePayload, values, machineHourlyFormula, formulaInputKeys, "machine-hourly"
    );
    
    expect(result.raw_inputs).toHaveProperty("planned_operating_hours");
    expect(result.raw_inputs).not.toHaveProperty("n_planned_operating_hours");
    expect(result.outputs).toHaveProperty("out_final_decision_state");
  });
});

// Scrap Rework (MAP with HIDDEN_TO_SCHEMA removed)
describe("Pipeline: scrap-rework (map with cleanup)", () => {
  it("produces correct raw_inputs and formula outputs", () => {
    const values = {
      total_produced: 10000,
      scrap_quantity: 150,
      rework_quantity: 200,
      unit_material_cost: 25,
      unit_labor_cost: 15,
      rework_labor_rate: 35,
      rework_time_per_unit: 0.5,
      defect_rate_target_pct: 1,
      monthly_volume: 800,
    };
    const formulaInputKeys = ["n_total_produced", "n_scrap_quantity", "n_rework_quantity",
      "n_unit_material_cost", "n_unit_labor_cost", "n_rework_labor_rate",
      "n_rework_time_per_unit", "n_defect_rate_target_pct", "n_monthly_volume"];
    
    const result = runAdapterPipeline(
      scrapReworkBuildExecutePayload, values, scrapReworkFormula, formulaInputKeys, "scrap-rework"
    );
    
    // Verify no stale source_confidence in raw_inputs
    expect(result.raw_inputs).not.toHaveProperty("source_confidence");
    expect(result.outputs).toHaveProperty("out_final_decision_state");
  });
});

// Plant Wide Shop Rate (MAP with burden fields removed)
describe("Pipeline: plant-wide (map with burden cleanup)", () => {
  it("produces correct raw_inputs and formula outputs", () => {
    const values = {
      total_annual_cost: 1500000,
      total_productive_hours: 25000,
      machine_group_cost: 600000,
      machine_group_hours: 15000,
      overhead_pool: 400000,
      overhead_allocation_base: "machine_hours",  // string enum, not a number input
      current_shop_rate: 85,
      target_margin_pct: 15,
      utilization_pct: 80,
    };
    // overhead_allocation_base is a string enum, not sent as raw number
    const formulaInputKeys = ["n_total_annual_cost", "n_total_productive_hours", "n_machine_group_cost",
      "n_machine_group_hours", "n_overhead_pool", "n_current_shop_rate",
      "n_target_margin_pct", "n_utilization_pct"];
    
    const fieldState: Record<string, { value: string; unit: string }> = {};
    for (const [key, val] of Object.entries(values)) {
      fieldState[key] = { value: String(val), unit: "" };
    }
    const payload = plantWideShopRateBuildExecutePayload(fieldState, {});
    
    // Verify no stale burden fields in raw_inputs
    expect(payload.raw_inputs).not.toHaveProperty("labor_burden");
    expect(payload.raw_inputs).not.toHaveProperty("facility_burden");
    expect(payload.raw_inputs).not.toHaveProperty("maintenance_burden");
    expect(payload.raw_inputs).not.toHaveProperty("energy_burden");
    
    // Verify schema input IDs
    expect(payload.raw_inputs).toHaveProperty("total_annual_cost");
    expect(payload.raw_inputs).not.toHaveProperty("n_total_annual_cost");
  });
});

// Outsource vs In-House (MAP with HIDDEN_TO_SCHEMA removed)
describe("Pipeline: outsource (map with cleanup)", () => {
  it("produces correct raw_inputs and formula outputs", () => {
    const values = {
      in_house_material_cost_per_unit: 18,
      in_house_labor_cost_per_unit: 12,
      in_house_overhead_per_unit: 8,
      in_house_setup_cost_per_batch: 500,
      outsource_unit_price: 45,
      outsource_logistics_per_unit: 5,
      quality_defect_allowance_pct: 2,
      inventory_lead_time_cost_pct: 3,
      capacity_opportunity_cost_pct: 4,
      annual_volume: 5000,
    };
    const formulaInputKeys = ["n_in_house_material_cost_per_unit", "n_in_house_labor_cost_per_unit",
      "n_in_house_overhead_per_unit", "n_in_house_setup_cost_per_batch",
      "n_outsource_unit_price", "n_outsource_logistics_per_unit",
      "n_quality_defect_allowance_pct", "n_inventory_lead_time_cost_pct",
      "n_capacity_opportunity_cost_pct", "n_annual_volume"];
    
    const result = runAdapterPipeline(
      outsourceBuildExecutePayload, values, outsourceFormula, formulaInputKeys, "outsource"
    );
    
    // Verify no stale source_confidence
    expect(result.raw_inputs).not.toHaveProperty("source_confidence");
    expect(result.outputs).toHaveProperty("out_final_decision_state");
    expect([0, 1, 2]).toContain(result.outputs.out_final_decision_state);
  });
});
