"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { CategoryCardGrid } from "@/components/catalog/CategoryCardGrid";
import type { CategoryCardItem } from "@/components/catalog/CategoryCardGrid";
import type { ToolData } from "@/lib/tools/all-tools-data";
import { ToolsTileGrid } from "@/components/tools/ToolsTileGrid";
import type { Tool } from "@/data/tools";

type CatalogFilterMode = "category" | "sector";

type SchemaToolsCatalogExplorerProps = {
  readonly tools: readonly ToolData[];
  readonly filterBy: CatalogFilterMode;
  readonly variant: "free-tools" | "premium-tools" | "industries";
};

const VARIANT_TITLE_KEY: Record<SchemaToolsCatalogExplorerProps["variant"], string> = {
  "free-tools": "freeTools.title",
  "premium-tools": "premiumTools.title",
  industries: "industries.title",
};

function resolveFilterParamKey(filterBy: CatalogFilterMode): string {
  return filterBy === "sector" ? "sector" : "category";
}

function normalizeSearchText(value: string, locale: string): string {
  return value
    .toLocaleLowerCase(locale)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function toToolTile(tool: ToolData): Tool {
  return {
    slug: tool.slug,
    name: tool.name,
    shortDescription: "",
    description: "",
    tier: tool.premiumRequired ? "premium" : "free",
    industrySlug: tool.sectorKey,
    href: tool.href,
  };
}

export function SchemaToolsCatalogExplorer({
  tools,
  filterBy,
  variant,
}: SchemaToolsCatalogExplorerProps) {
  const t = useTranslations("catalogExplorer");
  const tBrowse = useTranslations("premiumCategoryCatalog");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const filterParamKey = resolveFilterParamKey(filterBy);
  const rawFilter = searchParams?.get(filterParamKey) ?? "";
  const selectedFilter = rawFilter === "all" ? "" : rawFilter;
  const isSearching = searchQuery.trim().length > 0;
  const isIndustry = variant === "industries";

  const groups = useMemo(() => {
    const counts = new Map<string, { label: string; count: number }>();

    for (const tool of tools) {
      const key = filterBy === "sector" ? tool.sectorKey : tool.categoryKey;
      const label = filterBy === "sector" ? tool.sector : tool.category;
      const current = counts.get(key);
      if (current) {
        current.count += 1;
      } else {
        counts.set(key, { label, count: 1 });
      }
    }

    return [...counts.entries()]
      .map(([slug, entry]) => ({
        slug,
        label: entry.label,
        count: entry.count,
        isActive: selectedFilter === slug,
      }))
      .sort((left, right) => left.label.localeCompare(right.label, locale));
  }, [filterBy, locale, selectedFilter, tools]);

  const categoryCards = useMemo((): CategoryCardItem[] => {
    const formatCount = (count: number) => t(`labels.${variant}.countLabel`, { count });
    return [
      {
        slug: "all",
        label: t(`labels.${variant}.allLabel`),
        count: tools.length,
        isActive: selectedFilter === "" || selectedFilter === "all",
      },
      ...groups.map((group) => ({
        slug: group.slug,
        label: group.label,
        count: group.count,
        isActive: group.isActive,
      })),
    ];
  }, [groups, selectedFilter, t, tools.length, variant]);

  const categoryFilteredTools = useMemo(() => {
    if (!selectedFilter) {
      return tools;
    }
    return tools.filter((tool) =>
      filterBy === "sector" ? tool.sectorKey === selectedFilter : tool.categoryKey === selectedFilter,
    );
  }, [filterBy, selectedFilter, tools]);

  const visibleTools = useMemo(() => {
    const query = normalizeSearchText(searchQuery, locale);
    if (!query) {
      return categoryFilteredTools;
    }

    return tools.filter((tool) => {
      const haystack = normalizeSearchText(
        [tool.name, tool.slug, tool.category, tool.sector].join(" "),
        locale,
      );
      return haystack.includes(query);
    });
  }, [categoryFilteredTools, locale, searchQuery, tools]);

  const tileTools = useMemo(() => visibleTools.map(toToolTile), [visibleTools]);
  const activeGroup = groups.find((group) => group.isActive);
  const formatCardCount = (count: number) => t(`labels.${variant}.countLabel`, { count });

  return (
    <div className="sc-catalog-explorer-stack flex min-w-0 flex-col gap-6">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body-charcoal"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={t(`search.placeholder.${variant}`)}
          aria-label={t("search.label")}
          className="w-full min-h-[44px] rounded border border-technical-gray bg-white py-2.5 pl-10 pr-10 text-sm text-premium-velvet placeholder:text-body-charcoal focus:border-sc-copper focus:outline-none"
        />
        {isSearching ? (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            aria-label={t("search.clearSearch")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-body-charcoal hover:text-premium-velvet focus:outline-none"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {!isSearching ? (
        <section aria-labelledby="schema-catalog-browse-heading">
          <h2
            id="schema-catalog-browse-heading"
            className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-700"
          >
            {tBrowse("browseByCategory")}
          </h2>
          <CategoryCardGrid
            items={categoryCards}
            formatCount={formatCardCount}
            filterParamKey={filterParamKey}
            allFilterValue="all"
            variant={isIndustry ? "industry" : "default"}
          />
        </section>
      ) : null}

      <div className="min-w-0 flex-1" id="tools-list">
        <header className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isSearching
              ? t("search.label")
              : activeGroup
                ? t(`labels.${variant}.categoryToolsTitle`, { category: activeGroup.label })
                : t(VARIANT_TITLE_KEY[variant])}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {t(`labels.${variant}.categoryToolsSubtitle`, { count: visibleTools.length })}
          </p>
        </header>

        {tileTools.length > 0 ? (
          <ToolsTileGrid tools={tileTools} />
        ) : (
          <p className="text-sm text-body-charcoal" role="status">
            {t("search.noResults")}
          </p>
        )}
      </div>
    </div>
  );
}
