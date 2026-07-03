"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "@/lib/i18n-stub";
import Link from "next/link";
import { FreeToolCategorySection, FreeToolsCategoryGroup } from "./FreeToolCategorySection";
import type { ToolData } from "@/lib/features/tools/all-tools-data";
import type { FreeToolCategorySlug } from "@/lib/features/free-tools/free-tool-categories";
import {
  getOrderedFreeToolCategories,
  resolveCanonicalCategorySlug,
} from "@/lib/features/free-tools/free-tool-categories";
import { toCatalogHubToolTile } from "@/lib/features/tools/catalog-hub-tool-tile";
import {
  CATALOG_HUB_MAX_TILES,
  filterCatalogHubTools,
  limitCatalogHubTiles,
  resolveCatalogHubSearchQuery,
  resolveCatalogHubSectorFilter,
} from "@/lib/features/tools/filter-catalog-hub-tools";

type FreeToolsCategoryGroupedContentProps = {
  readonly locale: string;
  readonly tools: readonly ToolData[];
};

/** Groups free tools by canonical category, renders premium-style category sections. */
export function FreeToolsCategoryGroupedContent({
  locale,
  tools,
}: FreeToolsCategoryGroupedContentProps) {
  const searchParams = useSearchParams();
  const t = useTranslations("catalogExplorer");

  const sectorFilter = resolveCatalogHubSectorFilter(searchParams?.get("sector") ?? undefined);
  const searchQuery = resolveCatalogHubSearchQuery(searchParams?.get("q") ?? undefined);
  const allLabel = t("labels.free-tools.allLabel");
  const hasFilter = !!(sectorFilter || searchQuery);

  // Filter tools by sector and/or search query
  const filteredTools = useMemo(
    () =>
      hasFilter
        ? filterCatalogHubTools(tools, {
            locale,
            sectorKey: sectorFilter,
            searchQuery,
          })
        : tools,
    [tools, locale, sectorFilter, searchQuery, hasFilter],
  );

  // Group filtered tools by canonical category slug
  const categoryGroups = useMemo(() => {
    const groups = new Map<FreeToolCategorySlug, ToolData[]>();

    for (const tool of filteredTools) {
      const canonicalSlug = resolveCanonicalCategorySlug(tool.categoryKey);
      const existing = groups.get(canonicalSlug) ?? [];
      existing.push(tool);
      groups.set(canonicalSlug, existing);
    }

    return groups;
  }, [filteredTools]);

  // Build ordered category sections (includes "other" from registry)
  const categorySections = useMemo(() => {
    const sections: Array<{
      slug: FreeToolCategorySlug;
      tools: ToolData[];
    }> = [];

    for (const cat of getOrderedFreeToolCategories()) {
      const catTools = categoryGroups.get(cat.slug);
      if (catTools && catTools.length > 0) {
        sections.push({ slug: cat.slug, tools: catTools });
      }
    }

    return sections;
  }, [categoryGroups]);

  const totalFiltered = filteredTools.length;
  const totalTiles = limitCatalogHubTiles(
    categorySections.flatMap((s) => s.tools),
    CATALOG_HUB_MAX_TILES,
  );

  const totalAllTools = tools.length;

  return (
    <div className="min-w-0 flex-1" id="tools-list">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">{allLabel}</h2>
        <p className="mt-1 text-sm text-gray-500">
          {hasFilter
            ? t("labels.free-tools.categoryToolsSubtitle", {
                count: totalFiltered,
              })
            : t("labels.free-tools.categoryToolsSubtitle", {
                count: totalAllTools,
              })}
        </p>
      </header>

      {totalFiltered === 0 ? (
        <p className="text-sm text-body-charcoal" role="status">
          {t("search.noResults")}
        </p>
      ) : totalFiltered > totalTiles.length ? (
        <p className="mb-4 text-xs text-body-charcoal" role="status">
          {t("search.showingLimited", {
            shown: totalTiles.length,
            total: totalFiltered,
          })}
        </p>
      ) : null}

      <FreeToolsCategoryGroup>
        {categorySections.map(({ slug, tools: sectionTools }) => {
          // Limit tools per section to avoid overflow
          const limitedTools = limitCatalogHubTiles(sectionTools, 50);
          const tileTools = limitedTools.map(toCatalogHubToolTile);

          return (
            <FreeToolCategorySection
              key={slug}
              slug={slug}
              tools={tileTools}
              locale={locale}
              totalTools={totalAllTools}
            />
          );
        })}
      </FreeToolsCategoryGroup>

      {!hasFilter && (
        <div className="sc-discovery-footer">
          <p className="sc-discovery-footer__lead">
            {t("discoveryFooter.freeToolsLead")}
          </p>
          <Link
            href="/free-tools"
            prefetch={false}
            className="sc-discovery-footer__link"
          >
            {t("discoveryFooter.freeToolsCta")}
          </Link>
        </div>
      )}
    </div>
  );
}
