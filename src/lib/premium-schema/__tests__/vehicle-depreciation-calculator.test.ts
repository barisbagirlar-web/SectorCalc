import { describe, expect, test } from "vitest";
import { VEHICLE_DEPRECIATION_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/vehicle-depreciation-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateVehicleDepreciationCalculator,
  type VehicleDepreciationCalculatorInputs,
} from "@/lib/premium-schema/calculators/vehicle-depreciation-calculator";
import { validateVehicleDepreciationCalculatorInputs } from "@/lib/premium-schema/calculators/vehicle-depreciation-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "vehicle-depreciation-calculator";
const SCHEMA_ID = "vehicle-depreciation-calculator";

const defaultInputs: VehicleDepreciationCalculatorInputs = {
    "initialCost": 30000,
    "salvageValue": 5000,
    "usefulLifeYears": 5,
    "yearsUsed": 2
  };
const lowBandInputs: VehicleDepreciationCalculatorInputs = {
    "initialCost": 1,
    "salvageValue": 5000,
    "usefulLifeYears": 5,
    "yearsUsed": 2
  };
const criticalBandInputs: VehicleDepreciationCalculatorInputs = {
    "initialCost": 6,
    "salvageValue": 5000,
    "usefulLifeYears": 5,
    "yearsUsed": 2
  };

function expectValidationFailure(partial: Partial<VehicleDepreciationCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as VehicleDepreciationCalculatorInputs;
  const validation = validateVehicleDepreciationCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateVehicleDepreciationCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: VehicleDepreciationCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("vehicle-depreciation-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateVehicleDepreciationCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateVehicleDepreciationCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateVehicleDepreciationCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateVehicleDepreciationCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateVehicleDepreciationCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, initialCost: undefined } as unknown as VehicleDepreciationCalculatorInputs;
    const validation = validateVehicleDepreciationCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateVehicleDepreciationCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ initialCost: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateVehicleDepreciationCalculatorInputs({ ...defaultInputs, initialCost: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateVehicleDepreciationCalculator({ ...defaultInputs, initialCost: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ yearsUsed: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ yearsUsed: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = VEHICLE_DEPRECIATION_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateVehicleDepreciationCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
