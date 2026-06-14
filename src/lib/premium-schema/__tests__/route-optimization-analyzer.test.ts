import { describe, expect, test } from "vitest";
import { ROUTE_OPTIMIZATION_ANALYZER_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/route-optimization-analyzer-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateRouteOptimizationAnalyzer,
  type RouteOptimizationAnalyzerInputs,
} from "@/lib/premium-schema/calculators/route-optimization-analyzer";
import { validateRouteOptimizationAnalyzerInputs } from "@/lib/premium-schema/calculators/route-optimization-analyzer-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "route-optimization-analyzer";

const defaultInputs: RouteOptimizationAnalyzerInputs = {
    "distanceKm": 500,
    "costPerKm": 0.35,
    "emptyReturnPercent": 40,
    "driverHours": 8,
    "driverRate": 28,
    "tolls": 40,
    "quotedFreightPrice": 1200
  };
const lowBandInputs: RouteOptimizationAnalyzerInputs = {
    "distanceKm": 5,
    "costPerKm": 0.35,
    "emptyReturnPercent": 40,
    "driverHours": 8,
    "driverRate": 28,
    "tolls": 40,
    "quotedFreightPrice": 1200
  };
const criticalBandInputs: RouteOptimizationAnalyzerInputs = {
    "distanceKm": 500000,
    "costPerKm": 0.35,
    "emptyReturnPercent": 40,
    "driverHours": 8,
    "driverRate": 28,
    "tolls": 40,
    "quotedFreightPrice": 1200
  };

function expectValidationFailure(partial: Partial<RouteOptimizationAnalyzerInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as RouteOptimizationAnalyzerInputs;
  const validation = validateRouteOptimizationAnalyzerInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateRouteOptimizationAnalyzer(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: RouteOptimizationAnalyzerInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("route-optimization-analyzer", () => {
  test("exact default oracle", () => {
    const result = calculateRouteOptimizationAnalyzer(defaultInputs);
    expect(result.deadheadCost).toBeCloseTo(engineNumeric(SLUG, "deadheadCost", defaultInputs), 2);
    expect(result.driverCost).toBeCloseTo(engineNumeric(SLUG, "driverCost", defaultInputs), 2);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateRouteOptimizationAnalyzer(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateRouteOptimizationAnalyzer(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateRouteOptimizationAnalyzer(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateRouteOptimizationAnalyzer(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, distanceKm: undefined } as unknown as RouteOptimizationAnalyzerInputs;
    const validation = validateRouteOptimizationAnalyzerInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateRouteOptimizationAnalyzer(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ distanceKm: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateRouteOptimizationAnalyzerInputs({ ...defaultInputs, distanceKm: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateRouteOptimizationAnalyzer({ ...defaultInputs, distanceKm: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ quotedFreightPrice: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ quotedFreightPrice: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ROUTE_OPTIMIZATION_ANALYZER_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateRouteOptimizationAnalyzer(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "deadheadCost")?.raw).toBeCloseTo(calculatorResult.deadheadCost, 2);
    expect(engineResult.outputs.find((output) => output.id === "driverCost")?.raw).toBeCloseTo(calculatorResult.driverCost, 2);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
  });
});
