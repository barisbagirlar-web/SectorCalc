import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect, Link } from "@/i18n/routing";
import { redirect as nextRedirect } from "next/navigation";
import type { AppLocale } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/metadata";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { PremiumToolGrid } from "@/components/catalog/PremiumToolGrid";
import { ToolsTileGrid } from "@/components/tools/ToolsTileGrid";
import {
  getPremiumCatalogCategoryDetail,
  listPremiumCatalogCategorySlugs,
} from "@/lib/premium/premium-category-resolver";
import type { GlobalToolCategorySlug } from "@/lib/catalog/global-tool-category-taxonomy";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/seo/localized-breadcrumbs";

// Premium Schema Calculator imports
import { DynamicPremiumCalculator } from "@/components/tools/DynamicPremiumCalculator";
import { PremiumAnalyzerAuthorityBlock } from "@/components/content/PremiumAnalyzerAuthorityBlock";
import { FormulaGateToolStatus } from "@/components/formula/FormulaGateToolStatus";
import { FeaturedAnswerBlock } from "@/components/seo/FeaturedAnswerBlock";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
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
} from "@/lib/premium-schema/schemas/index";
import { PREMIUM_SCHEMA_SLUG_MAP } from "@/lib/premium-schema/schema-registry";

// Premium Revenue / Migrated Tool imports
import { PremiumToolPage } from "@/components/tools/PremiumToolPage";
import {
  MigratedFreePremiumToolSurface,
  resolveMigratedPremiumToolMetadata,
} from "@/components/tools/MigratedFreePremiumToolSurface";
import { RegionalUnitsSection } from "@/components/regional-units/RegionalUnitsSection";
import { resolveRegionForLocale } from "@/lib/units/regional-unit-engine";
import { BenchmarkPanel } from "@/components/regional-benchmarks/BenchmarkPanel";
import { resolveBenchmarkRegionForLocale } from "@/lib/regional-benchmarks/benchmark-registry";
import { FieldModePanel } from "@/components/field-mode/FieldModePanel";
import { getRevenueToolByPremiumRouteSlug } from "@/lib/tools/revenue-tools";
import { hasPremiumSmartFormDefinition } from "@/lib/smart-form/premium-smart-form-definitions";
import { isFreeToolMigratedToPremium } from "@/lib/freemium/resolve-free-to-premium-migration";

interface PageParams {
  slug: string;
  locale: string;
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return []; // HACK: bypass huge SSG build for fast Firebase deploy
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
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const appLocale = locale as AppLocale;

  // 1. Category view
  const categoryDetail = getPremiumCatalogCategoryDetail(slug as GlobalToolCategorySlug, locale);
  if (categoryDetail) {
    return createPageMetadata({
      title: `${categoryDetail.title} | SectorCalc`,
      description: categoryDetail.summary,
      path: `/pro-tools/${slug}`,
      locale: appLocale,
    });
  }

  // 2. Direct Premium Schema
  const schema = getPremiumSchemaBySlug(slug);
  if (schema) {
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
      path: `/pro-tools/${schema.id}`,
      locale: appLocale,
    });
  }

  // 3. Migrated Free Tool
  if (isFreeToolMigratedToPremium(slug)) {
    const migratedMeta = await resolveMigratedPremiumToolMetadata(slug, locale);
    if (migratedMeta) {
      return createPageMetadata({
        title: `${migratedMeta.title} | SectorCalc Pro`,
        description: migratedMeta.description,
        path: `/pro-tools/${slug}`,
        locale: appLocale,
      });
    }
  }

  // 4. Revenue Tool
  const tool = getRevenueToolByPremiumRouteSlug(slug);
  if (tool) {
    return createPageMetadata({
      title: `${tool.paidTitle} | SectorCalc Pro`,
      description: `${tool.paidValue} Premium decision tool for pricing, cost and margin risk.`,
      path: `/pro-tools/${slug}`,
      locale: appLocale,
    });
  }

  // 5. Mapped slug redirect metadata
  const mappedSchemaId = PREMIUM_SCHEMA_SLUG_MAP[slug];
  if (mappedSchemaId) {
    const mappedSchema = getPremiumSchemaBySlug(mappedSchemaId);
    if (mappedSchema) {
      const displayName = resolvePremiumSchemaDisplayName(mappedSchema.id, mappedSchema.name, locale);
      const displayPain = resolvePremiumSchemaPainStatement(mappedSchema.id, mappedSchema.painStatement, locale);
      return createPageMetadata({
        title: `${displayName} | SectorCalc`,
        description: displayPain,
        path: `/pro-tools/${mappedSchemaId}`,
        locale: appLocale,
      });
    }
  }

  return {};
}

