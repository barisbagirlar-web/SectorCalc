import { describe, expect, it } from "vitest";
import {
  CATALOG_HUB_MAX_TILES,
  filterCatalogHubTools,
  limitCatalogHubTiles,
  resolveCatalogHubSectorFilter,
} from "@/lib/tools/filter-catalog-hub-tools";
import type { ToolData } from "@/lib/tools/all-tools-data";

const sampleTools: ToolData[] = [
  {
    slug: "alpha-calculator",
    name: "Alpha Calculator",
    category: "Cost",
    categoryKey: "cost-margin",
    sector: "Manufacturing",
    sectorKey: "makine",
    description: "Alpha calculator for manufacturing cost analysis",
    premiumRequired: false,
    href: "/tools/generated/alpha-calculator",
  },
  {
    slug: "beta-calculator",
    name: "Beta Finance",
    category: "Finance",
    categoryKey: "finance",
    sector: "Finance",
    sectorKey: "finans",
    description: "Beta finance calculator",
    premiumRequired: false,
    href: "/tools/generated/beta-calculator",
  },
];

describe("filterCatalogHubTools", () => {
  it("filters by sector and search query", () => {
    const sectorFiltered = filterCatalogHubTools(sampleTools, {
      locale: "en",
      sectorKey: resolveCatalogHubSectorFilter("makine"),
    });
    expect(sectorFiltered).toHaveLength(1);
    expect(sectorFiltered[0]?.slug).toBe("alpha-calculator");

    const searchFiltered = filterCatalogHubTools(sampleTools, {
      locale: "en",
      searchQuery: "finance",
    });
    expect(searchFiltered).toHaveLength(1);
    expect(searchFiltered[0]?.slug).toBe("beta-calculator");
  });

  it("caps visible tiles for SSG safety", () => {
    const many = Array.from({ length: CATALOG_HUB_MAX_TILES + 10 }, (_, index) => ({
      ...sampleTools[0]!,
      slug: `tool-${index}`,
      name: `Tool ${index}`,
    }));
    expect(limitCatalogHubTiles(many)).toHaveLength(CATALOG_HUB_MAX_TILES);
  });
});
