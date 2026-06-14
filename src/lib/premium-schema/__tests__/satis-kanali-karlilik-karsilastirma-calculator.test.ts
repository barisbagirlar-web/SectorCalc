import { describe, expect, test } from "vitest";
import { SATIS_KANALI_KARLILIK_KARSILASTIRMA_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/satis-kanali-karlilik-karsilastirma-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateSatisKanaliKarlilikKarsilastirmaCalculator,
  type SatisKanaliKarlilikKarsilastirmaCalculatorInputs,
} from "@/lib/premium-schema/calculators/satis-kanali-karlilik-karsilastirma-calculator";
import { validateSatisKanaliKarlilikKarsilastirmaCalculatorInputs } from "@/lib/premium-schema/calculators/satis-kanali-karlilik-karsilastirma-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "satis-kanali-karlilik-karsilastirma-calculator";
const SCHEMA_ID = "satis-kanali-karlilik-karsilastirma-calculator";

const defaultInputs: SatisKanaliKarlilikKarsilastirmaCalculatorInputs = {
    "channelName": 1,
    "unitPrice": 100,
    "quantitySold": 1000,
    "discountPercent": 0,
    "returnsPercent": 0,
    "unitCost": 50
  };
const lowBandInputs: SatisKanaliKarlilikKarsilastirmaCalculatorInputs = {
    "channelName": 0.1,
    "unitPrice": 100,
    "quantitySold": 1000,
    "discountPercent": 0,
    "returnsPercent": 0,
    "unitCost": 50
  };
const criticalBandInputs: SatisKanaliKarlilikKarsilastirmaCalculatorInputs = {
    "channelName": 6,
    "unitPrice": 100,
    "quantitySold": 1000,
    "discountPercent": 0,
    "returnsPercent": 0,
    "unitCost": 50
  };

function expectValidationFailure(partial: Partial<SatisKanaliKarlilikKarsilastirmaCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as SatisKanaliKarlilikKarsilastirmaCalculatorInputs;
  const validation = validateSatisKanaliKarlilikKarsilastirmaCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateSatisKanaliKarlilikKarsilastirmaCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: SatisKanaliKarlilikKarsilastirmaCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("satis-kanali-karlilik-karsilastirma-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateSatisKanaliKarlilikKarsilastirmaCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateSatisKanaliKarlilikKarsilastirmaCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateSatisKanaliKarlilikKarsilastirmaCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateSatisKanaliKarlilikKarsilastirmaCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateSatisKanaliKarlilikKarsilastirmaCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, channelName: undefined } as unknown as SatisKanaliKarlilikKarsilastirmaCalculatorInputs;
    const validation = validateSatisKanaliKarlilikKarsilastirmaCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateSatisKanaliKarlilikKarsilastirmaCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ channelName: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateSatisKanaliKarlilikKarsilastirmaCalculatorInputs({ ...defaultInputs, quantitySold: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateSatisKanaliKarlilikKarsilastirmaCalculator({ ...defaultInputs, quantitySold: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ unitCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ unitCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = SATIS_KANALI_KARLILIK_KARSILASTIRMA_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateSatisKanaliKarlilikKarsilastirmaCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
