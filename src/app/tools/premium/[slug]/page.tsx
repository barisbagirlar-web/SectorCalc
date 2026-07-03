type AppLocale = "en";
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "@/lib/i18n-stub";
import { PageLayout } from "@/components/layout/PageLayout";
import { UniversalIndustrialDecisionForm, generatedToolSchemaToSuperV4Schema } from "@/sectorcalc/pro-form";
import { JsonLd } from "@/components/seo/JsonLd";
import { limitStaticParamsForPreview } from "@/lib/infrastructure/build/preview-static-params";
import {
  getGeneratedToolSchema,
  listGeneratedToolSchemaSlugs,
} from "@/lib/features/generated-tools/schema-loader";
import { resolveGeneratedToolRouteSlug } from "@/lib/features/generated-tools/resolve-generated-route-slug";
import {
  resolveGeneratedToolDescription,
  resolveGeneratedToolTitle,
} from "@/lib/features/generated-tools/resolve-tool-display";
import { resolveGeneratedToolAboutContent } from "@/lib/features/generated-tools/resolve-tool-about";
import { listMigrationMapLegacySlugs } from "@/lib/features/premium-schema/premium-migration-map";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { buildFAQJsonLd } from "@/lib/infrastructure/seo/schema-mesh";
import { getPremiumRevenueRouteSlugs } from "@/lib/features/tools/revenue-tools";

interface PremiumToolRouteParams {
  slug: string;
  }

export const dynamicParams = true;

function listPremiumRouteSlugs(): readonly string[] {
  const slugs = new Set<string>([
    ...listMigrationMapLegacySlugs(),
    ...getPremiumRevenueRouteSlugs().map((slug) => slug.replace(/-premium$/, "")),
    ...listGeneratedToolSchemaSlugs().filter((slug) => getGeneratedToolSchema(slug)?.premiumRequired),
  ]);
  return [...slugs].sort((left, right) => left.localeCompare(right));
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const params = listPremiumRouteSlugs().map((slug) => ({ slug }));
  return limitStaticParamsForPreview(params, {
    family: "premium-tools",
    slugKey: "slug",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PremiumToolRouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = "en";
  const resolvedSlug = resolveGeneratedToolRouteSlug(slug);
  if (!resolvedSlug) {
    return {};
  }

  const schema = getGeneratedToolSchema(resolvedSlug);
  if (!schema) {
    return {};
  }

  const displayName = resolveGeneratedToolTitle(resolvedSlug, schema, locale);
  const displayDescription = resolveGeneratedToolDescription(resolvedSlug, schema, locale);
  const t = await getTranslations({ locale, namespace: "premiumToolPage" });

  return createPageMetadata({
    title: `${displayName}${t("metaTitleSuffix")}`,
    description: displayDescription,
    path: `/tools/premium/${slug}`,
    locale: locale as AppLocale,
  });
}

export default async function PremiumGeneratedToolRoutePage({
  params,
}: {
  params: Promise<PremiumToolRouteParams>;
}) {
  const { slug } = await params;
  const locale = "en";
  setRequestLocale(locale);

  const resolvedSlug = resolveGeneratedToolRouteSlug(slug);
  if (!resolvedSlug) {
    notFound();
  }

  const schema = getGeneratedToolSchema(resolvedSlug);
  if (!schema) {
    notFound();
  }

  const aboutContent = resolveGeneratedToolAboutContent(resolvedSlug, schema, locale);
  const faqJsonLd = buildFAQJsonLd(aboutContent.faqs);

  return (
    <PageLayout>
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      <UniversalIndustrialDecisionForm schema={generatedToolSchemaToSuperV4Schema(schema as any, resolvedSlug)} executeEndpoint="/api/pro-calculator/execute" initialProfileMode="quick" />
    </PageLayout>
  );
}
