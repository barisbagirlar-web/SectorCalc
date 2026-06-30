import { describe, expect, it } from "vitest";
import {
  INDUSTRY_SLUG_ICON_MAP,
  assertUniqueIndustrySlugIcons,
  listIndustrySlugIconSlugs,
} from "@/lib/catalog/industry-slug-icon-map";
import { industryRegistry } from "@/lib/tools/industry-registry";

describe("industry-slug-icon-map", () => {
  it("covers every industry registry slug exactly once", () => {
    expect(listIndustrySlugIconSlugs().length).toBe(industryRegistry.length);
    for (const entry of industryRegistry) {
      expect(INDUSTRY_SLUG_ICON_MAP[entry.slug]).toBeDefined();
    }
  });

  it("uses unique icon components per industry slug", () => {
    expect(() => assertUniqueIndustrySlugIcons()).not.toThrow();
  });
});
