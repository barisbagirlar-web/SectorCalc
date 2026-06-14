import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { DynamicPremiumCalculator } from "@/components/tools/DynamicPremiumCalculator";
import { GeneratedToolPage } from "@/components/tools/GeneratedToolPage";
import { PremiumAnalyzerAuthorityBlock } from "@/components/content/PremiumAnalyzerAuthorityBlock";
import { FormulaGateToolStatus } from "@/components/formula/FormulaGateToolStatus";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { FeaturedAnswerBlock } from "@/components/seo/FeaturedAnswerBlock";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import type { AppLocale } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/metadata";
import { buildFAQJsonLd } from "@/lib/seo/schema-mesh";
import { assertSemanticToolContract } from "@/lib/semantic/semantic-tool-reader";
import { buildToolJsonLd } from "@/lib/semantic/build-tool-jsonld";
import { getTierOnePremiumMetadata } from "@/lib/seo/seo-refresh-priority";
import {
  resolvePremiumSchemaDisplayName,
  resolvePremiumSchemaPainStatement,
} from "@/lib/i18n/premium-schema-display-i18n";
import {
  getPremiumSchemaBySlug,
  listPremiumSchemaSlugs,
} from "@/lib/premium-schema/schemas/index";
import { limitStaticParamsForPreview } from "@/lib/build/preview-static-params";
import { getGeneratedToolHref } from "@/lib/generated-tools/paths";
import { resolveGeneratedPremiumBridge } from "@/lib/generated-tools/premium-schema-bridge";

interface PremiumSchemaPageParams {
  slug: string;
}

interface PremiumSchemaRouteParams extends PremiumSchemaPageParams {
  locale: string;
}

function trimFeaturedAnswer(text: string): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= 60) {
    return text.trim();
  }
  return `${words.slice(0, 58).join(" ")}…`;
}

export const dynamic = "force-static";
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
  const { slug, locale } = await params;
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

  return createPageMetadata({
    title: metaTitle,
    description: tierOneMeta?.metaDescription ?? displayPain,
    path: `/tools/premium-schema/${schema.id}`,
    locale: locale as AppLocale,
  });
}

export default async function PremiumSchemaPilotPage({
  params,
}: {
  params: Promise<PremiumSchemaRouteParams>;
}) {
  const { slug, locale } = await params;
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
  const generatedBridge = resolveGeneratedPremiumBridge(slug);

  return (
    <PageLayout>
      <SemanticJsonLd data={jsonLd} />
      <section className="border-b border-technical-gray bg-surface-cream">
        <Container className="py-8 sm:py-10">
          <p className="sc-ledger-eyebrow">{tPage("eyebrow")}</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <h1 className="text-2xl font-semibold text-premium-velvet sm:text-3xl">
              {displayName}
            </h1>
            <FormulaGateToolStatus slug={slug} locale={locale} surface="premium" />
          </div>
          <p className="mt-3 max-w-2xl text-sm text-body-charcoal sm:text-base">
            {displayPain}
          </p>
        </Container>
      </section>
      <Container className="pb-4 pt-6 sm:pt-8">
        <FeaturedAnswerBlock
          question={featuredQuestion}
          answer={featuredAnswer}
          bullets={[tPage("bullet1"), tPage("bullet2"), tPage("bullet3")]}
        />
      </Container>
      {generatedBridge ? (
        <Container className="pb-6 pt-2">
          <section
            className="rounded-xl border border-technical-gray bg-white p-4 sm:p-6"
            data-generated-premium-bridge="true"
          >
            <p className="sc-ledger-eyebrow">{tPage("generatedBridgeEyebrow")}</p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-premium-velvet">
                {tPage("generatedBridgeTitle")}
              </h2>
              <Link
                href={getGeneratedToolHref(slug)}
                className="text-sm font-semibold text-premium-copper hover:underline"
              >
                {tPage("generatedBridgeLink")}
              </Link>
            </div>
            <p className="mt-2 max-w-3xl text-sm text-body-charcoal">
              {tPage("generatedBridgeIntro")}
            </p>
            <div className="mt-4">
              <GeneratedToolPage
                slug={generatedBridge.slug}
                schema={generatedBridge.schema}
                diagramSrc={generatedBridge.diagramSrc}
                variant="embedded"
              />
            </div>
          </section>
        </Container>
      ) : null}
      <Container className="pb-12 pt-2 sm:pb-16">
        {generatedBridge ? (
          <h2 className="mb-4 text-lg font-semibold text-premium-velvet">
            {tPage("generatedBridgeDecisionTitle")}
          </h2>
        ) : null}
        <div
          className="sr-only"
          aria-hidden="true"
          data-calculation-form-shell="true"
          data-testid="calculator-form"
        />
        <DynamicPremiumCalculator schema={schema} locale={locale} />
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
      </Container>
    </PageLayout>
  );
}
