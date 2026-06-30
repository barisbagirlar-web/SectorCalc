import { describe, expect, test } from "vitest";
import {
  canAccessPremiumFullFeatures,
  resolvePremiumAccessMode,
} from "@/lib/features/billing/premium-access-mode";

describe("premium-access-mode", () => {
  test("public visitor gets public-preview", () => {
    expect(
      resolvePremiumAccessMode({
        user: null,
        canAccessAnalyzer: false,
        isSuperUser: false,
        devPro: false,
      }),
    ).toBe("public-preview");
  });

  test("signed-in non-pro gets signed-in-free", () => {
    expect(
      resolvePremiumAccessMode({
        user: { uid: "u1" } as never,
        canAccessAnalyzer: false,
        isSuperUser: false,
        devPro: false,
      }),
    ).toBe("signed-in-free");
  });

  test("pro subscriber gets pro mode", () => {
    expect(
      resolvePremiumAccessMode({
        user: { uid: "u1" } as never,
        canAccessAnalyzer: true,
        isSuperUser: false,
        devPro: false,
      }),
    ).toBe("pro");
    expect(canAccessPremiumFullFeatures("pro")).toBe(true);
    expect(canAccessPremiumFullFeatures("public-preview")).toBe(false);
  });
});
