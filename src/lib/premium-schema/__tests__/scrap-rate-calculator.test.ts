import { describe, expect, test } from "vitest";
import { SCRAP_RATE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/scrap-rate-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateScrapRateCalculator,
  type ScrapRateCalculatorInputs,
} from "@/lib/premium-schema/calculators/scrap-rate-calculator";
import { validateScrapRateCalculatorInputs } from "@/lib/premium-schema/calculators/scrap-rate-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "scrap-rate-calculator";

const defaultInputs: ScrapRateCalculatorInputs = {
    "materialCost": 9500,
    "scrapRate": 8,
    "targetScrapRate": 3,
    "reworkHours": 14,
    "laborRate": 38,
    "finishingCost": 1200
  };
const lowBandInputs: ScrapRateCalculatorInputs = {
    "materialCost": 9500,
    "scrapRate": 0.5,
    "targetScrapRate": 3,
    "reworkHours": 14,
    "laborRate": 38,
    "finishingCost": 1200
  };
const criticalBandInputs: ScrapRateCalculatorInputs = {
    "materialCost": 9500,
    "scrapRate": 20,
    "targetScrapRate": 3,
    "reworkHours": 14,
    "laborRate": 38,
    "finishingCost": 1200
  };

function expectValidationFailure(partial: Partial<ScrapRateCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as ScrapRateCalculatorInputs;
  const validation = validateScrapRateCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateScrapRateCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: ScrapRateCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("scrap-rate-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateScrapRateCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.excessScrapCost).toBeCloseTo(engineNumeric(SLUG, "excessScrapCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateScrapRateCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateScrapRateCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateScrapRateCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateScrapRateCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, materialCost: undefined } as unknown as ScrapRateCalculatorInputs;
    const validation = validateScrapRateCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateScrapRateCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ materialCost: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ finishingCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ finishingCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = SCRAP_RATE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateScrapRateCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "excessScrapCost")?.raw).toBeCloseTo(calculatorResult.excessScrapCost, 2);
  });
});
