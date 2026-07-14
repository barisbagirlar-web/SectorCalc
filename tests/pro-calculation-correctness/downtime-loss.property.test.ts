import Big from "big.js";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { calculate, sampleInputs } from "@/sectorcalc/formulas/pro-v531/downtime-scrap-loss-statement.formula";
import {
  DOWNTIME_LOSS_FORMULA_VERSION,
  DOWNTIME_LOSS_MODEL_ID,
  DOWNTIME_LOSS_SCHEMA_VERSION,
  evaluateDowntimeLoss,
} from "@/sectorcalc/formulas/pro-v531/downtime-loss-core";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";

const Decimal = Big();
Decimal.DP = 50;
Decimal.RM = 2;
Decimal.STRICT = true;

function evaluated(overrides: Record<string, string> = {}) {
  const result = evaluateDowntimeLoss({
    productiveSeconds: "7200000",
    actualSeconds: "6336000",
    hourlyRate: "85",
    scrapQuantity: "150",
    unitCost: "25",
    reworkSeconds: "432000",
    reworkRate: "55",
    materialCost: "50000",
    defectRateRatio: "0.035",
    sourceConfidenceRatio: "0.9",
    ...overrides,
  });
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

describe("downtime, scrap, and rework Decimal properties", () => {
  it("converts normalized seconds to hours exactly and preserves loss decomposition", () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 50_000 }),
      fc.integer({ min: 0, max: 1_000 }),
      fc.integer({ min: 0, max: 10_000 }),
      fc.integer({ min: 0, max: 1_000 }),
      (plannedHours, downtimeHours, scrapQuantity, reworkHours) => {
        fc.pre(downtimeHours <= plannedHours);
        const result = evaluated({
          productiveSeconds: Decimal(plannedHours.toString()).times("3600").toString(),
          actualSeconds: Decimal((plannedHours - downtimeHours).toString()).times("3600").toString(),
          scrapQuantity: scrapQuantity.toString(),
          reworkSeconds: Decimal(reworkHours.toString()).times("3600").toString(),
        });
        expect(result.downtimeHours.eq(downtimeHours.toString())).toBe(true);
        expect(result.totalLoss.eq(result.downtimeCost.plus(result.scrapCost).plus(result.reworkCost))).toBe(true);
      },
    ), { numRuns: 500, seed: 531_901 });
  });

  it("is homogeneous under a common currency-unit scale", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
      const base = evaluated();
      const scale = Decimal(factor.toString());
      const scaled = evaluated({
        hourlyRate: Decimal("85").times(scale).toString(),
        unitCost: Decimal("25").times(scale).toString(),
        reworkRate: Decimal("55").times(scale).toString(),
        materialCost: Decimal("50000").times(scale).toString(),
      });
      expect(scaled.totalLoss.eq(base.totalLoss.times(scale))).toBe(true);
      expect(scaled.lossToMaterialCostRatio.eq(base.lossToMaterialCostRatio)).toBe(true);
      expect(scaled.uptimeRatio.eq(base.uptimeRatio)).toBe(true);
    }), { numRuns: 500, seed: 531_902 });
  });

  it("always encloses total loss and narrows monotonically with confidence", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 1000 }), (basisPoints) => {
      const confidence = Decimal(basisPoints.toString()).div("1000");
      const higherConfidence = confidence.plus("0.001").gt("1") ? confidence : confidence.plus("0.001");
      const base = evaluated({ sourceConfidenceRatio: confidence.toString() });
      const higher = evaluated({ sourceConfidenceRatio: higherConfidence.toString() });
      expect(base.lossLowerBound.lte(base.totalLoss)).toBe(true);
      expect(base.lossUpperBound.gte(base.totalLoss)).toBe(true);
      expect(base.lossLowerBound.gte("0")).toBe(true);
      expect(higher.uncertaintyAmount.lte(base.uncertaintyAmount)).toBe(true);
    }), { numRuns: 500, seed: 531_903 });
  });

  it("fails closed for impossible time, fractional counts, zero denominator, ratios, NaN, and infinity", () => {
    expect(evaluateDowntimeLoss({
      productiveSeconds: "3600", actualSeconds: "3601", hourlyRate: "1", scrapQuantity: "0",
      unitCost: "0", reworkSeconds: "0", reworkRate: "0", materialCost: "1",
      defectRateRatio: "0", sourceConfidenceRatio: "1",
    }).ok).toBe(false);
    for (const [field, value] of [
      ["scrapQuantity", "1.5"], ["materialCost", "0"], ["defectRateRatio", "1.01"],
      ["sourceConfidenceRatio", "-0.01"], ["hourlyRate", Number.NaN], ["unitCost", Number.POSITIVE_INFINITY],
    ] as const) {
      const input = {
        productiveSeconds: "3600", actualSeconds: "0", hourlyRate: "1", scrapQuantity: "0",
        unitCost: "0", reworkSeconds: "0", reworkRate: "0", materialCost: "1",
        defectRateRatio: "0", sourceConfidenceRatio: "1", [field]: value,
      };
      expect(evaluateDowntimeLoss(input).ok).toBe(false);
    }
  });

  it("binds formula, schema, exact outputs, units, and certification versions", () => {
    const schema = resolveApprovedToolSchema("downtime-scrap-loss-statement");
    expect(schema.ok).toBe(true);
    if (!schema.ok) throw new Error(schema.errors.join("|"));
    expect(schema.schema.metadata.formula_version).toBe(DOWNTIME_LOSS_FORMULA_VERSION);
    expect(schema.schema.metadata.schema_version).toBe(DOWNTIME_LOSS_SCHEMA_VERSION);
    expect(schema.schema.calculation_basis.model_id).toBe(DOWNTIME_LOSS_MODEL_ID);
    expect(schema.schema.inputs.find((input) => input.id === "scrap_quantity")).toMatchObject({
      type: "integer", base_unit: "count",
    });
    expect(schema.schema.inputs.find((input) => input.id === "defect_rate_pct")?.physical_hard_bounds).toMatchObject({ max: 1, unit: "ratio" });

    const formula = calculate(sampleInputs);
    expect(formula.status).not.toBe("BLOCKED");
    expect(Object.keys(formula.outputs).sort()).toEqual(schema.schema.outputs.map((output) => output.id).sort());
    expect(Object.keys(formula.decimalOutputs ?? {}).sort()).toEqual(Object.keys(formula.outputs).sort());
    for (const [id, exactValue] of Object.entries(formula.decimalOutputs ?? {})) {
      expect(Number(exactValue)).toBe(formula.outputs[id]);
    }
  });
});
