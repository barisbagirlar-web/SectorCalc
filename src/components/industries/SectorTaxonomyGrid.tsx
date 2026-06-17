"use client";

import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getCategoryCardIcon } from "@/lib/catalog/category-card-icons";
import { cn } from "@/lib/cn";
import type { TaxonomySectorCard } from "@/lib/tools/build-taxonomy-sector-cards";

export type SectorTaxonomyGridVariant = "industry" | "free" | "premium";

type SectorTaxonomyGridProps = {
  readonly basePath: "/industries" | "/free-tools" | "/premium-tools";
  readonly sectors: readonly TaxonomySectorCard[];
  readonly toolCountLabel: (count: number) => string;
  readonly variant?: SectorTaxonomyGridVariant;
};

const GRID_VARIANT_STYLES: Record<
  SectorTaxonomyGridVariant,
  {
    readonly icon: string;
    readonly iconHover: string;
    readonly hoverBorder: string;
    readonly focusRing: string;
    readonly active: string;
  }
> = {
  industry: {
    icon: "text-[var(--sc-navy)]",
    iconHover: "group-hover:text-blue-800",
    hoverBorder: "hover:border-blue-400",
    focusRing: "focus-visible:ring-blue-500",
    active: "border-blue-500 bg-blue-50/70 ring-2 ring-blue-100",
  },
  free: {
    icon: "text-[var(--sc-navy)]",
    iconHover: "group-hover:text-blue-800",
    hoverBorder: "hover:border-blue-400",
    focusRing: "focus-visible:ring-blue-500",
    active: "border-blue-500 bg-blue-50/70 ring-2 ring-blue-100",
  },
  premium: {
    icon: "text-[#C45A2C]",
    iconHover: "group-hover:text-[#9a3412]",
    hoverBorder: "hover:border-[#C45A2C]",
    focusRing: "focus-visible:ring-orange-400",
    active: "border-orange-400 bg-orange-50/70 ring-2 ring-orange-100",
  },
};

export function SectorTaxonomyGrid({
  basePath,
  sectors,
  toolCountLabel,
  variant = "industry",
}: SectorTaxonomyGridProps) {
  const searchParams = useSearchParams();
  const rawSelected = searchParams?.get("sector") ?? "";
  const selectedSectorId = rawSelected === "all" ? "" : rawSelected;
  const visibleSectors = sectors.filter((entry) => entry.count > 0);
  const tone = GRID_VARIANT_STYLES[variant];

  if (visibleSectors.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {visibleSectors.map(({ sector, label, count }) => {
        const iconMeta = getCategoryCardIcon(sector.id);
        const Icon = iconMeta.icon;
        const active = selectedSectorId === sector.id;
        const href = active
          ? basePath
          : `${basePath}?sector=${encodeURIComponent(sector.id)}`;

        return (
          <Link
            key={sector.id}
            href={href}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex min-h-[148px] flex-col items-center justify-center rounded-xl border bg-white px-3 py-5 text-center transition",
              "shadow-sm hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              tone.hoverBorder,
              tone.focusRing,
              active ? tone.active : "border-slate-200",
            )}
          >
            <Icon
              className={cn("mb-3 h-12 w-12 transition", tone.icon, tone.iconHover)}
              aria-hidden="true"
              strokeWidth={1.5}
            />
            <span className="line-clamp-2 text-sm font-bold text-gray-800">{label}</span>
            <span className="mt-2 text-xs font-medium text-slate-500">
              {toolCountLabel(count)}
            </span>
            {sector.professions.length > 0 ? (
              <span className="mt-2 line-clamp-1 text-[11px] text-slate-400">
                {sector.professions.slice(0, 3).join(" · ")}
              </span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
