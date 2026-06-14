import { describe, expect, test } from "vitest";
import { CONCRETE_VOLUME_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/concrete-volume-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateConcreteVolumeCalculator,
  type ConcreteVolumeCalculatorInputs,
} from "@/lib/premium-schema/calculators/concrete-volume-calculator";
import { validateConcreteVolumeCalculatorInputs } from "@/lib/premium-schema/calculators/concrete-volume-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "concrete-volume-calculator";
const SCHEMA_ID = "concrete-volume-calculator";

const defaultInputs: ConcreteVolumeCalculatorInputs = {
    "length": 10,
    "width": 5,
    "height": 0.2,
    "wasteRate": 5,
    "compactionFactor": 1,
    "unitCost": 100
  };
const lowBandInputs: ConcreteVolumeCalculatorInputs = {
    "length": 0.1,
    "width": 5,
    "height": 0.2,
    "wasteRate": 5,
    "compactionFactor": 1,
    "unitCost": 100
  };
const criticalBandInputs: ConcreteVolumeCalculatorInputs = {
    "length": 6,
    "width": 5,
    "height": 0.2,
    "wasteRate": 5,
    "compactionFactor": 1,
    "unitCost": 100
  };

function expectValidationFailure(partial: Partial<ConcreteVolumeCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as ConcreteVolumeCalculatorInputs;
  const validation = validateConcreteVolumeCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateConcreteVolumeCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: ConcreteVolumeCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("concrete-volume-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateConcreteVolumeCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateConcreteVolumeCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateConcreteVolumeCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateConcreteVolumeCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateConcreteVolumeCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, length: undefined } as unknown as ConcreteVolumeCalculatorInputs;
    const validation = validateConcreteVolumeCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateConcreteVolumeCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ length: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateConcreteVolumeCalculatorInputs({ ...defaultInputs, length: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateConcreteVolumeCalculator({ ...defaultInputs, length: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ unitCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ unitCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = CONCRETE_VOLUME_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
    expect(contract).toBeDefined();
    if (!contract) return;
    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs.length).toBeGreaterThan(0);
    expect(contract.assumptions.join(" ")).toContain("deterministic");
  });

  test("engine parity test", () => {
    const schema = getPremiumCalculatorSchema(SCHEMA_ID);
    expect(schema).not.toBeNull();
    if (!schema) return;
    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateConcreteVolumeCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
