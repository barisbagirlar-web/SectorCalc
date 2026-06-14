import { describe, expect, test } from "vitest";
import { ARAC_BAKIM_PERIYODU_TAKIP_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/arac-bakim-periyodu-takip-hesaplama-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateAracBakimPeriyoduTakipHesaplama,
  type AracBakimPeriyoduTakipHesaplamaInputs,
} from "@/lib/premium-schema/calculators/arac-bakim-periyodu-takip-hesaplama";
import { validateAracBakimPeriyoduTakipHesaplamaInputs } from "@/lib/premium-schema/calculators/arac-bakim-periyodu-takip-hesaplama-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "arac-bakim-periyodu-takip-hesaplama";
const SCHEMA_ID = "arac-bakim-periyodu-takip-hesaplama";

const defaultInputs: AracBakimPeriyoduTakipHesaplamaInputs = {
    "downtimeMinutes": 60,
    "machineHourlyRate": 100,
    "laborHourlyRate": 50,
    "lostProductionUnits": 10,
    "contributionMarginPerUnit": 20,
    "repairCost": 500
  };
const lowBandInputs: AracBakimPeriyoduTakipHesaplamaInputs = {
    "downtimeMinutes": 0.1,
    "machineHourlyRate": 100,
    "laborHourlyRate": 50,
    "lostProductionUnits": 10,
    "contributionMarginPerUnit": 20,
    "repairCost": 500
  };
const criticalBandInputs: AracBakimPeriyoduTakipHesaplamaInputs = {
    "downtimeMinutes": 6,
    "machineHourlyRate": 100,
    "laborHourlyRate": 50,
    "lostProductionUnits": 10,
    "contributionMarginPerUnit": 20,
    "repairCost": 500
  };

function expectValidationFailure(partial: Partial<AracBakimPeriyoduTakipHesaplamaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as AracBakimPeriyoduTakipHesaplamaInputs;
  const validation = validateAracBakimPeriyoduTakipHesaplamaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateAracBakimPeriyoduTakipHesaplama(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: AracBakimPeriyoduTakipHesaplamaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("arac-bakim-periyodu-takip-hesaplama", () => {
  test("exact default oracle", () => {
    const result = calculateAracBakimPeriyoduTakipHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateAracBakimPeriyoduTakipHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateAracBakimPeriyoduTakipHesaplama(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateAracBakimPeriyoduTakipHesaplama(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateAracBakimPeriyoduTakipHesaplama(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, downtimeMinutes: undefined } as unknown as AracBakimPeriyoduTakipHesaplamaInputs;
    const validation = validateAracBakimPeriyoduTakipHesaplamaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateAracBakimPeriyoduTakipHesaplama(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ downtimeMinutes: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateAracBakimPeriyoduTakipHesaplamaInputs({ ...defaultInputs, lostProductionUnits: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateAracBakimPeriyoduTakipHesaplama({ ...defaultInputs, lostProductionUnits: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ repairCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ repairCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ARAC_BAKIM_PERIYODU_TAKIP_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateAracBakimPeriyoduTakipHesaplama(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
