"use client";
/**
 * CategoryCatalogView - Compact category cards + full tool listing below.
 *
 * No tab bar, no inline search (hero search covers that).
 * Click a category card → expands a detail panel below the grid listing
 * ALL tools in that category with their localized names and direct links.
 *
 * ECMI / ISO 9001 - TUV-certifiable industrial UX.
 */


import { useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n-stub";
import { cn } from "@/lib/core/cn";
import { resolveCategorySvgSymbol } from "@/data/category-svg-symbols";
import { resolveCanonicalCategorySlug } from "@/lib/features/free-tools/free-tool-categories";
import { CatalogHubToolsClientPanel } from "@/components/tools/CatalogHubToolsClientPanel";
import type { CategoryCard } from "@/lib/features/tools/build-taxonomy-category-cards";
import type { FreeToolCategoryEntry } from "@/lib/features/free-tools/free-tool-categories";
import type { ToolData } from "@/lib/features/tools/all-tools-data";
// ─── Types ──────────────────────────────────────────────────────────────────

export type CategoryCatalogViewProps = {
  readonly basePath: "/free-tools" | "/pro-tools" | "/industries";
  readonly categories: readonly CategoryCard[];
  readonly tools: readonly ToolData[];
  readonly locale: string;
  readonly pageVariant: "free-tools" | "premium-tools" | "industries";
};

// ─── Per-category colour palette ────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, { color: string; bg: string }> = {
  "quality-six-sigma":                { color: "#059669", bg: "#ECFDF5" },
  "technology-ai-cloud-cyber":        { color: "#475569", bg: "#F1F5F9" },
  "finance-sales-working-capital":    { color: "#B45309", bg: "#FFFBEB" },
  "electrical-power-systems":         { color: "#D97706", bg: "#FFFBEB" },
  "sustainability-resource-esg":      { color: "#15803D", bg: "#F0FDF4" },
  "cnc-additive-manufacturing":       { color: "#64748B", bg: "#F1F5F9" },
  "metal-plastics-forming":           { color: "#64748B", bg: "#F8FAFC" },
  "process-chemical":                 { color: "#7C3AED", bg: "#F5F3FF" },
  "hse-ergonomics":                   { color: "#EA580C", bg: "#FFF7ED" },
  "maintenance-reliability":          { color: "#16A34A", bg: "#F0FDF4" },
  "project-construction-management":  { color: "#D97706", bg: "#FFFBEB" },
  "workforce-hr":                     { color: "#0891B2", bg: "#ECFEFF" },
  "procurement-supply-chain":         { color: "#7C3AED", bg: "#F5F3FF" },
  "food-cold-chain-hygiene":          { color: "#0EA5E9", bg: "#F0F9FF" },
  "lean-production":                  { color: "#2563EB", bg: "#EFF6FF" },
  "textile-print-lab":                { color: "#7C3AED", bg: "#F5F3FF" },
  "mechanical-hvac-energy-loss":      { color: "#64748B", bg: "#F8FAFC" },
  "packaging-local-business":         { color: "#7C3AED", bg: "#F5F3FF" },
  "global-compliance-trade":          { color: "#64748B", bg: "#F8FAFC" },
  "digital-factory-automation":       { color: "#475569", bg: "#F8FAFC" },
  "mathematics-statistics":           { color: "#64748B", bg: "#F8FAFC" },
  "health-fitness-daily-life":        { color: "#DC2626", bg: "#FEF2F2" },
  "conversion-measurement":           { color: "#64748B", bg: "#F8FAFC" },
  "automotive-transport":             { color: "#64748B", bg: "#F8FAFC" },
  "maritime-shipping":                { color: "#2563EB", bg: "#EFF6FF" },
  "mining-geology":                   { color: "#64748B", bg: "#F8FAFC" },
  "furniture-woodworking":            { color: "#B45309", bg: "#FFFBEB" },
  "cleaning-facility":                { color: "#0EA5E9", bg: "#F0F9FF" },
  "water-wastewater":                 { color: "#2563EB", bg: "#EFF6FF" },
  "tourism-hospitality":              { color: "#7C3AED", bg: "#F5F3FF" },
  "education-academic":               { color: "#64748B", bg: "#F8FAFC" },
  "real-estate-property":             { color: "#D97706", bg: "#FFFBEB" },
  "aerospace-aviation":               { color: "#64748B", bg: "#F8FAFC" },
};

const FALLBACK_COLOR = { color: "#6B7280", bg: "#F3F4F6" };

function getCategoryColor(slug: string): { color: string; bg: string } {
  return CATEGORY_COLORS[slug] ?? FALLBACK_COLOR;
}

