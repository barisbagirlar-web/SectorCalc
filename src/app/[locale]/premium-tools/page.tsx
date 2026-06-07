import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { ToolCatalogByCategory } from "@/components/tools/ToolCatalogByCategory";
import { DecisionToolLegalDisclaimer } from "@/components/tools/DecisionToolLegalDisclaimer";
import { Container } from "@/components/ui/Container";
import { PREMIUM_TOOLS } from "@/data/tools";
import { createPageMetadata } from "@/lib/metadata";
import { getFreeToolsHref, getPricingHref, getSampleReportHref } from "@/lib/tools/tool-links";
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
  return (
    <PageLayout>
      <section className="sc-pro-section sc-pro-section--alt sc-pro-section--border">
        <Container className="sc-pro-container">
          <p className="sc-pro-eyebrow">Premium Decision Reports</p>
          <h1 className="sc-pro-headline">Loss & efficiency analyzers</h1>
          <p className="sc-pro-lead">
            Sector-specific decision reports for measurement, scrap, OEE, routing, energy and
            profitability — built for operators who need a clear verdict, not a spreadsheet.
          </p>
          <Link
            href={getSampleReportHref()}
            className="mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-premium-velvet underline underline-offset-2"
          >
            View sample decision report →
          </Link>
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--border">
        <Container className="sc-pro-container">
          <h2 className="sc-pro-headline text-xl">What you get</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="sc-industrial-panel p-5">
              <p className="sc-pro-eyebrow">Free tools</p>
              <ul className="mt-3 space-y-2 text-sm text-body-charcoal">
                <li>Quick measurement and conversion</li>
                <li>First risk signal in the browser</li>
                <li>No account required</li>
              </ul>
              <Link href={getFreeToolsHref()} className="sc-craft-card__cta mt-4">
                Browse free tools →
              </Link>
            </div>
            <div className="sc-industrial-panel p-5">
              <p className="sc-pro-eyebrow">Premium reports</p>
              <ul className="mt-3 space-y-2 text-sm text-body-charcoal">
                <li>Loss detection and tolerance interpretation</li>
                <li>3-second field panel + PDF save</li>
                <li>Suggested action on every run</li>
              </ul>
              <p className="mt-4 text-sm font-semibold text-premium-velvet">
                {sectorCalcProPricing.planName} — ${sectorCalcProPricing.priceMonthly}/month
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--border">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide">
          <h2 className="sc-pro-headline text-xl">Decision analyzer catalog</h2>
          <p className="sc-pro-lead text-sm">
            Twenty-seven sector analyzers. Each pairs with a free quick check in the same industry.
          </p>
          <div className="mt-6">
            <ToolCatalogByCategory tools={PREMIUM_TOOLS} catalogVariant="premium" />
          </div>
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
              <Link href={getSampleReportHref()} className="sc-cta-secondary">
                Sample report
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
