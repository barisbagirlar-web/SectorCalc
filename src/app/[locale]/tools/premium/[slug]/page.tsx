import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PremiumToolPage } from "@/components/tools/PremiumToolPage";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { RegionalUnitsSection } from "@/components/regional-units/RegionalUnitsSection";
import { resolveRegionForLocale } from "@/lib/units/regional-unit-engine";
import { BenchmarkPanel } from "@/components/regional-benchmarks/BenchmarkPanel";
import { resolveBenchmarkRegionForLocale } from "@/lib/regional-benchmarks/benchmark-registry";
import { FieldModePanel } from "@/components/field-mode/FieldModePanel";
import { Link } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/metadata";
import { assertSemanticToolContract } from "@/lib/semantic/semantic-tool-reader";
import { buildToolJsonLd } from "@/lib/semantic/build-tool-jsonld";
import { hasPremiumSmartFormDefinition } from "@/lib/smart-form/premium-smart-form-definitions";
import {
  getPremiumRevenueRouteSlugs,
  getRevenueToolByPremiumRouteSlug,
} from "@/lib/tools/revenue-tools";

interface PremiumToolPageParams {
  slug: string;
}

interface PremiumToolRouteParams extends PremiumToolPageParams {
  locale: string;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<PremiumToolPageParams[]> {
  return getPremiumRevenueRouteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PremiumToolRouteParams>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const tool = getRevenueToolByPremiumRouteSlug(slug);
  if (!tool) {
    return {};
  }

  return createPageMetadata({
    title: `${tool.paidTitle} | SectorCalc Pro`,
    description: `${tool.paidValue} Premium decision tool for pricing, cost and margin risk.`,
    path: `/tools/premium/${slug}`,
    locale: locale as AppLocale,
  });
}

export default async function PremiumRevenueToolRoute({
  params,
}: {
  params: Promise<PremiumToolRouteParams>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const tool = getRevenueToolByPremiumRouteSlug(slug);

  if (!tool) {
    notFound();
  }

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
