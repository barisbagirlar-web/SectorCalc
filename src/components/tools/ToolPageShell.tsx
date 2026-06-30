import { getTranslations } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/tools/Breadcrumb";
import { ToolOmniMetaSection } from "@/components/tools/ToolOmniMetaSection";
import { PremiumTeaserPanel } from "@/components/tools/PremiumTeaserPanel";
import { PremiumUpsell } from "@/components/tools/PremiumUpsell";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { CTASection } from "@/components/sections/CTASection";
import type { ToolDefinition } from "@/data/tool-schema";
import { getIndustryBySlug } from "@/data/industries";
import { applyRevenueToolDisplay } from "@/lib/features/tools/revenue-tools";
import { MARGINCORE_TERMS } from "@/lib/content/terminology/margincore-identity";
import { FormulaGateToolStatus } from "@/components/formula/FormulaGateToolStatus";
import {
  CALC_TOOL_PAGE_CHROME_CLASS,
  CALC_TOOL_PAGE_CLASS,
  CALC_TOOL_PAGE_FORM_ZONE_CLASS,
} from "@/lib/ui-shared/layout/calculation-tool-mobile-layout";

interface ToolPageShellProps {
  definition: ToolDefinition;
  locale: string;
}

import { PremiumStaticForm } from "@/components/tools/PremiumStaticForm";
import { ToolFeedbackTrigger } from "@/components/tools/ToolFeedbackTrigger";

export async function ToolPageShell({ definition: rawDefinition, locale }: ToolPageShellProps) {
  const definition = applyRevenueToolDisplay(rawDefinition);
  const industry = getIndustryBySlug(definition.industryId);
  const isPremium = definition.tier === "premium";
  const t = await getTranslations({ locale, namespace: "toolPageShell" });

  const tierLabel = isPremium ? t("premiumVerdicts") : t("freePreChecks");
  const tierHref = isPremium ? "/pricing" : "/free-tools";
  const classificationLabel = isPremium ? MARGINCORE_TERMS.riskAnalyzer : t("marginLeakPreCheck");

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
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
          {!isPremium && (
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
                {MARGINCORE_TERMS.freePreCheck}
              </p>
              <Breadcrumb items={breadcrumbItems} />
            </div>
          )}

          <section className={!isPremium ? "fourth-tab border-t border-border-subtle bg-white" : "bg-white"}>
            <Container size={!isPremium ? "wide" : "default"} className="min-w-0 py-4">
              <div className={CALC_TOOL_PAGE_FORM_ZONE_CLASS}>
                {!isPremium ? (
                  <>
                    <ToolOmniMetaSection
                      toolName={definition.title}
                      slug={definition.slug}
                      tier="free"
                      excerpt={definition.longDescription}
                      canonicalPath={definition.seo.canonicalPath}
                    />
                    <div className="rounded-lg border border-technical-gray bg-surface-cream p-6 text-sm text-body-charcoal">
                      {t("calcRegeneration")}
                    </div>
                    <ToolFeedbackTrigger toolSlug={definition.slug} />
                    <PremiumUpsell />
                    {definition.premiumTeaser && !definition.features?.decisionReport && (
                      <div className="mt-10">
                        <PremiumTeaserPanel
                          teaser={definition.premiumTeaser}
                          toolSlug={definition.slug}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <PremiumStaticForm />
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
              locale={locale}
            />
          </Container>
        </section>

        <section className="seventh-tab seventh-tab--muted">
          <Container size="narrow">
            <h2>{t("assumptionsTitle")}</h2>
            <p>
              {definition.faqPlaceholder ?? t("assumptionsFallback")}
            </p>
          </Container>
        </section>

        <CTASection
          title={isPremium ? t("ctaUnlockTitle") : t("ctaContinueTitle")}
          subtitle={
            isPremium
              ? t("ctaUnlockSubtitle")
              : t("ctaContinueSubtitle")
          }
          primaryLabel={isPremium ? t("ctaViewPro") : t("ctaBrowseIndustries")}
          primaryHref={isPremium ? "/pricing" : "/industries"}
          secondaryLabel={isPremium ? t("ctaBrowseFree") : t("ctaViewPricing")}
          secondaryHref={isPremium ? "/free-tools" : "/pricing"}
        />
      </div>
    </PageLayout>
  );
}
