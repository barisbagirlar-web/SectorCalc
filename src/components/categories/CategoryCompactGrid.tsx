/**
 * CategoryCompactGrid — 4-column compact category grid with tabs, search, badges.
 *
 * Tab bar (Categories / All Tools) with smooth underline animation.
 * Compact cards: SVG icon on top, title centered, tool count + PRO badge.
 * Hover: card rises + left border highlight.
 * Search bar filters categories by title in real time.
 * When URL has ?category=slug, auto-switches to "All Tools" tab with category filter.
 *
 * ECMI / ISO 9001 — TÜV-certifiable industrial UX.
 */

"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import type { CategoryCard } from "@/lib/tools/build-taxonomy-category-cards";
import type { ToolData } from "@/lib/tools/all-tools-data";
import type { CatalogGridVariant } from "@/lib/catalog/catalog-grid-variant-styles";
import { CompactCategoryCard } from "./CompactCategoryCard";
import { CatalogHubToolsClientPanel } from "@/components/tools/CatalogHubToolsClientPanel";

type CategoryCompactGridProps = {
  readonly basePath: "/free-tools" | "/premium-tools" | "/industries";
  readonly categories: readonly CategoryCard[];
  readonly tools: readonly ToolData[];
  readonly variant: CatalogGridVariant;
  readonly locale: string;
  readonly pageVariant: "free-tools" | "premium-tools" | "industries";
};

function underlineColor(variant: CatalogGridVariant): string {
  switch (variant) {
    case "free":
      return "#2563eb";
    case "premium":
      return "var(--sc-premium-bordo)";
    case "industry":
      return "var(--sc-navy)";
  }
}

function focusRingColor(variant: CatalogGridVariant): string {
  switch (variant) {
    case "free":
      return "#2563eb";
    case "premium":
      return "var(--sc-premium-bordo)";
    case "industry":
      return "var(--sc-navy)";
  }
}

export function CategoryCompactGrid({
  basePath,
  categories,
  tools,
  variant,
  locale,
  pageVariant,
}: CategoryCompactGridProps) {
  const t = useTranslations("catalogExplorer");
  const searchParams = useSearchParams();
  const urlCategory = searchParams?.get("category") ?? "";

  const [activeTab, setActiveTab] = useState<"categories" | "allTools">(
    urlCategory ? "allTools" : "categories",
  );
  const [searchQuery, setSearchQuery] = useState("");

  // URL'de category parametresi varsa otomatik All Tools tabına geç
  useEffect(() => {
    if (urlCategory) {
      setActiveTab("allTools");
    }
  }, [urlCategory]);

  const underlineClr = underlineColor(variant);
  const focusClr = focusRingColor(variant);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter((cat) => {
      const title =
        cat.category.title[locale as keyof typeof cat.category.title] ??
        cat.category.title.en;
      return title.toLowerCase().includes(q);
    });
  }, [categories, searchQuery, locale]);

  const tabs = [
    { id: "categories" as const, label: t("compactGrid.categories") },
    { id: "allTools" as const, label: t("compactGrid.allTools") },
  ];

  return (
    <div className="min-w-0 flex-1">
      {/* ── Tab bar with smooth underline ── */}
      <div className="mb-6 border-b border-slate-200">
        <nav className="flex gap-6" aria-label={t("compactGrid.categories")}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                // Kategori tabına dönerken URL'deki category parametresini temizle
                if (tab.id === "categories" && urlCategory) {
                  window.history.replaceState(null, "", basePath);
                }
              }}
              className={cn(
                "relative pb-3 text-sm font-semibold transition-colors duration-200",
                activeTab === tab.id
                  ? "text-gray-900"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-300",
                  activeTab === tab.id ? "w-full" : "w-0",
                )}
                style={{ backgroundColor: underlineClr }}
              />
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "categories" ? (
        <>
          {/* ── Search bar ── */}
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("compactGrid.searchPlaceholder")}
              className={cn(
                "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-slate-400",
                "transition-colors focus:outline-none focus:ring-2",
              )}
              style={{
                "--sc-search-focus": focusClr,
              } as React.CSSProperties}
              aria-label={t("compactGrid.searchPlaceholder")}
              data-1p-ignore
            />
          </div>

          {/* ── Category card grid ── */}
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filteredCategories.map(
                ({ category, svgSymbol, countLabel, premiumCount }) => {
                  const slug = category.slug;
                  const title =
                    category.title[
                      locale as keyof typeof category.title
                    ] ?? category.title.en;
                  const href = `${basePath}?category=${encodeURIComponent(
                    slug,
                  )}`;

                  return (
                    <CompactCategoryCard
                      key={slug}
                      href={href}
                      title={title}
                      countLabel={countLabel}
                      premiumCount={premiumCount}
                      svgSymbol={svgSymbol}
                      variant={variant}
                    />
                  );
                },
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500" role="status">
              {t("search.noResults")}
            </p>
          )}
        </>
      ) : (
        /* ── All Tools tab — CatalogHubToolsClientPanel reads ?category from URL ── */
        <CatalogHubToolsClientPanel
          locale={locale}
          tools={tools}
          variant={pageVariant}
        />
      )}
    </div>
  );
}
