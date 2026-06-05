import { PageLayout } from "@/components/layout/PageLayout";
import PageHero from "@/components/shared/PageHero";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/tools/Breadcrumb";
import { ToolCalculatorEngine } from "@/components/tools/ToolCalculatorEngine";
import { PremiumTeaserPanel } from "@/components/tools/PremiumTeaserPanel";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { CTASection } from "@/components/sections/CTASection";
import type { ToolDefinition } from "@/data/tool-schema";
import { getIndustryBySlug } from "@/data/industries";
import { applyRevenueToolDisplay } from "@/lib/tools/revenue-tools";

interface ToolPageShellProps {
  definition: ToolDefinition;
}

export function ToolPageShell({ definition: rawDefinition }: ToolPageShellProps) {
  const definition = applyRevenueToolDisplay(rawDefinition);
  const industry = getIndustryBySlug(definition.industryId);
  const isPremium = definition.tier === "premium";
  const tierLabel = isPremium ? "Premium Tools" : "Free Tools";
  const tierHref = isPremium ? "/pricing" : "/free-tools";
  const classificationLabel = isPremium ? "Decision tool" : "Quick check";

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
      <PageHero
        eyebrow={classificationLabel}
        title={definition.title}
        description={definition.longDescription}
      />

      <div id="sector-product">
        <section className="fourth-tab border-t border-slate/10 bg-white">
          <Container size="wide" className="min-w-0 py-4">
            <p className="mb-6 text-sm leading-relaxed text-slate">
              {isPremium
                ? "This decision tool delivers safe price floors, margin analysis and accept/reject verdicts. Results are indicative — verify before you commit."
                : "This is a quick pre-check with limited inputs. Unlock the matching decision tool when pricing, margin or risk is on the line."}
            </p>
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
          title={isPremium ? "Unlock all decision tools" : "Continue with sector tools"}
          subtitle={
            isPremium
              ? "SectorCalc Pro unlocks premium decision tools across all five sectors — $29/month, cancel anytime."
              : "Run another quick check or unlock the decision tool when the number affects margin, pricing or risk."
          }
          primaryLabel={isPremium ? "View SectorCalc Pro" : "Browse industries"}
          primaryHref={isPremium ? "/pricing" : "/industries"}
          secondaryLabel={isPremium ? "Browse free tools" : "View pricing"}
          secondaryHref={isPremium ? "/free-tools" : "/pricing"}
        />
      </div>
    </PageLayout>
  );
}
