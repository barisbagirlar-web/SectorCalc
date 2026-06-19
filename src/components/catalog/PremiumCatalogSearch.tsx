"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Search, Lock } from "lucide-react";
import { CategoryCardGrid } from "@/components/catalog/CategoryCardGrid";
import type { CategoryCardItem } from "@/components/catalog/CategoryCardGrid";
import {
  buildPremiumCatalogSearchEntries,
} from "@/lib/catalog/premium-catalog-source";
import {
  CATALOG_SEARCH_MAX_RESULTS,
  filterCatalogSearchEntries,
} from "@/lib/catalog/catalog-search";
import { useToolsPageSearch } from "@/components/tools/tools-page-search-context";
import { scrollToToolsList } from "@/lib/navigation/scroll-to-tools-list";

export type SearchablePremiumTool = {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly categorySlug: string;
  readonly categoryLabel?: string;
  readonly routePath: string | null;
  readonly isActive: boolean;
  readonly searchTerms?: readonly string[];
  readonly aliases?: readonly string[];
  readonly keywords?: readonly string[];
};

export type SearchablePremiumCategory = {
  readonly slug: string;
  readonly title: string;
  readonly iconKey: string;
  readonly count: number;
};

type Props = {
  readonly tools: readonly SearchablePremiumTool[];
  readonly categories: readonly SearchablePremiumCategory[];
  readonly totalActiveCount?: number;
};

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

function resolveCategoryFromParam(
  categoryParam: string,
  validSlugs: ReadonlySet<string>,
): string {
  if (categoryParam === "" || categoryParam === "all") {
    return "all";
  }
  return validSlugs.has(categoryParam) ? categoryParam : "all";
}

