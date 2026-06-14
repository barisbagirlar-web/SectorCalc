import { describe, expect, test } from "vitest";
import { KAIZEN_KAZANC_TAKIP_VE_ONCELIKLENDIRME_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kaizen-kazanc-takip-ve-onceliklendirme-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateKaizenKazancTakipVeOnceliklendirmeCalculator,
  type KaizenKazancTakipVeOnceliklendirmeCalculatorInputs,
} from "@/lib/premium-schema/calculators/kaizen-kazanc-takip-ve-onceliklendirme-calculator";
import { validateKaizenKazancTakipVeOnceliklendirmeCalculatorInputs } from "@/lib/premium-schema/calculators/kaizen-kazanc-takip-ve-onceliklendirme-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "kaizen-kazanc-takip-ve-onceliklendirme-calculator";
const SCHEMA_ID = "kaizen-kazanc-takip-ve-onceliklendirme-calculator";

const defaultInputs: KaizenKazancTakipVeOnceliklendirmeCalculatorInputs = {
    "currentCostPerUnit": 10,
    "improvedCostPerUnit": 8,
    "annualProductionVolume": 10000,
    "setupCost": 500,
    "trainingCost": 200,
    "downtimeCost": 300
  };
const lowBandInputs: KaizenKazancTakipVeOnceliklendirmeCalculatorInputs = {
    "currentCostPerUnit": 0.1,
    "improvedCostPerUnit": 8,
    "annualProductionVolume": 10000,
    "setupCost": 500,
    "trainingCost": 200,
    "downtimeCost": 300
  };
const criticalBandInputs: KaizenKazancTakipVeOnceliklendirmeCalculatorInputs = {
    "currentCostPerUnit": 6,
    "improvedCostPerUnit": 8,
    "annualProductionVolume": 10000,
    "setupCost": 500,
    "trainingCost": 200,
    "downtimeCost": 300
  };

function expectValidationFailure(partial: Partial<KaizenKazancTakipVeOnceliklendirmeCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as KaizenKazancTakipVeOnceliklendirmeCalculatorInputs;
  const validation = validateKaizenKazancTakipVeOnceliklendirmeCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateKaizenKazancTakipVeOnceliklendirmeCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: KaizenKazancTakipVeOnceliklendirmeCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("kaizen-kazanc-takip-ve-onceliklendirme-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateKaizenKazancTakipVeOnceliklendirmeCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateKaizenKazancTakipVeOnceliklendirmeCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateKaizenKazancTakipVeOnceliklendirmeCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateKaizenKazancTakipVeOnceliklendirmeCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateKaizenKazancTakipVeOnceliklendirmeCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, currentCostPerUnit: undefined } as unknown as KaizenKazancTakipVeOnceliklendirmeCalculatorInputs;
    const validation = validateKaizenKazancTakipVeOnceliklendirmeCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateKaizenKazancTakipVeOnceliklendirmeCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ currentCostPerUnit: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateKaizenKazancTakipVeOnceliklendirmeCalculatorInputs({ ...defaultInputs, currentCostPerUnit: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateKaizenKazancTakipVeOnceliklendirmeCalculator({ ...defaultInputs, currentCostPerUnit: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ downtimeCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ downtimeCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = KAIZEN_KAZANC_TAKIP_VE_ONCELIKLENDIRME_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateKaizenKazancTakipVeOnceliklendirmeCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
