"use client";

import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/routing";
import { getCategoryCardIcon } from "@/lib/catalog/category-card-icons";
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const formatItemCount = (count: number) =>
    formatCount ? formatCount(count) : String(count);

  const handleFilterClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === allFilterValue) {
      params.set(filterParamKey, allFilterValue);
    } else {
      params.set(filterParamKey, value);
    }
    const query = params.toString();
    const href = query ? `${pathname}?${query}` : pathname;
    router.push(href, { scroll: false });
  };

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
          <button
            type="button"
            onClick={() => handleFilterClick(allFilterValue)}
            aria-current={allIsActive ? "true" : undefined}
            className={cn(
              "flex min-h-[44px] w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition",
              allIsActive
                ? "bg-[#d4af37] font-medium text-white"
                : "text-gray-600 hover:bg-gray-100",
            )}
          >
            <span>{allLabel}</span>
            <span className="text-xs opacity-70">{formatItemCount(allCount)}</span>
          </button>
        </li>

        {categories.map((cat) => {
          const isActive = cat.isActive ?? false;
          const { icon: Icon } = getCategoryCardIcon(cat.slug);

          return (
            <li key={cat.slug}>
              <button
                type="button"
                onClick={() => handleFilterClick(cat.slug)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex min-h-[44px] w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition",
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
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
