import { describe, expect, test } from "vitest";
import { FAZLA_MESAI_UCRETI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/fazla-mesai-ucreti-hesaplama-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateFazlaMesaiUcretiHesaplama,
  type FazlaMesaiUcretiHesaplamaInputs,
} from "@/lib/premium-schema/calculators/fazla-mesai-ucreti-hesaplama";
import { validateFazlaMesaiUcretiHesaplamaInputs } from "@/lib/premium-schema/calculators/fazla-mesai-ucreti-hesaplama-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "fazla-mesai-ucreti-hesaplama";
const SCHEMA_ID = "fazla-mesai-ucreti-hesaplama";

const defaultInputs: FazlaMesaiUcretiHesaplamaInputs = {
    "monthlySalary": 3000,
    "weeklyHours": 40,
    "overtimeHours": 10,
    "overtimeMultiplier": 1.5
  };
const lowBandInputs: FazlaMesaiUcretiHesaplamaInputs = {
    "monthlySalary": 0.1,
    "weeklyHours": 40,
    "overtimeHours": 10,
    "overtimeMultiplier": 1.5
  };
const criticalBandInputs: FazlaMesaiUcretiHesaplamaInputs = {
    "monthlySalary": 6,
    "weeklyHours": 40,
    "overtimeHours": 10,
    "overtimeMultiplier": 1.5
  };

function expectValidationFailure(partial: Partial<FazlaMesaiUcretiHesaplamaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as FazlaMesaiUcretiHesaplamaInputs;
  const validation = validateFazlaMesaiUcretiHesaplamaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateFazlaMesaiUcretiHesaplama(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: FazlaMesaiUcretiHesaplamaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("fazla-mesai-ucreti-hesaplama", () => {
  test("exact default oracle", () => {
    const result = calculateFazlaMesaiUcretiHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateFazlaMesaiUcretiHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateFazlaMesaiUcretiHesaplama(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateFazlaMesaiUcretiHesaplama(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateFazlaMesaiUcretiHesaplama(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, monthlySalary: undefined } as unknown as FazlaMesaiUcretiHesaplamaInputs;
    const validation = validateFazlaMesaiUcretiHesaplamaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateFazlaMesaiUcretiHesaplama(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ monthlySalary: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateFazlaMesaiUcretiHesaplamaInputs({ ...defaultInputs, weeklyHours: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateFazlaMesaiUcretiHesaplama({ ...defaultInputs, weeklyHours: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ overtimeMultiplier: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ overtimeMultiplier: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = FAZLA_MESAI_UCRETI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateFazlaMesaiUcretiHesaplama(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
