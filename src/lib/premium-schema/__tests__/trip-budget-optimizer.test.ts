import { describe, expect, test } from "vitest";
import { TRIP_BUDGET_OPTIMIZER_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/trip-budget-optimizer-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateTripBudgetOptimizer,
  type TripBudgetOptimizerInputs,
} from "@/lib/premium-schema/calculators/trip-budget-optimizer";
import { validateTripBudgetOptimizerInputs } from "@/lib/premium-schema/calculators/trip-budget-optimizer-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "trip-budget-optimizer";
const SCHEMA_ID = "logistics-fuel-route-drift";

const defaultInputs: TripBudgetOptimizerInputs = {
    "plannedDistanceKm": 520,
    "actualDistanceKm": 575,
    "fuelCostPerKm": 0.42,
    "idleHours": 5,
    "hourlyCost": 28
  };
const lowBandInputs: TripBudgetOptimizerInputs = {
    "plannedDistanceKm": 520,
    "actualDistanceKm": 575,
    "fuelCostPerKm": 0.42,
    "idleHours": 0.30000000000000004,
    "hourlyCost": 28
  };
const criticalBandInputs: TripBudgetOptimizerInputs = {
    "plannedDistanceKm": 520,
    "actualDistanceKm": 575,
    "fuelCostPerKm": 0.42,
    "idleHours": 16,
    "hourlyCost": 28
  };

function expectValidationFailure(partial: Partial<TripBudgetOptimizerInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as TripBudgetOptimizerInputs;
  const validation = validateTripBudgetOptimizerInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateTripBudgetOptimizer(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: TripBudgetOptimizerInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("trip-budget-optimizer", () => {
  test("exact default oracle", () => {
    const result = calculateTripBudgetOptimizer(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.distanceDriftCost).toBeCloseTo(engineNumeric(SCHEMA_ID, "distanceDriftCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateTripBudgetOptimizer(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateTripBudgetOptimizer(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateTripBudgetOptimizer(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateTripBudgetOptimizer(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, plannedDistanceKm: undefined } as unknown as TripBudgetOptimizerInputs;
    const validation = validateTripBudgetOptimizerInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateTripBudgetOptimizer(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ plannedDistanceKm: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ hourlyCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ hourlyCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = TRIP_BUDGET_OPTIMIZER_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateTripBudgetOptimizer(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "distanceDriftCost")?.raw).toBeCloseTo(calculatorResult.distanceDriftCost, 2);
  });
});
