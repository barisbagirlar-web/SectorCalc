import Link from "next/link";
import type { Industry } from "@/data/industries";
import { getRevenueToolBySector } from "@/lib/tools/revenue-tools";
import {
  getFreeToolHref,
  getPremiumToolHref,
} from "@/lib/tools/tool-links";

interface IndustryCatalogCardProps {
  industry: Industry;
  featured?: boolean;
}

type ToolRowProps = {
  variant: "free" | "premium";
  name: string;
  description: string;
  href: string;
};

function ToolRow({ variant, name, description, href }: ToolRowProps) {
  const isFree = variant === "free";

  return (
    <Link
      href={href}
      className="group/row flex gap-3 rounded-xl border border-slate/10 bg-off-white/70 p-4 transition-colors hover:border-professional-blue/25 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-professional-blue/30 focus-visible:ring-offset-1"
    >
      <span
        className={`shrink-0 self-start rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
          isFree ? "bg-emerald/10 text-emerald" : "bg-amber/15 text-amber"
        }`}
      >
        {isFree ? "Free" : "Premium"}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-snug text-deep-navy line-clamp-2 group-hover/row:text-professional-blue">
          {name}
        </span>
        <span className="mt-1.5 block text-xs leading-relaxed text-slate line-clamp-2">
          {description}
        </span>
      </span>
    </Link>
  );
}

export function IndustryCatalogCard({
  industry,
  featured = false,
}: IndustryCatalogCardProps) {
  const tool = getRevenueToolBySector(industry.slug);

  return (
    <article
      className={`group flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card sm:p-7 ${
        featured
          ? "border-professional-blue/25 ring-1 ring-professional-blue/10 hover:border-professional-blue/40"
          : "border-slate/15 hover:border-professional-blue/30"
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-professional-blue">
        Sector pack
      </p>
      <h3 className="mt-2 text-xl font-bold tracking-tight text-deep-navy sm:text-[1.35rem]">
        {industry.name}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate">
        {industry.businessPain}
      </p>

      {tool ? (
        <div className="mt-5 flex flex-1 flex-col gap-3">
          <ToolRow
            variant="free"
            name={tool.freeTitle}
            description={tool.freeValue}
            href={getFreeToolHref(tool)}
          />
          <ToolRow
            variant="premium"
            name={tool.paidTitle}
            description={tool.paidValue}
            href={getPremiumToolHref(tool)}
          />
        </div>
      ) : (
        <div className="flex-1" aria-hidden />
      )}

      <div className="mt-5 border-t border-slate/10 pt-5">
        {tool ? (
          <div className="flex flex-col gap-2.5">
            <Link
              href={getFreeToolHref(tool)}
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-professional-blue px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-professional-blue/40 focus-visible:ring-offset-2"
            >
              Try free tool
            </Link>
            <Link
              href={getPremiumToolHref(tool)}
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-slate/20 bg-white px-4 text-sm font-semibold text-deep-navy transition-colors hover:border-professional-blue/30 hover:bg-off-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-professional-blue/30 focus-visible:ring-offset-2"
            >
              View premium analyzer
            </Link>
            <Link
              href={industry.href}
              className="inline-flex min-h-[44px] items-center justify-center text-sm font-medium text-slate transition-colors hover:text-professional-blue focus-visible:outline-none focus-visible:underline"
            >
              Open sector hub →
            </Link>
          </div>
        ) : (
          <Link
            href={industry.href}
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-professional-blue px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-professional-blue/40 focus-visible:ring-offset-2"
          >
            Open sector hub →
          </Link>
        )}
      </div>
    </article>
  );
}
