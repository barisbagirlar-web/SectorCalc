import { describe, expect, test } from "vitest";
import { SIGNAGE_BID_SAFE_PRICE_TOOL_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/signage-bid-safe-price-tool-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateSignageBidSafePriceTool,
  type SignageBidSafePriceToolInputs,
} from "@/lib/premium-schema/calculators/signage-bid-safe-price-tool";
import { validateSignageBidSafePriceToolInputs } from "@/lib/premium-schema/calculators/signage-bid-safe-price-tool-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "signage-bid-safe-price-tool";

const defaultInputs: SignageBidSafePriceToolInputs = {
    "jobRevenue": 8500,
    "materialCost": 2600,
    "reprintRatePercent": 7,
    "designRevisionHours": 9,
    "laborRate": 35,
    "installReworkCost": 750
  };
const lowBandInputs: SignageBidSafePriceToolInputs = {
    "jobRevenue": 85,
    "materialCost": 2600,
    "reprintRatePercent": 7,
    "designRevisionHours": 9,
    "laborRate": 35,
    "installReworkCost": 750
  };
const criticalBandInputs: SignageBidSafePriceToolInputs = {
    "jobRevenue": 8500000,
    "materialCost": 2600,
    "reprintRatePercent": 7,
    "designRevisionHours": 9,
    "laborRate": 35,
    "installReworkCost": 750
  };

function expectValidationFailure(partial: Partial<SignageBidSafePriceToolInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as SignageBidSafePriceToolInputs;
  const validation = validateSignageBidSafePriceToolInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateSignageBidSafePriceTool(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: SignageBidSafePriceToolInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("signage-bid-safe-price-tool", () => {
  test("exact default oracle", () => {
    const result = calculateSignageBidSafePriceTool(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.reprintCost).toBeCloseTo(engineNumeric(SLUG, "reprintCost", defaultInputs), 2);
    expect(result.marginPressure).toBeCloseTo(engineNumeric(SLUG, "marginPressure", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("marginPressure");
  });

  test("formula pipeline parity", () => {
    const result = calculateSignageBidSafePriceTool(defaultInputs);
    expect(result.marginPressure).toBeCloseTo(
      engineNumeric(SLUG, "marginPressure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateSignageBidSafePriceTool(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateSignageBidSafePriceTool(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateSignageBidSafePriceTool(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, jobRevenue: undefined } as unknown as SignageBidSafePriceToolInputs;
    const validation = validateSignageBidSafePriceToolInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateSignageBidSafePriceTool(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ jobRevenue: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateSignageBidSafePriceToolInputs({ ...defaultInputs, jobRevenue: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateSignageBidSafePriceTool({ ...defaultInputs, jobRevenue: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ installReworkCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ installReworkCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = SIGNAGE_BID_SAFE_PRICE_TOOL_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateSignageBidSafePriceTool(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "reprintCost")?.raw).toBeCloseTo(calculatorResult.reprintCost, 2);
    expect(engineResult.outputs.find((output) => output.id === "marginPressure")?.raw).toBeCloseTo(calculatorResult.marginPressure, 2);
  });
});
