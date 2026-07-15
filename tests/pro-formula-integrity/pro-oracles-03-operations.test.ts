import { describe, expect, it } from "vitest";

import * as customerSku from "@/sectorcalc/formulas/pro-v531/customer-sku-profitability-forensics.formula";
import * as downtime from "@/sectorcalc/formulas/pro-v531/downtime-scrap-loss-statement.formula";
import * as oee from "@/sectorcalc/formulas/pro-v531/oee-loss-monetization-improvement-business-case.formula";
import * as scrap from "@/sectorcalc/formulas/pro-v531/scrap-rework-cost-tracker.formula";
import * as outsource from "@/sectorcalc/formulas/pro-v531/outsource-vs-in-house-analyzer.formula";
import { expectClose } from "./oracle-test-helpers";

describe("PRO semantic oracles 11-15", () => {
  it("11 customer SKU reconciles cost-to-serve burdens to target margin", () => {
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

  it("12 downtime statement conserves time, scrap and rework losses", () => {
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

  it("13 OEE loss components sum to measured-period total loss", () => {
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

  it("14 scrap/rework uses consistent recorded and projected production bases", () => {
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
    expectClose(result, "out_capacity_metric", 560, 8);
    expectClose(result, "out_reference_deviation", 0.03, 8);
    expectClose(result, "out_utilization_margin", 9.3333, 4);
    expectClose(result, "out_money_at_risk", 280, 8);
    expectClose(result, "out_final_decision_state", 2, 8);
  });

  it("15 outsource vs in-house allocates setup per unit and applies explicit risk premium", () => {
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
});
