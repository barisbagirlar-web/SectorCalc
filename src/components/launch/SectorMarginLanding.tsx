import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { SectorLandingPageConfig } from "@/data/sector-landing-pages";
import { SINGLE_VERDICT_CTA } from "@/lib/pricing/plan-catalog";
import { getSingleVerdictPricingHref } from "@/lib/tools/tool-links";
import { FREE_TOOL_PRIVACY_NOTE } from "@/lib/tools/revenue-tools";

const SAMPLE_REPORT_HREF = "/reports/sample-decision-report";

type SectorMarginLandingProps = {
  config: SectorLandingPageConfig;
};

const severityClass = {
  HIGH: "text-soft-red",
  MEDIUM: "text-amber",
  LOW: "text-emerald",
};

export function SectorMarginLanding({ config }: SectorMarginLandingProps) {
  const singleVerdictHref = getSingleVerdictPricingHref();

  return (
    <PageLayout>
      <main>
        <section className="border-b border-slate/10 bg-off-white py-10 sm:py-12 sc-section">
          <Container size="narrow">
            <p className="sc-eyebrow">{config.eyebrow}</p>
            <h1 className="mt-3 text-balance sc-h2">{config.h1}</h1>
            <p className="mt-4 max-w-2xl sc-body-muted sm:text-lg">{config.subhead}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href={config.freeToolHref} size="cta" className="w-full sm:w-auto">
                {config.freeToolCta}
              </Button>
              <Button
                href={SAMPLE_REPORT_HREF}
                variant="outline"
                size="cta"
                className="w-full sm:w-auto"
              >
                View Sample Verdict Report
              </Button>
            </div>
            <p className="mt-4 max-w-2xl text-xs leading-relaxed text-slate">
              {FREE_TOOL_PRIVACY_NOTE} Free checks run without ERP setup.
            </p>
          </Container>
        </section>

        <section className="border-b border-slate/10 bg-white py-12 sm:py-14 sc-section">
          <Container>
            <h2 className="sc-h3">Sector pain — where margin disappears</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {config.painPoints.map((point) => (
                <li key={point} className="sc-card text-sm font-medium leading-relaxed text-deep-navy">
                  {point}
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className="border-b border-slate/10 bg-off-white py-12 sm:py-14 sc-section">
          <Container>
            <h2 className="sc-h3">Common margin leaks</h2>
            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {config.marginLeaks.map((leak) => (
                <li key={leak} className="sc-card text-sm leading-relaxed text-slate">
                  {leak}
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className="border-b border-slate/10 bg-white py-12 sm:py-14 sc-section">
          <Container size="narrow">
            <h2 className="sc-h3">Start with a free margin check</h2>
            <p className="mt-4 sc-body-muted">
              Enter structured sector inputs and see visible risk in your browser — no minimum safe
              price or final verdict on the free tier.
            </p>
            <Button href={config.freeToolHref} size="cta" className="mt-6">
              {config.freeToolCta}
            </Button>
          </Container>
        </section>

        <section className="border-b border-slate/10 bg-off-white py-12 sm:py-14 sc-section">
          <Container>
            <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
              <div>
                <h2 className="sc-h3">Sample verdict preview</h2>
                <p className="mt-4 sc-body-muted">
                  Premium analyzers deliver decision-ready reports — not spreadsheet dumps.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button href={SAMPLE_REPORT_HREF} variant="outline" size="md">
                    View full sample report
                  </Button>
                  <Button href={config.premiumToolHref} size="md">
                    {config.premiumToolCta}
                  </Button>
                </div>
              </div>
              <article className="sc-card border-soft-red/30 bg-soft-red/5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate">
                  {config.sampleVerdict.title}
                </p>
                <p className="mt-3 text-lg font-bold text-soft-red">
                  {config.sampleVerdict.verdict}
                </p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate">Margin risk</dt>
                    <dd className={`font-semibold ${severityClass.HIGH}`}>
                      {config.sampleVerdict.marginRisk} RISK
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate">Main leak</dt>
                    <dd className="font-semibold text-deep-navy">{config.sampleVerdict.mainLeak}</dd>
                  </div>
                  <div>
                    <dt className="text-slate">Suggested action</dt>
                    <dd className="mt-1 font-medium text-deep-navy">
                      {config.sampleVerdict.suggestedAction}
                    </dd>
                  </div>
                </dl>
              </article>
            </div>
          </Container>
        </section>

        <section className="border-b border-slate/10 bg-deep-navy py-12 sm:py-14 text-white sc-section">
          <Container size="narrow">
            <h2 className="text-2xl font-bold sm:text-3xl">Choose how you protect margin</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <article className="rounded-2xl border border-white/15 bg-white/5 p-6">
                <p className="text-sm font-semibold text-cyan">Single Verdict</p>
                <p className="mt-2 text-3xl font-bold">$19</p>
                <p className="mt-2 text-sm text-slate-300">One premium analyzer report</p>
                <Link
                  href={singleVerdictHref}
                  className="sc-btn-primary mt-4 inline-flex w-full justify-center !text-sm"
                >
                  {SINGLE_VERDICT_CTA}
                </Link>
              </article>
              <article className="rounded-2xl border border-cyan/30 bg-white/5 p-6">
                <p className="text-sm font-semibold text-cyan">Pro Monthly</p>
                <p className="mt-2 text-3xl font-bold">$29<span className="text-lg">/mo</span></p>
                <p className="mt-2 text-sm text-slate-300">All seventeen sector analyzers</p>
                <Link
                  href={config.pricingHref}
                  className="sc-btn-secondary mt-4 inline-flex w-full justify-center !border-cyan/40 !text-cyan hover:!bg-cyan/10"
                >
                  View pricing
                </Link>
              </article>
            </div>
          </Container>
        </section>

        <section className="border-b border-slate/10 bg-white py-12 sm:py-14 sc-section">
          <Container size="narrow">
            <h2 className="sc-h3">FAQ</h2>
            <dl className="mt-8 space-y-6">
              {config.faq.map((item) => (
                <div key={item.question} className="sc-card">
                  <dt className="font-semibold text-deep-navy">{item.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-slate">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>

        <section className="bg-off-white py-10 sm:py-12">
          <Container size="narrow">
            <p className="text-sm leading-relaxed text-slate">
              SectorCalc outputs are technical simulations and decision-support estimates. They are
              not financial, legal or engineering advice. Verify all results before business
              decisions. Business data is not sold.
            </p>
            <nav className="mt-6 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-4">
              <Link href={config.freeToolHref} className="font-medium text-professional-blue hover:underline">
                Free margin check
              </Link>
              <Link href={config.premiumToolHref} className="font-medium text-professional-blue hover:underline">
                Premium analyzer
              </Link>
              <Link href={SAMPLE_REPORT_HREF} className="font-medium text-professional-blue hover:underline">
                Sample verdict report
              </Link>
              <Link href={config.pricingHref} className="font-medium text-professional-blue hover:underline">
                Pricing
              </Link>
            </nav>
          </Container>
        </section>
      </main>
    </PageLayout>
  );
}
