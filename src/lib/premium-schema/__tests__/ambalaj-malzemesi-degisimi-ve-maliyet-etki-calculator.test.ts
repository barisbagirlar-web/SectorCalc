import { describe, expect, test } from "vitest";
import { AMBALAJ_MALZEMESI_DEGISIMI_VE_MALIYET_ETKI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/ambalaj-malzemesi-degisimi-ve-maliyet-etki-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateAmbalajMalzemesiDegisimiVeMaliyetEtkiCalculator,
  type AmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorInputs,
} from "@/lib/premium-schema/calculators/ambalaj-malzemesi-degisimi-ve-maliyet-etki-calculator";
import { validateAmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorInputs } from "@/lib/premium-schema/calculators/ambalaj-malzemesi-degisimi-ve-maliyet-etki-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "ambalaj-malzemesi-degisimi-ve-maliyet-etki-calculator";
const SCHEMA_ID = "ambalaj-malzemesi-degisimi-ve-maliyet-etki-calculator";

const defaultInputs: AmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorInputs = {
    "productionQuantity": 100,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5
  };
const lowBandInputs: AmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorInputs = {
    "productionQuantity": 1,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5
  };
const criticalBandInputs: AmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorInputs = {
    "productionQuantity": 6,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5
  };

function expectValidationFailure(partial: Partial<AmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as AmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorInputs;
  const validation = validateAmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateAmbalajMalzemesiDegisimiVeMaliyetEtkiCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: AmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("ambalaj-malzemesi-degisimi-ve-maliyet-etki-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateAmbalajMalzemesiDegisimiVeMaliyetEtkiCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateAmbalajMalzemesiDegisimiVeMaliyetEtkiCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateAmbalajMalzemesiDegisimiVeMaliyetEtkiCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateAmbalajMalzemesiDegisimiVeMaliyetEtkiCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateAmbalajMalzemesiDegisimiVeMaliyetEtkiCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, productionQuantity: undefined } as unknown as AmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorInputs;
    const validation = validateAmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateAmbalajMalzemesiDegisimiVeMaliyetEtkiCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ productionQuantity: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateAmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorInputs({ ...defaultInputs, productionQuantity: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateAmbalajMalzemesiDegisimiVeMaliyetEtkiCalculator({ ...defaultInputs, productionQuantity: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ scrapRatePercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ scrapRatePercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = AMBALAJ_MALZEMESI_DEGISIMI_VE_MALIYET_ETKI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateAmbalajMalzemesiDegisimiVeMaliyetEtkiCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
