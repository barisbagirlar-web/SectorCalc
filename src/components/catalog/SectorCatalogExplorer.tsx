"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CatalogGroupedSearch } from "@/components/catalog/CatalogGroupedSearch";
import { CategoryExplorer } from "@/components/catalog/CategoryExplorer";
import { CategoryCardGrid } from "@/components/catalog/CategoryCardGrid";
import type { CategoryCardItem } from "@/components/catalog/CategoryCardGrid";
import { CalculatorCard } from "@/components/catalog/CalculatorCard";
import { CalculatorCardGrid } from "@/components/catalog/CalculatorCardGrid";
import { DiscoveryCatalogExplorer } from "@/components/catalog/DiscoveryCatalogExplorer";
import { resolveCalculatorCardAccent } from "@/lib/catalog/card-accent";
import { buildSearchEntriesFromGroups } from "@/lib/catalog/catalog-search";
import type { CatalogGroup, CategoryExplorerVariant } from "@/lib/catalog/catalog-types";
import {
  DISCOVERY_TAB_ALL,
  countItemsForDiscoveryTab,
  getDiscoveryTabsForVariant,
  getItemsForDiscoveryTab,
  resolveDiscoveryTabLabelKey,
} from "@/lib/catalog/discovery-tab-groups";

type SectorCatalogExplorerProps = {
  groups: readonly CatalogGroup[];
  variant: CategoryExplorerVariant;
  defaultGroupId?: string;
  defaultTabId?: string;
};

const DISCOVERY_VARIANTS = new Set<CategoryExplorerVariant>([
  "free-tools",
  "premium-tools",
  "industries",
]);

const CATEGORY_ALL = DISCOVERY_TAB_ALL;

function scrollToToolsList() {
  requestAnimationFrame(() => {
    document.getElementById("tools-list")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

type FreeToolsCategoryCardExplorerProps = {
  groups: readonly CatalogGroup[];
  searchEntries: ReturnType<typeof buildSearchEntriesFromGroups>;
  variant: "free-tools";
};

function FreeToolsCategoryCardExplorer({
  groups,
  searchEntries,
  variant,
}: FreeToolsCategoryCardExplorerProps) {
  const t = useTranslations("catalogExplorer");
  const tCards = useTranslations("calculatorCards");
  const locale = useLocale();
  const [selectedCategoryId, setSelectedCategoryId] = useState(CATEGORY_ALL);

  const discoveryTabs = useMemo(
    () => getDiscoveryTabsForVariant("free-tools", groups),
    [groups],
  );

  const categoryCards: CategoryCardItem[] = useMemo(
    () =>
      discoveryTabs.map((tab) => {
        const labelKey = resolveDiscoveryTabLabelKey("free-tools", tab.id);
        return {
          slug: tab.id,
          label: labelKey != null ? t(labelKey) : tab.id,
          count: countItemsForDiscoveryTab(groups, tab),
          isActive: selectedCategoryId === tab.id,
        };
      }),
    [discoveryTabs, groups, selectedCategoryId, t],
  );

  const handleCategorySelect = useCallback((slug: string) => {
    setSelectedCategoryId(slug);
    scrollToToolsList();
  }, []);

  const items = useMemo(() => {
    const activeTab =
      discoveryTabs.find((tab) => tab.id === selectedCategoryId) ??
      discoveryTabs.find((tab) => tab.id === CATEGORY_ALL) ??
      discoveryTabs[0];

    if (!activeTab) {
      return [];
    }

    return getItemsForDiscoveryTab(groups, activeTab);
  }, [discoveryTabs, groups, selectedCategoryId]);

  const countSuffix = locale === "tr" ? "ücretsiz araç" : "free tool";
  const badgeFree = t("search.badgeFree");
  const badgePremium = t("search.badgePremium");

  return (
    <div className="sc-catalog-explorer-stack flex min-w-0 flex-col gap-6">
      <CatalogGroupedSearch
        entries={searchEntries}
        scope={variant}
        className="sc-catalog-explorer-stack__search"
      />
      <CategoryCardGrid
        items={categoryCards}
        onSelect={handleCategorySelect}
        countSuffix={countSuffix}
      />
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
            {items.map((item) => (
              <li key={item.href} className="min-w-0">
                <CalculatorCard
                  title={item.title}
                  description={item.description}
                  href={item.href}
                  categoryLabel={item.groupLabel}
                  tier="free"
                  variant="calculator"
                  inputCount={item.inputCount}
                  freeToolCount={item.freeToolCount}
                  premiumToolCount={item.premiumToolCount}
                  accent={resolveCalculatorCardAccent(item.groupId, "free")}
                  badgeFreeLabel={badgeFree}
                  badgePremiumLabel={badgePremium}
                  ctaLabel={item.ctaLabel ?? tCards("ctaCalculate")}
                  inputCountLabel={(count) => tCards("inputCount", { count })}
                  sectorCountLabel={(free, premium) =>
                    tCards("sectorToolCounts", { free, premium })
                  }
                />
              </li>
            ))}
          </CalculatorCardGrid>
        )}
      </section>
    </div>
  );
}

export function SectorCatalogExplorer({
  groups,
  variant,
  defaultGroupId,
  defaultTabId,
}: SectorCatalogExplorerProps) {
  const t = useTranslations("catalogExplorer");

  const labels = {
    navLabel: t(`labels.${variant}.navLabel`),
    countLabel: (count: number) => t(`labels.${variant}.countLabel`, { count }),
    viewCategory: t(`labels.${variant}.viewCategory`),
    viewCategoryOpen: t(`labels.${variant}.viewCategoryOpen`),
    openItem: t(`labels.${variant}.openItem`),
  };

  const searchEntries = useMemo(
    () => buildSearchEntriesFromGroups(groups ?? [], variant),
    [groups, variant],
  );

  const useDiscoveryLayout = DISCOVERY_VARIANTS.has(variant);

  if (variant === "free-tools") {
    return (
      <FreeToolsCategoryCardExplorer
        groups={groups ?? []}
        searchEntries={searchEntries}
        variant={variant}
      />
    );
  }

  return (
    <div className="sc-catalog-explorer-stack min-w-0">
      <CatalogGroupedSearch
        entries={searchEntries}
        scope={variant}
        className="sc-catalog-explorer-stack__search"
      />
      {useDiscoveryLayout ? (
        <DiscoveryCatalogExplorer
          groups={groups ?? []}
          variant={variant}
          defaultTabId={defaultTabId ?? defaultGroupId}
        />
      ) : (
        <CategoryExplorer
          groups={groups ?? []}
          variant={variant}
          defaultGroupId={defaultGroupId}
          labels={labels}
        />
      )}
    </div>
  );
}