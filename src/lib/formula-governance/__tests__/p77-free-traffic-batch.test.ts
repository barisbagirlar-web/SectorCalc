import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { runFreeFullLoopCalculation } from "@/lib/formula-governance/runtime-validation/free-full-loop-bridge";
import { validateSmartFormFieldValues } from "@/lib/formula-governance/runtime-validation/smart-form-contract-adapter";
import { hasFormulaSourceAudit } from "@/lib/formula-governance/formula-source-audit-registry";
import { calculateFreeTrafficTool } from "@/lib/tools/free-traffic-calculators";
import {
  calculateHomeRenovationM2Check,
  calculateKwhConsumptionCheck,
  calculatePaintCoverageCostCheck,
  calculatePlumbingFixtureCostCheck,
  P77_BATCH_B_FREE_SLUGS,
} from "@/lib/tools/p77-batch-b-free-calculators";
import { getRevenueToolByFreeSlug } from "@/lib/tools/revenue-tools";
import { calculateExtendedFreeResult } from "@/lib/tools/free-sector-calculations";
import { OracleValidationError } from "@/lib/formula-governance/oracle/oracle-types";

const P77_FREE_SLUGS = [
  "area-converter",
  "length-converter",
  "temperature-converter",
  "volume-converter",
  "weight-converter",
  "ratio-calculator",
  ...P77_BATCH_B_FREE_SLUGS,
] as const;

const BATCH_B_FIXTURES = {
  "kwh-consumption-check": {
    powerKw: 10,
    hoursPerDay: 8,
    days: 30,
    tariffPerKwh: 0.15,
  },
  "paint-coverage-cost-check": {
    paintableArea: 100,
    coveragePerUnit: 10,
    coats: 2,
    unitPrice: 25,
    wasteAllowancePct: 10,
  },
  "plumbing-fixture-cost-check": {
    fixtureCount: 3,
    unitMaterialCost: 200,
    laborHoursPerFixture: 2,
    laborRate: 75,
    overheadPct: 15,
  },
  "home-renovation-m2": {
    areaM2: 80,
    unitCostPerM2: 500,
    demolitionCost: 2000,
    contingencyPct: 10,
  },
} as const;

describe("p77-free-traffic-batch", () => {
  test.each(P77_FREE_SLUGS)("%s has FormulaContract metadata", (slug) => {
    const contract = getFormulaContractBySlug(slug);
    expect(contract).not.toBeNull();
    expect(contract?.slug).toBe(slug);
    expect(contract?.formulaSummary.length).toBeGreaterThan(10);
  });

  test("length-converter produces finite meter conversion", () => {
    const result = calculateFreeTrafficTool("length-converter", {
      value: 1,
      fromUnit: "m",
      toUnit: "ft",
    });
    expect(result.primaryValue).toMatch(/1(\.|,)?\s?0*\s?m/);
  });

  test("temperature-converter normalizes to Celsius", () => {
    const result = calculateFreeTrafficTool("temperature-converter", {
      value: 32,
      fromUnit: "fahrenheit",
      toUnit: "celsius",
    });
    expect(result.primaryValue).toMatch(/0(\.|,)?\s?0*\s?°C/);
  });
});

