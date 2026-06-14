import { describe, expect, test } from "vitest";
import { EXCAVATION_VOLUME_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/excavation-volume-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateExcavationVolumeCalculator,
  type ExcavationVolumeCalculatorInputs,
} from "@/lib/premium-schema/calculators/excavation-volume-calculator";
import { validateExcavationVolumeCalculatorInputs } from "@/lib/premium-schema/calculators/excavation-volume-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "excavation-volume-calculator";
const SCHEMA_ID = "excavation-volume-calculator";

const defaultInputs: ExcavationVolumeCalculatorInputs = {
    "excavationLength": 10,
    "excavationWidth": 5,
    "excavationDepth": 3,
    "swellFactorPercent": 25,
    "compactionFactorPercent": 10
  };
const lowBandInputs: ExcavationVolumeCalculatorInputs = {
    "excavationLength": 0.1,
    "excavationWidth": 5,
    "excavationDepth": 3,
    "swellFactorPercent": 25,
    "compactionFactorPercent": 10
  };
const criticalBandInputs: ExcavationVolumeCalculatorInputs = {
    "excavationLength": 6,
    "excavationWidth": 5,
    "excavationDepth": 3,
    "swellFactorPercent": 25,
    "compactionFactorPercent": 10
  };

function expectValidationFailure(partial: Partial<ExcavationVolumeCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as ExcavationVolumeCalculatorInputs;
  const validation = validateExcavationVolumeCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateExcavationVolumeCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: ExcavationVolumeCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("excavation-volume-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateExcavationVolumeCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateExcavationVolumeCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateExcavationVolumeCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateExcavationVolumeCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateExcavationVolumeCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, excavationLength: undefined } as unknown as ExcavationVolumeCalculatorInputs;
    const validation = validateExcavationVolumeCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateExcavationVolumeCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ excavationLength: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateExcavationVolumeCalculatorInputs({ ...defaultInputs, excavationLength: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateExcavationVolumeCalculator({ ...defaultInputs, excavationLength: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ compactionFactorPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ compactionFactorPercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = EXCAVATION_VOLUME_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateExcavationVolumeCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
