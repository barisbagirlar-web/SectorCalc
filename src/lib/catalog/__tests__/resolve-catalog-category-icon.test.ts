import { describe, expect, it, vi } from "vitest";
import { resolveCatalogCategoryIcon } from "@/lib/catalog/resolve-catalog-category-icon";
import { listGlobalCategorySlugs } from "@/lib/catalog/global-tool-category-taxonomy";
import { listIndustrySlugIconSlugs } from "@/lib/catalog/industry-slug-icon-map";
import { HOMEPAGE_COVERAGE_IDS } from "@/lib/home/homepage-positioning-data";
import { LEGACY_CATALOG_ICON_ALIASES } from "@/lib/catalog/legacy-catalog-icon-aliases";

vi.mock("server-only", () => ({}));

import { getAllTools } from "@/lib/tools/all-tools-data";

describe("resolveCatalogCategoryIcon", () => {
  it("resolves all global category slugs", () => {
    for (const slug of listGlobalCategorySlugs()) {
      expect(resolveCatalogCategoryIcon(slug)).toBeDefined();
    }
  });

  it("resolves all industry slugs", () => {
    for (const slug of listIndustrySlugIconSlugs()) {
      expect(resolveCatalogCategoryIcon(slug)).toBeDefined();
    }
  });

  it("resolves homepage coverage ids", () => {
    for (const id of HOMEPAGE_COVERAGE_IDS) {
      expect(resolveCatalogCategoryIcon(id)).toBeDefined();
    }
  });

  it("resolves legacy aliases without throwing", () => {
    for (const slug of Object.keys(LEGACY_CATALOG_ICON_ALIASES)) {
      expect(resolveCatalogCategoryIcon(slug)).toBeDefined();
    }
  });

  it("returns fallback for unknown slugs instead of throwing", () => {
    expect(resolveCatalogCategoryIcon("unknown-slug-xyz")).toBeDefined();
  });

  it("resolves every catalog category and sector key from live tool data", () => {
    const tools = getAllTools("en");
    const slugs = new Set<string>(["all"]);
    for (const tool of tools) {
      slugs.add(tool.categoryKey);
      slugs.add(tool.sectorKey);
    }
    for (const slug of slugs) {
      expect(resolveCatalogCategoryIcon(slug)).toBeDefined();
    }
  });
});
