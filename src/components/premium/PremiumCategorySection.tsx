/**
 * PremiumCategorySection — Industrial-grade category block for premium tools.
 *
 * Renders a category header with:
 * - A premium line-art SVG symbol (copper tint)
 * - The category title (localized)
 * - A concise description
 * - A ToolsTileGrid of all tools in this category
 *
 * Designed for the premium-tools listing page; each category becomes a
 * visually distinct, scannable section.
 *
 * ECMI / ISO 9001 — TUV-certifiable engineering presentation.
 */

import { Suspense } from "react";
import { ToolsTileGrid } from "@/components/tools/ToolsTileGrid";
import { getPremiumCategoryBySlug, PREMIUM_CATEGORIES } from "@/data/premium-categories";
import type { PremiumCategorySlug } from "@/data/premium-categories";
import type { ToolData } from "@/lib/features/tools/all-tools-data";
import type { Tool } from "@/data/tools";

/* ──────────────────────────────────────────────
 * Locale-aware title/description resolver
 * ────────────────────────────────────────────── */
function localizedField(
  field: { readonly en: string; readonly de: string; readonly fr: string; readonly es: string; readonly ar: string },
  locale: string,
): string {
  const key = locale.toLowerCase();
  if (key === "de") return field.de;
  if (key === "fr") return field.fr;
  if (key === "es") return field.es;
  if (key === "ar") return field.ar;
  return field.en;
}

/* ──────────────────────────────────────────────
 * Helper: adapt ToolData → Tool for ToolsTileGrid
 * ────────────────────────────────────────────── */
function toToolTile(tool: ToolData): Tool {
  return {
    slug: tool.slug,
    name: tool.name,
    shortDescription: tool.description,
    description: tool.description,
    tier: tool.premiumRequired ? "premium" : "free",
    industrySlug: tool.sectorKey,
    href: tool.href,
  };
}

/* ──────────────────────────────────────────────
 * Props
 * ────────────────────────────────────────────── */
type PremiumCategorySectionProps = {
  /** The premium category slug. */
  readonly categorySlug: PremiumCategorySlug;
  /** Tools that belong to this category (pre-filtered). */
  readonly tools: readonly ToolData[];
  /** Current locale for localized category title/description. */
  readonly locale?: string;
  /** Optional CSS class for additional styling. */
  readonly className?: string;
};

/* ──────────────────────────────────────────────
 * Component
 * ────────────────────────────────────────────── */
export function PremiumCategorySection({
  categorySlug,
  tools,
  locale = "en",
  className = "",
}: PremiumCategorySectionProps) {
  const category = getPremiumCategoryBySlug(categorySlug);

  if (!category || tools.length === 0) {
    return null;
  }

  const tileTools = tools.map(toToolTile);
  const title = localizedField(category.title, locale);
  const description = localizedField(category.description, locale);

  return (
    <section
      id={`category-${categorySlug}`}
      aria-labelledby={`category-heading-${categorySlug}`}
      className={`sc-pro-section sc-pro-section--border rounded-lg bg-white p-6 shadow-sm ${className}`}
    >
      {/* ── Category Header ───────────────────────────── */}
      <header className="mb-6 flex items-start gap-4">
        {/* Premium line-art SVG symbol */}
        <div
          className="hidden shrink-0 sm:block"
          aria-hidden="true"
        >
          <div
            className="text-sc-copper/60"
            dangerouslySetInnerHTML={{
              __html: category.symbolSvg
                .replace('stroke="currentColor"', 'stroke="currentColor" class="h-12 w-12"')
                .replace(/stroke-width="1\.5"/, 'stroke-width="1.5" style="color: #B87333"'),
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <category.icon
              className="h-6 w-6 shrink-0 text-sc-copper"
              aria-hidden="true"
            />
            <h2
              id={`category-heading-${categorySlug}`}
              className="text-xl font-bold text-premium-velvet sm:text-2xl"
            >
              {title}
            </h2>
            <span className="inline-flex items-center rounded-full border border-sc-copper/30 bg-sc-copper/5 px-2.5 py-0.5 text-xs font-medium text-sc-copper">
              {tools.length}
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-gray-500">
            {description}
          </p>
        </div>
      </header>

      {/* ── Tool Grid ─────────────────────────────────── */}
      <Suspense
        fallback={
          <div className="min-h-[6rem] animate-pulse rounded bg-gray-50" aria-hidden="true" />
        }
      >
        <ToolsTileGrid tools={tileTools} />
      </Suspense>
    </section>
  );
}

/**
 * Renders all premium category sections in priority order.
 * Each category section shows its tools in a ToolsTileGrid.
 */
export function PremiumCategoryGrid({
  tools: allTools,
  locale = "en",
}: {
  /** All premium tools (will be grouped by premiumCategorySlug). */
  readonly tools: readonly ToolData[];
  /** Current locale for resolving category titles. */
  readonly locale?: string;
}) {
  const groups = new Map<PremiumCategorySlug, ToolData[]>();

  for (const tool of allTools) {
    const catSlug = tool.premiumCategorySlug ?? "lean-production";
    const existing = groups.get(catSlug) ?? [];
    existing.push(tool);
    groups.set(catSlug, existing);
  }

  const sortedCategories = [...PREMIUM_CATEGORIES]
    .filter((cat) => (groups.get(cat.slug)?.length ?? 0) > 0)
    .sort((a, b) => a.priority - b.priority);

  if (sortedCategories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-10">
      {sortedCategories.map((category) => (
        <PremiumCategorySection
          key={category.slug}
          categorySlug={category.slug}
          tools={groups.get(category.slug) ?? []}
          locale={locale}
        />
      ))}
    </div>
  );
}
