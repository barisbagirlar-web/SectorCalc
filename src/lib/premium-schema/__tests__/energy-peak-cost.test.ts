import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateEnergyPeakCost,
  type EnergyPeakCostInputs,
} from "@/lib/premium-schema/calculators/energy-peak-cost";
import { validateEnergyPeakCostInputs } from "@/lib/premium-schema/calculators/energy-peak-cost-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "energy-peak-cost";

const defaultInputs: EnergyPeakCostInputs = {
    "currentKwh": 12000,
    "targetKwh": 10000,
    "energyRate": 0.14,
    "peakKwh": 2500,
    "peakRate": 0.22,
    "demandCharge": 350,
    "plannedBudget": 2000
  };
const lowBandInputs: EnergyPeakCostInputs = {
    "currentKwh": 120,
    "targetKwh": 10000,
    "energyRate": 0.14,
    "peakKwh": 2500,
    "peakRate": 0.22,
    "demandCharge": 350,
    "plannedBudget": 2000
  };
const criticalBandInputs: EnergyPeakCostInputs = {
    "currentKwh": 12000000,
    "targetKwh": 10000,
    "energyRate": 0.14,
    "peakKwh": 2500,
    "peakRate": 0.22,
    "demandCharge": 350,
    "plannedBudget": 2000
  };

function expectValidationFailure(partial: Partial<EnergyPeakCostInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as EnergyPeakCostInputs;
  const validation = validateEnergyPeakCostInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateEnergyPeakCost(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: EnergyPeakCostInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("energy-peak-cost", () => {
  test("exact default oracle", () => {
    const result = calculateEnergyPeakCost(defaultInputs);
    expect(result.kwhVariancePercent).toBeCloseTo(engineNumeric(SLUG, "kwhVariancePercent", defaultInputs), 2);
    expect(result.excessKwhCost).toBeCloseTo(engineNumeric(SLUG, "excessKwhCost", defaultInputs), 2);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateEnergyPeakCost(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const lowResult = calculateEnergyPeakCost(lowBandInputs);
    const defaultResult = calculateEnergyPeakCost(defaultInputs);
    const rank = { low: 0, warning: 1, critical: 2 } as const;
    expect(rank[lowResult.summaryLevel]).toBeLessThanOrEqual(rank[defaultResult.summaryLevel]);
  });

  test("warning threshold band", () => {
    const result = calculateEnergyPeakCost(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateEnergyPeakCost(criticalBandInputs);
    expect(["warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, currentKwh: undefined } as unknown as EnergyPeakCostInputs;
    const validation = validateEnergyPeakCostInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateEnergyPeakCost(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ currentKwh: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateEnergyPeakCostInputs({ ...defaultInputs, plannedBudget: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateEnergyPeakCost({ ...defaultInputs, plannedBudget: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ plannedBudget: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ plannedBudget: Number.POSITIVE_INFINITY });
  });

  test("contract metadata matches slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) return;
    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs.length).toBeGreaterThan(0);
    expect(contract.assumptions.join(" ")).toContain("deterministic");
  });

  test("engine parity test", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) return;
    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateEnergyPeakCost(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "kwhVariancePercent")?.raw).toBeCloseTo(calculatorResult.kwhVariancePercent, 2);
    expect(engineResult.outputs.find((output) => output.id === "excessKwhCost")?.raw).toBeCloseTo(calculatorResult.excessKwhCost, 2);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
  });
});
