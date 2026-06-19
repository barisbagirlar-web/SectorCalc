/**
 * CategoryCatalogView — Premium Omni Calculator–style category grid.
 *
 * Sticky header · Tab filter (All / Free / Premium / Sector) · Search bar
 * Compact icon cards with PRO/NEW/FREE badges · Hover effects · Detail panel
 *
 * ECMI / ISO 9001 — TÜV-certifiable industrial UX.
 * Reference: Omni Calculator category grid pattern.
 */

"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { resolveCategorySvgSymbol } from "@/data/category-svg-symbols";
import type { CategoryCard } from "@/lib/tools/build-taxonomy-category-cards";
import type { FreeToolCategoryEntry } from "@/lib/free-tools/free-tool-categories";
import type { ToolData } from "@/lib/tools/all-tools-data";
import type { CatalogGridVariant } from "@/lib/catalog/catalog-grid-variant-styles";

// ─── Types ──────────────────────────────────────────────────────────────────

export type CategoryCatalogViewProps = {
  readonly basePath: "/free-tools" | "/premium-tools" | "/industries";
  readonly categories: readonly CategoryCard[];
  readonly tools: readonly ToolData[];
  readonly variant: CatalogGridVariant;
  readonly locale: string;
  readonly pageVariant: "free-tools" | "premium-tools" | "industries";
};

type TabId = "all" | "free" | "premium" | "sector";

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

// ─── Tab config ─────────────────────────────────────────────────────────────

