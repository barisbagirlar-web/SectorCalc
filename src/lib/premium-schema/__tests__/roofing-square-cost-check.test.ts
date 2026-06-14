import { describe, expect, test } from "vitest";
import { ROOFING_SQUARE_COST_CHECK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/roofing-square-cost-check-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateRoofingSquareCostCheck,
  type RoofingSquareCostCheckInputs,
} from "@/lib/premium-schema/calculators/roofing-square-cost-check";
import { validateRoofingSquareCostCheckInputs } from "@/lib/premium-schema/calculators/roofing-square-cost-check-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "roofing-square-cost-check";
const SCHEMA_ID = "roofing-square-cost-check";

const defaultInputs: RoofingSquareCostCheckInputs = {
    "jobArea": 1000,
    "materialCost": 5000,
    "laborHours": 80,
    "laborHourlyRate": 50,
    "equipmentCost": 1000,
    "travelCost": 200
  };
const lowBandInputs: RoofingSquareCostCheckInputs = {
    "jobArea": 1,
    "materialCost": 5000,
    "laborHours": 80,
    "laborHourlyRate": 50,
    "equipmentCost": 1000,
    "travelCost": 200
  };
const criticalBandInputs: RoofingSquareCostCheckInputs = {
    "jobArea": 6,
    "materialCost": 5000,
    "laborHours": 80,
    "laborHourlyRate": 50,
    "equipmentCost": 1000,
    "travelCost": 200
  };

function expectValidationFailure(partial: Partial<RoofingSquareCostCheckInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as RoofingSquareCostCheckInputs;
  const validation = validateRoofingSquareCostCheckInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateRoofingSquareCostCheck(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: RoofingSquareCostCheckInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("roofing-square-cost-check", () => {
  test("exact default oracle", () => {
    const result = calculateRoofingSquareCostCheck(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateRoofingSquareCostCheck(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateRoofingSquareCostCheck(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateRoofingSquareCostCheck(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateRoofingSquareCostCheck(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, jobArea: undefined } as unknown as RoofingSquareCostCheckInputs;
    const validation = validateRoofingSquareCostCheckInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateRoofingSquareCostCheck(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ jobArea: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateRoofingSquareCostCheckInputs({ ...defaultInputs, jobArea: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateRoofingSquareCostCheck({ ...defaultInputs, jobArea: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ travelCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ travelCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ROOFING_SQUARE_COST_CHECK_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateRoofingSquareCostCheck(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
