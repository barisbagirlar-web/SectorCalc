import { describe, expect, test } from "vitest";
import { isAuditHubPath, isNavLinkActive } from "@/lib/navigation/nav-active";

describe("nav-active", () => {
  test("audit paths do not activate pricing", () => {
    expect(isNavLinkActive("/audit", "/pricing")).toBe(false);
    expect(isNavLinkActive("/audit/cnc", "/pricing")).toBe(false);
    expect(isAuditHubPath("/audit")).toBe(true);
    expect(isAuditHubPath("/audit/logistics")).toBe(true);
    expect(isNavLinkActive("/tr/audit", "/pricing")).toBe(false);
    expect(isAuditHubPath("/tr/audit/cnc")).toBe(true);
  });

  test("pricing active only on pricing route", () => {
    expect(isNavLinkActive("/pricing", "/pricing")).toBe(true);
    expect(isNavLinkActive("/tr/pricing", "/pricing")).toBe(true);
    expect(isNavLinkActive("/audit", "/pricing")).toBe(false);
    expect(isNavLinkActive("/free-tools", "/pricing")).toBe(false);
  });

  test("tools active on free-tools and free tool pages", () => {
    expect(isNavLinkActive("/free-tools", "/free-tools")).toBe(true);
    expect(isNavLinkActive("/tools/free/area-converter", "/free-tools")).toBe(true);
    expect(isNavLinkActive("/tr/free-tools", "/free-tools")).toBe(true);
    expect(isNavLinkActive("/tr/tools/free/area-converter", "/free-tools")).toBe(true);
  });

  test("premium tools active on premium catalog and premium tool pages", () => {
    expect(isNavLinkActive("/premium-tools", "/premium-tools")).toBe(true);
    expect(isNavLinkActive("/tr/premium-tools", "/premium-tools")).toBe(true);
    expect(isNavLinkActive("/tools/premium-schema/margin-leak", "/premium-tools")).toBe(true);
    expect(isNavLinkActive("/free-tools", "/premium-tools")).toBe(false);
  });
});
