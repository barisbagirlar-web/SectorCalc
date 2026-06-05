import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SampleDecisionReportLayout } from "@/components/reports/SampleDecisionReportLayout";
import { CTASection } from "@/components/sections/CTASection";
import { createPageMetadata } from "@/lib/metadata";

const REPORT_INCLUDES = [
  "Executive summary",
  "Input assumptions",
  "Key metrics",
  "Scenario analysis",
  "Risk level",
  "Recommendation",
  "Export-ready structure (preview in MVP)",
] as const;

export const metadata: Metadata = createPageMetadata({
  title: "Sample Decision Report",
  description:
    "See why premium SectorCalc reports matter — executive summary, scenarios, risk level and recommendations in a decision-ready format, not just calculator output.",
  path: "/reports/sample-decision-report",
});

export default function SampleDecisionReportPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Reports"
        title="Why premium reports are different"
        subtitle="Premium reports package assumptions, findings, scenarios, risk level and recommendations — a decision-ready format, not raw calculator output."
      />
      <section className="border-b border-slate/10 bg-off-white py-10 md:py-12">
        <Container size="narrow">
          <h2 className="text-xl font-bold text-deep-navy">What a premium report includes</h2>
          <ul className="mt-6 space-y-2 text-sm text-slate">
            {REPORT_INCLUDES.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="font-semibold text-professional-blue" aria-hidden>
                  —
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-slate">
            Payment and file export are not live in the MVP. You can preview report structure here
            and request premium access through pricing or industry tools.
          </p>
        </Container>
      </section>
      <SampleDecisionReportLayout />
      <CTASection
        title="Apply decision reports in your sector"
        subtitle="Five live industry packs combine free estimates and premium analyzers on one structured engine."
        primaryLabel="Explore Premium Sector Tools"
        primaryHref="/industries"
        secondaryLabel="View Pricing"
        secondaryHref="/pricing"
      />
    </PageLayout>
  );
}
