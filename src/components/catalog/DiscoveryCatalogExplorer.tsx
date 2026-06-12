"use client";

import { useMemo, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { CalculatorCard } from "@/components/catalog/CalculatorCard";
import { CalculatorCardGrid } from "@/components/catalog/CalculatorCardGrid";
import { CalculatorFilterBar } from "@/components/catalog/CalculatorFilterBar";
import { CategoryCardGrid } from "@/components/catalog/CategoryCardGrid";
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

export function DiscoveryCatalogExplorer({
  groups,
  variant,
  defaultTabId,
}: DiscoveryCatalogExplorerProps) {
  const t = useTranslations("catalogExplorer");
  const tCards = useTranslations("calculatorCards");
  const tabs = useMemo(() => getDiscoveryTabsForVariant(variant, groups), [variant, groups]);
  const visibleTabs = useMemo(
    () => tabs.filter((tab) => tab.id === DISCOVERY_TAB_ALL || countItemsForDiscoveryTab(groups, tab) > 0),
    [groups, tabs],
  );
  const initialTabId =
    defaultTabId && visibleTabs.some((tab) => tab.id === defaultTabId)
      ? defaultTabId
      : DISCOVERY_TAB_ALL;
  const [selectedTabId, setSelectedTabId] = useState(initialTabId);
  const activeTab =
    visibleTabs.find((tab) => tab.id === selectedTabId) ??
    visibleTabs.find((tab) => tab.id === DISCOVERY_TAB_ALL) ??
    visibleTabs[0];

  const items = useMemo(
    () => (activeTab ? getItemsForDiscoveryTab(groups, activeTab) : []),
    [activeTab, groups],
  );

  const filterTabs = useMemo(
    () =>
      visibleTabs.map((tab) => {
        const labelKey = resolveDiscoveryTabLabelKey(variant, tab.id);
        const label =
          labelKey != null
            ? t(labelKey)
            : groups.find((group) => group.id === tab.id)?.label ?? tab.id;
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
    [filterTabs, activeTab],
  );

  const handleCategorySelect = useCallback(
    (tabId: string) => {
      setSelectedTabId(tabId);
      requestAnimationFrame(() => {
        document.getElementById("tools-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [],
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
    <div className="sc-discovery-explorer" data-variant={variant} data-calculator-card-explorer="true">
      {isIndustry ? (
        <CalculatorFilterBar
          tabs={filterTabs}
          activeTabId={activeTab?.id ?? DISCOVERY_TAB_ALL}
          onTabChange={setSelectedTabId}
          ariaLabel={t(`labels.${variant}.navLabel`)}
        />
      ) : (
        <CategoryCardGrid items={categoryCardItems} onSelect={handleCategorySelect} />
      )}

      <p className="sc-results-label" role="status">
        {tCards.rich("resultsLabel", {
          count: items.length,
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>

      <section id="tools-list">
        {items.length === 0 ? (
          <p className="mt-4 text-sm text-body-charcoal" role="status">
            {t("search.noResults")}
          </p>
        ) : (
          <CalculatorCardGrid className="mt-4">
            {items.map((item) => {
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