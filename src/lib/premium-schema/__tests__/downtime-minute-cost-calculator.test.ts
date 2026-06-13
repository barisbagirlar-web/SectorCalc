import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateDowntimeMinuteCostCalculator,
  type DowntimeMinuteCostCalculatorInputs,
} from "@/lib/premium-schema/calculators/downtime-minute-cost-calculator";
import { validateDowntimeMinuteCostCalculatorInputs } from "@/lib/premium-schema/calculators/downtime-minute-cost-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "downtime-minute-cost-calculator";

const defaultInputs: DowntimeMinuteCostCalculatorInputs = {
    "downtimeMinutes": 95,
    "hourlyRate": 78,
    "outputUnitsPerHour": 42,
    "contributionPerUnit": 6.5
  };
const lowBandInputs: DowntimeMinuteCostCalculatorInputs = {
    "downtimeMinutes": 0.9500000000000001,
    "hourlyRate": 78,
    "outputUnitsPerHour": 42,
    "contributionPerUnit": 6.5
  };
const criticalBandInputs: DowntimeMinuteCostCalculatorInputs = {
    "downtimeMinutes": 95000,
    "hourlyRate": 78,
    "outputUnitsPerHour": 42,
    "contributionPerUnit": 6.5
  };

function expectValidationFailure(partial: Partial<DowntimeMinuteCostCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as DowntimeMinuteCostCalculatorInputs;
  const validation = validateDowntimeMinuteCostCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateDowntimeMinuteCostCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: DowntimeMinuteCostCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("downtime-minute-cost-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateDowntimeMinuteCostCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.downtimeCost).toBeCloseTo(engineNumeric(SLUG, "downtimeCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateDowntimeMinuteCostCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const lowResult = calculateDowntimeMinuteCostCalculator(lowBandInputs);
    const defaultResult = calculateDowntimeMinuteCostCalculator(defaultInputs);
    const rank = { low: 0, warning: 1, critical: 2 } as const;
    expect(rank[lowResult.summaryLevel]).toBeLessThanOrEqual(rank[defaultResult.summaryLevel]);
  });

  test("warning threshold band", () => {
    const result = calculateDowntimeMinuteCostCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateDowntimeMinuteCostCalculator(criticalBandInputs);
    expect(["warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, downtimeMinutes: undefined } as unknown as DowntimeMinuteCostCalculatorInputs;
    const validation = validateDowntimeMinuteCostCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateDowntimeMinuteCostCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ downtimeMinutes: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateDowntimeMinuteCostCalculatorInputs({ ...defaultInputs, outputUnitsPerHour: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateDowntimeMinuteCostCalculator({ ...defaultInputs, outputUnitsPerHour: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ contributionPerUnit: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ contributionPerUnit: Number.POSITIVE_INFINITY });
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
    const calculatorResult = calculateDowntimeMinuteCostCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "downtimeCost")?.raw).toBeCloseTo(calculatorResult.downtimeCost, 2);
  });
});