function buildTabsData(categories: readonly CategoryCard[]): Array<{ id: TabId; count: number }> {
  const total = categories.length;
  const freeCount = categories.filter((c) => c.freeCount > 0).length;
  const premiumCount = categories.filter((c) => c.premiumCount > 0).length;
  const sectorCount = categories.length;

  return [
    { id: "all" as TabId,     count: total },
    { id: "free" as TabId,    count: freeCount },
    { id: "premium" as TabId, count: premiumCount },
    { id: "sector" as TabId,  count: sectorCount },
  ];
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
  basePath: _basePath,
  categories,
  tools: _tools,
  variant: _variant,
  locale,
  pageVariant,
}: CategoryCatalogViewProps) {
  const t = useTranslations("catalogExplorer");

  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ── Filter categories ──
  const filteredCategories = useMemo(() => {
    let list = [...categories];

    if (activeTab === "free") {
      list = list.filter((c) => c.freeCount > 0);
    } else if (activeTab === "premium") {
      list = list.filter((c) => c.premiumCount > 0);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((cat) => {
        const titles = Object.values(cat.category.title) as string[];
        if (titles.some((t) => t.toLowerCase().includes(q))) return true;
        const tagline = cat.category.tagline?.[locale as keyof typeof cat.category.tagline];
        if (tagline?.toLowerCase().includes(q)) return true;
        return false;
      });
    }

    return list;
  }, [categories, activeTab, searchQuery, locale]);

  // ── Tabs ──
  const tabs = useMemo(() => buildTabsData(categories), [categories]);

  const tabLabels: Record<TabId, string> = useMemo(() => ({
    all:     t("compactGrid.tabAll"),
    free:    t("compactGrid.tabFree"),
    premium: t("compactGrid.tabPremium"),
    sector:  t("compactGrid.tabSector"),
  }), [t]);

  // ── Selected category ──
  const selectedCategory = useMemo(() => {
    if (!activeCategorySlug) return null;
    return categories.find((c) => c.category.slug === activeCategorySlug) ?? null;
  }, [categories, activeCategorySlug]);

  // ── Handlers ──
  const handleCategoryClick = useCallback((slug: string) => {
    setActiveCategorySlug((prev) => (prev === slug ? null : slug));
  }, []);

  const handleTabChange = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
    setActiveCategorySlug(null);
  }, []);

  // ── i18n helpers ──
  const localizationKey = locale as keyof FreeToolCategoryEntry["title"];

  return (
    <div className="min-w-0 flex-1">
      {/* ── Tab bar ── */}
      <div className="mb-6 border-b border-slate-200">
        <nav className="flex gap-0 overflow-x-auto" aria-label={t("compactGrid.categories")}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap px-4 py-2.5 text-sm font-semibold transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400",
                  isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600",
                )}
                style={{
                  borderBottom: isActive ? "2.5px solid #3B6EE8" : "2.5px solid transparent",
                }}
              >
                {tabLabels[tab.id]}
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-[7px] py-px text-[11px] font-bold transition-all duration-150",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-100 text-gray-400",
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Search bar ── */}
      <div className="mb-6">
        <div className="relative">
          <svg
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            viewBox="0 0 15 15"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
            <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveCategorySlug(null);
            }}
            placeholder={t("compactGrid.searchPlaceholder")}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder:text-slate-400 transition-colors focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            aria-label={t("compactGrid.searchPlaceholder")}
            data-1p-ignore
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={t("search.clearSearch")}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Section label ── */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
            {t("compactGrid.categories")}
          </h2>
          {searchQuery && (
            <span className="text-xs text-gray-400">
              &mdash; {filteredCategories.length} {t("searchResult", { count: filteredCategories.length })}
            </span>
          )}
        </div>
        {activeCategorySlug && (
          <button
            type="button"
            onClick={() => setActiveCategorySlug(null)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
          >
            {t("clearSelection")}
            <span aria-hidden="true">✕</span>
          </button>
        )}
      </div>

      {/* ── Grid ── */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredCategories.map((cat) => (
            <CategoryCard
              key={cat.category.slug}
              cat={cat}
              isActive={activeCategorySlug === cat.category.slug}
              onClick={() => handleCategoryClick(cat.category.slug)}
              badge={resolveBadge(cat, pageVariant)}
              locale={locale}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <div className="mb-3 text-3xl" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="#D1D5DB" strokeWidth="2" />
              <path d="M12 12l8 8M20 12l-8 8" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="mb-1 text-sm font-semibold text-gray-700">{t("search.noResults")}</p>
          <p className="mb-3 text-xs text-gray-400">
            {t("noResultsHint", { query: searchQuery })}
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-xs font-semibold text-blue-600 underline hover:text-blue-800"
          >
            {t("search.clearSearch")}
          </button>
        </div>
      )}

      {/* ── Selected category detail panel ── */}
      {selectedCategory && (() => {
        const cat = selectedCategory;
        const colors = getCategoryColor(cat.category.slug);
        const svgHtml = cat.category.symbolSvg || resolveCategorySvgSymbol(cat.category.slug);
        const badge = resolveBadge(cat, pageVariant);
        const title = cat.category.title[localizationKey] ?? cat.category.title.en;
        const tagline = cat.category.tagline?.[localizationKey] ?? cat.category.tagline?.en;
        const field = (cat.category as Record<string, unknown>).field as Record<string, string> | undefined;
        const fieldLabel = field?.[localizationKey] ?? field?.en;

        return (
          <div
            className="mt-7 animate-[fadeIn_0.2s_ease] rounded-xl p-5"
            style={{
              background: colors.bg,
              border: `1.5px solid ${colors.color}33`,
              borderLeft: `4px solid ${colors.color}`,
            }}
          >
            <div className="mb-2.5 flex items-start gap-3">
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
                  {cat.count} tool{cat.count !== 1 ? "s" : ""}
                  {fieldLabel ? ` · ${fieldLabel}` : ""}
                  {tagline ? ` · ${tagline}` : ""}
                </p>
              </div>
            </div>
            <div className="mt-3.5 flex flex-wrap gap-2">
              {Array.from({ length: Math.min(cat.count, 5) }, (_, i) => (
                <a
                  key={i}
                  href={`#`}
                  className="rounded-lg border bg-white px-3.5 py-2 text-xs font-medium text-gray-700 transition-all duration-150 hover:shadow-sm"
                  style={{ borderColor: `${colors.color}33` }}
                >
                  {i < 4 ? `${t("openItem")} ${i + 1}` : `${t("viewAll")} →`}
                </a>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── Platform disclaimer ── */}
      <div className="mt-10 flex flex-wrap items-center gap-3.5 rounded-xl border border-slate-200 bg-white px-6 py-4.5">
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