describe("p77 batch B production calculators", () => {
  test("kwh-consumption-check exact oracle", () => {
    const result = calculateKwhConsumptionCheck(BATCH_B_FIXTURES["kwh-consumption-check"]);
    expect(result.dailyKwh).toBe(80);
    expect(result.periodKwh).toBe(2400);
    expect(result.energyCost).toBe(360);
    expect(result.recommendedPrice).toBe(360);
  });

  test("paint-coverage-cost-check exact oracle", () => {
    const result = calculatePaintCoverageCostCheck(BATCH_B_FIXTURES["paint-coverage-cost-check"]);
    expect(result.requiredUnits).toBe(22);
    expect(result.paintCost).toBe(550);
  });

  test("plumbing-fixture-cost-check exact oracle", () => {
    const result = calculatePlumbingFixtureCostCheck(BATCH_B_FIXTURES["plumbing-fixture-cost-check"]);
    expect(result.materialCost).toBe(600);
    expect(result.laborCost).toBe(450);
    expect(result.totalCost).toBe(1207.5);
  });

  test("home-renovation-m2 exact oracle", () => {
    const result = calculateHomeRenovationM2Check(BATCH_B_FIXTURES["home-renovation-m2"]);
    expect(result.baseCost).toBe(40000);
    expect(result.totalEstimatedCost).toBe(46200);
  });

  test.each(P77_BATCH_B_FREE_SLUGS)("%s rejects negative inputs", (slug) => {
    const fixture = { ...BATCH_B_FIXTURES[slug] };
    const firstKey = Object.keys(fixture)[0] as keyof typeof fixture;
    const negativeFixture = { ...fixture, [firstKey]: -1 };
    expect(() => {
      switch (slug) {
        case "kwh-consumption-check":
          calculateKwhConsumptionCheck(negativeFixture);
          break;
        case "paint-coverage-cost-check":
          calculatePaintCoverageCostCheck(negativeFixture);
          break;
        case "plumbing-fixture-cost-check":
          calculatePlumbingFixtureCostCheck(negativeFixture);
          break;
        case "home-renovation-m2":
          calculateHomeRenovationM2Check(negativeFixture);
          break;
      }
    }).toThrow(OracleValidationError);
  });

  test.each(P77_BATCH_B_FREE_SLUGS)("%s rejects zero divisor where applicable", (slug) => {
    const zeroKey =
      slug === "kwh-consumption-check"
        ? "days"
        : slug === "paint-coverage-cost-check"
          ? "coveragePerUnit"
          : slug === "plumbing-fixture-cost-check"
            ? "fixtureCount"
            : "areaM2";
    const fixture = { ...BATCH_B_FIXTURES[slug], [zeroKey]: 0 };
    expect(() => {
      switch (slug) {
        case "kwh-consumption-check":
          calculateKwhConsumptionCheck(fixture);
          break;
        case "paint-coverage-cost-check":
          calculatePaintCoverageCostCheck(fixture);
          break;
        case "plumbing-fixture-cost-check":
          calculatePlumbingFixtureCostCheck(fixture);
          break;
        case "home-renovation-m2":
          calculateHomeRenovationM2Check(fixture);
          break;
      }
    }).toThrow(OracleValidationError);
  });
});

describe("p77 batch B revenue route wiring", () => {
  test.each(P77_BATCH_B_FREE_SLUGS)("%s revenue tool resolves and calculates", (slug) => {
    const tool = getRevenueToolByFreeSlug(slug);
    expect(tool).not.toBeNull();
    expect(tool?.freeSlug).toBe(slug);

    const fixture = BATCH_B_FIXTURES[slug];
    const result = calculateExtendedFreeResult(tool!, fixture);
    expect(result).not.toBeNull();
    expect(result?.headline.length).toBeGreaterThan(5);
    expect(result?.summary.length).toBeGreaterThan(5);
  });

  test.each(P77_BATCH_B_FREE_SLUGS)("%s full-loop runtime succeeds with valid inputs", (slug) => {
    const loop = runFreeFullLoopCalculation(slug, BATCH_B_FIXTURES[slug]);
    expect(loop.status).toBe("success");
    if (loop.status === "success") {
      expect(loop.revenueResult?.headline).toBeTruthy();
    }
  });

  test.each(P77_BATCH_B_FREE_SLUGS)("%s blocks missing required inputs", (slug) => {
    const loop = runFreeFullLoopCalculation(slug, {});
    expect(loop.status).toBe("blocked");
  });

  test.each(P77_BATCH_B_FREE_SLUGS)("%s smart form validation catches empty required field", (slug) => {
    const errors = validateSmartFormFieldValues(slug, {}, "en");
    expect(Object.keys(errors).length).toBeGreaterThan(0);
  });

  test.each(P77_BATCH_B_FREE_SLUGS)("%s has Formula Gate verified badge registry entry", (slug) => {
    expect(hasFormulaSourceAudit(slug)).toBe(true);
  });
});
