import { describe, expect, it } from "vitest";

import * as plantRate from "@/sectorcalc/formulas/pro-v531/plant-wide-shop-rate-cost-structure-audit.formula";
import * as fx from "@/sectorcalc/formulas/pro-v531/fx-commodity-pass-through-pricer.formula";
import * as energy from "@/sectorcalc/formulas/pro-v531/energy-efficiency-grant-incentive-feasibility-pack.formula";
import * as motor from "@/sectorcalc/formulas/pro-v531/motor-compressor-replacement-roi.formula";
import * as weld from "@/sectorcalc/formulas/pro-v531/weld-procedure-cost-consumable-estimation-suite.formula";
import { expectClose } from "./oracle-test-helpers";

describe("PRO semantic oracles 16-20", () => {
  it("16 plant shop rate reconciles realized hours and gross-margin floor", () => {
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

  it("17 FX/commodity applies only unhedged material exposure", () => {
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

  it("18 energy efficiency reconciles grant-adjusted NPV and project benefit-cost ratio", () => {
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
    expectClose(result, "out_utilization_margin", 1.25, 8);
    expectClose(result, "out_reference_deviation", 0.5, 8);
  });

  it("19 motor replacement reconciles electrical input energy and two-year NPV", () => {
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

  it("20 weld effective-throat geometry produces the independent mass and cost oracle", () => {
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
