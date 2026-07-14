import Big from "big.js";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import {
  CASH_SURVIVAL_FORMULA_VERSION,
  CASH_SURVIVAL_MODEL_ID,
  CASH_SURVIVAL_SCHEMA_VERSION,
  evaluateCashSurvival,
} from "@/sectorcalc/formulas/pro-v531/cash-survival-core";
import { calculate, sampleInputs } from "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";

const Decimal = Big();
Decimal.DP = 50;
Decimal.RM = 2;
Decimal.STRICT = true;

function close(a: Big, b: Big): boolean {
  return a.minus(b).abs().div(a.abs().plus(b.abs()).plus("1")).lte("1e-45");
}

function evaluate(overrides: Record<string, string> = {}) {
  const result = evaluateCashSurvival({
    openingCashBalance: "500000", monthlyRevenue: "250000", variableCashCostRatio: "0.4",
    forecastMonths: "12", minimumCashReserve: "50000", stressedRevenueRetentionRatio: "0.8",
    monthlyPayrollCashCost: "80000", monthlyOtherFixedOperatingCost: "30000",
    monthlyDebtAndFixedObligations: "15000", sourceConfidenceRatio: "0.95",
    uncertaintyCoverageMultiplier: "2", ...overrides,
  });
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

describe("cash survival Decimal properties", () => {
  it("proves contribution, break-even, ending-cash, funding, and runway identities", () => {
    fc.assert(fc.property(
      fc.integer({ min: 0, max: 10_000_000 }), fc.integer({ min: 0, max: 10_000_000 }),
      fc.integer({ min: 0, max: 999 }), fc.integer({ min: 1, max: 120 }),
      (revenue, fixedCost, variableBp, months) => {
        const ratio = Decimal(String(variableBp)).div("1000");
        const result = evaluate({
          monthlyRevenue: String(revenue), monthlyPayrollCashCost: String(fixedCost),
          monthlyOtherFixedOperatingCost: "0", monthlyDebtAndFixedObligations: "0",
          variableCashCostRatio: ratio.toString(), forecastMonths: String(months),
        });
        expect(result.monthlyContribution.eq(Decimal(String(revenue)).times(Decimal("1").minus(ratio)))).toBe(true);
        expect(close(result.breakEvenMonthlyRevenue.times(result.contributionMarginRatio), result.monthlyFixedCashCost)).toBe(true);
        expect(result.baseEndingCash.eq(Decimal("500000").plus(result.monthlyNetCashFlow.times(String(months))))).toBe(true);
        expect(result.requiredOpeningCashForStressHorizon.eq(Decimal("50000").plus(result.stressedMonthlyBurn.times(String(months))))).toBe(true);
        expect(result.stressedRunwayWithinHorizonMonths.gte("0")).toBe(true);
        expect(result.stressedRunwayWithinHorizonMonths.lte(String(months))).toBe(true);
      },
    ), { numRuns: 500, seed: 534_001 });
  });

  it("is homogeneous in every monetary input while preserving ratios and decisions", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
      const scale = Decimal(String(factor));
      const base = evaluate();
      const scaled = evaluate({
        openingCashBalance: Decimal("500000").times(scale).toString(),
        monthlyRevenue: Decimal("250000").times(scale).toString(),
        minimumCashReserve: Decimal("50000").times(scale).toString(),
        monthlyPayrollCashCost: Decimal("80000").times(scale).toString(),
        monthlyOtherFixedOperatingCost: Decimal("30000").times(scale).toString(),
        monthlyDebtAndFixedObligations: Decimal("15000").times(scale).toString(),
      });
      expect(close(scaled.breakEvenMonthlyRevenue, base.breakEvenMonthlyRevenue.times(scale))).toBe(true);
      expect(close(scaled.stressedEndingCash, base.stressedEndingCash.times(scale))).toBe(true);
      expect(close(scaled.moneyAtRisk, base.moneyAtRisk.times(scale))).toBe(true);
      expect(scaled.contributionMarginRatio.eq(base.contributionMarginRatio)).toBe(true);
      expect(scaled.stressedRunwayWithinHorizonMonths.eq(base.stressedRunwayWithinHorizonMonths)).toBe(true);
      expect(scaled.decisionState).toBe(base.decisionState);
    }), { numRuns: 500, seed: 534_002 });
  });

  it("improves stressed cash monotonically as retained revenue increases", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 999 }), (basisPoints) => {
      const retention = Decimal(String(basisPoints)).div("1000");
      const low = evaluate({ stressedRevenueRetentionRatio: retention.toString() });
      const high = evaluate({ stressedRevenueRetentionRatio: retention.plus("0.001").toString() });
      expect(high.stressedMonthlyRevenue.gte(low.stressedMonthlyRevenue)).toBe(true);
      expect(high.stressedMonthlyNetCashFlow.gte(low.stressedMonthlyNetCashFlow)).toBe(true);
      expect(high.stressedEndingCash.gte(low.stressedEndingCash)).toBe(true);
      expect(high.stressedMonthlyBurn.lte(low.stressedMonthlyBurn)).toBe(true);
      expect(high.additionalFundingRequired.lte(low.additionalFundingRequired)).toBe(true);
    }), { numRuns: 500, seed: 534_003 });
  });

  it("encloses stressed ending cash and narrows with source confidence", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 999 }), (basisPoints) => {
      const confidence = Decimal(String(basisPoints)).div("1000");
      const low = evaluate({ sourceConfidenceRatio: confidence.toString() });
      const high = evaluate({ sourceConfidenceRatio: confidence.plus("0.001").toString() });
      expect(low.stressedCashLowerBound.lte(low.stressedEndingCash)).toBe(true);
      expect(low.stressedCashUpperBound.gte(low.stressedEndingCash)).toBe(true);
      expect(high.cashUncertainty.lte(low.cashUncertainty)).toBe(true);
      expect(high.stressedCashLowerBound.gte(low.stressedCashLowerBound)).toBe(true);
      expect(high.stressedCashUpperBound.lte(low.stressedCashUpperBound)).toBe(true);
    }), { numRuns: 500, seed: 534_004 });
  });

  it("fails closed for contribution singularity, invalid horizons, negatives, NaN, and infinity", () => {
    const base = {
      openingCashBalance: "500000", monthlyRevenue: "250000", variableCashCostRatio: "0.4",
      forecastMonths: "12", minimumCashReserve: "50000", stressedRevenueRetentionRatio: "0.8",
      monthlyPayrollCashCost: "80000", monthlyOtherFixedOperatingCost: "30000",
      monthlyDebtAndFixedObligations: "15000", sourceConfidenceRatio: "0.95",
      uncertaintyCoverageMultiplier: "2",
    };
    expect(evaluateCashSurvival({ ...base, variableCashCostRatio: "1" }).ok).toBe(false);
    expect(evaluateCashSurvival({ ...base, forecastMonths: "0" }).ok).toBe(false);
    expect(evaluateCashSurvival({ ...base, forecastMonths: "1.5" }).ok).toBe(false);
    expect(evaluateCashSurvival({ ...base, forecastMonths: "121" }).ok).toBe(false);
    expect(evaluateCashSurvival({ ...base, openingCashBalance: "-1" }).ok).toBe(false);
    expect(evaluateCashSurvival({ ...base, uncertaintyCoverageMultiplier: "10.1" }).ok).toBe(false);
    expect(evaluateCashSurvival({ ...base, monthlyRevenue: Number.NaN }).ok).toBe(false);
    expect(evaluateCashSurvival({ ...base, monthlyPayrollCashCost: Number.POSITIVE_INFINITY }).ok).toBe(false);
  });

  it("binds the monthly form, removes unrelated volume, and emits exact audit outputs", () => {
    const schema = resolveApprovedToolSchema("break-even-survival-cash-calculator");
    if (!schema.ok) throw new Error(`${schema.reason}:${schema.errors.join("|")}`);
    expect(schema.schema.metadata.formula_version).toBe(CASH_SURVIVAL_FORMULA_VERSION);
    expect(schema.schema.metadata.schema_version).toBe(CASH_SURVIVAL_SCHEMA_VERSION);
    expect(schema.schema.calculation_basis.model_id).toBe(CASH_SURVIVAL_MODEL_ID);
    expect(schema.schema.calculation_basis.investment_appraisal_excluded).toContain("NPV_AND_IRR");
    expect(schema.schema.inputs.some((input) => input.id === "annual_volume")).toBe(false);
    expect(schema.schema.inputs.find((input) => input.id === "analysis_years")).toMatchObject({
      name: "Forecast Horizon Months", type: "integer", base_unit: "month",
    });
    expect(schema.schema.inputs.find((input) => input.id === "labor_rate")).toMatchObject({ base_unit: "currency_unit/month" });
    const formula = calculate(sampleInputs);
    expect(formula.status).not.toBe("BLOCKED");
    expect(Object.keys(formula.outputs).sort()).toEqual(schema.schema.outputs.map((item) => item.id).sort());
    for (const [id, exactValue] of Object.entries(formula.decimalOutputs ?? {})) {
      expect(Number(exactValue)).toBe(formula.outputs[id]);
    }
  });
});
