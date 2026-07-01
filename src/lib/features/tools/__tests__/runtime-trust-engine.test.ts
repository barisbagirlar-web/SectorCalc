import { describe, expect, test } from "vitest";
import {
  clearRuntimeToolHealthStore,
  mergeRuntimeHealthWithDecision,
  writeRuntimeToolHealth,
} from "@/lib/features/tools/runtime-health-store";
import {
  ERT_PROBLEM_SLUG,
  canShowFormulaGateApproved,
  evaluateRuntimeTrust,
  isFormulaGateTrustEligible,
  isPaymentTrustEligible,
} from "@/lib/features/tools/runtime-trust-engine";

describe("runtime trust engine", () => {
  test("free tool is never payment eligible (ERT-1)", () => {
    const result = evaluateRuntimeTrust({
      slug: "desi-calculator",
      locale: "en",
      surface: "free",
    });
    expect(result.tier).toBe("free");
    expect(result.paymentEligible).toBe(false);
    expect(result.formulaGateEligible).toBe(false);
  });

  test("lawn-care-cost-check resolves as free tool, never payment eligible on premium surface", () => {
    const result = evaluateRuntimeTrust({
      slug: "lawn-care-cost-check",
      locale: "en",
      surface: "premium",
    });
    expect(result.tier).toBe("free");
    expect(result.paymentEligible).toBe(false);
    expect(result.formulaGateEligible).toBe(false);
  });

  test("ready tool with explicit P2.4 PASS on free tier is not payment eligible", () => {
    const result = evaluateRuntimeTrust({
      slug: "desi-calculator",
      locale: "en",
      surface: "premium",
    });
    expect(result.findings).not.toContain("missing_form_schema");
    expect(result.paymentEligible).toBe(false);
    expect(result.formulaGateEligible).toBe(false);
    if (result.status === "ready") {
      expect(result.calculationEligible).toBe(true);
    }
  });

  test("missing traffic tool is blocked", () => {
    const result = evaluateRuntimeTrust({
      slug: "totally-unknown-slug-xyz",
      locale: "en",
      surface: "premium",
    });
    expect(result.formulaGateEligible).toBe(false);
    expect(result.paymentEligible).toBe(false);
    expect(result.calculationEligible).toBe(false);
    expect(result.findings).toContain("missing_active_route");
  });

  test("generic label value fails trust eligibility", () => {
    const result = evaluateRuntimeTrust({
      slug: "basincli-kap-cidar-kalinligi-calc",
      locale: "tr",
      surface: "premium",
    });
    expect(result.formulaGateEligible).toBe(false);
    expect(result.findings.some((f) => f.includes("generic") || f.includes("label"))).toBe(true);
  });

  test("mixed label Aylik fee fails trust eligibility", () => {
    const result = evaluateRuntimeTrust({
      slug: ERT_PROBLEM_SLUG,
      locale: "tr",
      surface: "premium",
    });
    expect(result.formulaGateEligible).toBe(false);
    expect(result.paymentEligible).toBe(false);
    expect(result.calculationEligible).toBe(false);
  });

  test("premium route free FAQ mismatch fails trust", () => {
    const result = evaluateRuntimeTrust({
      slug: "desi-calculator",
      locale: "en",
      surface: "premium",
      premiumSurfaceUsesFreeCopy: true,
    });
    expect(result.formulaGateEligible).toBe(false);
    expect(result.findings).toContain("tier_copy_mismatch");
  });

  test("P2.4 WARN problem slug is not Formula Gate eligible", () => {
    const result = evaluateRuntimeTrust({
      slug: ERT_PROBLEM_SLUG,
      locale: "tr",
      surface: "premium",
    });
    expect(isFormulaGateTrustEligible(ERT_PROBLEM_SLUG, "tr", "premium")).toBe(false);
    expect(result.findings).toContain("audit_status_not_pass");
    expect(result.recommendedAction).toBe("manual_review");
    expect(result.calculationEligible).toBe(false);
  });

  test("canShowFormulaGateApproved is false for hard-review problem slug", () => {
    const result = evaluateRuntimeTrust({
      slug: ERT_PROBLEM_SLUG,
      locale: "tr",
      surface: "premium",
      premiumSurfaceUsesFreeCopy: true,
    });
    expect(canShowFormulaGateApproved(result)).toBe(false);
    expect(result.status).toBe("review");
    expect(result.recommendedAction).toBe("manual_review");
  });

  test("paymentEligible false when trust not ready", () => {
    const result = evaluateRuntimeTrust({
      slug: ERT_PROBLEM_SLUG,
      locale: "tr",
      surface: "premium",
    });
    expect(isPaymentTrustEligible(ERT_PROBLEM_SLUG, "tr", "premium")).toBe(false);
    expect(result.paymentEligible).toBe(false);
    expect(result.findings).toContain("payment_not_safe");
  });

  test("health store blocked override forces final decision false", () => {
    clearRuntimeToolHealthStore();
    const base = evaluateRuntimeTrust({
      slug: "desi-calculator",
      locale: "en",
      surface: "premium",
    });
    writeRuntimeToolHealth({
      slug: "desi-calculator",
      status: "blocked",
      formulaGateEligible: false,
      paymentEligible: false,
      calculationEligible: false,
      findings: ["live-crawler:critical"],
      lastCheckedAt: new Date().toISOString(),
      source: "live-crawler",
    });
    const merged = evaluateRuntimeTrust({
      slug: "desi-calculator",
      locale: "en",
      surface: "premium",
    });
    expect(merged.formulaGateEligible).toBe(false);
    expect(merged.paymentEligible).toBe(false);
    expect(merged.calculationEligible).toBe(false);
    expect(merged.recommendedAction).toBe("block_payment");
    clearRuntimeToolHealthStore();
    expect(base.status).toBeDefined();
  });

  test("mergeRuntimeHealthWithDecision downgrades ready decision", () => {
    const decision = evaluateRuntimeTrust({
      slug: ERT_PROBLEM_SLUG,
      locale: "tr",
      surface: "premium",
    });
    const merged = mergeRuntimeHealthWithDecision(decision, {
      slug: ERT_PROBLEM_SLUG,
      status: "review",
      formulaGateEligible: false,
      paymentEligible: false,
      calculationEligible: false,
      findings: ["manual-admin:label-review"],
      lastCheckedAt: new Date().toISOString(),
      source: "manual-admin",
    });
    expect(merged.formulaGateEligible).toBe(false);
    expect(merged.paymentEligible).toBe(false);
    expect(merged.calculationEligible).toBe(false);
  });
});
