import Big from "big.js";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import {
  MACHINE_OPTION_FORMULA_VERSION,
  MACHINE_OPTION_MODEL_ID,
  MACHINE_OPTION_SCHEMA_VERSION,
  evaluateMachineOption,
} from "@/sectorcalc/formulas/pro-v531/machine-option-core";
import { calculate, sampleInputs } from "@/sectorcalc/formulas/pro-v531/machine-investment-feasibility-buy-lease-keep.formula";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";

const Decimal = Big();
Decimal.DP = 50;
Decimal.RM = 2;
Decimal.STRICT = true;

function close(a: Big, b: Big): boolean {
  return a.minus(b).abs().div(a.abs().plus(b.abs()).plus("1")).lte("1e-44");
}

function evaluate(overrides: Record<string, string> = {}) {
  const result = evaluateMachineOption({
    buyPurchaseAndInstallationCost: "500000", annualBuyOperatingCost: "50000",
    discountRate: "0.1", analysisYears: "5", buyResidualValue: "100000",
    downsideAnnualCostIncreaseRatio: "0.2", leaseUpfrontCost: "20000",
    annualLeasePaymentAndServiceCost: "120000", keepRefurbishmentCostToday: "80000",
    annualKeepMaintenanceAndDowntimeCost: "140000", sourceConfidenceRatio: "0.9",
    uncertaintyCoverageMultiplier: "2", ...overrides,
  });
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

describe("buy lease keep present-cost Decimal properties", () => {
  it("proves zero-rate, residual timing, present-cost, and equivalent-annual identities", () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 50 }), fc.integer({ min: 0, max: 1_000_000 }),
      fc.integer({ min: 0, max: 500_000 }), (years, annualBuy, residual) => {
        const result = evaluate({
          discountRate: "0", analysisYears: String(years), annualBuyOperatingCost: String(annualBuy),
          buyResidualValue: String(residual), downsideAnnualCostIncreaseRatio: "0",
        });
        expect(result.annuityPresentValueFactor.eq(String(years))).toBe(true);
        expect(result.residualPresentValueFactor.eq("1")).toBe(true);
        expect(result.buyResidualPresentValue.eq(String(residual))).toBe(true);
        expect(result.buyPresentCost.eq(Decimal("500000").plus(Decimal(String(annualBuy)).times(String(years))).minus(String(residual)))).toBe(true);
        expect(close(result.stressedBuyEquivalentAnnualCost.times(result.annuityPresentValueFactor), result.stressedBuyPresentCost)).toBe(true);
        expect(close(result.stressedLeaseEquivalentAnnualCost.times(result.annuityPresentValueFactor), result.stressedLeasePresentCost)).toBe(true);
        expect(close(result.stressedKeepEquivalentAnnualCost.times(result.annuityPresentValueFactor), result.stressedKeepPresentCost)).toBe(true);
      },
    ), { numRuns: 500, seed: 536_001 });
  });

  it("is homogeneous in all monetary inputs without changing ranking or evidence state", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
      const scale = Decimal(String(factor));
      const base = evaluate();
      const scaled = evaluate({
        buyPurchaseAndInstallationCost: Decimal("500000").times(scale).toString(),
        annualBuyOperatingCost: Decimal("50000").times(scale).toString(),
        buyResidualValue: Decimal("100000").times(scale).toString(),
        leaseUpfrontCost: Decimal("20000").times(scale).toString(),
        annualLeasePaymentAndServiceCost: Decimal("120000").times(scale).toString(),
        keepRefurbishmentCostToday: Decimal("80000").times(scale).toString(),
        annualKeepMaintenanceAndDowntimeCost: Decimal("140000").times(scale).toString(),
      });
      expect(close(scaled.stressedBuyPresentCost, base.stressedBuyPresentCost.times(scale))).toBe(true);
      expect(close(scaled.stressedCostAdvantage, base.stressedCostAdvantage.times(scale))).toBe(true);
      expect(close(scaled.selectionMoneyAtRisk, base.selectionMoneyAtRisk.times(scale))).toBe(true);
      expect(scaled.recommendedOption).toBe(base.recommendedOption);
      expect(scaled.runnerUpOption).toBe(base.runnerUpOption);
      expect(scaled.decisionState).toBe(base.decisionState);
    }), { numRuns: 500, seed: 536_002 });
  });

  it("raises each option cost with its recurring cost and all stressed costs with downside", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 999 }), (basisPoints) => {
      const stress = Decimal(String(basisPoints)).div("1000");
      const buyLow = evaluate({ annualBuyOperatingCost: "0" });
      const buyHigh = evaluate({ annualBuyOperatingCost: "1" });
      expect(buyHigh.stressedBuyPresentCost.gt(buyLow.stressedBuyPresentCost)).toBe(true);
      const leaseLow = evaluate({ annualLeasePaymentAndServiceCost: "0" });
      const leaseHigh = evaluate({ annualLeasePaymentAndServiceCost: "1" });
      expect(leaseHigh.stressedLeasePresentCost.gt(leaseLow.stressedLeasePresentCost)).toBe(true);
      const keepLow = evaluate({ annualKeepMaintenanceAndDowntimeCost: "0" });
      const keepHigh = evaluate({ annualKeepMaintenanceAndDowntimeCost: "1" });
      expect(keepHigh.stressedKeepPresentCost.gt(keepLow.stressedKeepPresentCost)).toBe(true);
      const lowStress = evaluate({ downsideAnnualCostIncreaseRatio: stress.toString() });
      const highStress = evaluate({ downsideAnnualCostIncreaseRatio: stress.plus("0.001").toString() });
      expect(highStress.stressedBuyPresentCost.gte(lowStress.stressedBuyPresentCost)).toBe(true);
      expect(highStress.stressedLeasePresentCost.gte(lowStress.stressedLeasePresentCost)).toBe(true);
      expect(highStress.stressedKeepPresentCost.gte(lowStress.stressedKeepPresentCost)).toBe(true);
    }), { numRuns: 500, seed: 536_003 });
  });

  it("selects the lowest stressed cost and narrows winner-runner bounds with confidence", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 999 }), (basisPoints) => {
      const confidence = Decimal(String(basisPoints)).div("1000");
      const low = evaluate({ sourceConfidenceRatio: confidence.toString() });
      const high = evaluate({ sourceConfidenceRatio: confidence.plus("0.001").toString() });
      const costs = [low.stressedBuyPresentCost, low.stressedLeasePresentCost, low.stressedKeepPresentCost];
      expect(costs[low.recommendedOption].lte(costs[low.runnerUpOption])).toBe(true);
      expect(low.stressedCostAdvantage.eq(costs[low.runnerUpOption].minus(costs[low.recommendedOption]))).toBe(true);
      expect(high.winnerCostUncertainty.lte(low.winnerCostUncertainty)).toBe(true);
      expect(high.runnerUpCostUncertainty.lte(low.runnerUpCostUncertainty)).toBe(true);
      expect(high.winnerCostUpperBound.lte(low.winnerCostUpperBound)).toBe(true);
      expect(high.runnerUpCostLowerBound.gte(low.runnerUpCostLowerBound)).toBe(true);
    }), { numRuns: 500, seed: 536_004 });
  });

  it("fails closed for invalid horizon, residual invariant, ratios, negatives, NaN, and infinity", () => {
    const base = {
      buyPurchaseAndInstallationCost: "500000", annualBuyOperatingCost: "50000",
      discountRate: "0.1", analysisYears: "5", buyResidualValue: "100000",
      downsideAnnualCostIncreaseRatio: "0.2", leaseUpfrontCost: "20000",
      annualLeasePaymentAndServiceCost: "120000", keepRefurbishmentCostToday: "80000",
      annualKeepMaintenanceAndDowntimeCost: "140000", sourceConfidenceRatio: "0.9",
      uncertaintyCoverageMultiplier: "2",
    };
    expect(evaluateMachineOption({ ...base, analysisYears: "0" }).ok).toBe(false);
    expect(evaluateMachineOption({ ...base, analysisYears: "1.5" }).ok).toBe(false);
    expect(evaluateMachineOption({ ...base, analysisYears: "51" }).ok).toBe(false);
    expect(evaluateMachineOption({ ...base, buyResidualValue: "500001" }).ok).toBe(false);
    expect(evaluateMachineOption({ ...base, discountRate: "1.1" }).ok).toBe(false);
    expect(evaluateMachineOption({ ...base, leaseUpfrontCost: "-1" }).ok).toBe(false);
    expect(evaluateMachineOption({ ...base, uncertaintyCoverageMultiplier: "10.1" }).ok).toBe(false);
    expect(evaluateMachineOption({ ...base, annualBuyOperatingCost: Number.NaN }).ok).toBe(false);
    expect(evaluateMachineOption({ ...base, annualLeasePaymentAndServiceCost: Number.POSITIVE_INFINITY }).ok).toBe(false);
  });

  it("binds explicit option cash flows, common timing, semantic units, and exact audit outputs", () => {
    const schema = resolveApprovedToolSchema("machine-investment-feasibility-buy-lease-keep");
    if (!schema.ok) throw new Error(`${schema.reason}:${schema.errors.join("|")}`);
    expect(schema.schema.metadata.formula_version).toBe(MACHINE_OPTION_FORMULA_VERSION);
    expect(schema.schema.metadata.schema_version).toBe(MACHINE_OPTION_SCHEMA_VERSION);
    expect(schema.schema.calculation_basis.model_id).toBe(MACHINE_OPTION_MODEL_ID);
    expect(schema.schema.calculation_basis.cash_flow_timing).toContain("RESIDUAL_ONCE");
    expect(schema.schema.inputs.find((input) => input.id === "annual_volume")).toMatchObject({ name: "Lease Upfront Cost", base_unit: "currency_unit" });
    expect(schema.schema.inputs.find((input) => input.id === "labor_rate")).toMatchObject({ base_unit: "currency_unit/year" });
    const formula = calculate(sampleInputs);
    expect(formula.status).not.toBe("BLOCKED");
    expect(Object.keys(formula.outputs).sort()).toEqual(schema.schema.outputs.map((item) => item.id).sort());
    for (const [id, exactValue] of Object.entries(formula.decimalOutputs ?? {})) {
      expect(Number(exactValue)).toBe(formula.outputs[id]);
    }
  });
});
