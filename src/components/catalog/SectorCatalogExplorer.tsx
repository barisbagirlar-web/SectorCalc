"use client";

import { useTranslations } from "next-intl";
import { CategoryExplorer } from "@/components/catalog/CategoryExplorer";
import type { CatalogGroup, CategoryExplorerVariant } from "@/lib/catalog/catalog-types";

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
  const t = useTranslations("catalogExplorer");

  const labels = {
    navLabel: t(`labels.${variant}.navLabel`),
    countLabel: (count: number) => t(`labels.${variant}.countLabel`, { count }),
    viewCategory: t(`labels.${variant}.viewCategory`),
    viewCategoryOpen: t(`labels.${variant}.viewCategoryOpen`),
    openItem: t(`labels.${variant}.openItem`),
  };

  return (
    <CategoryExplorer
      groups={groups}
      variant={variant}
      defaultGroupId={defaultGroupId}
      labels={labels}
    />
  );
}
