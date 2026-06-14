import { describe, expect, test } from "vitest";
import { SHEET_METAL_WEIGHT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/sheet-metal-weight-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateSheetMetalWeightCalculator,
  type SheetMetalWeightCalculatorInputs,
} from "@/lib/premium-schema/calculators/sheet-metal-weight-calculator";
import { validateSheetMetalWeightCalculatorInputs } from "@/lib/premium-schema/calculators/sheet-metal-weight-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "sheet-metal-weight-calculator";
const SCHEMA_ID = "sheet-metal-weight-calculator";

const defaultInputs: SheetMetalWeightCalculatorInputs = {
    "materialThickness": 1.5,
    "materialWidth": 1000,
    "materialLength": 2000,
    "materialDensity": 7850,
    "quantity": 1
  };
const lowBandInputs: SheetMetalWeightCalculatorInputs = {
    "materialThickness": 0.1,
    "materialWidth": 1000,
    "materialLength": 2000,
    "materialDensity": 7850,
    "quantity": 1
  };
const criticalBandInputs: SheetMetalWeightCalculatorInputs = {
    "materialThickness": 6,
    "materialWidth": 1000,
    "materialLength": 2000,
    "materialDensity": 7850,
    "quantity": 1
  };

function expectValidationFailure(partial: Partial<SheetMetalWeightCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as SheetMetalWeightCalculatorInputs;
  const validation = validateSheetMetalWeightCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateSheetMetalWeightCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: SheetMetalWeightCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("sheet-metal-weight-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateSheetMetalWeightCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateSheetMetalWeightCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateSheetMetalWeightCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateSheetMetalWeightCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateSheetMetalWeightCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, materialThickness: undefined } as unknown as SheetMetalWeightCalculatorInputs;
    const validation = validateSheetMetalWeightCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateSheetMetalWeightCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ materialThickness: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateSheetMetalWeightCalculatorInputs({ ...defaultInputs, materialThickness: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateSheetMetalWeightCalculator({ ...defaultInputs, materialThickness: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ quantity: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ quantity: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = SHEET_METAL_WEIGHT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateSheetMetalWeightCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
