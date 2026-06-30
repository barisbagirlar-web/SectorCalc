import { getTranslations } from "next-intl/server";
import { ToolsTileGrid } from "@/components/tools/ToolsTileGrid";
import type { ToolData } from "@/lib/tools/all-tools-data";
import {
  CATALOG_HUB_MAX_TILES,
  filterCatalogHubTools,
  limitCatalogHubTiles,
  resolveCatalogHubSearchQuery,
  resolveCatalogHubSectorFilter,
} from "@/lib/tools/filter-catalog-hub-tools";
import { toCatalogHubToolTile } from "@/lib/tools/catalog-hub-tool-tile";

type CatalogHubToolsSectionProps = {
  readonly locale: string;
  readonly tools: readonly ToolData[];
  readonly variant: "free-tools" | "premium-tools" | "industries";
  readonly sectorFilter?: string;
  readonly searchQuery?: string;
};

export async function CatalogHubToolsSection({
  locale,
  tools,
  variant,
  sectorFilter,
  searchQuery,
}: CatalogHubToolsSectionProps) {
  const t = await getTranslations({ locale, namespace: "catalogExplorer" });
  const filteredTools = filterCatalogHubTools(tools, {
    locale,
    sectorKey: resolveCatalogHubSectorFilter(sectorFilter),
    searchQuery: resolveCatalogHubSearchQuery(searchQuery),
  });
  const visibleTools = limitCatalogHubTiles(filteredTools, CATALOG_HUB_MAX_TILES);
  const tileTools = visibleTools.map(toCatalogHubToolTile);
  const allLabel = t(`labels.${variant}.allLabel`);
  const activeSector = resolveCatalogHubSectorFilter(sectorFilter);
  const activeSectorLabel = activeSector
    ? tools.find((tool) => tool.sectorKey === activeSector)?.sector ?? activeSector
    : allLabel;

  return (
    <div className="min-w-0 flex-1" id="tools-list">
      <header className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          {activeSector ? t(`labels.${variant}.categoryToolsTitle`, { category: activeSectorLabel }) : allLabel}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {t(`labels.${variant}.categoryToolsSubtitle`, { count: filteredTools.length })}
        </p>
        {filteredTools.length > visibleTools.length ? (
          <p className="mt-2 text-xs text-body-charcoal" role="status">
            {t("search.showingLimited", {
              shown: visibleTools.length,
              total: filteredTools.length,
            })}
          </p>
        ) : null}
      </header>

      {tileTools.length > 0 ? (
        <ToolsTileGrid tools={tileTools} />
      ) : (
        <p className="text-sm text-body-charcoal" role="status">
          {t("search.noResults")}
        </p>
      )}
    </div>
  );
}
