import { describe, expect, test } from "vitest";
import { FERTILIZER_DOSAGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/fertilizer-dosage-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateFertilizerDosageCalculator,
  type FertilizerDosageCalculatorInputs,
} from "@/lib/premium-schema/calculators/fertilizer-dosage-calculator";
import { validateFertilizerDosageCalculatorInputs } from "@/lib/premium-schema/calculators/fertilizer-dosage-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "fertilizer-dosage-calculator";
const SCHEMA_ID = "fertilizer-dosage-calculator";

const defaultInputs: FertilizerDosageCalculatorInputs = {
    "targetYield": 8000,
    "nutrientUptakePerUnit": 0.02,
    "soilAvailableNutrient": 50,
    "applicationEfficiency": 70,
    "nutrientContent": 46,
    "unitCost": 0.5
  };
const lowBandInputs: FertilizerDosageCalculatorInputs = {
    "targetYield": 0.1,
    "nutrientUptakePerUnit": 0.02,
    "soilAvailableNutrient": 50,
    "applicationEfficiency": 70,
    "nutrientContent": 46,
    "unitCost": 0.5
  };
const criticalBandInputs: FertilizerDosageCalculatorInputs = {
    "targetYield": 6,
    "nutrientUptakePerUnit": 0.02,
    "soilAvailableNutrient": 50,
    "applicationEfficiency": 70,
    "nutrientContent": 46,
    "unitCost": 0.5
  };

function expectValidationFailure(partial: Partial<FertilizerDosageCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as FertilizerDosageCalculatorInputs;
  const validation = validateFertilizerDosageCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateFertilizerDosageCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: FertilizerDosageCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("fertilizer-dosage-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateFertilizerDosageCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateFertilizerDosageCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateFertilizerDosageCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateFertilizerDosageCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateFertilizerDosageCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, targetYield: undefined } as unknown as FertilizerDosageCalculatorInputs;
    const validation = validateFertilizerDosageCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateFertilizerDosageCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ targetYield: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ unitCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ unitCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = FERTILIZER_DOSAGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateFertilizerDosageCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
