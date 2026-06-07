"use client";

import { CategoryExplorer } from "@/components/catalog/CategoryExplorer";
import type { CatalogGroup, CategoryExplorerVariant } from "@/lib/catalog/catalog-types";

const SECTOR_CATALOG_LABELS = {
  navLabel: "Browse by category",
  countLabel: (count: number) => `${count} ${count === 1 ? "tool" : "tools"}`,
  viewCategory: "View tools",
  viewCategoryOpen: "Showing tools",
  openItem: "Open calculator →",
} as const;

const PREMIUM_CATALOG_LABELS = {
  navLabel: "Browse by report type",
  countLabel: (count: number) => `${count} ${count === 1 ? "analyzer" : "analyzers"}`,
  viewCategory: "View analyzers",
  viewCategoryOpen: "Showing analyzers",
  openItem: "View analyzer →",
} as const;

const INDUSTRY_CATALOG_LABELS = {
  navLabel: "Browse by sector group",
  countLabel: (count: number) => `${count} ${count === 1 ? "sector" : "sectors"}`,
  viewCategory: "View sectors",
  viewCategoryOpen: "Showing sectors",
  openItem: "Open sector hub →",
} as const;

function labelsForVariant(variant: CategoryExplorerVariant) {
  switch (variant) {
    case "premium-tools":
      return PREMIUM_CATALOG_LABELS;
    case "industries":
      return INDUSTRY_CATALOG_LABELS;
    default:
      return SECTOR_CATALOG_LABELS;
  }
}

type SectorCatalogExplorerProps = {
  groups: readonly CatalogGroup[];
  variant: CategoryExplorerVariant;
  defaultGroupId?: string;
};

export function SectorCatalogExplorer({
  groups,
  variant,
  defaultGroupId,
}: SectorCatalogExplorerProps) {
  return (
    <CategoryExplorer
      groups={groups}
      variant={variant}
      defaultGroupId={defaultGroupId}
      labels={labelsForVariant(variant)}
    />
  );
}
