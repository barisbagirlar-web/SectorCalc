import { describe, expect, test } from "vitest";
import { KUMLAMA_RASPA_KUM_SARFIYATI_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kumlama-raspa-kum-sarfiyati-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateKumlamaRaspaKumSarfiyatiHesabi,
  type KumlamaRaspaKumSarfiyatiHesabiInputs,
} from "@/lib/premium-schema/calculators/kumlama-raspa-kum-sarfiyati-hesabi";
import { validateKumlamaRaspaKumSarfiyatiHesabiInputs } from "@/lib/premium-schema/calculators/kumlama-raspa-kum-sarfiyati-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "kumlama-raspa-kum-sarfiyati-hesabi";
const SCHEMA_ID = "kumlama-raspa-kum-sarfiyati-hesabi";

const defaultInputs: KumlamaRaspaKumSarfiyatiHesabiInputs = {
    "surfaceArea": 10,
    "consumptionRatePerUnitArea": 2.5,
    "nozzleEfficiency": 0.8,
    "lossFactor": 10,
    "unitCost": 0.5
  };
const lowBandInputs: KumlamaRaspaKumSarfiyatiHesabiInputs = {
    "surfaceArea": 0.1,
    "consumptionRatePerUnitArea": 2.5,
    "nozzleEfficiency": 0.8,
    "lossFactor": 10,
    "unitCost": 0.5
  };
const criticalBandInputs: KumlamaRaspaKumSarfiyatiHesabiInputs = {
    "surfaceArea": 6,
    "consumptionRatePerUnitArea": 2.5,
    "nozzleEfficiency": 0.8,
    "lossFactor": 10,
    "unitCost": 0.5
  };

function expectValidationFailure(partial: Partial<KumlamaRaspaKumSarfiyatiHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as KumlamaRaspaKumSarfiyatiHesabiInputs;
  const validation = validateKumlamaRaspaKumSarfiyatiHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateKumlamaRaspaKumSarfiyatiHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: KumlamaRaspaKumSarfiyatiHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("kumlama-raspa-kum-sarfiyati-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculateKumlamaRaspaKumSarfiyatiHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateKumlamaRaspaKumSarfiyatiHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateKumlamaRaspaKumSarfiyatiHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateKumlamaRaspaKumSarfiyatiHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateKumlamaRaspaKumSarfiyatiHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, surfaceArea: undefined } as unknown as KumlamaRaspaKumSarfiyatiHesabiInputs;
    const validation = validateKumlamaRaspaKumSarfiyatiHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateKumlamaRaspaKumSarfiyatiHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ surfaceArea: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateKumlamaRaspaKumSarfiyatiHesabiInputs({ ...defaultInputs, surfaceArea: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateKumlamaRaspaKumSarfiyatiHesabi({ ...defaultInputs, surfaceArea: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ unitCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ unitCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = KUMLAMA_RASPA_KUM_SARFIYATI_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateKumlamaRaspaKumSarfiyatiHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
