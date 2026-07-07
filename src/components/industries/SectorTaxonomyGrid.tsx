"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getCategoryCardIcon } from "@/lib/catalog/category-card-icons";
import { CATALOG_GRID_VARIANT_STYLES } from "@/lib/catalog/catalog-grid-variant-styles";
import { cn } from "@/lib/core/cn";
import type { TaxonomySectorCard } from "@/lib/features/tools/build-taxonomy-sector-cards";

export type SectorTaxonomyGridVariant = "industry" | "free" | "premium";

type SectorTaxonomyGridProps = {
  readonly basePath: "/industries" | "/free-tools" | "/free-tools-premium";
  readonly sectors: readonly TaxonomySectorCard[];
  readonly toolCountLabel: (count: number) => string;
  readonly variant?: SectorTaxonomyGridVariant;
};

const GRID_VARIANT_STYLES = CATALOG_GRID_VARIANT_STYLES;

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
            prefetch={false}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex min-h-[110px] flex-col items-center justify-center rounded-xl border bg-white px-3 py-4 text-center transition",
              "shadow-sm hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              tone.hoverBorder,
              tone.focusRing,
              active ? tone.active : "border-slate-200",
            )}
          >
            <Icon
              className={cn(
                "mb-2 h-8 w-8 stroke-[1.5] transition [stroke:currentColor]",
                tone.icon,
                tone.iconHover,
                variant === "premium" && "sc-premium-sector-icon",
              )}
              aria-hidden="true"
              strokeWidth={1.5}
            />
            <span className="line-clamp-2 text-sm font-bold text-gray-800">{label}</span>
            <span className="mt-2 text-xs font-medium text-slate-500">
              {toolCountLabel(count)}
            </span>
            {sector.professions.length > 0 ? (
              <span className="mt-2 line-clamp-1 text-xs text-slate-400">
                {sector.professions.slice(0, 3).join(" · ")}
              </span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
