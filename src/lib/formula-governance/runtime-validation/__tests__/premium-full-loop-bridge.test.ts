/**
 * Premium full-loop runtime bridge tests — welding + sheet-metal pilots.
 */

import { describe, expect, test } from "vitest";
import {
  runPremiumFullLoopCalculation,
  sanitizeCanonicalInputs,
} from "@/lib/formula-governance/runtime-validation/premium-full-loop-bridge";
import { isFullLoopRuntimeSlug } from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";

const WELDING_SLUG = "welding-bid-risk-analyzer";
const SHEET_METAL_SLUG = "sheet-metal-quote-risk-tool";

const WELDING_VALID_INPUTS = {
  materialCost: 1200,
  laborHours: 8,
  laborRate: 65,
  gasConsumableCost: 85,
  fitUpHours: 2,
  reworkRiskPercent: 10,
  targetMargin: 25,
} as const;

const SHEET_METAL_VALID_INPUTS = {
  programmingTime: 45,
  setupTime: 30,
  cutTime: 12,
  bendCount: 4,
  laborRate: 75,
  materialCost: 280,
  scrapRatePercent: 10,
  finishingCost: 35,
  targetMargin: 25,
} as const;

describe("premium full-loop runtime bridge — welding", () => {
  test("registers welding as full-loop slug", () => {
    expect(isFullLoopRuntimeSlug(WELDING_SLUG)).toBe(true);
  });

  test("rejects non-canonical input keys", () => {
    const sanitized = sanitizeCanonicalInputs(WELDING_SLUG, {
      ...WELDING_VALID_INPUTS,
      rogueKey: 999,
      weldProcedureComplexity: 3,
    });

    expect(sanitized.rejectedKeys).toContain("rogueKey");
    expect(sanitized.rejectedKeys).toContain("weldProcedureComplexity");
    expect(sanitized.canonical.materialCost).toBe(1200);
    expect("rogueKey" in sanitized.canonical).toBe(false);
  });

  test("blocks calculation when required inputs are missing", () => {
    const result = runPremiumFullLoopCalculation(WELDING_SLUG, {
      materialCost: 500,
    });

    expect(result.status).toBe("blocked");
    expect(result.loopStatus).toBe("NEED_DATA");
    expect(result.missingInputs.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(false);
  });

  test("blocks when labor hours are zero", () => {
    const result = runPremiumFullLoopCalculation(WELDING_SLUG, {
      ...WELDING_VALID_INPUTS,
      laborHours: 0,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Labor hours"))).toBe(true);
  });

  test("returns report, verdict and trust trace on valid inputs", () => {
    const result = runPremiumFullLoopCalculation(WELDING_SLUG, { ...WELDING_VALID_INPUTS });

    expect(result.status).toBe("success");
    if (result.status !== "success") {
      return;
    }

    expect(result.report.minimumSafePrice).toBeGreaterThan(0);
    expect(result.toolResult.verdict.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(true);
    expect(result.trustTrace.loopStatus).toBe("SUCCESS");
    expect(result.trustTrace.canonicalInputs).toContain("materialCost");
    expect(result.trustTrace.validationSources.length).toBeGreaterThan(0);
  });

  test("blocks verdict when validation would fail on negative safe price", () => {
    const pre = runPremiumFullLoopCalculation(WELDING_SLUG, { ...WELDING_VALID_INPUTS });
    expect(pre.status).toBe("success");
  });
});

describe("premium full-loop runtime bridge — sheet metal", () => {
  test("registers sheet-metal as full-loop slug", () => {
    expect(isFullLoopRuntimeSlug(SHEET_METAL_SLUG)).toBe(true);
  });

  test("rejects non-canonical input keys", () => {
    const sanitized = sanitizeCanonicalInputs(SHEET_METAL_SLUG, {
      ...SHEET_METAL_VALID_INPUTS,
      rogueKey: 999,
      nestingEfficiency: 0.85,
    });

    expect(sanitized.rejectedKeys).toContain("rogueKey");
    expect(sanitized.rejectedKeys).toContain("nestingEfficiency");
    expect(sanitized.canonical.materialCost).toBe(280);
    expect("rogueKey" in sanitized.canonical).toBe(false);
  });

  test("blocks calculation when required inputs are missing", () => {
    const result = runPremiumFullLoopCalculation(SHEET_METAL_SLUG, {
      materialCost: 500,
    });

    expect(result.status).toBe("blocked");
    expect(result.loopStatus).toBe("NEED_DATA");
    expect(result.missingInputs.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(false);
  });

  test("blocks when labor rate is zero", () => {
    const result = runPremiumFullLoopCalculation(SHEET_METAL_SLUG, {
      ...SHEET_METAL_VALID_INPUTS,
      laborRate: 0,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Labor rate"))).toBe(true);
  });

  test("blocks when scrap rate is out of range", () => {
    const result = runPremiumFullLoopCalculation(SHEET_METAL_SLUG, {
      ...SHEET_METAL_VALID_INPUTS,
      scrapRatePercent: 120,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Scrap rate"))).toBe(true);
  });

  test("returns report, verdict and trust trace on valid inputs", () => {
    const result = runPremiumFullLoopCalculation(SHEET_METAL_SLUG, { ...SHEET_METAL_VALID_INPUTS });

    expect(result.status).toBe("success");
    if (result.status !== "success") {
      return;
    }

    expect(result.report.minimumSafePrice).toBeGreaterThan(0);
    expect(result.toolResult.verdict.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(true);
    expect(result.trustTrace.loopStatus).toBe("SUCCESS");
    expect(result.trustTrace.canonicalInputs).toContain("cutTime");
    expect(result.trustTrace.validationSources.length).toBeGreaterThan(0);
  });
});
