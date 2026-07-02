type AppLocale = "en";
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "@/lib/i18n-stub";
import { PremiumSchemaToolForm } from "@/components/tools/PremiumSchemaToolForm";
import { PremiumAnalyzerAuthorityBlock } from "@/components/content/PremiumAnalyzerAuthorityBlock";
import { FormulaGateToolStatus } from "@/components/formula/FormulaGateToolStatus";
import { getTranslations } from "@/lib/i18n-stub";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { FeaturedAnswerBlock } from "@/components/seo/FeaturedAnswerBlock";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { ExpertAuthoritySection } from "@/components/content/ExpertAuthoritySection";
import { VerificationQueueButton } from "@/components/feedback/VerificationQueueButton";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { buildFAQJsonLd } from "@/lib/infrastructure/seo/schema-mesh";
import { assertSemanticToolContract } from "@/lib/features/semantic/semantic-tool-reader";
import { buildToolJsonLd } from "@/lib/features/semantic/build-tool-jsonld";
import { getTierOnePremiumMetadata } from "@/lib/infrastructure/seo/seo-refresh-priority";
import {
  resolvePremiumSchemaDisplayName,
  resolvePremiumSchemaPainStatement,
} from "@/lib/infrastructure/i18n/premium-schema-display-i18n";
import {
  getPremiumSchemaBySlug,
  listPremiumSchemaSlugs,
} from "@/lib/features/premium-schema/schemas/index";
import { getGeneratedToolSchema } from "@/lib/features/generated-tools/schema-loader";
import { limitStaticParamsForPreview } from "@/lib/infrastructure/build/preview-static-params";

interface PremiumSchemaPageParams {
  slug: string;
}

interface PremiumSchemaRouteParams extends PremiumSchemaPageParams {
  }

function trimFeaturedAnswer(text: string): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= 60) {
    return text.trim();
  }
  return `${words.slice(0, 58).join(" ")}…`;
}

export const dynamicParams = true;

