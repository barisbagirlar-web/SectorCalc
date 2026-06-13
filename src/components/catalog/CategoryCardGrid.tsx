"use client";

import { getCategoryCardIcon } from "@/lib/catalog/category-card-icons";
import { cn } from "@/lib/cn";

export type CategoryCardItem = {
  readonly slug: string;
  readonly label: string;
  readonly count: number;
  readonly isActive?: boolean;
};

type Props = {
  readonly items: readonly CategoryCardItem[];
  readonly onSelect: (slug: string) => void;
  readonly countSuffix?: string;
  readonly variant?: "default" | "industry";
};

export function CategoryCardGrid({
  items,
  onSelect,
  countSuffix = "",
  variant = "default",
}: Props) {
  const isIndustry = variant === "industry";

  return (
    <div
      className={cn(
        "grid gap-3",
        isIndustry
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
          : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
      )}
    >
      {items.map((item) => {
        const iconMeta = getCategoryCardIcon(item.slug);
        const Icon = iconMeta.icon;
        const active = item.isActive ?? false;
        return (
          <button
            key={item.slug}
            type="button"
            aria-pressed={active}
            aria-current={active ? "true" : undefined}
            aria-controls="tools-list"
            data-category-icon-name={iconMeta.iconName}
            onClick={() => onSelect(item.slug)}
            className={cn(
              "group flex min-h-[132px] flex-col items-center justify-center rounded-3xl border bg-white px-3 py-5 text-center transition",
              "shadow-sm hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              isIndustry
                ? "hover:border-blue-300 focus-visible:ring-blue-500"
                : "hover:border-orange-300 focus-visible:ring-orange-400",
              active
                ? isIndustry
                  ? "border-blue-500 bg-blue-50/70 ring-2 ring-blue-100"
                  : "border-orange-400 bg-orange-50/70 ring-2 ring-orange-100"
                : "border-slate-200",
            )}
          >
            <Icon
              className={cn(
                "mb-3 h-8 w-8",
                isIndustry ? "text-blue-600" : "text-[#C45A2C]",
              )}
              aria-hidden="true"
              strokeWidth={1.5}
            />
            <span className="line-clamp-2 text-sm font-semibold text-slate-900">
              {item.label}
            </span>
            <span className="mt-2 text-xs font-medium text-slate-500">
              {item.count}
              {countSuffix ? ` ${countSuffix}` : ""}
            </span>
          </button>
        );
      })}
    </div>
  );
}
