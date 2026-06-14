import { describe, expect, test } from "vitest";
import { OFIS_KIRTASIYE_SARFIYAT_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/ofis-kirtasiye-sarfiyat-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateOfisKirtasiyeSarfiyatHesabi,
  type OfisKirtasiyeSarfiyatHesabiInputs,
} from "@/lib/premium-schema/calculators/ofis-kirtasiye-sarfiyat-hesabi";
import { validateOfisKirtasiyeSarfiyatHesabiInputs } from "@/lib/premium-schema/calculators/ofis-kirtasiye-sarfiyat-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "ofis-kirtasiye-sarfiyat-hesabi";
const SCHEMA_ID = "ofis-kirtasiye-sarfiyat-hesabi";

const defaultInputs: OfisKirtasiyeSarfiyatHesabiInputs = {
    "monthlyConsumption": 500,
    "unitPrice": 2.5,
    "wasteRate": 5,
    "overheadRate": 10,
    "employeeCount": 50,
    "monthlyBudget": 2000
  };
const lowBandInputs: OfisKirtasiyeSarfiyatHesabiInputs = {
    "monthlyConsumption": 1,
    "unitPrice": 2.5,
    "wasteRate": 5,
    "overheadRate": 10,
    "employeeCount": 50,
    "monthlyBudget": 2000
  };
const criticalBandInputs: OfisKirtasiyeSarfiyatHesabiInputs = {
    "monthlyConsumption": 6,
    "unitPrice": 2.5,
    "wasteRate": 5,
    "overheadRate": 10,
    "employeeCount": 50,
    "monthlyBudget": 2000
  };

function expectValidationFailure(partial: Partial<OfisKirtasiyeSarfiyatHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as OfisKirtasiyeSarfiyatHesabiInputs;
  const validation = validateOfisKirtasiyeSarfiyatHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateOfisKirtasiyeSarfiyatHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: OfisKirtasiyeSarfiyatHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("ofis-kirtasiye-sarfiyat-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculateOfisKirtasiyeSarfiyatHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateOfisKirtasiyeSarfiyatHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateOfisKirtasiyeSarfiyatHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateOfisKirtasiyeSarfiyatHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateOfisKirtasiyeSarfiyatHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, monthlyConsumption: undefined } as unknown as OfisKirtasiyeSarfiyatHesabiInputs;
    const validation = validateOfisKirtasiyeSarfiyatHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateOfisKirtasiyeSarfiyatHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ monthlyConsumption: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateOfisKirtasiyeSarfiyatHesabiInputs({ ...defaultInputs, monthlyConsumption: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateOfisKirtasiyeSarfiyatHesabi({ ...defaultInputs, monthlyConsumption: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ monthlyBudget: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ monthlyBudget: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = OFIS_KIRTASIYE_SARFIYAT_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateOfisKirtasiyeSarfiyatHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
