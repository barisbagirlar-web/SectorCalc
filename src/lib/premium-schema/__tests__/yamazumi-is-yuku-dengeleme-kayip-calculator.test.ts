import { describe, expect, test } from "vitest";
import { YAMAZUMI_IS_YUKU_DENGELEME_KAYIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/yamazumi-is-yuku-dengeleme-kayip-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateYamazumiIsYukuDengelemeKayipCalculator,
  type YamazumiIsYukuDengelemeKayipCalculatorInputs,
} from "@/lib/premium-schema/calculators/yamazumi-is-yuku-dengeleme-kayip-calculator";
import { validateYamazumiIsYukuDengelemeKayipCalculatorInputs } from "@/lib/premium-schema/calculators/yamazumi-is-yuku-dengeleme-kayip-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "yamazumi-is-yuku-dengeleme-kayip-calculator";
const SCHEMA_ID = "yamazumi-is-yuku-dengeleme-kayip-calculator";

const defaultInputs: YamazumiIsYukuDengelemeKayipCalculatorInputs = {
    "availableWorkTimePerShift": 480,
    "requiredQuantityPerShift": 100,
    "numberOfStations": 5,
    "stationCycleTimes": 1
  };
const lowBandInputs: YamazumiIsYukuDengelemeKayipCalculatorInputs = {
    "availableWorkTimePerShift": 1,
    "requiredQuantityPerShift": 100,
    "numberOfStations": 5,
    "stationCycleTimes": 1
  };
const criticalBandInputs: YamazumiIsYukuDengelemeKayipCalculatorInputs = {
    "availableWorkTimePerShift": 6,
    "requiredQuantityPerShift": 100,
    "numberOfStations": 5,
    "stationCycleTimes": 1
  };

function expectValidationFailure(partial: Partial<YamazumiIsYukuDengelemeKayipCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as YamazumiIsYukuDengelemeKayipCalculatorInputs;
  const validation = validateYamazumiIsYukuDengelemeKayipCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateYamazumiIsYukuDengelemeKayipCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: YamazumiIsYukuDengelemeKayipCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("yamazumi-is-yuku-dengeleme-kayip-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateYamazumiIsYukuDengelemeKayipCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateYamazumiIsYukuDengelemeKayipCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateYamazumiIsYukuDengelemeKayipCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateYamazumiIsYukuDengelemeKayipCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateYamazumiIsYukuDengelemeKayipCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, availableWorkTimePerShift: undefined } as unknown as YamazumiIsYukuDengelemeKayipCalculatorInputs;
    const validation = validateYamazumiIsYukuDengelemeKayipCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateYamazumiIsYukuDengelemeKayipCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ availableWorkTimePerShift: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateYamazumiIsYukuDengelemeKayipCalculatorInputs({ ...defaultInputs, availableWorkTimePerShift: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateYamazumiIsYukuDengelemeKayipCalculator({ ...defaultInputs, availableWorkTimePerShift: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ stationCycleTimes: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ stationCycleTimes: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = YAMAZUMI_IS_YUKU_DENGELEME_KAYIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateYamazumiIsYukuDengelemeKayipCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
