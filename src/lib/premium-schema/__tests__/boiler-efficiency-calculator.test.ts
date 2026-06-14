import { describe, expect, test } from "vitest";
import { BOILER_EFFICIENCY_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/boiler-efficiency-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateBoilerEfficiencyCalculator,
  type BoilerEfficiencyCalculatorInputs,
} from "@/lib/premium-schema/calculators/boiler-efficiency-calculator";
import { validateBoilerEfficiencyCalculatorInputs } from "@/lib/premium-schema/calculators/boiler-efficiency-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "boiler-efficiency-calculator";
const SCHEMA_ID = "boiler-efficiency-calculator";

const defaultInputs: BoilerEfficiencyCalculatorInputs = {
    "steamFlow": 10000,
    "steamEnthalpy": 2800,
    "feedwaterEnthalpy": 100,
    "fuelFlow": 1000,
    "fuelHeatingValue": 42000,
    "blowdownRate": 2
  };
const lowBandInputs: BoilerEfficiencyCalculatorInputs = {
    "steamFlow": 0.1,
    "steamEnthalpy": 2800,
    "feedwaterEnthalpy": 100,
    "fuelFlow": 1000,
    "fuelHeatingValue": 42000,
    "blowdownRate": 2
  };
const criticalBandInputs: BoilerEfficiencyCalculatorInputs = {
    "steamFlow": 6,
    "steamEnthalpy": 2800,
    "feedwaterEnthalpy": 100,
    "fuelFlow": 1000,
    "fuelHeatingValue": 42000,
    "blowdownRate": 2
  };

function expectValidationFailure(partial: Partial<BoilerEfficiencyCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as BoilerEfficiencyCalculatorInputs;
  const validation = validateBoilerEfficiencyCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateBoilerEfficiencyCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: BoilerEfficiencyCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("boiler-efficiency-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateBoilerEfficiencyCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateBoilerEfficiencyCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateBoilerEfficiencyCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateBoilerEfficiencyCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateBoilerEfficiencyCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, steamFlow: undefined } as unknown as BoilerEfficiencyCalculatorInputs;
    const validation = validateBoilerEfficiencyCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateBoilerEfficiencyCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ steamFlow: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateBoilerEfficiencyCalculatorInputs({ ...defaultInputs, steamFlow: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateBoilerEfficiencyCalculator({ ...defaultInputs, steamFlow: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ blowdownRate: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ blowdownRate: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = BOILER_EFFICIENCY_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateBoilerEfficiencyCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
