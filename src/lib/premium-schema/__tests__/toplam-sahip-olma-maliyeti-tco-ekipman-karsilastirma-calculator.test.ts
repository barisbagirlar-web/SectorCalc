import { describe, expect, test } from "vitest";
import { TOPLAM_SAHIP_OLMA_MALIYETI_TCO_EKIPMAN_KARSILASTIRMA_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/toplam-sahip-olma-maliyeti-tco-ekipman-karsilastirma-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculator,
  type ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInputs,
} from "@/lib/premium-schema/calculators/toplam-sahip-olma-maliyeti-tco-ekipman-karsilastirma-calculator";
import { validateToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInputs } from "@/lib/premium-schema/calculators/toplam-sahip-olma-maliyeti-tco-ekipman-karsilastirma-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "toplam-sahip-olma-maliyeti-tco-ekipman-karsilastirma-calculator";
const SCHEMA_ID = "toplam-sahip-olma-maliyeti-tco-ekipman-karsilastirma-calculator";

const defaultInputs: ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInputs = {
    "purchasePrice": 50000,
    "installationCost": 5000,
    "trainingCost": 2000,
    "expectedLifeYears": 10,
    "annualEnergyCost": 10000,
    "annualConsumablesCost": 3000
  };
const lowBandInputs: ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInputs = {
    "purchasePrice": 0.1,
    "installationCost": 5000,
    "trainingCost": 2000,
    "expectedLifeYears": 10,
    "annualEnergyCost": 10000,
    "annualConsumablesCost": 3000
  };
const criticalBandInputs: ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInputs = {
    "purchasePrice": 6,
    "installationCost": 5000,
    "trainingCost": 2000,
    "expectedLifeYears": 10,
    "annualEnergyCost": 10000,
    "annualConsumablesCost": 3000
  };

function expectValidationFailure(partial: Partial<ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInputs;
  const validation = validateToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("toplam-sahip-olma-maliyeti-tco-ekipman-karsilastirma-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, purchasePrice: undefined } as unknown as ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInputs;
    const validation = validateToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ purchasePrice: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInputs({ ...defaultInputs, expectedLifeYears: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculator({ ...defaultInputs, expectedLifeYears: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ annualConsumablesCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ annualConsumablesCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = TOPLAM_SAHIP_OLMA_MALIYETI_TCO_EKIPMAN_KARSILASTIRMA_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
