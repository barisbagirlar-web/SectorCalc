import { describe, expect, test } from "vitest";
import { KAYNAK_MALIYETI_VE_DOLGU_METALI_TUKETIM_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kaynak-maliyeti-ve-dolgu-metali-tuketim-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateKaynakMaliyetiVeDolguMetaliTuketimCalculator,
  type KaynakMaliyetiVeDolguMetaliTuketimCalculatorInputs,
} from "@/lib/premium-schema/calculators/kaynak-maliyeti-ve-dolgu-metali-tuketim-calculator";
import { validateKaynakMaliyetiVeDolguMetaliTuketimCalculatorInputs } from "@/lib/premium-schema/calculators/kaynak-maliyeti-ve-dolgu-metali-tuketim-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "kaynak-maliyeti-ve-dolgu-metali-tuketim-calculator";
const SCHEMA_ID = "kaynak-maliyeti-ve-dolgu-metali-tuketim-calculator";

const defaultInputs: KaynakMaliyetiVeDolguMetaliTuketimCalculatorInputs = {
    "weldSize": 6,
    "weldLength": 100,
    "numberOfJoints": 1,
    "fillerDensity": 7850,
    "depositionEfficiency": 85,
    "unitCostFiller": 5
  };
const lowBandInputs: KaynakMaliyetiVeDolguMetaliTuketimCalculatorInputs = {
    "weldSize": 1,
    "weldLength": 100,
    "numberOfJoints": 1,
    "fillerDensity": 7850,
    "depositionEfficiency": 85,
    "unitCostFiller": 5
  };
const criticalBandInputs: KaynakMaliyetiVeDolguMetaliTuketimCalculatorInputs = {
    "weldSize": 6,
    "weldLength": 100,
    "numberOfJoints": 1,
    "fillerDensity": 7850,
    "depositionEfficiency": 85,
    "unitCostFiller": 5
  };

function expectValidationFailure(partial: Partial<KaynakMaliyetiVeDolguMetaliTuketimCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as KaynakMaliyetiVeDolguMetaliTuketimCalculatorInputs;
  const validation = validateKaynakMaliyetiVeDolguMetaliTuketimCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateKaynakMaliyetiVeDolguMetaliTuketimCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: KaynakMaliyetiVeDolguMetaliTuketimCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("kaynak-maliyeti-ve-dolgu-metali-tuketim-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateKaynakMaliyetiVeDolguMetaliTuketimCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateKaynakMaliyetiVeDolguMetaliTuketimCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateKaynakMaliyetiVeDolguMetaliTuketimCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateKaynakMaliyetiVeDolguMetaliTuketimCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateKaynakMaliyetiVeDolguMetaliTuketimCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, weldSize: undefined } as unknown as KaynakMaliyetiVeDolguMetaliTuketimCalculatorInputs;
    const validation = validateKaynakMaliyetiVeDolguMetaliTuketimCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateKaynakMaliyetiVeDolguMetaliTuketimCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ weldSize: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateKaynakMaliyetiVeDolguMetaliTuketimCalculatorInputs({ ...defaultInputs, weldSize: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateKaynakMaliyetiVeDolguMetaliTuketimCalculator({ ...defaultInputs, weldSize: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ unitCostFiller: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ unitCostFiller: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = KAYNAK_MALIYETI_VE_DOLGU_METALI_TUKETIM_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateKaynakMaliyetiVeDolguMetaliTuketimCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
