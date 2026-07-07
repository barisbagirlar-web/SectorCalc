// SectorCalc PRO V5.3.1 — Productization Test
// Verifies 45 products are correctly configured for sale.
import { describe, it, expect } from "vitest";
import {
  BARIS_PRO_PRODUCTS,
  getBarisProduct,
  getInstantCalculatorProducts,
  getAssistedDossierProducts,
  getBarisProductSummary,
} from "../../src/sectorcalc/pro-commerce/baris-pro-products";

describe("Baris PRO Productization", () => {
  it("should have 45 products total", () => {
    expect(BARIS_PRO_PRODUCTS.length).toBe(45);
  });

  it("should have 45 visible products", () => {
    expect(BARIS_PRO_PRODUCTS.every(p => p.visible === true)).toBe(true);
  });

  it("should have 45 sellable products", () => {
    expect(BARIS_PRO_PRODUCTS.every(p => p.sellable === true)).toBe(true);
  });

  it("should have 20 instant calculator products", () => {
    expect(getInstantCalculatorProducts().length).toBe(20);
  });

  it("should have 25 assisted dossier products", () => {
    expect(getAssistedDossierProducts().length).toBe(25);
  });

  it("summary should be correct", () => {
    const s = getBarisProductSummary();
    expect(s.total).toBe(45);
    expect(s.visible).toBe(45);
    expect(s.sellable).toBe(45);
    expect(s.instantCalculators).toBe(20);
    expect(s.assistedDossiers).toBe(25);
  });

  it("all products should require entitlement", () => {
    expect(BARIS_PRO_PRODUCTS.every(p => p.entitlementRequired === true)).toBe(true);
  });

  it("all products should have keyCost", () => {
    const allHaveKey = BARIS_PRO_PRODUCTS.every(p =>
      p.keyCost && p.keyCost > 0
    );
    expect(allHaveKey).toBe(true);
  });

  it("instant calculators should have correct product mode", () => {
    for (const p of getInstantCalculatorProducts()) {
      expect(p.productMode).toBe("INSTANT_PRO_CALCULATOR");
      expect(p.executionMode).toBe("LIVE_ENGINE_READY");
      expect(p.paymentProductType).toBe("PRO_INSTANT_CALCULATOR");
      expect(p.instantResultAvailable).toBe(true);
      expect(p.ctaLabel).toBe("Start PRO Calculation");
      expect(p.publicBadge).toBe("PRO Calculator");
    }
  });

  it("assisted dossier products should have correct product mode", () => {
    for (const p of getAssistedDossierProducts()) {
      expect(p.productMode).toBe("ASSISTED_PRO_DOSSIER");
      expect(p.executionMode).toBe("DISABLED_UNTIL_FORMULA_READY");
      expect(p.paymentProductType).toBe("PRO_DOSSIER_REQUEST");
      expect(p.instantResultAvailable).toBe(false);
      expect(p.ctaLabel).toBe("Start PRO Dossier Request");
      expect(p.publicBadge).toBe("PRO Dossier");
    }
  });

  it("should have no forbidden claims in labels", () => {
    const forbidden = ["Certified", "Approved", "Legal proof", "Guaranteed compliance", "Instant result"];
    for (const p of BARIS_PRO_PRODUCTS) {
      for (const claim of forbidden) {
        expect(p.publicBadge).not.toContain(claim);
        expect(p.publicNotice).not.toContain(claim);
        expect(p.ctaLabel).not.toContain(claim);
      }
    }
  });

  it("should not have hardcoded price IDs (keyCost should be numeric)", () => {
    for (const p of BARIS_PRO_PRODUCTS) {
      expect(p.keyCost).toEqual(expect.any(Number));
      expect(p.keyCost).toBeGreaterThan(0);
    }
  });

  it("getBarisProduct should return correct product", () => {
    const p = getBarisProduct("break-even-survival-cash-calculator");
    expect(p).toBeDefined();
    expect(p!.productMode).toBe("INSTANT_PRO_CALCULATOR");
    expect(p!.priceUsd).toBeGreaterThan(0);

    const q = getBarisProduct("nonexistent-tool");
    expect(q).toBeUndefined();
  });
});
