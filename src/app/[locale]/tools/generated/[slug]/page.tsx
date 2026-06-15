import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { GeneratedToolPage } from "@/components/tools/GeneratedToolPage";
import type { AppLocale } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/metadata";
import { GENERATED_CALCULATOR_SLUGS } from "@/lib/generated-tools/calculator-registry";
import { REGENERATION_ALL_SLUGS } from "@/lib/generated-tools/regeneration-slug-lists";
import {
  generatedToolDiagramExists,
  generatedToolDiagramPublicPath,
  getGeneratedToolSchema,
  listGeneratedToolSchemaSlugs,
} from "@/lib/generated-tools/schema-loader";
import {
  resolveGeneratedToolDescription,
  resolveGeneratedToolTitle,
} from "@/lib/generated-tools/resolve-tool-display";
import { limitStaticParamsForPreview } from "@/lib/build/preview-static-params";

interface GeneratedToolRouteParams {
  slug: string;
  locale: string;
}

export const dynamic = "force-static";
export const dynamicParams = true;

function resolvePublishedGeneratedToolSlugs(): string[] {
  const allowedSlugs = new Set<string>(REGENERATION_ALL_SLUGS);
  const registrySlugs = new Set<string>(GENERATED_CALCULATOR_SLUGS);
  return listGeneratedToolSchemaSlugs().filter(
    (slug) => allowedSlugs.has(slug) && registrySlugs.has(slug),
  );
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const params = resolvePublishedGeneratedToolSlugs().map((slug) => ({ slug }));
  return limitStaticParamsForPreview(params, {
    family: "generated-tools",
    slugKey: "slug",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<GeneratedToolRouteParams>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const schema = getGeneratedToolSchema(slug);
  if (!schema || !resolvePublishedGeneratedToolSlugs().includes(slug)) {
    return {};
  }

  const displayName = resolveGeneratedToolTitle(slug, schema, locale);
  const displayDescription = resolveGeneratedToolDescription(slug, schema, locale);

  return createPageMetadata({
    title: `${displayName} | SectorCalc`,
    description: displayDescription,
    path: `/tools/generated/${slug}`,
    locale: locale as AppLocale,
  });
}

export default async function GeneratedToolRoutePage({
  params,
}: {
  params: Promise<GeneratedToolRouteParams>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const schema = getGeneratedToolSchema(slug);
  if (!schema || !resolvePublishedGeneratedToolSlugs().includes(slug)) {
    notFound();
  }

  const tPage = await getTranslations("premiumSchemaPage");
  const tCatalog = await getTranslations("generatedToolCatalog");
  const diagramSrc = generatedToolDiagramExists(slug)
    ? generatedToolDiagramPublicPath(slug)
    : null;

  return (
    <PageLayout>
      <section className="border-b border-technical-gray bg-surface-cream">
        <Container className="py-6 sm:py-8">
          <p className="sc-ledger-eyebrow">{tPage("eyebrow")}</p>
          <Link
            href="/tools/generated"
            className="mt-2 inline-block text-sm font-semibold text-premium-copper hover:underline"
          >
            ← {tCatalog("title")}
          </Link>
        </Container>
      </section>
      <Container className="pb-12 pt-4 sm:pb-16">
        <GeneratedToolPage slug={slug} schema={schema} diagramSrc={diagramSrc} />
      </Container>
    </PageLayout>
  );
}
