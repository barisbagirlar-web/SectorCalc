import Big from "big.js";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { SKU_MARGIN_FORMULA_VERSION, SKU_MARGIN_MODEL_ID, SKU_MARGIN_SCHEMA_VERSION, evaluateSkuMargin } from "@/sectorcalc/formulas/pro-v531/sku-margin-core";
import { calculate, sampleInputs } from "@/sectorcalc/formulas/pro-v531/product-sku-margin-ranker.formula";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";

const Decimal = Big();
Decimal.DP = 50;
Decimal.RM = 2;
Decimal.STRICT = true;
function close(a: Big, b: Big): boolean {
  return a.minus(b).abs().div(a.abs().plus(b.abs()).plus("1")).lte("1e-45");
}
function evaluate(overrides: Record<string, string> = {}) {
  const result = evaluateSkuMargin({
    machineRatePerHour: "85", cycleSecondsPerUnit: "12", materialCostPerUnit: "25",
    targetGrossMarginRatio: "0.3", annualVolume: "100000", laborRatePerHour: "45",
    annualOverheadPool: "350000", annualQualityServiceCost: "12000",
    currentSellingPricePerUnit: "100", sourceConfidenceRatio: "0.9", ...overrides,
  });
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

describe("single-SKU margin Decimal properties", () => {
  it("proves cost, margin, target-price, and annual-profit identities", () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 1_000_000 }), fc.integer({ min: 1, max: 1_000_000 }),
      fc.integer({ min: 0, max: 999 }),
      (volume, priceCents, marginBp) => {
        const price = Decimal(String(priceCents)).div("100");
        const margin = Decimal(String(marginBp)).div("1000");
        const result = evaluate({ annualVolume: String(volume), currentSellingPricePerUnit: price.toString(), targetGrossMarginRatio: margin.toString() });
        expect(result.grossProfitPerUnit.eq(price.minus(result.fullyLoadedCostPerUnit))).toBe(true);
        expect(close(result.grossMarginRatio.times(price), result.grossProfitPerUnit)).toBe(true);
        expect(close(result.targetPricePerUnit.times(Decimal("1").minus(margin)), result.fullyLoadedCostPerUnit)).toBe(true);
        expect(result.annualRevenue.eq(price.times(String(volume)))).toBe(true);
        expect(result.annualGrossProfit.eq(result.annualRevenue.minus(result.annualFullyLoadedCost))).toBe(true);
      },
    ), { numRuns: 500, seed: 532_001 });
  });

  it("is homogeneous in all monetary inputs and selling price", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
      const scale = Decimal(String(factor));
      const base = evaluate();
      const scaled = evaluate({
        machineRatePerHour: Decimal("85").times(scale).toString(),
        laborRatePerHour: Decimal("45").times(scale).toString(),
        materialCostPerUnit: Decimal("25").times(scale).toString(),
        annualOverheadPool: Decimal("350000").times(scale).toString(),
        annualQualityServiceCost: Decimal("12000").times(scale).toString(),
        currentSellingPricePerUnit: Decimal("100").times(scale).toString(),
      });
      expect(close(scaled.fullyLoadedCostPerUnit, base.fullyLoadedCostPerUnit.times(scale))).toBe(true);
      expect(close(scaled.annualGrossProfit, base.annualGrossProfit.times(scale))).toBe(true);
      expect(close(scaled.annualProfitLowerBound, base.annualProfitLowerBound.times(scale))).toBe(true);
      expect(scaled.grossMarginRatio.eq(base.grossMarginRatio)).toBe(true);
      expect(scaled.decisionState).toBe(base.decisionState);
    }), { numRuns: 500, seed: 532_002 });
  });

  it("dilutes annual overhead and quality/service burden as volume rises", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 1_000_000 }), fc.integer({ min: 1, max: 1_000_000 }), (volume, increment) => {
      const low = evaluate({ annualVolume: String(volume) });
      const high = evaluate({ annualVolume: String(volume + increment) });
      expect(high.overheadCostPerUnit.lt(low.overheadCostPerUnit)).toBe(true);
      expect(high.qualityServiceCostPerUnit.lt(low.qualityServiceCostPerUnit)).toBe(true);
      expect(high.fullyLoadedCostPerUnit.lt(low.fullyLoadedCostPerUnit)).toBe(true);
    }), { numRuns: 500, seed: 532_003 });
  });

  it("encloses annual profit and narrows monotonically with confidence", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 999 }), (basisPoints) => {
      const confidence = Decimal(String(basisPoints)).div("1000");
      const low = evaluate({ sourceConfidenceRatio: confidence.toString() });
      const high = evaluate({ sourceConfidenceRatio: confidence.plus("0.001").toString() });
      expect(low.annualProfitLowerBound.lte(low.annualGrossProfit)).toBe(true);
      expect(low.annualProfitUpperBound.gte(low.annualGrossProfit)).toBe(true);
      expect(high.annualProfitUncertainty.lte(low.annualProfitUncertainty)).toBe(true);
    }), { numRuns: 500, seed: 532_004 });
  });

  it("fails closed for zero price/cycle/volume, margin singularity, fractions, negatives, NaN, and infinity", () => {
    const base = { machineRatePerHour: "85", cycleSecondsPerUnit: "12", materialCostPerUnit: "25",
      targetGrossMarginRatio: "0.3", annualVolume: "100000", laborRatePerHour: "45",
      annualOverheadPool: "350000", annualQualityServiceCost: "12000",
      currentSellingPricePerUnit: "100", sourceConfidenceRatio: "0.9" };
    expect(evaluateSkuMargin({ ...base, currentSellingPricePerUnit: "0" }).ok).toBe(false);
    expect(evaluateSkuMargin({ ...base, cycleSecondsPerUnit: "0" }).ok).toBe(false);
    expect(evaluateSkuMargin({ ...base, annualVolume: "0" }).ok).toBe(false);
    expect(evaluateSkuMargin({ ...base, annualVolume: "1.5" }).ok).toBe(false);
    expect(evaluateSkuMargin({ ...base, targetGrossMarginRatio: "1" }).ok).toBe(false);
    expect(evaluateSkuMargin({ ...base, annualOverheadPool: "-1" }).ok).toBe(false);
    expect(evaluateSkuMargin({ ...base, machineRatePerHour: Number.NaN }).ok).toBe(false);
    expect(evaluateSkuMargin({ ...base, annualQualityServiceCost: Number.POSITIVE_INFINITY }).ok).toBe(false);
  });

  it("binds explicit selling price, reduced form, semantic outputs, and exact audit values", () => {
    const schema = resolveApprovedToolSchema("product-sku-margin-ranker");
    if (!schema.ok) throw new Error(`${schema.reason}:${schema.errors.join("|")}`);
    expect(schema.schema.metadata.formula_version).toBe(SKU_MARGIN_FORMULA_VERSION);
    expect(schema.schema.metadata.schema_version).toBe(SKU_MARGIN_SCHEMA_VERSION);
    expect(schema.schema.calculation_basis.model_id).toBe(SKU_MARGIN_MODEL_ID);
    expect(schema.schema.calculation_basis.ranking_scope).toContain("ONE_SKU");
    expect(schema.schema.inputs.some((input) => input.id === "setup_time")).toBe(false);
    expect(schema.schema.inputs.some((input) => input.id === "batch_quantity")).toBe(false);
    expect(schema.schema.inputs.find((input) => input.id === "uncertainty_multiplier")).toMatchObject({ base_unit: "currency_unit/unit" });
    const formula = calculate(sampleInputs);
    expect(formula.status).not.toBe("BLOCKED");
    expect(Object.keys(formula.outputs).sort()).toEqual(schema.schema.outputs.map((item) => item.id).sort());
    for (const [id, exactValue] of Object.entries(formula.decimalOutputs ?? {})) {
      expect(Number(exactValue)).toBe(formula.outputs[id]);
    }
  });
});
