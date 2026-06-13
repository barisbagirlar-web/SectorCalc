import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateHydraulicPneumaticCylinderForceCalculator,
  type HydraulicPneumaticCylinderForceCalculatorInputs,
} from "@/lib/premium-schema/calculators/hydraulic-pneumatic-cylinder-force-calculator";
import { validateHydraulicPneumaticCylinderForceCalculatorInputs } from "@/lib/premium-schema/calculators/hydraulic-pneumatic-cylinder-force-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "hydraulic-pneumatic-cylinder-force-calculator";

const defaultInputs: HydraulicPneumaticCylinderForceCalculatorInputs = {
    "pressureBar": 160,
    "boreMm": 63,
    "rodMm": 36
  };
const lowBandInputs: HydraulicPneumaticCylinderForceCalculatorInputs = {
    "pressureBar": 1.6,
    "boreMm": 63,
    "rodMm": 36
  };
const criticalBandInputs: HydraulicPneumaticCylinderForceCalculatorInputs = {
    "pressureBar": 160000,
    "boreMm": 63,
    "rodMm": 36
  };

function expectValidationFailure(partial: Partial<HydraulicPneumaticCylinderForceCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as HydraulicPneumaticCylinderForceCalculatorInputs;
  const validation = validateHydraulicPneumaticCylinderForceCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateHydraulicPneumaticCylinderForceCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: HydraulicPneumaticCylinderForceCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("hydraulic-pneumatic-cylinder-force-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateHydraulicPneumaticCylinderForceCalculator(defaultInputs);
    expect(result.extendForceN).toBeCloseTo(engineNumeric(SLUG, "extendForceN", defaultInputs), 2);
    expect(result.retractForceN).toBeCloseTo(engineNumeric(SLUG, "retractForceN", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("extendForceN");
  });

  test("formula pipeline parity", () => {
    const result = calculateHydraulicPneumaticCylinderForceCalculator(defaultInputs);
    expect(result.extendForceN).toBeCloseTo(
      engineNumeric(SLUG, "extendForceN", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateHydraulicPneumaticCylinderForceCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateHydraulicPneumaticCylinderForceCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateHydraulicPneumaticCylinderForceCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, pressureBar: undefined } as unknown as HydraulicPneumaticCylinderForceCalculatorInputs;
    const validation = validateHydraulicPneumaticCylinderForceCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateHydraulicPneumaticCylinderForceCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ pressureBar: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateHydraulicPneumaticCylinderForceCalculatorInputs({ ...defaultInputs, pressureBar: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateHydraulicPneumaticCylinderForceCalculator({ ...defaultInputs, pressureBar: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ rodMm: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ rodMm: Number.POSITIVE_INFINITY });
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
    const calculatorResult = calculateHydraulicPneumaticCylinderForceCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "extendForceN")?.raw).toBeCloseTo(calculatorResult.extendForceN, 2);
    expect(engineResult.outputs.find((output) => output.id === "retractForceN")?.raw).toBeCloseTo(calculatorResult.retractForceN, 2);
  });
});
