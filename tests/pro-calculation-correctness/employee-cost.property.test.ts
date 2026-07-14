import Big from "big.js";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { EMPLOYEE_COST_FORMULA_VERSION, EMPLOYEE_COST_MODEL_ID, EMPLOYEE_COST_SCHEMA_VERSION, evaluateEmployeeCost } from "@/sectorcalc/formulas/pro-v531/employee-cost-core";
import { calculate, sampleInputs } from "@/sectorcalc/formulas/pro-v531/true-employee-cost-statement.formula";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";

const Decimal = Big();
Decimal.DP = 50;
Decimal.RM = 2;
Decimal.STRICT = true;
function close(a: Big, b: Big): boolean {
  return a.minus(b).abs().div(a.abs().plus(b.abs()).plus("1")).lte("1e-45");
}
function evaluate(overrides: Record<string, string> = {}) {
  const result = evaluateEmployeeCost({
    baseHourlyWage: "45", annualPaidHours: "2080", productiveTimeRatio: "0.8",
    employerPayrollTaxRatio: "0.225", annualBenefitsCost: "9000",
    annualTrainingCost: "2000", annualEquipmentItCost: "2500",
    annualWorkspaceFacilityCost: "6000", sourceConfidenceRatio: "0.9", ...overrides,
  });
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

describe("employee cost Decimal properties", () => {
  it("proves additive cost, productive-time, disclosure, monthly, and multiplier identities", () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 8784 }), fc.integer({ min: 1, max: 1000 }),
      fc.integer({ min: 0, max: 1000 }),
      (hours, productiveBp, taxBp) => {
        const productive = Decimal(String(productiveBp)).div("1000");
        const tax = Decimal(String(taxBp)).div("1000");
        const result = evaluate({ annualPaidHours: String(hours), productiveTimeRatio: productive.toString(), employerPayrollTaxRatio: tax.toString() });
        expect(result.baseAnnualCompensation.eq(Decimal("45").times(String(hours)))).toBe(true);
        expect(result.productiveHoursAnnual.eq(Decimal(String(hours)).times(productive))).toBe(true);
        expect(result.paidNonProductiveHours.eq(Decimal(String(hours)).minus(result.productiveHoursAnnual))).toBe(true);
        expect(result.paidNonProductiveCost.eq(result.paidNonProductiveHours.times("45"))).toBe(true);
        expect(close(result.monthlyEmployerCost.times("12"), result.fullyLoadedAnnualCost)).toBe(true);
        expect(close(result.productiveHourlyCost.times(result.productiveHoursAnnual), result.fullyLoadedAnnualCost)).toBe(true);
        expect(close(result.baseToLoadedMultiplier.times(result.baseAnnualCompensation), result.fullyLoadedAnnualCost)).toBe(true);
      },
    ), { numRuns: 500, seed: 531_981 });
  });

  it("is homogeneous in all monetary inputs", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
      const scale = Decimal(String(factor));
      const base = evaluate();
      const scaled = evaluate({
        baseHourlyWage: Decimal("45").times(scale).toString(),
        annualBenefitsCost: Decimal("9000").times(scale).toString(),
        annualTrainingCost: Decimal("2000").times(scale).toString(),
        annualEquipmentItCost: Decimal("2500").times(scale).toString(),
        annualWorkspaceFacilityCost: Decimal("6000").times(scale).toString(),
      });
      expect(close(scaled.fullyLoadedAnnualCost, base.fullyLoadedAnnualCost.times(scale))).toBe(true);
      expect(close(scaled.productiveHourlyCost, base.productiveHourlyCost.times(scale))).toBe(true);
      expect(close(scaled.annualCostUpperBound, base.annualCostUpperBound.times(scale))).toBe(true);
      expect(scaled.baseToLoadedMultiplier.eq(base.baseToLoadedMultiplier)).toBe(true);
      expect(scaled.decisionState).toBe(base.decisionState);
    }), { numRuns: 500, seed: 531_982 });
  });

  it("lowers productive-hour cost as productive-time ratio rises without changing annual cost", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 999 }), (basisPoints) => {
      const ratio = Decimal(String(basisPoints)).div("1000");
      const low = evaluate({ productiveTimeRatio: ratio.toString() });
      const high = evaluate({ productiveTimeRatio: ratio.plus("0.001").toString() });
      expect(high.productiveHourlyCost.lt(low.productiveHourlyCost)).toBe(true);
      expect(high.paidNonProductiveCost.lt(low.paidNonProductiveCost)).toBe(true);
      expect(high.fullyLoadedAnnualCost.eq(low.fullyLoadedAnnualCost)).toBe(true);
    }), { numRuns: 500, seed: 531_983 });
  });

  it("encloses annual cost and narrows monotonically with confidence", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 999 }), (basisPoints) => {
      const confidence = Decimal(String(basisPoints)).div("1000");
      const low = evaluate({ sourceConfidenceRatio: confidence.toString() });
      const high = evaluate({ sourceConfidenceRatio: confidence.plus("0.001").toString() });
      expect(low.annualCostLowerBound.lte(low.fullyLoadedAnnualCost)).toBe(true);
      expect(low.annualCostUpperBound.gte(low.fullyLoadedAnnualCost)).toBe(true);
      expect(low.annualCostLowerBound.gte("0")).toBe(true);
      expect(high.annualCostUncertainty.lte(low.annualCostUncertainty)).toBe(true);
    }), { numRuns: 500, seed: 531_984 });
  });

  it("fails closed for zero wage/productivity, impossible hours, invalid ratios, negatives, NaN, and infinity", () => {
    const base = { baseHourlyWage: "45", annualPaidHours: "2080", productiveTimeRatio: "0.8",
      employerPayrollTaxRatio: "0.225", annualBenefitsCost: "9000", annualTrainingCost: "2000",
      annualEquipmentItCost: "2500", annualWorkspaceFacilityCost: "6000", sourceConfidenceRatio: "0.9" };
    expect(evaluateEmployeeCost({ ...base, baseHourlyWage: "0" }).ok).toBe(false);
    expect(evaluateEmployeeCost({ ...base, productiveTimeRatio: "0" }).ok).toBe(false);
    expect(evaluateEmployeeCost({ ...base, annualPaidHours: "8785" }).ok).toBe(false);
    expect(evaluateEmployeeCost({ ...base, annualPaidHours: "1.5" }).ok).toBe(false);
    expect(evaluateEmployeeCost({ ...base, employerPayrollTaxRatio: "1.1" }).ok).toBe(false);
    expect(evaluateEmployeeCost({ ...base, annualBenefitsCost: "-1" }).ok).toBe(false);
    expect(evaluateEmployeeCost({ ...base, annualTrainingCost: Number.NaN }).ok).toBe(false);
    expect(evaluateEmployeeCost({ ...base, annualEquipmentItCost: Number.POSITIVE_INFINITY }).ok).toBe(false);
  });

  it("binds the explicit reduced form, semantic outputs, and exact audit values", () => {
    const schema = resolveApprovedToolSchema("true-employee-cost-statement");
    if (!schema.ok) throw new Error(`${schema.reason}:${schema.errors.join("|")}`);
    expect(schema.schema.metadata.formula_version).toBe(EMPLOYEE_COST_FORMULA_VERSION);
    expect(schema.schema.metadata.schema_version).toBe(EMPLOYEE_COST_SCHEMA_VERSION);
    expect(schema.schema.calculation_basis.model_id).toBe(EMPLOYEE_COST_MODEL_ID);
    expect(schema.schema.inputs.some((input) => input.id === "cycle_time")).toBe(false);
    expect(schema.schema.inputs.some((input) => input.id === "setup_time")).toBe(false);
    expect(schema.schema.inputs.find((input) => input.id === "annual_volume")).toMatchObject({ type: "integer", base_unit: "h/year" });
    expect(schema.schema.inputs.find((input) => input.id === "uncertainty_multiplier")?.physical_hard_bounds).toMatchObject({ min: 0, max: 1, unit: "ratio" });
    const formula = calculate(sampleInputs);
    expect(formula.status).not.toBe("BLOCKED");
    expect(Object.keys(formula.outputs).sort()).toEqual(schema.schema.outputs.map((item) => item.id).sort());
    for (const [id, exactValue] of Object.entries(formula.decimalOutputs ?? {})) {
      expect(Number(exactValue)).toBe(formula.outputs[id]);
    }
  });
});
