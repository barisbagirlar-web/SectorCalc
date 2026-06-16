"use client";

import { Link, usePathname } from "@/i18n/routing";
import { getCategoryCardIcon } from "@/lib/catalog/category-card-icons";
import { buildCatalogFilterHref } from "@/lib/navigation/catalog-filter-href";
import { cn } from "@/lib/cn";

export type CategoryFilterItem = {
  readonly slug: string;
  readonly label: string;
  readonly count: number;
  readonly isActive?: boolean;
};

type CategoryFilterSidebarProps = {
  readonly categories: readonly CategoryFilterItem[];
  readonly title: string;
  readonly allLabel: string;
  readonly allCount: number;
  readonly allIsActive: boolean;
  readonly filterParamKey?: string;
  readonly allFilterValue?: string;
  readonly formatCount?: (count: number) => string;
};

function scrollToToolsList() {
  requestAnimationFrame(() => {
    document.getElementById("tools-list")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

export function CategoryFilterSidebar({
  categories,
  title,
  allLabel,
  allCount,
  allIsActive,
  filterParamKey = "category",
  allFilterValue = "all",
  formatCount,
}: CategoryFilterSidebarProps) {
  const pathname = usePathname();

  const formatItemCount = (count: number) =>
    formatCount ? formatCount(count) : String(count);

  return (
    <nav
      className="sc-category-filter-sidebar w-full flex-shrink-0 md:w-64"
      aria-label={title}
    >
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-700">
        {title}
      </h2>
      <ul className="space-y-1">
        <li>
          <Link
            href={buildCatalogFilterHref(pathname, filterParamKey, allFilterValue, allFilterValue)}
            scroll={false}
            aria-current={allIsActive ? "true" : undefined}
            onClick={() => {
              if (!allIsActive) {
                scrollToToolsList();
              }
            }}
            className={cn(
              "flex min-h-[44px] items-center justify-between rounded-lg px-3 py-2 text-sm transition",
              allIsActive
                ? "bg-[#d4af37] font-medium text-white"
                : "text-gray-600 hover:bg-gray-100",
            )}
          >
            <span>{allLabel}</span>
            <span className="text-xs opacity-70">{formatItemCount(allCount)}</span>
          </Link>
        </li>

        {categories.map((cat) => {
          const isActive = cat.isActive ?? false;
          const { icon: Icon } = getCategoryCardIcon(cat.slug);

          return (
            <li key={cat.slug}>
              <Link
                href={buildCatalogFilterHref(pathname, filterParamKey, cat.slug, allFilterValue)}
                scroll={false}
                aria-current={isActive ? "true" : undefined}
                onClick={() => {
                  if (!isActive) {
                    scrollToToolsList();
                  }
                }}
                className={cn(
                  "flex min-h-[44px] items-center justify-between rounded-lg px-3 py-2 text-sm transition",
                  isActive
                    ? "bg-[#d4af37] font-medium text-white"
                    : "text-gray-600 hover:bg-gray-100",
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Icon
                    size={18}
                    className={cn("shrink-0", isActive ? "text-white" : "text-gray-500")}
                    aria-hidden="true"
                  />
                  <span className="truncate">{cat.label}</span>
                </span>
                <span className="shrink-0 text-xs opacity-70">{formatItemCount(cat.count)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
