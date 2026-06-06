import Link from "next/link";
import type { SVGProps } from "react";
import { FEATURED_INDUSTRY_SLUGS } from "@/lib/tools/industry-registry";
import { getIndustryBySlug, type IndustryIcon } from "@/data/industries";
import { getRevenueToolBySector } from "@/lib/tools/revenue-tools";
import { getFreeToolHref, getPremiumToolHref } from "@/lib/tools/tool-links";

const iconSvgProps: SVGProps<SVGSVGElement> = {
  className: "h-8 w-8",
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true,
};

function SectorIcon({ name }: { name: IndustryIcon }) {
  if (name === "construction") {
    return (
      <svg {...iconSvgProps}>
        <path
          d="M4 20h16M6 20V9l6-4 6 4v11M8 20v-7h8v7M9 9h6M12 5v4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "cleaning") {
    return (
      <svg {...iconSvgProps}>
        <path
          d="M8 4h8M12 4v10M7 20h10M9 14h6l1 6H8l1-6ZM5 9h4M15 9h4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "restaurant") {
    return (
      <svg {...iconSvgProps}>
        <path
          d="M4 19h16M6 15a6 6 0 0 1 12 0H6ZM12 7V4M8 4v5M16 4v5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "ecommerce") {
    return (
      <svg {...iconSvgProps}>
        <path
          d="M5 6h2l2 10h8l2-7H8M10 20h.01M17 20h.01M9 10h10"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "trades" || name === "field-service" || name === "custom") {
    return (
      <svg {...iconSvgProps}>
        <path
          d="M4 19h16M8 19V9l4-3 4 3v10M10 13h4M12 6v3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg {...iconSvgProps}>
      <path
        d="M4 19h16M6 19V8h5v11M13 19V5h5v14M8 11h1M8 14h1M15 8h1M15 11h1M15 14h1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
      : "border-emerald/25 bg-emerald/10 text-emerald";

  return (
    <div className="grid grid-cols-[88px_1fr] items-start gap-3">
      <span
        className={`inline-flex h-7 items-center justify-center rounded-full border px-3 text-xs font-semibold ${badgeClass}`}
      >
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
}: {
  title: string;
  painStatement: string;
  freeTool: string;
  premiumTool: string;
  freeHref: string;
  premiumHref: string;
  icon: IndustryIcon;
}) {
  return (
    <article className="group flex h-full flex-col rounded-[28px] border border-slate/15 bg-white p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:border-professional-blue/25 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
      <div className="flex gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-cyan/20 bg-off-white text-professional-blue">
          <SectorIcon name={icon} />
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
