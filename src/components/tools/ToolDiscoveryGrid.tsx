import Link from "@/lib/navigation/next-link";
import type { Tool } from "@/data/tools";
import { getIndustryBySlug, type IndustrySlug } from "@/data/industries";
import { getPremiumArchitectureProfile } from "@/lib/premium/sector-loss-registry";
import { getRevenueToolByPaidSlug } from "@/lib/tools/revenue-tools";

type ToolDiscoveryCardProps = {
  tool: Tool;
  catalogVariant?: "default" | "premium";
};

export function ToolDiscoveryCard({ tool, catalogVariant = "default" }: ToolDiscoveryCardProps) {
  const industry = getIndustryBySlug(tool.industrySlug as IndustrySlug);
  const isPremium = tool.tier === "premium" || catalogVariant === "premium";
  const architecture = isPremium ? getPremiumArchitectureProfile(tool.slug) : null;
  const revenue = isPremium ? getRevenueToolByPaidSlug(tool.slug) : null;
  const verdictExample = revenue?.verdictLabels[0];

  if (isPremium && catalogVariant === "premium") {
    return (
      <article className="sc-ledger-card sc-craft-card sc-ledger-letterpress">
        <p className="sc-craft-eyebrow">{architecture?.sectorLabel ?? industry?.name ?? "Sector"}</p>
        <h3 className="sc-craft-card__title mt-2">
          {architecture?.reclassifiedTitle ?? tool.name}
        </h3>
        <p className="sc-craft-card__body">
          {architecture?.reclassifiedPromise ?? tool.shortDescription}
        </p>
        {architecture ? (
          <p className="mt-2 text-xs text-body-charcoal">
            <span className="font-semibold text-premium-velvet">Measures:</span>{" "}
            {architecture.whatIsMeasured}
          </p>
        ) : null}
        {verdictExample ? (
          <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-body-charcoal">
            Example output: {verdictExample}
          </p>
        ) : null}
        <Link href={tool.href} className="sc-craft-card__cta">
          View analyzer →
        </Link>
      </article>
    );
  }

  return (
    <Link href={tool.href} className="sc-ledger-card sc-craft-card sc-ledger-letterpress group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sc-copper/30">
      <div className="min-w-0 flex-1">
        {industry ? (
          <p className="sc-craft-eyebrow">{industry.name}</p>
        ) : null}
        <h3 className="sc-craft-card__title mt-2 group-hover:text-sc-copper">{tool.name}</h3>
        <p className="sc-craft-card__body">{tool.shortDescription}</p>
      </div>
      <span className="sc-craft-card__cta">Open calculator →</span>
    </Link>
  );
}

type ToolDiscoveryGridProps = {
  tools: Tool[];
  catalogVariant?: "default" | "premium";
};

export function ToolDiscoveryGrid({ tools, catalogVariant = "default" }: ToolDiscoveryGridProps) {
  if (tools.length === 0) {
    return null;
  }

  return (
    <ul className="sc-craft-grid sc-craft-grid--3">
      {tools.map((tool) => (
        <li key={tool.slug} className="min-w-0">
          <ToolDiscoveryCard tool={tool} catalogVariant={catalogVariant} />
        </li>
      ))}
    </ul>
  );
}
