import Big from "big.js";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import {
  MOTOR_REPLACEMENT_FORMULA_VERSION,
  MOTOR_REPLACEMENT_MODEL_ID,
  MOTOR_REPLACEMENT_SCHEMA_VERSION,
  evaluateMotorReplacement,
} from "@/sectorcalc/formulas/pro-v531/motor-replacement-roi-core";
import { calculate, sampleInputs } from "@/sectorcalc/formulas/pro-v531/motor-compressor-replacement-roi.formula";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";

const Decimal = Big();
Decimal.DP = 50;
Decimal.RM = 2;
Decimal.STRICT = true;

function close(left: Big, right: Big, tolerance = "1e-45"): boolean {
  return left.minus(right).abs().div(left.abs().plus(right.abs()).plus("1")).lte(tolerance);
}

function evaluate(overrides: Record<string, string> = {}) {
  const result = evaluateMotorReplacement({
    shaftPowerKw: "75", annualOperatingHours: "6000", currentEfficiencyRatio: "0.90",
    newEfficiencyRatio: "0.95", energyRatePerKwh: "0.12", replacementCost: "12000",
    installationCost: "4000", annualMaintenanceSaving: "2000", equipmentLifeYears: "10",
    discountRateRatio: "0.08", sourceConfidenceRatio: "0.90", ...overrides,
  });
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

describe("motor replacement ROI Decimal properties", () => {
  it("proves energy, cost, discounted-cash-flow, and break-even identities", () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 1000 }), fc.integer({ min: 1, max: 8760 }),
      fc.integer({ min: 100, max: 1000 }), fc.integer({ min: 100, max: 1000 }),
      fc.integer({ min: 1, max: 30 }),
      (power, hours, currentBp, newBp, life) => {
        const current = Decimal(String(currentBp)).div("1000");
        const replacement = Decimal(String(newBp)).div("1000");
        const result = evaluate({ shaftPowerKw: String(power), annualOperatingHours: String(hours),
          currentEfficiencyRatio: current.toString(), newEfficiencyRatio: replacement.toString(),
          equipmentLifeYears: String(life) });
        expect(close(result.currentEnergyKwh.times(current), Decimal(String(power)).times(String(hours)))).toBe(true);
        expect(close(result.newEnergyKwh.times(replacement), Decimal(String(power)).times(String(hours)))).toBe(true);
        expect(result.annualEnergySavingKwh.eq(result.currentEnergyKwh.minus(result.newEnergyKwh))).toBe(true);
        expect(result.annualNetSaving.eq(result.annualEnergyCostSaving.plus(result.annualMaintenanceSaving))).toBe(true);
        expect(result.netPresentValue.eq(result.discountedSavings.minus(result.totalInvestment))).toBe(true);
        expect(close(result.breakEvenAnnualSaving.times(result.presentValueFactor), result.totalInvestment)).toBe(true);
      },
    ), { numRuns: 500, seed: 531_941 });
  });

  it("is homogeneous in monetary inputs and tariff", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
      const scale = Decimal(String(factor));
      const base = evaluate();
      const scaled = evaluate({
        energyRatePerKwh: Decimal("0.12").times(scale).toString(),
        replacementCost: Decimal("12000").times(scale).toString(),
        installationCost: Decimal("4000").times(scale).toString(),
        annualMaintenanceSaving: Decimal("2000").times(scale).toString(),
      });
      for (const [left, right] of [
        [scaled.annualNetSaving, base.annualNetSaving.times(scale)],
        [scaled.totalInvestment, base.totalInvestment.times(scale)],
        [scaled.netPresentValue, base.netPresentValue.times(scale)],
        [scaled.npvLowerBound, base.npvLowerBound.times(scale)],
      ] as const) expect(close(left, right)).toBe(true);
      expect(scaled.currentEnergyKwh.eq(base.currentEnergyKwh)).toBe(true);
      expect(scaled.presentValueFactor.eq(base.presentValueFactor)).toBe(true);
      expect(scaled.decisionState).toBe(base.decisionState);
    }), { numRuns: 500, seed: 531_942 });
  });

  it("reduces electrical consumption monotonically as replacement efficiency rises", () => {
    fc.assert(fc.property(fc.integer({ min: 100, max: 999 }), (basisPoints) => {
      const lower = Decimal(String(basisPoints)).div("1000");
      const low = evaluate({ newEfficiencyRatio: lower.toString() });
      const high = evaluate({ newEfficiencyRatio: lower.plus("0.001").toString() });
      expect(high.newEnergyKwh.lt(low.newEnergyKwh)).toBe(true);
      expect(high.annualEnergySavingKwh.gt(low.annualEnergySavingKwh)).toBe(true);
      expect(high.annualEnergyCostSaving.gt(low.annualEnergyCostSaving)).toBe(true);
    }), { numRuns: 500, seed: 531_943 });
  });

  it("encloses NPV and narrows monotonically with source confidence", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 999 }), (basisPoints) => {
      const confidence = Decimal(String(basisPoints)).div("1000");
      const low = evaluate({ sourceConfidenceRatio: confidence.toString() });
      const high = evaluate({ sourceConfidenceRatio: confidence.plus("0.001").toString() });
      expect(low.npvLowerBound.lte(low.netPresentValue)).toBe(true);
      expect(low.npvUpperBound.gte(low.netPresentValue)).toBe(true);
      expect(high.npvUncertaintyAmount.lte(low.npvUncertaintyAmount)).toBe(true);
    }), { numRuns: 500, seed: 531_944 });
  });

  it("fails closed for zero efficiencies, invalid life, hours, investment, ratios, NaN, and infinity", () => {
    const base = { shaftPowerKw: "75", annualOperatingHours: "6000", currentEfficiencyRatio: "0.9",
      newEfficiencyRatio: "0.95", energyRatePerKwh: "0.12", replacementCost: "12000",
      installationCost: "4000", annualMaintenanceSaving: "2000", equipmentLifeYears: "10",
      discountRateRatio: "0.08", sourceConfidenceRatio: "0.9" };
    expect(evaluateMotorReplacement({ ...base, currentEfficiencyRatio: "0" }).ok).toBe(false);
    expect(evaluateMotorReplacement({ ...base, newEfficiencyRatio: "0" }).ok).toBe(false);
    expect(evaluateMotorReplacement({ ...base, annualOperatingHours: "8761" }).ok).toBe(false);
    expect(evaluateMotorReplacement({ ...base, equipmentLifeYears: "1.5" }).ok).toBe(false);
    expect(evaluateMotorReplacement({ ...base, replacementCost: "0", installationCost: "0" }).ok).toBe(false);
    expect(evaluateMotorReplacement({ ...base, discountRateRatio: "1.1" }).ok).toBe(false);
    expect(evaluateMotorReplacement({ ...base, shaftPowerKw: Number.NaN }).ok).toBe(false);
    expect(evaluateMotorReplacement({ ...base, energyRatePerKwh: Number.POSITIVE_INFINITY }).ok).toBe(false);
  });

  it("binds ratio efficiencies, kW power, semantic outputs, and exact audit values", () => {
    const schema = resolveApprovedToolSchema("motor-compressor-replacement-roi");
    if (!schema.ok) throw new Error(`${schema.reason}:${schema.errors.join("|")}`);
    expect(schema.schema.metadata.formula_version).toBe(MOTOR_REPLACEMENT_FORMULA_VERSION);
    expect(schema.schema.metadata.schema_version).toBe(MOTOR_REPLACEMENT_SCHEMA_VERSION);
    expect(schema.schema.calculation_basis.model_id).toBe(MOTOR_REPLACEMENT_MODEL_ID);
    expect(schema.schema.inputs.find((input) => input.id === "motor_power_kw")).toMatchObject({ base_unit: "kW" });
    expect(schema.schema.inputs.find((input) => input.id === "current_efficiency_pct")?.physical_hard_bounds).toMatchObject({ min: 0.000001, max: 1, unit: "ratio" });
    expect(schema.schema.inputs.find((input) => input.id === "equipment_life_years")).toMatchObject({ type: "integer" });
    const formula = calculate(sampleInputs);
    expect(formula.status).not.toBe("BLOCKED");
    expect(Object.keys(formula.outputs).sort()).toEqual(schema.schema.outputs.map((item) => item.id).sort());
    for (const [id, exactValue] of Object.entries(formula.decimalOutputs ?? {})) {
      expect(Number(exactValue)).toBe(formula.outputs[id]);
    }
  });
});
