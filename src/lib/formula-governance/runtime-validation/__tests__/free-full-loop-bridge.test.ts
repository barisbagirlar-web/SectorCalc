/**
 * Free full-loop runtime bridge tests — traffic catalog + aligned revenue free tools.
 */

import { describe, expect, test } from "vitest";
import {
  runFreeFullLoopCalculation,
  sanitizeFreeCanonicalInputs,
} from "@/lib/formula-governance/runtime-validation/free-full-loop-bridge";
import {
  FREE_FULL_LOOP_RUNTIME_SLUGS,
  isFreeFullLoopRuntimeSlug,
} from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";

const ROGUE_KEYS = {
  rogueKey: 999,
  manualOverride: 1,
  advancedPatchKey: 42,
} as const;

const VALID_INPUTS: Record<string, Record<string, number>> = {
  "repair-time-vs-price-check": {
    quotedPrice: 850,
    repairHours: 2.5,
    partsCost: 180,
  },
  "rent-vs-buy-calculator": {
    monthlyRent: 2200,
    homePrice: 420000,
    comparisonYears: 7,
    annualRentIncrease: 3,
    annualHomeAppreciation: 4,
    downPaymentPercent: 20,
    mortgageInterestRate: 6.5,
    mortgageTermYears: 30,
    investmentReturnRate: 5,
    ownershipCostPercent: 2,
    purchaseCostPercent: 3,
    sellingCostPercent: 6,
  },
  "loan-payment-calculator": {
    principal: 25000,
    annualRate: 7.5,
    months: 60,
  },
  "mortgage-calculator": {
    principal: 304000,
    annualRate: 6.25,
    months: 360,
  },
  "interest-calculator": {
    principal: 10000,
    ratePercent: 5,
    years: 3,
  },
  "compound-interest-calculator": {
    principal: 5000,
    annualRate: 6,
    years: 10,
    compoundsPerYear: 12,
  },
  "profit-margin-calculator": {
    sellingPrice: 120,
    cost: 84,
  },
  "break-even-calculator": {
    fixedCost: 50000,
    unitPrice: 100,
    variableCost: 60,
  },
  "salary-cost-calculator": {
    grossSalary: 5000,
    employerRatePercent: 20,
  },
  "cash-flow-gap-calculator": {
    receivablesDays: 45,
    payableDays: 30,
    dailyCost: 1000,
  },
  "welding-cost-estimator": {
    materialCost: 450,
    laborHours: 6,
    laborRate: 65,
    consumablesCost: 85,
  },
  "sample-size-calculator": {
    population: 50000,
    confidenceZ: 1.96,
    marginErrorPercent: 5,
    proportionPercent: 50,
  },
  "hvac-tonnage-rule-check": {
    squareFootage: 2400,
    tonnage: 4,
    laborHours: 18,
  },
  "roofing-square-cost-check": {
    materialCost: 4200,
    laborHours: 32,
    laborRate: 55,
  },
  "laser-cutting-time-check": {
    setupMinutes: 20,
    cutLengthM: 12,
    cutSpeedMMin: 2.5,
    pierceCount: 40,
    pierceSeconds: 1.2,
  },
  "machine-time-calculator": {
    setupMinutes: 45,
    cycleSeconds: 90,
    quantity: 100,
    machineRate: 85,
  },
  "food-cost-calculator": {
    ingredientCost: 4.5,
    menuPrice: 18,
  },
};

describe("free full-loop runtime bridge", () => {
  test("registry exposes 17 free full-loop slugs", () => {
    expect(FREE_FULL_LOOP_RUNTIME_SLUGS).toHaveLength(17);
    for (const slug of FREE_FULL_LOOP_RUNTIME_SLUGS) {
      expect(isFreeFullLoopRuntimeSlug(slug)).toBe(true);
    }
  });

  for (const slug of FREE_FULL_LOOP_RUNTIME_SLUGS) {
    describe(slug, () => {
      const valid = VALID_INPUTS[slug];

      test("missing input → blocked without result", () => {
        const result = runFreeFullLoopCalculation(slug, {});
        expect(result.status).toBe("blocked");
        if (result.status !== "blocked") {
          return;
        }
        expect(result.trustTrace.loopStatus).toMatch(/NEED_DATA|BLOCKED/);
        expect("trafficResult" in result).toBe(false);
        expect("revenueResult" in result).toBe(false);
        expect(result.trustTrace).toBeDefined();
      });

      test("invalid input → blocked with explicit error", () => {
        const invalid = { ...valid, ...Object.fromEntries(
          Object.keys(valid).slice(0, 1).map((key) => [key, -1]),
        ) };
        const result = runFreeFullLoopCalculation(slug, invalid);
        expect(result.status).toBe("blocked");
        if (result.status === "blocked") {
          expect(result.blockers.length).toBeGreaterThan(0);
        }
      });

      test("rogue keys land in rejectedKeys", () => {
        const { rejectedKeys } = sanitizeFreeCanonicalInputs(slug, {
          ...valid,
          ...ROGUE_KEYS,
        });
        expect(rejectedKeys).toEqual(
          expect.arrayContaining(["rogueKey", "manualOverride", "advancedPatchKey"]),
        );
        const canonical = sanitizeFreeCanonicalInputs(slug, { ...valid, ...ROGUE_KEYS }).canonical;
        expect(canonical.rogueKey).toBeUndefined();
        expect(canonical.manualOverride).toBeUndefined();
        expect(canonical.advancedPatchKey).toBeUndefined();
      });

      test("valid input → success with trust trace", () => {
        const result = runFreeFullLoopCalculation(slug, valid);
        expect(result.status).toBe("success");
        if (result.status === "success") {
          expect(result.trustTrace.validationPassed).toBe(true);
          expect(result.trustTrace.loopStatus).toBe("SUCCESS");
          if (slug === "repair-time-vs-price-check" || slug === "hvac-tonnage-rule-check" || slug === "roofing-square-cost-check") {
            expect(result.revenueResult).toBeDefined();
          } else {
            expect(result.trafficResult).toBeDefined();
          }
        }
      });
    });
  }
});
