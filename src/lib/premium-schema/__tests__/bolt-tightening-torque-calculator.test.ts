import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateBoltTighteningTorqueCalculator,
  type BoltTighteningTorqueCalculatorInputs,
} from "@/lib/premium-schema/calculators/bolt-tightening-torque-calculator";
import { validateBoltTighteningTorqueCalculatorInputs } from "@/lib/premium-schema/calculators/bolt-tightening-torque-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "bolt-tightening-torque-calculator";

const defaultInputs: BoltTighteningTorqueCalculatorInputs = {
    "clampForceKn": 45,
    "boltDiameterMm": 16,
    "frictionFactor": 0.2
  };
const lowBandInputs: BoltTighteningTorqueCalculatorInputs = {
    "clampForceKn": 0.45,
    "boltDiameterMm": 16,
    "frictionFactor": 0.2
  };
const criticalBandInputs: BoltTighteningTorqueCalculatorInputs = {
    "clampForceKn": 45000,
    "boltDiameterMm": 16,
    "frictionFactor": 0.2
  };

function expectValidationFailure(partial: Partial<BoltTighteningTorqueCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as BoltTighteningTorqueCalculatorInputs;
  const validation = validateBoltTighteningTorqueCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateBoltTighteningTorqueCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: BoltTighteningTorqueCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("bolt-tightening-torque-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateBoltTighteningTorqueCalculator(defaultInputs);
    expect(result.torqueNm).toBeCloseTo(engineNumeric(SLUG, "torqueNm", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("torqueNm");
  });

  test("formula pipeline parity", () => {
    const result = calculateBoltTighteningTorqueCalculator(defaultInputs);
    expect(result.torqueNm).toBeCloseTo(
      engineNumeric(SLUG, "torqueNm", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateBoltTighteningTorqueCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateBoltTighteningTorqueCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateBoltTighteningTorqueCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, clampForceKn: undefined } as unknown as BoltTighteningTorqueCalculatorInputs;
    const validation = validateBoltTighteningTorqueCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateBoltTighteningTorqueCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ clampForceKn: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateBoltTighteningTorqueCalculatorInputs({ ...defaultInputs, clampForceKn: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateBoltTighteningTorqueCalculator({ ...defaultInputs, clampForceKn: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ frictionFactor: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ frictionFactor: Number.POSITIVE_INFINITY });
  });

  test("contract metadata matches slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) return;
    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs.length).toBeGreaterThan(0);
    expect(contract.assumptions.join(" ")).toContain("deterministic");
  });

  test("engine parity test", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) return;
    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateBoltTighteningTorqueCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "torqueNm")?.raw).toBeCloseTo(calculatorResult.torqueNm, 2);
  });
});
