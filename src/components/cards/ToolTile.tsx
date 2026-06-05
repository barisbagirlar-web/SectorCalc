import Link from "next/link";
import type { Tool } from "@/data/tools";
import { getIndustryBySlug, type IndustrySlug } from "@/data/industries";

interface ToolTileProps {
  tool: Tool;
  onDark?: boolean;
}

/** Compact Omni-style tile — the only allowed tool listing cell. */
export function ToolTile({ tool, onDark = false }: ToolTileProps) {
  const industry = getIndustryBySlug(tool.industrySlug as IndustrySlug);
  const isPremium = tool.tier === "premium";

  return (
    <Link
      href={tool.href}
      className={`group flex h-full min-h-[68px] flex-col rounded-md border p-2 transition-colors ${
        onDark
          ? "border-white/15 bg-deep-navy hover:border-cyan/40"
          : "border-slate/20 bg-white hover:border-professional-blue/40 hover:bg-off-white"
      }`}
    >
      <div className="mb-1 flex min-w-0 items-center gap-1">
        <span
          className={`shrink-0 rounded px-1 py-px text-[9px] font-bold uppercase tracking-wide ${
            isPremium
              ? onDark
                ? "bg-amber/20 text-amber"
                : "bg-amber/15 text-amber"
              : onDark
                ? "bg-emerald/20 text-emerald"
                : "bg-emerald/10 text-emerald"
          }`}
        >
          {isPremium ? "Premium" : "Free"}
        </span>
        {industry && (
          <span
            className={`truncate text-[9px] font-medium ${
              onDark ? "text-slate-400" : "text-slate"
            }`}
          >
            {industry.name}
          </span>
        )}
      </div>
      <span
        className={`line-clamp-2 text-xs font-semibold leading-tight transition-colors ${
          onDark
            ? "text-white group-hover:text-cyan"
            : "text-deep-navy group-hover:text-professional-blue"
        }`}
      >
        {tool.name}
      </span>
      <span
        className={`mt-0.5 line-clamp-1 text-[10px] leading-tight ${
          onDark ? "text-slate-400" : "text-slate"
        }`}
      >
        {tool.shortDescription}
      </span>
    </Link>
  );
}
