import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { PageLayout } from "@/components/layout/PageLayout";
import { GeneratedToolFormViewShell } from "@/components/tools/GeneratedToolFormViewShell";
import type { AppLocale } from "@/i18n/routing";
import { limitStaticParamsForPreview } from "@/lib/build/preview-static-params";
import {
  getGeneratedToolSchema,
  listGeneratedToolSchemaSlugs,
} from "@/lib/generated-tools/schema-loader";
import {
  resolveGeneratedToolDescription,
  resolveGeneratedToolTitle,
} from "@/lib/generated-tools/resolve-tool-display";
import { resolveGeneratedToolAboutContent } from "@/lib/generated-tools/resolve-tool-about";
import { createPageMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFAQJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";
import { AnswerBlock } from "@/components/tools/AnswerBlock";
import { buildGeneratedToolFeaturedCopy } from "@/lib/semantic/build-generated-tool-featured-copy";
import { buildGeneratedToolCalculateActionJsonLd } from "@/lib/semantic/build-generated-tool-calculate-action-jsonld";
import { buildGeneratedToolHowToJsonLd } from "@/lib/semantic/build-generated-tool-howto-jsonld";
import { buildGeneratedToolProductJsonLd } from "@/lib/semantic/build-generated-tool-product-jsonld";
import { buildGeneratedToolWebPageJsonLd } from "@/lib/semantic/build-generated-tool-webpage-jsonld";
import { inferFreeTrafficCategory } from "@/lib/tools/free-traffic-infer";
import {
  buildIndustrialFreeToolSchema,
  isIndustrialFreeToolSlug,
} from "@/lib/tools/industrial-free-schema-factory";

interface GeneratedToolRouteParams {
  slug: string;
  locale: string;
}

/** ISR: build only predeclared slugs; other tool pages render on first visit and revalidate hourly. */
export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 3600;
export const maxDuration = 300;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const params = listGeneratedToolSchemaSlugs().map((slug) => ({ slug }));
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
  let schema = getGeneratedToolSchema(slug);
  if (!schema) {
    if (isIndustrialFreeToolSlug(slug)) {
      schema = buildIndustrialFreeToolSchema(slug);
    }
    if (!schema) {
      return {};
    }
  }

  const displayName = resolveGeneratedToolTitle(slug, schema, locale);
  const displayDescription = resolveGeneratedToolDescription(slug, schema, locale);
  const titleSuffix = schema.premiumRequired ? "SectorCalc Pro" : "SectorCalc";

  return createPageMetadata({
    title: `${displayName} | ${titleSuffix}`,
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

  let schema = getGeneratedToolSchema(slug);
  if (!schema) {
    if (isIndustrialFreeToolSlug(slug)) {
      schema = buildIndustrialFreeToolSchema(slug);
    }
    if (!schema) {
      notFound();
    }
  }

  const displayName = resolveGeneratedToolTitle(slug, schema, locale);
  const displayDescription = resolveGeneratedToolDescription(slug, schema, locale);
  const toolWebPageJsonLd = buildGeneratedToolWebPageJsonLd({
    toolName: displayName,
    description: displayDescription,
    slug,
    locale,
    schema,
  });
  const toolProductJsonLd = buildGeneratedToolProductJsonLd({
    toolName: displayName,
    description: displayDescription,
    slug,
    locale,
    schema,
  });
  const toolCalculateActionJsonLd = buildGeneratedToolCalculateActionJsonLd({
    toolName: displayName,
    description: displayDescription,
    slug,
    locale,
    schema,
  });
  const featuredCopy = buildGeneratedToolFeaturedCopy(displayName, displayDescription, locale);
  const categoryId = inferFreeTrafficCategory(slug);
  const tCatalog = await getTranslations("freeTrafficCatalog");
  const aboutContent = resolveGeneratedToolAboutContent(slug, schema, locale);
  const faqJsonLd = buildFAQJsonLd(aboutContent.faqs);
  const howToJsonLd = buildGeneratedToolHowToJsonLd({
    toolName: displayName,
    aboutContent,
    locale,
  });

  const jsonLd: JsonLdRecord[] = [
    toolWebPageJsonLd,
    toolProductJsonLd,
    toolCalculateActionJsonLd,
  ];
  if (faqJsonLd) {
    jsonLd.push(faqJsonLd);
  }
  if (howToJsonLd) {
    jsonLd.push(howToJsonLd);
  }

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <article aria-label={displayName}>
        <div className="container mx-auto max-w-6xl px-4 pt-6">
          <AnswerBlock question={featuredCopy.question} answer={featuredCopy.answer} />
          <p className="mb-4 text-sm text-body-charcoal">
            <Link
              href={`/tools/category/${categoryId}`}
              prefetch={false}
              className="font-medium text-deep-navy hover:underline"
            >
              {tCatalog(`categories.${categoryId}`)}
            </Link>
          </p>
        </div>
        <GeneratedToolFormViewShell slug={slug} schema={schema} />
      </article>
    </PageLayout>
  );
}
