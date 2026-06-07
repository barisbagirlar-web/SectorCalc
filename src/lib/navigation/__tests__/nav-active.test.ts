import { describe, expect, test } from "vitest";
import { isAuditHubPath, isNavLinkActive } from "@/lib/navigation/nav-active";

describe("nav-active", () => {
  test("audit paths do not activate pricing", () => {
    expect(isNavLinkActive("/en/audit", "/pricing")).toBe(false);
    expect(isNavLinkActive("/en/audit/cnc", "/pricing")).toBe(false);
    expect(isAuditHubPath("/en/audit")).toBe(true);
    expect(isAuditHubPath("/en/audit/logistics")).toBe(true);
  });

  test("pricing active only on pricing route", () => {
    expect(isNavLinkActive("/en/pricing", "/pricing")).toBe(true);
    expect(isNavLinkActive("/en/audit", "/pricing")).toBe(false);
    expect(isNavLinkActive("/en/free-tools", "/pricing")).toBe(false);
  });

  test("tools active on free-tools and free tool pages", () => {
    expect(isNavLinkActive("/en/free-tools", "/free-tools")).toBe(true);
    expect(isNavLinkActive("/en/tools/free/area-converter", "/free-tools")).toBe(true);
  });
});
