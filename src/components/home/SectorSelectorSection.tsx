import Link from "next/link";
import { FEATURED_INDUSTRY_SLUGS } from "@/lib/tools/industry-registry";
import { getIndustryBySlug } from "@/data/industries";
import { getRevenueToolBySector } from "@/lib/tools/revenue-tools";
import { getFreeToolHref, getPremiumToolHref } from "@/lib/tools/tool-links";
import { SectorIcon } from "@/components/icons/SectorIcon";
import { ScIcon } from "@/components/icons/ScIcon";
import { STATUS_ICON, STATUS_COLOR_CLASS } from "@/lib/icons/icon-registry";
import type { IndustryIcon } from "@/lib/tools/industry-registry";

function ToolLine({
  label,
  value,
  variant,
}: {
  label: string;
  value: string;
  variant: "free" | "premium";
}) {
  const badgeClass =
    variant === "free"
      ? "border-cyan/25 bg-cyan/10 text-professional-blue"
      : "border-amber/25 bg-amber/10 text-amber";
  const TierIcon = variant === "free" ? STATUS_ICON.free : STATUS_ICON.premium;
  const tierColor = variant === "free" ? STATUS_COLOR_CLASS.free : STATUS_COLOR_CLASS.premium;

  return (
    <div className="grid grid-cols-[88px_1fr] items-start gap-3">
      <span
        className={`inline-flex h-7 items-center justify-center gap-1 rounded-full border px-2 text-xs font-semibold ${badgeClass}`}
      >
        <ScIcon icon={TierIcon} size="compact" className={tierColor} />
        {label}
      </span>
      <span className="min-w-0 text-sm leading-7 text-slate">{value}</span>
    </div>
  );
}

function SectorCardItem({
  title,
  painStatement,
  freeTool,
  premiumTool,
  freeHref,
  premiumHref,
  icon,
  slug,
}: {
  title: string;
  painStatement: string;
  freeTool: string;
  premiumTool: string;
  freeHref: string;
  premiumHref: string;
  icon: IndustryIcon;
  slug: string;
}) {
  return (
    <article className="group flex h-full flex-col rounded-[28px] border border-slate/15 bg-white p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:border-professional-blue/25 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
      <div className="flex gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-cyan/20 bg-off-white">
          <SectorIcon slug={slug} iconType={icon} />
        </div>

        <div className="min-w-0">
          <h3 className="text-xl font-semibold tracking-tight text-deep-navy sm:text-2xl">
            {title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate">
            {painStatement}
          </p>
        </div>
      </div>

      <div className="mt-auto space-y-3 border-t border-slate/10 pt-5">
        <ToolLine label="Free" value={freeTool} variant="free" />
        <ToolLine label="Premium" value={premiumTool} variant="premium" />
      </div>

      <div className="mt-6 flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
        <Link
          href={freeHref}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-2xl bg-professional-blue px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-professional-blue focus:ring-offset-2"
        >
          Start Free Margin Check
        </Link>
        <Link
          href={premiumHref}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-2xl border border-professional-blue/40 bg-white px-5 text-sm font-semibold text-professional-blue transition hover:bg-cyan/10 focus:outline-none focus:ring-2 focus:ring-professional-blue focus:ring-offset-2"
        >
          View Premium Analyzer
        </Link>
      </div>
    </article>
  );
}

const sectorCards = FEATURED_INDUSTRY_SLUGS.map((slug) => {
  const industry = getIndustryBySlug(slug);
  const tool = getRevenueToolBySector(slug);

  return {
    title: industry?.name ?? slug,
    painStatement: tool?.painStatement ?? industry?.businessPain ?? "",
    freeTool: tool?.freeTitle ?? "",
    premiumTool: tool?.paidTitle ?? "",
    freeHref: tool ? getFreeToolHref(tool) : `/industries/${slug}`,
    premiumHref: tool ? getPremiumToolHref(tool) : `/pricing`,
    icon: industry?.icon ?? "manufacturing",
    slug,
  };
});

export default function SectorSelectorSection() {
  return (
    <section
      id="industries"
      aria-labelledby="sector-selector-heading"
      className="relative overflow-hidden border-t border-slate/15 bg-off-white py-16 sm:py-20 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:22px_22px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="sector-selector-heading"
            className="text-balance text-3xl font-semibold tracking-tight text-deep-navy sm:text-4xl lg:text-5xl lg:leading-tight"
          >
            Choose from seventeen active sectors
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-7 text-slate sm:mt-5 sm:text-lg sm:leading-8">
            Start with featured sectors below, or browse all seventeen industry packs with free
            calculators and premium analyzers.
          </p>
          <p className="mt-4">
            <Link
              href="/industries"
              className="text-sm font-semibold text-professional-blue hover:underline"
            >
              View all 17 industries →
            </Link>
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sectorCards.map((sector) => (
            <SectorCardItem key={sector.title} {...sector} />
          ))}
        </div>
      </div>
    </section>
  );
}
