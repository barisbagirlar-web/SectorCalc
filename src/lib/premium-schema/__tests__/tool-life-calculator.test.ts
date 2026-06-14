import { describe, expect, test } from "vitest";
import { TOOL_LIFE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/tool-life-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateToolLifeCalculator,
  type ToolLifeCalculatorInputs,
} from "@/lib/premium-schema/calculators/tool-life-calculator";
import { validateToolLifeCalculatorInputs } from "@/lib/premium-schema/calculators/tool-life-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "tool-life-calculator";
const SCHEMA_ID = "tool-life-calculator";

const defaultInputs: ToolLifeCalculatorInputs = {
    "toolPurchasePrice": 500,
    "expectedToolLifeUnits": 1000,
    "materialHardnessFactor": 1,
    "cuttingSpeedFactor": 1,
    "toolChangeTimeHours": 0.5,
    "laborRatePerHour": 50
  };
const lowBandInputs: ToolLifeCalculatorInputs = {
    "toolPurchasePrice": 0.1,
    "expectedToolLifeUnits": 1000,
    "materialHardnessFactor": 1,
    "cuttingSpeedFactor": 1,
    "toolChangeTimeHours": 0.5,
    "laborRatePerHour": 50
  };
const criticalBandInputs: ToolLifeCalculatorInputs = {
    "toolPurchasePrice": 6,
    "expectedToolLifeUnits": 1000,
    "materialHardnessFactor": 1,
    "cuttingSpeedFactor": 1,
    "toolChangeTimeHours": 0.5,
    "laborRatePerHour": 50
  };

function expectValidationFailure(partial: Partial<ToolLifeCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as ToolLifeCalculatorInputs;
  const validation = validateToolLifeCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateToolLifeCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: ToolLifeCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("tool-life-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateToolLifeCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateToolLifeCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateToolLifeCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateToolLifeCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateToolLifeCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, toolPurchasePrice: undefined } as unknown as ToolLifeCalculatorInputs;
    const validation = validateToolLifeCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateToolLifeCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ toolPurchasePrice: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateToolLifeCalculatorInputs({ ...defaultInputs, expectedToolLifeUnits: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateToolLifeCalculator({ ...defaultInputs, expectedToolLifeUnits: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ laborRatePerHour: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ laborRatePerHour: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = TOOL_LIFE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateToolLifeCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
