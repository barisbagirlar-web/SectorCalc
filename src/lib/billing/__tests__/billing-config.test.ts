import { describe, expect, test } from "vitest";
import {
  BILLING_PLANS,
  getBillingPlanById,
  isBillingPlanId,
  mapBillingPlanToCheckoutPlan,
  resolveSafeReturnPath,
} from "@/lib/billing/billing-config";

describe("billing-config", () => {
  test("BILLING_PLANS length === 3", () => {
    expect(BILLING_PLANS.length).toBe(3);
  });

  test("plan ids unique", () => {
    const ids = BILLING_PLANS.map((plan) => plan.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("Pro price label $19/mo", () => {
    expect(getBillingPlanById("pro_monthly").priceLabel).toBe("$19/mo");
  });

  test("Team price label $49/mo", () => {
    expect(getBillingPlanById("team_monthly").priceLabel).toBe("$49/mo");
  });

  test("Single report includes $9", () => {
    expect(getBillingPlanById("single_report").priceLabel).toContain("$9");
  });

  test("each plan entitlementLevel is set", () => {
    BILLING_PLANS.forEach((plan) => {
      expect(plan.entitlementLevel.trim().length).toBeGreaterThan(0);
    });
  });

  test("each plan stripePriceEnvKey is set", () => {
    BILLING_PLANS.forEach((plan) => {
      expect(plan.stripePriceEnvKey.trim().length).toBeGreaterThan(0);
    });
  });

  test("mapBillingPlanToCheckoutPlan maps pro_monthly to pro", () => {
    expect(mapBillingPlanToCheckoutPlan("pro_monthly")).toBe("pro");
    expect(mapBillingPlanToCheckoutPlan("single_report")).toBe("single_report");
    expect(mapBillingPlanToCheckoutPlan("team_monthly")).toBe("team");
  });

  test("isBillingPlanId validates known ids", () => {
    expect(isBillingPlanId("pro_monthly")).toBe(true);
    expect(isBillingPlanId("unknown")).toBe(false);
  });

  test("resolveSafeReturnPath rejects external URLs", () => {
    expect(resolveSafeReturnPath("/tools/premium-schema/cnc-oee-loss")).toBe(
      "/tools/premium-schema/cnc-oee-loss",
    );
    expect(resolveSafeReturnPath("https://evil.test/phish")).toBe("/pricing");
    expect(resolveSafeReturnPath("//evil.test")).toBe("/pricing");
  });
});
