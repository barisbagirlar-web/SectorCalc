import { describe, expect, test } from "vitest";
import { THREE_D_PRINT_JOB_MARGIN_TOOL_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/3d-print-job-margin-tool-critical";
import {
  ThreeDPrintJobMarginToolCalculator,
  computeThreeDPrintJobMarginCore,
  type ThreeDPrintJobMarginToolInputs,
} from "@/lib/premium-schema/calculators/3d-print-job-margin-tool";
import { validateThreeDPrintJobMarginToolInputs } from "@/lib/premium-schema/calculators/3d-print-job-margin-tool-validation";

const SLUG = "3d-print-job-margin-tool";

const lowScrapInputs: ThreeDPrintJobMarginToolInputs = {
  materialCost: 25,
  machineTimeHours: 3,
  machineHourlyRate: 15,
  laborHours: 0.5,
  laborHourlyRate: 20,
  electricityCost: 4,
  postProcessingCost: 5,
  failureScrapRatePercent: 5,
  overheadPercent: 10,
  targetMarginPercent: 25,
};

const highScrapInputs: ThreeDPrintJobMarginToolInputs = {
  ...lowScrapInputs,
  failureScrapRatePercent: 40,
};

const overheadPostProcessInputs: ThreeDPrintJobMarginToolInputs = {
  ...lowScrapInputs,
  postProcessingCost: 35,
  overheadPercent: 45,
};

function expectValidationFailure(partial: Partial<ThreeDPrintJobMarginToolInputs>): void {
  const inputs = { ...lowScrapInputs, ...partial } as ThreeDPrintJobMarginToolInputs;
  const validation = validateThreeDPrintJobMarginToolInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => ThreeDPrintJobMarginToolCalculator(inputs)).toThrow();
}

describe("3d-print-job-margin-tool", () => {
  test("oracle case 1 — simple low scrap", () => {
    const core = computeThreeDPrintJobMarginCore(lowScrapInputs);
    expect(core.baseCost).toBeCloseTo(89, 2);
    expect(core.scrapCost).toBeCloseTo(4.45, 2);
    expect(core.overheadCost).toBeCloseTo(8.9, 2);
    expect(core.totalCost).toBeCloseTo(102.35, 2);
    expect(core.quotePrice).toBeCloseTo(136.47, 2);
    expect(core.grossProfit).toBeCloseTo(34.12, 2);
    expect(core.grossMarginPercent).toBeCloseTo(25, 2);

    const result = ThreeDPrintJobMarginToolCalculator(lowScrapInputs);
    expect(result.summaryLevel).toBe("low");
    expect(result.primaryDriver).toBe("quotePrice");
    expect(Number.isFinite(result.quotePrice)).toBe(true);
  });

  test("oracle case 2 — high scrap impact", () => {
    const core = computeThreeDPrintJobMarginCore(highScrapInputs);
    expect(core.totalCost).toBeCloseTo(133.5, 2);
    expect(core.quotePrice).toBeCloseTo(178, 2);

    const result = ThreeDPrintJobMarginToolCalculator(highScrapInputs);
    expect(result.summaryLevel).toBe("critical");
    expect(result.quotePrice).toBeGreaterThan(
      ThreeDPrintJobMarginToolCalculator(lowScrapInputs).quotePrice,
    );
  });

  test("oracle case 3 — overhead and post-processing uplift", () => {
    const core = computeThreeDPrintJobMarginCore(overheadPostProcessInputs);
    expect(core.baseCost).toBeCloseTo(119, 2);
    expect(core.overheadCost).toBeCloseTo(53.55, 2);
    expect(core.totalCost).toBeCloseTo(178.5, 2);
    expect(core.quotePrice).toBeCloseTo(238, 2);

    const result = ThreeDPrintJobMarginToolCalculator(overheadPostProcessInputs);
    expect(result.summaryLevel).toBe("low");
    expect(result.quotePrice).toBeGreaterThan(
      ThreeDPrintJobMarginToolCalculator(lowScrapInputs).quotePrice,
    );
  });

  test("invalid negative cost fails validation and calculator throws", () => {
    expectValidationFailure({ materialCost: -1 });
  });

  test("invalid scrap rate fails validation and calculator throws", () => {
    expectValidationFailure({ failureScrapRatePercent: 90 });
  });

  test("invalid target margin fails validation and calculator throws", () => {
    expectValidationFailure({ targetMarginPercent: 0 });
  });

  test("contract metadata matches slug", () => {
    const contract = THREE_D_PRINT_JOB_MARGIN_TOOL_CRITICAL_FORMULA_CONTRACTS[0];
    expect(contract).toBeDefined();
    if (!contract) return;
    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs.length).toBeGreaterThan(0);
    expect(contract.assumptions.join(" ")).toContain("deterministic");
  });
});
