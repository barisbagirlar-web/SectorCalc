"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import type { Tool } from "@/data/tools";
import { getCategoryCardIcon } from "@/lib/catalog/category-card-icons";
import {
  FREE_TRAFFIC_CATEGORY_META,
  type FreeTrafficCategoryMeta,
} from "@/lib/features/tools/free-traffic-categories";
import type { FreeTrafficCategory } from "@/lib/features/tools/free-traffic-infer";
import { inferFreeTrafficCategory } from "@/lib/features/tools/free-traffic-infer";
import { ToolsIconTileGrid } from "@/components/tools/ToolsIconTileGrid";

type ToolsCategoryHubProps = {
  readonly tools: readonly Tool[];
  readonly basePath?: string;
};

type CategoryGroup = {
  readonly meta: FreeTrafficCategoryMeta;
  readonly tools: readonly Tool[];
  readonly examples: readonly string[];
};

function normalizeSearch(value: string): string {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function groupToolsByCategory(tools: readonly Tool[]): Map<FreeTrafficCategory, Tool[]> {
  const map = new Map<FreeTrafficCategory, Tool[]>();
  for (const meta of FREE_TRAFFIC_CATEGORY_META) {
    map.set(meta.id, []);
  }
  for (const tool of tools) {
    const category = inferFreeTrafficCategory(tool.slug);
    const list = map.get(category);
    if (list) {
      list.push(tool);
    }
  }
  return map;
}

function buildCategoryGroups(tools: readonly Tool[]): CategoryGroup[] {
  const byCategory = groupToolsByCategory(tools);
  return FREE_TRAFFIC_CATEGORY_META.map((meta) => {
    const categoryTools = [...(byCategory.get(meta.id) ?? [])].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    return {
      meta,
      tools: categoryTools,
      examples: categoryTools.slice(0, 3).map((tool) => tool.name),
    };
  }).filter((group) => group.tools.length > 0);
}

function isFreeTrafficCategory(value: string): value is FreeTrafficCategory {
  return FREE_TRAFFIC_CATEGORY_META.some((meta) => meta.id === value);
}

export function ToolsCategoryHub({ tools, basePath = "/tools/generated" }: ToolsCategoryHubProps) {
  const tCatalog = useTranslations("freeTrafficCatalog");
  const t = useTranslations("generatedToolCatalog");
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  const categoryParam = searchParams?.get("category") ?? "";
  const selectedCategory = isFreeTrafficCategory(categoryParam) ? categoryParam : null;

  const categoryGroups = useMemo(() => buildCategoryGroups(tools), [tools]);
  const selectedGroup = selectedCategory
    ? categoryGroups.find((group) => group.meta.id === selectedCategory)
    : null;

  const visibleTools = useMemo(() => {
    const pool = selectedGroup?.tools ?? tools;
    const normalized = normalizeSearch(query);
    if (normalized.length === 0) {
      return pool;
    }
    return pool.filter((tool) => {
      const haystack = normalizeSearch([tool.name, tool.slug, tool.shortDescription].join(" "));
      return haystack.includes(normalized);
    });
  }, [query, selectedGroup, tools]);

  if (selectedGroup) {
    const iconMeta = getCategoryCardIcon(selectedGroup.meta.id);
    const CategoryIcon = iconMeta.icon;

    return (
      <div className="space-y-6">
        <div className="sc-tools-category-header">
          <CategoryIcon className="sc-tools-category-header__icon" strokeWidth={1.5} aria-hidden="true" />
          <div>
            <h2 className="sc-tools-category-header__title">
              {tCatalog(selectedGroup.meta.labelKey)}
            </h2>
            <p className="sc-tools-category-header__summary">
              {tCatalog(selectedGroup.meta.descriptionKey)}
            </p>
          </div>
        </div>

        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            className="w-full min-h-[44px] rounded-lg border border-technical-gray bg-white py-2.5 pl-10 pr-4 text-sm text-premium-velvet placeholder:text-body-charcoal focus:border-premium-copper focus:outline-none"
          />
        </div>

        <p className="text-sm text-body-charcoal" role="status">
          {t("resultsCount", { count: visibleTools.length })}
        </p>

        {visibleTools.length === 0 ? (
          <p className="rounded-lg border border-dashed border-technical-gray bg-surface-cream px-4 py-10 text-center text-sm text-body-charcoal">
            {t("noResults")}
          </p>
        ) : (
          <ToolsIconTileGrid tools={visibleTools} />
        )}

        <p>
          <Link href={basePath} className="text-sm font-medium text-deep-navy hover:underline">
            {t("allCategories")}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchPlaceholder")}
          className="w-full min-h-[44px] rounded-lg border border-technical-gray bg-white py-2.5 pl-10 pr-4 text-sm text-premium-velvet placeholder:text-body-charcoal focus:border-premium-copper focus:outline-none"
        />
      </div>

      {query.trim().length > 0 ? (
        <>
          <p className="text-sm text-body-charcoal" role="status">
            {t("resultsCount", { count: visibleTools.length })}
          </p>
          {visibleTools.length === 0 ? (
            <p className="rounded-lg border border-dashed border-technical-gray bg-surface-cream px-4 py-10 text-center text-sm text-body-charcoal">
              {t("noResults")}
            </p>
          ) : (
            <ToolsIconTileGrid tools={visibleTools} />
          )}
        </>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categoryGroups.map((group) => {
            const iconMeta = getCategoryCardIcon(group.meta.id);
            const Icon = iconMeta.icon;
            const href = `/tools/category/${group.meta.id}`;

            return (
              <Link
                key={group.meta.id}
                href={href}
                prefetch={false}
                className="sc-tools-category-card group"
              >
                <Icon
                  className="sc-tools-category-card__icon"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="sc-tools-category-card__title">
                    {tCatalog(group.meta.labelKey)}
                  </h2>
                  {group.examples.length > 0 ? (
                    <p className="sc-tools-category-card__examples">
                      {group.examples.join(", ")}
                    </p>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
