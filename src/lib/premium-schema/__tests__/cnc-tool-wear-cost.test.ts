import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateCncToolWearCost,
  type CncToolWearCostInputs,
} from "@/lib/premium-schema/calculators/cnc-tool-wear-cost";
import { validateCncToolWearCostInputs } from "@/lib/premium-schema/calculators/cnc-tool-wear-cost-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "cnc-tool-wear-cost";

const defaultInputs: CncToolWearCostInputs = {
  monthlyToolCost: 3200,
  partsProduced: 4800,
  toolChangeMinutes: 18,
  changesPerMonth: 42,
  hourlyCost: 85,
  coolantCost: 420,
};

function expectValidationFailure(inputs: CncToolWearCostInputs): void {
  const validation = validateCncToolWearCostInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) {
    return;
  }
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateCncToolWearCost(inputs)).toThrow();
}

describe("cnc-tool-wear-cost", () => {
  test("exact default oracle", () => {
    const result = calculateCncToolWearCost(defaultInputs);

    expect(result.toolCostPerPart).toBeCloseTo(0.6667, 2);
    expect(result.toolChangeDowntimeCost).toBeCloseTo(1071, 2);
    expect(result.totalExposure).toBeCloseTo(4691, 2);
    expect(result.summaryLevel).toBe("warning");
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("low threshold when tool cost per part is below 0.5", () => {
    const result = calculateCncToolWearCost({
      monthlyToolCost: 2000,
      partsProduced: 4800,
      toolChangeMinutes: 18,
      changesPerMonth: 42,
      hourlyCost: 85,
      coolantCost: 420,
    });

    expect(result.toolCostPerPart).toBeLessThan(0.5);
    expect(result.summaryLevel).toBe("low");
  });

  test("warning threshold when tool cost per part is between 0.5 and 1.5", () => {
    const result = calculateCncToolWearCost(defaultInputs);

    expect(result.toolCostPerPart).toBeGreaterThanOrEqual(0.5);
    expect(result.toolCostPerPart).toBeLessThan(1.5);
    expect(result.summaryLevel).toBe("warning");
  });

  test("critical threshold when tool cost per part is at or above 1.5", () => {
    const result = calculateCncToolWearCost({
      monthlyToolCost: 8000,
      partsProduced: 4800,
      toolChangeMinutes: 18,
      changesPerMonth: 42,
      hourlyCost: 85,
      coolantCost: 420,
    });

    expect(result.toolCostPerPart).toBeGreaterThanOrEqual(1.5);
    expect(result.summaryLevel).toBe("critical");
  });

  test("invalid zero parts produced fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, partsProduced: 0 });
  });

  test("invalid negative monthly tool cost fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, monthlyToolCost: -1 });
  });

  test("invalid negative tool change minutes fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, toolChangeMinutes: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, hourlyCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, coolantCost: Number.POSITIVE_INFINITY });
  });

  test("elevated per-part tool cost emits warning", () => {
    const result = calculateCncToolWearCost(defaultInputs);

    expect(
      result.warnings.some((warning) => warning.includes("Per-part tool cost is elevated")),
    ).toBe(true);
  });

  test("contract metadata matches cnc tool wear cost slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) {
      return;
    }

    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs).toEqual(
      expect.arrayContaining([
        "monthlyToolCost",
        "partsProduced",
        "toolChangeMinutes",
        "changesPerMonth",
        "hourlyCost",
        "coolantCost",
      ]),
    );

    const assumptionText = contract.assumptions.join(" ");
    expect(assumptionText).toContain("toolCostPerPart");
    expect(assumptionText).toContain("totalExposure");
    expect(assumptionText).toContain("0.5");
    expect(assumptionText).toContain("1.5");
  });

  test("engine parity matches dedicated calculator for default schema inputs", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateCncToolWearCost(defaultInputs);

    const engineToolCostPerPart = engineResult.outputs.find(
      (output) => output.id === "toolCostPerPart",
    )?.raw;
    const engineTotalExposure = engineResult.outputs.find(
      (output) => output.id === "totalExposure",
    )?.raw;

    expect(engineToolCostPerPart).toBeCloseTo(calculatorResult.toolCostPerPart, 2);
    expect(engineTotalExposure).toBeCloseTo(calculatorResult.totalExposure, 2);
  });
});
