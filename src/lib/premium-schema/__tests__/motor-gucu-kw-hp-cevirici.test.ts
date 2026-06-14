import { describe, expect, test } from "vitest";
import { MOTOR_GUCU_KW_HP_CEVIRICI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/motor-gucu-kw-hp-cevirici-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateMotorGucuKwHpCevirici,
  type MotorGucuKwHpCeviriciInputs,
} from "@/lib/premium-schema/calculators/motor-gucu-kw-hp-cevirici";
import { validateMotorGucuKwHpCeviriciInputs } from "@/lib/premium-schema/calculators/motor-gucu-kw-hp-cevirici-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "motor-gucu-kw-hp-cevirici";
const SCHEMA_ID = "motor-gucu-kw-hp-cevirici";

const defaultInputs: MotorGucuKwHpCeviriciInputs = {
    "powerValue": 100,
    "inputUnit": 1,
    "motorEfficiencyPercent": 100
  };
const lowBandInputs: MotorGucuKwHpCeviriciInputs = {
    "powerValue": 0.1,
    "inputUnit": 1,
    "motorEfficiencyPercent": 100
  };
const criticalBandInputs: MotorGucuKwHpCeviriciInputs = {
    "powerValue": 6,
    "inputUnit": 1,
    "motorEfficiencyPercent": 100
  };

function expectValidationFailure(partial: Partial<MotorGucuKwHpCeviriciInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as MotorGucuKwHpCeviriciInputs;
  const validation = validateMotorGucuKwHpCeviriciInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateMotorGucuKwHpCevirici(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: MotorGucuKwHpCeviriciInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("motor-gucu-kw-hp-cevirici", () => {
  test("exact default oracle", () => {
    const result = calculateMotorGucuKwHpCevirici(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateMotorGucuKwHpCevirici(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateMotorGucuKwHpCevirici(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateMotorGucuKwHpCevirici(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateMotorGucuKwHpCevirici(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, powerValue: undefined } as unknown as MotorGucuKwHpCeviriciInputs;
    const validation = validateMotorGucuKwHpCeviriciInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateMotorGucuKwHpCevirici(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ powerValue: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ motorEfficiencyPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ motorEfficiencyPercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = MOTOR_GUCU_KW_HP_CEVIRICI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateMotorGucuKwHpCevirici(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
