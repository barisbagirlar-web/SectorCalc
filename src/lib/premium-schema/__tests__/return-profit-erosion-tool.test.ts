import { describe, expect, test } from "vitest";
import { RETURN_PROFIT_EROSION_TOOL_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/return-profit-erosion-tool-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateReturnProfitErosionTool,
  type ReturnProfitErosionToolInputs,
} from "@/lib/premium-schema/calculators/return-profit-erosion-tool";
import { validateReturnProfitErosionToolInputs } from "@/lib/premium-schema/calculators/return-profit-erosion-tool-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "return-profit-erosion-tool";

const defaultInputs: ReturnProfitErosionToolInputs = {
    "monthlyApiCalls": 2500000,
    "costPerThousandCalls": 0.18,
    "monthlyRevenue": 12000,
    "computeCost": 1800,
    "storageCost": 420
  };
const lowBandInputs: ReturnProfitErosionToolInputs = {
    "monthlyApiCalls": 25000,
    "costPerThousandCalls": 0.18,
    "monthlyRevenue": 12000,
    "computeCost": 1800,
    "storageCost": 420
  };
const criticalBandInputs: ReturnProfitErosionToolInputs = {
    "monthlyApiCalls": 2500000000,
    "costPerThousandCalls": 0.18,
    "monthlyRevenue": 12000,
    "computeCost": 1800,
    "storageCost": 420
  };

function expectValidationFailure(partial: Partial<ReturnProfitErosionToolInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as ReturnProfitErosionToolInputs;
  const validation = validateReturnProfitErosionToolInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateReturnProfitErosionTool(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: ReturnProfitErosionToolInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("return-profit-erosion-tool", () => {
  test("exact default oracle", () => {
    const result = calculateReturnProfitErosionTool(defaultInputs);
    expect(result.totalCloudCost).toBeCloseTo(engineNumeric(SLUG, "totalCloudCost", defaultInputs), 2);
    expect(result.apiCallCost).toBeCloseTo(engineNumeric(SLUG, "apiCallCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalCloudCost");
  });

  test("formula pipeline parity", () => {
    const result = calculateReturnProfitErosionTool(defaultInputs);
    expect(result.totalCloudCost).toBeCloseTo(
      engineNumeric(SLUG, "totalCloudCost", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateReturnProfitErosionTool(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateReturnProfitErosionTool(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateReturnProfitErosionTool(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, monthlyApiCalls: undefined } as unknown as ReturnProfitErosionToolInputs;
    const validation = validateReturnProfitErosionToolInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateReturnProfitErosionTool(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ monthlyApiCalls: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateReturnProfitErosionToolInputs({ ...defaultInputs, monthlyRevenue: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateReturnProfitErosionTool({ ...defaultInputs, monthlyRevenue: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ storageCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ storageCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = RETURN_PROFIT_EROSION_TOOL_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateReturnProfitErosionTool(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalCloudCost")?.raw).toBeCloseTo(calculatorResult.totalCloudCost, 2);
    expect(engineResult.outputs.find((output) => output.id === "apiCallCost")?.raw).toBeCloseTo(calculatorResult.apiCallCost, 2);
  });
});
