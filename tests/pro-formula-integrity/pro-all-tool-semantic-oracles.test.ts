import { describe, expect, it } from "vitest";

import * as breakEven from "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula";
import * as machineRate from "@/sectorcalc/formulas/pro-v531/machine-hourly-rate-proof-report.formula";
import * as lossDetector from "@/sectorcalc/formulas/pro-v531/loss-making-job-detector.formula";
import * as receivables from "@/sectorcalc/formulas/pro-v531/receivables-cost-payment-term-addendum.formula";
import * as smed from "@/sectorcalc/formulas/pro-v531/setup-time-reduction-roi-smed.formula";
import * as productMargin from "@/sectorcalc/formulas/pro-v531/product-sku-margin-ranker.formula";
import * as employeeCost from "@/sectorcalc/formulas/pro-v531/true-employee-cost-statement.formula";
import * as jobQuote from "@/sectorcalc/formulas/pro-v531/job-quote-builder-pro-pack.formula";
import * as machineInvestment from "@/sectorcalc/formulas/pro-v531/machine-investment-feasibility-buy-lease-keep.formula";
import * as capital from "@/sectorcalc/formulas/pro-v531/capital-equipment-investment-appraisal-npv-irr.formula";
import * as customerSku from "@/sectorcalc/formulas/pro-v531/customer-sku-profitability-forensics.formula";
import * as downtime from "@/sectorcalc/formulas/pro-v531/downtime-scrap-loss-statement.formula";
import * as oee from "@/sectorcalc/formulas/pro-v531/oee-loss-monetization-improvement-business-case.formula";
import * as scrap from "@/sectorcalc/formulas/pro-v531/scrap-rework-cost-tracker.formula";
import * as outsource from "@/sectorcalc/formulas/pro-v531/outsource-vs-in-house-analyzer.formula";
import * as plantRate from "@/sectorcalc/formulas/pro-v531/plant-wide-shop-rate-cost-structure-audit.formula";
import * as fx from "@/sectorcalc/formulas/pro-v531/fx-commodity-pass-through-pricer.formula";
import * as energy from "@/sectorcalc/formulas/pro-v531/energy-efficiency-grant-incentive-feasibility-pack.formula";
import * as motor from "@/sectorcalc/formulas/pro-v531/motor-compressor-replacement-roi.formula";
import * as weld from "@/sectorcalc/formulas/pro-v531/weld-procedure-cost-consumable-estimation-suite.formula";
import { getProReportContract } from "@/sectorcalc/pro-report/pro-report-contract-registry";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";
import { getAllModules } from "@/sectorcalc/formulas/pro-v531/resolve-formula-module";

interface FormulaResult {
  status: "OK" | "REVIEW" | "BLOCKED";
  outputs: Record<string, number>;
  warnings: string[];
  outputKeys: string[];
}

function output(result: FormulaResult, id: string): number {
  const value = result.outputs[id];
  expect(Number.isFinite(value), `${id} must be finite`).toBe(true);
  return value;
}

function expectClose(
  result: FormulaResult,
  id: string,
  expected: number,
  precision = 6,
): void {
  expect(output(result, id), id).toBeCloseTo(expected, precision);
}

