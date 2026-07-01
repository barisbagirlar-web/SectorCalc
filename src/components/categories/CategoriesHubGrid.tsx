/**
 * CategoriesHubGrid — Category grid for the industries / free-tools / premium-tools pages.
 *
 * Renders a 4-column responsive grid of centered category cards with:
 * - Premium SVG line-art symbol (colored per page variant)
 * - Category title
 * - Tool count (+ PRO badge)
 *
 * Design matches homepage "Sektörel Hesaplama Araçları" style.
 * ECMI / ISO 9001 — Industrial-grade taxonomy display.
 */

"use client";

import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/core/cn";
import {
  CATALOG_GRID_VARIANT_STYLES,
  type CatalogGridVariant,
} from "@/lib/catalog/catalog-grid-variant-styles";
import type { CategoryCard } from "@/lib/features/tools/build-taxonomy-category-cards";

interface CategoriesHubGridProps {
  readonly basePath: "/industries" | "/free-tools" | "/pro-tools";
  readonly categories: readonly CategoryCard[];
  readonly locale: string;
  readonly variant?: CatalogGridVariant;
}

function CategoryTile({
  slug,
  title,
  countLabel,
  premiumCount,
  svgSymbol,
  active,
  href,
  variant,
}: {
  readonly slug: string;
  readonly title: string;
  readonly countLabel: string;
  readonly premiumCount: number;
  readonly svgSymbol: string;
  readonly active: boolean;
  readonly href: string;
  readonly variant: CatalogGridVariant;
}) {
  const tone = CATALOG_GRID_VARIANT_STYLES[variant];

  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex min-h-[110px] flex-col items-center justify-center rounded-xl border bg-kil-surface px-3 py-4 text-center transition",
        "shadow-sm hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        tone.hoverBorder,
        tone.focusRing,
        active ? tone.active : "border-slate-200",
      )}
    >
      {/* Premium SVG line-art symbol */}
      <div
        className={cn(
          "mb-2 h-8 w-8 transition-colors",
          tone.icon,
          tone.iconHover,
        )}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: svgSymbol }}
      />

      {/* Category title */}
      <h3 className="line-clamp-2 text-sm font-bold leading-tight text-gray-800">
        {title}
      </h3>

      {/* Count + PRO badge */}
      <span className="mt-2 text-xs font-medium text-slate-500">
        {countLabel}
        {premiumCount > 0 ? (
          <span className="ml-1 font-mono font-semibold text-[var(--sc-premium-bordo)]">
            · PRO
          </span>
        ) : null}
      </span>
    </Link>
  );
}

export function CategoriesHubGrid({
  basePath,
  categories,
  locale: _locale,
  variant = "industry",
}: CategoriesHubGridProps) {
  const searchParams = useSearchParams();
  const rawSelected = searchParams?.get("category") ?? "";
  const selectedCategory = rawSelected === "all" ? "" : rawSelected;
  const isAllSelected = selectedCategory === "";
  const visibleCategories = categories;

  if (visibleCategories.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {visibleCategories.map(
        ({ category, countLabel, premiumCount, svgSymbol }) => {
          const slug = category.slug;
          const active = isAllSelected ? false : selectedCategory === slug;
          const href = active
            ? basePath
            : `${basePath}?category=${encodeURIComponent(slug)}`;

          return (
            <CategoryTile
              key={slug}
              slug={slug}
              title={
                category.title[
                  _locale as keyof typeof category.title
                ] ?? category.title.en
              }
              countLabel={countLabel}
              premiumCount={premiumCount}
              svgSymbol={svgSymbol}
              active={active}
              href={href}
              variant={variant}
            />
          );
        },
      )}
    </div>
  );
}
