import Big from "big.js";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { MAKE_BUY_FORMULA_VERSION, MAKE_BUY_MODEL_ID, MAKE_BUY_SCHEMA_VERSION, evaluateMakeBuy } from "@/sectorcalc/formulas/pro-v531/make-buy-core";
import { calculate, sampleInputs } from "@/sectorcalc/formulas/pro-v531/outsource-vs-in-house-analyzer.formula";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";

const Decimal = Big();
Decimal.DP = 50;
Decimal.RM = 2;
Decimal.STRICT = true;
function close(a: Big, b: Big): boolean {
  return a.minus(b).abs().div(a.abs().plus(b.abs()).plus("1")).lte("1e-45");
}
function evaluate(overrides: Record<string, string> = {}) {
  const result = evaluateMakeBuy({
    inHouseMaterialCostPerUnit: "30", inHouseLaborCostPerUnit: "85",
    inHouseOverheadCostPerUnit: "75", inHouseAnnualSetupCost: "500",
    outsourcePricePerUnit: "95", outsourceLogisticsCostPerUnit: "8",
    annualVolume: "5000", outsourceQualityRiskRatio: "0.05",
    sourceConfidenceRatio: "0.9", ...overrides,
  });
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

describe("make-buy Decimal properties", () => {
  it("proves unit and annual cost decompositions and delta sign convention", () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 1_000_000 }),
      fc.integer({ min: 0, max: 1_000_000 }),
      fc.integer({ min: 0, max: 1000 }),
      (volume, setup, riskBp) => {
        const risk = Decimal(String(riskBp)).div("1000");
        const result = evaluate({ annualVolume: String(volume), inHouseAnnualSetupCost: String(setup), outsourceQualityRiskRatio: risk.toString() });
        expect(result.inHouseTotalCostPerUnit.eq(result.inHouseVariableCostPerUnit.plus(result.setupCostPerUnit))).toBe(true);
        expect(result.inHouseAnnualCost.eq(result.inHouseVariableCostPerUnit.times(String(volume)).plus(String(setup)))).toBe(true);
        expect(result.outsourceAnnualCost.eq(result.outsourceRiskAdjustedCostPerUnit.times(String(volume)))).toBe(true);
        expect(result.annualCostDelta.eq(result.outsourceAnnualCost.minus(result.inHouseAnnualCost))).toBe(true);
        expect(close(result.costDeltaPerUnit.times(String(volume)), result.annualCostDelta)).toBe(true);
      },
    ), { numRuns: 500, seed: 531_951 });
  });

  it("is homogeneous in every monetary input without changing the decision", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
      const scale = Decimal(String(factor));
      const base = evaluate();
      const scaled = evaluate({
        inHouseMaterialCostPerUnit: Decimal("30").times(scale).toString(),
        inHouseLaborCostPerUnit: Decimal("85").times(scale).toString(),
        inHouseOverheadCostPerUnit: Decimal("75").times(scale).toString(),
        inHouseAnnualSetupCost: Decimal("500").times(scale).toString(),
        outsourcePricePerUnit: Decimal("95").times(scale).toString(),
        outsourceLogisticsCostPerUnit: Decimal("8").times(scale).toString(),
      });
      expect(close(scaled.annualCostDelta, base.annualCostDelta.times(scale))).toBe(true);
      expect(close(scaled.deltaLowerBound, base.deltaLowerBound.times(scale))).toBe(true);
      expect(scaled.decisionState).toBe(base.decisionState);
    }), { numRuns: 500, seed: 531_952 });
  });

  it("dilutes a positive annual setup cost monotonically while preserving its annual amount", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 1_000_000 }), fc.integer({ min: 1, max: 1_000_000 }), (volume, increment) => {
      const low = evaluate({ annualVolume: String(volume), inHouseAnnualSetupCost: "10000" });
      const high = evaluate({ annualVolume: String(volume + increment), inHouseAnnualSetupCost: "10000" });
      expect(high.setupCostPerUnit.lt(low.setupCostPerUnit)).toBe(true);
      expect(low.inHouseAnnualCost.minus(low.inHouseVariableCostPerUnit.times(String(volume))).eq("10000")).toBe(true);
      expect(high.inHouseAnnualCost.minus(high.inHouseVariableCostPerUnit.times(String(volume + increment))).eq("10000")).toBe(true);
    }), { numRuns: 500, seed: 531_953 });
  });

  it("increases outsource exposure with quality risk and narrows bounds with confidence", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 999 }), (basisPoints) => {
      const ratio = Decimal(String(basisPoints)).div("1000");
      const riskLow = evaluate({ outsourceQualityRiskRatio: ratio.toString() });
      const riskHigh = evaluate({ outsourceQualityRiskRatio: ratio.plus("0.001").toString() });
      expect(riskHigh.outsourceAnnualCost.gt(riskLow.outsourceAnnualCost)).toBe(true);
      expect(riskHigh.annualCostDelta.gt(riskLow.annualCostDelta)).toBe(true);
      const confidenceLow = evaluate({ sourceConfidenceRatio: ratio.toString() });
      const confidenceHigh = evaluate({ sourceConfidenceRatio: ratio.plus("0.001").toString() });
      expect(confidenceHigh.deltaUncertaintyAmount.lte(confidenceLow.deltaUncertaintyAmount)).toBe(true);
      expect(confidenceLow.deltaLowerBound.lte(confidenceLow.annualCostDelta)).toBe(true);
      expect(confidenceLow.deltaUpperBound.gte(confidenceLow.annualCostDelta)).toBe(true);
    }), { numRuns: 500, seed: 531_954 });
  });

  it("fails closed for zero or fractional volume, invalid ratios, negatives, NaN, and infinity", () => {
    const base = { inHouseMaterialCostPerUnit: "30", inHouseLaborCostPerUnit: "85",
      inHouseOverheadCostPerUnit: "75", inHouseAnnualSetupCost: "500",
      outsourcePricePerUnit: "95", outsourceLogisticsCostPerUnit: "8",
      annualVolume: "5000", outsourceQualityRiskRatio: "0.05", sourceConfidenceRatio: "0.9" };
    expect(evaluateMakeBuy({ ...base, annualVolume: "0" }).ok).toBe(false);
    expect(evaluateMakeBuy({ ...base, annualVolume: "1.5" }).ok).toBe(false);
    expect(evaluateMakeBuy({ ...base, outsourceQualityRiskRatio: "1.1" }).ok).toBe(false);
    expect(evaluateMakeBuy({ ...base, inHouseAnnualSetupCost: "-1" }).ok).toBe(false);
    expect(evaluateMakeBuy({ ...base, outsourcePricePerUnit: Number.NaN }).ok).toBe(false);
    expect(evaluateMakeBuy({ ...base, inHouseLaborCostPerUnit: Number.POSITIVE_INFINITY }).ok).toBe(false);
  });

  it("binds the reduced form, annual-count units, semantic outputs, and exact audit values", () => {
    const schema = resolveApprovedToolSchema("outsource-vs-in-house-analyzer");
    if (!schema.ok) throw new Error(`${schema.reason}:${schema.errors.join("|")}`);
    expect(schema.schema.metadata.formula_version).toBe(MAKE_BUY_FORMULA_VERSION);
    expect(schema.schema.metadata.schema_version).toBe(MAKE_BUY_SCHEMA_VERSION);
    expect(schema.schema.calculation_basis.model_id).toBe(MAKE_BUY_MODEL_ID);
    expect(schema.schema.inputs.some((input) => input.id === "capacity_utilization")).toBe(false);
    expect(schema.schema.inputs.find((input) => input.id === "annual_volume")).toMatchObject({ type: "integer", base_unit: "count/year" });
    expect(schema.schema.inputs.find((input) => input.id === "quality_risk_premium")).toMatchObject({ base_unit: "ratio" });
    const formula = calculate(sampleInputs);
    expect(formula.status).not.toBe("BLOCKED");
    expect(Object.keys(formula.outputs).sort()).toEqual(schema.schema.outputs.map((item) => item.id).sort());
    for (const [id, exactValue] of Object.entries(formula.decimalOutputs ?? {})) {
      expect(Number(exactValue)).toBe(formula.outputs[id]);
    }
  });
});
