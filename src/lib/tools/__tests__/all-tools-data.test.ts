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

  it("prefers metadata categorySlug over legacy schema category label", () => {
    const tool = getAllTools("en").find((entry) => entry.slug === "margin-calculator");
    expect(tool?.categoryKey).toBe("finance-sales-working-capital");
  });

  it("resolves localized sector labels for all supported locales", async () => {
    const { SUPPORTED_LOCALES } = await import("@/lib/i18n/locale-config");
    for (const locale of SUPPORTED_LOCALES) {
      const tool = getAllTools(locale).find((entry) => entry.sectorKey === "cnc-manufacturing");
      expect(tool?.sector.length).toBeGreaterThan(0);
    }
  });
});
