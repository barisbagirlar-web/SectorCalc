import { describe, expect, test } from "vitest";
import { RECIPE_COST_CHECK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/recipe-cost-check-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateRecipeCostCheck,
  type RecipeCostCheckInputs,
} from "@/lib/premium-schema/calculators/recipe-cost-check";
import { validateRecipeCostCheckInputs } from "@/lib/premium-schema/calculators/recipe-cost-check-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "recipe-cost-check";
const SCHEMA_ID = "recipe-cost-check";

const defaultInputs: RecipeCostCheckInputs = {
    "productionQuantity": 100,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "laborCostPerUnit": 2,
    "overheadCostPerUnit": 1,
    "sellingPricePerUnit": 15
  };
const lowBandInputs: RecipeCostCheckInputs = {
    "productionQuantity": 1,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "laborCostPerUnit": 2,
    "overheadCostPerUnit": 1,
    "sellingPricePerUnit": 15
  };
const criticalBandInputs: RecipeCostCheckInputs = {
    "productionQuantity": 6,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "laborCostPerUnit": 2,
    "overheadCostPerUnit": 1,
    "sellingPricePerUnit": 15
  };

function expectValidationFailure(partial: Partial<RecipeCostCheckInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as RecipeCostCheckInputs;
  const validation = validateRecipeCostCheckInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateRecipeCostCheck(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: RecipeCostCheckInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("recipe-cost-check", () => {
  test("exact default oracle", () => {
    const result = calculateRecipeCostCheck(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateRecipeCostCheck(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateRecipeCostCheck(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateRecipeCostCheck(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateRecipeCostCheck(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, productionQuantity: undefined } as unknown as RecipeCostCheckInputs;
    const validation = validateRecipeCostCheckInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateRecipeCostCheck(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ productionQuantity: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateRecipeCostCheckInputs({ ...defaultInputs, productionQuantity: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateRecipeCostCheck({ ...defaultInputs, productionQuantity: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ sellingPricePerUnit: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ sellingPricePerUnit: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = RECIPE_COST_CHECK_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateRecipeCostCheck(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
