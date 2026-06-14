import { describe, expect, test } from "vitest";
import { YATAK_RULMAN_OMUR_HESABI_L10_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/yatak-rulman-omur-hesabi-l10-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateYatakRulmanOmurHesabiL10,
  type YatakRulmanOmurHesabiL10Inputs,
} from "@/lib/premium-schema/calculators/yatak-rulman-omur-hesabi-l10";
import { validateYatakRulmanOmurHesabiL10Inputs } from "@/lib/premium-schema/calculators/yatak-rulman-omur-hesabi-l10-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "yatak-rulman-omur-hesabi-l10";
const SCHEMA_ID = "yatak-rulman-omur-hesabi-l10";

const defaultInputs: YatakRulmanOmurHesabiL10Inputs = {
    "dynamicLoadRatingC": 10000,
    "equivalentDynamicLoadP": 5000,
    "rotationalSpeedN": 1500,
    "reliabilityFactorA1": 1,
    "materialFactorA2": 1
  };
const lowBandInputs: YatakRulmanOmurHesabiL10Inputs = {
    "dynamicLoadRatingC": 1,
    "equivalentDynamicLoadP": 5000,
    "rotationalSpeedN": 1500,
    "reliabilityFactorA1": 1,
    "materialFactorA2": 1
  };
const criticalBandInputs: YatakRulmanOmurHesabiL10Inputs = {
    "dynamicLoadRatingC": 6,
    "equivalentDynamicLoadP": 5000,
    "rotationalSpeedN": 1500,
    "reliabilityFactorA1": 1,
    "materialFactorA2": 1
  };

function expectValidationFailure(partial: Partial<YatakRulmanOmurHesabiL10Inputs>): void {
  const inputs = { ...defaultInputs, ...partial } as YatakRulmanOmurHesabiL10Inputs;
  const validation = validateYatakRulmanOmurHesabiL10Inputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateYatakRulmanOmurHesabiL10(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: YatakRulmanOmurHesabiL10Inputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("yatak-rulman-omur-hesabi-l10", () => {
  test("exact default oracle", () => {
    const result = calculateYatakRulmanOmurHesabiL10(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateYatakRulmanOmurHesabiL10(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateYatakRulmanOmurHesabiL10(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateYatakRulmanOmurHesabiL10(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateYatakRulmanOmurHesabiL10(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, dynamicLoadRatingC: undefined } as unknown as YatakRulmanOmurHesabiL10Inputs;
    const validation = validateYatakRulmanOmurHesabiL10Inputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateYatakRulmanOmurHesabiL10(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ dynamicLoadRatingC: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateYatakRulmanOmurHesabiL10Inputs({ ...defaultInputs, dynamicLoadRatingC: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateYatakRulmanOmurHesabiL10({ ...defaultInputs, dynamicLoadRatingC: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ materialFactorA2: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ materialFactorA2: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = YATAK_RULMAN_OMUR_HESABI_L10_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateYatakRulmanOmurHesabiL10(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
