type AppLocale = "en";
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "@/lib/i18n-stub";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { UniversalIndustrialDecisionForm, generatedToolSchemaToSuperV4Schema } from "@/sectorcalc/pro-form";
import { limitStaticParamsForPreview } from "@/lib/infrastructure/build/preview-static-params";
import {
  getGeneratedToolSchema,
  listGeneratedToolSchemaSlugs,
} from "@/lib/features/generated-tools/schema-loader";
import {
  resolveGeneratedToolDescription,
  resolveGeneratedToolTitle,
} from "@/lib/features/generated-tools/resolve-tool-display";
import { resolveGeneratedToolAboutContent } from "@/lib/features/generated-tools/resolve-tool-about";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFAQJsonLd, type JsonLdRecord } from "@/lib/infrastructure/seo/schema-mesh";
import { AnswerBlock } from "@/components/tools/AnswerBlock";
import { buildGeneratedToolFeaturedCopy } from "@/lib/features/semantic/build-generated-tool-featured-copy";
import { buildGeneratedToolCalculateActionJsonLd } from "@/lib/features/semantic/build-generated-tool-calculate-action-jsonld";
import { buildGeneratedToolHowToJsonLd } from "@/lib/features/semantic/build-generated-tool-howto-jsonld";
import { buildGeneratedToolProductJsonLd } from "@/lib/features/semantic/build-generated-tool-product-jsonld";
import { buildGeneratedToolWebPageJsonLd } from "@/lib/features/semantic/build-generated-tool-webpage-jsonld";
import { inferFreeTrafficCategory } from "@/lib/features/tools/free-traffic-infer";
import {
  buildIndustrialFreeToolSchema,
  isIndustrialFreeToolSlug,
} from "@/lib/features/tools/industrial-free-schema-factory";
import { isFreeV531ToolSlug } from "@/lib/features/tools/free-v531-tool-registry";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";
import type { SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";

interface GeneratedToolRouteParams {
  slug: string;
  }

/** ISR: build only predeclared slugs; other tool pages render on first visit and revalidate hourly. */
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
  const { slug: rawSlug } = await params;
  const slug = rawSlug.replace(/\.$/, "").trim();
  const locale = "en";

  // Free V5.3.1: use resolveApprovedToolSchema directly
  if (isFreeV531ToolSlug(slug)) {
    const resolved = resolveApprovedToolSchema(slug);
    if (resolved.ok && resolved.schema) {
      return createPageMetadata({
        title: `${resolved.schema.tool_name} | SectorCalc`,
        description: `Calculate ${resolved.schema.tool_name} online — free engineering calculator`,
        path: `/tools/generated/${slug}`,
        locale: locale as AppLocale,
      });
    }
    return {};
  }

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
  const { slug: rawSlug } = await params;
  const slug = rawSlug.replace(/\.$/, "").trim();
  const locale = "en";
  setRequestLocale(locale);

  // Free V5.3.1: use resolveApprovedToolSchema directly
  if (isFreeV531ToolSlug(slug)) {
    const resolved = resolveApprovedToolSchema(slug);
    if (!resolved.ok || !resolved.schema) {
      notFound();
    }
    const sv4Schema = resolved.schema;
    const displayName = sv4Schema.tool_name || slug;

    return (
      <PageLayout>
        <article aria-label={displayName}>
          <div className="container mx-auto max-w-6xl px-4 pt-6">
            <h1 className="text-2xl font-semibold text-[#1A1915] mb-2">{displayName}</h1>
            <p className="text-sm text-[#6B6B6B] mb-4">{displayName} — free online calculator</p>
          </div>
          <UniversalIndustrialDecisionForm schema={sv4Schema} toolKey={slug} executeEndpoint="/api/pro-calculator/execute" initialProfileMode="quick" />
        </article>
      </PageLayout>
    );
  }

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
        <UniversalIndustrialDecisionForm schema={generatedToolSchemaToSuperV4Schema(schema, slug)} toolKey={slug} executeEndpoint="/api/pro-calculator/execute" initialProfileMode="quick" />
      </article>
    </PageLayout>
  );
}
