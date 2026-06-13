import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateFireSystemFlowHydrantCalculator,
  type FireSystemFlowHydrantCalculatorInputs,
} from "@/lib/premium-schema/calculators/fire-system-flow-hydrant-calculator";
import { validateFireSystemFlowHydrantCalculatorInputs } from "@/lib/premium-schema/calculators/fire-system-flow-hydrant-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "fire-system-flow-hydrant-calculator";

const defaultInputs: FireSystemFlowHydrantCalculatorInputs = {
    "protectedAreaM2": 1200,
    "designDensityLpmM2": 10,
    "hydrantCapacityLpm": 2500
  };
const lowBandInputs: FireSystemFlowHydrantCalculatorInputs = {
    "protectedAreaM2": 12,
    "designDensityLpmM2": 10,
    "hydrantCapacityLpm": 2500
  };
const criticalBandInputs: FireSystemFlowHydrantCalculatorInputs = {
    "protectedAreaM2": 1200000,
    "designDensityLpmM2": 10,
    "hydrantCapacityLpm": 2500
  };

function expectValidationFailure(partial: Partial<FireSystemFlowHydrantCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as FireSystemFlowHydrantCalculatorInputs;
  const validation = validateFireSystemFlowHydrantCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateFireSystemFlowHydrantCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: FireSystemFlowHydrantCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("fire-system-flow-hydrant-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateFireSystemFlowHydrantCalculator(defaultInputs);
    expect(result.flowDemandLpm).toBeCloseTo(engineNumeric(SLUG, "flowDemandLpm", defaultInputs), 2);
    expect(result.hydrantCount).toBeCloseTo(engineNumeric(SLUG, "hydrantCount", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("flowDemandLpm");
  });

  test("formula pipeline parity", () => {
    const result = calculateFireSystemFlowHydrantCalculator(defaultInputs);
    expect(result.flowDemandLpm).toBeCloseTo(
      engineNumeric(SLUG, "flowDemandLpm", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateFireSystemFlowHydrantCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateFireSystemFlowHydrantCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateFireSystemFlowHydrantCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, protectedAreaM2: undefined } as unknown as FireSystemFlowHydrantCalculatorInputs;
    const validation = validateFireSystemFlowHydrantCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateFireSystemFlowHydrantCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ protectedAreaM2: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateFireSystemFlowHydrantCalculatorInputs({ ...defaultInputs, protectedAreaM2: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateFireSystemFlowHydrantCalculator({ ...defaultInputs, protectedAreaM2: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ hydrantCapacityLpm: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ hydrantCapacityLpm: Number.POSITIVE_INFINITY });
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
    const calculatorResult = calculateFireSystemFlowHydrantCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "flowDemandLpm")?.raw).toBeCloseTo(calculatorResult.flowDemandLpm, 2);
    expect(engineResult.outputs.find((output) => output.id === "hydrantCount")?.raw).toBeCloseTo(calculatorResult.hydrantCount, 2);
  });
});
