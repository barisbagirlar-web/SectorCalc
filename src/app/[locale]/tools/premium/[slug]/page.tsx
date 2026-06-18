import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { GeneratedToolFormViewShell } from "@/components/tools/GeneratedToolFormViewShell";
import { JsonLd } from "@/components/seo/JsonLd";
import type { AppLocale } from "@/i18n/routing";
import { limitStaticParamsForPreview } from "@/lib/build/preview-static-params";
import {
  getGeneratedToolSchema,
  listGeneratedToolSchemaSlugs,
} from "@/lib/generated-tools/schema-loader";
import { resolveGeneratedToolRouteSlug } from "@/lib/generated-tools/resolve-generated-route-slug";
import {
  resolveGeneratedToolDescription,
  resolveGeneratedToolTitle,
} from "@/lib/generated-tools/resolve-tool-display";
import { resolveGeneratedToolAboutContent } from "@/lib/generated-tools/resolve-tool-about";
import { listMigrationMapLegacySlugs } from "@/lib/premium-schema/premium-migration-map";
import { createPageMetadata } from "@/lib/metadata";
import { buildFAQJsonLd } from "@/lib/seo/schema-mesh";
import { getPremiumRevenueRouteSlugs } from "@/lib/tools/revenue-tools";

interface PremiumToolRouteParams {
  slug: string;
  locale: string;
}

export const dynamic = "force-static";
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
  const { slug, locale } = await params;
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
  const { slug, locale } = await params;
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
      <GeneratedToolFormViewShell slug={resolvedSlug} schema={schema} />
    </PageLayout>
  );
}
