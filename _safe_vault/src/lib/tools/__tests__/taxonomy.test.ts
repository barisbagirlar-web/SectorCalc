/* eslint-disable */
// @ts-nocheck

import { describe, expect, it } from "vitest";
import { assertUniqueTaxonomySectorIcons, TAXONOMY_SECTOR_ICON_NAMES } from "@/lib/catalog/taxonomy-sector-icon-map";
import { assertUniqueSectorIcons, ALL_TOOLS_SECTOR, OTHER_SECTOR, SECTORS } from "@/lib/tools/taxonomy";

describe("taxonomy sectors", () => {
  it("defines at least 30 sectors with unique Lucide icons", () => {
    expect(SECTORS.length).toBeGreaterThanOrEqual(30);
    expect(() => assertUniqueSectorIcons()).not.toThrow();
    expect(() => assertUniqueTaxonomySectorIcons()).not.toThrow();
  });

  it("fills keywords and professions for every sector", () => {
    for (const sector of SECTORS) {
      expect(sector.keywords.length).toBeGreaterThan(5);
      expect(sector.professions.length).toBeGreaterThan(2);
    }
    expect(ALL_TOOLS_SECTOR.id).toBe("all");
  });

  it("keeps taxonomy icon keys in sync with taxonomy-sector-icon-map", () => {
    for (const sector of SECTORS) {
      expect(TAXONOMY_SECTOR_ICON_NAMES[sector.id as keyof typeof TAXONOMY_SECTOR_ICON_NAMES]).toBe(
        sector.icon,
      );
    }
    expect(ALL_TOOLS_SECTOR.icon).toBe(TAXONOMY_SECTOR_ICON_NAMES.all);
    expect(OTHER_SECTOR.icon).toBe(TAXONOMY_SECTOR_ICON_NAMES.diger);
  });
});
