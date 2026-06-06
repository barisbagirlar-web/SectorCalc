import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { SampleDecisionReportLayout } from "@/components/reports/SampleDecisionReportLayout";
import { CTASection } from "@/components/sections/CTASection";
import { SAMPLE_REPORT_INCLUDES } from "@/data/sample-report-content";
import { createPageMetadata } from "@/lib/metadata";
import { getFreeToolsHref, getPricingHref } from "@/lib/tools/tool-links";
import { SINGLE_VERDICT_CTA } from "@/lib/pricing/plan-catalog";

export const metadata: Metadata = createPageMetadata({
  title: "Sample Verdict Report — CNC Quote Risk",
  description:
    "Preview a premium SectorCalc verdict report: executive verdict, minimum safe price, margin leak diagnosis, scenarios and suggested action.",
  path: "/reports/sample-decision-report",
});

export default function SampleDecisionReportPage() {
  return (
    <PageLayout>
      <section className="border-b border-slate/10 bg-white py-10 md:py-12">
        <Container size="narrow">
          <p className="sc-eyebrow">Sample verdict report</p>
          <h1 className="mt-3 sc-h2">See what a premium margin decision report looks like</h1>
          <p className="mt-4 max-w-2xl sc-body-muted">
            This CNC Quote Risk Report sample shows the full verdict structure — executive verdict,
            safe price floor, margin leaks and suggested action — not just calculator output.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-slate">
            {SAMPLE_REPORT_INCLUDES.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="font-semibold text-professional-blue" aria-hidden>
                  —
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-slate">
            <Link href={getPricingHref()} className="font-semibold text-professional-blue hover:underline">
              {SINGLE_VERDICT_CTA}
            </Link>
            {" · "}
            <Link href={getFreeToolsHref()} className="font-semibold text-professional-blue hover:underline">
              Start with a free check
            </Link>
          </p>
        </Container>
      </section>
      <SampleDecisionReportLayout />
      <CTASection
        eyebrow="Margin decision platform"
        title="Protect your margin before you send the quote"
        subtitle="Run a free sector check, then unlock the full verdict when the decision affects real money."
        primaryLabel="Run Free Margin Check"
        primaryHref={getFreeToolsHref()}
        secondaryLabel="View Pricing"
        secondaryHref={getPricingHref()}
      />
    </PageLayout>
  );
}
