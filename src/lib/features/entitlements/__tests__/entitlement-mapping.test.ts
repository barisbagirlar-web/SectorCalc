import { describe, expect, test } from "vitest";
import {
  hasSingleReportEntitlementForSlug,
  resolveEntitlementLevelFromRecords,
} from "@/lib/features/entitlements/entitlement-mapping";
import type { PremiumEntitlementRecord } from "@/lib/features/entitlements/entitlement-types";
import { isClientCheckoutSessionTrusted } from "@/lib/features/entitlements/premium-entitlements";

const now = new Date().toISOString();

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

describe("entitlement-mapping", () => {
  test("active pro => full access", () => {
    const records = [buildRecord({ plan: "pro" })];
    expect(resolveEntitlementLevelFromRecords(records, "cnc-oee-loss")).toBe("pro");
  });

  test("active team => full access", () => {
    const records = [buildRecord({ plan: "team" })];
    expect(resolveEntitlementLevelFromRecords(records, "cnc-oee-loss")).toBe("team");
  });

  test("active single_report + matching premiumSlug => full access", () => {
    const records = [
      buildRecord({
        plan: "single_report",
        premiumSlug: "cnc-oee-loss",
        reportLimit: 1,
        reportsUsed: 0,
      }),
    ];
    expect(resolveEntitlementLevelFromRecords(records, "cnc-oee-loss")).toBe("single_report");
  });

  test("active single_report + non-matching premiumSlug => no full access", () => {
    const records = [
      buildRecord({
        plan: "single_report",
        premiumSlug: "logistics-route-loss",
        reportLimit: 1,
        reportsUsed: 0,
      }),
    ];
    expect(resolveEntitlementLevelFromRecords(records, "cnc-oee-loss")).toBe("preview");
  });

  test("canceled pro => no access", () => {
    const records = [buildRecord({ plan: "pro", status: "canceled" })];
    expect(resolveEntitlementLevelFromRecords(records, "cnc-oee-loss")).toBe("preview");
  });

  test("expired entitlement => no access", () => {
    const records = [
      buildRecord({
        plan: "pro",
        status: "active",
        expiresAt: "2020-01-01T00:00:00.000Z",
      }),
    ];
    expect(resolveEntitlementLevelFromRecords(records, "cnc-oee-loss")).toBe("preview");
  });

  test("session_id alone => no access", () => {
    expect(isClientCheckoutSessionTrusted("cs_test_123")).toBe(false);
  });

  test("multiple records pro wins", () => {
    const records = [
      buildRecord({ id: "single", plan: "single_report", premiumSlug: "cnc-oee-loss" }),
      buildRecord({ id: "pro", plan: "pro" }),
    ];
    expect(resolveEntitlementLevelFromRecords(records, "cnc-oee-loss")).toBe("pro");
  });

  test("reportLimit reached => no single report access", () => {
    const record = buildRecord({
      plan: "single_report",
      premiumSlug: "cnc-oee-loss",
      reportLimit: 1,
      reportsUsed: 1,
    });
    expect(hasSingleReportEntitlementForSlug(record, "cnc-oee-loss")).toBe(false);
    expect(resolveEntitlementLevelFromRecords([record], "cnc-oee-loss")).toBe("preview");
  });

  test("unknown plan normalized out => preview", () => {
    const records: PremiumEntitlementRecord[] = [];
    expect(resolveEntitlementLevelFromRecords(records, "cnc-oee-loss")).toBe("preview");
  });
});
