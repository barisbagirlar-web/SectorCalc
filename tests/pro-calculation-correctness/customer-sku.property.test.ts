import Big from "big.js";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { CUSTOMER_SKU_FORMULA_VERSION, CUSTOMER_SKU_MODEL_ID, CUSTOMER_SKU_SCHEMA_VERSION, evaluateCustomerSku } from "@/sectorcalc/formulas/pro-v531/customer-sku-profitability-core";
import { calculate, sampleInputs } from "@/sectorcalc/formulas/pro-v531/customer-sku-profitability-forensics.formula";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";

const Decimal = Big();
Decimal.DP = 50;
Decimal.RM = 2;
Decimal.STRICT = true;
function close(a: Big, b: Big): boolean { return a.minus(b).abs().div(a.abs().plus(b.abs()).plus("1")).lte("1e-44"); }
function evaluate(overrides: Record<string, string> = {}) {
  const result = evaluateCustomerSku({
    sellingPricePerUnit: "100", variableCostPerUnit: "60", annualVolume: "10000",
    logisticsCostRatioOfRevenue: "0.05", serviceCostRatioOfRevenue: "0.03",
    returnCreditCostRatioOfRevenue: "0.02", targetGrossMarginRatio: "0.25",
    annualCustomerSupportCost: "10000", annualCollectionCommercialOverhead: "5000",
    sourceConfidenceRatio: "0.9", ...overrides,
  });
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

describe("customer-SKU profitability Decimal properties", () => {
  it("proves unit cost, margin, target price, and annual contribution identities", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 1_000_000 }), fc.integer({ min: 1, max: 1_000_000 }), fc.integer({ min: 0, max: 999 }),
      (volume, priceCents, marginBp) => {
        const price = Decimal(String(priceCents)).div("100");
        const margin = Decimal(String(marginBp)).div("1000");
        const result = evaluate({ annualVolume: String(volume), sellingPricePerUnit: price.toString(), targetGrossMarginRatio: margin.toString() });
        expect(result.netContributionPerUnit.eq(price.minus(result.fullyLoadedCustomerSkuCostPerUnit))).toBe(true);
        expect(close(result.netContributionMarginRatio.times(price), result.netContributionPerUnit)).toBe(true);
        expect(close(result.targetPricePerUnit.times(Decimal("1").minus(margin)), result.fullyLoadedCustomerSkuCostPerUnit)).toBe(true);
        expect(result.annualRevenue.eq(price.times(String(volume)))).toBe(true);
        expect(result.annualNetContribution.eq(result.annualRevenue.minus(result.annualFullyLoadedCost))).toBe(true);
      }), { numRuns: 500, seed: 537_001 });
  });

  it("is homogeneous in all monetary inputs without changing ratios or decisions", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
      const scale = Decimal(String(factor));
      const base = evaluate();
      const scaled = evaluate({
        sellingPricePerUnit: Decimal("100").times(scale).toString(),
        variableCostPerUnit: Decimal("60").times(scale).toString(),
        annualCustomerSupportCost: Decimal("10000").times(scale).toString(),
        annualCollectionCommercialOverhead: Decimal("5000").times(scale).toString(),
      });
      expect(close(scaled.fullyLoadedCustomerSkuCostPerUnit, base.fullyLoadedCustomerSkuCostPerUnit.times(scale))).toBe(true);
      expect(close(scaled.annualNetContribution, base.annualNetContribution.times(scale))).toBe(true);
      expect(close(scaled.moneyAtRisk, base.moneyAtRisk.times(scale))).toBe(true);
      expect(scaled.netContributionMarginRatio.eq(base.netContributionMarginRatio)).toBe(true);
      expect(scaled.decisionState).toBe(base.decisionState);
    }), { numRuns: 500, seed: 537_002 });
  });

  it("raises cost with burden ratios and dilutes positive annual fixed costs with volume", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 999 }), fc.integer({ min: 1, max: 500_000 }), fc.integer({ min: 1, max: 500_000 }),
      (basisPoints, volume, increment) => {
        const ratio = Decimal(String(basisPoints)).div("1000");
        const lowRatio = evaluate({ logisticsCostRatioOfRevenue: ratio.toString() });
        const highRatio = evaluate({ logisticsCostRatioOfRevenue: ratio.plus("0.001").toString() });
        expect(highRatio.logisticsCostPerUnit.gt(lowRatio.logisticsCostPerUnit)).toBe(true);
        expect(highRatio.fullyLoadedCustomerSkuCostPerUnit.gt(lowRatio.fullyLoadedCustomerSkuCostPerUnit)).toBe(true);
        const lowVolume = evaluate({ annualVolume: String(volume) });
        const highVolume = evaluate({ annualVolume: String(volume + increment) });
        expect(highVolume.customerSupportCostPerUnit.lt(lowVolume.customerSupportCostPerUnit)).toBe(true);
        expect(highVolume.collectionOverheadPerUnit.lt(lowVolume.collectionOverheadPerUnit)).toBe(true);
      }), { numRuns: 500, seed: 537_003 });
  });

  it("encloses annual contribution and narrows monotonically with confidence", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 999 }), (basisPoints) => {
      const confidence = Decimal(String(basisPoints)).div("1000");
      const low = evaluate({ sourceConfidenceRatio: confidence.toString() });
      const high = evaluate({ sourceConfidenceRatio: confidence.plus("0.001").toString() });
      expect(low.annualProfitLowerBound.lte(low.annualNetContribution)).toBe(true);
      expect(low.annualProfitUpperBound.gte(low.annualNetContribution)).toBe(true);
      expect(high.annualProfitUncertainty.lte(low.annualProfitUncertainty)).toBe(true);
      expect(high.annualProfitLowerBound.gte(low.annualProfitLowerBound)).toBe(true);
    }), { numRuns: 500, seed: 537_004 });
  });

  it("fails closed for zero price/volume, margin singularity, invalid ratios/counts, negatives, NaN, and infinity", () => {
    const base = { sellingPricePerUnit: "100", variableCostPerUnit: "60", annualVolume: "10000",
      logisticsCostRatioOfRevenue: "0.05", serviceCostRatioOfRevenue: "0.03", returnCreditCostRatioOfRevenue: "0.02",
      targetGrossMarginRatio: "0.25", annualCustomerSupportCost: "10000", annualCollectionCommercialOverhead: "5000", sourceConfidenceRatio: "0.9" };
    expect(evaluateCustomerSku({ ...base, sellingPricePerUnit: "0" }).ok).toBe(false);
    expect(evaluateCustomerSku({ ...base, annualVolume: "0" }).ok).toBe(false);
    expect(evaluateCustomerSku({ ...base, annualVolume: "1.5" }).ok).toBe(false);
    expect(evaluateCustomerSku({ ...base, targetGrossMarginRatio: "1" }).ok).toBe(false);
    expect(evaluateCustomerSku({ ...base, serviceCostRatioOfRevenue: "1.1" }).ok).toBe(false);
    expect(evaluateCustomerSku({ ...base, annualCustomerSupportCost: "-1" }).ok).toBe(false);
    expect(evaluateCustomerSku({ ...base, variableCostPerUnit: Number.NaN }).ok).toBe(false);
    expect(evaluateCustomerSku({ ...base, annualCollectionCommercialOverhead: Number.POSITIVE_INFINITY }).ok).toBe(false);
  });

  it("binds canonical ratios, annual count, semantic outputs, and exact audit values", () => {
    const schema = resolveApprovedToolSchema("customer-sku-profitability-forensics");
    if (!schema.ok) throw new Error(`${schema.reason}:${schema.errors.join("|")}`);
    expect(schema.schema.metadata.formula_version).toBe(CUSTOMER_SKU_FORMULA_VERSION);
    expect(schema.schema.metadata.schema_version).toBe(CUSTOMER_SKU_SCHEMA_VERSION);
    expect(schema.schema.calculation_basis.model_id).toBe(CUSTOMER_SKU_MODEL_ID);
    expect(schema.schema.calculation_basis.scope).toContain("ONE_CUSTOMER_SKU");
    expect(schema.schema.inputs.find((input) => input.id === "annual_volume")).toMatchObject({ type: "integer", base_unit: "count/year" });
    expect(schema.schema.inputs.find((input) => input.id === "logistics_cost_pct")).toMatchObject({ base_unit: "ratio" });
    const formula = calculate(sampleInputs);
    expect(formula.status).not.toBe("BLOCKED");
    expect(Object.keys(formula.outputs).sort()).toEqual(schema.schema.outputs.map((item) => item.id).sort());
    for (const [id, exactValue] of Object.entries(formula.decimalOutputs ?? {})) expect(Number(exactValue)).toBe(formula.outputs[id]);
  });
});
