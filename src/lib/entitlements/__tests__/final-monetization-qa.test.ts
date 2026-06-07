import { describe, expect, test } from "vitest";
import {
  resolveEntitlementLevelFromRecords,
} from "@/lib/entitlements/entitlement-mapping";
import type { PremiumEntitlementRecord } from "@/lib/entitlements/entitlement-types";
import {
  entitlementDocIdForStripeSession,
} from "@/lib/entitlements/entitlement-types";
import {
  getPremiumEntitlement,
  getPremiumEntitlementFromBillingState,
  isClientCheckoutSessionTrusted,
} from "@/lib/entitlements/premium-entitlements";

const now = new Date().toISOString();
const SLUG_A = "cnc-oee-loss";
const SLUG_B = "logistics-route-loss";

function buildRecord(
  overrides: Partial<PremiumEntitlementRecord> & Pick<PremiumEntitlementRecord, "plan">
): PremiumEntitlementRecord {
  const { plan, ...rest } = overrides;
  return {
    id: "ent_1",
    userId: "user_1",
    status: "active",
    createdAt: now,
    updatedAt: now,
    source: "stripe_checkout",
    ...rest,
    plan,
  };
}

describe("final-monetization-qa", () => {
  test("no entitlement => canViewFullReport false", () => {
    const entitlement = getPremiumEntitlementFromBillingState({
      premiumSlug: SLUG_A,
      entitlementRecords: [],
    });
    expect(entitlement.canViewFullReport).toBe(false);
  });

  test("no entitlement => canExportPdf false", () => {
    const entitlement = getPremiumEntitlementFromBillingState({
      premiumSlug: SLUG_A,
      entitlementRecords: [],
    });
    expect(entitlement.canExportPdf).toBe(false);
  });

  test("active single_report matching slug => canViewFullReport true", () => {
    const entitlement = getPremiumEntitlementFromBillingState({
      premiumSlug: SLUG_A,
      entitlementRecords: [
        buildRecord({
          plan: "single_report",
          premiumSlug: SLUG_A,
          reportLimit: 1,
          reportsUsed: 0,
        }),
      ],
    });
    expect(entitlement.canViewFullReport).toBe(true);
    expect(entitlement.level).toBe("single_report");
  });

  test("active single_report non-matching slug => canViewFullReport false", () => {
    const entitlement = getPremiumEntitlementFromBillingState({
      premiumSlug: SLUG_A,
      entitlementRecords: [
        buildRecord({
          plan: "single_report",
          premiumSlug: SLUG_B,
          reportLimit: 1,
          reportsUsed: 0,
        }),
      ],
    });
    expect(entitlement.canViewFullReport).toBe(false);
    expect(entitlement.level).toBe("preview");
  });

  test("active pro => canExportCsv true", () => {
    const entitlement = getPremiumEntitlementFromBillingState({
      premiumSlug: SLUG_A,
      entitlementRecords: [buildRecord({ plan: "pro" })],
    });
    expect(entitlement.canExportCsv).toBe(true);
  });

  test("active team => canSaveReport true", () => {
    const entitlement = getPremiumEntitlementFromBillingState({
      premiumSlug: SLUG_A,
      entitlementRecords: [buildRecord({ plan: "team" })],
    });
    expect(entitlement.canSaveReport).toBe(true);
    expect(entitlement.level).toBe("team");
  });

  test("canceled pro => no access", () => {
    const level = resolveEntitlementLevelFromRecords(
      [buildRecord({ plan: "pro", status: "canceled" })],
      SLUG_A
    );
    expect(level).toBe("preview");
    expect(getPremiumEntitlement({ level }).canExportPdf).toBe(false);
  });

  test("expired entitlement => no access", () => {
    const level = resolveEntitlementLevelFromRecords(
      [
        buildRecord({
          plan: "pro",
          status: "active",
          expiresAt: "2020-01-01T00:00:00.000Z",
        }),
      ],
      SLUG_A
    );
    expect(level).toBe("preview");
  });

  test("session_id alone => no access", () => {
    expect(isClientCheckoutSessionTrusted("cs_test_live_123")).toBe(false);
    const entitlement = getPremiumEntitlementFromBillingState({
      premiumSlug: SLUG_A,
      entitlementRecords: [],
    });
    expect(entitlement.canViewFullReport).toBe(false);
  });

  test("duplicate webhook doc id is deterministic (idempotent)", () => {
    const sessionId = "cs_test_abc123";
    expect(entitlementDocIdForStripeSession(sessionId)).toBe("stripe_session_cs_test_abc123");
    expect(entitlementDocIdForStripeSession(sessionId)).toBe(
      entitlementDocIdForStripeSession(sessionId)
    );
  });
});
