/**
 * Entitlement & Payment Integration Tests
 *
 * Tests the Maintenance BOM Recovery entitlement module:
 * - Price integrity (149 credits)
 * - Credit cost calculation
 * - Entitlement status derivation
 * - Checkout data correctness
 */

import { describe, it, expect } from "vitest";
import {
  MAINTENANCE_BOM_CREDIT_COST,
  deriveEntitlementStatus,
  getCheckoutData,
} from "@/lib/document-intelligence/entitlements/maintenance-bom-entitlement";

describe("Maintenance BOM Entitlement", () => {
  it("has correct credit cost of 149", () => {
    expect(MAINTENANCE_BOM_CREDIT_COST).toBe(149);
  });

  it("getCheckoutData returns correct product info", () => {
    const data = getCheckoutData();
    expect(data.productCode).toBe("maintenance_bom_recovery_verified_job_v1");
    expect(data.creditCost).toBe(149);
    expect(data.priceCredits).toBe(149);
    expect(data.allowedPages).toBe(50);
    expect(data.allowedRows).toBe(500);
  });

  it("deriveEntitlementStatus returns consumed for paid", () => {
    expect(deriveEntitlementStatus("paid")).toBe("consumed");
  });

  it("deriveEntitlementStatus returns reserved for checkout_pending", () => {
    expect(deriveEntitlementStatus("checkout_pending")).toBe("reserved");
  });

  it("deriveEntitlementStatus returns released for refunded", () => {
    expect(deriveEntitlementStatus("refunded")).toBe("released");
  });

  it("deriveEntitlementStatus returns released for chargeback", () => {
    expect(deriveEntitlementStatus("chargeback")).toBe("released");
  });

  it("deriveEntitlementStatus returns none for unpaid", () => {
    expect(deriveEntitlementStatus("unpaid")).toBe("none");
  });

  it("deriveEntitlementStatus returns none for payment_failed", () => {
    expect(deriveEntitlementStatus("payment_failed")).toBe("none");
  });

  it("price invariant: 149 credits, product code all match", () => {
    const data = getCheckoutData();
    expect(data.creditCost).toBe(149);
    expect(data.priceCredits).toBe(149);
    expect(data.productCode).toBe("maintenance_bom_recovery_verified_job_v1");
  });
});
