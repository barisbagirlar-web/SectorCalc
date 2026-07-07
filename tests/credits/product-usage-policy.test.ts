// SectorCalc Product Usage Policy Tests
// Verifies credit-to-usage conversion rules for all products.
import { describe, it, expect, vi } from "vitest";

// Mock Firestore admin
vi.mock("@/lib/infrastructure/firebase/admin", () => ({
  getAdminFirestore: vi.fn(() => null),
}));

import {
  PRODUCT_KEYS,
  PRODUCT_USAGE_POLICY,
  getProductUsagePolicy,
  isFreeProduct,
} from "@/lib/credits/product-usage-policy";

const PK = PRODUCT_KEYS;

describe("Product Usage Policy — Static Rules", () => {
  it("Free Tools: 0 credits, unlimited usage", () => {
    const p = PRODUCT_USAGE_POLICY[PK.FREE_TOOLS];
    expect(p.creditCost).toBe(0);
    expect(p.usageGrant).toBe(0);
  });

  it("Pro Tools: 1 credit → 3 uses", () => {
    const p = PRODUCT_USAGE_POLICY[PK.PRO_TOOLS];
    expect(p.creditCost).toBe(1);
    expect(p.usageGrant).toBe(3);
  });

  it("AI Photo Diagnosis: 2 credits → 3 uses", () => {
    const p = PRODUCT_USAGE_POLICY[PK.AI_PHOTO_DIAGNOSIS];
    expect(p.creditCost).toBe(2);
    expect(p.usageGrant).toBe(3);
  });

  it("Engineering Diagnostics: 5 credits → 3 uses", () => {
    const p = PRODUCT_USAGE_POLICY[PK.ENGINEERING_DIAGNOSTICS];
    expect(p.creditCost).toBe(5);
    expect(p.usageGrant).toBe(3);
  });

  it("CBAM Module: 100 credits → 3 uses", () => {
    const p = PRODUCT_USAGE_POLICY[PK.CBAM];
    expect(p.creditCost).toBe(100);
    expect(p.usageGrant).toBe(3);
  });

  it("isFreeProduct returns true only for FREE_TOOLS", () => {
    expect(isFreeProduct(PK.FREE_TOOLS)).toBe(true);
    expect(isFreeProduct(PK.PRO_TOOLS)).toBe(false);
    expect(isFreeProduct(PK.AI_PHOTO_DIAGNOSIS)).toBe(false);
    expect(isFreeProduct(PK.ENGINEERING_DIAGNOSTICS)).toBe(false);
    expect(isFreeProduct(PK.CBAM)).toBe(false);
  });

  it("getProductUsagePolicy returns correct policy for each key", () => {
    expect(getProductUsagePolicy(PK.AI_PHOTO_DIAGNOSIS).creditCost).toBe(2);
    expect(getProductUsagePolicy(PK.ENGINEERING_DIAGNOSTICS).creditCost).toBe(5);
    expect(getProductUsagePolicy(PK.CBAM).creditCost).toBe(100);
    expect(getProductUsagePolicy(PK.PRO_TOOLS).creditCost).toBe(1);
  });

  it("all 5 product keys have policies defined", () => {
    const keys = Object.values(PK);
    expect(keys.length).toBe(5);
    for (const key of keys) {
      expect(PRODUCT_USAGE_POLICY[key]).toBeDefined();
      expect(typeof PRODUCT_USAGE_POLICY[key].creditCost).toBe("number");
      expect(typeof PRODUCT_USAGE_POLICY[key].usageGrant).toBe("number");
    }
  });

  it("all paid products grant 3 uses each", () => {
    const paidProducts = [
      PK.PRO_TOOLS,
      PK.AI_PHOTO_DIAGNOSIS,
      PK.ENGINEERING_DIAGNOSTICS,
      PK.CBAM,
    ];
    for (const key of paidProducts) {
      expect(PRODUCT_USAGE_POLICY[key].usageGrant).toBe(3);
    }
  });

  it("all credit costs are non-negative", () => {
    for (const key of Object.values(PK)) {
      expect(PRODUCT_USAGE_POLICY[key].creditCost).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("Product Usage Policy — Runtime Behavior (DB unavailable)", () => {
  it("grantProductUsesFromCredits returns error when DB is unavailable", async () => {
    const { grantProductUsesFromCredits } = await import(
      "@/lib/credits/product-usage-policy"
    );
    const result = await grantProductUsesFromCredits("test-user", PK.ENGINEERING_DIAGNOSTICS);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("DATABASE_UNAVAILABLE");
    }
  });

  it("checkProductUsage returns false when DB is unavailable (paid products)", async () => {
    const { checkProductUsage } = await import(
      "@/lib/credits/product-usage-policy"
    );
    const hasUsage = await checkProductUsage("test-user", PK.AI_PHOTO_DIAGNOSIS);
    expect(hasUsage).toBe(false);
  });

  it("decrementProductUse returns false when DB is unavailable", async () => {
    const { decrementProductUse } = await import(
      "@/lib/credits/product-usage-policy"
    );
    const result = await decrementProductUse("test-user", PK.AI_PHOTO_DIAGNOSIS);
    expect(result).toBe(false);
  });

  it("getRemainingProductUses returns 0 when DB is unavailable", async () => {
    const { getRemainingProductUses } = await import(
      "@/lib/credits/product-usage-policy"
    );
    const remaining = await getRemainingProductUses("test-user", PK.ENGINEERING_DIAGNOSTICS);
    expect(remaining).toBe(0);
  });

  it("Free Tools bypass DB checks entirely", async () => {
    const { checkProductUsage, decrementProductUse, getRemainingProductUses } = await import(
      "@/lib/credits/product-usage-policy"
    );
    expect(await checkProductUsage("test-user", PK.FREE_TOOLS)).toBe(true);
    expect(await decrementProductUse("test-user", PK.FREE_TOOLS)).toBe(true);
    expect(await getRemainingProductUses("test-user", PK.FREE_TOOLS)).toBe(Infinity);
  });
});
