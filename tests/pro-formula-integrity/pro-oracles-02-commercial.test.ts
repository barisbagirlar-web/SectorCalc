import { describe, expect, it } from "vitest";

import * as productMargin from "@/sectorcalc/formulas/pro-v531/product-sku-margin-ranker.formula";
import * as employeeCost from "@/sectorcalc/formulas/pro-v531/true-employee-cost-statement.formula";
import * as jobQuote from "@/sectorcalc/formulas/pro-v531/job-quote-builder-pro-pack.formula";
import * as machineInvestment from "@/sectorcalc/formulas/pro-v531/machine-investment-feasibility-buy-lease-keep.formula";
import * as capital from "@/sectorcalc/formulas/pro-v531/capital-equipment-investment-appraisal-npv-irr.formula";
import { expectClose } from "./oracle-test-helpers";

describe("PRO semantic oracles 06-10", () => {
  it("06 product SKU allocates annual pools per unit before margin", () => {
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

  it("07 true employee cost uses only entered annual ledger values", () => {
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

  it("08 job quote uses gross margin cost/(1-margin), not markup", () => {
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

  it("09 buy/lease/keep selects the highest NPV alternative", () => {
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

  it("10 capital appraisal includes residual once and solves the IRR root", () => {
    const result = capital.calculate({
      n_initial_investment: 100,
      n_annual_net_cash_flow: 60,
      n_discount_rate: 0,
      n_analysis_years: 2,
      n_residual_value: 0,
      n_stress_downside_factor: 1,
      n_defect_or_loss_cost: 0,
      n_source_confidence_ratio: 1,
      n_uncertainty_multiplier: 1,
    });
    expect(result.status).toBe("OK");
    expectClose(result, "out_demand_metric", 20, 8);
    expectClose(result, "out_capacity_metric", 0.130662, 6);
    expectClose(result, "out_utilization_margin", 1.2, 8);
  });
});
