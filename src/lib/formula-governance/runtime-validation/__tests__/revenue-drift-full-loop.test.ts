/**
 * Revenue drift free tools — full-loop runtime matrix (project / cleaning / product margin).
 */

import { describe, expect, test } from "vitest";
import { compareBatchFreeProductionVsOracle } from "@/lib/formula-governance/oracle/compare-batch-free-oracle";
import {
  runFreeFullLoopCalculation,
  sanitizeFreeCanonicalInputs,
} from "@/lib/formula-governance/runtime-validation/free-full-loop-bridge";
import { isFreeFullLoopRuntimeSlug } from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";

const REVENUE_DRIFT_SLUGS = [
  "project-cost-calculator",
  "cleaning-cost-calculator",
  "product-margin-calculator",
] as const;

const ROGUE_KEYS = {
  rogueKey: 999,
  manualOverride: 1,
  advancedPatchKey: 42,
} as const;

const VALID_INPUTS: Record<string, Record<string, number | string>> = {
  "project-cost-calculator": {
    originalBudget: 500_000,
    changeEstimate: 25_000,
    deadlinePressure: "medium",
  },
  "cleaning-cost-calculator": {
    areaSize: 12_000,
    staffCount: 2,
    visitFrequency: 20,
  },
  "product-margin-calculator": {
    productPrice: 79,
    productCost: 28,
    returnRate: 5,
  },
};

describe("revenue drift full-loop runtime", () => {
  for (const slug of REVENUE_DRIFT_SLUGS) {
    test(`${slug} is registered for free full-loop runtime`, () => {
      expect(isFreeFullLoopRuntimeSlug(slug)).toBe(true);
    });

    test(`${slug} blocks missing required inputs`, () => {
      const result = runFreeFullLoopCalculation(slug, {});
      expect(result.status).toBe("blocked");
      if (result.status === "blocked") {
        expect(result.missingInputs.length).toBeGreaterThan(0);
        expect(result.loopStatus).toMatch(/NEED_DATA|BLOCKED/);
      }
    });

    test(`${slug} blocks invalid primary input`, () => {
      const invalid =
        slug === "project-cost-calculator"
          ? { originalBudget: 0, changeEstimate: 10_000, deadlinePressure: "low" }
          : slug === "cleaning-cost-calculator"
            ? { areaSize: 0, staffCount: 2, visitFrequency: 12 }
            : { productPrice: 0, productCost: 10, returnRate: 0 };
      const result = runFreeFullLoopCalculation(slug, invalid);
      expect(result.status).toBe("blocked");
    });

    test(`${slug} rejects rogue keys`, () => {
      const sanitized = sanitizeFreeCanonicalInputs(slug, {
        ...VALID_INPUTS[slug],
        ...ROGUE_KEYS,
      });
      expect(sanitized.rejectedKeys).toEqual(
        expect.arrayContaining(["advancedPatchKey", "manualOverride", "rogueKey"]),
      );
      for (const rogue of Object.keys(ROGUE_KEYS)) {
        expect(sanitized.canonical[rogue]).toBeUndefined();
      }
    });

    test(`${slug} succeeds with valid inputs and trust trace`, () => {
      const result = runFreeFullLoopCalculation(slug, VALID_INPUTS[slug]);
      expect(result.status).toBe("success");
      if (result.status === "success") {
        expect(result.trustTrace.validationPassed).toBe(true);
        expect(result.trustTrace.canonicalInputs.length).toBeGreaterThan(0);
        expect(result.revenueResult).toBeDefined();
      }
    });

    test(`${slug} oracle comparison passes for valid fixture`, () => {
      const values = { ...VALID_INPUTS[slug] };
      const comparison = compareBatchFreeProductionVsOracle({
        slug,
        scenarioId: "revenue-drift-fixture",
        values,
      });
      expect(comparison.status).toBe("PASS");
    });
  }
});
