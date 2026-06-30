"use client";

import { useSearchParams } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  CATALOG_GRID_VARIANT_STYLES,
  type CatalogGridVariant,
} from "@/lib/catalog/catalog-grid-variant-styles";
import { getTaxonomySectorIcon } from "@/lib/catalog/taxonomy-sector-icon-map";
import { cn } from "@/lib/cn";
import type { TaxonomySectorCard } from "@/lib/tools/build-taxonomy-sector-cards";

export type { TaxonomySectorCard };

export type SectorTaxonomyGridVariant = CatalogGridVariant;

type IndustriesTaxonomyGridProps = {
  readonly basePath: "/industries" | "/free-tools" | "/pro-tools";
  readonly sectors: readonly TaxonomySectorCard[];
  readonly variant?: SectorTaxonomyGridVariant;
};

function TaxonomySectorTile({
  href,
  active,
  Icon,
  label,
  countLabel,
  professions,
  tone,
  variant,
}: {
  readonly href: string;
  readonly active: boolean;
  readonly Icon: LucideIcon;
  readonly label: string;
  readonly countLabel: string;
  readonly professions?: readonly string[];
  readonly tone: (typeof CATALOG_GRID_VARIANT_STYLES)[CatalogGridVariant];
  readonly variant: CatalogGridVariant;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex min-h-[148px] flex-col items-center justify-center rounded-xl border bg-kil-surface px-3 py-5 text-center transition",
        "shadow-sm hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        tone.hoverBorder,
        tone.focusRing,
        active ? tone.active : "border-slate-200",
      )}
    >
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
      <span className="line-clamp-2 text-sm font-bold text-gray-800">{label}</span>
      <span className="mt-2 text-xs font-medium text-slate-500">{countLabel}</span>
      {professions && professions.length > 0 ? (
        <span className="mt-2 line-clamp-1 text-[11px] text-slate-400">
          {professions.slice(0, 3).join(" · ")}
        </span>
      ) : null}
    </Link>
  );
}

export function IndustriesTaxonomyGrid({
  basePath,
  sectors,
  variant = "industry",
}: IndustriesTaxonomyGridProps) {
  const searchParams = useSearchParams();
  const rawSelected = searchParams?.get("sector") ?? "";
  const selectedSectorId = rawSelected === "all" ? "" : rawSelected;
  const isAllSelected = selectedSectorId === "";
  /** Show all sector tiles. Sectors with zero tools are omitted by buildTaxonomySectorCards. */
  const visibleSectors = sectors.filter(
    (entry) =>
      entry.sector.id === "all" || entry.count >= 1,
  );
  const tone = CATALOG_GRID_VARIANT_STYLES[variant];

  if (visibleSectors.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {visibleSectors.map(({ sector, label, countLabel, professionLabels }) => {
        const isAllCard = sector.id === "all";
        const active = isAllCard ? isAllSelected : selectedSectorId === sector.id;
        const href = isAllCard
          ? active
            ? basePath
            : `${basePath}?sector=all`
          : active
            ? basePath
            : `${basePath}?sector=${encodeURIComponent(sector.id)}`;
        const Icon = getTaxonomySectorIcon(sector.id);

        return (
          <TaxonomySectorTile
            key={sector.id}
            href={href}
            active={active}
            Icon={Icon}
            label={label}
            countLabel={countLabel}
            professions={isAllCard ? undefined : professionLabels}
            tone={tone}
            variant={variant}
          />
        );
      })}
    </div>
  );
}
