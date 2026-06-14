import { describe, expect, test } from "vitest";
import { REBAR_WEIGHT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/rebar-weight-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateRebarWeightCalculator,
  type RebarWeightCalculatorInputs,
} from "@/lib/premium-schema/calculators/rebar-weight-calculator";
import { validateRebarWeightCalculatorInputs } from "@/lib/premium-schema/calculators/rebar-weight-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "rebar-weight-calculator";
const SCHEMA_ID = "rebar-weight-calculator";

const defaultInputs: RebarWeightCalculatorInputs = {
    "nominalDiameter": 12,
    "totalLength": 12,
    "unitPricePerKg": 0.8
  };
const lowBandInputs: RebarWeightCalculatorInputs = {
    "nominalDiameter": 6,
    "totalLength": 12,
    "unitPricePerKg": 0.8
  };
const criticalBandInputs: RebarWeightCalculatorInputs = {
    "nominalDiameter": 6,
    "totalLength": 12,
    "unitPricePerKg": 0.8
  };

function expectValidationFailure(partial: Partial<RebarWeightCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as RebarWeightCalculatorInputs;
  const validation = validateRebarWeightCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateRebarWeightCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: RebarWeightCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("rebar-weight-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateRebarWeightCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateRebarWeightCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateRebarWeightCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateRebarWeightCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateRebarWeightCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, nominalDiameter: undefined } as unknown as RebarWeightCalculatorInputs;
    const validation = validateRebarWeightCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateRebarWeightCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ nominalDiameter: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateRebarWeightCalculatorInputs({ ...defaultInputs, nominalDiameter: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateRebarWeightCalculator({ ...defaultInputs, nominalDiameter: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ unitPricePerKg: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ unitPricePerKg: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = REBAR_WEIGHT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateRebarWeightCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
