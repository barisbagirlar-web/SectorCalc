import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateWarehouseSpaceCostLeak,
  type WarehouseSpaceCostLeakInputs,
} from "@/lib/premium-schema/calculators/warehouse-space-cost-leak";
import { validateWarehouseSpaceCostLeakInputs } from "@/lib/premium-schema/calculators/warehouse-space-cost-leak-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "warehouse-space-cost-leak";
const PAID_ROUTE_SLUG = "office-cleaning-bid-optimizer";

const defaultInputs: WarehouseSpaceCostLeakInputs = {
  monthlyRent: 24000,
  totalSqm: 2400,
  unusedSpacePercent: 14,
  handlingOverrunHours: 60,
  hourlyCost: 24,
};

function expectValidationFailure(inputs: WarehouseSpaceCostLeakInputs): void {
  const validation = validateWarehouseSpaceCostLeakInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) {
    return;
  }
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateWarehouseSpaceCostLeak(inputs)).toThrow();
}

describe("warehouse-space-cost-leak", () => {
  test("exact default oracle", () => {
    const result = calculateWarehouseSpaceCostLeak(defaultInputs);

    expect(result.unusedSpaceCost).toBeCloseTo(3360, 2);
    expect(result.handlingOverrunCost).toBeCloseTo(1440, 2);
    expect(result.totalExposure).toBeCloseTo(4800, 2);
    expect(result.summaryLevel).toBe("warning");
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("low threshold when unused space percent is below 10 percent", () => {
    const result = calculateWarehouseSpaceCostLeak({
      ...defaultInputs,
      unusedSpacePercent: 5,
    });

    expect(result.summaryLevel).toBe("low");
  });

  test("warning threshold when unused space percent is between 10 and 20 percent", () => {
    const result = calculateWarehouseSpaceCostLeak(defaultInputs);

    expect(defaultInputs.unusedSpacePercent).toBeGreaterThanOrEqual(10);
    expect(defaultInputs.unusedSpacePercent).toBeLessThan(20);
    expect(result.summaryLevel).toBe("warning");
  });

  test("critical threshold when unused space percent is at or above 20 percent", () => {
    const result = calculateWarehouseSpaceCostLeak({
      ...defaultInputs,
      unusedSpacePercent: 22,
    });

    expect(result.summaryLevel).toBe("critical");
  });

  test("invalid total sqm below 1 fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, totalSqm: 0 });
  });

  test("invalid unused space above 100 fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, unusedSpacePercent: 101 });
  });

  test("invalid negative monthly rent fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, monthlyRent: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, hourlyCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, handlingOverrunHours: Number.POSITIVE_INFINITY });
  });

  test("elevated unused space emits warning", () => {
    const result = calculateWarehouseSpaceCostLeak(defaultInputs);

    expect(
      result.warnings.some((warning) => warning.includes("Unused space is above typical band")),
    ).toBe(true);
  });

  test("contract metadata matches warehouse space cost leak slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) {
      return;
    }

    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs).toEqual(
      expect.arrayContaining([
        "monthlyRent",
        "totalSqm",
        "unusedSpacePercent",
        "handlingOverrunHours",
        "hourlyCost",
      ]),
    );

    const assumptionText = contract.assumptions.join(" ");
    expect(assumptionText).toContain("totalExposure");
    expect(assumptionText).toContain("unusedSpacePercent");
    expect(assumptionText).toContain("10");
    expect(assumptionText).toContain("20");
  });

  test("engine parity matches dedicated calculator for default schema inputs", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateWarehouseSpaceCostLeak(defaultInputs);

    const engineTotalExposure = engineResult.outputs.find(
      (output) => output.id === "totalExposure",
    )?.raw;
    const engineUnusedSpaceCost = engineResult.outputs.find(
      (output) => output.id === "unusedSpaceCost",
    )?.raw;

    expect(engineTotalExposure).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineUnusedSpaceCost).toBeCloseTo(calculatorResult.unusedSpaceCost, 2);
  });
});
