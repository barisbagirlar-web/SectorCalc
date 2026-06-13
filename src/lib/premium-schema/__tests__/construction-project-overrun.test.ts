import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateConstructionProjectOverrun,
  type ConstructionProjectOverrunInputs,
} from "@/lib/premium-schema/calculators/construction-project-overrun";
import { validateConstructionProjectOverrunInputs } from "@/lib/premium-schema/calculators/construction-project-overrun-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "construction-project-overrun";

const defaultInputs: ConstructionProjectOverrunInputs = {
  dailySiteCost: 1250,
  delayDays: 6,
  laborBudget: 28000,
  laborOverrunPercent: 8,
  materialBudget: 46000,
  materialOverrunPercent: 5,
};

function expectValidationFailure(inputs: ConstructionProjectOverrunInputs): void {
  const validation = validateConstructionProjectOverrunInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) {
    return;
  }
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateConstructionProjectOverrun(inputs)).toThrow();
}

describe("construction-project-overrun", () => {
  test("exact default oracle", () => {
    const result = calculateConstructionProjectOverrun(defaultInputs);

    expect(result.delayCost).toBeCloseTo(7500, 2);
    expect(result.laborOverrunCost).toBeCloseTo(2240, 2);
    expect(result.materialOverrunCost).toBeCloseTo(2300, 2);
    expect(result.totalExposure).toBeCloseTo(12040, 2);
    expect(result.summaryLevel).toBe("warning");
    expect(result.primaryDriver).toBe("delayCost");
  });

  test("low threshold when delay days is below 3", () => {
    const result = calculateConstructionProjectOverrun({
      ...defaultInputs,
      delayDays: 2,
    });

    expect(result.summaryLevel).toBe("low");
  });

  test("warning threshold when delay days is between 3 and 10", () => {
    const result = calculateConstructionProjectOverrun(defaultInputs);

    expect(defaultInputs.delayDays).toBeGreaterThanOrEqual(3);
    expect(defaultInputs.delayDays).toBeLessThan(10);
    expect(result.summaryLevel).toBe("warning");
  });

  test("critical threshold when delay days is at or above 10", () => {
    const result = calculateConstructionProjectOverrun({
      ...defaultInputs,
      delayDays: 10,
    });

    expect(result.summaryLevel).toBe("critical");
  });

  test("invalid negative delay days fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, delayDays: -1 });
  });

  test("invalid labor overrun above 100 fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, laborOverrunPercent: 101 });
  });

  test("invalid negative material budget fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, materialBudget: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, dailySiteCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, laborBudget: Number.POSITIVE_INFINITY });
  });

  test("elevated delay days emits warning", () => {
    const result = calculateConstructionProjectOverrun(defaultInputs);

    expect(
      result.warnings.some((warning) => warning.includes("Schedule slip is building")),
    ).toBe(true);
  });

  test("contract metadata matches construction project overrun slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) {
      return;
    }

    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs).toEqual(
      expect.arrayContaining([
        "dailySiteCost",
        "delayDays",
        "laborBudget",
        "laborOverrunPercent",
        "materialBudget",
        "materialOverrunPercent",
      ]),
    );

    const assumptionText = contract.assumptions.join(" ");
    expect(assumptionText).toContain("delayCost");
    expect(assumptionText).toContain("totalExposure");
    expect(assumptionText).toContain("3");
    expect(assumptionText).toContain("10");
  });

  test("engine parity matches dedicated calculator for default schema inputs", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateConstructionProjectOverrun(defaultInputs);

    const engineDelayCost = engineResult.outputs.find((output) => output.id === "delayCost")?.raw;
    const engineTotalExposure = engineResult.outputs.find(
      (output) => output.id === "totalExposure",
    )?.raw;

    expect(engineDelayCost).toBeCloseTo(calculatorResult.delayCost, 2);
    expect(engineTotalExposure).toBeCloseTo(calculatorResult.totalExposure, 2);
  });
});
