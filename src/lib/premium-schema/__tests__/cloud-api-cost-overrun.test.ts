import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateCloudApiCostOverrun,
  type CloudApiCostOverrunInputs,
} from "@/lib/premium-schema/calculators/cloud-api-cost-overrun";
import { validateCloudApiCostOverrunInputs } from "@/lib/premium-schema/calculators/cloud-api-cost-overrun-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "cloud-api-cost-overrun";

const defaultInputs: CloudApiCostOverrunInputs = {
  monthlyApiCalls: 2500000,
  costPerThousandCalls: 0.18,
  monthlyRevenue: 12000,
  computeCost: 1800,
  storageCost: 420,
};

function expectValidationFailure(inputs: CloudApiCostOverrunInputs): void {
  const validation = validateCloudApiCostOverrunInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) {
    return;
  }
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateCloudApiCostOverrun(inputs)).toThrow();
}

describe("cloud-api-cost-overrun", () => {
  test("exact default oracle", () => {
    const result = calculateCloudApiCostOverrun(defaultInputs);

    expect(result.apiCallCost).toBeCloseTo(450, 2);
    expect(result.totalCloudCost).toBeCloseTo(2670, 2);
    expect(result.revenuePressure).toBeCloseTo(22.25, 2);
    expect(result.summaryLevel).toBe("warning");
  });

  test("low threshold when revenue pressure is below 15", () => {
    const result = calculateCloudApiCostOverrun({
      monthlyApiCalls: 100000,
      costPerThousandCalls: 0.1,
      monthlyRevenue: 50000,
      computeCost: 500,
      storageCost: 100,
    });

    expect(result.revenuePressure).toBeLessThan(15);
    expect(result.summaryLevel).toBe("low");
  });

  test("warning threshold when revenue pressure is between 15 and 30", () => {
    const result = calculateCloudApiCostOverrun(defaultInputs);

    expect(result.revenuePressure).toBeGreaterThanOrEqual(15);
    expect(result.revenuePressure).toBeLessThan(30);
    expect(result.summaryLevel).toBe("warning");
  });

  test("critical threshold when revenue pressure is at or above 30", () => {
    const result = calculateCloudApiCostOverrun({
      monthlyApiCalls: 5000000,
      costPerThousandCalls: 0.2,
      monthlyRevenue: 10000,
      computeCost: 2000,
      storageCost: 800,
    });

    expect(result.revenuePressure).toBeGreaterThanOrEqual(30);
    expect(result.summaryLevel).toBe("critical");
  });

  test("invalid zero revenue fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, monthlyRevenue: 0 });
  });

  test("invalid negative compute cost fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, computeCost: -1 });
  });

  test("invalid negative API calls fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, monthlyApiCalls: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, storageCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, costPerThousandCalls: Number.POSITIVE_INFINITY });
  });

  test("elevated revenue pressure emits warning", () => {
    const result = calculateCloudApiCostOverrun(defaultInputs);

    expect(
      result.warnings.some((warning) => warning.includes("rising share of revenue")),
    ).toBe(true);
  });

  test("contract metadata matches cloud api cost overrun slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) {
      return;
    }

    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs).toEqual(
      expect.arrayContaining([
        "monthlyApiCalls",
        "costPerThousandCalls",
        "monthlyRevenue",
        "computeCost",
        "storageCost",
      ]),
    );

    const assumptionText = contract.assumptions.join(" ");
    expect(assumptionText).toContain("totalCloudCost");
    expect(assumptionText).toContain("revenuePressure");
    expect(assumptionText).toContain("15");
    expect(assumptionText).toContain("30");
  });

  test("engine parity matches dedicated calculator for default schema inputs", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateCloudApiCostOverrun(defaultInputs);

    const engineTotalCloudCost = engineResult.outputs.find(
      (output) => output.id === "totalCloudCost",
    )?.raw;
    const engineRevenuePressure = engineResult.outputs.find(
      (output) => output.id === "revenuePressure",
    )?.raw;

    expect(engineTotalCloudCost).toBeCloseTo(calculatorResult.totalCloudCost, 2);
    expect(engineRevenuePressure).toBeCloseTo(calculatorResult.revenuePressure, 2);
  });
});
