import Big from "big.js";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { JOB_QUOTE_FORMULA_VERSION, JOB_QUOTE_MODEL_ID, JOB_QUOTE_SCHEMA_VERSION, evaluateJobQuote } from "@/sectorcalc/formulas/pro-v531/job-quote-core";
import { calculate, sampleInputs } from "@/sectorcalc/formulas/pro-v531/job-quote-builder-pro-pack.formula";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";

const Decimal = Big();
Decimal.DP = 50;
Decimal.RM = 2;
Decimal.STRICT = true;
function close(a: Big, b: Big): boolean {
  return a.minus(b).abs().div(a.abs().plus(b.abs()).plus("1")).lte("1e-45");
}
function evaluate(overrides: Record<string, string> = {}) {
  const result = evaluateJobQuote({
    machineRatePerHour: "85", cycleSecondsPerUnit: "12", setupSecondsPerJob: "1800",
    jobQuantity: "500", materialCostPerUnit: "25", targetGrossMarginRatio: "0.3",
    annualVolume: "100000", laborRatePerHour: "45", annualOverheadPool: "350000",
    otherDirectJobCost: "12000", sourceConfidenceRatio: "0.9",
    uncertaintyCoverageMultiplier: "1.1", ...overrides,
  });
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

describe("job quote Decimal properties", () => {
  it("proves route-time, cost, job-total, gross-profit, and gross-margin identities", () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 100_000 }), fc.integer({ min: 0, max: 100_000 }),
      fc.integer({ min: 1, max: 100_000 }), fc.integer({ min: 0, max: 999 }),
      (quantity, setup, annualVolume, marginBp) => {
        const margin = Decimal(String(marginBp)).div("1000");
        const result = evaluate({ jobQuantity: String(quantity), setupSecondsPerJob: String(setup),
          annualVolume: String(annualVolume), targetGrossMarginRatio: margin.toString() });
        expect(result.effectiveSecondsPerUnit.eq(Decimal("12").plus(Decimal(String(setup)).div(String(quantity))))).toBe(true);
        expect(close(result.fullyLoadedJobCost, result.fullyLoadedCostPerUnit.times(String(quantity)))).toBe(true);
        expect(close(result.targetQuoteTotal, result.targetQuotePerUnit.times(String(quantity)))).toBe(true);
        expect(result.grossProfitTotal.eq(result.targetQuoteTotal.minus(result.fullyLoadedJobCost))).toBe(true);
        expect(close(result.targetQuotePerUnit.times(Decimal("1").minus(margin)), result.fullyLoadedCostPerUnit)).toBe(true);
        expect(close(result.achievedGrossMarginRatio, margin)).toBe(true);
      },
    ), { numRuns: 500, seed: 531_991 });
  });

  it("is homogeneous in every monetary input", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
      const scale = Decimal(String(factor));
      const base = evaluate();
      const scaled = evaluate({
        machineRatePerHour: Decimal("85").times(scale).toString(),
        laborRatePerHour: Decimal("45").times(scale).toString(),
        materialCostPerUnit: Decimal("25").times(scale).toString(),
        annualOverheadPool: Decimal("350000").times(scale).toString(),
        otherDirectJobCost: Decimal("12000").times(scale).toString(),
      });
      expect(close(scaled.fullyLoadedCostPerUnit, base.fullyLoadedCostPerUnit.times(scale))).toBe(true);
      expect(close(scaled.targetQuoteTotal, base.targetQuoteTotal.times(scale))).toBe(true);
      expect(close(scaled.quoteUpperBoundPerUnit, base.quoteUpperBoundPerUnit.times(scale))).toBe(true);
      expect(scaled.achievedGrossMarginRatio.eq(base.achievedGrossMarginRatio)).toBe(true);
      expect(scaled.decisionState).toBe(base.decisionState);
    }), { numRuns: 500, seed: 531_992 });
  });

  it("dilutes setup and other direct job cost monotonically as job quantity rises", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 100_000 }), fc.integer({ min: 1, max: 100_000 }), (quantity, increment) => {
      const low = evaluate({ jobQuantity: String(quantity) });
      const high = evaluate({ jobQuantity: String(quantity + increment) });
      expect(high.setupSecondsPerUnit.lt(low.setupSecondsPerUnit)).toBe(true);
      expect(high.otherDirectCostPerUnit.lt(low.otherDirectCostPerUnit)).toBe(true);
      expect(high.fullyLoadedCostPerUnit.lt(low.fullyLoadedCostPerUnit)).toBe(true);
    }), { numRuns: 500, seed: 531_993 });
  });

  it("widens with coverage and narrows with source confidence", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 999 }), (basisPoints) => {
      const ratio = Decimal(String(basisPoints)).div("1000");
      const lowConfidence = evaluate({ sourceConfidenceRatio: ratio.toString() });
      const highConfidence = evaluate({ sourceConfidenceRatio: ratio.plus("0.001").toString() });
      expect(highConfidence.costUncertaintyPerUnit.lte(lowConfidence.costUncertaintyPerUnit)).toBe(true);
      const lowCoverage = evaluate({ uncertaintyCoverageMultiplier: ratio.toString() });
      const highCoverage = evaluate({ uncertaintyCoverageMultiplier: ratio.plus("0.001").toString() });
      expect(highCoverage.costUncertaintyPerUnit.gte(lowCoverage.costUncertaintyPerUnit)).toBe(true);
      expect(lowConfidence.costLowerBoundPerUnit.lte(lowConfidence.fullyLoadedCostPerUnit)).toBe(true);
      expect(lowConfidence.costUpperBoundPerUnit.gte(lowConfidence.fullyLoadedCostPerUnit)).toBe(true);
    }), { numRuns: 500, seed: 531_994 });
  });

  it("fails closed for zero/fractional counts, margin singularity, invalid coverage, negatives, NaN, and infinity", () => {
    const base = { machineRatePerHour: "85", cycleSecondsPerUnit: "12", setupSecondsPerJob: "1800",
      jobQuantity: "500", materialCostPerUnit: "25", targetGrossMarginRatio: "0.3",
      annualVolume: "100000", laborRatePerHour: "45", annualOverheadPool: "350000",
      otherDirectJobCost: "12000", sourceConfidenceRatio: "0.9", uncertaintyCoverageMultiplier: "1.1" };
    expect(evaluateJobQuote({ ...base, jobQuantity: "0" }).ok).toBe(false);
    expect(evaluateJobQuote({ ...base, annualVolume: "1.5" }).ok).toBe(false);
    expect(evaluateJobQuote({ ...base, targetGrossMarginRatio: "1" }).ok).toBe(false);
    expect(evaluateJobQuote({ ...base, uncertaintyCoverageMultiplier: "5.1" }).ok).toBe(false);
    expect(evaluateJobQuote({ ...base, materialCostPerUnit: "-1" }).ok).toBe(false);
    expect(evaluateJobQuote({ ...base, cycleSecondsPerUnit: "0" }).ok).toBe(false);
    expect(evaluateJobQuote({ ...base, machineRatePerHour: Number.NaN }).ok).toBe(false);
    expect(evaluateJobQuote({ ...base, otherDirectJobCost: Number.POSITIVE_INFINITY }).ok).toBe(false);
  });

  it("binds quote-specific units, semantic outputs, and exact audit values", () => {
    const schema = resolveApprovedToolSchema("job-quote-builder-pro-pack");
    if (!schema.ok) throw new Error(`${schema.reason}:${schema.errors.join("|")}`);
    expect(schema.schema.metadata.formula_version).toBe(JOB_QUOTE_FORMULA_VERSION);
    expect(schema.schema.metadata.schema_version).toBe(JOB_QUOTE_SCHEMA_VERSION);
    expect(schema.schema.calculation_basis.model_id).toBe(JOB_QUOTE_MODEL_ID);
    expect(schema.schema.inputs.find((input) => input.id === "batch_quantity")).toMatchObject({ type: "integer", base_unit: "count/job" });
    expect(schema.schema.inputs.find((input) => input.id === "annual_volume")).toMatchObject({ type: "integer", base_unit: "count/year" });
    expect(schema.schema.inputs.find((input) => input.id === "defect_or_loss_cost")).toMatchObject({ base_unit: "currency_unit/job" });
    const formula = calculate(sampleInputs);
    expect(formula.status).not.toBe("BLOCKED");
    expect(Object.keys(formula.outputs).sort()).toEqual(schema.schema.outputs.map((item) => item.id).sort());
    for (const [id, exactValue] of Object.entries(formula.decimalOutputs ?? {})) {
      expect(Number(exactValue)).toBe(formula.outputs[id]);
    }
  });
});
