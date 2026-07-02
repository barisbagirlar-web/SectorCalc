"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "@/lib/i18n-stub";
import { Search } from "lucide-react";
import { CalculatorCard } from "@/components/catalog/CalculatorCard";
import { CalculatorCardGrid } from "@/components/catalog/CalculatorCardGrid";
import { CategoryCardGrid, resolveCategoryCardGridVariant } from "@/components/catalog/CategoryCardGrid";
import type { CategoryCardItem } from "@/components/catalog/CategoryCardGrid";
import { resolveCalculatorCardAccent } from "@/lib/catalog/card-accent";
import type { CatalogGroup, CategoryExplorerVariant } from "@/lib/catalog/catalog-types";
import {
  DISCOVERY_TAB_ALL,
  countItemsForDiscoveryTab,
  getDiscoveryTabsForVariant,
  getItemsForDiscoveryTab,
  resolveDiscoveryTabLabelKey,
  type DiscoveryFlatItem,
} from "@/lib/catalog/discovery-tab-groups";

type DiscoveryCatalogExplorerProps = {
  groups: readonly CatalogGroup[];
  variant: CategoryExplorerVariant;
  defaultTabId?: string;
};

function normalizeSearch(value: string, locale: string): string {
  return value
    .toLocaleLowerCase(locale)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function scrollToToolsList() {
  requestAnimationFrame(() => {
    document.getElementById("tools-list")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

function resolveDiscoveryTabFromSearchParam(
  categoryParam: string,
  allowedTabIds: ReadonlySet<string>,
  fallbackTabId?: string,
): string {
  if (categoryParam === DISCOVERY_TAB_ALL) {
    return DISCOVERY_TAB_ALL;
  }
  if (categoryParam && allowedTabIds.has(categoryParam)) {
    return categoryParam;
  }
  if (
    categoryParam === "" &&
    fallbackTabId &&
    allowedTabIds.has(fallbackTabId)
  ) {
    return fallbackTabId;
  }
  return DISCOVERY_TAB_ALL;
}

export function DiscoveryCatalogExplorer({
  groups,
  variant,
  defaultTabId,
}: DiscoveryCatalogExplorerProps) {
  const t = useTranslations("catalogExplorer");
  const tCards = useTranslations("calculatorCards");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const didScrollForDeepLink = useRef(false);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = useMemo(() => getDiscoveryTabsForVariant(variant, groups), [variant, groups]);
  const visibleTabs = useMemo(
    () =>
      tabs.filter(
        (tab) => tab.id === DISCOVERY_TAB_ALL || countItemsForDiscoveryTab(groups, tab) > 0,
      ),
    [groups, tabs],
  );

  const allowedTabIds = useMemo(
    () => new Set(visibleTabs.map((tab) => tab.id)),
    [visibleTabs],
  );

  const categoryParam = searchParams?.get("category") ?? "";
  const selectedTabId = useMemo(
    () => resolveDiscoveryTabFromSearchParam(categoryParam, allowedTabIds, defaultTabId),
    [allowedTabIds, categoryParam, defaultTabId],
  );

  useEffect(() => {
    if (didScrollForDeepLink.current) {
      return;
    }
    if (categoryParam && allowedTabIds.has(categoryParam)) {
      didScrollForDeepLink.current = true;
      scrollToToolsList();
    }
  }, [allowedTabIds, categoryParam]);

  const activeTab =
    visibleTabs.find((tab) => tab.id === selectedTabId) ??
    visibleTabs.find((tab) => tab.id === DISCOVERY_TAB_ALL) ??
    visibleTabs[0];

  const items = useMemo(
    () => (activeTab ? getItemsForDiscoveryTab(groups, activeTab) : []),
    [activeTab, groups],
  );

  const allItems = useMemo(() => {
    const allTab =
      visibleTabs.find((tab) => tab.id === DISCOVERY_TAB_ALL) ?? visibleTabs[0];
    if (!allTab) {
      return [];
    }
    return getItemsForDiscoveryTab(groups, allTab);
  }, [groups, visibleTabs]);

  const visibleItems = useMemo(() => {
    const normalized = normalizeSearch(searchQuery, locale);
    if (normalized.length === 0) {
      return items;
    }
    return allItems.filter((item) => {
      const haystack = normalizeSearch(
        [item.title, item.description, item.groupLabel, item.groupId]
          .filter(Boolean)
          .join(" "),
        locale,
      );
      return haystack.includes(normalized);
    });
  }, [allItems, items, searchQuery, locale]);

  const filterTabs = useMemo(
    () =>
      visibleTabs.map((tab) => {
        const labelKey = resolveDiscoveryTabLabelKey(variant, tab.id);
        const label =
          labelKey != null
            ? t(labelKey)
            : (groups.find((group) => group.id === tab.id)?.label ?? tab.id);
        return {
          id: tab.id,
          label,
          count: countItemsForDiscoveryTab(groups, tab),
        };
      }),
    [groups, t, variant, visibleTabs],
  );

  const categoryCardItems: CategoryCardItem[] = useMemo(
    () =>
      filterTabs.map((tab) => ({
        slug: tab.id,
        label: tab.label,
        count: tab.count,
        isActive: activeTab?.id === tab.id,
      })),
    [activeTab, filterTabs],
  );

  const formatCount = useCallback(
    (count: number) => t(`labels.${variant}.countLabel`, { count }),
    [t, variant],
  );

  const badgeFree = t("search.badgeFree");
  const badgePremium = t("search.badgePremium");
  const isIndustry = variant === "industries";

  const resolveCta = (item: DiscoveryFlatItem) => {
    if (isIndustry) {
      return tCards("ctaOpenSector");
    }
    if (variant === "premium-tools" || item.itemKind === "premium-analyzer") {
      return item.ctaLabel ?? tCards("ctaOpen");
    }
    return item.ctaLabel ?? tCards("ctaCalculate");
  };

  const resolveTier = (item: DiscoveryFlatItem): "free" | "premium" => {
    if (variant === "premium-tools" || item.itemKind === "premium-analyzer") {
      return "premium";
    }
    return "free";
  };

  if (groups.every((group) => group.items.length === 0)) {
    return (
      <p className="text-sm text-body-charcoal" role="status">
        {t("search.noResults")}
      </p>
    );
  }

  return (
    <div
      className="sc-discovery-explorer"
      data-variant={variant}
      data-calculator-card-explorer="true"
    >
      <CategoryCardGrid
        items={categoryCardItems}
        formatCount={formatCount}
        variant={resolveCategoryCardGridVariant(variant)}
      />

      {!isIndustry && (
        <div className="relative mt-3">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t(`search.placeholder.${variant}`)}
            aria-label={t(`search.placeholder.${variant}`)}
            className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
          />
        </div>
      )}

      <p className="sc-results-label" role="status">
        {tCards.rich("resultsLabel", {
          count: visibleItems.length,
          strong: (chunks: any) => <strong>{chunks}</strong>,
        })}
      </p>

      <section id="tools-list">
        {visibleItems.length === 0 ? (
          <p className="mt-4 text-sm text-body-charcoal" role="status">
            {t("search.noResults")}
          </p>
        ) : (
          <CalculatorCardGrid className="mt-4">
            {visibleItems.map((item) => {
              const tier = resolveTier(item);
              return (
                <li key={item.href} className="min-w-0">
                  <CalculatorCard
                    title={item.title}
                    description={item.description}
                    href={item.href}
                    categoryLabel={item.groupLabel}
                    tier={tier}
                    variant={isIndustry ? "industry" : "calculator"}
                    inputCount={item.inputCount}
                    freeToolCount={item.freeToolCount}
                    premiumToolCount={item.premiumToolCount}
                    accent={resolveCalculatorCardAccent(item.groupId, tier)}
                    badgeFreeLabel={isIndustry ? tCards("badgeSector") : badgeFree}
                    badgePremiumLabel={badgePremium}
                    ctaLabel={resolveCta(item)}
                    inputCountLabel={(count) => tCards("inputCount", { count })}
                    sectorCountLabel={(free, premium) =>
                      tCards("sectorToolCounts", { free, premium })
                    }
                  />
                </li>
              );
            })}
          </CalculatorCardGrid>
        )}
      </section>
    </div>
  );
}
