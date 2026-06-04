import Link from "next/link";
import type { Industry } from "@/data/industries";
import {
  getFreeToolsByIndustry,
  getPremiumToolsByIndustry,
} from "@/data/tools";

interface IndustryCardProps {
  industry: Industry;
}

export function IndustryCard({ industry }: IndustryCardProps) {
  const freeTools = getFreeToolsByIndustry(industry.slug);
  const premiumTools = getPremiumToolsByIndustry(industry.slug);
  const freeTool = freeTools[0];
  const premiumTool = premiumTools[0];

  return (
    <Link
      href={industry.href}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate/15 bg-white shadow-card transition-all hover:border-deep-navy/25 hover:shadow-lg"
    >
      <div className="h-1.5 bg-deep-navy" aria-hidden />
      <div className="flex flex-1 flex-col p-7 md:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate">
          Sector pack
        </p>
        <h3 className="mt-4 text-xl font-bold text-deep-navy transition-colors group-hover:text-professional-blue md:text-2xl">
          {industry.name}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate">
          {industry.businessPain}
        </p>
        <ul className="mt-8 space-y-3 border-t border-slate/10 pt-6 text-sm">
          {freeTool && (
            <li>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-emerald">
                Quick estimate
              </span>
              <span className="mt-0.5 block font-medium text-deep-navy">{freeTool.name}</span>
            </li>
          )}
          {premiumTool && (
            <li>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-amber">
                Decision tool
              </span>
              <span className="mt-0.5 block font-medium text-deep-navy">{premiumTool.name}</span>
            </li>
          )}
        </ul>
        <span className="mt-6 text-sm font-semibold text-professional-blue">
          Open sector hub →
        </span>
      </div>
    </Link>
  );
}
