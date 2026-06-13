import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateElectricalPanelReworkCost,
  type ElectricalPanelReworkCostInputs,
} from "@/lib/premium-schema/calculators/electrical-panel-rework-cost";
import { validateElectricalPanelReworkCostInputs } from "@/lib/premium-schema/calculators/electrical-panel-rework-cost-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "electrical-panel-rework-cost";

const defaultInputs: ElectricalPanelReworkCostInputs = {
    "panelRevenue": 28000,
    "wiringHours": 120,
    "estimatedHours": 96,
    "laborRate": 48,
    "inspectionFailCost": 1800,
    "testEquipmentCost": 650
  };
const lowBandInputs: ElectricalPanelReworkCostInputs = {
    "panelRevenue": 280,
    "wiringHours": 120,
    "estimatedHours": 96,
    "laborRate": 48,
    "inspectionFailCost": 1800,
    "testEquipmentCost": 650
  };
const criticalBandInputs: ElectricalPanelReworkCostInputs = {
    "panelRevenue": 28000000,
    "wiringHours": 120,
    "estimatedHours": 96,
    "laborRate": 48,
    "inspectionFailCost": 1800,
    "testEquipmentCost": 650
  };

function expectValidationFailure(partial: Partial<ElectricalPanelReworkCostInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as ElectricalPanelReworkCostInputs;
  const validation = validateElectricalPanelReworkCostInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateElectricalPanelReworkCost(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: ElectricalPanelReworkCostInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("electrical-panel-rework-cost", () => {
  test("exact default oracle", () => {
    const result = calculateElectricalPanelReworkCost(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.wiringOverrunCost).toBeCloseTo(engineNumeric(SLUG, "wiringOverrunCost", defaultInputs), 2);
    expect(result.marginPressure).toBeCloseTo(engineNumeric(SLUG, "marginPressure", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("marginPressure");
  });

  test("formula pipeline parity", () => {
    const result = calculateElectricalPanelReworkCost(defaultInputs);
    expect(result.marginPressure).toBeCloseTo(
      engineNumeric(SLUG, "marginPressure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateElectricalPanelReworkCost(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateElectricalPanelReworkCost(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateElectricalPanelReworkCost(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, panelRevenue: undefined } as unknown as ElectricalPanelReworkCostInputs;
    const validation = validateElectricalPanelReworkCostInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateElectricalPanelReworkCost(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ panelRevenue: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateElectricalPanelReworkCostInputs({ ...defaultInputs, panelRevenue: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateElectricalPanelReworkCost({ ...defaultInputs, panelRevenue: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ testEquipmentCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ testEquipmentCost: Number.POSITIVE_INFINITY });
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
    const calculatorResult = calculateElectricalPanelReworkCost(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "wiringOverrunCost")?.raw).toBeCloseTo(calculatorResult.wiringOverrunCost, 2);
    expect(engineResult.outputs.find((output) => output.id === "marginPressure")?.raw).toBeCloseTo(calculatorResult.marginPressure, 2);
  });
});
