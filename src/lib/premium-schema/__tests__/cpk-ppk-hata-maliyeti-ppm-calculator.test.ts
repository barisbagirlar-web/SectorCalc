import { describe, expect, test } from "vitest";
import { CPK_PPK_HATA_MALIYETI_PPM_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cpk-ppk-hata-maliyeti-ppm-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateCpkPpkHataMaliyetiPpmCalculator,
  type CpkPpkHataMaliyetiPpmCalculatorInputs,
} from "@/lib/premium-schema/calculators/cpk-ppk-hata-maliyeti-ppm-calculator";
import { validateCpkPpkHataMaliyetiPpmCalculatorInputs } from "@/lib/premium-schema/calculators/cpk-ppk-hata-maliyeti-ppm-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "cpk-ppk-hata-maliyeti-ppm-calculator";
const SCHEMA_ID = "cpk-ppk-hata-maliyeti-ppm-calculator";

const defaultInputs: CpkPpkHataMaliyetiPpmCalculatorInputs = {
    "cpkValue": 1.33,
    "ppkValue": 1.33,
    "unitCost": 10,
    "productionVolume": 1000
  };
const lowBandInputs: CpkPpkHataMaliyetiPpmCalculatorInputs = {
    "cpkValue": 0.1,
    "ppkValue": 1.33,
    "unitCost": 10,
    "productionVolume": 1000
  };
const criticalBandInputs: CpkPpkHataMaliyetiPpmCalculatorInputs = {
    "cpkValue": 3,
    "ppkValue": 1.33,
    "unitCost": 10,
    "productionVolume": 1000
  };

function expectValidationFailure(partial: Partial<CpkPpkHataMaliyetiPpmCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as CpkPpkHataMaliyetiPpmCalculatorInputs;
  const validation = validateCpkPpkHataMaliyetiPpmCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateCpkPpkHataMaliyetiPpmCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: CpkPpkHataMaliyetiPpmCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("cpk-ppk-hata-maliyeti-ppm-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateCpkPpkHataMaliyetiPpmCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateCpkPpkHataMaliyetiPpmCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateCpkPpkHataMaliyetiPpmCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateCpkPpkHataMaliyetiPpmCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateCpkPpkHataMaliyetiPpmCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, cpkValue: undefined } as unknown as CpkPpkHataMaliyetiPpmCalculatorInputs;
    const validation = validateCpkPpkHataMaliyetiPpmCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateCpkPpkHataMaliyetiPpmCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ cpkValue: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateCpkPpkHataMaliyetiPpmCalculatorInputs({ ...defaultInputs, productionVolume: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateCpkPpkHataMaliyetiPpmCalculator({ ...defaultInputs, productionVolume: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ productionVolume: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ productionVolume: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = CPK_PPK_HATA_MALIYETI_PPM_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateCpkPpkHataMaliyetiPpmCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
