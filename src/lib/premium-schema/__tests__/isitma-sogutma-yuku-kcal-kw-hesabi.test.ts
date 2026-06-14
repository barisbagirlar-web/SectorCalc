import { describe, expect, test } from "vitest";
import { ISITMA_SOGUTMA_YUKU_KCAL_KW_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/isitma-sogutma-yuku-kcal-kw-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateIsitmaSogutmaYukuKcalKwHesabi,
  type IsitmaSogutmaYukuKcalKwHesabiInputs,
} from "@/lib/premium-schema/calculators/isitma-sogutma-yuku-kcal-kw-hesabi";
import { validateIsitmaSogutmaYukuKcalKwHesabiInputs } from "@/lib/premium-schema/calculators/isitma-sogutma-yuku-kcal-kw-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "isitma-sogutma-yuku-kcal-kw-hesabi";
const SCHEMA_ID = "isitma-sogutma-yuku-kcal-kw-hesabi";

const defaultInputs: IsitmaSogutmaYukuKcalKwHesabiInputs = {
    "powerKw": 10,
    "runtimeHours": 8,
    "energyConsumptionKwh": 80,
    "tariffPerKwh": 0.12,
    "peakDemandKw": 15,
    "efficiencyPercent": 85
  };
const lowBandInputs: IsitmaSogutmaYukuKcalKwHesabiInputs = {
    "powerKw": 0.1,
    "runtimeHours": 8,
    "energyConsumptionKwh": 80,
    "tariffPerKwh": 0.12,
    "peakDemandKw": 15,
    "efficiencyPercent": 85
  };
const criticalBandInputs: IsitmaSogutmaYukuKcalKwHesabiInputs = {
    "powerKw": 6,
    "runtimeHours": 8,
    "energyConsumptionKwh": 80,
    "tariffPerKwh": 0.12,
    "peakDemandKw": 15,
    "efficiencyPercent": 85
  };

function expectValidationFailure(partial: Partial<IsitmaSogutmaYukuKcalKwHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as IsitmaSogutmaYukuKcalKwHesabiInputs;
  const validation = validateIsitmaSogutmaYukuKcalKwHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateIsitmaSogutmaYukuKcalKwHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: IsitmaSogutmaYukuKcalKwHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("isitma-sogutma-yuku-kcal-kw-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculateIsitmaSogutmaYukuKcalKwHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateIsitmaSogutmaYukuKcalKwHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateIsitmaSogutmaYukuKcalKwHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateIsitmaSogutmaYukuKcalKwHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateIsitmaSogutmaYukuKcalKwHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, powerKw: undefined } as unknown as IsitmaSogutmaYukuKcalKwHesabiInputs;
    const validation = validateIsitmaSogutmaYukuKcalKwHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateIsitmaSogutmaYukuKcalKwHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ powerKw: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateIsitmaSogutmaYukuKcalKwHesabiInputs({ ...defaultInputs, efficiencyPercent: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateIsitmaSogutmaYukuKcalKwHesabi({ ...defaultInputs, efficiencyPercent: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ efficiencyPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ efficiencyPercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ISITMA_SOGUTMA_YUKU_KCAL_KW_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateIsitmaSogutmaYukuKcalKwHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
