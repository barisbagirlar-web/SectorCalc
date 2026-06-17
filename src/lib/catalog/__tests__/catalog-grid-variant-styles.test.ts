import { describe, expect, it } from "vitest";
import { CATALOG_GRID_VARIANT_STYLES } from "@/lib/catalog/catalog-grid-variant-styles";

describe("catalog-grid-variant-styles", () => {
  it("uses navy blue for free and industry tiles", () => {
    expect(CATALOG_GRID_VARIANT_STYLES.free.icon).toBe("text-[var(--sc-navy)]");
    expect(CATALOG_GRID_VARIANT_STYLES.free.active).toContain("border-blue-500");
    expect(CATALOG_GRID_VARIANT_STYLES.industry.icon).toBe("text-[var(--sc-navy)]");
    expect(CATALOG_GRID_VARIANT_STYLES.industry.active).toContain("border-blue-500");
  });

  it("uses burgundy for premium tiles", () => {
    expect(CATALOG_GRID_VARIANT_STYLES.premium.icon).toBe("text-[#8B2635]");
    expect(CATALOG_GRID_VARIANT_STYLES.premium.active).toContain("border-[#8B2635]");
  });
});
