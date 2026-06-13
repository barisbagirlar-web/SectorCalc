import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateLogisticsFuelRouteDrift,
  type LogisticsFuelRouteDriftInputs,
} from "@/lib/premium-schema/calculators/logistics-fuel-route-drift";
import { validateLogisticsFuelRouteDriftInputs } from "@/lib/premium-schema/calculators/logistics-fuel-route-drift-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "logistics-fuel-route-drift";

const defaultInputs: LogisticsFuelRouteDriftInputs = {
    "plannedDistanceKm": 520,
    "actualDistanceKm": 575,
    "fuelCostPerKm": 0.42,
    "idleHours": 5,
    "hourlyCost": 28
  };
const lowBandInputs: LogisticsFuelRouteDriftInputs = {
    "plannedDistanceKm": 520,
    "actualDistanceKm": 575,
    "fuelCostPerKm": 0.42,
    "idleHours": 0.30000000000000004,
    "hourlyCost": 28
  };
const criticalBandInputs: LogisticsFuelRouteDriftInputs = {
    "plannedDistanceKm": 520,
    "actualDistanceKm": 575,
    "fuelCostPerKm": 0.42,
    "idleHours": 16,
    "hourlyCost": 28
  };

function expectValidationFailure(partial: Partial<LogisticsFuelRouteDriftInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as LogisticsFuelRouteDriftInputs;
  const validation = validateLogisticsFuelRouteDriftInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateLogisticsFuelRouteDrift(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: LogisticsFuelRouteDriftInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("logistics-fuel-route-drift", () => {
  test("exact default oracle", () => {
    const result = calculateLogisticsFuelRouteDrift(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.distanceDriftCost).toBeCloseTo(engineNumeric(SLUG, "distanceDriftCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateLogisticsFuelRouteDrift(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const lowResult = calculateLogisticsFuelRouteDrift(lowBandInputs);
    const defaultResult = calculateLogisticsFuelRouteDrift(defaultInputs);
    const rank = { low: 0, warning: 1, critical: 2 } as const;
    expect(rank[lowResult.summaryLevel]).toBeLessThanOrEqual(rank[defaultResult.summaryLevel]);
  });

  test("warning threshold band", () => {
    const result = calculateLogisticsFuelRouteDrift(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateLogisticsFuelRouteDrift(criticalBandInputs);
    expect(["warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, plannedDistanceKm: undefined } as unknown as LogisticsFuelRouteDriftInputs;
    const validation = validateLogisticsFuelRouteDriftInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateLogisticsFuelRouteDrift(broken)).toThrow();
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
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) return;
    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs.length).toBeGreaterThan(0);
    expect(contract.assumptions.join(" ")).toContain("deterministic");
  });

  test("engine parity test", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) return;
    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateLogisticsFuelRouteDrift(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "distanceDriftCost")?.raw).toBeCloseTo(calculatorResult.distanceDriftCost, 2);
  });
});
