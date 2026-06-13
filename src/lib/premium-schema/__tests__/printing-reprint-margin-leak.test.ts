import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculatePrintingReprintMarginLeak,
  type PrintingReprintMarginLeakInputs,
} from "@/lib/premium-schema/calculators/printing-reprint-margin-leak";
import { validatePrintingReprintMarginLeakInputs } from "@/lib/premium-schema/calculators/printing-reprint-margin-leak-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "printing-reprint-margin-leak";
const PAID_ROUTE_SLUG = "signage-bid-safe-price-tool";

const defaultInputs: PrintingReprintMarginLeakInputs = {
  jobRevenue: 8500,
  materialCost: 2600,
  reprintRatePercent: 7,
  designRevisionHours: 9,
  laborRate: 35,
  installReworkCost: 750,
};

function expectValidationFailure(inputs: PrintingReprintMarginLeakInputs): void {
  const validation = validatePrintingReprintMarginLeakInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) {
    return;
  }
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculatePrintingReprintMarginLeak(inputs)).toThrow();
}

describe("printing-reprint-margin-leak", () => {
  test("exact default oracle", () => {
    const result = calculatePrintingReprintMarginLeak(defaultInputs);

    expect(result.reprintCost).toBeCloseTo(182, 2);
    expect(result.revisionCost).toBeCloseTo(315, 2);
    expect(result.totalExposure).toBeCloseTo(1247, 2);
    expect(result.marginPressure).toBeCloseTo(14.6706, 2);
    expect(result.summaryLevel).toBe("critical");
    expect(result.primaryDriver).toBe("marginPressure");
  });

  test("low threshold when margin pressure is below 5 percent", () => {
    const result = calculatePrintingReprintMarginLeak({
      jobRevenue: 50000,
      materialCost: 2000,
      reprintRatePercent: 3,
      designRevisionHours: 2,
      laborRate: 35,
      installReworkCost: 200,
    });

    expect(result.marginPressure).toBeLessThan(5);
    expect(result.summaryLevel).toBe("low");
  });

  test("warning threshold when margin pressure is between 5 and 12 percent", () => {
    const result = calculatePrintingReprintMarginLeak({
      jobRevenue: 15000,
      materialCost: 2600,
      reprintRatePercent: 6,
      designRevisionHours: 8,
      laborRate: 35,
      installReworkCost: 500,
    });

    expect(result.marginPressure).toBeGreaterThanOrEqual(5);
    expect(result.marginPressure).toBeLessThan(12);
    expect(result.summaryLevel).toBe("warning");
  });

  test("critical threshold when margin pressure is at or above 12 percent", () => {
    const result = calculatePrintingReprintMarginLeak(defaultInputs);

    expect(result.marginPressure).toBeGreaterThanOrEqual(12);
    expect(result.summaryLevel).toBe("critical");
  });

  test("invalid zero job revenue fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, jobRevenue: 0 });
  });

  test("invalid reprint rate above 100 fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, reprintRatePercent: 101 });
  });

  test("invalid negative install rework cost fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, installReworkCost: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, laborRate: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, designRevisionHours: Number.POSITIVE_INFINITY });
  });

  test("elevated reprint rate emits warning", () => {
    const result = calculatePrintingReprintMarginLeak(defaultInputs);

    expect(
      result.warnings.some((warning) => warning.includes("Reprint rate is elevated")),
    ).toBe(true);
  });

  test("contract metadata matches printing reprint margin leak slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) {
      return;
    }

    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs).toEqual(
      expect.arrayContaining([
        "jobRevenue",
        "materialCost",
        "reprintRatePercent",
        "designRevisionHours",
        "laborRate",
        "installReworkCost",
      ]),
    );

    const assumptionText = contract.assumptions.join(" ");
    expect(assumptionText).toContain("marginPressure");
    expect(assumptionText).toContain("totalExposure");
    expect(assumptionText).toContain("5");
    expect(assumptionText).toContain("12");
  });

  test("engine parity matches dedicated calculator for default schema inputs", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculatePrintingReprintMarginLeak(defaultInputs);

    const engineMarginPressure = engineResult.outputs.find(
      (output) => output.id === "marginPressure",
    )?.raw;
    const engineTotalExposure = engineResult.outputs.find(
      (output) => output.id === "totalExposure",
    )?.raw;

    expect(engineMarginPressure).toBeCloseTo(calculatorResult.marginPressure, 2);
    expect(engineTotalExposure).toBeCloseTo(calculatorResult.totalExposure, 2);
  });
});
