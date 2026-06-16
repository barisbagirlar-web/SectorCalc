import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/tools/Breadcrumb";
import { ToolOmniMetaSection } from "@/components/tools/ToolOmniMetaSection";
import { PremiumTeaserPanel } from "@/components/tools/PremiumTeaserPanel";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { CTASection } from "@/components/sections/CTASection";
import type { ToolDefinition } from "@/data/tool-schema";
import { getIndustryBySlug } from "@/data/industries";
import { applyRevenueToolDisplay } from "@/lib/tools/revenue-tools";
import { MARGINCORE_TERMS } from "@/lib/terminology/margincore-identity";
import { FormulaGateToolStatus } from "@/components/formula/FormulaGateToolStatus";
import {
  CALC_TOOL_PAGE_CHROME_CLASS,
  CALC_TOOL_PAGE_CLASS,
  CALC_TOOL_PAGE_FORM_ZONE_CLASS,
} from "@/lib/layout/calculation-tool-mobile-layout";

interface ToolPageShellProps {
 definition: ToolDefinition;
 locale: string;
}

export function ToolPageShell({ definition: rawDefinition, locale }: ToolPageShellProps) {
 const definition = applyRevenueToolDisplay(rawDefinition);
 const industry = getIndustryBySlug(definition.industryId);
 const isPremium = definition.tier === "premium";
 const tierLabel = isPremium ? "Premium Verdicts" : "Free Pre-Checks";
 const tierHref = isPremium ? "/pricing" : "/free-tools";
 const classificationLabel = isPremium ? MARGINCORE_TERMS.riskAnalyzer : "Margin leak pre-check";

 const breadcrumbItems = [
 { label: "Home", href: "/" },
 { label: tierLabel, href: tierHref },
 ...(industry
 ? [{ label: industry.name, href: industry.href }]
 : []),
 { label: definition.title },
 ];

 return (
 <PageLayout>
 <div id="sector-product">
 <div className={CALC_TOOL_PAGE_CLASS}>
 <div className={CALC_TOOL_PAGE_CHROME_CLASS}>
 <section className="mb-6">
 <p className="label-badge mb-3 text-body-charcoal">{classificationLabel}</p>
 <div className="mb-3">
 <FormulaGateToolStatus slug={definition.slug} locale={locale} />
 </div>
 <p className="max-w-3xl text-sm leading-relaxed text-body-charcoal sm:text-base">
 {definition.longDescription}
 </p>
 </section>
 <p className="mb-6 text-sm leading-relaxed text-text-secondary">
 {isPremium
 ? MARGINCORE_TERMS.premiumVerdict
 : MARGINCORE_TERMS.freePreCheck}
 </p>
 <Breadcrumb items={breadcrumbItems} />
 </div>

 <section className="fourth-tab border-t border-border-subtle bg-white">
 <Container size="wide" className="min-w-0 py-4">
        <div className={CALC_TOOL_PAGE_FORM_ZONE_CLASS}>
          <ToolOmniMetaSection
            toolName={definition.title}
            slug={definition.slug}
            tier={isPremium ? "premium" : "free"}
            excerpt={definition.longDescription}
            canonicalPath={definition.seo.canonicalPath}
          />
          <div className="rounded-lg border border-technical-gray bg-surface-cream p-6 text-sm text-body-charcoal">
            Calculator regeneration in progress. Schema scan will restore this tool.
          </div>
 {definition.premiumTeaser && !definition.features?.decisionReport && (
 <div className="mt-10">
 <PremiumTeaserPanel
 teaser={definition.premiumTeaser}
 toolSlug={definition.slug}
 />
 </div>
 )}
 </div>
 </Container>
 </section>
 </div>

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
 ? "SectorCalc Pro unlocks premium decision tools across all sectors — $19/month, cancel anytime."
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
