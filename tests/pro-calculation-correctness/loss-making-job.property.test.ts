import Big from "big.js";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import {
  LOSS_MAKING_JOB_FORMULA_VERSION,
  LOSS_MAKING_JOB_MODEL_ID,
  LOSS_MAKING_JOB_SCHEMA_VERSION,
  evaluateLossMakingJob,
} from "@/sectorcalc/formulas/pro-v531/loss-making-job-core";
import { calculate, sampleInputs } from "@/sectorcalc/formulas/pro-v531/loss-making-job-detector.formula";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";

const Decimal = Big();
Decimal.DP = 50;
Decimal.RM = 2;
Decimal.STRICT = true;

function close(a: Big, b: Big, tolerance = "1e-45"): boolean {
  return a.minus(b).abs().div(a.abs().plus(b.abs()).plus("1")).lte(tolerance);
}

function evaluate(overrides: Record<string, string> = {}) {
  const result = evaluateLossMakingJob({
    machineRatePerHour: "85", cycleSecondsPerUnit: "12", setupSecondsPerJob: "1800",
    jobQuantity: "100", materialCostPerUnit: "300", targetGrossMarginRatio: "0.25",
    annualVolume: "5000", laborRatePerHour: "55", annualOverheadPool: "350000",
    otherDirectJobCost: "20", quotedJobRevenue: "50000", sourceConfidenceRatio: "0.9",
    ...overrides,
  });
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

describe("loss-making job Decimal properties", () => {
  it("proves full-cost, gross-margin, target-quote, and annualization identities", () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 1_000_000 }),
      fc.integer({ min: 1, max: 1_000_000 }),
      fc.integer({ min: 1, max: 10_000_000 }),
      fc.integer({ min: 0, max: 999 }),
      (quantity, annualVolume, quoteCents, marginBp) => {
        const quote = Decimal(String(quoteCents)).div("100");
        const margin = Decimal(String(marginBp)).div("1000");
        const result = evaluate({
          jobQuantity: String(quantity), annualVolume: String(annualVolume),
          quotedJobRevenue: quote.toString(), targetGrossMarginRatio: margin.toString(),
        });
        expect(close(result.setupSecondsPerUnit.times(String(quantity)), Decimal("1800"))).toBe(true);
        expect(result.fullyLoadedJobCost.eq(result.fullyLoadedCostPerUnit.times(String(quantity)))).toBe(true);
        expect(result.grossProfit.eq(quote.minus(result.fullyLoadedJobCost))).toBe(true);
        expect(close(result.grossMarginRatio.times(quote), result.grossProfit)).toBe(true);
        expect(close(result.minimumQuoteTotal.times(Decimal("1").minus(margin)), result.fullyLoadedJobCost)).toBe(true);
        // Reversing a 50-decimal division by a six-digit count can accumulate
        // at most a few 1e-45 relative units; this remains far below one ULP
        // at the JSON presentation boundary.
        expect(close(result.annualEquivalentJobs.times(String(quantity)), Decimal(String(annualVolume)), "1e-43")).toBe(true);
        expect(result.annualEquivalentGrossProfit.eq(result.grossProfit.times(result.annualEquivalentJobs))).toBe(true);
      },
    ), { numRuns: 500, seed: 533_001 });
  });

  it("is homogeneous in all monetary inputs and explicit quoted revenue", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
      const scale = Decimal(String(factor));
      const base = evaluate();
      const scaled = evaluate({
        machineRatePerHour: Decimal("85").times(scale).toString(),
        laborRatePerHour: Decimal("55").times(scale).toString(),
        materialCostPerUnit: Decimal("300").times(scale).toString(),
        annualOverheadPool: Decimal("350000").times(scale).toString(),
        otherDirectJobCost: Decimal("20").times(scale).toString(),
        quotedJobRevenue: Decimal("50000").times(scale).toString(),
      });
      expect(close(scaled.fullyLoadedJobCost, base.fullyLoadedJobCost.times(scale))).toBe(true);
      expect(close(scaled.grossProfit, base.grossProfit.times(scale))).toBe(true);
      expect(close(scaled.profitLowerBound, base.profitLowerBound.times(scale))).toBe(true);
      expect(scaled.grossMarginRatio.eq(base.grossMarginRatio)).toBe(true);
      expect(scaled.decisionState).toBe(base.decisionState);
    }), { numRuns: 500, seed: 533_002 });
  });

  it("dilutes setup and job-level direct cost as job quantity increases", () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 500_000 }),
      fc.integer({ min: 1, max: 500_000 }),
      (quantity, increment) => {
        const low = evaluate({ jobQuantity: String(quantity) });
        const high = evaluate({ jobQuantity: String(quantity + increment) });
        expect(high.setupSecondsPerUnit.lt(low.setupSecondsPerUnit)).toBe(true);
        expect(high.otherDirectCostPerUnit.lt(low.otherDirectCostPerUnit)).toBe(true);
        expect(high.effectiveSecondsPerUnit.lt(low.effectiveSecondsPerUnit)).toBe(true);
      },
    ), { numRuns: 500, seed: 533_003 });
  });

  it("encloses gross profit and narrows monotonically with evidence confidence", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 999 }), (basisPoints) => {
      const confidence = Decimal(String(basisPoints)).div("1000");
      const low = evaluate({ sourceConfidenceRatio: confidence.toString() });
      const high = evaluate({ sourceConfidenceRatio: confidence.plus("0.001").toString() });
      expect(low.profitLowerBound.lte(low.grossProfit)).toBe(true);
      expect(low.profitUpperBound.gte(low.grossProfit)).toBe(true);
      expect(high.profitUncertainty.lte(low.profitUncertainty)).toBe(true);
      expect(high.profitLowerBound.gte(low.profitLowerBound)).toBe(true);
      expect(high.profitUpperBound.lte(low.profitUpperBound)).toBe(true);
      expect(low.moneyAtRisk.eq(low.profitLowerBound.lt("0") ? low.profitLowerBound.abs() : Decimal("0"))).toBe(true);
    }), { numRuns: 500, seed: 533_004 });
  });

  it("fails closed for missing economic denominators, invalid counts, negatives, NaN, and infinity", () => {
    const base = {
      machineRatePerHour: "85", cycleSecondsPerUnit: "12", setupSecondsPerJob: "1800",
      jobQuantity: "100", materialCostPerUnit: "300", targetGrossMarginRatio: "0.25",
      annualVolume: "5000", laborRatePerHour: "55", annualOverheadPool: "350000",
      otherDirectJobCost: "20", quotedJobRevenue: "50000", sourceConfidenceRatio: "0.9",
    };
    expect(evaluateLossMakingJob({ ...base, quotedJobRevenue: "0" }).ok).toBe(false);
    expect(evaluateLossMakingJob({ ...base, cycleSecondsPerUnit: "0" }).ok).toBe(false);
    expect(evaluateLossMakingJob({ ...base, jobQuantity: "0" }).ok).toBe(false);
    expect(evaluateLossMakingJob({ ...base, jobQuantity: "1.5" }).ok).toBe(false);
    expect(evaluateLossMakingJob({ ...base, annualVolume: "0" }).ok).toBe(false);
    expect(evaluateLossMakingJob({ ...base, annualVolume: "1.5" }).ok).toBe(false);
    expect(evaluateLossMakingJob({ ...base, targetGrossMarginRatio: "1" }).ok).toBe(false);
    expect(evaluateLossMakingJob({ ...base, materialCostPerUnit: "-1" }).ok).toBe(false);
    expect(evaluateLossMakingJob({ ...base, machineRatePerHour: Number.NaN }).ok).toBe(false);
    expect(evaluateLossMakingJob({ ...base, annualOverheadPool: Number.POSITIVE_INFINITY }).ok).toBe(false);
  });

  it("binds explicit revenue, semantic units, exact outputs, and the certified schema", () => {
    const schema = resolveApprovedToolSchema("loss-making-job-detector");
    if (!schema.ok) throw new Error(`${schema.reason}:${schema.errors.join("|")}`);
    expect(schema.schema.metadata.formula_version).toBe(LOSS_MAKING_JOB_FORMULA_VERSION);
    expect(schema.schema.metadata.schema_version).toBe(LOSS_MAKING_JOB_SCHEMA_VERSION);
    expect(schema.schema.calculation_basis.model_id).toBe(LOSS_MAKING_JOB_MODEL_ID);
    expect(schema.schema.calculation_basis.revenue_policy).toContain("EXPLICIT_USER_ENTERED");
    expect(schema.schema.inputs.find((input) => input.id === "uncertainty_multiplier")).toMatchObject({
      name: "Quoted Job Revenue", base_unit: "currency_unit/job",
    });
    expect(schema.schema.inputs.find((input) => input.id === "overhead_rate")).toMatchObject({ base_unit: "currency_unit/year" });
    const formula = calculate(sampleInputs);
    expect(formula.status).not.toBe("BLOCKED");
    expect(Object.keys(formula.outputs).sort()).toEqual(schema.schema.outputs.map((item) => item.id).sort());
    for (const [id, exactValue] of Object.entries(formula.decimalOutputs ?? {})) {
      expect(Number(exactValue)).toBe(formula.outputs[id]);
    }
  });
});
