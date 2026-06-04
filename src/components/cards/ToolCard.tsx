import Link from "next/link";
import type { Tool } from "@/data/tools";
import { getIndustryBySlug, type IndustrySlug } from "@/data/industries";
import { getMatchingPremiumTool } from "@/data/tools";

interface ToolCardProps {
  tool: Tool;
  onDark?: boolean;
}

export function ToolCard({ tool, onDark = false }: ToolCardProps) {
  const industry = getIndustryBySlug(tool.industrySlug as IndustrySlug);
  const isPremium = tool.tier === "premium";
  const matchedPremium = !isPremium ? getMatchingPremiumTool(tool.slug) : undefined;

  if (isPremium) {
    return (
      <article
        className={`flex flex-col overflow-hidden rounded-xl border shadow-card transition-shadow hover:shadow-lg ${
          onDark
            ? "border-white/15 bg-deep-navy"
            : "border-deep-navy/25 bg-white ring-1 ring-deep-navy/5"
        }`}
      >
        <div className="border-b border-white/10 bg-dark-navy px-5 py-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan">
            Decision Tool
          </p>
        </div>
        <div className={`flex flex-1 flex-col p-6 ${onDark ? "text-white" : ""}`}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-amber/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber">
              Premium
            </span>
            {industry && (
              <span className={`text-xs font-medium ${onDark ? "text-slate-400" : "text-slate"}`}>
                {industry.name}
              </span>
            )}
          </div>
          <h3 className={`text-lg font-bold ${onDark ? "text-white" : "text-deep-navy"}`}>
            {tool.name}
          </h3>
          <p className={`mt-2 flex-1 text-sm leading-relaxed ${onDark ? "text-slate-300" : "text-slate"}`}>
            {tool.description}
          </p>
          <p className={`mt-4 text-xs leading-relaxed ${onDark ? "text-slate-500" : "text-slate"}`}>
            Decision reports · scenarios · risk signals · recommendations
          </p>
          <Link
            href={tool.href}
            className={`mt-5 inline-flex min-h-[44px] items-center text-sm font-semibold ${
              onDark ? "text-cyan hover:text-white" : "text-professional-blue hover:underline"
            }`}
          >
            Open decision tool →
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-xl border bg-white shadow-card transition-shadow hover:shadow-lg ${
        onDark ? "border-white/15" : "border-slate/15"
      }`}
    >
      <div className={`px-5 py-2 ${onDark ? "bg-white/10" : "bg-off-white border-b border-slate/10"}`}>
        <p className={`text-[11px] font-semibold uppercase tracking-wider ${onDark ? "text-emerald" : "text-emerald"}`}>
          Quick Estimate
        </p>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-emerald/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald">
            Free
          </span>
          {industry && (
            <span className="text-xs font-medium text-slate">{industry.name}</span>
          )}
        </div>
        <h3 className="text-lg font-bold text-deep-navy">{tool.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">
          {tool.description}
        </p>
        {matchedPremium && (
          <p className="mt-4 text-xs leading-relaxed text-slate">
            Premium next step:{" "}
            <Link href={matchedPremium.href} className="font-semibold text-professional-blue hover:underline">
              {matchedPremium.name}
            </Link>
          </p>
        )}
        <Link
          href={tool.href}
          className="mt-5 inline-flex min-h-[44px] items-center text-sm font-semibold text-professional-blue hover:underline"
        >
          Run estimate →
        </Link>
      </div>
    </article>
  );
}
