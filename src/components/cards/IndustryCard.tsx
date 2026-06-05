import Link from "next/link";
import { ToolsTileGrid } from "@/components/tools/ToolsTileGrid";
import type { Industry } from "@/data/industries";
import {
  getFreeToolsByIndustry,
  getPremiumToolsByIndustry,
} from "@/data/tools";

interface IndustryCardProps {
  industry: Industry;
}

const INDUSTRY_TOOL_GRID =
  "grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2";

export function IndustryCard({ industry }: IndustryCardProps) {
  const tools = [
    ...getFreeToolsByIndustry(industry.slug),
    ...getPremiumToolsByIndustry(industry.slug),
  ];

  return (
    <article className="flex flex-col rounded-lg border border-slate/15 bg-white p-4 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate">
        Sector pack
      </p>
      <h3 className="mt-2 text-lg font-bold leading-snug text-deep-navy">
        <Link href={industry.href} className="hover:text-professional-blue">
          {industry.name}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate">
        {industry.businessPain}
      </p>
      <div className="mt-4">
        <ToolsTileGrid tools={tools} className={INDUSTRY_TOOL_GRID} />
      </div>
      <Link
        href={industry.href}
        className="mt-3 inline-flex min-h-[44px] items-center text-xs font-semibold text-professional-blue hover:underline"
      >
        Open sector hub →
      </Link>
    </article>
  );
}
