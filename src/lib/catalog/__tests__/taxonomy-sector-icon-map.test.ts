import { describe, expect, it } from "vitest";
import {
  TAXONOMY_SECTOR_ICON_MAP,
  assertUniqueTaxonomySectorIcons,
  getTaxonomySectorIcon,
  listTaxonomySectorIconSlugs,
} from "@/lib/catalog/taxonomy-sector-icon-map";
import { ALL_TOOLS_SECTOR, OTHER_SECTOR, SECTORS } from "@/lib/tools/taxonomy";

describe("taxonomy-sector-icon-map", () => {
  it("covers every taxonomy sector id plus all and diger", () => {
    const required = new Set([
      ALL_TOOLS_SECTOR.id,
      OTHER_SECTOR.id,
      ...SECTORS.map((sector) => sector.id),
    ]);
    for (const slug of required) {
      expect(TAXONOMY_SECTOR_ICON_MAP[slug as keyof typeof TAXONOMY_SECTOR_ICON_MAP]).toBeDefined();
    }
    expect(listTaxonomySectorIconSlugs().length).toBeGreaterThanOrEqual(required.size);
  });

  it("uses unique icon components per sector slug", () => {
    expect(() => assertUniqueTaxonomySectorIcons()).not.toThrow();
  });

  it("resolves the all-tools tile with LayoutGrid", () => {
    expect(getTaxonomySectorIcon("all")).toBe(TAXONOMY_SECTOR_ICON_MAP.all);
  });
});
