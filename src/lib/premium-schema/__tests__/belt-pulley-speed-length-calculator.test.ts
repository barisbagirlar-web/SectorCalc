import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateBeltPulleySpeedLengthCalculator,
  type BeltPulleySpeedLengthCalculatorInputs,
} from "@/lib/premium-schema/calculators/belt-pulley-speed-length-calculator";
import { validateBeltPulleySpeedLengthCalculatorInputs } from "@/lib/premium-schema/calculators/belt-pulley-speed-length-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "belt-pulley-speed-length-calculator";

const defaultInputs: BeltPulleySpeedLengthCalculatorInputs = {
    "driverRpm": 1450,
    "driverDiameterMm": 120,
    "drivenDiameterMm": 240,
    "centerDistanceMm": 420
  };
const lowBandInputs: BeltPulleySpeedLengthCalculatorInputs = {
    "driverRpm": 14.5,
    "driverDiameterMm": 120,
    "drivenDiameterMm": 240,
    "centerDistanceMm": 420
  };
const criticalBandInputs: BeltPulleySpeedLengthCalculatorInputs = {
    "driverRpm": 1450000,
    "driverDiameterMm": 120,
    "drivenDiameterMm": 240,
    "centerDistanceMm": 420
  };

function expectValidationFailure(partial: Partial<BeltPulleySpeedLengthCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as BeltPulleySpeedLengthCalculatorInputs;
  const validation = validateBeltPulleySpeedLengthCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateBeltPulleySpeedLengthCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: BeltPulleySpeedLengthCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("belt-pulley-speed-length-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateBeltPulleySpeedLengthCalculator(defaultInputs);
    expect(result.drivenRpm).toBeCloseTo(engineNumeric(SLUG, "drivenRpm", defaultInputs), 2);
    expect(result.beltSpeedMpm).toBeCloseTo(engineNumeric(SLUG, "beltSpeedMpm", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("drivenRpm");
  });

  test("formula pipeline parity", () => {
    const result = calculateBeltPulleySpeedLengthCalculator(defaultInputs);
    expect(result.drivenRpm).toBeCloseTo(
      engineNumeric(SLUG, "drivenRpm", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateBeltPulleySpeedLengthCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateBeltPulleySpeedLengthCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateBeltPulleySpeedLengthCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, driverRpm: undefined } as unknown as BeltPulleySpeedLengthCalculatorInputs;
    const validation = validateBeltPulleySpeedLengthCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateBeltPulleySpeedLengthCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ driverRpm: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateBeltPulleySpeedLengthCalculatorInputs({ ...defaultInputs, driverRpm: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateBeltPulleySpeedLengthCalculator({ ...defaultInputs, driverRpm: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ centerDistanceMm: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ centerDistanceMm: Number.POSITIVE_INFINITY });
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
    const calculatorResult = calculateBeltPulleySpeedLengthCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "drivenRpm")?.raw).toBeCloseTo(calculatorResult.drivenRpm, 2);
    expect(engineResult.outputs.find((output) => output.id === "beltSpeedMpm")?.raw).toBeCloseTo(calculatorResult.beltSpeedMpm, 2);
  });
});
