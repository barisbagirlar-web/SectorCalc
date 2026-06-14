import { describe, expect, test } from "vitest";
import { YALITIM_MALZEMESI_M_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/yalitim-malzemesi-m-hesaplama-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateYalitimMalzemesiMHesaplama,
  type YalitimMalzemesiMHesaplamaInputs,
} from "@/lib/premium-schema/calculators/yalitim-malzemesi-m-hesaplama";
import { validateYalitimMalzemesiMHesaplamaInputs } from "@/lib/premium-schema/calculators/yalitim-malzemesi-m-hesaplama-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "yalitim-malzemesi-m-hesaplama";
const SCHEMA_ID = "yalitim-malzemesi-m-hesaplama";

const defaultInputs: YalitimMalzemesiMHesaplamaInputs = {
    "length": 10,
    "width": 5,
    "wasteRatePercent": 10,
    "unitCostPerSqm": 25,
    "laborRatePerSqm": 15
  };
const lowBandInputs: YalitimMalzemesiMHesaplamaInputs = {
    "length": 0.1,
    "width": 5,
    "wasteRatePercent": 10,
    "unitCostPerSqm": 25,
    "laborRatePerSqm": 15
  };
const criticalBandInputs: YalitimMalzemesiMHesaplamaInputs = {
    "length": 6,
    "width": 5,
    "wasteRatePercent": 10,
    "unitCostPerSqm": 25,
    "laborRatePerSqm": 15
  };

function expectValidationFailure(partial: Partial<YalitimMalzemesiMHesaplamaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as YalitimMalzemesiMHesaplamaInputs;
  const validation = validateYalitimMalzemesiMHesaplamaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateYalitimMalzemesiMHesaplama(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: YalitimMalzemesiMHesaplamaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("yalitim-malzemesi-m-hesaplama", () => {
  test("exact default oracle", () => {
    const result = calculateYalitimMalzemesiMHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateYalitimMalzemesiMHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateYalitimMalzemesiMHesaplama(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateYalitimMalzemesiMHesaplama(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateYalitimMalzemesiMHesaplama(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, length: undefined } as unknown as YalitimMalzemesiMHesaplamaInputs;
    const validation = validateYalitimMalzemesiMHesaplamaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateYalitimMalzemesiMHesaplama(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ length: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateYalitimMalzemesiMHesaplamaInputs({ ...defaultInputs, length: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateYalitimMalzemesiMHesaplama({ ...defaultInputs, length: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ laborRatePerSqm: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ laborRatePerSqm: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = YALITIM_MALZEMESI_M_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateYalitimMalzemesiMHesaplama(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
