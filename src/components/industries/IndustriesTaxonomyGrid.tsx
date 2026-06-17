"use client";

import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import type { TaxonomySectorCard } from "@/lib/tools/build-taxonomy-sector-cards";

export type { TaxonomySectorCard };

export type SectorTaxonomyGridVariant = "industry" | "free" | "premium";

type IndustriesTaxonomyGridProps = {
  readonly basePath: "/industries" | "/free-tools" | "/premium-tools";
  readonly sectors: readonly TaxonomySectorCard[];
  readonly variant?: SectorTaxonomyGridVariant;
};

const GRID_VARIANT_STYLES: Record<
  SectorTaxonomyGridVariant,
  {
    readonly hoverBorder: string;
    readonly focusRing: string;
    readonly active: string;
  }
> = {
  industry: {
    hoverBorder: "hover:border-blue-400",
    focusRing: "focus-visible:ring-blue-500",
    active: "border-blue-500 bg-blue-50/70 ring-2 ring-blue-100",
  },
  free: {
    hoverBorder: "hover:border-blue-400",
    focusRing: "focus-visible:ring-blue-500",
    active: "border-blue-500 bg-blue-50/70 ring-2 ring-blue-100",
  },
  premium: {
    hoverBorder: "hover:border-[#C45A2C]",
    focusRing: "focus-visible:ring-orange-400",
    active: "border-orange-400 bg-orange-50/70 ring-2 ring-orange-100",
  },
};

function TaxonomySectorTile({
  href,
  active,
  icon,
  label,
  countLabel,
  professions,
  tone,
}: {
  readonly href: string;
  readonly active: boolean;
  readonly icon: string;
  readonly label: string;
  readonly countLabel: string;
  readonly professions?: readonly string[];
  readonly tone: (typeof GRID_VARIANT_STYLES)[SectorTaxonomyGridVariant];
}) {
  return (
    <Link
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
      <span
        className="mb-3 flex h-12 w-12 items-center justify-center text-[2.5rem] leading-none transition group-hover:scale-105"
        aria-hidden="true"
      >
        {icon}
      </span>
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
  const visibleSectors = sectors.filter(
    (entry) => entry.sector.id === "all" || entry.count > 0,
  );
  const tone = GRID_VARIANT_STYLES[variant];

  if (visibleSectors.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {visibleSectors.map(({ sector, label, countLabel }) => {
        const isAllCard = sector.id === "all";
        const active = isAllCard ? isAllSelected : selectedSectorId === sector.id;
        const href = isAllCard
          ? active
            ? basePath
            : `${basePath}?sector=all`
          : active
            ? basePath
            : `${basePath}?sector=${encodeURIComponent(sector.id)}`;

        return (
          <TaxonomySectorTile
            key={sector.id}
            href={href}
            active={active}
            icon={sector.icon}
            label={label}
            countLabel={countLabel}
            professions={isAllCard ? undefined : sector.professions}
            tone={tone}
          />
        );
      })}
    </div>
  );
}
