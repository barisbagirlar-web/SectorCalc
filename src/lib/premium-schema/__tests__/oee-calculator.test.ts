import { describe, expect, test } from "vitest";
import { OEE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/oee-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateOeeCalculator,
  type OeeCalculatorInputs,
} from "@/lib/premium-schema/calculators/oee-calculator";
import { validateOeeCalculatorInputs } from "@/lib/premium-schema/calculators/oee-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "oee-calculator";
const SCHEMA_ID = "oee-calculator";

const defaultInputs: OeeCalculatorInputs = {
    "totalShiftTime": 8,
    "plannedDowntime": 0.5,
    "unplannedDowntime": 0.5,
    "waitingTime": 0.2,
    "idealCycleTime": 0.01,
    "totalUnitsProduced": 500
  };
const lowBandInputs: OeeCalculatorInputs = {
    "totalShiftTime": 0.1,
    "plannedDowntime": 0.5,
    "unplannedDowntime": 0.5,
    "waitingTime": 0.2,
    "idealCycleTime": 0.01,
    "totalUnitsProduced": 500
  };
const criticalBandInputs: OeeCalculatorInputs = {
    "totalShiftTime": 6,
    "plannedDowntime": 0.5,
    "unplannedDowntime": 0.5,
    "waitingTime": 0.2,
    "idealCycleTime": 0.01,
    "totalUnitsProduced": 500
  };

function expectValidationFailure(partial: Partial<OeeCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as OeeCalculatorInputs;
  const validation = validateOeeCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateOeeCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: OeeCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("oee-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateOeeCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateOeeCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateOeeCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateOeeCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateOeeCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, totalShiftTime: undefined } as unknown as OeeCalculatorInputs;
    const validation = validateOeeCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateOeeCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ totalShiftTime: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateOeeCalculatorInputs({ ...defaultInputs, totalShiftTime: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateOeeCalculator({ ...defaultInputs, totalShiftTime: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ totalUnitsProduced: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ totalUnitsProduced: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = OEE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateOeeCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
