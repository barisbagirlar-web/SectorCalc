import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/tools/Breadcrumb";
import { ToolCalculatorEngine } from "@/components/tools/ToolCalculatorEngine";
import { PremiumTeaserPanel } from "@/components/tools/PremiumTeaserPanel";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { CTASection } from "@/components/sections/CTASection";
import type { ToolDefinition } from "@/data/tool-schema";
import { getIndustryBySlug } from "@/data/industries";

interface ToolPageShellProps {
  definition: ToolDefinition;
}

export function ToolPageShell({ definition }: ToolPageShellProps) {
  const industry = getIndustryBySlug(definition.industryId);
  const isPremium = definition.tier === "premium";
  const tierLabel = isPremium ? "Premium Tools" : "Free Tools";
  const tierHref = isPremium ? "/pricing" : "/free-tools";
  const classificationLabel = isPremium ? "Decision tool" : "Quick estimate";

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: tierLabel, href: tierHref },
    ...(industry
      ? [{ label: industry.name, href: industry.href }]
      : []),
    { label: definition.title },
  ];

  return (
    <PageLayout headerTheme="light">
      <div id="sector-product">
        <PageHero
          eyebrow={classificationLabel}
          title={definition.title}
          subtitle={definition.longDescription}
        >
          <p className="mc-tool-tier-note">
            {isPremium
              ? "This premium analyzer is designed to support decision-making. Results are indicative and depend on your inputs."
              : "This is a quick estimate. For decision-level analysis, open the matching premium tool when pricing, margin or risk is on the line."}
          </p>
        </PageHero>

        <section className="fourth-tab">
          <Container size="wide" className="min-w-0 py-4">
            <Breadcrumb items={breadcrumbItems} />
            <ToolCalculatorEngine definition={definition} />
            {definition.premiumTeaser && !definition.features?.decisionReport && (
              <div className="mt-10">
                <PremiumTeaserPanel
                  teaser={definition.premiumTeaser}
                  toolSlug={definition.slug}
                />
              </div>
            )}
          </Container>
        </section>

        <section className="seventh-tab">
          <Container>
            <RelatedTools
              relatedToolIds={definition.relatedToolIds}
              currentSlug={definition.slug}
            />
          </Container>
        </section>

        <section className="seventh-tab seventh-tab--muted">
          <Container size="narrow">
            <h2>Assumptions and guidance</h2>
            <p>
              {definition.faqPlaceholder ??
                "Review your inputs against real contracts, invoices and operational data. SectorCalc outputs are indicative and do not replace professional accounting, legal review or certified estimates."}
            </p>
          </Container>
        </section>

        <CTASection
          title={isPremium ? "Request premium report access" : "Continue with sector tools"}
          subtitle={
            isPremium
              ? "Payment and export are not live yet. View pricing to request decision report access or explore other sector analyzers."
              : "Run another free estimate or open the premium analyzer when the number affects margin, pricing or risk."
          }
          primaryLabel={isPremium ? "View pricing" : "Browse industries"}
          primaryHref={isPremium ? "/pricing" : "/industries"}
          secondaryLabel={isPremium ? "View sample report" : "View pricing"}
          secondaryHref={
            isPremium ? "/reports/sample-decision-report" : "/pricing"
          }
        />
      </div>
    </PageLayout>
  );
}
