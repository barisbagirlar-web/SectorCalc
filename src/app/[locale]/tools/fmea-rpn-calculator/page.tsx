export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PremiumSchemaToolForm } from "@/components/tools/PremiumSchemaToolForm";
import { FormulaGateToolStatus } from "@/components/formula/FormulaGateToolStatus";
import { getTranslations } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { FeaturedAnswerBlock } from "@/components/seo/FeaturedAnswerBlock";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import type { AppLocale } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { buildFAQJsonLd } from "@/lib/infrastructure/seo/schema-mesh";
import { assertSemanticToolContract } from "@/lib/features/semantic/semantic-tool-reader";
import { buildToolJsonLd } from "@/lib/features/semantic/build-tool-jsonld";
import { getTierOnePremiumMetadata } from "@/lib/infrastructure/seo/seo-refresh-priority";
import {
  resolvePremiumSchemaDisplayName,
  resolvePremiumSchemaPainStatement,
} from "@/lib/infrastructure/i18n/premium-schema-display-i18n";
import { getPremiumSchemaBySlug } from "@/lib/features/premium-schema/schemas/index";
import { FmeaRpnPageContent } from "@/app/[locale]/calculators/fmea-rpn/FmeaRpnPageContent";

interface PremiumSchemaRouteParams {
  locale: string;
}

function trimFeaturedAnswer(text: string): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= 60) {
    return text.trim();
  }
  return `${words.slice(0, 58).join(" ")}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PremiumSchemaRouteParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const slug = "fmea-rpn-calculator";
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
    path: `/tools/${slug}`,
    locale: locale as AppLocale,
  });
}

export default async function FmeaRpnCalculatorPage({
  params,
}: {
  params: Promise<PremiumSchemaRouteParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const slug = "fmea-rpn-calculator";
  const schema = getPremiumSchemaBySlug(slug);
  if (!schema) {
    notFound();
  }

  const tPage = await getTranslations("premiumSchemaPage");
  const displayName = resolvePremiumSchemaDisplayName(schema.id, schema.name, locale);
  const displayPain = resolvePremiumSchemaPainStatement(schema.id, schema.painStatement, locale);

  const featuredQuestion = tPage("featuredQuestion", { name: displayName });
  const featuredAnswer = trimFeaturedAnswer(displayPain);
  
  const faqJsonLd = buildFAQJsonLd([
    { question: featuredQuestion, answer: featuredAnswer },
    {
      question: tPage("legalQuestion"),
      answer: tPage("legalAnswer"),
    }
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
      
      <Container className="pb-8 pt-2">
        <div
          className="sr-only"
          aria-hidden="true"
          data-calculation-form-shell="true"
          data-testid="calculator-form"
        />
        <PremiumSchemaToolForm schema={schema} locale={locale} />
      </Container>
      
      {/* Renders the old FMEA content exactly as requested */}
      <FmeaRpnPageContent />
      
    </PageLayout>
  );
}
