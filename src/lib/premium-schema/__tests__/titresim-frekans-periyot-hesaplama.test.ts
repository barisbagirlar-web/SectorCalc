import { describe, expect, test } from "vitest";
import { TITRESIM_FREKANS_PERIYOT_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/titresim-frekans-periyot-hesaplama-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateTitresimFrekansPeriyotHesaplama,
  type TitresimFrekansPeriyotHesaplamaInputs,
} from "@/lib/premium-schema/calculators/titresim-frekans-periyot-hesaplama";
import { validateTitresimFrekansPeriyotHesaplamaInputs } from "@/lib/premium-schema/calculators/titresim-frekans-periyot-hesaplama-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "titresim-frekans-periyot-hesaplama";
const SCHEMA_ID = "titresim-frekans-periyot-hesaplama";

const defaultInputs: TitresimFrekansPeriyotHesaplamaInputs = {
    "periodSeconds": 1,
    "frequencyHz": 1,
    "displacementMeters": 0.01,
    "timeSeconds": 0
  };
const lowBandInputs: TitresimFrekansPeriyotHesaplamaInputs = {
    "periodSeconds": 0.1,
    "frequencyHz": 1,
    "displacementMeters": 0.01,
    "timeSeconds": 0
  };
const criticalBandInputs: TitresimFrekansPeriyotHesaplamaInputs = {
    "periodSeconds": 6,
    "frequencyHz": 1,
    "displacementMeters": 0.01,
    "timeSeconds": 0
  };

function expectValidationFailure(partial: Partial<TitresimFrekansPeriyotHesaplamaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as TitresimFrekansPeriyotHesaplamaInputs;
  const validation = validateTitresimFrekansPeriyotHesaplamaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateTitresimFrekansPeriyotHesaplama(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: TitresimFrekansPeriyotHesaplamaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("titresim-frekans-periyot-hesaplama", () => {
  test("exact default oracle", () => {
    const result = calculateTitresimFrekansPeriyotHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateTitresimFrekansPeriyotHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateTitresimFrekansPeriyotHesaplama(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateTitresimFrekansPeriyotHesaplama(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateTitresimFrekansPeriyotHesaplama(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, periodSeconds: undefined } as unknown as TitresimFrekansPeriyotHesaplamaInputs;
    const validation = validateTitresimFrekansPeriyotHesaplamaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateTitresimFrekansPeriyotHesaplama(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ periodSeconds: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateTitresimFrekansPeriyotHesaplamaInputs({ ...defaultInputs, periodSeconds: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateTitresimFrekansPeriyotHesaplama({ ...defaultInputs, periodSeconds: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ timeSeconds: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ timeSeconds: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = TITRESIM_FREKANS_PERIYOT_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateTitresimFrekansPeriyotHesaplama(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
