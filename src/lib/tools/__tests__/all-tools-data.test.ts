import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getAllTools, getFreeTools, getPremiumTools } from "@/lib/tools/all-tools-data";

describe("all-tools-data", () => {
  it("includes slug-based premium schemas from filenames", () => {
    const premiumTools = getPremiumTools("en");
    const slugOnlyPremium = premiumTools.find(
      (tool) => tool.slug === "auto-repair-parts-labor-quote",
    );

    expect(slugOnlyPremium).toBeDefined();
    expect(slugOnlyPremium?.name.length).toBeGreaterThan(0);
    expect(slugOnlyPremium?.premiumRequired).toBe(true);
  });

  it("includes legacy toolName-based schemas", () => {
    const allTools = getAllTools("en");
    const legacyTool = allTools.find((tool) => tool.slug === "margin-calculator");

    expect(legacyTool).toBeDefined();
    expect(legacyTool?.premiumRequired).toBe(false);
  });

  it("returns more free tools than premium tools in the current catalog", () => {
    const freeTools = getFreeTools("en");
    const premiumTools = getPremiumTools("en");

    expect(freeTools.length).toBeGreaterThan(0);
    expect(freeTools.length).toBeGreaterThan(premiumTools.length);
  });
});