describe("20 LIVE PRO independent closed-form semantic oracles", () => {
  it("01 break-even: preserves the cash-survival conservation equations", () => {
    const result = breakEven.calculate({
      n_monthly_fixed_cash_cost: 120000,
      n_monthly_debt_service: 25000,
      n_contribution_margin_ratio: 0.42,
      n_current_monthly_revenue: 420000,
      n_unrestricted_cash_balance: 750000,
      n_minimum_cash_buffer: 100000,
      n_target_survival_months: 6,
      n_downside_revenue_factor: 0.7,
      n_source_confidence_ratio: 0.9,
      n_uncertainty_multiplier: 1.15,
    });
    expect(result.status).toBe("OK");
    expectClose(result, "out_break_even_monthly_revenue", 345238.1, 2);
    expectClose(result, "out_current_revenue_gap", 74761.9, 2);
    expectClose(result, "out_stressed_monthly_revenue", 294000, 2);
    expectClose(result, "out_monthly_cash_burn", 21520, 2);
    expectClose(result, "out_cash_runway_months", 30.2, 2);
    expectClose(result, "out_uncertainty_cash_buffer", 19368, 2);
    expectClose(result, "out_survival_cash_target", 248488, 2);
    expectClose(result, "out_funding_gap", 0, 8);
    expectClose(result, "out_margin_of_safety_ratio", 0.178, 4);
  });

  it("02 machine hourly rate: one hour at 85/h costs exactly 85", () => {
    const result = machineRate.calculate({
      n_machine_rate: 85,
      n_cycle_time: 3600,
      n_setup_time: 0,
      n_batch_quantity: 1,
      n_material_cost: 0,
      n_target_margin: 0,
      n_annual_volume: 1,
      n_labor_rate: 0,
      n_overhead_rate: 0,
      n_defect_or_loss_cost: 0,
      n_source_confidence_ratio: 1,
      n_uncertainty_multiplier: 1,
    });
    expect(result.status).toBe("OK");
    expectClose(result, "out_demand_metric", 85, 8);
    expectClose(result, "out_capacity_metric", 1, 8);
    expectClose(result, "out_utilization_margin", 85, 8);
    expectClose(result, "out_scenario_delta", 0, 8);
  });

  it("03 loss detector: converts material /batch to /unit and rejects a deeply loss-making quote", () => {
    const result = lossDetector.calculate({
      n_machine_rate: 8,
      n_material_cost: 300,
      n_labor_rate: 55,
      n_overhead_rate: 75,
      n_defect_or_loss_cost: 20,
      n_target_margin: 0.25,
      n_batch_quantity: 100,
      n_annual_volume: 5000,
      n_source_confidence_ratio: 0.9,
    });
    expect(result.status).toBe("REVIEW");
    expectClose(result, "out_normalized_demand", 800, 8);
    expectClose(result, "out_demand_metric", -145, 8);
    expectClose(result, "out_capacity_metric", 204, 8);
    expectClose(result, "out_utilization_margin", -18.125, 8);
    expectClose(result, "out_reference_deviation", -196, 8);
    expectClose(result, "out_scenario_delta", -14500, 8);
    expectClose(result, "out_money_at_risk", 797500, 8);
    expectClose(result, "out_final_decision_state", 2, 8);
  });

  it("04 receivables: annualizes invoice financing, admin and credit-loss cost", () => {
    const result = receivables.calculate({
      n_machine_rate: 1000,
      n_cycle_time: 30,
      n_batch_quantity: 12,
      n_material_cost: 12,
      n_overhead_rate: 10,
      n_defect_or_loss_cost: 5,
      n_source_confidence_ratio: 1,
    });
    expect(result.status).toBe("REVIEW");
    expectClose(result, "out_utilization_margin", 24.86, 2);
    expectClose(result, "out_demand_metric", 298.36, 2);
    expectClose(result, "out_capacity_metric", 1024.86, 2);
    expectClose(result, "out_reference_deviation", 0.024863, 6);
  });

  it("05 SMED: converts saved seconds to annual recovered hours and payback", () => {
    const result = smed.calculate({
      n_machine_rate: 100,
      n_setup_time: 3600,
      n_batch_quantity: 1800,
      n_annual_volume: 100,
      n_labor_rate: 50,
      n_overhead_rate: 10000,
      n_source_confidence_ratio: 1,
    });
    expect(result.status).toBe("REVIEW");
    expectClose(result, "out_normalized_demand", 50, 8);
    expectClose(result, "out_demand_metric", 7500, 8);
    expectClose(result, "out_utilization_margin", 0.75, 8);
    expectClose(result, "out_scenario_delta", 16, 8);
    expectClose(result, "out_reference_deviation", 0.5, 8);
  });

  it("06 product SKU margin: allocates annual pools per unit before margin", () => {
    const result = productMargin.calculate({
      n_machine_rate: 100,
      n_cycle_time: 3600,
      n_material_cost: 20,
      n_target_margin: 0.25,
      n_annual_volume: 1000,
      n_labor_rate: 30,
      n_overhead_rate: 10000,
      n_defect_or_loss_cost: 5000,
      n_source_confidence_ratio: 1,
    });
    expect(result.status).toBe("OK");
    expectClose(result, "out_demand_metric", 35, 8);
    expectClose(result, "out_capacity_metric", 100, 8);
    expectClose(result, "out_utilization_margin", 0.35, 8);
    expectClose(result, "out_scenario_delta", 35000, 8);
    expectClose(result, "out_reference_deviation", 13.3333, 4);
  });

  it("07 true employee cost: sums only entered annual ledger values", () => {
    const result = employeeCost.calculate({
      n_labor_rate: 90000,
      n_overhead_rate: 25000,
      n_source_confidence_ratio: 1,
    });
    expect(result.status).toBe("OK");
    expectClose(result, "out_fully_loaded_annual_cost", 115000, 8);
    expectClose(result, "out_monthly_employer_cost", 9583.33, 2);
    expectClose(result, "out_base_to_loaded_multiplier", 1.277778, 6);
  });

  it("08 job quote: uses gross margin cost/(1-margin), not markup", () => {
    const result = jobQuote.calculate({
      n_machine_rate: 0,
      n_cycle_time: 0.000001,
      n_setup_time: 0,
      n_batch_quantity: 1,
      n_material_cost: 100,
      n_target_margin: 0.2,
      n_annual_volume: 1,
      n_labor_rate: 0,
      n_overhead_rate: 0,
      n_defect_or_loss_cost: 0,
      n_source_confidence_ratio: 1,
      n_uncertainty_multiplier: 1,
    });
    expect(result.status).toBe("OK");
    expectClose(result, "out_demand_metric", 100, 8);
    expectClose(result, "out_capacity_metric", 125, 8);
    expectClose(result, "out_utilization_margin", 0.2, 8);
    expectClose(result, "out_scenario_delta", 25, 8);
  });

  it("09 buy/lease/keep: selects the highest NPV alternative", () => {
    const result = machineInvestment.calculate({
      n_initial_investment: 100,
      n_annual_net_cash_flow: 30,
      n_discount_rate: 0,
      n_analysis_years: 1,
      n_residual_value: 0,
      n_stress_downside_factor: 1,
      n_annual_volume: 10,
      n_labor_rate: 15,
      n_overhead_rate: 0,
      n_defect_or_loss_cost: 20,
      n_source_confidence_ratio: 1,
      n_uncertainty_multiplier: 1,
    });
    expect(result.status).toBe("OK");
    expectClose(result, "out_demand_metric", -70, 8);
    expectClose(result, "out_capacity_metric", 15, 8);
    expectClose(result, "out_utilization_margin", 10, 8);
    expectClose(result, "out_final_decision_state", 1, 8);
  });

  it("10 capital appraisal: includes residual once and solves the IRR root", () => {
    const result = capital.calculate({
      n_initial_investment: 100,
      n_annual_net_cash_flow: 60,
      n_discount_rate: 0,
      n_analysis_years: 2,
      n_residual_value: 0,
      n_stress_downside_factor: 1,
      n_annual_volume: 0,
      n_labor_rate: 0,
      n_overhead_rate: 0,
      n_defect_or_loss_cost: 0,
      n_source_confidence_ratio: 1,
      n_uncertainty_multiplier: 1,
    });
    expect(result.status).toBe("OK");
    expectClose(result, "out_demand_metric", 20, 8);
    expectClose(result, "out_capacity_metric", 0.130662, 6);
    expectClose(result, "out_utilization_margin", 1.2, 8);
  });

  it("11 customer SKU: cost-to-serve burdens reconcile to target margin", () => {
    const result = customerSku.calculate({
      n_unit_price: 100,
      n_unit_variable_cost: 60,
      n_annual_volume: 1000,
      n_logistics_cost_pct: 5,
      n_service_cost_pct: 3,
      n_return_rate_pct: 2,
      n_target_margin: 30,
      n_source_confidence_ratio: 1,
    });
    expect(result.status).toBe("OK");
    expectClose(result, "out_demand_metric", 30, 8);
    expectClose(result, "out_capacity_metric", 30000, 8);
    expectClose(result, "out_utilization_margin", 0.3, 8);
    expectClose(result, "out_reference_deviation", 0, 8);
  });

  it("12 downtime/scrap statement: time, scrap and rework losses conserve total", () => {
    const result = downtime.calculate({
      n_productive_hours: 3600,
      n_actual_hours: 1800,
      n_hourly_rate: 100,
      n_scrap_quantity: 10,
      n_unit_cost: 5,
      n_rework_hours: 1800,
      n_rework_rate: 20,
      n_material_cost: 1000,
      n_defect_rate_pct: 5,
      n_source_confidence_ratio: 1,
    });
    expect(result.status).toBe("REVIEW");
    expectClose(result, "out_demand_metric", 50, 8);
    expectClose(result, "out_capacity_metric", 110, 8);
    expectClose(result, "out_utilization_margin", 0.5, 8);
    expectClose(result, "out_money_at_risk", 110, 8);
    expectClose(result, "out_scenario_delta", 40, 8);
  });

  it("13 OEE: availability, performance and quality losses sum to total loss", () => {
    const result = oee.calculate({
      n_planned_production_time: 100,
      n_operating_time: 90,
      n_net_operating_time: 80,
      n_valuable_operating_time: 72,
      n_ideal_cycle_time: 1,
      n_total_parts: 80,
      n_good_parts: 72,
      n_hourly_contribution: 3600,
      n_improvement_cost: 0,
      n_source_confidence_ratio: 1,
    });
    expect(result.status).toBe("REVIEW");
    expectClose(result, "out_reference_deviation", 0.72, 8);
    expectClose(result, "out_demand_metric", 10, 8);
    expectClose(result, "out_capacity_metric", 10, 8);
    expectClose(result, "out_expanded_uncertainty", 8, 8);
    expectClose(result, "out_money_at_risk", 28, 8);
  });

  it("14 scrap/rework: period and projected loss use consistent production bases", () => {
    const result = scrap.calculate({
      n_total_produced: 1000,
      n_scrap_quantity: 10,
      n_rework_quantity: 20,
      n_unit_material_cost: 5,
      n_unit_labor_cost: 3,
      n_rework_labor_rate: 20,
      n_rework_time_per_unit: 1800,
      n_defect_rate_target_pct: 2,
      n_monthly_volume: 2000,
      n_source_confidence_ratio: 1,
    });
    expect(result.status).toBe("REVIEW");
    expectClose(result, "out_demand_metric", 80, 8);
    expectClose(result, "out_capacity_metric", 200, 8);
    expectClose(result, "out_reference_deviation", 0.03, 8);
    expectClose(result, "out_utilization_margin", 9.3333, 4);
    expectClose(result, "out_money_at_risk", 280, 8);
    expectClose(result, "out_final_decision_state", 2, 8);
  });

  it("15 outsource vs in-house: setup is allocated per unit and risk premium is explicit", () => {
    const result = outsource.calculate({
      n_in_house_material_cost: 30,
      n_in_house_labor_cost: 40,
      n_in_house_overhead: 10,
      n_in_house_setup_cost: 1000,
      n_outsource_unit_price: 90,
      n_outsource_logistics_cost: 5,
      n_annual_volume: 1000,
      n_quality_risk_premium_pct: 5,
      n_capacity_utilization_pct: 75,
      n_source_confidence_ratio: 1,
    });
    expect(result.status).toBe("OK");
    expectClose(result, "out_demand_metric", 81, 8);
    expectClose(result, "out_capacity_metric", 99.75, 8);
    expectClose(result, "out_scenario_delta", -18750, 8);
    expectClose(result, "out_final_decision_state", 0, 8);
  });

  it("16 plant shop rate: realized hours and gross-margin floor remain dimensionally consistent", () => {
    const result = plantRate.calculate({
      n_total_annual_cost: 2000000,
      n_total_productive_hours: 40000,
      n_machine_group_cost: 500000,
      n_machine_group_hours: 15000,
      n_overhead_pool: 600000,
      n_overhead_allocation_base: 40000,
      n_current_shop_rate: 85,
      n_target_margin_pct: 25,
      n_utilization_pct: 80,
      n_source_confidence_ratio: 1,
    });
    expect(result.status).toBe("OK");
    expectClose(result, "out_normalized_demand", 32000, 8);
    expectClose(result, "out_demand_metric", 62.5, 8);
    expectClose(result, "out_capacity_metric", 33.3333, 4);
    expectClose(result, "out_reference_deviation", -1.6667, 4);
    expectClose(result, "out_money_at_risk", 0, 8);
  });

  it("17 FX/commodity: applies only unhedged material exposure", () => {
    const result = fx.calculate({
      n_base_price: 100,
      n_fx_rate_spot: 1.1,
      n_fx_rate_budget: 1,
      n_commodity_index_current: 120,
      n_commodity_index_budget: 100,
      n_material_cost_pct: 50,
      n_fx_hedge_pct: 0,
      n_commodity_hedge_pct: 0,
      n_annual_volume: 1000,
      n_source_confidence_ratio: 1,
    });
    expect(result.status).toBe("REVIEW");
    expectClose(result, "out_demand_metric", 115, 8);
    expectClose(result, "out_capacity_metric", 15000, 8);
    expectClose(result, "out_utilization_margin", 0.15, 8);
    expectClose(result, "out_reference_deviation", 0.1, 8);
  });

  it("18 energy efficiency: grant-adjusted investment and discounted saving reconcile", () => {
    const result = energy.calculate({
      n_current_kwh_per_year: 1000,
      n_target_kwh_per_year: 500,
      n_avg_kwh_rate: 0.1,
      n_implementation_cost: 40,
      n_grant_coverage_pct: 0,
      n_maintenance_cost_saving: 0,
      n_emission_factor_kgco2_per_kwh: 0,
      n_equipment_life_years: 1,
      n_discount_rate: 0,
      n_source_confidence_ratio: 1,
    });
    expect(result.status).toBe("OK");
    expectClose(result, "out_demand_metric", 50, 8);
    expectClose(result, "out_capacity_metric", 10, 8);
    expectClose(result, "out_utilization_margin", 0.25, 8);
    expectClose(result, "out_reference_deviation", 0.5, 8);
  });

  it("19 motor replacement: electrical input energy and two-year NPV reconcile", () => {
    const result = motor.calculate({
      n_motor_power_kw: 10,
      n_annual_operating_hours: 1000,
      n_current_efficiency_pct: 80,
      n_new_efficiency_pct: 100,
      n_avg_kwh_rate: 0.1,
      n_replacement_cost: 100,
      n_installation_cost: 0,
      n_maintenance_saving_per_year: 0,
      n_equipment_life_years: 2,
      n_discount_rate: 0,
      n_source_confidence_ratio: 1,
    });
    expect(result.status).toBe("OK");
    expectClose(result, "out_demand_metric", 1250, 8);
    expectClose(result, "out_capacity_metric", 1000, 8);
    expectClose(result, "out_utilization_margin", 250, 8);
    expectClose(result, "out_scenario_delta", 4.8, 8);
  });

  it("20 weld: effective-throat geometry produces the independent mass and cost oracle", () => {
    const result = weld.calculate({
      n_weld_length_m: 1,
      n_weld_throat_mm: 10,
      n_weld_density_g_per_cm3: 7850,
      n_wire_cost_per_kg: 1,
      n_gas_cost_per_min: 0,
      n_arc_time_min: 1,
      n_weld_time_min: 1,
      n_labor_rate: 0,
      n_overhead_rate: 0,
      n_deposition_efficiency_pct: 100,
      n_source_confidence_ratio: 1,
    });
    expect(result.status).toBe("REVIEW");
    expectClose(result, "out_wire_mass_kg", 0.785, 3);
    expectClose(result, "out_total_cost_floor", 0.79, 2);
    expectClose(result, "out_cost_per_meter", 0.79, 2);
  });
});

