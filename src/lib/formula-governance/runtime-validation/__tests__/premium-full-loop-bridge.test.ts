/**
 * Premium full-loop runtime bridge tests — welding-bid-risk-analyzer pilot.
 */

import { describe, expect, test } from "vitest";
import {
  runPremiumFullLoopCalculation,
  sanitizeCanonicalInputs,
} from "@/lib/formula-governance/runtime-validation/premium-full-loop-bridge";
import { isFullLoopRuntimeSlug } from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";

const WELDING_SLUG = "welding-bid-risk-analyzer";

const VALID_INPUTS = {
  materialCost: 1200,
  laborHours: 8,
  laborRate: 65,
  gasConsumableCost: 85,
  fitUpHours: 2,
  reworkRiskPercent: 10,
  targetMargin: 25,
} as const;

describe("premium full-loop runtime bridge — welding", () => {
  test("registers welding as full-loop slug", () => {
    expect(isFullLoopRuntimeSlug(WELDING_SLUG)).toBe(true);
  });

  test("rejects non-canonical input keys", () => {
    const sanitized = sanitizeCanonicalInputs(WELDING_SLUG, {
      ...VALID_INPUTS,
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
      ...VALID_INPUTS,
      laborHours: 0,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Labor hours"))).toBe(true);
  });

  test("returns report, verdict and trust trace on valid inputs", () => {
    const result = runPremiumFullLoopCalculation(WELDING_SLUG, { ...VALID_INPUTS });

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
    const pre = runPremiumFullLoopCalculation(WELDING_SLUG, { ...VALID_INPUTS });
    expect(pre.status).toBe("success");
  });
});
