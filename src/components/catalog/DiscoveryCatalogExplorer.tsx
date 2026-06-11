"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
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

function DiscoveryToolCard({
  item,
  variant,
  badgeFree,
  badgePremium,
  ctaCalculate,
  ctaOpenAnalysis,
  ctaOpenSector,
  freeCountLabel,
  premiumCountLabel,
}: {
  item: DiscoveryFlatItem;
  variant: CategoryExplorerVariant;
  badgeFree: string;
  badgePremium: string;
  ctaCalculate: string;
  ctaOpenAnalysis: string;
  ctaOpenSector: string;
  freeCountLabel: (count: number) => string;
  premiumCountLabel: (count: number) => string;
}) {
  const isPremium = variant === "premium-tools" || item.itemKind === "premium-analyzer";
  const isIndustry = variant === "industries";
  const cta = isIndustry ? ctaOpenSector : isPremium ? ctaOpenAnalysis : ctaCalculate;

  return (
    <article className="sc-ledger-card sc-craft-card sc-ledger-letterpress sc-discovery-card">
      {!isIndustry ? (
        <div className="sc-discovery-card__head">
          <span
            className={`sc-discovery-card__badge${
              isPremium ? " sc-discovery-card__badge--premium" : " sc-discovery-card__badge--free"
            }`}
          >
            {isPremium ? badgePremium : badgeFree}
          </span>
          <span className="sc-discovery-card__category line-clamp-1">{item.groupLabel}</span>
        </div>
      ) : null}
      <h3 className="sc-discovery-card__title line-clamp-2">{item.title}</h3>
      <p className="sc-discovery-card__body line-clamp-2">{item.description}</p>
      {isIndustry && item.freeToolCount != null && item.premiumToolCount != null ? (
        <p className="sc-discovery-card__counts">
          {freeCountLabel(item.freeToolCount)} · {premiumCountLabel(item.premiumToolCount)}
        </p>
      ) : null}
      <Link href={item.href} prefetch={false} className="sc-discovery-card__cta">
        {cta}
      </Link>
    </article>
  );
}

export function DiscoveryCatalogExplorer({
  groups,
  variant,
  defaultTabId,
}: DiscoveryCatalogExplorerProps) {
  const t = useTranslations("catalogExplorer");
  const tabs = useMemo(() => getDiscoveryTabsForVariant(variant, groups), [variant, groups]);
  const visibleTabs = useMemo(
    () => tabs.filter((tab) => tab.id === DISCOVERY_TAB_ALL || countItemsForDiscoveryTab(groups, tab) > 0),
    [groups, tabs]
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
    [activeTab, groups]
  );

  const badgeFree = t("search.badgeFree");
  const badgePremium = t("search.badgePremium");
  const ctaCalculate = t("discoveryCards.ctaCalculate");
  const ctaOpenAnalysis = t("discoveryCards.ctaOpenAnalysis");
  const ctaOpenSector = t("discoveryCards.ctaOpenSector");
  const freeCountLabel = (count: number) => t("discoveryCards.freeCount", { count });
  const premiumCountLabel = (count: number) => t("discoveryCards.premiumCount", { count });

  if (groups.every((group) => group.items.length === 0)) {
    return (
      <p className="text-sm text-body-charcoal" role="status">
        {t("search.noResults")}
      </p>
    );
  }

  return (
    <div className="sc-discovery-explorer" data-variant={variant}>
      <div
        className="sc-discovery-explorer__tabs"
        role="tablist"
        aria-label={t(`labels.${variant}.navLabel`)}
      >
        {visibleTabs.map((tab) => {
          const labelKey = resolveDiscoveryTabLabelKey(variant, tab.id);
          const label =
            labelKey != null
              ? t(labelKey)
              : groups.find((group) => group.id === tab.id)?.label ?? tab.id;
          const isActive = activeTab?.id === tab.id;
          const count = countItemsForDiscoveryTab(groups, tab);

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`sc-discovery-explorer__tab${isActive ? " sc-discovery-explorer__tab--active" : ""}`}
              onClick={() => setSelectedTabId(tab.id)}
            >
              {label}
              <span className="sc-discovery-explorer__tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-body-charcoal" role="status">
          {t("search.noResults")}
        </p>
      ) : (
        <ul className="sc-discovery-explorer__grid" role="list">
          {items.map((item) => (
            <li key={item.href} className="min-w-0">
              <DiscoveryToolCard
                item={item}
                variant={variant}
                badgeFree={badgeFree}
                badgePremium={badgePremium}
                ctaCalculate={ctaCalculate}
                ctaOpenAnalysis={ctaOpenAnalysis}
                ctaOpenSector={ctaOpenSector}
                freeCountLabel={freeCountLabel}
                premiumCountLabel={premiumCountLabel}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
