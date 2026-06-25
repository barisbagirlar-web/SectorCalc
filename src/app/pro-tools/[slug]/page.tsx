import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { redirect as nextRedirect } from "next/navigation";
import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { PremiumToolGrid } from "@/components/catalog/PremiumToolGrid";
import { ToolsTileGrid } from "@/components/tools/ToolsTileGrid";
import {
  getPremiumCatalogCategoryDetail,
} from "@/lib/premium/premium-category-resolver";
import type { GlobalToolCategorySlug } from "@/lib/catalog/global-tool-category-taxonomy";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/seo/localized-breadcrumbs";

// Premium Schema Calculator imports
import { getPremiumSchemaBySlug } from "@/lib/premium-schema/schemas/index";
import { PREMIUM_SCHEMA_SLUG_MAP } from "@/lib/premium-schema/schema-registry";
import { getPremium152Tools } from "@/lib/premium/premium-152-seed-reader";

function humanizeSlug(slug: string): string {
  return slug
    .replace(/-calculator$/i, "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

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
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { buildToolJsonLd } from "@/lib/semantic/build-tool-jsonld";
import { assertSemanticToolContract } from "@/lib/semantic/semantic-tool-reader";

interface PageParams {
  slug: string;
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return []; // HACK: bypass huge SSG build for fast Firebase deploy
}

// JSON-LD structured data for pipeline tools


export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = "en";
  const appLocale = locale as "en";

  // 2. Category view
  const categoryDetail = getPremiumCatalogCategoryDetail(slug as GlobalToolCategorySlug, locale);
  if (categoryDetail) {
    return createPageMetadata({
      title: `${categoryDetail.title} | SectorCalc`,
      description: categoryDetail.summary,
      path: `/pro-tools/${slug}`,
      locale: appLocale,
    });
  }

  // 3. Direct Premium Schema
  const schema = getPremiumSchemaBySlug(slug);
  if (schema) {
    const displayName = schema.name;
    const displayPain = schema.painStatement;
    return createPageMetadata({
      title: `${displayName} | SectorCalc`,
      description: displayPain,
      path: `/pro-tools/${schema.id}`,
      locale: appLocale,
    });
  }

  // 4. Migrated Free Tool
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

  // 5. Revenue Tool
  const tool = getRevenueToolByPremiumRouteSlug(slug);
  if (tool) {
    return createPageMetadata({
      title: `${tool.paidTitle} | SectorCalc Pro`,
      description: `${tool.paidValue} Premium decision tool for pricing, cost and margin risk.`,
      path: `/pro-tools/${slug}`,
      locale: appLocale,
    });
  }

  // 6. Mapped slug redirect metadata
  const mappedSchemaId = PREMIUM_SCHEMA_SLUG_MAP[slug];
  if (mappedSchemaId) {
    const mappedSchema = getPremiumSchemaBySlug(mappedSchemaId);
    if (mappedSchema) {
      const displayName = mappedSchema.name;
      const displayPain = mappedSchema.painStatement;
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
  const { slug } = await params;
  const locale = "en";

  // 2. Is it a category slug?
  const categoryDetail = getPremiumCatalogCategoryDetail(slug as GlobalToolCategorySlug, locale);
  if (categoryDetail) {
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
        <section className="bg-[#F0EEE6] py-16 border-b border-[#1A1915]/10 min-h-[80vh]">
          <Container size="wide" className="min-w-0">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm font-medium text-slate-500">
              <Link href="/pro-tools" prefetch={false} className="hover:text-[#C45A2C] transition-colors">
                Pro Tools
              </Link>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-slate-800">{categoryDetail.title}</span>
            </nav>
            <header className="mb-12 max-w-3xl">
              <h1 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl mb-4 leading-tight">
                {categoryDetail.title}
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                {categoryDetail.summary}
              </p>
            </header>

            <div className="space-y-16">
              <section>
                <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6">Premium Decision Tools</h2>
                <PremiumToolGrid
                  tools={categoryDetail.premiumTools}
                  locale={locale}
                  openLabel={"Open Analyzer"}
                />
              </section>

              {freeTools.length > 0 ? (
                <section>
                  <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6 border-t border-[#1A1915]/10 pt-10">Related Calculators</h2>
                  <ToolsTileGrid tools={freeTools} />
                </section>
              ) : null}
            </div>
          </Container>
        </section>
      </PageLayout>
    );
  }

  // 3. Mapped legacy schema slug redirect
  const mappedSchemaId = PREMIUM_SCHEMA_SLUG_MAP[slug];
  if (mappedSchemaId) {
    nextRedirect(`/pro-tools/${mappedSchemaId}`);
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

  // 6. Active seed premium tool fallback
  const seedTool = getPremium152Tools().find((t) => t.slug === slug);
  if (seedTool) {
    const categoryDetail = getPremiumCatalogCategoryDetail(seedTool.categorySlug as GlobalToolCategorySlug, locale);
    const categoryTitle = categoryDetail?.title ?? "Category";

    const displayName = seedTool.trTitle;
    const displayPain = seedTool.pain;

    return (
      <PageLayout>
        <section className="bg-white py-12 border-b border-technical-gray/20">
          <Container size="wide" className="max-w-7xl">
            <nav aria-label="Breadcrumb" className="mb-4 text-xs text-body-charcoal">
              <Link href="/pro-tools" prefetch={false} className="hover:underline">
                Pro Tools
              </Link>
              <span className="mx-1.5">/</span>
              <Link href={`/pro-tools/${seedTool.categorySlug}`} prefetch={false} className="hover:underline">
                {categoryTitle}
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-premium-velvet font-medium">{displayName}</span>
            </nav>

            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-premium-velvet sm:text-3xl">{displayName}</h1>
              <span className="inline-flex items-center gap-1 rounded bg-[#E65100]/10 px-2 py-0.5 text-xs font-semibold text-[#E65100]">
                PRO PREVIEW
              </span>
            </div>
            <p className="mt-3 text-lg text-body-charcoal/80">{displayPain}</p>
          </Container>
        </section>

        <section className="bg-off-white py-12">
          <Container size="wide" className="max-w-4xl">
            <div className="rounded-xl border border-technical-gray/30 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-bold text-premium-velvet mb-4">
                Calculation Model & Formula Framework
              </h2>
              <div className="rounded-lg bg-industrial-matte p-4 font-mono text-sm text-body-charcoal mb-6 overflow-x-auto border border-technical-gray/20">
                <code>{seedTool.formulaNote}</code>
              </div>

              <div className="border-t border-technical-gray/20 pt-6">
                <h3 className="text-base font-bold text-premium-velvet mb-2">
                  Pro Decision Analysis Report
                </h3>
                <p className="text-sm text-body-charcoal mb-6 leading-relaxed">
                  This advanced analyzer operates using precise inputs, tolerance checks, and references global engineering standards. With Pro access, run sensitivity scenarios and download presentation-ready PDF decision reports.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/pricing"
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-6 font-semibold text-white hover:bg-[#C45A2C] transition-colors"
                  >
                    Get Pro Access
                  </Link>
                  <Link
                    href="/pro-tools"
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-technical-gray px-6 font-semibold text-body-charcoal hover:bg-industrial-matte transition-colors"
                  >
                    Browse Other Tools
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </PageLayout>
    );
  }

  notFound();
}
