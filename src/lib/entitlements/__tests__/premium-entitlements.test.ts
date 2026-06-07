import { describe, expect, test } from "vitest";
import {
  FULL_ENTITLEMENT,
  PREVIEW_ENTITLEMENT,
  getPremiumEntitlement,
} from "@/lib/entitlements/premium-entitlements";

describe("premium-entitlements", () => {
  test("none => canViewFullReport false", () => {
    const entitlement = getPremiumEntitlement({ level: "none" });
    expect(entitlement.level).toBe("none");
    expect(entitlement.canViewFullReport).toBe(false);
    expect(entitlement.canExportPdf).toBe(false);
    expect(entitlement.canExportCsv).toBe(false);
  });

  test("preview => canExportPdf false", () => {
    const entitlement = getPremiumEntitlement({ level: "preview" });
    expect(entitlement.level).toBe("preview");
    expect(entitlement.canViewFullReport).toBe(false);
    expect(entitlement.canExportPdf).toBe(false);
    expect(entitlement.canExportCsv).toBe(false);
  });

  test("single_report => canViewFullReport true", () => {
    const entitlement = getPremiumEntitlement({ hasSingleReportForSchema: true });
    expect(entitlement.level).toBe("single_report");
    expect(entitlement.canViewFullReport).toBe(true);
  });

  test("pro => canExportCsv true", () => {
    const entitlement = getPremiumEntitlement({ hasProSubscription: true });
    expect(entitlement.level).toBe("pro");
    expect(entitlement.canExportCsv).toBe(true);
  });

  test("team => canSaveReport true", () => {
    const entitlement = getPremiumEntitlement({ level: "team" });
    expect(entitlement.level).toBe("team");
    expect(entitlement.canSaveReport).toBe(true);
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
});
