import type { CatalogGroup, CatalogItem, CategoryExplorerVariant } from "@/lib/catalog/catalog-types";

export const DISCOVERY_TAB_ALL = "all";

export type DiscoveryTabConfig = {
  readonly id: string;
  readonly groupIds: readonly string[];
};

export type DiscoveryFlatItem = CatalogItem & {
  readonly groupId: string;
  readonly groupLabel: string;
};

const FREE_TOOLS_TABS: readonly DiscoveryTabConfig[] = [
  { id: DISCOVERY_TAB_ALL, groupIds: [] },
  { id: "cost-margin", groupIds: ["finance-business"] },
  { id: "scrap-oee", groupIds: ["manufacturing-workshop"] },
  { id: "energy-carbon", groupIds: ["energy-carbon"] },
  { id: "routing-logistics", groupIds: ["logistics-travel"] },
  { id: "construction-field", groupIds: ["construction-measurement"] },
  { id: "daily-practical", groupIds: ["everyday-life", "math-statistics", "conversion", "health-body", "agriculture-food"] },
] as const;

const PREMIUM_TOOLS_TABS: readonly DiscoveryTabConfig[] = [
  { id: DISCOVERY_TAB_ALL, groupIds: [] },
  { id: "cost-margin", groupIds: ["cost_margin"] },
  { id: "operations-oee", groupIds: ["oee_productivity", "time_delay"] },
  { id: "energy-carbon", groupIds: ["energy_carbon"] },
  { id: "manufacturing-engineering", groupIds: ["measurement_calibration", "scrap_waste"] },
  { id: "finance-hr", groupIds: ["benchmark_health"] },
  { id: "quality-lean", groupIds: ["scrap_waste"] },
  { id: "engineering-technical", groupIds: ["measurement_calibration", "route_logistics"] },
] as const;

export function getDiscoveryTabsForVariant(
  variant: CategoryExplorerVariant,
  groups: readonly CatalogGroup[]
): readonly DiscoveryTabConfig[] {
  if (variant === "free-tools") {
    return FREE_TOOLS_TABS;
  }
  if (variant === "premium-tools") {
    return PREMIUM_TOOLS_TABS;
  }
  if (variant === "industries") {
    const visible = groups.filter((group) => group.items.length > 0);
    return [{ id: DISCOVERY_TAB_ALL, groupIds: [] }, ...visible.map((group) => ({ id: group.id, groupIds: [group.id] }))];
  }
  return [{ id: DISCOVERY_TAB_ALL, groupIds: [] }];
}

export function resolveDiscoveryTabLabelKey(
  variant: CategoryExplorerVariant,
  tabId: string
): string | null {
  if (tabId === DISCOVERY_TAB_ALL) {
    return "discoveryTabs.all";
  }
  if (variant === "industries") {
    return null;
  }
  if (variant === "premium-tools") {
    return `discoveryTabs.premium-tools.${tabId}`;
  }
  return `discoveryTabs.${variant}.${tabId}`;
}

export function getItemsForDiscoveryTab(
  groups: readonly CatalogGroup[],
  tab: DiscoveryTabConfig
): DiscoveryFlatItem[] {
  const visible = groups.filter((group) => group.items.length > 0);
  const source =
    tab.id === DISCOVERY_TAB_ALL || tab.groupIds.length === 0
      ? visible
      : visible.filter((group) => tab.groupIds.includes(group.id));

  return source.flatMap((group) =>
    group.items.map((item) => ({
      ...item,
      groupId: group.id,
      groupLabel: group.label,
    }))
  );
}

export function countItemsForDiscoveryTab(
  groups: readonly CatalogGroup[],
  tab: DiscoveryTabConfig
): number {
  return getItemsForDiscoveryTab(groups, tab).length;
}
