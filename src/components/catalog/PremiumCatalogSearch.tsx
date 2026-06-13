"use client";

import { useState, useMemo, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { Link } from "@/i18n/routing";
import { CategoryCardGrid } from "@/components/catalog/CategoryCardGrid";
import type { CategoryCardItem } from "@/components/catalog/CategoryCardGrid";
import { FormulaGateCatalogMeta } from "@/components/formula/FormulaGateCatalogMeta";
import {
  buildSearchablePremiumToolHaystack,
  normalizeToolSearchText,
} from "@/lib/catalog/premium-catalog-source";

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
  const locale = useLocale();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategorySelect = useCallback((slug: string) => {
    setSelectedCategory(slug);
    scrollToToolsList();
  }, []);

  const categoryCards: CategoryCardItem[] = useMemo(
    () => [
      { slug: "all", label: t("allCategory"), count: tools.length, isActive: selectedCategory === "all" },
      ...categories.map((c) => ({
        slug: c.slug,
        label: c.title,
        count: c.count,
        isActive: selectedCategory === c.slug,
      })),
    ],
    [tools.length, categories, selectedCategory, t],
  );

  const visibleTools = useMemo(() => {
    const normalizedQuery = normalizeToolSearchText(searchQuery.trim());
    const categoryFiltered =
      selectedCategory === "all"
        ? tools
        : tools.filter((tool) => tool.categorySlug === selectedCategory);

    if (normalizedQuery.length === 0) return categoryFiltered;

    return categoryFiltered.filter((tool) =>
      buildSearchablePremiumToolHaystack(tool).includes(normalizedQuery),
    );
  }, [tools, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body-charcoal"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchLabel")}
          className="w-full min-h-[44px] rounded border border-technical-gray bg-white py-2.5 pl-10 pr-10 text-sm text-premium-velvet placeholder:text-body-charcoal focus:border-sc-copper focus:outline-none"
        />
        {searchQuery.length > 0 && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            aria-label={t("clearSearch")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-body-charcoal hover:text-premium-velvet focus:outline-none"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <CategoryCardGrid items={categoryCards} onSelect={handleCategorySelect} />
      <p className="text-xs text-body-charcoal">
        {t("resultCount", { count: visibleTools.length })}
      </p>
      <section id="tools-list">
        {visibleTools.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-body-charcoal">{t("noResults")}</p>
            <p className="mt-1 text-xs text-body-charcoal">{t("noResultsHint")}</p>
          </div>
        ) : (
          <div className="sc-premium-tool-grid">
            {visibleTools.map((tool) =>
              tool.isActive && tool.routePath ? (
                <article
                  key={tool.slug}
                  id={"tool-" + tool.slug}
                  className="sc-premium-tool-card sc-premium-tool-card--active"
                >
                  <Link href={tool.routePath} prefetch={false} className="sc-premium-tool-card__link">
                    <h3 className="sc-premium-tool-card__title">{tool.title}</h3>
                    <p className="sc-premium-tool-card__description">{tool.description}</p>
                    <FormulaGateCatalogMeta
                      slug={tool.slug}
                      locale={locale}
                      openLabel={t("openCalculator")}
                      isClickable
                    />
                  </Link>
                </article>
              ) : (
                <article
                  key={tool.slug}
                  id={"tool-" + tool.slug}
                  className="sc-premium-tool-card sc-premium-tool-card--pending"
                  aria-disabled="true"
                >
                  <h3 className="sc-premium-tool-card__title">{tool.title}</h3>
                  <p className="sc-premium-tool-card__description">{tool.description}</p>
                  <FormulaGateCatalogMeta
                    slug={tool.slug}
                    locale={locale}
                    openLabel={t("openCalculator")}
                    isClickable={false}
                  />
                </article>
              ),
            )}
          </div>
        )}
      </section>
    </div>
  );
}