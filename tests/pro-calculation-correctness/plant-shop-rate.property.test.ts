import Big from "big.js";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { PLANT_SHOP_RATE_FORMULA_VERSION, PLANT_SHOP_RATE_MODEL_ID, PLANT_SHOP_RATE_SCHEMA_VERSION, evaluatePlantShopRate } from "@/sectorcalc/formulas/pro-v531/plant-shop-rate-core";
import { calculate, sampleInputs } from "@/sectorcalc/formulas/pro-v531/plant-wide-shop-rate-cost-structure-audit.formula";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";

const Decimal = Big();
Decimal.DP = 50;
Decimal.RM = 2;
Decimal.STRICT = true;
function close(a: Big, b: Big): boolean {
  return a.minus(b).abs().div(a.abs().plus(b.abs()).plus("1")).lte("1e-45");
}
function evaluate(overrides: Record<string, string> = {}) {
  const result = evaluatePlantShopRate({
    totalAnnualCost: "2000000", availableAnnualHours: "40000",
    machineGroupAnnualCost: "500000", machineGroupAnnualHours: "15000",
    annualOverheadPool: "600000", overheadAllocationHours: "40000",
    currentShopRate: "85", targetGrossMarginRatio: "0.25",
    utilizationRatio: "0.80", sourceConfidenceRatio: "0.90", ...overrides,
  });
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

describe("plant shop rate Decimal properties", () => {
  it("proves billable-hour, cost-recovery, gross-margin, and annual-revenue identities", () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 1_000_000 }),
      fc.integer({ min: 1, max: 1000 }),
      fc.integer({ min: 0, max: 999 }),
      (hours, utilizationBp, marginBp) => {
        const utilization = Decimal(String(utilizationBp)).div("1000");
        const margin = Decimal(String(marginBp)).div("1000");
        const result = evaluate({ availableAnnualHours: String(hours), machineGroupAnnualHours: String(hours),
          utilizationRatio: utilization.toString(), targetGrossMarginRatio: margin.toString() });
        expect(result.expectedBillableHours.eq(Decimal(String(hours)).times(utilization))).toBe(true);
        expect(close(result.plantCostRecoveryRate.times(result.expectedBillableHours), Decimal("2000000"))).toBe(true);
        expect(close(result.targetShopRate.times(Decimal("1").minus(margin)), result.plantCostRecoveryRate)).toBe(true);
        expect(result.currentAnnualRevenue.eq(result.currentShopRate.times(result.expectedBillableHours))).toBe(true);
        expect(result.annualPricingDelta.eq(result.targetAnnualRevenue.minus(result.currentAnnualRevenue))).toBe(true);
      },
    ), { numRuns: 500, seed: 531_961 });
  });

  it("is homogeneous in monetary inputs and rates", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
      const scale = Decimal(String(factor));
      const base = evaluate();
      const scaled = evaluate({
        totalAnnualCost: Decimal("2000000").times(scale).toString(),
        machineGroupAnnualCost: Decimal("500000").times(scale).toString(),
        annualOverheadPool: Decimal("600000").times(scale).toString(),
        currentShopRate: Decimal("85").times(scale).toString(),
      });
      for (const [left, right] of [
        [scaled.targetShopRate, base.targetShopRate.times(scale)],
        [scaled.annualPricingDelta, base.annualPricingDelta.times(scale)],
        [scaled.targetRateUpperBound, base.targetRateUpperBound.times(scale)],
        [scaled.annualMoneyAtRisk, base.annualMoneyAtRisk.times(scale)],
      ] as const) expect(close(left, right)).toBe(true);
      expect(scaled.expectedBillableHours.eq(base.expectedBillableHours)).toBe(true);
      expect(scaled.decisionState).toBe(base.decisionState);
    }), { numRuns: 500, seed: 531_962 });
  });

  it("raises the required rate when utilization falls or gross margin rises", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 998 }), (basisPoints) => {
      const ratio = Decimal(String(basisPoints)).div("1000");
      const lowUtilization = evaluate({ utilizationRatio: ratio.toString() });
      const highUtilization = evaluate({ utilizationRatio: ratio.plus("0.001").toString() });
      expect(highUtilization.plantCostRecoveryRate.lt(lowUtilization.plantCostRecoveryRate)).toBe(true);
      const lowMargin = evaluate({ targetGrossMarginRatio: ratio.toString() });
      const highMargin = evaluate({ targetGrossMarginRatio: ratio.plus("0.001").toString() });
      expect(highMargin.targetShopRate.gt(lowMargin.targetShopRate)).toBe(true);
    }), { numRuns: 500, seed: 531_963 });
  });

  it("encloses target rate and narrows monotonically with confidence", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 999 }), (basisPoints) => {
      const confidence = Decimal(String(basisPoints)).div("1000");
      const low = evaluate({ sourceConfidenceRatio: confidence.toString() });
      const high = evaluate({ sourceConfidenceRatio: confidence.plus("0.001").toString() });
      expect(low.targetRateLowerBound.lte(low.targetShopRate)).toBe(true);
      expect(low.targetRateUpperBound.gte(low.targetShopRate)).toBe(true);
      expect(high.targetRateUncertainty.lte(low.targetRateUncertainty)).toBe(true);
    }), { numRuns: 500, seed: 531_964 });
  });

  it("fails closed for impossible subsets, zero denominators, margin singularity, negatives, NaN, and infinity", () => {
    const base = { totalAnnualCost: "2000000", availableAnnualHours: "40000",
      machineGroupAnnualCost: "500000", machineGroupAnnualHours: "15000",
      annualOverheadPool: "600000", overheadAllocationHours: "40000", currentShopRate: "85",
      targetGrossMarginRatio: "0.25", utilizationRatio: "0.8", sourceConfidenceRatio: "0.9" };
    expect(evaluatePlantShopRate({ ...base, utilizationRatio: "0" }).ok).toBe(false);
    expect(evaluatePlantShopRate({ ...base, targetGrossMarginRatio: "1" }).ok).toBe(false);
    expect(evaluatePlantShopRate({ ...base, machineGroupAnnualCost: "2000001" }).ok).toBe(false);
    expect(evaluatePlantShopRate({ ...base, machineGroupAnnualHours: "40001" }).ok).toBe(false);
    expect(evaluatePlantShopRate({ ...base, annualOverheadPool: "2000001" }).ok).toBe(false);
    expect(evaluatePlantShopRate({ ...base, currentShopRate: "-1" }).ok).toBe(false);
    expect(evaluatePlantShopRate({ ...base, totalAnnualCost: Number.NaN }).ok).toBe(false);
    expect(evaluatePlantShopRate({ ...base, availableAnnualHours: Number.POSITIVE_INFINITY }).ok).toBe(false);
  });

  it("binds annual-hour units, ratio semantics, outputs, and exact audit values", () => {
    const schema = resolveApprovedToolSchema("plant-wide-shop-rate-cost-structure-audit");
    if (!schema.ok) throw new Error(`${schema.reason}:${schema.errors.join("|")}`);
    expect(schema.schema.metadata.formula_version).toBe(PLANT_SHOP_RATE_FORMULA_VERSION);
    expect(schema.schema.metadata.schema_version).toBe(PLANT_SHOP_RATE_SCHEMA_VERSION);
    expect(schema.schema.calculation_basis.model_id).toBe(PLANT_SHOP_RATE_MODEL_ID);
    expect(schema.schema.inputs.find((input) => input.id === "total_productive_hours")).toMatchObject({ base_unit: "h/year" });
    expect(schema.schema.inputs.find((input) => input.id === "utilization_pct")?.physical_hard_bounds).toMatchObject({ min: 0.000001, max: 1, unit: "ratio" });
    const formula = calculate(sampleInputs);
    expect(formula.status).not.toBe("BLOCKED");
    expect(Object.keys(formula.outputs).sort()).toEqual(schema.schema.outputs.map((item) => item.id).sort());
    for (const [id, exactValue] of Object.entries(formula.decimalOutputs ?? {})) {
      expect(Number(exactValue)).toBe(formula.outputs[id]);
    }
  });
});
