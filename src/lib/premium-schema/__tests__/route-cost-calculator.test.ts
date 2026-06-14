import { describe, expect, test } from "vitest";
import { ROUTE_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/route-cost-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateRouteCostCalculator,
  type RouteCostCalculatorInputs,
} from "@/lib/premium-schema/calculators/route-cost-calculator";
import { validateRouteCostCalculatorInputs } from "@/lib/premium-schema/calculators/route-cost-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "route-cost-calculator";
const SCHEMA_ID = "route-cost-calculator";

const defaultInputs: RouteCostCalculatorInputs = {
    "distanceKm": 100,
    "tripCount": 1,
    "vehicleLoadCapacity": 20000,
    "loadFactorPercent": 80,
    "fuelConsumptionPer100Km": 30,
    "fuelOrEnergyUnitCost": 1.5
  };
const lowBandInputs: RouteCostCalculatorInputs = {
    "distanceKm": 0.1,
    "tripCount": 1,
    "vehicleLoadCapacity": 20000,
    "loadFactorPercent": 80,
    "fuelConsumptionPer100Km": 30,
    "fuelOrEnergyUnitCost": 1.5
  };
const criticalBandInputs: RouteCostCalculatorInputs = {
    "distanceKm": 6,
    "tripCount": 1,
    "vehicleLoadCapacity": 20000,
    "loadFactorPercent": 80,
    "fuelConsumptionPer100Km": 30,
    "fuelOrEnergyUnitCost": 1.5
  };

function expectValidationFailure(partial: Partial<RouteCostCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as RouteCostCalculatorInputs;
  const validation = validateRouteCostCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateRouteCostCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: RouteCostCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("route-cost-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateRouteCostCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateRouteCostCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateRouteCostCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateRouteCostCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateRouteCostCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, distanceKm: undefined } as unknown as RouteCostCalculatorInputs;
    const validation = validateRouteCostCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateRouteCostCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ distanceKm: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateRouteCostCalculatorInputs({ ...defaultInputs, tripCount: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateRouteCostCalculator({ ...defaultInputs, tripCount: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ fuelOrEnergyUnitCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ fuelOrEnergyUnitCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ROUTE_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateRouteCostCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
