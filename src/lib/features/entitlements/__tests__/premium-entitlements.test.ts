import { describe, expect, test } from "vitest";
import {
  FULL_ENTITLEMENT,
  PREVIEW_ENTITLEMENT,
  getPremiumEntitlement,
  isClientCheckoutSessionTrusted,
} from "@/lib/features/entitlements/premium-entitlements";

describe("premium-entitlements", () => {
  test("none => canViewFullReport false", () => {
    const entitlement = getPremiumEntitlement({ level: "none" });
    expect(entitlement.level).toBe("none");
    expect(entitlement.canViewFullReport).toBe(false);
    expect(entitlement.canExportPdf).toBe(false);
    expect(entitlement.canExportCsv).toBe(false);
  });

  test("preview => export false", () => {
    const entitlement = getPremiumEntitlement({ level: "preview" });
    expect(entitlement.level).toBe("preview");
    expect(entitlement.canViewFullReport).toBe(false);
    expect(entitlement.canExportPdf).toBe(false);
    expect(entitlement.canExportCsv).toBe(false);
  });

  test("single_report => export true", () => {
    const entitlement = getPremiumEntitlement({ hasSingleReportForSchema: true });
    expect(entitlement.level).toBe("single_report");
    expect(entitlement.canViewFullReport).toBe(true);
    expect(entitlement.canExportPdf).toBe(true);
    expect(entitlement.canExportCsv).toBe(true);
  });

  test("pro => export true", () => {
    const entitlement = getPremiumEntitlement({ hasProSubscription: true });
    expect(entitlement.level).toBe("pro");
    expect(entitlement.canExportCsv).toBe(true);
    expect(entitlement.canExportPdf).toBe(true);
  });

  test("team => canSaveReport true", () => {
    const entitlement = getPremiumEntitlement({
      hasProSubscription: true,
      subscriptionPlan: "team",
    });
    expect(entitlement.level).toBe("team");
    expect(entitlement.canSaveReport).toBe(true);
    expect(entitlement.canExportCsv).toBe(true);
  });

  test("admin => full true", () => {
    const entitlement = getPremiumEntitlement({ isAdmin: true });
    expect(entitlement.level).toBe("admin");
    expect(entitlement.canViewFullReport).toBe(true);
    expect(entitlement.canExportPdf).toBe(true);
    expect(entitlement.canExportCsv).toBe(true);
    expect(entitlement.canSaveReport).toBe(true);
    expect(entitlement.canViewAdvancedDrivers).toBe(true);
  });

  test("preview entitlement constant matches preview level", () => {
    expect(PREVIEW_ENTITLEMENT.canViewFullReport).toBe(false);
    expect(FULL_ENTITLEMENT.canViewFullReport).toBe(true);
  });

  test("client session_id alone is never trusted for full entitlement", () => {
    expect(isClientCheckoutSessionTrusted("cs_test_123")).toBe(false);
    expect(isClientCheckoutSessionTrusted(undefined)).toBe(false);
    const entitlement = getPremiumEntitlement({ level: "preview" });
    expect(entitlement.canViewFullReport).toBe(false);
  });
});
