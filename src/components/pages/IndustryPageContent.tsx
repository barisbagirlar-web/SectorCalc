import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import type { Industry } from "@/data/industries";
import { getIndustryHubContent } from "@/data/industry-hub-content";
import { getFreeToolsByIndustry, getPremiumToolsByIndustry } from "@/data/tools";
import type { Tool } from "@/data/tools";

interface IndustryPageContentProps {
  industry: Industry;
}

function McToolCard({ tool }: { tool: Tool }) {
  const isPremium = tool.tier === "premium";
  return (
    <article className="mc-tool-card">
      <p className={`mc-tier ${isPremium ? "mc-tier-premium" : "mc-tier-free"}`}>
        {isPremium ? "Decision tool" : "Quick estimate"}
      </p>
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>
      <Link href={tool.href}>{isPremium ? "Open decision tool →" : "Run estimate →"}</Link>
    </article>
  );
}

export function IndustryPageContent({ industry }: IndustryPageContentProps) {
  const hub = getIndustryHubContent(industry.slug);
  const freeTools = getFreeToolsByIndustry(industry.slug);
  const premiumTools = getPremiumToolsByIndustry(industry.slug);

  return (
    <div id="sector-product">
      <PageHero
        eyebrow="Industry pack"
        title={hub.hubTitle}
        subtitle={hub.painStatement}
      />
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
            <div className="mc-tools-grid">
              {freeTools.map((tool) => (
                <McToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
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
            <div className="mc-tools-grid">
              {premiumTools.map((tool) => (
                <McToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
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
  );
}