export function PremiumCatalogSearch({ tools, categories, totalActiveCount }: Props) {
  const t = useTranslations("premiumCategoryCatalog");
  const tSearch = useTranslations("catalogExplorer.search");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const validCategorySlugs = useMemo(
    () => new Set(categories.map((category) => category.slug)),
    [categories],
  );

  const categoryParam = searchParams?.get("category") ?? "";
  const selectedCategory = resolveCategoryFromParam(categoryParam, validCategorySlugs);

  const { searchQuery, setSearchQuery, hideExplorerChrome } = useToolsPageSearch();
  const debouncedQuery = useDebouncedValue(searchQuery, 120);
  const didScrollForDeepLink = useRef(false);

  useEffect(() => {
    if (didScrollForDeepLink.current) {
      return;
    }
    if (selectedCategory !== "all") {
      didScrollForDeepLink.current = true;
      scrollToToolsList();
    }
  }, [selectedCategory]);

  const categoryCards = useMemo((): CategoryCardItem[] => {
    const allCount = totalActiveCount ?? tools.filter((tool) => tool.isActive && tool.routePath).length;
    return [
      {
        slug: "all",
        label: t("allCategory"),
        count: allCount,
        isActive: selectedCategory === "all",
      },
      ...categories.map((category) => ({
        slug: category.slug,
        label: category.title,
        count: category.count,
        isActive: selectedCategory === category.slug,
      })),
    ];
  }, [categories, selectedCategory, t, tools, totalActiveCount]);

  const activeCategoryLabel =
    categories.find((category) => category.slug === selectedCategory)?.title ?? t("title");
  const formatPremiumCount = useCallback(
    (count: number) => t("premiumCount", { count }),
    [t],
  );
  const isSearching = debouncedQuery.trim().length > 0;

  const typeaheadEntries = useMemo(
    () => buildPremiumCatalogSearchEntries(tools),
    [tools],
  );

  const typeaheadResult = useMemo(
    () => filterCatalogSearchEntries(typeaheadEntries, debouncedQuery, CATALOG_SEARCH_MAX_RESULTS),
    [typeaheadEntries, debouncedQuery],
  );

  const showTypeahead = debouncedQuery.trim().length >= 1;
  const typeaheadListId = "premium-catalog-typeahead-results";

  const visibleTools = useMemo(() => {
    const categoryFiltered =
      selectedCategory === "all"
        ? tools
        : tools.filter((tool) => tool.categorySlug === selectedCategory);

    if (debouncedQuery.trim().length === 0) {
      return categoryFiltered;
    }

    const gridMatches = filterCatalogSearchEntries(
      buildPremiumCatalogSearchEntries(categoryFiltered),
      debouncedQuery,
      categoryFiltered.length,
    );
    const matchedSlugs = new Set(gridMatches.visible.map((entry) => entry.slug));
    return categoryFiltered.filter((tool) => matchedSlugs.has(tool.slug));
  }, [tools, selectedCategory, debouncedQuery]);

  const handleViewMoreResults = useCallback(() => {
    scrollToToolsList();
  }, []);

  const typeaheadPanel =
    showTypeahead ? (
      <div
        className="sc-catalog-search__results"
        id={typeaheadListId}
        role="region"
        aria-live="polite"
      >
        {typeaheadResult.totalMatches === 0 ? (
          <p className="sc-catalog-search__empty">{t("noResults")}</p>
        ) : (
          <>
            <ul className="sc-catalog-search__list">
              {typeaheadResult.visible.map((entry) => (
                <li key={`${entry.href}-${entry.slug}`} className="min-w-0">
                  <Link
                    href={entry.href}
                    prefetch={false}
                    className="sc-catalog-search__result min-h-[44px]"
                    data-search-result-slug={entry.slug}
                    data-search-result-tier="premium"
                  >
                    <div className="sc-catalog-search__result-head">
                      <p className="sc-catalog-search__result-title">{entry.title}</p>
                      <span className="sc-catalog-search__badge sc-catalog-search__badge--premium">
                        {tSearch("badgePremium")}
                      </span>
                    </div>
                    <p className="sc-catalog-search__result-desc">{entry.description}</p>
                    <p className="sc-catalog-search__result-meta">{entry.groupLabel}</p>
                  </Link>
                </li>
              ))}
            </ul>
            {typeaheadResult.hiddenCount > 0 ? (
              <button
                type="button"
                onClick={handleViewMoreResults}
                className="sc-catalog-search__view-more mt-2 min-h-[44px] w-full text-start text-sm font-medium text-sc-copper hover:underline"
                data-premium-view-more="true"
              >
                {t("viewMoreResults", { count: typeaheadResult.totalMatches })}
              </button>
            ) : null}
          </>
        )}
      </div>
    ) : null;

  return (
    <div className="flex min-w-0 flex-col gap-6" data-premium-discovery="true">
      {!hideExplorerChrome ? (
        <div
          className="sc-catalog-search sc-search-row min-w-0"
          data-tool-search="true"
          data-search-scope="premium-tools"
          data-search-result-count={showTypeahead ? typeaheadResult.totalMatches : 0}
          data-search-has-more={showTypeahead && typeaheadResult.hiddenCount > 0}
        >
          <div className="sc-search-wrapper sc-search-wrap relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <label className="sc-catalog-search__field block w-full">
              <span className="sr-only">{t("searchLabel")}</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tSearch("placeholder.premium-tools")}
                className="sc-search-input sc-catalog-search__input w-full min-h-[44px] rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
                autoComplete="off"
                enterKeyHint="search"
                aria-controls={showTypeahead ? typeaheadListId : undefined}
              />
            </label>
            {searchQuery.length > 0 ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label={tSearch("clearSearch")}
                className="absolute right-3 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] px-2 text-lg leading-none text-body-charcoal hover:text-premium-velvet"
              >
                ×
              </button>
            ) : null}
          </div>
          {typeaheadPanel}
        </div>
      ) : (
        typeaheadPanel
      )}

      {!hideExplorerChrome && !isSearching ? (
        <section aria-labelledby="premium-browse-category-heading">
          <h2
            id="premium-browse-category-heading"
            className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-700"
          >
            {t("browseByCategory")}
          </h2>
          <CategoryCardGrid
            items={categoryCards}
            formatCount={formatPremiumCount}
            filterParamKey="category"
            allFilterValue="all"
            variant="premium"
          />
        </section>
      ) : null}

      {hideExplorerChrome && !isSearching ? (
        <section aria-label={t("browseByCategory")}>
          <CategoryCardGrid
            items={categoryCards}
            formatCount={formatPremiumCount}
            filterParamKey="category"
            allFilterValue="all"
            variant="premium"
          />
        </section>
      ) : null}

      <div className="min-w-0">
        <header className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            {selectedCategory === "all"
              ? t("title")
              : t("categoryToolsTitle", { category: activeCategoryLabel })}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {t("categoryToolsSubtitle", { count: visibleTools.length })}
          </p>
        </header>

        <p className="text-xs text-body-charcoal">
          {t("resultCount", { count: visibleTools.length })}
        </p>

        <section id="tools-list" className="mt-4 min-w-0">
            {visibleTools.length === 0 ? (
              <div className="py-10 text-center" role="status">
                <p className="text-sm text-body-charcoal">{t("noResults")}</p>
                <p className="mt-1 text-xs text-body-charcoal">{t("noResultsHint")}</p>
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleTools.map((tool) =>
                  tool.isActive && tool.routePath ? (
                    <li key={tool.slug} className="min-w-0">
                      <Link
                        href={tool.routePath}
                        prefetch={false}
                        className="group block text-premium-velvet hover:text-deep-navy"
                        id={"tool-" + tool.slug}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold leading-tight transition-colors group-hover:underline">
                            {tool.title}
                          </span>
                          <span className="inline-flex shrink-0 items-center gap-1 font-sans text-[9px] font-semibold uppercase tracking-wider text-sc-copper">
                            <Lock className="h-2.5 w-2.5" aria-hidden />
                            PRO
                          </span>
                        </div>
                        {tool.description ? (
                          <p className="mt-0.5 text-xs leading-relaxed text-body-charcoal line-clamp-2">
                            {tool.description}
                          </p>
                        ) : null}
                      </Link>
                    </li>
                  ) : (
                    <li key={tool.slug} className="min-w-0">
                      <span
                        className="block cursor-default opacity-60"
                        id={"tool-" + tool.slug}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold leading-tight text-premium-velvet">
                            {tool.title}
                          </span>
                          <span className="inline-flex shrink-0 items-center gap-1 font-sans text-[9px] font-semibold uppercase tracking-wider text-sc-copper">
                            <Lock className="h-2.5 w-2.5" aria-hidden />
                            PRO
                          </span>
                        </div>
                        {tool.description ? (
                          <p className="mt-0.5 text-xs leading-relaxed text-body-charcoal line-clamp-2">
                            {tool.description}
                          </p>
                        ) : null}
                      </span>
                    </li>
                  ),
                )}
              </ul>
            )}
          </section>
      </div>
    </div>
  );
}
