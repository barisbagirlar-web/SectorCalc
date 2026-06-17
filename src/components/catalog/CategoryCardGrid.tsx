"use client";

import { Link, usePathname } from "@/i18n/routing";
import { getCategoryCardIcon } from "@/lib/catalog/category-card-icons";
import { cn } from "@/lib/cn";
import { buildCatalogFilterHref } from "@/lib/navigation/catalog-filter-href";

export type CategoryCardItem = {
  readonly slug: string;
  readonly label: string;
  readonly count: number;
  readonly isActive?: boolean;
};

type Props = {
  readonly items: readonly CategoryCardItem[];
  readonly onSelect?: (slug: string) => void;
  readonly filterParamKey?: string;
  readonly allFilterValue?: string;
  readonly formatCount?: (count: number) => string;
  readonly countSuffix?: string;
  readonly variant?: "default" | "industry";
};

function scrollToToolsList() {
  requestAnimationFrame(() => {
    document.getElementById("tools-list")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

export function CategoryCardGrid({
  items,
  onSelect,
  filterParamKey = "category",
  allFilterValue = "all",
  formatCount,
  countSuffix = "",
  variant = "default",
}: Props) {
  const pathname = usePathname();
  const isIndustry = variant === "industry";
  const useLinks = onSelect == null;

  return (
    <div
      className={cn(
        "grid gap-3",
        isIndustry
          ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
      )}
    >
      {items.map((item) => {
        const iconMeta = getCategoryCardIcon(item.slug);
        const Icon = iconMeta.icon;
        const active = item.isActive ?? false;
        const countLabel = formatCount
          ? formatCount(item.count)
          : `${item.count}${countSuffix ? ` ${countSuffix}` : ""}`;

        const className = cn(
          "group flex min-h-[148px] flex-col items-center justify-center rounded-xl border bg-white px-3 py-5 text-center transition",
          "shadow-sm hover:-translate-y-0.5 hover:border-[#d4af37] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          isIndustry
            ? "focus-visible:ring-blue-500"
            : "focus-visible:ring-orange-400",
          active
            ? isIndustry
              ? "border-blue-500 bg-blue-50/70 ring-2 ring-blue-100"
              : "border-orange-400 bg-orange-50/70 ring-2 ring-orange-100"
            : "border-slate-200",
        );

        const content = (
          <>
            <Icon
              className={cn(
                "mb-3 h-12 w-12 transition group-hover:text-[#d4af37]",
                isIndustry ? "text-blue-600" : "text-gray-700",
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
            <Link
              key={item.slug}
              href={buildCatalogFilterHref(pathname, filterParamKey, item.slug, allFilterValue)}
              scroll={false}
              aria-current={active ? "true" : undefined}
              aria-controls="tools-list"
              data-category-icon-name={iconMeta.iconName}
              onClick={() => {
                if (!active) {
                  scrollToToolsList();
                }
              }}
              className={className}
            >
              {content}
            </Link>
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
