import { describe, expect, test } from "vitest";
import { evaluateRuntimeReadiness } from "@/lib/tools/runtime-readiness";

describe("runtime readiness", () => {
  test("cnc premium analyzer can be formula gate eligible when P2.4 PASS", () => {
    const result = evaluateRuntimeReadiness({
      slug: "cnc-quote-risk-analyzer",
      locale: "en",
      surface: "premium",
    });
    expect(result.findings).not.toContain("missing_form_schema");
    if (result.findings.includes("audit_status_not_pass")) {
      expect(result.formulaGateEligible).toBe(false);
    } else {
      expect(result.formulaGateEligible).toBe(true);
    }
  });

  test("missing traffic tool is blocked", () => {
    const result = evaluateRuntimeReadiness({
      slug: "totally-unknown-slug-xyz",
      locale: "en",
      surface: "premium",
    });
    expect(result.formulaGateEligible).toBe(false);
    expect(result.findings).toContain("missing_active_route");
  });

  test("generic value unit fails eligibility", () => {
    const result = evaluateRuntimeReadiness({
      slug: "aku-kapasitesi-calisma-suresi-hesabi",
      locale: "tr",
      surface: "premium",
      premiumSurfaceUsesFreeCopy: false,
    });
    expect(result.formulaGateEligible).toBe(false);
    expect(result.findings).toContain("generic_input_labels");
  });

  test("mixed TR/EN labels fail eligibility", () => {
    const result = evaluateRuntimeReadiness({
      slug: "is-sagligi-ve-guvenligi-ceza-hesaplama",
      locale: "tr",
      surface: "premium",
      premiumSurfaceUsesFreeCopy: false,
    });
    expect(result.formulaGateEligible).toBe(false);
    expect(
      result.findings.includes("mixed_locale_labels") ||
        result.findings.includes("generic_input_labels"),
    ).toBe(true);
  });

  test("premium route free FAQ mismatch flag", () => {
    const result = evaluateRuntimeReadiness({
      slug: "vat-calculator",
      locale: "en",
      surface: "premium",
      premiumSurfaceUsesFreeCopy: true,
    });
    expect(result.findings).toContain("tier_copy_mismatch");
    expect(result.formulaGateEligible).toBe(false);
  });

  test("problem slug is not payment eligible under P2.4 WARN", () => {
    const result = evaluateRuntimeReadiness({
      slug: "abonelik-yazilim-cloud-yillik-maliyet-hesabi",
      locale: "tr",
      surface: "premium",
      premiumSurfaceUsesFreeCopy: false,
    });
    expect(result.paymentEligible).toBe(false);
    expect(result.formulaGateEligible).toBe(false);
    expect(result.findings).toContain("audit_status_not_pass");
  });
});
