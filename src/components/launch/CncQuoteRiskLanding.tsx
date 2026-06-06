import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
  FREE_TOOL_PRIVACY_NOTE,
} from "@/lib/tools/revenue-tools";

const FREE_CALCULATOR_HREF = "/tools/free/machine-time-calculator";
const PREMIUM_ANALYZER_HREF = "/tools/premium/cnc-quote-risk-analyzer";
const PRICING_HREF = "/pricing?tool=cnc-quote-risk-analyzer";
const ACCOUNT_HREF = "/account";

const PAIN_POINTS = [
  "Setup time gets ignored",
  "Tooling cost is treated like overhead",
  "Quantity 1 destroys margin",
  "Rush pressure hides real cost",
] as const;

const VERDICT_EXAMPLES = [
  "DO NOT ACCEPT UNDER $X",
  "REPRICE REQUIRED",
  "SAFE TO QUOTE",
] as const;

const PRO_BULLETS = [
  "CNC quote risk analyzer",
  "Safe price and bid risk verdicts",
  "Margin leak detection tools",
  "Verdict PDF export",
  "Saved report history",
  "Cancel anytime",
  "Digital product, no refunds",
] as const;

export function CncQuoteRiskLanding() {
  return (
    <PageLayout>
      <main>
        <section className="border-b border-slate/10 bg-off-white py-10 sm:py-12">
          <Container size="narrow">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-professional-blue">
              CNC / Manufacturing Quote Risk
            </p>
            <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-deep-navy sm:text-4xl">
              Stop Underpriced CNC Jobs Before They Kill Your Margin.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate sm:text-lg">
              Setup time, tooling and one-off quantities can turn a normal quote into a
              loss. SectorCalc helps you spot quote risk before you accept the job.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href={FREE_CALCULATOR_HREF} size="lg" className="w-full sm:w-auto">
                Start Free Quote Risk Check
              </Button>
              <Button
                href={PREMIUM_ANALYZER_HREF}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                View CNC Quote Risk Analyzer
              </Button>
            </div>
            <p className="mt-4 max-w-2xl text-xs leading-relaxed text-slate">
              {FREE_TOOL_PRIVACY_NOTE}
            </p>
          </Container>
        </section>

        <section className="border-b border-slate/10 bg-white py-12 sm:py-14">
          <Container>
            <h2 className="text-2xl font-bold text-deep-navy sm:text-3xl">
              Why machine shops underprice one-off jobs
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {PAIN_POINTS.map((point) => (
                <li
                  key={point}
                  className="rounded-xl border border-slate/15 bg-off-white px-5 py-4 text-sm font-medium leading-relaxed text-deep-navy"
                >
                  {point}
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className="border-b border-slate/10 bg-off-white py-12 sm:py-14">
          <Container size="narrow">
            <h2 className="text-2xl font-bold text-deep-navy sm:text-3xl">
              Start with a quick visible risk check
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate">
              Use the free calculator to estimate visible machine time and spot early quote
              risk. It will not show the minimum safe price.
            </p>
            <Button href={FREE_CALCULATOR_HREF} size="lg" className="mt-6">
              Open Machine Time Calculator
            </Button>
          </Container>
        </section>

        <section className="border-b border-slate/10 bg-white py-12 sm:py-14">
          <Container>
            <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
              <div>
                <h2 className="text-2xl font-bold text-deep-navy sm:text-3xl">
                  Unlock the minimum safe price
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate">
                  The CNC Quote Risk Analyzer adds tooling, material cost, machine rate and
                  risk margin to produce a quote verdict.
                </p>
                <Button href={PREMIUM_ANALYZER_HREF} size="lg" className="mt-6">
                  Unlock CNC Quote Risk Analyzer
                </Button>
              </div>
              <div className="rounded-xl border border-slate/15 bg-off-white p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate">
                  Example verdicts
                </p>
                <ul className="mt-4 space-y-3">
                  {VERDICT_EXAMPLES.map((example) => (
                    <li
                      key={example}
                      className="rounded-lg border border-slate/10 bg-white px-4 py-3 text-sm font-semibold text-deep-navy"
                    >
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-b border-slate/10 bg-deep-navy py-12 sm:py-14 text-white">
          <Container size="narrow">
            <h2 className="text-2xl font-bold sm:text-3xl">SectorCalc Pro</h2>
            <p className="mt-2 text-3xl font-bold text-cyan">$29/month</p>
            <ul className="mt-6 space-y-2.5">
              {PRO_BULLETS.map((bullet) => (
                <li key={bullet} className="flex gap-2 text-sm text-slate-200">
                  <span className="text-cyan" aria-hidden>
                    ✓
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
            <Button href={PRICING_HREF} size="lg" className="mt-8">
              Start SectorCalc Pro
            </Button>
          </Container>
        </section>

        <section className="bg-off-white py-10 sm:py-12">
          <Container size="narrow">
            <p className="text-sm leading-relaxed text-slate">
              SectorCalc outputs are technical simulations and decision-support estimates.
              They are not financial, legal or engineering advice. Verify all results
              before business decisions.
            </p>
            <nav className="mt-6 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-4">
              <Link
                href={FREE_CALCULATOR_HREF}
                className="font-medium text-professional-blue hover:underline"
              >
                Free machine time calculator
              </Link>
              <Link
                href={PREMIUM_ANALYZER_HREF}
                className="font-medium text-professional-blue hover:underline"
              >
                CNC Quote Risk Analyzer
              </Link>
              <Link
                href={PRICING_HREF}
                className="font-medium text-professional-blue hover:underline"
              >
                SectorCalc Pro pricing
              </Link>
              <Link
                href={ACCOUNT_HREF}
                className="font-medium text-professional-blue hover:underline"
              >
                Account
              </Link>
            </nav>
          </Container>
        </section>
      </main>
    </PageLayout>
  );
}
