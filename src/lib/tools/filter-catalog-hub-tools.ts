import type { ToolData } from "@/lib/tools/all-tools-data";

export const CATALOG_HUB_MAX_TILES = 240;
export const CATALOG_HUB_JSONLD_MAX_ITEMS = 100;

function normalizeSearchText(value: string, locale: string): string {
  return value
    .toLocaleLowerCase(locale)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

export function resolveCatalogHubSectorFilter(rawSector: string | undefined): string {
  if (!rawSector || rawSector === "all") {
    return "";
  }
  return rawSector;
}

export function resolveCatalogHubSearchQuery(rawQuery: string | undefined): string {
  return typeof rawQuery === "string" ? rawQuery.trim() : "";
}

export function filterCatalogHubTools(
  tools: readonly ToolData[],
  options: {
    readonly locale: string;
    readonly sectorKey?: string;
    readonly searchQuery?: string;
  },
): ToolData[] {
  const sectorKey = options.sectorKey ?? "";
  const query = normalizeSearchText(options.searchQuery ?? "", options.locale);

  return tools.filter((tool) => {
    if (sectorKey && tool.sectorKey !== sectorKey) {
      return false;
    }
    if (!query) {
      return true;
    }
    const haystack = normalizeSearchText(
      [tool.name, tool.slug, tool.category, tool.sector].join(" "),
      options.locale,
    );
    return haystack.includes(query);
  });
}

export function limitCatalogHubTiles<T>(items: readonly T[], max = CATALOG_HUB_MAX_TILES): readonly T[] {
  return items.length <= max ? items : items.slice(0, max);
}
