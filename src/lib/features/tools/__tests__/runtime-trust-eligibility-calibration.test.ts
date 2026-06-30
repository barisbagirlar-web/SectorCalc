import { describe, expect, test } from "vitest";
import {
  applyErt1PaymentSurfacePolicy,
  isPremiumPaymentSurfaceTier,
} from "@/lib/features/tools/runtime-trust-eligibility-calibration";
import type { RuntimeTrustDecision } from "@/lib/features/tools/runtime-trust-engine";

function baseDecision(
  overrides: Partial<RuntimeTrustDecision> = {},
): RuntimeTrustDecision {
  return {
    slug: "demo-tool",
    route: "/tools/premium/demo-tool",
    tier: "premium-schema",
    locale: "en",
    status: "ready",
    formulaGateEligible: true,
    paymentEligible: true,
    calculationEligible: true,
    findings: [],
    recommendedAction: "allow",
    ...overrides,
  };
}

describe("runtime trust eligibility calibration (ERT-1)", () => {
  test("premium tiers are payment surfaces", () => {
    expect(isPremiumPaymentSurfaceTier("premium")).toBe(true);
    expect(isPremiumPaymentSurfaceTier("premium-schema")).toBe(true);
    expect(isPremiumPaymentSurfaceTier("free")).toBe(false);
  });

  test("free tier never receives payment or Formula Gate", () => {
    const calibrated = applyErt1PaymentSurfacePolicy(
      baseDecision({
        tier: "free",
        route: "/tools/free/desi-calculator",
      }),
    );
    expect(calibrated.paymentEligible).toBe(false);
    expect(calibrated.formulaGateEligible).toBe(false);
    expect(calibrated.calculationEligible).toBe(true);
    expect(calibrated.findings).toContain("payment_not_safe");
    expect(calibrated.findings).toContain("formula_gate_not_safe");
  });

  test("premium tier decision passes through unchanged", () => {
    const input = baseDecision();
    expect(applyErt1PaymentSurfacePolicy(input)).toEqual(input);
  });

  test("premium tier tool rendered on free route gets unblocked", () => {
    const calibrated = applyErt1PaymentSurfacePolicy(
      baseDecision({
        tier: "premium",
        route: "/tools/free/annual-percentage-rate-apr",
      }),
    );
    expect(calibrated.paymentEligible).toBe(false);
    expect(calibrated.formulaGateEligible).toBe(false);
    expect(calibrated.calculationEligible).toBe(true);
  });
});
