/**
 * CategoriesHubGrid — Premium category grid for the industries page.
 *
 * Renders a 33-category grid with SVG line-art symbols, field, domain,
 * social purpose, and tool count. Each tile links to a filtered tool view.
 *
 * ECMI / ISO 9001 — Industrial-grade taxonomy display.
 * Design: Omni Calculator dense tile + premium copper/navy line art.
 */

"use client";

import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import type { CategoryCard } from "@/lib/tools/build-taxonomy-category-cards";

interface CategoriesHubGridProps {
  readonly basePath: "/industries" | "/free-tools" | "/premium-tools";
  readonly categories: readonly CategoryCard[];
  readonly locale: string;
  readonly variant?: "industry" | "premium";
}

/** Single category tile with premium SVG symbol, field/domain/purpose metadata. */
function CategoryTile({
  slug,
  title,
  tagline,
  field,
  domain,
  socialPurpose,
  countLabel,
  premiumCount,
  svgSymbol,
  active,
  href,
  variant,
}: {
  readonly slug: string;
  readonly title: string;
  readonly tagline: string;
  readonly field: string;
  readonly domain: string;
  readonly socialPurpose: string;
  readonly countLabel: string;
  readonly premiumCount: number;
  readonly svgSymbol: string;
  readonly active: boolean;
  readonly href: string;
  readonly variant: "industry" | "premium";
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex min-h-[200px] flex-col rounded-xl border bg-white px-4 py-4 text-left transition-all",
        "shadow-sm hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "border-slate-200 hover:border-sc-copper/30",
        variant === "premium" ? "focus-visible:ring-sc-copper" : "focus-visible:ring-sc-navy",
        active ? "border-sc-copper/50 bg-sc-copper/[0.02]" : "",
      )}
    >
      {/* Premium SVG symbol */}
      <div
        className={cn(
          "mb-3 h-12 w-12 text-sc-navy transition-colors",
          "group-hover:text-sc-copper",
        )}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: svgSymbol }}
      />

      {/* Title & tagline */}
      <div className="mb-2 min-w-0">
        <h3 className="line-clamp-2 text-sm font-bold leading-tight text-gray-800">
          {title}
        </h3>
        {tagline ? (
          <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-slate-500">
            {tagline}
          </p>
        ) : null}
      </div>

      {/* Metadata badges: field · domain · social purpose */}
      <div className="mt-auto flex flex-wrap gap-1">
        {field ? (
          <span className="inline-flex items-center rounded-full border border-sc-copper/20 bg-sc-copper/[0.04] px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-sc-copper">
            {field}
          </span>
        ) : null}
        {domain ? (
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-slate-500">
            {domain}
          </span>
        ) : null}
      </div>

      {/* Social purpose + count */}
      <div className="mt-2 flex items-center justify-between">
        {socialPurpose ? (
          <span className="truncate text-[10px] font-medium italic text-slate-400">
            {socialPurpose}
          </span>
        ) : (
          <span />
        )}
        <span className="shrink-0 text-right text-[10px] font-semibold text-slate-400">
          {countLabel}
          {premiumCount > 0 ? (
            <span className="ml-1 font-mono text-sc-copper">· PRO</span>
          ) : null}
        </span>
      </div>
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
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {visibleCategories.map(({ category, countLabel, premiumCount, svgSymbol }) => {
        const slug = category.slug;
        const active = isAllSelected ? false : selectedCategory === slug;
        const href = active
          ? basePath
          : `${basePath}?category=${encodeURIComponent(slug)}`;

        return (
          <CategoryTile
            key={slug}
            slug={slug}
            title={category.title[_locale as keyof typeof category.title] ?? category.title.en}
            tagline={category.tagline[_locale as keyof typeof category.tagline] ?? category.tagline.en}
            field={category.field[_locale as keyof typeof category.field] ?? category.field.en}
            domain={category.domain[_locale as keyof typeof category.domain] ?? category.domain.en}
            socialPurpose={
              category.socialPurpose[_locale as keyof typeof category.socialPurpose] ??
              category.socialPurpose.en
            }
            countLabel={countLabel}
            premiumCount={premiumCount}
            svgSymbol={svgSymbol}
            active={active}
            href={href}
            variant={variant}
          />
        );
      })}
    </div>
  );
}
