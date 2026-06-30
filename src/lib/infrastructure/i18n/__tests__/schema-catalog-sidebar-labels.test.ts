import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getFreeTools } from "@/lib/features/tools/all-tools-data";
import {
  resolveSchemaCatalogCategoryLabel,
  resolveSchemaCatalogSectorLabel,
} from "@/lib/infrastructure/i18n/schema-catalog-sidebar-labels";
import { SUPPORTED_LOCALES } from "@/lib/infrastructure/i18n/locale-config";

describe("schema-catalog-sidebar-labels", () => {
  it("resolves category labels for every supported locale", () => {
    for (const locale of SUPPORTED_LOCALES) {
      if (locale === "tr") {
        expect(resolveSchemaCatalogCategoryLabel("finans-kredi", locale)).toBe("Finans & Kredi");
      } else {
        expect(resolveSchemaCatalogCategoryLabel("finans-kredi", locale)).not.toContain("Finans &");
      }
    }
  });

  it("resolves sector labels for every supported locale", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const label = resolveSchemaCatalogSectorLabel("uretim-imalat", locale);
      expect(label.length).toBeGreaterThan(0);
      if (locale !== "tr") {
        expect(label).not.toContain("Üretim");
      }
    }
  });
});

describe("all-tools-data locale labels", () => {
  it("localizes free-tool categories outside Turkish", () => {
    const enTools = getFreeTools("en");
    const trTools = getFreeTools("tr");

    // Find a category present in both EN and TR data with different labels
    const enFinance = enTools.find((tool) => tool.categoryKey === "finance-sales-working-capital");
    const trFinance = trTools.find((tool) => tool.categoryKey === "finance-sales-working-capital");

    expect(enFinance?.category).toBe("Finance, Sales & Working Capital");
    expect(trFinance?.category).toBe("Finans, Satış ve İşletme Sermayesi");
  });
});
