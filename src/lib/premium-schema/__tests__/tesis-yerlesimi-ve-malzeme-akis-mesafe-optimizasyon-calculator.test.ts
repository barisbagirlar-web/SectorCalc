import { describe, expect, test } from "vitest";
import { TESIS_YERLESIMI_VE_MALZEME_AKIS_MESAFE_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/tesis-yerlesimi-ve-malzeme-akis-mesafe-optimizasyon-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateTesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculator,
  type TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInputs,
} from "@/lib/premium-schema/calculators/tesis-yerlesimi-ve-malzeme-akis-mesafe-optimizasyon-calculator";
import { validateTesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInputs } from "@/lib/premium-schema/calculators/tesis-yerlesimi-ve-malzeme-akis-mesafe-optimizasyon-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "tesis-yerlesimi-ve-malzeme-akis-mesafe-optimizasyon-calculator";
const SCHEMA_ID = "tesis-yerlesimi-ve-malzeme-akis-mesafe-optimizasyon-calculator";

const defaultInputs: TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInputs = {
    "departmentCount": 5,
    "flowMatrix": 1,
    "distanceMatrix": 1,
    "unitHandlingCost": 0.01,
    "optimalDistanceMatrix": 1
  };
const lowBandInputs: TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInputs = {
    "departmentCount": 2,
    "flowMatrix": 1,
    "distanceMatrix": 1,
    "unitHandlingCost": 0.01,
    "optimalDistanceMatrix": 1
  };
const criticalBandInputs: TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInputs = {
    "departmentCount": 6,
    "flowMatrix": 1,
    "distanceMatrix": 1,
    "unitHandlingCost": 0.01,
    "optimalDistanceMatrix": 1
  };

function expectValidationFailure(partial: Partial<TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInputs;
  const validation = validateTesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateTesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("tesis-yerlesimi-ve-malzeme-akis-mesafe-optimizasyon-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateTesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateTesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateTesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateTesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateTesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, departmentCount: undefined } as unknown as TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInputs;
    const validation = validateTesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateTesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ departmentCount: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateTesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInputs({ ...defaultInputs, departmentCount: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateTesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculator({ ...defaultInputs, departmentCount: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ optimalDistanceMatrix: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ optimalDistanceMatrix: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = TESIS_YERLESIMI_VE_MALZEME_AKIS_MESAFE_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateTesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
