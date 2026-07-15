import { describe, expect, it } from "vitest";

import { getAllModules } from "@/sectorcalc/formulas/pro-v531/resolve-formula-module";
import { normalizeInput } from "@/sectorcalc/pro-form/unit-normalizer";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";
import * as weld from "@/sectorcalc/formulas/pro-v531/weld-procedure-cost-consumable-estimation-suite.formula";
import * as machineRate from "@/sectorcalc/formulas/pro-v531/machine-hourly-rate-proof-report.formula";
import * as oee from "@/sectorcalc/formulas/pro-v531/oee-loss-monetization-improvement-business-case.formula";
import * as capital from "@/sectorcalc/formulas/pro-v531/capital-equipment-investment-appraisal-npv-irr.formula";
import * as jobQuote from "@/sectorcalc/formulas/pro-v531/job-quote-builder-pro-pack.formula";
import * as energy from "@/sectorcalc/formulas/pro-v531/energy-efficiency-grant-incentive-feasibility-pack.formula";

function sorted(values: readonly string[]): string[] {
  return [...values].sort();
}

function output(result: ReturnType<typeof weld.calculate>, id: string): number {
  const value = result.outputs[id];
  expect(Number.isFinite(value)).toBe(true);
  return value;
}

describe("LIVE PRO closed formula contract", () => {
  const modules = getAllModules();

  it("registers exactly 20 audited modules", () => {
    expect(modules).toHaveLength(20);
    expect(new Set(modules.map((module) => module.toolKey)).size).toBe(20);
  });

  for (const module of modules) {
    it(`${module.toolKey}: schema, sample, inputs and outputs are one closed set`, () => {
      expect(module.requiredInputKeys?.length).toBeGreaterThan(0);
      expect(module.declaredOutputKeys?.length).toBeGreaterThan(0);
      expect(sorted(Object.keys(module.sampleInputs))).toEqual(
        sorted(module.requiredInputKeys ?? []),
      );

      const resolved = resolveApprovedToolSchema(module.toolKey);
      expect(resolved.ok).toBe(true);
      if (!resolved.ok) return;

      expect(resolved.schema.metadata.formula_version).toBe(module.formulaVersion);
      expect(sorted(resolved.schema.normalized_inputs.map((input) => input.id))).toEqual(
        sorted(module.requiredInputKeys ?? []),
      );
      expect(sorted(resolved.schema.outputs.map((item) => item.id))).toEqual(
        sorted(module.declaredOutputKeys ?? []),
      );

      const result = module.calculate(module.sampleInputs);
      expect(result.status).not.toBe("BLOCKED");
      expect(sorted(result.outputKeys)).toEqual(sorted(module.declaredOutputKeys ?? []));
      expect(sorted(Object.keys(result.outputs))).toEqual(sorted(module.declaredOutputKeys ?? []));
      expect(Object.values(result.outputs).every(Number.isFinite)).toBe(true);
    });

    it(`${module.toolKey}: missing required input fails closed`, () => {
      const firstKey = module.requiredInputKeys?.[0];
      if (!firstKey) throw new Error(`${module.toolKey} has no required input contract`);
      const invalid: Record<string, number> = { ...module.sampleInputs };
      delete invalid[firstKey];
      const result = module.calculate(invalid);
      expect(result.status).toBe("BLOCKED");
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  }
});

describe("unit and closed-form oracles", () => {
  it("converts 7.85 g/cm3 to 7850 kg/m3 exactly", () => {
    const result = normalizeInput(
      "weld_density",
      7.85,
      "g_per_cm3",
      "kg_per_m3",
      "density",
      {},
    );
    expect("baseValue" in result).toBe(true);
    if ("baseValue" in result) expect(result.baseValue).toBeCloseTo(7850, 12);
  });

  it("weld mass obeys the effective-throat closed form", () => {
    const result = weld.calculate({
      ...weld.sampleInputs,
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
    expect(output(result, "out_wire_mass_kg")).toBeCloseTo(0.785, 3);
    expect(output(result, "out_total_cost_floor")).toBeCloseTo(0.79, 2);
  });

  it("blocks the reported 1780 m / 80 mm / 15 min impossible weld case", () => {
    const result = weld.calculate({
      ...weld.sampleInputs,
      n_weld_length_m: 1780,
      n_weld_throat_mm: 80,
      n_weld_density_g_per_cm3: 7850,
      n_wire_cost_per_kg: 8,
      n_gas_cost_per_min: 0.35,
      n_arc_time_min: 15,
      n_weld_time_min: 30,
      n_labor_rate: 65,
      n_overhead_rate: 25,
      n_deposition_efficiency_pct: 85,
      n_source_confidence_ratio: 0.9,
    });
    expect(result.status).toBe("BLOCKED");
    expect(result.warnings.join(" ")).toMatch(/travel speed|deposited metal rate/i);
  });

  it("machine hourly cost uses seconds and does not divide the hourly rate twice", () => {
    const result = machineRate.calculate({
      ...machineRate.sampleInputs,
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
    expect(output(result, "out_demand_metric")).toBeCloseTo(85, 8);
  });

  it("OEE components conserve valuable time and loss seconds", () => {
    const result = oee.calculate({
      ...oee.sampleInputs,
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
    expect(output(result, "out_reference_deviation")).toBeCloseTo(0.72, 8);
    expect(output(result, "out_money_at_risk")).toBeCloseTo(28, 8);
  });

  it("capital appraisal includes residual value once", () => {
    const result = capital.calculate({
      ...capital.sampleInputs,
      n_initial_investment: 100,
      n_annual_net_cash_flow: 0,
      n_discount_rate: 0,
      n_analysis_years: 1,
      n_residual_value: 100,
      n_stress_downside_factor: 1,
      n_annual_volume: 0,
      n_labor_rate: 0,
      n_overhead_rate: 0,
      n_defect_or_loss_cost: 0,
      n_source_confidence_ratio: 1,
      n_uncertainty_multiplier: 1,
    });
    expect(output(result, "out_demand_metric")).toBeCloseTo(0, 8);
  });

  it("job quote uses gross margin, not markup", () => {
    const result = jobQuote.calculate({
      ...jobQuote.sampleInputs,
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
    expect(output(result, "out_capacity_metric")).toBeCloseTo(125, 8);
    expect(output(result, "out_utilization_margin")).toBeCloseTo(0.2, 8);
  });
});

describe("metamorphic and monotonic properties", () => {
  it("weld cost is linear in length when time scales with length", () => {
    const base = weld.calculate(weld.sampleInputs);
    const doubled = weld.calculate({
      ...weld.sampleInputs,
      n_weld_length_m: weld.sampleInputs.n_weld_length_m * 2,
      n_arc_time_min: weld.sampleInputs.n_arc_time_min * 2,
      n_weld_time_min: weld.sampleInputs.n_weld_time_min * 2,
    });
    expect(output(doubled, "out_total_cost_floor")).toBeCloseTo(
      output(base, "out_total_cost_floor") * 2,
      2,
    );
  });

  it("weld wire cost decreases when deposition efficiency increases", () => {
    const low = weld.calculate({ ...weld.sampleInputs, n_deposition_efficiency_pct: 70 });
    const high = weld.calculate({ ...weld.sampleInputs, n_deposition_efficiency_pct: 90 });
    expect(output(high, "out_wire_cost")).toBeLessThan(output(low, "out_wire_cost"));
  });

  it("machine cost increases with cycle time", () => {
    const base = machineRate.calculate(machineRate.sampleInputs);
    const slower = machineRate.calculate({
      ...machineRate.sampleInputs,
      n_cycle_time: machineRate.sampleInputs.n_cycle_time * 1.5,
    });
    expect(output(slower, "out_demand_metric")).toBeGreaterThan(
      output(base, "out_demand_metric"),
    );
  });

  it("OEE loss decreases as valuable time increases", () => {
    const low = oee.calculate({
      ...oee.sampleInputs,
      n_valuable_operating_time: 450,
      n_good_parts: 900,
    });
    const high = oee.calculate({
      ...oee.sampleInputs,
      n_valuable_operating_time: 475,
      n_good_parts: 950,
    });
    expect(output(high, "out_money_at_risk")).toBeLessThan(output(low, "out_money_at_risk"));
  });

  it("NPV increases with annual cash flow and decreases with investment", () => {
    const base = capital.calculate(capital.sampleInputs);
    const higherCash = capital.calculate({
      ...capital.sampleInputs,
      n_annual_net_cash_flow: capital.sampleInputs.n_annual_net_cash_flow * 1.1,
    });
    const higherCapex = capital.calculate({
      ...capital.sampleInputs,
      n_initial_investment: capital.sampleInputs.n_initial_investment * 1.1,
    });
    expect(output(higherCash, "out_demand_metric")).toBeGreaterThan(
      output(base, "out_demand_metric"),
    );
    expect(output(higherCapex, "out_demand_metric")).toBeLessThan(
      output(base, "out_demand_metric"),
    );
  });

  it("energy NPV increases when target consumption falls", () => {
    const base = energy.calculate(energy.sampleInputs);
    const better = energy.calculate({
      ...energy.sampleInputs,
      n_target_kwh_per_year: energy.sampleInputs.n_target_kwh_per_year * 0.9,
    });
    expect(output(better, "out_capacity_metric")).toBeGreaterThan(
      output(base, "out_capacity_metric"),
    );
  });
});
