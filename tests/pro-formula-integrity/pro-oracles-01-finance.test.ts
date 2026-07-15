import { describe, expect, it } from "vitest";

import * as breakEven from "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula";
import * as machineRate from "@/sectorcalc/formulas/pro-v531/machine-hourly-rate-proof-report.formula";
import * as lossDetector from "@/sectorcalc/formulas/pro-v531/loss-making-job-detector.formula";
import * as receivables from "@/sectorcalc/formulas/pro-v531/receivables-cost-payment-term-addendum.formula";
import * as smed from "@/sectorcalc/formulas/pro-v531/setup-time-reduction-roi-smed.formula";
import { expectClose } from "./oracle-test-helpers";

describe("PRO semantic oracles 01-05", () => {
  it("01 break-even preserves cash-survival conservation", () => {
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

  it("02 machine hourly rate converts exactly one hour at 85/h to 85/unit", () => {
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

  it("03 loss detector normalizes batch material cost before unit margin", () => {
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

  it("04 receivables annualizes financing, admin and credit-loss cost", () => {
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

  it("05 SMED converts saved seconds to annual hours, value and payback", () => {
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
});
