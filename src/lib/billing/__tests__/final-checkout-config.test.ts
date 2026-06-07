import { describe, expect, test } from "vitest";
import {
  BILLING_PLANS,
  getBillingPlanById,
  resolveSafeReturnPath,
} from "@/lib/billing/billing-config";
import { isValidReturnPath } from "@/lib/billing/checkout-metadata";

const EXPECTED_PLAN_IDS = ["single_report", "pro_monthly", "team_monthly"] as const;

describe("final-checkout-config", () => {
  test("billing plans exactly contain single_report, pro_monthly, team_monthly", () => {
    const ids = BILLING_PLANS.map((plan) => plan.id).sort();
    expect(ids).toEqual([...EXPECTED_PLAN_IDS].sort());
    expect(BILLING_PLANS.length).toBe(3);
  });

  test("pro price label $19/mo", () => {
    expect(getBillingPlanById("pro_monthly").priceLabel).toBe("$19/mo");
  });

  test("team price label $49/mo", () => {
    expect(getBillingPlanById("team_monthly").priceLabel).toBe("$49/mo");
  });

  test("single report price label contains $9", () => {
    expect(getBillingPlanById("single_report").priceLabel).toContain("$9");
  });

  test("each plan has stripePriceEnvKey", () => {
    BILLING_PLANS.forEach((plan) => {
      expect(plan.stripePriceEnvKey.trim().length).toBeGreaterThan(0);
    });
  });

  test("success and cancel paths are internal safe paths", () => {
    expect(resolveSafeReturnPath("/checkout/success")).toBe("/checkout/success");
    expect(resolveSafeReturnPath("/checkout/cancel")).toBe("/checkout/cancel");
    expect(resolveSafeReturnPath("/tools/premium-schema/cnc-oee-loss")).toBe(
      "/tools/premium-schema/cnc-oee-loss"
    );
  });

  test("external returnPath rejected", () => {
    expect(resolveSafeReturnPath("https://evil.example/phish")).toBe("/pricing");
    expect(isValidReturnPath("https://evil.example/phish")).toBe(false);
    expect(isValidReturnPath("/tools/premium-schema/cnc-oee-loss")).toBe(true);
  });
});
