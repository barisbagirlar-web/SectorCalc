import Big from "big.js";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { SMED_ROI_FORMULA_VERSION, SMED_ROI_MODEL_ID, SMED_ROI_SCHEMA_VERSION, evaluateSmedRoi } from "@/sectorcalc/formulas/pro-v531/smed-roi-core";
import { calculate, sampleInputs } from "@/sectorcalc/formulas/pro-v531/setup-time-reduction-roi-smed.formula";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";

const Decimal = Big();
Decimal.DP = 50;
Decimal.RM = 2;
Decimal.STRICT = true;
function close(a: Big, b: Big): boolean {
  return a.minus(b).abs().div(a.abs().plus(b.abs()).plus("1")).lte("1e-45");
}
function evaluate(overrides: Record<string, string> = {}) {
  const result = evaluateSmedRoi({
    machineRatePerHour: "85", cycleSecondsPerUnit: "12", currentSetupSeconds: "1800",
    batchQuantity: "500", implementationCost: "50000", annualVolume: "100000",
    laborRatePerHour: "45", avoidableOverheadRatePerHour: "25",
    setupReductionRatio: "0.5", sourceConfidenceRatio: "0.9", ...overrides,
  });
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

describe("SMED ROI Decimal properties", () => {
  it("proves time, changeover, capacity, saving, payback, and ROI identities", () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 100_000 }), fc.integer({ min: 1, max: 10_000 }),
      fc.integer({ min: 1, max: 1_000_000 }), fc.integer({ min: 1, max: 1000 }),
      (volume, batch, setup, reductionBp) => {
        const reduction = Decimal(String(reductionBp)).div("1000");
        const result = evaluate({ annualVolume: String(volume), batchQuantity: String(batch),
          currentSetupSeconds: String(setup), setupReductionRatio: reduction.toString() });
        expect(result.annualChangeoverEquivalents.eq(Decimal(String(volume)).div(String(batch)))).toBe(true);
        expect(result.targetSetupSeconds.eq(result.currentSetupSeconds.minus(result.savedSecondsPerChangeover))).toBe(true);
        expect(close(result.annualSavedHours.times("3600"), result.savedSecondsPerChangeover.times(result.annualChangeoverEquivalents))).toBe(true);
        expect(close(result.additionalCapacityUnits.times("12"), result.annualSavedHours.times("3600"))).toBe(true);
        expect(result.annualGrossSaving.eq(result.annualSavedHours.times(result.avoidableHourlyRate))).toBe(true);
        expect(close(result.simplePaybackYears.times(result.annualGrossSaving), result.implementationCost)).toBe(true);
        expect(close(result.annualRoiRatio.times(result.implementationCost), result.annualGrossSaving)).toBe(true);
      },
    ), { numRuns: 500, seed: 531_971 });
  });

  it("is homogeneous in hourly rates and implementation cost", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
      const scale = Decimal(String(factor));
      const base = evaluate();
      const scaled = evaluate({
        machineRatePerHour: Decimal("85").times(scale).toString(),
        laborRatePerHour: Decimal("45").times(scale).toString(),
        avoidableOverheadRatePerHour: Decimal("25").times(scale).toString(),
        implementationCost: Decimal("50000").times(scale).toString(),
      });
      expect(close(scaled.annualGrossSaving, base.annualGrossSaving.times(scale))).toBe(true);
      expect(close(scaled.savingLowerBound, base.savingLowerBound.times(scale))).toBe(true);
      expect(scaled.simplePaybackYears.eq(base.simplePaybackYears)).toBe(true);
      expect(scaled.annualRoiRatio.eq(base.annualRoiRatio)).toBe(true);
      expect(scaled.decisionState).toBe(base.decisionState);
    }), { numRuns: 500, seed: 531_972 });
  });

  it("increases saved time, capacity, and savings monotonically with reduction ratio", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 999 }), (basisPoints) => {
      const ratio = Decimal(String(basisPoints)).div("1000");
      const low = evaluate({ setupReductionRatio: ratio.toString() });
      const high = evaluate({ setupReductionRatio: ratio.plus("0.001").toString() });
      expect(high.savedSecondsPerChangeover.gt(low.savedSecondsPerChangeover)).toBe(true);
      expect(high.annualSavedHours.gt(low.annualSavedHours)).toBe(true);
      expect(high.additionalCapacityUnits.gt(low.additionalCapacityUnits)).toBe(true);
      expect(high.annualGrossSaving.gt(low.annualGrossSaving)).toBe(true);
    }), { numRuns: 500, seed: 531_973 });
  });

  it("encloses annual saving and narrows monotonically with confidence", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 999 }), (basisPoints) => {
      const confidence = Decimal(String(basisPoints)).div("1000");
      const low = evaluate({ sourceConfidenceRatio: confidence.toString() });
      const high = evaluate({ sourceConfidenceRatio: confidence.plus("0.001").toString() });
      expect(low.savingLowerBound.lte(low.annualGrossSaving)).toBe(true);
      expect(low.savingUpperBound.gte(low.annualGrossSaving)).toBe(true);
      expect(low.savingLowerBound.gte("0")).toBe(true);
      expect(high.annualSavingUncertainty.lte(low.annualSavingUncertainty)).toBe(true);
    }), { numRuns: 500, seed: 531_974 });
  });

  it("fails closed for zero reduction, costs, rates, counts, cycle, invalid ratios, NaN, and infinity", () => {
    const base = { machineRatePerHour: "85", cycleSecondsPerUnit: "12", currentSetupSeconds: "1800",
      batchQuantity: "500", implementationCost: "50000", annualVolume: "100000",
      laborRatePerHour: "45", avoidableOverheadRatePerHour: "25",
      setupReductionRatio: "0.5", sourceConfidenceRatio: "0.9" };
    expect(evaluateSmedRoi({ ...base, setupReductionRatio: "0" }).ok).toBe(false);
    expect(evaluateSmedRoi({ ...base, implementationCost: "0" }).ok).toBe(false);
    expect(evaluateSmedRoi({ ...base, machineRatePerHour: "0", laborRatePerHour: "0", avoidableOverheadRatePerHour: "0" }).ok).toBe(false);
    expect(evaluateSmedRoi({ ...base, batchQuantity: "1.5" }).ok).toBe(false);
    expect(evaluateSmedRoi({ ...base, annualVolume: "0" }).ok).toBe(false);
    expect(evaluateSmedRoi({ ...base, cycleSecondsPerUnit: "0" }).ok).toBe(false);
    expect(evaluateSmedRoi({ ...base, setupReductionRatio: "1.1" }).ok).toBe(false);
    expect(evaluateSmedRoi({ ...base, currentSetupSeconds: Number.NaN }).ok).toBe(false);
    expect(evaluateSmedRoi({ ...base, implementationCost: Number.POSITIVE_INFINITY }).ok).toBe(false);
  });

  it("binds the reduced explicit-input form, semantic outputs, and exact audit values", () => {
    const schema = resolveApprovedToolSchema("setup-time-reduction-roi-smed");
    if (!schema.ok) throw new Error(`${schema.reason}:${schema.errors.join("|")}`);
    expect(schema.schema.metadata.formula_version).toBe(SMED_ROI_FORMULA_VERSION);
    expect(schema.schema.metadata.schema_version).toBe(SMED_ROI_SCHEMA_VERSION);
    expect(schema.schema.calculation_basis.model_id).toBe(SMED_ROI_MODEL_ID);
    expect(schema.schema.inputs.some((input) => input.id === "target_margin")).toBe(false);
    expect(schema.schema.inputs.some((input) => input.id === "defect_or_loss_cost")).toBe(false);
    expect(schema.schema.inputs.find((input) => input.id === "uncertainty_multiplier")?.physical_hard_bounds).toMatchObject({ min: 0.000001, max: 1, unit: "ratio" });
    expect(schema.schema.inputs.find((input) => input.id === "annual_volume")).toMatchObject({ type: "integer", base_unit: "count/year" });
    const formula = calculate(sampleInputs);
    expect(formula.status).not.toBe("BLOCKED");
    expect(Object.keys(formula.outputs).sort()).toEqual(schema.schema.outputs.map((item) => item.id).sort());
    for (const [id, exactValue] of Object.entries(formula.decimalOutputs ?? {})) {
      expect(Number(exactValue)).toBe(formula.outputs[id]);
    }
  });
});
