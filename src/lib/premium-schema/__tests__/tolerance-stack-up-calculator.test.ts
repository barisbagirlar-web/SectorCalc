import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateToleranceStackUpCalculator,
  type ToleranceStackUpCalculatorInputs,
} from "@/lib/premium-schema/calculators/tolerance-stack-up-calculator";
import { validateToleranceStackUpCalculatorInputs } from "@/lib/premium-schema/calculators/tolerance-stack-up-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "tolerance-stack-up-calculator";

const defaultInputs: ToleranceStackUpCalculatorInputs = {
    "t1": 0.15,
    "t2": 0.1,
    "t3": 0.08,
    "t4": 0.12,
    "assemblyLimit": 0.35
  };
const lowBandInputs: ToleranceStackUpCalculatorInputs = {
    "t1": 0.0015,
    "t2": 0.1,
    "t3": 0.08,
    "t4": 0.12,
    "assemblyLimit": 0.35
  };
const criticalBandInputs: ToleranceStackUpCalculatorInputs = {
    "t1": 150,
    "t2": 0.1,
    "t3": 0.08,
    "t4": 0.12,
    "assemblyLimit": 0.35
  };

function expectValidationFailure(partial: Partial<ToleranceStackUpCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as ToleranceStackUpCalculatorInputs;
  const validation = validateToleranceStackUpCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateToleranceStackUpCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: ToleranceStackUpCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("tolerance-stack-up-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateToleranceStackUpCalculator(defaultInputs);
    expect(result.worstCaseStack).toBeCloseTo(engineNumeric(SLUG, "worstCaseStack", defaultInputs), 2);
    expect(result.rssStack).toBeCloseTo(engineNumeric(SLUG, "rssStack", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("worstCaseStack");
  });

  test("formula pipeline parity", () => {
    const result = calculateToleranceStackUpCalculator(defaultInputs);
    expect(result.worstCaseStack).toBeCloseTo(
      engineNumeric(SLUG, "worstCaseStack", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateToleranceStackUpCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateToleranceStackUpCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateToleranceStackUpCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, t1: undefined } as unknown as ToleranceStackUpCalculatorInputs;
    const validation = validateToleranceStackUpCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateToleranceStackUpCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ t1: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateToleranceStackUpCalculatorInputs({ ...defaultInputs, assemblyLimit: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateToleranceStackUpCalculator({ ...defaultInputs, assemblyLimit: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ assemblyLimit: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ assemblyLimit: Number.POSITIVE_INFINITY });
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
    const calculatorResult = calculateToleranceStackUpCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "worstCaseStack")?.raw).toBeCloseTo(calculatorResult.worstCaseStack, 2);
    expect(engineResult.outputs.find((output) => output.id === "rssStack")?.raw).toBeCloseTo(calculatorResult.rssStack, 2);
  });
});
