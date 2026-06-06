import Link from "next/link";
import type { Industry } from "@/data/industries";
import { getIndustryBySlug } from "@/data/industries";
import { ScIcon } from "@/components/icons/ScIcon";
import { SectorIcon } from "@/components/icons/SectorIcon";
import { STATUS_ICON, STATUS_COLOR_CLASS, UI_ICON } from "@/lib/icons/icon-registry";
import {
  INDUSTRY_CATEGORY_LABELS,
  type IndustryCategory,
  type IndustryIcon,
  type IndustrySlug,
} from "@/lib/tools/industry-registry";
import { getRevenueToolBySector } from "@/lib/tools/revenue-tools";

export type IndustryTool = {
  slug: string;
  title: string;
  description: string;
};

export type IndustryCardProps = {
  slug: string;
  name: string;
  category?: string;
  painStatement: string;
  freeTool: IndustryTool;
  premiumTool: IndustryTool;
  featured?: boolean;
};

type ToolRowProps = {
  label: string;
  tone: "free" | "premium";
  tool: IndustryTool;
  href: string;
};

function ToolRow({ label, tone, tool, href }: ToolRowProps) {
  const badgeClass =
    tone === "free"
      ? "bg-emerald/10 text-emerald ring-emerald/20"
      : "bg-amber/15 text-amber ring-amber/25";
  const TierIcon = tone === "free" ? STATUS_ICON.free : STATUS_ICON.premium;
  const tierColor = tone === "free" ? STATUS_COLOR_CLASS.free : STATUS_COLOR_CLASS.premium;

  return (
    <Link
      href={href}
      className="group/tool flex min-h-[76px] items-start justify-between gap-3 rounded-2xl border border-border-subtle bg-bg-subtle/50 px-4 py-3.5 transition hover:border-accent-teal/30 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal/30 focus-visible:ring-offset-1"
    >
      <div className="min-w-0 flex-1">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ring-1 ${badgeClass}`}
        >
          <ScIcon icon={TierIcon} size="compact" className={tierColor} />
          {label}
        </span>
        <h4 className="mt-2 break-words text-sm font-bold leading-snug text-text-primary line-clamp-2 group-hover/tool:text-accent-teal">
          {tool.title}
        </h4>
        <p className="mt-1.5 line-clamp-2 break-words text-xs leading-5 text-slate">
          {tool.description}
        </p>
      </div>
      <ScIcon
        icon={UI_ICON.chevronRight}
        size="compact"
        className="mt-7 shrink-0 text-accent-teal transition group-hover/tool:translate-x-0.5"
      />
    </Link>
  );
}

export function IndustryCard({
  slug,
  name,
  category,
  painStatement,
  freeTool,
  premiumTool,
  featured = false,
}: IndustryCardProps) {
  const sectorHref = `/industries/${slug}`;
  const freeHref = `/tools/free/${freeTool.slug}`;
  const premiumHref = `/tools/premium/${premiumTool.slug}`;
  const iconType: IndustryIcon = getIndustryBySlug(slug as IndustrySlug)?.icon ?? "manufacturing";

  return (
    <article
      className={`group flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-card sm:p-7 ${
        featured
          ? "border-accent-teal/25 ring-1 ring-accent-teal/10 hover:border-accent-teal/40"
          : "border-border-subtle hover:border-accent-teal/30"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-bg-subtle">
            <SectorIcon slug={slug} iconType={iconType} size="default" />
          </span>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-teal">
            Sector pack
          </p>
        </div>
        {category ? (
          <span className="shrink-0 rounded-full bg-bg-subtle px-2.5 py-1 text-[10px] font-semibold text-slate ring-1 ring-slate/15">
            {category}
          </span>
        ) : null}
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
          {name}
        </h2>
        <p className="mt-3 line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed text-slate sm:min-h-[3rem] sm:text-[15px] sm:leading-7">
          {painStatement}
        </p>
      </div>

      <div className="mt-5 flex flex-1 flex-col gap-3">
        <ToolRow
          label="Free Tool"
          tone="free"
          tool={freeTool}
          href={freeHref}
        />
        <ToolRow
          label="Premium Analyzer"
          tone="premium"
          tool={premiumTool}
          href={premiumHref}
        />
      </div>

      <div className="mt-6 border-t border-border-subtle pt-5">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-stretch">
          <Link
            href={freeHref}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-bg-primary px-4 text-sm font-bold text-white transition hover:bg-bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal/40 focus-visible:ring-offset-2"
          >
            Try free tool
          </Link>
          <Link
            href={premiumHref}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-accent-teal/25 bg-accent-teal/5 px-4 text-sm font-bold text-accent-teal transition hover:border-accent-teal/40 hover:bg-accent-teal/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal/30 focus-visible:ring-offset-2"
          >
            View premium analyzer
          </Link>
        </div>
        <Link
          href={sectorHref}
          className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-slate transition hover:text-accent-teal focus-visible:outline-none focus-visible:underline"
        >
          Open sector hub
          <ScIcon icon={UI_ICON.chevronRight} size="compact" className="text-current" />
        </Link>
      </div>
    </article>
  );
}

export function buildIndustryCardProps(
  industry: Industry,
  options?: { featured?: boolean }
): IndustryCardProps | null {
  const tool = getRevenueToolBySector(industry.slug);
  if (!tool) {
    return null;
  }

  const category =
    INDUSTRY_CATEGORY_LABELS[industry.category as IndustryCategory] ??
    industry.category;

  return {
    slug: industry.slug,
    name: industry.name,
    category,
    painStatement: industry.businessPain,
    freeTool: {
      slug: tool.freeSlug,
      title: tool.freeTitle,
      description: tool.freeValue,
    },
    premiumTool: {
      slug: tool.paidSlug,
      title: tool.paidTitle,
      description: tool.paidValue,
    },
    featured: options?.featured,
  };
}
