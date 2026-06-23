"use client";

import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/routing";
import { getCategoryCardIcon } from "@/lib/catalog/category-card-icons";
import { CATALOG_GRID_VARIANT_STYLES } from "@/lib/catalog/catalog-grid-variant-styles";
import type { CategoryExplorerVariant } from "@/lib/catalog/catalog-types";
import { cn } from "@/lib/cn";
import { scrollToToolsList } from "@/lib/navigation/scroll-to-tools-list";

export type CategoryCardItem = {
  readonly slug: string;
  readonly label: string;
  readonly count: number;
  readonly isActive?: boolean;
};

export type CategoryCardGridVariant = "free" | "premium" | "industry";

type Props = {
  readonly items: readonly CategoryCardItem[];
  readonly onSelect?: (slug: string) => void;
  readonly filterParamKey?: string;
  readonly allFilterValue?: string;
  readonly formatCount?: (count: number) => string;
  readonly countSuffix?: string;
  readonly variant?: CategoryCardGridVariant;
};

export function resolveCategoryCardGridVariant(
  page: CategoryExplorerVariant,
): CategoryCardGridVariant {
  if (page === "free-tools") {
    return "free";
  }
  if (page === "premium-tools") {
    return "premium";
  }
  if (page === "industries") {
    return "industry";
  }
  return "free";
}

export function CategoryCardGrid({
  items,
  onSelect,
  filterParamKey = "category",
  allFilterValue = "all",
  formatCount,
  countSuffix = "",
  variant = "premium",
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tone = CATALOG_GRID_VARIANT_STYLES[variant];
  const useLinks = onSelect == null;

  const handleFilterClick = (slug: string, active: boolean) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (slug === allFilterValue) {
      params.set(filterParamKey, allFilterValue);
    } else {
      params.set(filterParamKey, slug);
    }
    const query = params.toString();
    const href = query ? `${pathname}?${query}` : pathname;
    router.push(href, { scroll: false });
    if (!active) {
      scrollToToolsList();
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => {
        const iconMeta = getCategoryCardIcon(item.slug);
        const Icon = iconMeta.icon;
        const active = item.isActive ?? false;
        const countLabel = formatCount
          ? formatCount(item.count)
          : `${item.count}${countSuffix ? ` ${countSuffix}` : ""}`;

        const className = cn(
          "group flex min-h-[148px] flex-col items-center justify-center rounded-xl border bg-white px-3 py-5 text-center transition",
          "shadow-sm hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          tone.hoverBorder,
          tone.focusRing,
          active ? tone.active : "border-slate-200",
        );

        const content = (
          <>
            <Icon
              className={cn(
                "mb-3 h-12 w-12 stroke-[1.5] transition [stroke:currentColor]",
                tone.icon,
                tone.iconHover,
                variant === "premium" && "sc-premium-sector-icon",
              )}
              aria-hidden="true"
              strokeWidth={1.5}
            />
            <span className="line-clamp-2 text-sm font-bold text-gray-800">
              {item.label}
            </span>
            <span className="mt-2 text-xs font-medium text-slate-500">{countLabel}</span>
          </>
        );

        if (useLinks) {
          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => handleFilterClick(item.slug, active)}
              aria-current={active ? "true" : undefined}
              aria-controls="tools-list"
              data-category-icon-name={iconMeta.iconName}
              className={className}
            >
              {content}
            </button>
          );
        }

        return (
          <button
            key={item.slug}
            type="button"
            aria-pressed={active}
            aria-current={active ? "true" : undefined}
            aria-controls="tools-list"
            data-category-icon-name={iconMeta.iconName}
            onClick={() => onSelect(item.slug)}
            className={className}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
