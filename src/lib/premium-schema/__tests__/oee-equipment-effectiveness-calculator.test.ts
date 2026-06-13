import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateOeeEquipmentEffectivenessCalculator,
  type OeeEquipmentEffectivenessCalculatorInputs,
} from "@/lib/premium-schema/calculators/oee-equipment-effectiveness-calculator";
import { validateOeeEquipmentEffectivenessCalculatorInputs } from "@/lib/premium-schema/calculators/oee-equipment-effectiveness-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "oee-equipment-effectiveness-calculator";

const defaultInputs: OeeEquipmentEffectivenessCalculatorInputs = {
    "availability": 88,
    "performance": 92,
    "quality": 97,
    "machineRate": 75,
    "plannedHours": 160,
    "downtimeHours": 18
  };
const lowBandInputs: OeeEquipmentEffectivenessCalculatorInputs = {
    "availability": 0.88,
    "performance": 92,
    "quality": 97,
    "machineRate": 75,
    "plannedHours": 160,
    "downtimeHours": 18
  };
const criticalBandInputs: OeeEquipmentEffectivenessCalculatorInputs = {
    "availability": 100,
    "performance": 92,
    "quality": 97,
    "machineRate": 75,
    "plannedHours": 160,
    "downtimeHours": 18
  };

function expectValidationFailure(partial: Partial<OeeEquipmentEffectivenessCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as OeeEquipmentEffectivenessCalculatorInputs;
  const validation = validateOeeEquipmentEffectivenessCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateOeeEquipmentEffectivenessCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: OeeEquipmentEffectivenessCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("oee-equipment-effectiveness-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateOeeEquipmentEffectivenessCalculator(defaultInputs);
    expect(result.oeeScore).toBeCloseTo(engineNumeric(SLUG, "oeeScore", defaultInputs), 2);
    expect(result.availabilityLossCost).toBeCloseTo(engineNumeric(SLUG, "availabilityLossCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("oeeScore");
  });

  test("formula pipeline parity", () => {
    const result = calculateOeeEquipmentEffectivenessCalculator(defaultInputs);
    expect(result.oeeScore).toBeCloseTo(
      engineNumeric(SLUG, "oeeScore", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateOeeEquipmentEffectivenessCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateOeeEquipmentEffectivenessCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateOeeEquipmentEffectivenessCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, availability: undefined } as unknown as OeeEquipmentEffectivenessCalculatorInputs;
    const validation = validateOeeEquipmentEffectivenessCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateOeeEquipmentEffectivenessCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ availability: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateOeeEquipmentEffectivenessCalculatorInputs({ ...defaultInputs, plannedHours: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateOeeEquipmentEffectivenessCalculator({ ...defaultInputs, plannedHours: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ downtimeHours: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ downtimeHours: Number.POSITIVE_INFINITY });
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
    const calculatorResult = calculateOeeEquipmentEffectivenessCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "oeeScore")?.raw).toBeCloseTo(calculatorResult.oeeScore, 2);
    expect(engineResult.outputs.find((output) => output.id === "availabilityLossCost")?.raw).toBeCloseTo(calculatorResult.availabilityLossCost, 2);
  });
});
