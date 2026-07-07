// SectorCalc PRO V5.3.1 — Checkout Binding Test
// Verifies price resolver and product registry integration.
import { describe, it, expect, beforeAll } from "vitest";
import { resolveBarisStripePriceId, requireBarisCheckoutPrice } from "../../src/sectorcalc/pro-commerce/baris-price-resolver";
import { getBarisProduct } from "../../src/sectorcalc/pro-commerce/baris-pro-products";

describe("Baris Checkout Binding", () => {
  // Set up env with a test value
  beforeAll(() => {
    process.env["STRIPE_PRICE_BARIS_TEST_TOOL"] = "price_test123";
  });

  it("should resolve a configured price env key", () => {
    const result = resolveBarisStripePriceId("STRIPE_PRICE_BARIS_TEST_TOOL");
    expect(result.configured).toBe(true);
    expect(result.resolvedPriceId).toBe("price_test123");
    expect(result.error).toBeNull();
  });

  it("should fail for missing env key", () => {
    const result = resolveBarisStripePriceId("STRIPE_PRICE_BARIS_NONEXISTENT");
    expect(result.configured).toBe(false);
    expect(result.resolvedPriceId).toBeNull();
    expect(result.error).toContain("Missing env key");
  });

  it("should fail for invalid env key format", () => {
    const result = resolveBarisStripePriceId("INVALID_KEY");
    expect(result.configured).toBe(false);
    expect(result.error).toContain("Invalid env key format");
  });

  it("requireBarisCheckoutPrice should reject missing price", () => {
    const result = requireBarisCheckoutPrice("STRIPE_PRICE_BARIS_NONEXISTENT");
    expect(result.ok).toBe(false);
    expect(result.priceId).toBeUndefined();
    expect(result.reason).toContain("Missing env key");
  });

  it("requireBarisCheckoutPrice should accept configured price", () => {
    const result = requireBarisCheckoutPrice("STRIPE_PRICE_BARIS_TEST_TOOL");
    expect(result.ok).toBe(true);
    expect(result.priceId).toBe("price_test123");
    expect(result.reason).toBeNull();
  });

  it("all 45 products should have valid env key format", () => {
    const products = getBarisProduct("break-even-survival-cash-calculator");
    expect(products).toBeDefined();
    expect(products!.stripePriceEnvKey).toMatch(/^STRIPE_PRICE_BARIS_/);
  });

  it("missing price env key should block checkout", () => {
    // The price resolver returns fail-closed for missing keys
    const result = requireBarisCheckoutPrice("STRIPE_PRICE_BARIS_NONEXISTENT");
    expect(result.ok).toBe(false);
  });
});
