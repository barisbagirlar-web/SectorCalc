import { describe, expect, test } from "vitest";
import {
  isKnownPremiumSlug,
  isValidReturnPath,
  validateCheckoutMetadata,
} from "@/lib/billing/checkout-metadata";
import { listPremiumSchemaSlugs } from "@/lib/premium-schema/schemas/index";

const KNOWN_SLUG = listPremiumSchemaSlugs()[0] ?? "cnc-oee-loss";

describe("checkout-metadata", () => {
  test("valid returnPath accepted", () => {
    expect(isValidReturnPath("/tools/premium-schema/cnc-oee-loss")).toBe(true);
  });

  test("external returnPath rejected", () => {
    expect(isValidReturnPath("https://evil.example/phish")).toBe(false);
    expect(isValidReturnPath("//evil.example/path")).toBe(false);
  });

  test("valid planId accepted", () => {
    const result = validateCheckoutMetadata({
      planId: "pro_monthly",
      returnPath: "/pricing",
    });
    expect(result?.planId).toBe("pro_monthly");
    expect(result?.entitlementLevel).toBe("pro");
    expect(result?.createdBy).toBe("sectorcalc");
  });

  test("invalid planId rejected", () => {
    expect(
      validateCheckoutMetadata({
        planId: "unknown_plan",
        returnPath: "/pricing",
      })
    ).toBeNull();
  });

  test("unknown premiumSlug ignored safely", () => {
    const result = validateCheckoutMetadata({
      planId: "single_report",
      returnPath: "/pricing",
      premiumSlug: "not-a-real-schema-slug",
    });
    expect(result?.premiumSlug).toBeUndefined();
  });

  test("known premiumSlug accepted", () => {
    expect(isKnownPremiumSlug(KNOWN_SLUG)).toBe(true);
    const result = validateCheckoutMetadata({
      planId: "single_report",
      returnPath: "/pricing",
      premiumSlug: KNOWN_SLUG,
    });
    expect(result?.premiumSlug).toBe(KNOWN_SLUG);
  });
});