// ─── Badge ──────────────────────────────────────────────────────────────────

type BadgeType = "PRO" | "NEW" | "FREE";

function Badge({ label }: { label: BadgeType }) {
  const styles: Record<BadgeType, { bg: string; color: string; border: string }> = {
    PRO:  { bg: "#1E3A8A", color: "#93C5FD", border: "#3B82F640" },
    NEW:  { bg: "#14532D", color: "#86EFAC", border: "#22C55E40" },
    FREE: { bg: "#78350F", color: "#FCD34D", border: "#F59E0B40" },
  };
  const s = styles[label];
  return (
    <span
      className="inline-flex items-center rounded px-[5px] py-px text-[9px] font-extrabold tracking-widest"
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        lineHeight: "16px",
      }}
    >
      {label}
    </span>
  );
}

// ─── Resolve badge ──────────────────────────────────────────────────────────

function resolveBadge(cat: CategoryCard, pageVariant: string): BadgeType | null {
  if (cat.count <= 2 && pageVariant === "premium-tools") return "NEW";
  if (cat.premiumCount > 0) return "PRO";
  if (cat.freeCount > 0 && cat.premiumCount === 0) return "FREE";
  return null;
}

// ─── Category card ──────────────────────────────────────────────────────────

function CategoryCard({
  cat,
  isActive,
  onClick,
  badge,
  locale,
}: {
  cat: CategoryCard;
  isActive: boolean;
  onClick: () => void;
  badge: BadgeType | null;
  locale: string;
}) {
  const colors = getCategoryColor(cat.category.slug);
  const svgHtml = cat.category.symbolSvg || resolveCategorySvgSymbol(cat.category.slug);
  const title =
    cat.category.title[locale as keyof typeof cat.category.title] ??
    cat.category.title.en;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center rounded-xl px-4 pb-[22px] pt-7 text-center",
        "transition-all duration-[180ms]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400",
        isActive
          ? "shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
          : "shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]",
        "hover:-translate-y-0.5",
      )}
      style={{
        background: isActive ? colors.bg : "#FFFFFF",
        border: isActive
          ? `1.5px solid ${colors.color}55`
          : "1.5px solid #E5E7EB",
        borderLeft: isActive
          ? `3px solid ${colors.color}`
          : "3px solid transparent",
      }}
    >
      {badge && (
        <div className="absolute right-2.5 top-2.5">
          <Badge label={badge} />
        </div>
      )}

      <div
        className="mb-3.5 h-12 w-12 transition-opacity duration-[180ms]"
        style={{ opacity: isActive ? 1 : 0.82 }}
        aria-hidden="true"
        dangerouslySetInnerHTML={{
          __html: svgHtml.replace(
            'stroke="currentColor"',
            `stroke="${colors.color}"`,
          ),
        }}
      />

      <div
        className="mb-1 max-w-[160px] text-sm font-semibold leading-tight transition-colors duration-[180ms]"
        style={{ color: isActive ? colors.color : "#1F2937" }}
      >
        {title}
      </div>

      <div
        className="text-xs font-medium transition-colors duration-[180ms]"
        style={{
          color: isActive ? colors.color : "#9CA3AF",
          fontWeight: isActive ? 600 : 400,
        }}
      >
        {cat.count} {cat.count === 1 ? "tool" : "tools"}
      </div>
    </button>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export function CategoryCatalogView({
  basePath,
  categories,
  tools,
  locale,
  pageVariant,
}: CategoryCatalogViewProps) {
  const t = useTranslations("catalogExplorer");
  const searchParams = useSearchParams();

  const activeCategorySlug = searchParams?.get("category") ?? null;

  // ── Find tools for the active category ──
  const categoryTools = useMemo(() => {
    if (!activeCategorySlug) return [];
    const canonicalSlug = resolveCanonicalCategorySlug(activeCategorySlug);
    return tools.filter(
      (tool) => resolveCanonicalCategorySlug(tool.categoryKey) === canonicalSlug,
    );
  }, [tools, activeCategorySlug]);

  // ── Find the active category card ──
  const activeCategoryCard = useMemo(() => {
    if (!activeCategorySlug) return null;
    return categories.find((c) => c.category.slug === activeCategorySlug) ?? null;
  }, [categories, activeCategorySlug]);

  // ── Scroll to tools list when category is active ──
  const handleCategoryClick = useCallback(
    (slug: string) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (params.get("category") === slug) {
        params.delete("category");
      } else {
        params.set("category", slug);
      }
      const qs = params.toString();
      const url = qs ? `${basePath}?${qs}` : basePath;
      window.history.pushState(null, "", url);

      if (params.get("category")) {
        requestAnimationFrame(() => {
          const el = document.getElementById("category-tools");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      }
    },
    [basePath, searchParams],
  );

  // ── i18n helpers ──
  const localizationKey = locale as keyof FreeToolCategoryEntry["title"];

  return (
    <div className="min-w-0 flex-1">
      {/* ── Section label ── */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
          {t("compactGrid.categories")}
        </h2>
        {activeCategorySlug && (
          <button
            type="button"
            onClick={() => {
              const params = new URLSearchParams(searchParams?.toString() ?? "");
              params.delete("category");
              const url = params.toString() ? `${basePath}?${params}` : basePath;
              window.history.pushState(null, "", url);
            }}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
          >
            Clear selection
            <span aria-hidden="true">✕</span>
          </button>
        )}
      </div>

      {/* ── Category grid ── */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categories.map((cat) => {
            const isActive = activeCategorySlug === cat.category.slug;
            return (
              <CategoryCard
                key={cat.category.slug}
                cat={cat}
                isActive={isActive}
                onClick={() => handleCategoryClick(cat.category.slug)}
                badge={resolveBadge(cat, pageVariant)}
                locale={locale}
              />
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-sm text-slate-500">{t("search.noResults")}</p>
        </div>
      )}

      {/* ── All-tools panel (when no category selected or invalid slug) ── */}
      {(!activeCategorySlug || !activeCategoryCard) && (
        <div className="mt-10">
          <CatalogHubToolsClientPanel
            locale={locale}
            tools={tools}
            variant={pageVariant}
          />
        </div>
      )}

      {/* ── Full tool listing for selected category ── */}
      {activeCategoryCard && categoryTools.length > 0 && (
        <div
          id="category-tools"
          className="mt-8 animate-[fadeIn_0.25s_ease]"
        >
          {(() => {
            const cat = activeCategoryCard;
            const colors = getCategoryColor(cat.category.slug);
            const svgHtml = cat.category.symbolSvg || resolveCategorySvgSymbol(cat.category.slug);
            const badge = resolveBadge(cat, pageVariant);
            const title = cat.category.title[localizationKey] ?? cat.category.title.en;
            const tagline = cat.category.tagline?.[localizationKey] ?? cat.category.tagline?.en;
            const field = (cat.category as Record<string, unknown>).field as Record<string, string> | undefined;
            const fieldLabel = field?.[localizationKey] ?? field?.en;

            return (
              <div
                className="rounded-xl p-6"
                style={{
                  background: colors.bg,
                  border: `1.5px solid ${colors.color}33`,
                  borderLeft: `4px solid ${colors.color}`,
                }}
              >
                {/* ── Category header ── */}
                <div className="mb-5 flex items-start gap-3">
                  <div
                    className="h-12 w-12 shrink-0"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{
                      __html: svgHtml.replace(
                        'stroke="currentColor"',
                        `stroke="${colors.color}"`,
                      ),
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-gray-900">{title}</h3>
                      {badge && <Badge label={badge} />}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {categoryTools.length} tool{categoryTools.length !== 1 ? "s" : ""}
                      {fieldLabel ? ` · ${fieldLabel}` : ""}
                      {tagline ? ` · ${tagline}` : ""}
                    </p>
                  </div>
                </div>

                {/* ── Tool list ── */}
                <div className="space-y-1.5">
                  {categoryTools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={tool.href}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150",
                        "hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                      )}
                      style={{
                        background: "#FFFFFF",
                        border: `1px solid ${colors.color}22`,
                        color: "#374151",
                      }}
                    >
                      <span className="line-clamp-1 flex-1">{tool.name}</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="ml-2 shrink-0 text-gray-400"
                        aria-hidden="true"
                      >
                        <path
                          d="M5 3l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── Platform disclaimer ── */}
      <div className="mt-10 flex flex-wrap items-center gap-3.5 rounded-xl border border-slate-200 bg-kil-surface px-6 py-4.5">
        <span className="text-[11px] text-gray-400" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="3" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" />
            <path d="M1 7h14" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="5" cy="10" r="1.2" stroke="currentColor" strokeWidth="1" />
            <circle cx="11" cy="10" r="1.2" stroke="currentColor" strokeWidth="1" />
          </svg>
        </span>
        <p className="flex-1 text-xs leading-relaxed text-gray-500">
          <strong className="text-gray-700">{t("platformNote")}:</strong>{" "}
          {t("platformNoteText")}
        </p>
        <div className="flex shrink-0 gap-1.5">
          <Badge label="PRO" />
          <Badge label="NEW" />
          <Badge label="FREE" />
        </div>
      </div>
    </div>
  );
}
