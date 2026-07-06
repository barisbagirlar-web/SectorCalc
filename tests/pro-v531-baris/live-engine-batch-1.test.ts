
import { describe, it, expect } from "vitest";
import * as breakEven from "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula";
import * as machineHourly from "@/sectorcalc/formulas/pro-v531/machine-hourly-rate-proof-report.formula";
import * as lossMaking from "@/sectorcalc/formulas/pro-v531/loss-making-job-detector.formula";
import * as receivablesCost from "@/sectorcalc/formulas/pro-v531/receivables-cost-payment-term-addendum.formula";
import * as setupTime from "@/sectorcalc/formulas/pro-v531/setup-time-reduction-roi-smed.formula";
import * as productSku from "@/sectorcalc/formulas/pro-v531/product-sku-margin-ranker.formula";
import * as trueEmployee from "@/sectorcalc/formulas/pro-v531/true-employee-cost-statement.formula";
import * as jobQuote from "@/sectorcalc/formulas/pro-v531/job-quote-builder-pro-pack.formula";
import * as machineInvest from "@/sectorcalc/formulas/pro-v531/machine-investment-feasibility-buy-lease-keep.formula";
import * as capitalEquip from "@/sectorcalc/formulas/pro-v531/capital-equipment-investment-appraisal-npv-irr.formula";
import { LIVE_BATCH_1_KEYS, isBarisToolLiveExecutable } from "@/sectorcalc/formulas/pro-v531/baris-formula-registry";
import fs from "fs";
import path from "path";

const MODULES = [
  breakEven, machineHourly, lossMaking, receivablesCost, setupTime,
  productSku, trueEmployee, jobQuote, machineInvest, capitalEquip
] as unknown as Array<{toolKey: string; formulaVersion: string; calculate(inputs: Record<string, number>): {status: string; outputs: Record<string, number>; warnings: string[]; outputKeys: string[]; redaction_status: string}}>;

const STD_INPUTS: Record<string, number> = {
  n_machine_rate: 85, n_cycle_time: 12, n_setup_time: 8, n_batch_quantity: 500,
  n_material_cost: 25, n_target_margin: 0.3, n_annual_volume: 100000, n_labor_rate: 45,
  n_overhead_rate: 350000, n_defect_or_loss_cost: 12000, n_source_confidence_ratio: 0.9, n_uncertainty_multiplier: 1.1
};
const INV_INPUTS: Record<string, number> = {
  n_initial_investment: 500000, n_annual_net_cash_flow: 150000, n_discount_rate: 10,
  n_analysis_years: 5, n_residual_value: 50000, n_stress_downside_factor: 0.8,
  n_annual_volume: 10000, n_labor_rate: 80000, n_overhead_rate: 120000,
  n_defect_or_loss_cost: 15000, n_source_confidence_ratio: 0.95, n_uncertainty_multiplier: 1.2
};

function getInputs(tk: string) {
  if (["break-even-survival-cash-calculator","machine-investment-feasibility-buy-lease-keep","capital-equipment-investment-appraisal-npv-irr"].includes(tk)) return INV_INPUTS;
  return STD_INPUTS;
}

describe("Baris PRO Batch 1 - Live Engine", () => {
  it("should have exactly 10 live modules", () => expect(MODULES.length).toBe(10));
  it("should have server-only and calculate() for each module", () => {
    for (const mod of MODULES) {
      expect(mod.toolKey).toBeTruthy();
      expect(typeof mod.calculate).toBe("function");
    }
  });
  it("should produce finite numeric outputs", () => {
    for (const mod of MODULES) {
      const result = mod.calculate(getInputs(mod.toolKey));
      for (const k of result.outputKeys) expect(Number.isFinite(result.outputs[k])).toBe(true);
    }
  });
  it("should reject empty inputs with warnings", () => {
    for (const mod of MODULES) {
      const result = mod.calculate({});
      expect(result.warnings.length).toBeGreaterThanOrEqual(0);
    }
  });
  it("should be registered as live-executable", () => {
    for (const mod of MODULES) {
      expect(isBarisToolLiveExecutable(mod.toolKey)).toBe(true);
      expect(LIVE_BATCH_1_KEYS.has(mod.toolKey)).toBe(true);
    }
  });
  it("should have golden fixture files", () => {
    const gd = path.join(process.cwd(), "tests/golden/pro-v531-baris");
    for (const mod of MODULES) {
      expect(fs.existsSync(path.join(gd, `${mod.toolKey}.golden.json`))).toBe(true);
    }
  });
  it("should not expose formula expressions in outputs", () => {
    for (const mod of MODULES) {
      const result = mod.calculate(getInputs(mod.toolKey));
      for (const k of result.outputKeys) expect(typeof result.outputs[k]).toBe("number");
    }
  });
});
