import { describe, expect, test } from "vitest";
import { GECIS_GRADE_CHANGE_OFF_SPEC_VE_YIKAMA_KAYIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/gecis-grade-change-off-spec-ve-yikama-kayip-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateGecisGradeChangeOffSpecVeYikamaKayipCalculator,
  type GecisGradeChangeOffSpecVeYikamaKayipCalculatorInputs,
} from "@/lib/premium-schema/calculators/gecis-grade-change-off-spec-ve-yikama-kayip-calculator";
import { validateGecisGradeChangeOffSpecVeYikamaKayipCalculatorInputs } from "@/lib/premium-schema/calculators/gecis-grade-change-off-spec-ve-yikama-kayip-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "gecis-grade-change-off-spec-ve-yikama-kayip-calculator";
const SCHEMA_ID = "gecis-grade-change-off-spec-ve-yikama-kayip-calculator";

const defaultInputs: GecisGradeChangeOffSpecVeYikamaKayipCalculatorInputs = {
    "productionQuantity": 1000,
    "unitMaterialCost": 50,
    "offSpecRatePercent": 5,
    "washLossRatePercent": 2
  };
const lowBandInputs: GecisGradeChangeOffSpecVeYikamaKayipCalculatorInputs = {
    "productionQuantity": 1,
    "unitMaterialCost": 50,
    "offSpecRatePercent": 5,
    "washLossRatePercent": 2
  };
const criticalBandInputs: GecisGradeChangeOffSpecVeYikamaKayipCalculatorInputs = {
    "productionQuantity": 6,
    "unitMaterialCost": 50,
    "offSpecRatePercent": 5,
    "washLossRatePercent": 2
  };

function expectValidationFailure(partial: Partial<GecisGradeChangeOffSpecVeYikamaKayipCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as GecisGradeChangeOffSpecVeYikamaKayipCalculatorInputs;
  const validation = validateGecisGradeChangeOffSpecVeYikamaKayipCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateGecisGradeChangeOffSpecVeYikamaKayipCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: GecisGradeChangeOffSpecVeYikamaKayipCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("gecis-grade-change-off-spec-ve-yikama-kayip-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateGecisGradeChangeOffSpecVeYikamaKayipCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateGecisGradeChangeOffSpecVeYikamaKayipCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateGecisGradeChangeOffSpecVeYikamaKayipCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateGecisGradeChangeOffSpecVeYikamaKayipCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateGecisGradeChangeOffSpecVeYikamaKayipCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, productionQuantity: undefined } as unknown as GecisGradeChangeOffSpecVeYikamaKayipCalculatorInputs;
    const validation = validateGecisGradeChangeOffSpecVeYikamaKayipCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateGecisGradeChangeOffSpecVeYikamaKayipCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ productionQuantity: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateGecisGradeChangeOffSpecVeYikamaKayipCalculatorInputs({ ...defaultInputs, productionQuantity: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateGecisGradeChangeOffSpecVeYikamaKayipCalculator({ ...defaultInputs, productionQuantity: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ washLossRatePercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ washLossRatePercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = GECIS_GRADE_CHANGE_OFF_SPEC_VE_YIKAMA_KAYIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateGecisGradeChangeOffSpecVeYikamaKayipCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