describe("20 LIVE PRO schema, formula and report semantic closure", () => {
  for (const module of getAllModules()) {
    it(`${module.toolKey}: every report output exists in the declared formula namespace`, () => {
      const report = getProReportContract(module.toolKey);
      expect(report, `${module.toolKey} requires a strict report contract`).not.toBeNull();
      const declared = new Set(module.declaredOutputKeys ?? []);
      for (const section of report?.sections ?? []) {
        for (const entry of section.entries) {
          expect(
            declared.has(entry.sourceOutputId),
            `${module.toolKey}:${entry.sourceOutputId} is not a declared output`,
          ).toBe(true);
        }
      }
    });

    it(`${module.toolKey}: every normalized formula input has one visible semantic source`, () => {
      const resolved = resolveApprovedToolSchema(module.toolKey);
      expect(resolved.ok).toBe(true);
      if (!resolved.ok) return;
      const visibleByNormalizedId = new Map(
        resolved.schema.inputs
          .filter((input) => input.normalized_id !== null)
          .map((input) => [input.normalized_id as string, input]),
      );
      for (const id of module.requiredInputKeys ?? []) {
        const input = visibleByNormalizedId.get(id);
        expect(input, `${module.toolKey}:${id} has no visible source input`).toBeDefined();
        expect(input?.name.trim().length).toBeGreaterThan(2);
        expect(input?.base_unit, `${module.toolKey}:${id} has no economic/physical unit basis`).toBeTruthy();
        expect(input?.allowed_display_units.length).toBeGreaterThan(0);
      }
    });
  }

  it("loss-making detector exposes price, per-batch material and per-unit costs without semantic aliasing", () => {
    const resolved = resolveApprovedToolSchema("loss-making-job-detector");
    expect(resolved.ok).toBe(true);
    if (!resolved.ok) return;
    const byId = new Map(resolved.schema.inputs.map((input) => [input.id, input]));
    expect(byId.get("machine_rate")?.name).toMatch(/quoted selling price per unit/i);
    expect(byId.get("material_cost")?.name).toMatch(/material cost/i);
    expect(byId.get("labor_rate")?.name).toMatch(/labor cost per unit/i);
    expect(byId.get("overhead_rate")?.name).toMatch(/overhead cost per unit/i);
    expect(byId.get("defect_or_loss_cost")?.name).toMatch(/defect|loss/i);
  });
});
