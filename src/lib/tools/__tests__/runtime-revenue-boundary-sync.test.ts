import { describe, expect, test } from "vitest";
import { evaluateRuntimeTrust } from "@/lib/tools/runtime-trust-engine";
import {
  getP24VerdictForSlug,
  isP24TrustPassForSlug,
} from "@/lib/tools/runtime-readiness-p24-verdicts";
import {
  isRevenueBoundaryRestoreSlug,
  REVENUE_BOUNDARY_RESTORE_SLUGS,
} from "@/lib/tools/runtime-revenue-boundary-sync";

describe("P8.1 revenue boundary restore", () => {
  test("restore set matches the three stale WARN allowlist slugs", () => {
    expect([...REVENUE_BOUNDARY_RESTORE_SLUGS].sort()).toEqual([
      "auto-shop-margin-leak-detector",
      "cnc-quote-risk-analyzer",
      "print-job-cost-check",
    ]);
  });

  for (const slug of REVENUE_BOUNDARY_RESTORE_SLUGS) {
    test(`${slug} syncs stale WARN to PASS for revenue trust`, () => {
      expect(isRevenueBoundaryRestoreSlug(slug)).toBe(true);
      expect(getP24VerdictForSlug(slug)).toBe("PASS");
      expect(isP24TrustPassForSlug(slug)).toBe(true);

      const trust = evaluateRuntimeTrust({ slug, locale: "tr", surface: "premium" });
      expect(trust.paymentEligible).toBe(true);
      expect(trust.formulaGateEligible).toBe(true);
      expect(trust.calculationEligible).toBe(true);
    });
  }

  test("feed-efficiency-analyzer stays payment blocked", () => {
    const trust = evaluateRuntimeTrust({
      slug: "feed-efficiency-analyzer",
      locale: "tr",
      surface: "premium",
    });
    expect(trust.paymentEligible).toBe(false);
    expect(trust.formulaGateEligible).toBe(false);
    expect(trust.calculationEligible).toBe(false);
  });
});
