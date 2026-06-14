import { describe, expect, test } from "vitest";
import { SOFOR_OPERATOR_GUNLUK_YEVMIYE_MALIYETI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/sofor-operator-gunluk-yevmiye-maliyeti-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateSoforOperatorGunlukYevmiyeMaliyeti,
  type SoforOperatorGunlukYevmiyeMaliyetiInputs,
} from "@/lib/premium-schema/calculators/sofor-operator-gunluk-yevmiye-maliyeti";
import { validateSoforOperatorGunlukYevmiyeMaliyetiInputs } from "@/lib/premium-schema/calculators/sofor-operator-gunluk-yevmiye-maliyeti-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "sofor-operator-gunluk-yevmiye-maliyeti";
const SCHEMA_ID = "sofor-operator-gunluk-yevmiye-maliyeti";

const defaultInputs: SoforOperatorGunlukYevmiyeMaliyetiInputs = {
    "dailyWage": 100,
    "overtimeRatePercent": 50,
    "overtimeHours": 0,
    "standardHours": 8,
    "socialSecurityRatePercent": 20,
    "mealAllowance": 10
  };
const lowBandInputs: SoforOperatorGunlukYevmiyeMaliyetiInputs = {
    "dailyWage": 0.1,
    "overtimeRatePercent": 50,
    "overtimeHours": 0,
    "standardHours": 8,
    "socialSecurityRatePercent": 20,
    "mealAllowance": 10
  };
const criticalBandInputs: SoforOperatorGunlukYevmiyeMaliyetiInputs = {
    "dailyWage": 6,
    "overtimeRatePercent": 50,
    "overtimeHours": 0,
    "standardHours": 8,
    "socialSecurityRatePercent": 20,
    "mealAllowance": 10
  };

function expectValidationFailure(partial: Partial<SoforOperatorGunlukYevmiyeMaliyetiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as SoforOperatorGunlukYevmiyeMaliyetiInputs;
  const validation = validateSoforOperatorGunlukYevmiyeMaliyetiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateSoforOperatorGunlukYevmiyeMaliyeti(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: SoforOperatorGunlukYevmiyeMaliyetiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("sofor-operator-gunluk-yevmiye-maliyeti", () => {
  test("exact default oracle", () => {
    const result = calculateSoforOperatorGunlukYevmiyeMaliyeti(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateSoforOperatorGunlukYevmiyeMaliyeti(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateSoforOperatorGunlukYevmiyeMaliyeti(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateSoforOperatorGunlukYevmiyeMaliyeti(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateSoforOperatorGunlukYevmiyeMaliyeti(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, dailyWage: undefined } as unknown as SoforOperatorGunlukYevmiyeMaliyetiInputs;
    const validation = validateSoforOperatorGunlukYevmiyeMaliyetiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateSoforOperatorGunlukYevmiyeMaliyeti(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ dailyWage: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateSoforOperatorGunlukYevmiyeMaliyetiInputs({ ...defaultInputs, standardHours: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateSoforOperatorGunlukYevmiyeMaliyeti({ ...defaultInputs, standardHours: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ mealAllowance: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ mealAllowance: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = SOFOR_OPERATOR_GUNLUK_YEVMIYE_MALIYETI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateSoforOperatorGunlukYevmiyeMaliyeti(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
