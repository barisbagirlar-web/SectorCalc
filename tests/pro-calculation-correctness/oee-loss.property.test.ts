import Big from "big.js";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { calculate, sampleInputs } from "@/sectorcalc/formulas/pro-v531/oee-loss-monetization-improvement-business-case.formula";
import { OEE_LOSS_FORMULA_VERSION, OEE_LOSS_MODEL_ID, OEE_LOSS_SCHEMA_VERSION, evaluateOeeLoss } from "@/sectorcalc/formulas/pro-v531/oee-loss-core";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";

const Decimal = Big();
Decimal.DP = 50;
Decimal.RM = 2;
Decimal.STRICT = true;

function withinRelativeEnvelope(left: Big, right: Big, tolerance = "1e-45"): boolean {
  return left.minus(right).abs().div(left.abs().plus(right.abs()).plus("1")).lte(tolerance);
}

function evaluate(overrides: Record<string, string> = {}) {
  const result = evaluateOeeLoss({ plannedSeconds: "600", operatingSeconds: "550", idealCycleSeconds: "0.5",
    totalParts: "1000", goodParts: "950", hourlyContribution: "100", improvementCost: "5",
    sourceConfidenceRatio: "0.9", ...overrides });
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

describe("OEE loss monetization Decimal properties", () => {
  it("proves OEE identity, component bounds, and exact time-loss decomposition", () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 100_000 }), fc.integer({ min: 1, max: 100_000 }),
      fc.integer({ min: 1, max: 100_000 }), fc.integer({ min: 0, max: 100_000 }),
      (planned, operating, total, good) => {
        fc.pre(operating <= planned && total <= operating && good <= total);
        const result = evaluate({ plannedSeconds: String(planned), operatingSeconds: String(operating),
          idealCycleSeconds: "1", totalParts: String(total), goodParts: String(good) });
        expect(result.availability.gte("0") && result.availability.lte("1")).toBe(true);
        expect(result.performance.gte("0") && result.performance.lte("1")).toBe(true);
        expect(result.quality.gte("0") && result.quality.lte("1")).toBe(true);
        expect(withinRelativeEnvelope(
          result.oee,
          result.availability.times(result.performance).times(result.quality),
        )).toBe(true);
        expect(result.oee.eq(result.valuableOperatingSeconds.div(String(planned)))).toBe(true);
        expect(withinRelativeEnvelope(
          result.totalOeeLoss,
          result.availabilityLoss.plus(result.performanceLoss).plus(result.qualityLoss),
        )).toBe(true);
      },
    ), { numRuns: 500, seed: 531_921 });
  });

  it("is linear in hourly contribution without changing dimensionless OEE", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
      const scale = Decimal(String(factor));
      const base = evaluate();
      const scaled = evaluate({ hourlyContribution: Decimal("100").times(scale).toString(), improvementCost: Decimal("5").times(scale).toString() });
      expect(withinRelativeEnvelope(scaled.totalOeeLoss, base.totalOeeLoss.times(scale))).toBe(true);
      expect(withinRelativeEnvelope(scaled.lossLowerBound, base.lossLowerBound.times(scale))).toBe(true);
      expect(scaled.oee.eq(base.oee)).toBe(true);
      expect(scaled.decisionState).toBe(base.decisionState);
    }), { numRuns: 500, seed: 531_922 });
  });

  it("encloses loss and narrows monotonically as source confidence rises", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 999 }), (basisPoints) => {
      const confidence = Decimal(String(basisPoints)).div("1000");
      const low = evaluate({ sourceConfidenceRatio: confidence.toString() });
      const high = evaluate({ sourceConfidenceRatio: confidence.plus("0.001").toString() });
      expect(low.lossLowerBound.lte(low.totalOeeLoss)).toBe(true);
      expect(low.lossUpperBound.gte(low.totalOeeLoss)).toBe(true);
      expect(low.lossLowerBound.gte("0")).toBe(true);
      expect(high.uncertaintyAmount.lte(low.uncertaintyAmount)).toBe(true);
    }), { numRuns: 500, seed: 531_923 });
  });

  it("fails closed for impossible chronology, performance, counts, ratios, NaN, and infinity", () => {
    const base = { plannedSeconds: "600", operatingSeconds: "550", idealCycleSeconds: "0.5", totalParts: "1000",
      goodParts: "950", hourlyContribution: "100", improvementCost: "5", sourceConfidenceRatio: "0.9" };
    expect(evaluateOeeLoss({ ...base, operatingSeconds: "601" }).ok).toBe(false);
    expect(evaluateOeeLoss({ ...base, idealCycleSeconds: "0.6" }).ok).toBe(false);
    expect(evaluateOeeLoss({ ...base, goodParts: "1001" }).ok).toBe(false);
    expect(evaluateOeeLoss({ ...base, totalParts: "1.5" }).ok).toBe(false);
    expect(evaluateOeeLoss({ ...base, sourceConfidenceRatio: "1.01" }).ok).toBe(false);
    expect(evaluateOeeLoss({ ...base, hourlyContribution: Number.NaN }).ok).toBe(false);
    expect(evaluateOeeLoss({ ...base, improvementCost: Number.POSITIVE_INFINITY }).ok).toBe(false);
  });

  it("binds the reduced form, semantic outputs, and exact audit values", () => {
    const schema = resolveApprovedToolSchema("oee-loss-monetization-improvement-business-case");
    if (!schema.ok) throw new Error(`${schema.reason}:${schema.errors.join("|")}`);
    expect(schema.schema.metadata.formula_version).toBe(OEE_LOSS_FORMULA_VERSION);
    expect(schema.schema.metadata.schema_version).toBe(OEE_LOSS_SCHEMA_VERSION);
    expect(schema.schema.calculation_basis.model_id).toBe(OEE_LOSS_MODEL_ID);
    expect(schema.schema.inputs.some((input) => input.id === "net_operating_time")).toBe(false);
    expect(schema.schema.inputs.some((input) => input.id === "valuable_operating_time")).toBe(false);
    expect(schema.schema.inputs.find((input) => input.id === "total_parts")).toMatchObject({ type: "integer", base_unit: "count" });
    const formula = calculate(sampleInputs);
    expect(formula.status).not.toBe("BLOCKED");
    expect(Object.keys(formula.outputs).sort()).toEqual(schema.schema.outputs.map((item) => item.id).sort());
    for (const [id, exactValue] of Object.entries(formula.decimalOutputs ?? {})) {
      expect(Number(exactValue)).toBe(formula.outputs[id]);
    }
  });
});
