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
};

export function CategoryCardGrid({ items, onSelect, countSuffix = "" }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => {
        const iconMeta = getCategoryCardIcon(item.slug);
        const Icon = iconMeta.icon;
        const active = item.isActive ?? false;
        return (
          <button
            key={item.slug}
            type="button"
            aria-pressed={active}
            aria-controls="tools-list"
            data-category-icon-name={iconMeta.iconName}
            onClick={() => onSelect(item.slug)}
            className={cn(
              "group flex min-h-[132px] flex-col items-center justify-center rounded-3xl border bg-white px-3 py-5 text-center transition",
              "shadow-sm hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md",
              active
                ? "border-orange-400 bg-orange-50/70 ring-2 ring-orange-100"
                : "border-slate-200",
            )}
          >
            <Icon
              className="mb-3 h-8 w-8 text-[#C45A2C]"
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
