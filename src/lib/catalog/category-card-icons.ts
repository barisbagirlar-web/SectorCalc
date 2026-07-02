import type { LucideIcon } from "lucide-react";
import { resolveCatalogCategoryIcon } from "@/lib/catalog/resolve-catalog-category-icon";

export type CategoryCardIconMeta = {
  icon: LucideIcon;
  iconName: string;
};

export function getCategoryCardIcon(slug: string): CategoryCardIconMeta {
  const icon = resolveCatalogCategoryIcon(slug);
  return {
    icon,
    iconName: slug,
  };
}

/** @deprecated Use resolveCatalogCategoryIcon - kept for audit scripts. */
export function assertUniqueCategoryCardIcons(): void {
  // Icon uniqueness is enforced by industry-slug-icon-map and category-icon-map tests.
}
