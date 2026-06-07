import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { DynamicPremiumCalculator } from "@/components/tools/DynamicPremiumCalculator";
import { PremiumAnalyzerAuthorityBlock } from "@/components/content/PremiumAnalyzerAuthorityBlock";
import { getTranslations } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { FeaturedAnswerBlock } from "@/components/seo/FeaturedAnswerBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import type { AppLocale } from "@/i18n/routing";
import { siteUrl } from "@/config/site";
import { createPageMetadata } from "@/lib/metadata";
import {
  buildBreadcrumbJsonLd,
  buildFAQJsonLd,
  buildPremiumAnalyzerJsonLd,
  sanitizeJsonLd,
  type JsonLdRecord,
} from "@/lib/seo/schema-mesh";
import {
  getPremiumSchemaBySlug,
  listPremiumSchemaSlugs,
} from "@/lib/premium-schema/schemas/index";

interface PremiumSchemaPageParams {
  slug: string;
}

interface PremiumSchemaRouteParams extends PremiumSchemaPageParams {
  locale: string;
}

function buildPremiumFeaturedQuestion(name: string): string {
  return `What does ${name} analyze?`;
}

function trimFeaturedAnswer(text: string): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= 60) {
    return text.trim();
  }
  return `${words.slice(0, 58).join(" ")}…`;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<PremiumSchemaPageParams[]> {
  return listPremiumSchemaSlugs().map((slug) => ({ slug }));
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

  return createPageMetadata({
    title: `${schema.name} | SectorCalc`,
    description: schema.painStatement,
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

  const featuredQuestion = buildPremiumFeaturedQuestion(schema.name);
  const featuredAnswer = trimFeaturedAnswer(schema.painStatement);
  const tAuthority = await getTranslations("contentAuthority.premium");
  const authorityFaq = [
    {
      question: tAuthority("faqMeasureTitle"),
      answer: tAuthority("faqMeasureAnswer", { name: schema.name }),
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
      question: "Is this financial or engineering advice?",
      answer:
        "No. SectorCalc premium reports are decision-support tools with transparent assumptions. They do not replace professional financial, legal, or engineering advice.",
    },
    ...authorityFaq,
  ]);
  const jsonLd: JsonLdRecord[] = [
    buildBreadcrumbJsonLd(
      [
        { name: "Home", path: "/" },
        { name: "Premium tools", path: "/premium-tools" },
        { name: schema.name, path: `/tools/premium-schema/${schema.id}` },
      ],
      locale
    ),
    buildPremiumAnalyzerJsonLd(schema, locale),
    sanitizeJsonLd({
      "@context": "https://schema.org",
      "@type": "Service",
      name: schema.name,
      description: schema.painStatement,
      provider: { "@id": `${siteUrl}/#organization` },
      areaServed: "Worldwide",
      serviceType: "Operational decision analysis",
    }) as JsonLdRecord,
  ];
  if (faqJsonLd) {
    jsonLd.push(faqJsonLd);
  }

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <section className="border-b border-technical-gray bg-surface-cream">
        <Container className="py-8 sm:py-10">
          <p className="sc-ledger-eyebrow">Premium analyzer</p>
          <h1 className="mt-2 text-2xl font-semibold text-premium-velvet sm:text-3xl">
            {schema.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-body-charcoal sm:text-base">
            {schema.painStatement}
          </p>
        </Container>
      </section>
      <Container className="pb-4 pt-6 sm:pt-8">
        <FeaturedAnswerBlock
          question={featuredQuestion}
          answer={featuredAnswer}
          bullets={[
            "Hidden-loss drivers and threshold checks",
            "Suggested actions for operational review",
            "Export-ready PDF and CSV on paid plans",
          ]}
        />
      </Container>
      <Container className="pb-12 pt-2 sm:pb-16">
        <DynamicPremiumCalculator schema={schema} locale={locale} />
        <PremiumAnalyzerAuthorityBlock
          schema={schema}
          labels={{
            whenToUseTitle: tAuthority("whenToUseTitle"),
            painTitle: tAuthority("painTitle"),
            promiseTitle: tAuthority("promiseTitle"),
            decidesTitle: tAuthority("decidesTitle"),
            reportTitle: tAuthority("reportTitle"),
            assumptionsTitle: tAuthority("assumptionsTitle"),
            faqTitle: tAuthority("faqTitle"),
            faqMeasureTitle: tAuthority("faqMeasureTitle"),
            faqReportTitle: tAuthority("faqReportTitle"),
            faqErpTitle: tAuthority("faqErpTitle"),
            faqMeasureAnswer: tAuthority("faqMeasureAnswer"),
            faqReportAnswer: tAuthority("faqReportAnswer"),
            faqErpAnswer: tAuthority("faqErpAnswer"),
            relatedGuideTitle: tAuthority("relatedGuideTitle"),
            relatedFreeTitle: tAuthority("relatedFreeTitle"),
            pricingCta: tAuthority("pricingCta"),
          }}
        />
      </Container>
    </PageLayout>
  );
}
