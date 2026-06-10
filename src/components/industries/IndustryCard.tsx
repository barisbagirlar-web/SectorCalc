import Link from "@/lib/navigation/next-link";
import type { Industry } from "@/data/industries";
import { getIndustryBySlug } from "@/data/industries";
import { ScIcon } from "@/components/icons/ScIcon";
import { SectorIcon } from "@/components/icons/SectorIcon";
import { UI_ICON } from "@/lib/icons/icon-registry";
import {
  INDUSTRY_CATEGORY_LABELS,
  type IndustryCategory,
  type IndustryIcon,
  type IndustrySlug,
} from "@/lib/tools/industry-registry";
import { getPremiumArchitectureProfile } from "@/lib/premium/sector-loss-registry";
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
  return (
    <Link
      href={href}
      className="group/tool flex min-h-[72px] items-start justify-between gap-3 border border-technical-gray bg-white px-3 py-3 transition hover:border-sc-copper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sc-copper/20"
    >
      <div className="min-w-0 flex-1">
        <span className="sc-craft-eyebrow">{label}</span>
        <h4 className="mt-1 break-words text-sm font-semibold leading-snug text-premium-velvet">
          {tool.title}
        </h4>
        <p className="mt-1 line-clamp-2 break-words text-xs leading-5 text-body-charcoal">
          {tool.description}
        </p>
      </div>
      <ScIcon
        icon={UI_ICON.chevronRight}
        size="compact"
        className={`mt-4 shrink-0 transition group-hover/tool:translate-x-0.5 ${tone === "premium" ? "text-warn-amber" : "text-body-charcoal"}`}
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
  const premiumProfile = getPremiumArchitectureProfile(premiumTool.slug);

  return (
    <article
      className={`sc-ledger-card sc-craft-card sc-ledger-letterpress flex h-full flex-col p-5 sm:p-6 ${
        featured ? "border-premium-velvet/30" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-technical-gray bg-industrial-matte">
          <SectorIcon slug={slug} iconType={iconType} size="default" />
        </span>
        <div className="min-w-0">
          <p className="sc-craft-eyebrow">Sector pack</p>
          {category ? (
            <p className="mt-1 text-xs text-body-charcoal">{category}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex-1">
        <h2 className="text-xl font-semibold tracking-tight text-premium-velvet sm:text-2xl">
          {name}
        </h2>
        <p className="mt-3 line-clamp-3 min-h-[3.75rem] text-sm leading-relaxed text-body-charcoal">
          {painStatement}
        </p>
      </div>

      <div className="mt-5 flex flex-1 flex-col gap-2">
        <ToolRow label="Free tool" tone="free" tool={freeTool} href={freeHref} />
        <ToolRow
          label="Premium report"
          tone="premium"
          tool={{
            ...premiumTool,
            title: premiumProfile?.reclassifiedTitle ?? premiumTool.title,
            description: premiumProfile?.reclassifiedPromise ?? premiumTool.description,
          }}
          href={premiumHref}
        />
      </div>

      <div className="mt-5 border-t border-technical-gray pt-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href={freeHref} className="sc-cta-secondary flex-1 text-center text-sm">
            Try free tool
          </Link>
          <Link href={premiumHref} className="sc-cta-primary flex-1 text-center text-sm">
            View analyzer
          </Link>
        </div>
        <Link
          href={sectorHref}
          className="mt-3 inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-body-charcoal hover:text-premium-velvet"
        >
          Open sector hub
          <ScIcon icon={UI_ICON.chevronRight} size="compact" />
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
