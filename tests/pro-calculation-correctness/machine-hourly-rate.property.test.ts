import Big from "big.js";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import {
  MACHINE_HOURLY_RATE_FORMULA_VERSION,
  MACHINE_HOURLY_RATE_MODEL_ID,
  MACHINE_HOURLY_RATE_SCHEMA_VERSION,
  evaluateMachineHourlyRate,
} from "@/sectorcalc/formulas/pro-v531/machine-hourly-rate-core";
import {
  calculate,
  sampleInputs,
} from "@/sectorcalc/formulas/pro-v531/machine-hourly-rate-proof-report.formula";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";

const Decimal = Big();
Decimal.DP = 50;
Decimal.RM = 2;
Decimal.STRICT = true;

function withinRelativeEnvelope(left: Big, right: Big, tolerance = "1e-45"): boolean {
  return left.minus(right).abs().div(left.abs().plus(right.abs()).plus("1")).lte(tolerance);
}

function evaluate(overrides: Record<string, string> = {}) {
  const result = evaluateMachineHourlyRate({
    machineRatePerHour: "85",
    cycleSecondsPerUnit: "12",
    setupSecondsPerBatch: "8",
    batchQuantity: "500",
    materialCostPerUnit: "25",
    targetMarginRatio: "0.30",
    annualVolume: "100000",
    laborRatePerHour: "45",
    annualOverhead: "350000",
    sourceConfidenceRatio: "0.90",
    ...overrides,
  });
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

describe("machine hourly rate Decimal properties", () => {
  it("proves time, overhead, unit-cost, margin, and annual-profit identities", () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 3600 }),
      fc.integer({ min: 0, max: 36_000 }),
      fc.integer({ min: 1, max: 10_000 }),
      fc.integer({ min: 1, max: 100_000 }),
      fc.integer({ min: 0, max: 900 }),
      (cycle, setup, batch, volume, marginBasisPoints) => {
        const effective = Decimal(String(cycle)).plus(Decimal(String(setup)).div(String(batch)));
        fc.pre(Decimal(String(volume)).times(effective).div("3600").lte("8760"));
        const result = evaluate({
          cycleSecondsPerUnit: String(cycle),
          setupSecondsPerBatch: String(setup),
          batchQuantity: String(batch),
          annualVolume: String(volume),
          targetMarginRatio: Decimal(String(marginBasisPoints)).div("1000").toString(),
        });
        expect(result.effectiveCycleSeconds.eq(effective)).toBe(true);
        expect(withinRelativeEnvelope(
          result.capacityUnitsPerHour.times(result.effectiveCycleSeconds),
          Decimal("3600"),
        )).toBe(true);
        expect(result.overheadCostPerUnit.eq(Decimal("350000").div(String(volume)))).toBe(true);
        expect(withinRelativeEnvelope(
          result.fullyLoadedCostPerUnit,
          result.materialCostPerUnit
            .plus(result.machineCostPerUnit)
            .plus(result.laborCostPerUnit)
            .plus(result.overheadCostPerUnit),
        )).toBe(true);
        const oneMinusMargin = Decimal("1").minus(Decimal(String(marginBasisPoints)).div("1000"));
        expect(withinRelativeEnvelope(
          result.quotePricePerUnit.times(oneMinusMargin),
          result.fullyLoadedCostPerUnit,
        )).toBe(true);
        expect(result.profitPerUnit.eq(result.quotePricePerUnit.minus(result.fullyLoadedCostPerUnit))).toBe(true);
        expect(result.annualProfit.eq(result.profitPerUnit.times(String(volume)))).toBe(true);
      },
    ), { numRuns: 500, seed: 531_931 });
  });

  it("is homogeneous in monetary inputs while time and decision outputs remain invariant", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
      const scale = Decimal(String(factor));
      const base = evaluate();
      const scaled = evaluate({
        machineRatePerHour: Decimal("85").times(scale).toString(),
        laborRatePerHour: Decimal("45").times(scale).toString(),
        annualOverhead: Decimal("350000").times(scale).toString(),
        materialCostPerUnit: Decimal("25").times(scale).toString(),
      });
      for (const [left, right] of [
        [scaled.fullyLoadedHourlyRate, base.fullyLoadedHourlyRate.times(scale)],
        [scaled.fullyLoadedCostPerUnit, base.fullyLoadedCostPerUnit.times(scale)],
        [scaled.quotePricePerUnit, base.quotePricePerUnit.times(scale)],
        [scaled.annualProfit, base.annualProfit.times(scale)],
        [scaled.rateUpperBound, base.rateUpperBound.times(scale)],
      ] as const) {
        expect(withinRelativeEnvelope(left, right)).toBe(true);
      }
      expect(scaled.effectiveCycleSeconds.eq(base.effectiveCycleSeconds)).toBe(true);
      expect(scaled.annualProductiveHours.eq(base.annualProductiveHours)).toBe(true);
      expect(scaled.decisionState).toBe(base.decisionState);
    }), { numRuns: 500, seed: 531_932 });
  });

  it("amortizes positive setup monotonically as batch quantity increases", () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 36_000 }),
      fc.integer({ min: 1, max: 10_000 }),
      fc.integer({ min: 1, max: 10_000 }),
      (setup, batch, increment) => {
        const small = evaluate({
          setupSecondsPerBatch: String(setup), batchQuantity: String(batch), annualVolume: "100",
        });
        const large = evaluate({
          setupSecondsPerBatch: String(setup), batchQuantity: String(batch + increment), annualVolume: "100",
        });
        expect(large.setupSecondsPerUnit.lt(small.setupSecondsPerUnit)).toBe(true);
        expect(large.effectiveCycleSeconds.lt(small.effectiveCycleSeconds)).toBe(true);
        expect(large.capacityUnitsPerHour.gt(small.capacityUnitsPerHour)).toBe(true);
        expect(large.machineCostPerUnit.lt(small.machineCostPerUnit)).toBe(true);
        expect(large.laborCostPerUnit.lt(small.laborCostPerUnit)).toBe(true);
        expect(large.overheadCostPerUnit.eq(small.overheadCostPerUnit)).toBe(true);
      },
    ), { numRuns: 500, seed: 531_933 });
  });

  it("encloses the rate and narrows monotonically as source confidence rises", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 999 }), (basisPoints) => {
      const confidence = Decimal(String(basisPoints)).div("1000");
      const low = evaluate({ sourceConfidenceRatio: confidence.toString() });
      const high = evaluate({ sourceConfidenceRatio: confidence.plus("0.001").toString() });
      expect(low.rateLowerBound.lte(low.fullyLoadedHourlyRate)).toBe(true);
      expect(low.rateUpperBound.gte(low.fullyLoadedHourlyRate)).toBe(true);
      expect(low.rateLowerBound.gte("0")).toBe(true);
      expect(high.rateUncertaintyAmount.lte(low.rateUncertaintyAmount)).toBe(true);
    }), { numRuns: 500, seed: 531_934 });
  });

  it("fails closed for invalid counts, margin singularity, capacity breach, negatives, NaN, and infinity", () => {
    const base = {
      machineRatePerHour: "85", cycleSecondsPerUnit: "12", setupSecondsPerBatch: "8",
      batchQuantity: "500", materialCostPerUnit: "25", targetMarginRatio: "0.3",
      annualVolume: "100000", laborRatePerHour: "45", annualOverhead: "350000",
      sourceConfidenceRatio: "0.9",
    };
    expect(evaluateMachineHourlyRate({ ...base, batchQuantity: "0" }).ok).toBe(false);
    expect(evaluateMachineHourlyRate({ ...base, batchQuantity: "1.5" }).ok).toBe(false);
    expect(evaluateMachineHourlyRate({ ...base, annualVolume: "1.5" }).ok).toBe(false);
    expect(evaluateMachineHourlyRate({ ...base, cycleSecondsPerUnit: "0" }).ok).toBe(false);
    expect(evaluateMachineHourlyRate({ ...base, targetMarginRatio: "1" }).ok).toBe(false);
    expect(evaluateMachineHourlyRate({ ...base, cycleSecondsPerUnit: "3600", annualVolume: "8761" }).ok).toBe(false);
    expect(evaluateMachineHourlyRate({ ...base, annualOverhead: "-1" }).ok).toBe(false);
    expect(evaluateMachineHourlyRate({ ...base, machineRatePerHour: Number.NaN }).ok).toBe(false);
    expect(evaluateMachineHourlyRate({ ...base, laborRatePerHour: Number.POSITIVE_INFINITY }).ok).toBe(false);
  });

  it("binds the reduced form, semantic outputs, exact audit values, and certification versions", () => {
    const schema = resolveApprovedToolSchema("machine-hourly-rate-proof-report");
    if (!schema.ok) throw new Error(`${schema.reason}:${schema.errors.join("|")}`);
    expect(schema.schema.metadata.formula_version).toBe(MACHINE_HOURLY_RATE_FORMULA_VERSION);
    expect(schema.schema.metadata.schema_version).toBe(MACHINE_HOURLY_RATE_SCHEMA_VERSION);
    expect(schema.schema.calculation_basis.model_id).toBe(MACHINE_HOURLY_RATE_MODEL_ID);
    expect(schema.schema.inputs.some((input) => input.id === "defect_or_loss_cost")).toBe(false);
    expect(schema.schema.inputs.some((input) => input.id === "uncertainty_multiplier")).toBe(false);
    expect(schema.schema.inputs.find((input) => input.id === "batch_quantity")).toMatchObject({
      type: "integer", base_unit: "count",
    });
    expect(schema.schema.inputs.find((input) => input.id === "annual_volume")).toMatchObject({
      type: "integer", base_unit: "count/year",
    });
    expect(schema.schema.inputs.find((input) => input.id === "overhead_rate")).toMatchObject({
      base_unit: "currency_unit/year",
    });
    const formula = calculate(sampleInputs);
    expect(formula.status).not.toBe("BLOCKED");
    expect(Object.keys(formula.outputs).sort()).toEqual(schema.schema.outputs.map((item) => item.id).sort());
    for (const [id, exactValue] of Object.entries(formula.decimalOutputs ?? {})) {
      expect(Number(exactValue)).toBe(formula.outputs[id]);
    }
  });
});
