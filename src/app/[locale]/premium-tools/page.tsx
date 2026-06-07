import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { PremiumToolsOmniHub } from "@/components/tools/PremiumToolsOmniHub";
import { buildPremiumToolCatalogGroups } from "@/lib/catalog/build-catalog-groups";
import { DecisionToolLegalDisclaimer } from "@/components/tools/DecisionToolLegalDisclaimer";
import { Container } from "@/components/ui/Container";
import { PREMIUM_TOOLS } from "@/data/tools";
import { createPageMetadata } from "@/lib/metadata";
import { getFreeToolsHref, getPricingHref } from "@/lib/tools/tool-links";
import { sectorCalcProPricing } from "@/lib/tools/revenue-tools";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Decision Reports",
  description:
    "Sector-specific loss detection, measurement, OEE, routing, energy and profitability decision reports.",
  path: "/premium-tools",
});

const VERDICT_EXAMPLES = [
  {
    verdict: "High risk — hidden cost may erase the margin",
    context: "Quoted price sits below buffered exposure floor.",
  },
  {
    verdict: "Reprice before accepting this job",
    context: "Setup overrun and scrap drivers push cost above quote.",
  },
  {
    verdict: "Current inputs are inside the acceptable range",
    context: "Loss buffers hold at your target margin band.",
  },
  {
    verdict: "Energy and delay exposure are the main risk drivers",
    context: "Peak load and schedule slip dominate the sensitivity check.",
  },
] as const;

export default function PremiumToolsPage() {
  const premiumGroups = buildPremiumToolCatalogGroups(PREMIUM_TOOLS);

  return (
    <PageLayout>
      <section className="sc-pro-section sc-pro-section--border">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <PremiumToolsOmniHub groups={premiumGroups} toolCount={PREMIUM_TOOLS.length} />
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--alt sc-pro-section--border">
        <Container className="sc-pro-container">
          <h2 className="sc-pro-headline text-xl">Verdict examples</h2>
          <p className="sc-pro-lead text-sm">
            Plain-language outputs — no formula dumps, no jargon.
          </p>
          <div className="sc-craft-grid sc-craft-grid--2 mt-5">
            {VERDICT_EXAMPLES.map((item) => (
              <article key={item.verdict} className="sc-ledger-card sc-industrial-panel sc-ledger-letterpress p-4">
                <p className={`text-sm font-bold ${item.verdict.includes("High risk") ? "text-crit-red" : item.verdict.includes("acceptable") ? "text-safe-green" : "text-premium-velvet"}`}>
                  {item.verdict}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-body-charcoal">{item.context}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="sc-pro-section">
        <Container className="sc-pro-container">
          <div className="sc-decision-block">
            <h2 className="sc-pro-headline text-lg">Unlock all premium analyzers</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-body-charcoal">
              {sectorCalcProPricing.description}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href={getPricingHref()} className="sc-cta-primary">
                View pricing — ${sectorCalcProPricing.priceMonthly}/month
              </Link>
              <Link href={getFreeToolsHref()} className="sc-cta-secondary">
                Browse free tools
              </Link>
              <Link href="/industries" className="sc-cta-secondary">
                Browse by industry
              </Link>
            </div>
            <div className="mt-6">
              <DecisionToolLegalDisclaimer variant="paid" />
            </div>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
