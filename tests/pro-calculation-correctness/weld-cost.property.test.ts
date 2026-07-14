import Big from "big.js";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import {
  WELD_COST_FORMULA_VERSION,
  WELD_COST_MODEL_ID,
  WELD_COST_SCHEMA_VERSION,
  evaluateWeldCost,
} from "@/sectorcalc/formulas/pro-v531/weld-cost-core";
import {
  calculate,
  sampleInputs,
} from "@/sectorcalc/formulas/pro-v531/weld-procedure-cost-consumable-estimation-suite.formula";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";

const Decimal = Big();
Decimal.DP = 50;
Decimal.RM = 2;
Decimal.STRICT = true;

function close(left: Big, right: Big): boolean {
  return left.minus(right).abs().div(left.abs().plus(right.abs()).plus("1")).lte("1e-44");
}

function evaluate(overrides: Record<string, string> = {}) {
  const result = evaluateWeldCost({
    weldLengthM: "50",
    effectiveThroatMm: "8",
    densityGPerCm3: "7.85",
    wireCostPerKg: "15",
    gasCostPerMinute: "0.15",
    arcTimeMinutes: "90",
    elapsedWeldTimeMinutes: "120",
    laborRatePerHour: "55",
    overheadRatePerHour: "35",
    depositionEfficiencyRatio: "0.85",
    sourceConfidenceRatio: "0.9",
    ...overrides,
  });
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

describe("weld procedure cost Decimal properties", () => {
  it("proves geometry, mass, efficiency, time-rate, and cost-balance identities", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1000 }),
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 1000, max: 25000 }),
        (length, throat, densityMilli) => {
          const density = Decimal(String(densityMilli)).div("1000");
          const result = evaluate({
            weldLengthM: String(length),
            effectiveThroatMm: String(throat),
            densityGPerCm3: density.toString(),
          });
          expect(result.crossSectionAreaMm2.eq(Decimal(String(throat)).pow(2))).toBe(true);
          expect(result.depositedWeldMetalMassKg.eq(
            Decimal(String(length)).times(String(throat)).times(String(throat)).times(density).div("1000"),
          )).toBe(true);
          expect(close(result.wireMassKg.times("0.85"), result.depositedWeldMetalMassKg)).toBe(true);
          expect(result.shieldingGasCost.eq(Decimal("0.15").times("90"))).toBe(true);
          expect(result.laborCost.eq(Decimal("55").times("120").div("60"))).toBe(true);
          expect(result.baseProductionCost.eq(result.wireCost.plus(result.shieldingGasCost).plus(result.laborCost))).toBe(true);
          expect(result.totalEstimatedCost.eq(result.baseProductionCost.plus(result.shopOverhead))).toBe(true);
          expect(close(result.costPerMeter.times(String(length)), result.totalEstimatedCost)).toBe(true);
        },
      ),
      { numRuns: 500, seed: 540_001 },
    );
  });

  it("is homogeneous when weld length and operation times scale together", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
        const scale = Decimal(String(factor));
        const base = evaluate();
        const scaled = evaluate({
          weldLengthM: Decimal("50").times(scale).toString(),
          arcTimeMinutes: Decimal("90").times(scale).toString(),
          elapsedWeldTimeMinutes: Decimal("120").times(scale).toString(),
        });
        expect(close(scaled.depositedWeldMetalMassKg, base.depositedWeldMetalMassKg.times(scale))).toBe(true);
        expect(close(scaled.totalEstimatedCost, base.totalEstimatedCost.times(scale))).toBe(true);
        expect(close(scaled.costPerMeter, base.costPerMeter)).toBe(true);
        expect(scaled.arcTimeRatio.eq(base.arcTimeRatio)).toBe(true);
        expect(scaled.primaryCostDriver).toBe(base.primaryCostDriver);
      }),
      { numRuns: 500, seed: 540_002 },
    );
  });

  it("is quadratic in effective throat and monotone as deposition efficiency falls", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 99 }),
        fc.integer({ min: 1, max: 999 }),
        (throat, efficiencyMilli) => {
          const low = evaluate({ effectiveThroatMm: String(throat) });
          const high = evaluate({ effectiveThroatMm: String(throat + 1) });
          expect(high.crossSectionAreaMm2.gt(low.crossSectionAreaMm2)).toBe(true);
          expect(high.depositedWeldMetalMassKg.gt(low.depositedWeldMetalMassKg)).toBe(true);
          const efficiency = Decimal(String(efficiencyMilli)).div("1000");
          const lessEfficient = evaluate({ depositionEfficiencyRatio: efficiency.toString() });
          const moreEfficient = evaluate({ depositionEfficiencyRatio: efficiency.plus("0.001").toString() });
          expect(moreEfficient.wireMassKg.lt(lessEfficient.wireMassKg)).toBe(true);
          expect(moreEfficient.wireCost.lt(lessEfficient.wireCost)).toBe(true);
        },
      ),
      { numRuns: 500, seed: 540_003 },
    );
  });

  it("encloses total and per-meter cost and narrows with confidence", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 999 }), (confidenceMilli) => {
        const confidence = Decimal(String(confidenceMilli)).div("1000");
        const low = evaluate({ sourceConfidenceRatio: confidence.toString() });
        const high = evaluate({ sourceConfidenceRatio: confidence.plus("0.001").toString() });
        expect(low.totalCostLowerBound.lte(low.totalEstimatedCost)).toBe(true);
        expect(low.totalCostUpperBound.gte(low.totalEstimatedCost)).toBe(true);
        expect(low.costPerMeterLowerBound.lte(low.costPerMeter)).toBe(true);
        expect(low.costPerMeterUpperBound.gte(low.costPerMeter)).toBe(true);
        expect(high.costUncertainty.lt(low.costUncertainty)).toBe(true);
        expect(high.totalCostLowerBound.gt(low.totalCostLowerBound)).toBe(true);
        expect(high.totalCostUpperBound.lt(low.totalCostUpperBound)).toBe(true);
      }),
      { numRuns: 500, seed: 540_004 },
    );
  });

  it("fails closed for invalid geometry, density, time, ratios, negatives, NaN, and infinity", () => {
    const base = {
      weldLengthM: "50",
      effectiveThroatMm: "8",
      densityGPerCm3: "7.85",
      wireCostPerKg: "15",
      gasCostPerMinute: "0.15",
      arcTimeMinutes: "90",
      elapsedWeldTimeMinutes: "120",
      laborRatePerHour: "55",
      overheadRatePerHour: "35",
      depositionEfficiencyRatio: "0.85",
      sourceConfidenceRatio: "0.9",
    };
    expect(evaluateWeldCost({ ...base, weldLengthM: "0" }).ok).toBe(false);
    expect(evaluateWeldCost({ ...base, effectiveThroatMm: "0" }).ok).toBe(false);
    expect(evaluateWeldCost({ ...base, densityGPerCm3: "-1" }).ok).toBe(false);
    expect(evaluateWeldCost({ ...base, arcTimeMinutes: "121" }).ok).toBe(false);
    expect(evaluateWeldCost({ ...base, depositionEfficiencyRatio: "0" }).ok).toBe(false);
    expect(evaluateWeldCost({ ...base, sourceConfidenceRatio: "1.1" }).ok).toBe(false);
    expect(evaluateWeldCost({ ...base, laborRatePerHour: "-1" }).ok).toBe(false);
    expect(evaluateWeldCost({ ...base, wireCostPerKg: Number.NaN }).ok).toBe(false);
    expect(evaluateWeldCost({ ...base, gasCostPerMinute: Number.POSITIVE_INFINITY }).ok).toBe(false);
  });

  it("binds physical units, geometry policy, exact outputs, and canonical ratios", () => {
    const schema = resolveApprovedToolSchema("weld-procedure-cost-consumable-estimation-suite");
    if (!schema.ok) throw new Error(schema.reason + ":" + schema.errors.join("|"));
    expect(schema.schema.metadata.formula_version).toBe(WELD_COST_FORMULA_VERSION);
    expect(schema.schema.metadata.schema_version).toBe(WELD_COST_SCHEMA_VERSION);
    expect(schema.schema.calculation_basis.model_id).toBe(WELD_COST_MODEL_ID);
    expect(schema.schema.calculation_basis.geometry_policy).toContain("AREA_EQUALS_A_SQUARED");
    expect(schema.schema.inputs.find((input) => input.id === "weld_density")).toMatchObject({ base_unit: "g_per_cm3" });
    expect(schema.schema.inputs.find((input) => input.id === "wire_cost_per_kg")).toMatchObject({ base_unit: "currency_unit_per_kg" });
    expect(schema.schema.inputs.find((input) => input.id === "deposition_efficiency")).toMatchObject({ base_unit: "ratio" });
    const formula = calculate(sampleInputs);
    expect(formula.status).not.toBe("BLOCKED");
    expect(Object.keys(formula.outputs).sort()).toEqual(schema.schema.outputs.map((output) => output.id).sort());
    for (const [id, exact] of Object.entries(formula.decimalOutputs ?? {})) {
      expect(Number(exact)).toBe(formula.outputs[id]);
    }
  });
});
