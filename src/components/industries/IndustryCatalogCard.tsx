import Link from "next/link";
import type { Industry } from "@/data/industries";
import { getRevenueToolBySector } from "@/lib/tools/revenue-tools";
import {
  getFreeToolHref,
  getPremiumToolHref,
  getPricingHref,
} from "@/lib/tools/tool-links";
import { INDUSTRY_CATEGORY_LABELS } from "@/lib/tools/industry-registry";
import type { IndustryCategory } from "@/lib/tools/industry-registry";

interface IndustryCatalogCardProps {
  industry: Industry;
  featured?: boolean;
}

export function IndustryCatalogCard({
  industry,
  featured = false,
}: IndustryCatalogCardProps) {
  const tool = getRevenueToolBySector(industry.slug);
  const categoryLabel =
    INDUSTRY_CATEGORY_LABELS[industry.category as IndustryCategory] ?? industry.category;

  return (
    <article
      className={`flex h-full flex-col rounded-xl border bg-white p-5 shadow-sm ${
        featured ? "border-professional-blue/30 ring-1 ring-professional-blue/10" : "border-slate/15"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate">
        {categoryLabel}
      </p>
      <h3 className="mt-2 text-lg font-bold text-deep-navy">
        <Link href={industry.href} className="hover:text-professional-blue">
          {industry.name}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">
        {industry.businessPain}
      </p>
      {tool ? (
        <div className="mt-4 flex flex-col gap-2">
          <Link
            href={getFreeToolHref(tool)}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-professional-blue px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {tool.freeTitle}
          </Link>
          <Link
            href={getPremiumToolHref(tool)}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-professional-blue/40 px-4 text-sm font-semibold text-professional-blue transition-colors hover:bg-cyan/10"
          >
            {tool.paidTitle}
          </Link>
          <Link
            href={getPricingHref(tool)}
            className="text-center text-xs font-medium text-slate hover:text-professional-blue"
          >
            SectorCalc Pro — $29/month
          </Link>
        </div>
      ) : null}
    </article>
  );
}
