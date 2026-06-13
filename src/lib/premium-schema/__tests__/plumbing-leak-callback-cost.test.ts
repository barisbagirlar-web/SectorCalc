import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculatePlumbingLeakCallbackCost,
  type PlumbingLeakCallbackCostInputs,
} from "@/lib/premium-schema/calculators/plumbing-leak-callback-cost";
import { validatePlumbingLeakCallbackCostInputs } from "@/lib/premium-schema/calculators/plumbing-leak-callback-cost-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "plumbing-leak-callback-cost";
const PAID_ROUTE_SLUG = "plumbing-job-margin-verdict";

const defaultInputs: PlumbingLeakCallbackCostInputs = {
    "jobRevenue": 12500,
    "callbackVisits": 3,
    "visitCost": 220,
    "materialRunCost": 850,
    "warrantyReservePercent": 4
  };
const lowBandInputs: PlumbingLeakCallbackCostInputs = {
    "jobRevenue": 125,
    "callbackVisits": 3,
    "visitCost": 220,
    "materialRunCost": 850,
    "warrantyReservePercent": 4
  };
const criticalBandInputs: PlumbingLeakCallbackCostInputs = {
    "jobRevenue": 12500000,
    "callbackVisits": 3,
    "visitCost": 220,
    "materialRunCost": 850,
    "warrantyReservePercent": 4
  };

function expectValidationFailure(partial: Partial<PlumbingLeakCallbackCostInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as PlumbingLeakCallbackCostInputs;
  const validation = validatePlumbingLeakCallbackCostInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculatePlumbingLeakCallbackCost(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: PlumbingLeakCallbackCostInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("plumbing-leak-callback-cost", () => {
  test("exact default oracle", () => {
    const result = calculatePlumbingLeakCallbackCost(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.callbackCost).toBeCloseTo(engineNumeric(SLUG, "callbackCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculatePlumbingLeakCallbackCost(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const lowResult = calculatePlumbingLeakCallbackCost(lowBandInputs);
    const defaultResult = calculatePlumbingLeakCallbackCost(defaultInputs);
    const rank = { low: 0, warning: 1, critical: 2 } as const;
    expect(rank[lowResult.summaryLevel]).toBeLessThanOrEqual(rank[defaultResult.summaryLevel]);
  });

  test("warning threshold band", () => {
    const result = calculatePlumbingLeakCallbackCost(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculatePlumbingLeakCallbackCost(criticalBandInputs);
    expect(["warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, jobRevenue: undefined } as unknown as PlumbingLeakCallbackCostInputs;
    const validation = validatePlumbingLeakCallbackCostInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculatePlumbingLeakCallbackCost(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ jobRevenue: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validatePlumbingLeakCallbackCostInputs({ ...defaultInputs, jobRevenue: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculatePlumbingLeakCallbackCost({ ...defaultInputs, jobRevenue: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ warrantyReservePercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ warrantyReservePercent: Number.POSITIVE_INFINITY });
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
    const calculatorResult = calculatePlumbingLeakCallbackCost(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "callbackCost")?.raw).toBeCloseTo(calculatorResult.callbackCost, 2);
  });
});
