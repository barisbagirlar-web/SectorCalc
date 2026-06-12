"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  CATALOG_SEARCH_MAX_RESULTS,
  filterCatalogSearchEntries,
  type CatalogSearchEntry,
  type CatalogSearchTier,
} from "@/lib/catalog/catalog-search";
import type { CategoryExplorerVariant } from "@/lib/catalog/catalog-types";

export type CatalogGroupedSearchScope = CategoryExplorerVariant | "homepage";

type CatalogGroupedSearchProps = {
  entries: readonly CatalogSearchEntry[];
  scope: CatalogGroupedSearchScope;
  className?: string;
};

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

function tierBadgeClass(tier: CatalogSearchTier): string {
  if (tier === "premium") {
    return "sc-catalog-search__badge sc-catalog-search__badge--premium";
  }
  if (tier === "free") {
    return "sc-catalog-search__badge sc-catalog-search__badge--free";
  }
  return "sc-catalog-search__badge sc-catalog-search__badge--neutral";
}

export function CatalogGroupedSearch({ entries, scope, className }: CatalogGroupedSearchProps) {
  const t = useTranslations("catalogExplorer.search");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 120);

  const result = useMemo(
    () => filterCatalogSearchEntries(entries, debouncedQuery, CATALOG_SEARCH_MAX_RESULTS),
    [entries, debouncedQuery]
  );

  const showResults = debouncedQuery.trim().length >= 1;
  const listId = `catalog-search-results-${scope}`;

  return (
    <div
      className={`sc-catalog-search sc-search-row min-w-0${className ? ` ${className}` : ""}`}
      data-tool-search="true"
      data-search-scope={scope}
      data-search-result-count={showResults ? result.totalMatches : 0}
      data-search-has-more={showResults && result.hiddenCount > 0}
    >
      <div className="sc-search-wrap">
        <span className="sc-search-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3-3" strokeLinecap="round" />
          </svg>
        </span>
        <label className="sc-catalog-search__field block w-full">
          <span className="sr-only">{t("label")}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t(`placeholder.${scope}`)}
            className="sc-search-input sc-catalog-search__input"
            autoComplete="off"
            enterKeyHint="search"
            aria-controls={showResults ? listId : undefined}
          />
        </label>
        <span className="sc-search-kbd" aria-hidden="true">
          /
        </span>
      </div>

      {showResults ? (
        <div className="sc-catalog-search__results" id={listId} role="region" aria-live="polite">
          {result.totalMatches === 0 ? (
            <p className="sc-catalog-search__empty">{t("noResults")}</p>
          ) : (
            <>
              <ul className="sc-catalog-search__list">
                {result.visible.map((entry) => (
                  <li key={`${entry.href}-${entry.title}`} className="min-w-0">
                    <Link
                      href={entry.href}
                      prefetch={false}
                      className="sc-catalog-search__result"
                      data-search-result-slug={entry.slug}
                      data-search-result-tier={entry.tier}
                      data-search-result-kind={
                        entry.tier === "industry"
                          ? "industry"
                          : entry.tier === "free" || entry.tier === "premium"
                            ? "tool"
                            : "other"
                      }
                    >
                      <div className="sc-catalog-search__result-head">
                        <p className="sc-catalog-search__result-title">{entry.title}</p>
                        {entry.tier === "free" || entry.tier === "premium" ? (
                          <span className={tierBadgeClass(entry.tier)}>
                            {entry.tier === "premium" ? t("badgePremium") : t("badgeFree")}
                          </span>
                        ) : null}
                      </div>
                      <p className="sc-catalog-search__result-desc">{entry.description}</p>
                      <p className="sc-catalog-search__result-meta">
                        {entry.groupLabel}
                        {entry.meta ? ` · ${entry.meta}` : ""}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
              {result.hiddenCount > 0 ? (
                <p className="sc-catalog-search__more">{t("moreResults", { count: result.hiddenCount })}</p>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
