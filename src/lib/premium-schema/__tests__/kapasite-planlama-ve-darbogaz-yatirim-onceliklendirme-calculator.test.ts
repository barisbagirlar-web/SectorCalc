import { describe, expect, test } from "vitest";
import { KAPASITE_PLANLAMA_VE_DARBOGAZ_YATIRIM_ONCELIKLENDIRME_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kapasite-planlama-ve-darbogaz-yatirim-onceliklendirme-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateKapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculator,
  type KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInputs,
} from "@/lib/premium-schema/calculators/kapasite-planlama-ve-darbogaz-yatirim-onceliklendirme-calculator";
import { validateKapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInputs } from "@/lib/premium-schema/calculators/kapasite-planlama-ve-darbogaz-yatirim-onceliklendirme-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "kapasite-planlama-ve-darbogaz-yatirim-onceliklendirme-calculator";
const SCHEMA_ID = "kapasite-planlama-ve-darbogaz-yatirim-onceliklendirme-calculator";

const defaultInputs: KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInputs = {
    "availableHours": 2000,
    "utilizationRate": 85,
    "efficiencyRate": 90,
    "demandQuantity": 1000,
    "bottleneckTimePerUnit": 0.5,
    "sellingPrice": 100
  };
const lowBandInputs: KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInputs = {
    "availableHours": 1,
    "utilizationRate": 85,
    "efficiencyRate": 90,
    "demandQuantity": 1000,
    "bottleneckTimePerUnit": 0.5,
    "sellingPrice": 100
  };
const criticalBandInputs: KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInputs = {
    "availableHours": 6,
    "utilizationRate": 85,
    "efficiencyRate": 90,
    "demandQuantity": 1000,
    "bottleneckTimePerUnit": 0.5,
    "sellingPrice": 100
  };

function expectValidationFailure(partial: Partial<KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInputs;
  const validation = validateKapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateKapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("kapasite-planlama-ve-darbogaz-yatirim-onceliklendirme-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateKapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateKapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateKapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateKapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateKapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, availableHours: undefined } as unknown as KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInputs;
    const validation = validateKapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateKapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ availableHours: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateKapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInputs({ ...defaultInputs, availableHours: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateKapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculator({ ...defaultInputs, availableHours: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ sellingPrice: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ sellingPrice: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = KAPASITE_PLANLAMA_VE_DARBOGAZ_YATIRIM_ONCELIKLENDIRME_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateKapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
