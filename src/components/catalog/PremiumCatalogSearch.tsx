"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CategoryCardGrid } from "@/components/catalog/CategoryCardGrid";
import type { CategoryCardItem } from "@/components/catalog/CategoryCardGrid";
import { ToolLinkGrid } from "@/components/catalog/ToolLinkGrid";
import type { ToolLinkItem } from "@/components/catalog/ToolLinkGrid";
import {
  buildPremiumCatalogSearchEntries,
} from "@/lib/catalog/premium-catalog-source";
import {
  CATALOG_SEARCH_MAX_RESULTS,
  filterCatalogSearchEntries,
} from "@/lib/catalog/catalog-search";

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
  readonly count: number;
};

type Props = {
  readonly tools: readonly SearchablePremiumTool[];
  readonly categories: readonly SearchablePremiumCategory[];
};

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

function scrollToToolsList() {
  requestAnimationFrame(() => {
    document.getElementById("tools-list")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

export function PremiumCatalogSearch({ tools, categories }: Props) {
  const t = useTranslations("premiumCategoryCatalog");
  const tSearch = useTranslations("catalogExplorer.search");
  const locale = useLocale();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebouncedValue(searchQuery, 120);

  const handleCategorySelect = useCallback((slug: string) => {
    setSelectedCategory(slug);
    scrollToToolsList();
  }, []);

  const categoryCards: CategoryCardItem[] = useMemo(
    () => [
      {
        slug: "all",
        label: t("allCategory"),
        count: tools.length,
        isActive: selectedCategory === "all",
      },
      ...categories.map((c) => ({
        slug: c.slug,
        label: c.title,
        count: c.count,
        isActive: selectedCategory === c.slug,
      })),
    ],
    [tools.length, categories, selectedCategory, t],
  );

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

  return (
    <div className="flex min-w-0 flex-col gap-6" data-premium-discovery="true">
      <div
        className="sc-catalog-search sc-search-row min-w-0"
        data-tool-search="true"
        data-search-scope="premium-tools"
        data-search-result-count={showTypeahead ? typeaheadResult.totalMatches : 0}
        data-search-has-more={showTypeahead && typeaheadResult.hiddenCount > 0}
      >
        <div className="sc-search-wrapper sc-search-wrap">
          <span className="sc-search-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3-3" strokeLinecap="round" />
            </svg>
          </span>
          <label className="sc-catalog-search__field block w-full">
            <span className="sr-only">{t("searchLabel")}</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tSearch("placeholder.premium-tools")}
              className="sc-search-input sc-catalog-search__input"
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
              className="min-h-[44px] min-w-[44px] px-2 text-lg leading-none text-body-charcoal hover:text-premium-velvet"
            >
              ×
            </button>
          ) : null}
        </div>

        {showTypeahead ? (
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
        ) : null}
      </div>

      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-premium-velvet">{t("browseByCategory")}</h2>
        <div className="mt-3">
          <CategoryCardGrid items={categoryCards} onSelect={handleCategorySelect} />
        </div>
      </div>

      <p className="text-xs text-body-charcoal">
        {t("resultCount", { count: visibleTools.length })}
      </p>

      <section id="tools-list" className="min-w-0">
        {visibleTools.length === 0 ? (
          <div className="py-10 text-center" role="status">
            <p className="text-sm text-body-charcoal">{t("noResults")}</p>
            <p className="mt-1 text-xs text-body-charcoal">{t("noResultsHint")}</p>
          </div>
        ) : (
          <ToolLinkGrid
            items={visibleTools
              .filter((tool) => tool.isActive && tool.routePath)
              .map((tool) => ({
                title: tool.title,
                href: tool.routePath!,
              }))}
          />
        )}
      </section>
    </div>
  );
}
