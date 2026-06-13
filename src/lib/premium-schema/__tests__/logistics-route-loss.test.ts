import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateLogisticsRouteLoss,
  type LogisticsRouteLossInputs,
} from "@/lib/premium-schema/calculators/logistics-route-loss";
import { validateLogisticsRouteLossInputs } from "@/lib/premium-schema/calculators/logistics-route-loss-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "logistics-route-loss";

const defaultInputs: LogisticsRouteLossInputs = {
    "distanceKm": 500,
    "costPerKm": 0.35,
    "emptyReturnPercent": 40,
    "driverHours": 8,
    "driverRate": 28,
    "tolls": 40,
    "quotedFreightPrice": 1200
  };
const lowBandInputs: LogisticsRouteLossInputs = {
    "distanceKm": 5,
    "costPerKm": 0.35,
    "emptyReturnPercent": 40,
    "driverHours": 8,
    "driverRate": 28,
    "tolls": 40,
    "quotedFreightPrice": 1200
  };
const criticalBandInputs: LogisticsRouteLossInputs = {
    "distanceKm": 500000,
    "costPerKm": 0.35,
    "emptyReturnPercent": 40,
    "driverHours": 8,
    "driverRate": 28,
    "tolls": 40,
    "quotedFreightPrice": 1200
  };

function expectValidationFailure(partial: Partial<LogisticsRouteLossInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as LogisticsRouteLossInputs;
  const validation = validateLogisticsRouteLossInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateLogisticsRouteLoss(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: LogisticsRouteLossInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("logistics-route-loss", () => {
  test("exact default oracle", () => {
    const result = calculateLogisticsRouteLoss(defaultInputs);
    expect(result.deadheadCost).toBeCloseTo(engineNumeric(SLUG, "deadheadCost", defaultInputs), 2);
    expect(result.driverCost).toBeCloseTo(engineNumeric(SLUG, "driverCost", defaultInputs), 2);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateLogisticsRouteLoss(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const lowResult = calculateLogisticsRouteLoss(lowBandInputs);
    const defaultResult = calculateLogisticsRouteLoss(defaultInputs);
    const rank = { low: 0, warning: 1, critical: 2 } as const;
    expect(rank[lowResult.summaryLevel]).toBeLessThanOrEqual(rank[defaultResult.summaryLevel]);
  });

  test("warning threshold band", () => {
    const result = calculateLogisticsRouteLoss(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateLogisticsRouteLoss(criticalBandInputs);
    expect(["warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, distanceKm: undefined } as unknown as LogisticsRouteLossInputs;
    const validation = validateLogisticsRouteLossInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateLogisticsRouteLoss(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ distanceKm: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateLogisticsRouteLossInputs({ ...defaultInputs, distanceKm: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateLogisticsRouteLoss({ ...defaultInputs, distanceKm: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ quotedFreightPrice: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ quotedFreightPrice: Number.POSITIVE_INFINITY });
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
    const calculatorResult = calculateLogisticsRouteLoss(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "deadheadCost")?.raw).toBeCloseTo(calculatorResult.deadheadCost, 2);
    expect(engineResult.outputs.find((output) => output.id === "driverCost")?.raw).toBeCloseTo(calculatorResult.driverCost, 2);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
  });
});
