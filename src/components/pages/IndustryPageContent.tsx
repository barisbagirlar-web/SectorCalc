import Link from "next/link";
import PageHero from "@/components/shared/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import { ToolsTileGrid } from "@/components/tools/ToolsTileGrid";
import type { Industry } from "@/data/industries";
import { getIndustryHubContent } from "@/data/industry-hub-content";
import { getFreeToolsByIndustry, getPremiumToolsByIndustry } from "@/data/tools";

interface IndustryPageContentProps {
  industry: Industry;
}

export function IndustryPageContent({ industry }: IndustryPageContentProps) {
  const hub = getIndustryHubContent(industry.slug);
  const freeTools = getFreeToolsByIndustry(industry.slug);
  const premiumTools = getPremiumToolsByIndustry(industry.slug);

  return (
    <>
      <PageHero
        eyebrow="Industry pack"
        title={hub.hubTitle}
        description={hub.painStatement}
      />
      <div id="sector-product">
      <section className="third-tab">
        <div className="container text-center">
          <p>
            <strong>Who it is for:</strong> {hub.whoItsFor}
          </p>
          <p>
            <strong>What decision it helps with:</strong> {hub.decisionHelp}
          </p>
          <p className="mc-section-link">
            <Link href="/industries">← All industry packs</Link>
          </p>
        </div>
      </section>

      {freeTools.length > 0 && (
        <section className="seventh-tab">
          <div className="container">
            <h2>Free estimator</h2>
            <p>{hub.freeToolExplanation}</p>
            <p className="mc-tool-tier-note">
              This is a quick estimate. For decision-level analysis, open the matching premium
              tool below.
            </p>
            <ToolsTileGrid tools={freeTools} className="mt-6" />
          </div>
        </section>
      )}

      {premiumTools.length > 0 && (
        <section className="seventh-tab seventh-tab--muted">
          <div className="container">
            <h2>Premium decision analyzer</h2>
            <p>{hub.premiumToolExplanation}</p>
            <p className="mc-tool-tier-note">
              This premium analyzer is designed to support decision-making. Results are indicative
              and depend on your inputs.
            </p>
            <ToolsTileGrid tools={premiumTools} className="mt-6" />
          </div>
        </section>
      )}

      <CTASection
        title={`Continue with ${industry.name} tools`}
        subtitle="Start free for a quick number, or request premium report access when margin, pricing or risk is on the line."
        primaryLabel="View pricing"
        primaryHref="/pricing"
        secondaryLabel="View sample report"
        secondaryHref="/reports/sample-decision-report"
      />
      </div>
    </>
  );
}
