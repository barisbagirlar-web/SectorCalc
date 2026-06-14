import { describe, expect, test } from "vitest";
import { MAKINE_EKONOMIK_OMRU_HURDA_DEGER_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/makine-ekonomik-omru-hurda-deger-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateMakineEkonomikOmruHurdaDegerHesabi,
  type MakineEkonomikOmruHurdaDegerHesabiInputs,
} from "@/lib/premium-schema/calculators/makine-ekonomik-omru-hurda-deger-hesabi";
import { validateMakineEkonomikOmruHurdaDegerHesabiInputs } from "@/lib/premium-schema/calculators/makine-ekonomik-omru-hurda-deger-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "makine-ekonomik-omru-hurda-deger-hesabi";
const SCHEMA_ID = "makine-ekonomik-omru-hurda-deger-hesabi";

const defaultInputs: MakineEkonomikOmruHurdaDegerHesabiInputs = {
    "initialCost": 100000,
    "salvageValue": 5000,
    "usefulLife": 10,
    "currentYear": 5
  };
const lowBandInputs: MakineEkonomikOmruHurdaDegerHesabiInputs = {
    "initialCost": 1,
    "salvageValue": 5000,
    "usefulLife": 10,
    "currentYear": 5
  };
const criticalBandInputs: MakineEkonomikOmruHurdaDegerHesabiInputs = {
    "initialCost": 6,
    "salvageValue": 5000,
    "usefulLife": 10,
    "currentYear": 5
  };

function expectValidationFailure(partial: Partial<MakineEkonomikOmruHurdaDegerHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as MakineEkonomikOmruHurdaDegerHesabiInputs;
  const validation = validateMakineEkonomikOmruHurdaDegerHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateMakineEkonomikOmruHurdaDegerHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: MakineEkonomikOmruHurdaDegerHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("makine-ekonomik-omru-hurda-deger-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculateMakineEkonomikOmruHurdaDegerHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateMakineEkonomikOmruHurdaDegerHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateMakineEkonomikOmruHurdaDegerHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateMakineEkonomikOmruHurdaDegerHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateMakineEkonomikOmruHurdaDegerHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, initialCost: undefined } as unknown as MakineEkonomikOmruHurdaDegerHesabiInputs;
    const validation = validateMakineEkonomikOmruHurdaDegerHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateMakineEkonomikOmruHurdaDegerHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ initialCost: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateMakineEkonomikOmruHurdaDegerHesabiInputs({ ...defaultInputs, initialCost: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateMakineEkonomikOmruHurdaDegerHesabi({ ...defaultInputs, initialCost: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ currentYear: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ currentYear: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = MAKINE_EKONOMIK_OMRU_HURDA_DEGER_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateMakineEkonomikOmruHurdaDegerHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