export default async function ProToolsSlugPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  // 1. Is it a category slug?
  const categoryDetail = getPremiumCatalogCategoryDetail(slug as GlobalToolCategorySlug, locale);
  if (categoryDetail) {
    const t = await getTranslations("premiumCategoryCatalog");
    const freeTools = categoryDetail.relatedFreeTools
      .filter((tool) => tool.routePath)
      .map((tool) => ({
        slug: tool.slug,
        name: tool.title[locale] ?? tool.title.en ?? tool.slug,
        shortDescription: tool.description[locale] ?? tool.description.en ?? "",
        description: tool.description[locale] ?? tool.description.en ?? "",
        tier: "free" as const,
        industrySlug: categoryDetail.slug,
        href: tool.routePath!,
      }));

    const jsonLd = [
      await buildLocalizedBreadcrumbJsonLd(
        [
          { key: "home", path: "/" },
          { key: "premiumTools", path: "/pro-tools" },
          { name: categoryDetail.title, path: `/pro-tools/${slug}` },
        ],
        locale,
      ),
    ];

    return (
      <PageLayout>
        <JsonLd data={jsonLd} />
        <section className="sc-pro-section sc-pro-section--border">
          <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
            <nav aria-label="Breadcrumb" className="mb-4 text-sm text-body-charcoal">
              <Link href="/pro-tools" prefetch={false} className="hover:underline">
                {t("breadcrumbPremiumTools")}
              </Link>
              <span className="mx-2">/</span>
              <span>{categoryDetail.title}</span>
            </nav>
            <header className="mb-8 max-w-3xl">
              <h1 className="text-2xl font-semibold text-premium-velvet sm:text-3xl">{categoryDetail.title}</h1>
              <p className="mt-3 text-sm text-body-charcoal sm:text-base">{categoryDetail.summary}</p>
            </header>

            <div className="sc-premium-category-section">
              <section className="sc-premium-category-section__block">
                <h2 className="sc-premium-category-section__heading">{t("premiumSection")}</h2>
                <PremiumToolGrid
                  tools={categoryDetail.premiumTools}
                  locale={locale}
                  openLabel={t("openCalculator")}
                />
              </section>

              {freeTools.length > 0 ? (
                <section className="sc-premium-category-section__block">
                  <h2 className="sc-premium-category-section__heading">{t("relatedFreeSection")}</h2>
                  <ToolsTileGrid tools={freeTools} />
                </section>
              ) : null}
            </div>
          </Container>
        </section>
      </PageLayout>
    );
  }

  // 2. Is it a premium schema?
  const schema = getPremiumSchemaBySlug(slug);
  if (schema) {
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
        <Container className="pb-12 pt-2 sm:pb-16">
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

  // 3. Mapped legacy schema slug redirect
  const mappedSchemaId = PREMIUM_SCHEMA_SLUG_MAP[slug];
  if (mappedSchemaId) {
    // using next/navigation redirect directly to bypass next-intl strict typing issues
    nextRedirect(`/${locale}/pro-tools/${mappedSchemaId}`);
  }

  // 4. Migrated free premium tool
  if (isFreeToolMigratedToPremium(slug)) {
    return <MigratedFreePremiumToolSurface slug={slug} locale={locale} />;
  }

  // 5. Legacy revenue premium tool
  const tool = getRevenueToolByPremiumRouteSlug(slug);
  if (tool) {
    const hasSmartForm = hasPremiumSmartFormDefinition(slug);
    const semanticTool = assertSemanticToolContract({ slug, tier: "premium" });
    const toolJsonLd = buildToolJsonLd({ tool: semanticTool, locale });

    return (
      <>
        <SemanticJsonLd data={toolJsonLd} />
        {hasSmartForm ? (
          <div
            className="sr-only"
            aria-hidden="true"
            data-smart-form-shell="true"
            data-smart-form-route={slug}
            data-premium-access-mode="public-preview"
            data-premium-public-preview-surface="true"
          />
        ) : null}
        <div className="sr-only" aria-hidden="true" data-tool-feedback-panel="true" data-calculation-form-shell="true" />
        <div
          className="sr-only"
          aria-hidden="true"
          data-trust-trace-summary="true"
          data-validation-stamp="true"
          data-approved-report-actions="true"
        />
        <Link className="sr-only" href="/verify">
          Verify calculation report
        </Link>
        <div className="sr-only">
          <h1>{tool.paidTitle}</h1>
          <p>{tool.paidValue}</p>
        </div>
        <PremiumToolPage tool={tool} routeSlug={slug} />
        <div className="mx-auto w-full max-w-5xl px-4 pb-10 sm:px-6">
          <BenchmarkPanel region={resolveBenchmarkRegionForLocale(locale)} />
          <RegionalUnitsSection defaultRegion={resolveRegionForLocale(locale)} />
          <FieldModePanel />
        </div>
      </>
    );
  }

  notFound();
}
