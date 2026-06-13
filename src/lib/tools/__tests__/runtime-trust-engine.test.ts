import { describe, expect, test } from "vitest";
import {
  clearRuntimeToolHealthStore,
  mergeRuntimeHealthWithDecision,
  writeRuntimeToolHealth,
} from "@/lib/tools/runtime-health-store";
import {
  ERT_PROBLEM_SLUG,
  evaluateRuntimeTrust,
  isFormulaGateTrustEligible,
  isPaymentTrustEligible,
} from "@/lib/tools/runtime-trust-engine";

describe("runtime trust engine", () => {
  test("ready tool with explicit P2.4 PASS can be trust eligible", () => {
    const result = evaluateRuntimeTrust({
      slug: "desi-calculator",
      locale: "en",
      surface: "premium",
    });
    expect(result.findings).not.toContain("missing_form_schema");
    if (result.status === "ready" && result.findings.length === 0) {
      expect(result.formulaGateEligible).toBe(true);
      expect(result.paymentEligible).toBe(true);
      expect(result.calculationEligible).toBe(true);
    } else {
      expect(result.formulaGateEligible).toBe(false);
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
      slug: "basincli-kap-cidar-kalinligi-hesabi",
      locale: "tr",
      surface: "premium",
    });
    expect(result.formulaGateEligible).toBe(false);
    expect(result.findings.some((f) => f.includes("generic") || f.includes("label"))).toBe(true);
  });

  test("mixed label Aylık fee fails trust eligibility", () => {
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
    expect(result.recommendedAction).not.toBe("allow");
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
