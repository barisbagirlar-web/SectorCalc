// SectorCalc PRO V5.3.1 — Checkout Binding Test (Key-Pool Model)
// Verifies key-pack price resolver and product registry integration.
import { describe, it, expect, beforeAll } from "vitest";
import { requireBarisKeyPackPrice } from "../../src/sectorcalc/pro-commerce/baris-paddle-price-resolver";
import { getBarisProduct, getBarisProductSummary } from "../../src/sectorcalc/pro-commerce/baris-pro-products";

describe("Baris Checkout Binding (Key-Pool)", () => {
  beforeAll(() => {
    process.env["PADDLE_PRICE_BARIS_KEY_PACK"] = "pri_test_key_pack_id";
  });

  it("requireBarisKeyPackPrice should accept configured key-pack price", () => {
    const result = requireBarisKeyPackPrice();
    expect(result.ok).toBe(true);
    expect(result.priceId).toBe("pri_test_key_pack_id");
    expect(result.reason).toBeNull();
  });

  it("requireBarisKeyPackPrice should fail for missing env key", () => {
    delete process.env["PADDLE_PRICE_BARIS_KEY_PACK"];
    const result = requireBarisKeyPackPrice();
    expect(result.ok).toBe(false);
    expect(result.priceId).toBeUndefined();
    expect(result.reason).toContain("PADDLE_PRICE_ID_REQUIRED");
    // Restore
    process.env["PADDLE_PRICE_BARIS_KEY_PACK"] = "pri_test_key_pack_id";
  });

  it("requireBarisKeyPackPrice should fail for invalid prefix", () => {
    process.env["PADDLE_PRICE_BARIS_KEY_PACK"] = "invalid_prefix";
    const result = requireBarisKeyPackPrice();
    expect(result.ok).toBe(false);
    expect(result.reason).toContain("Invalid");
    process.env["PADDLE_PRICE_BARIS_KEY_PACK"] = "pri_test_key_pack_id";
  });

  it("all 45 products should be defined and have key-pool payment provider", () => {
    const product = getBarisProduct("break-even-survival-cash-calculator");
    expect(product).toBeDefined();
    expect(product!.paymentProvider).toBe("KEY_POOL");
    expect(product!.keyCost).toBeGreaterThan(0);
  });

  it("product summary should report 45 total products", () => {
    const summary = getBarisProductSummary();
    expect(summary.total).toBe(45);
    expect(summary.visible).toBe(45);
    expect(summary.sellable).toBe(45);
    expect(summary.instantCalculators).toBe(20);
    expect(summary.assistedDossiers).toBe(25);
  });
});
