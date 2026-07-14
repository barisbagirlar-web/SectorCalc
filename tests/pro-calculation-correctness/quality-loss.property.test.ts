import Big from "big.js";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { calculate, sampleInputs } from "@/sectorcalc/formulas/pro-v531/scrap-rework-cost-tracker.formula";
import {
  QUALITY_LOSS_FORMULA_VERSION,
  QUALITY_LOSS_MODEL_ID,
  QUALITY_LOSS_SCHEMA_VERSION,
  evaluateQualityLoss,
} from "@/sectorcalc/formulas/pro-v531/quality-loss-core";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";

const Decimal = Big();
Decimal.DP = 50;
Decimal.RM = 2;
Decimal.STRICT = true;

function evaluate(overrides: Record<string, string> = {}) {
  const result = evaluateQualityLoss({
    totalProduced: "10000", scrapQuantity: "150", reworkQuantity: "80",
    unitMaterialCost: "25", unitLaborCost: "15", reworkLaborRate: "45",
    reworkSecondsPerUnit: "0.5", defectRateTargetRatio: "0.02",
    monthlyVolume: "10000", sourceConfidenceRatio: "0.9", ...overrides,
  });
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

describe("scrap and rework quality-loss Decimal properties", () => {
  it("preserves count, defect-rate, and exact loss decomposition identities", () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 1_000_000 }),
      fc.integer({ min: 0, max: 1_000_000 }),
      fc.integer({ min: 0, max: 1_000_000 }),
      (total, scrap, rework) => {
        fc.pre(scrap + rework <= total);
        const result = evaluate({ totalProduced: String(total), scrapQuantity: String(scrap), reworkQuantity: String(rework) });
        expect(result.totalDefectUnits.eq(String(scrap + rework))).toBe(true);
        expect(result.totalQualityLoss.eq(result.scrapCost.plus(result.reworkCost))).toBe(true);
        expect(result.defectRateRatio.eq(result.totalDefectUnits.div(String(total)))).toBe(true);
        expect(result.lossPerProducedUnit.eq(result.totalQualityLoss.div(String(total)))).toBe(true);
      },
    ), { numRuns: 500, seed: 531_911 });
  });

  it("is homogeneous under currency scaling and linear in monthly volume", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
      const scale = Decimal(String(factor));
      const base = evaluate();
      const monetary = evaluate({
        unitMaterialCost: Decimal("25").times(scale).toString(),
        unitLaborCost: Decimal("15").times(scale).toString(),
        reworkLaborRate: Decimal("45").times(scale).toString(),
      });
      expect(monetary.totalQualityLoss.eq(base.totalQualityLoss.times(scale))).toBe(true);
      expect(monetary.defectRateRatio.eq(base.defectRateRatio)).toBe(true);
      const volume = evaluate({ monthlyVolume: Decimal("10000").times(scale).toString() });
      expect(volume.projectedMonthlyQualityLoss.eq(base.projectedMonthlyQualityLoss.times(scale))).toBe(true);
    }), { numRuns: 500, seed: 531_912 });
  });

  it("encloses projected loss and narrows monotonically with confidence", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 999 }), (basisPoints) => {
      const confidence = Decimal(String(basisPoints)).div("1000");
      const low = evaluate({ sourceConfidenceRatio: confidence.toString() });
      const high = evaluate({ sourceConfidenceRatio: confidence.plus("0.001").toString() });
      expect(low.lossLowerBound.lte(low.projectedMonthlyQualityLoss)).toBe(true);
      expect(low.lossUpperBound.gte(low.projectedMonthlyQualityLoss)).toBe(true);
      expect(low.lossLowerBound.gte("0")).toBe(true);
      expect(high.uncertaintyAmount.lte(low.uncertaintyAmount)).toBe(true);
    }), { numRuns: 500, seed: 531_913 });
  });

  it("fails closed for count, population, ratio, and finite-number violations", () => {
    const base = {
      totalProduced: "100", scrapQuantity: "10", reworkQuantity: "5", unitMaterialCost: "1",
      unitLaborCost: "1", reworkLaborRate: "1", reworkSecondsPerUnit: "1",
      defectRateTargetRatio: "0.1", monthlyVolume: "100", sourceConfidenceRatio: "1",
    };
    expect(evaluateQualityLoss({ ...base, scrapQuantity: "96" }).ok).toBe(false);
    expect(evaluateQualityLoss({ ...base, totalProduced: "0" }).ok).toBe(false);
    expect(evaluateQualityLoss({ ...base, reworkQuantity: "1.5" }).ok).toBe(false);
    expect(evaluateQualityLoss({ ...base, defectRateTargetRatio: "1.01" }).ok).toBe(false);
    expect(evaluateQualityLoss({ ...base, reworkLaborRate: Number.NaN }).ok).toBe(false);
    expect(evaluateQualityLoss({ ...base, unitMaterialCost: Number.POSITIVE_INFINITY }).ok).toBe(false);
  });

  it("binds semantic schema outputs and exact formula audit values", () => {
    const schema = resolveApprovedToolSchema("scrap-rework-cost-tracker");
    if (!schema.ok) throw new Error(`${schema.reason}:${schema.errors.join("|")}`);
    expect(schema.schema.metadata.formula_version).toBe(QUALITY_LOSS_FORMULA_VERSION);
    expect(schema.schema.metadata.schema_version).toBe(QUALITY_LOSS_SCHEMA_VERSION);
    expect(schema.schema.calculation_basis.model_id).toBe(QUALITY_LOSS_MODEL_ID);
    expect(schema.schema.inputs.find((input) => input.id === "total_produced")).toMatchObject({ type: "integer", base_unit: "count" });
    expect(schema.schema.inputs.find((input) => input.id === "defect_rate_target")?.physical_hard_bounds).toMatchObject({ max: 1, unit: "ratio" });
    const formula = calculate(sampleInputs);
    expect(formula.status).not.toBe("BLOCKED");
    expect(Object.keys(formula.outputs).sort()).toEqual(schema.schema.outputs.map((item) => item.id).sort());
    for (const [id, exactValue] of Object.entries(formula.decimalOutputs ?? {})) {
      expect(Number(exactValue)).toBe(formula.outputs[id]);
    }
  });
});
