import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { DecisionToolLegalDisclaimer } from "@/components/tools/DecisionToolLegalDisclaimer";
import { FreeToolPrivacyNote } from "@/components/tools/FreeToolPrivacyNote";
import { createPageMetadata } from "@/lib/metadata";
import {
  getFreeToolsHref,
  getPremiumToolsHref,
  getPricingHref,
} from "@/lib/tools/tool-links";
import { revenueLegalDisclaimer } from "@/lib/tools/revenue-tools";

export const metadata: Metadata = createPageMetadata({
  title: "How It Works",
  description:
    "How SectorCalc free margin checks, premium verdict analyzers and PDF reports work — inputs, risk signals, limitations and disclaimers.",
  path: "/how-it-works",
});

const STEPS = [
  {
    title: "Choose your sector",
    body: "Pick an industry pack with a paired free calculator and premium analyzer — seventeen sectors across manufacturing, trades and services.",
  },
  {
    title: "Run a free margin check",
    body: "Enter 3–5 structured inputs. SectorCalc returns a visible risk signal in your browser — not a safe price, minimum bid or final verdict.",
  },
  {
    title: "Upgrade for the full verdict",
    body: "Premium analyzers add minimum safe price, margin leak breakdown, accept / reprice verdict and suggested action. SectorCalc Pro unlocks all analyzers.",
  },
  {
    title: "Export and save reports",
    body: "Subscribers can save verdict reports to their account and export PDF copies for internal review — technical simulations, not certified advice.",
  },
] as const;

const LIMITATIONS = [
  "Outputs are decision-support simulations — not financial, legal or engineering advice.",
  "Free tools never show minimum safe price or paid-only verdict strings.",
  "Premium analyzers do not expose raw formula sheets to end users.",
  "Verify all numbers before commercial commitments.",
  "Subscription status and report writes are handled server-side — clients cannot self-assign Pro access.",
] as const;

export default function HowItWorksPage() {
  return (
    <PageLayout headerTheme="light">
      <section className="border-b border-slate/10 bg-off-white py-10 sm:py-12">
        <Container>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-professional-blue">
            How it works
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-deep-navy sm:text-4xl">
            From quick check to verdict report
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate">
            SectorCalc is a sector-specific margin decision platform — not a generic calculator
            directory. Free checks build trust; premium analyzers deliver the verdict.
          </p>
        </Container>
      </section>

      <section className="border-b border-slate/10 bg-white py-10 sm:py-14">
        <Container>
          <ol className="space-y-8">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-professional-blue/10 text-sm font-bold text-professional-blue">
                  {index + 1}
                </span>
                <div>
                  <h2 className="text-lg font-bold text-deep-navy">{step.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-b border-slate/10 bg-off-white py-10 sm:py-12">
        <Container>
          <h2 className="text-xl font-bold text-deep-navy">Free vs premium</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-slate/15 bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald">Free check</p>
              <ul className="mt-4 space-y-2 text-sm text-slate">
                <li>Visible risk level and summary</li>
                <li>Browser-side input processing</li>
                <li>No PDF export</li>
                <li>No minimum safe price</li>
              </ul>
            </article>
            <article className="rounded-2xl border border-professional-blue/20 bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-amber">Premium verdict</p>
              <ul className="mt-4 space-y-2 text-sm text-slate">
                <li>Full analyzer inputs</li>
                <li>Verdict label and suggested action</li>
                <li>PDF export for saved reports</li>
                <li>Included with SectorCalc Pro</li>
              </ul>
            </article>
          </div>
          <div className="mt-8 space-y-4">
            <FreeToolPrivacyNote />
            <DecisionToolLegalDisclaimer variant="paid" />
          </div>
        </Container>
      </section>

      <section className="bg-white py-10 sm:py-12">
        <Container>
          <h2 className="text-xl font-bold text-deep-navy">Limitations</h2>
          <ul className="mt-4 space-y-2">
            {LIMITATIONS.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-slate">
                <span aria-hidden>•</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-slate">{revenueLegalDisclaimer}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={getFreeToolsHref()}
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-professional-blue hover:underline"
            >
              Run a free check →
            </Link>
            <Link
              href={getPremiumToolsHref()}
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-slate hover:text-professional-blue"
            >
              Browse premium analyzers →
            </Link>
            <Link
              href={getPricingHref()}
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-slate hover:text-professional-blue"
            >
              View pricing →
            </Link>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