export async function generateStaticParams(): Promise<PremiumSchemaPageParams[]> {
  const params = listPremiumSchemaSlugs().map((slug) => ({ slug }));
  return limitStaticParamsForPreview(params, {
    family: "premium-schema",
    slugKey: "slug",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PremiumSchemaRouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = "en";
  const schema = getPremiumSchemaBySlug(slug);
  if (!schema) {
    return {};
  }

  const tierOneMeta = getTierOnePremiumMetadata(slug);
  const displayName = resolvePremiumSchemaDisplayName(schema.id, schema.name, locale);
  const displayPain = resolvePremiumSchemaPainStatement(schema.id, schema.painStatement, locale);

  const metaTitle =
    locale === "en"
      ? (tierOneMeta?.metaTitle ?? `${displayName} | SectorCalc`)
      : `${displayName} | SectorCalc`;

  const canonicalPath = getGeneratedToolSchema(schema.id)
    ? `/tools/generated/${schema.id}`
    : `/tools/premium-schema/${schema.id}`;

  return createPageMetadata({
    title: metaTitle,
    description: tierOneMeta?.metaDescription ?? displayPain,
    path: canonicalPath,
    locale: locale as AppLocale,
  });
}

export default async function PremiumSchemaPilotPage({
  params,
}: {
  params: Promise<PremiumSchemaRouteParams>;
}) {
  const { slug } = await params;
  const locale = "en";
  setRequestLocale(locale);

  const schema = getPremiumSchemaBySlug(slug);
  if (!schema) {
    notFound();
  }

  const tPage = await getTranslations("premiumSchemaPage");
  const displayName = resolvePremiumSchemaDisplayName(schema.id, schema.name, locale);
  const displayPain = resolvePremiumSchemaPainStatement(schema.id, schema.painStatement, locale);

  const featuredQuestion = tPage("featuredQuestion", { name: displayName });
  const featuredAnswer = trimFeaturedAnswer(displayPain);
  const tAuthority = await getTranslations("contentAuthority.premium");
  const authorityFaq = [
    {
      question: tAuthority("faqMeasureTitle"),
      answer: tAuthority("faqMeasureAnswer", { name: displayName }),
    },
    {
      question: tAuthority("faqReportTitle"),
      answer: tAuthority("faqReportAnswer"),
    },
    {
      question: tAuthority("faqErpTitle"),
      answer: tAuthority("faqErpAnswer"),
    },
  ];
  const faqJsonLd = buildFAQJsonLd([
    { question: featuredQuestion, answer: featuredAnswer },
    {
      question: tPage("legalQuestion"),
      answer: tPage("legalAnswer"),
    },
    ...authorityFaq,
  ]);
  const semanticTool = assertSemanticToolContract({ slug, tier: "premium-schema" });
  const jsonLd = [
    ...buildToolJsonLd({ tool: semanticTool, locale }),
    ...(faqJsonLd ? [faqJsonLd] : []),
  ];

  return (
    <PageLayout>
      <SemanticJsonLd data={jsonLd} />
      <section className="border-b border-technical-gray bg-surface-cream">
        <Container className="py-8 sm:py-10">
          <p className="sc-ledger-eyebrow">{tPage("eyebrow")}</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <FormulaGateToolStatus slug={slug} locale={locale} surface="premium" />
          </div>
        </Container>
      </section>
      <Container className="pb-4 pt-6 sm:pt-8">
        <FeaturedAnswerBlock
          question={featuredQuestion}
          answer={featuredAnswer}
          bullets={[tPage("bullet1"), tPage("bullet2"), tPage("bullet3")]}
        />
      </Container>
      <Container className="pb-12 pt-2 sm:pb-16">
        <div
          className="sr-only"
          aria-hidden="true"
          data-calculation-form-shell="true"
          data-testid="calculator-form"
        />
        <PremiumSchemaToolForm schema={schema} />
        <PremiumAnalyzerAuthorityBlock
          schema={schema}
          locale={locale}
          displayName={displayName}
          displayPain={displayPain}
          labels={{
            whenToUseTitle: tAuthority("whenToUseTitle"),
            whenToUseBody: tAuthority("whenToUseBody"),
            measuresTitle: tAuthority("measuresTitle"),
            promiseTitle: tAuthority("promiseTitle"),
            promiseBody: tAuthority("promiseBody"),
            decidesTitle: tAuthority("decidesTitle"),
            decidesBody: tAuthority("decidesBody"),
            reportTitle: tAuthority("reportTitle"),
            reportBullet1: tAuthority("reportBullet1"),
            reportBullet2: tAuthority("reportBullet2"),
            reportBullet3: tAuthority("reportBullet3"),
            reportBullet4: tAuthority("reportBullet4"),
            previewExcludesTitle: tAuthority("previewExcludesTitle"),
            previewExcludesBody: tAuthority("previewExcludesBody"),
            assumptionsTitle: tAuthority("assumptionsTitle"),
            faqTitle: tAuthority("faqTitle"),
            faqMeasureTitle: tAuthority("faqMeasureTitle"),
            faqReportTitle: tAuthority("faqReportTitle"),
            faqErpTitle: tAuthority("faqErpTitle"),
            faqMeasureAnswer: tAuthority("faqMeasureAnswer", { name: displayName }),
            faqReportAnswer: tAuthority("faqReportAnswer"),
            faqErpAnswer: tAuthority("faqErpAnswer"),
            relatedGuideTitle: tAuthority("relatedGuideTitle"),
            relatedFreeTitle: tAuthority("relatedFreeTitle"),
            relatedHubTitle: tAuthority("relatedHubTitle"),
            relatedIndustryTitle: tAuthority("relatedIndustryTitle"),
            pricingCta: tAuthority("pricingCta"),
          }}
        />
        <VerificationQueueButton
          toolSlug={slug}
          locale={locale}
          tier="premium"
          pageUrl={`/tools/premium-schema/${slug}`}
        />
        <ExpertAuthoritySection toolName={displayName} />
      </Container>
    </PageLayout>
  );
}
