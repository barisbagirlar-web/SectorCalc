"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { CatalogGroupedSearch } from "@/components/catalog/CatalogGroupedSearch";
import { CategoryExplorer } from "@/components/catalog/CategoryExplorer";
import { DiscoveryCatalogExplorer } from "@/components/catalog/DiscoveryCatalogExplorer";
import { buildSearchEntriesFromGroups } from "@/lib/catalog/catalog-search";
import type { CatalogGroup, CategoryExplorerVariant } from "@/lib/catalog/catalog-types";

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
    [groups, variant]
  );

  const useDiscoveryLayout = DISCOVERY_VARIANTS.has(variant);

  return (
    <div className="sc-catalog-explorer-stack min-w-0">
      <CatalogGroupedSearch entries={searchEntries} scope={variant} className="sc-catalog-explorer-stack__search" />
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
