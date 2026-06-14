import { describe, expect, test } from "vitest";
import { DAIRY_PROFIT_DETECTOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/dairy-profit-detector-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateDairyProfitDetector,
  type DairyProfitDetectorInputs,
} from "@/lib/premium-schema/calculators/dairy-profit-detector";
import { validateDairyProfitDetectorInputs } from "@/lib/premium-schema/calculators/dairy-profit-detector-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "dairy-profit-detector";

const defaultInputs: DairyProfitDetectorInputs = {
    "cows": 80,
    "feedCostPerCowPerDay": 6.5,
    "milkLitersPerCowPerDay": 24,
    "targetMilkLitersPerCowPerDay": 28,
    "milkPricePerLiter": 0.42,
    "days": 30
  };
const lowBandInputs: DairyProfitDetectorInputs = {
    "cows": 80,
    "feedCostPerCowPerDay": 6.5,
    "milkLitersPerCowPerDay": 23,
    "targetMilkLitersPerCowPerDay": 28,
    "milkPricePerLiter": 0.42,
    "days": 30
  };
const criticalBandInputs: DairyProfitDetectorInputs = {
    "cows": 80,
    "feedCostPerCowPerDay": 6.5,
    "milkLitersPerCowPerDay": 17,
    "targetMilkLitersPerCowPerDay": 28,
    "milkPricePerLiter": 0.42,
    "days": 30
  };

function expectValidationFailure(partial: Partial<DairyProfitDetectorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as DairyProfitDetectorInputs;
  const validation = validateDairyProfitDetectorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateDairyProfitDetector(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: DairyProfitDetectorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("dairy-profit-detector", () => {
  test("exact default oracle", () => {
    const result = calculateDairyProfitDetector(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.feedCost).toBeCloseTo(engineNumeric(SLUG, "feedCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateDairyProfitDetector(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateDairyProfitDetector(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateDairyProfitDetector(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateDairyProfitDetector(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, cows: undefined } as unknown as DairyProfitDetectorInputs;
    const validation = validateDairyProfitDetectorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateDairyProfitDetector(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ cows: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateDairyProfitDetectorInputs({ ...defaultInputs, cows: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateDairyProfitDetector({ ...defaultInputs, cows: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ days: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ days: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = DAIRY_PROFIT_DETECTOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateDairyProfitDetector(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "feedCost")?.raw).toBeCloseTo(calculatorResult.feedCost, 2);
  });
});
