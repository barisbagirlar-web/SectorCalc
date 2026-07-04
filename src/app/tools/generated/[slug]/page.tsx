type AppLocale = "en";
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "@/lib/i18n-stub";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { UniversalIndustrialDecisionForm } from "@/sectorcalc/pro-form";
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
import { buildToolRenderContract } from "@/sectorcalc/runtime/build-tool-render-contract";
import type { ResolvedToolSource } from "@/sectorcalc/runtime/resolved-tool-source";
import type { SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";
import { generatedToolSchemaToSuperV4Schema } from "@/sectorcalc/pro-form";

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

  // Use resolveApprovedToolSchema for all tool types (covers free_v531, generated_free, industrial_free, pro_v531)
  const resolved = resolveApprovedToolSchema(slug);
  if (resolved.ok && resolved.schema) {
    return createPageMetadata({
      title: `${resolved.schema.tool_name} | SectorCalc`,
      description: `Calculate ${resolved.schema.tool_name} online — free engineering calculator`,
      path: `/tools/generated/${slug}`,
      locale: locale as AppLocale,
    });
  }

  // Fallback for legacy tools not found by resolveApprovedToolSchema
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

  // ── Phase 1: Resolve schema through approved resolver ──────────
  // This covers: free_v531, generated_free, industrial_free, pro_v531
  const resolved = resolveApprovedToolSchema(slug);

  if (!resolved.ok || !resolved.schema) {
    // If approved resolution fails, redirect to notFound
    notFound();
  }

  const sv4Schema = resolved.schema as SuperV4Schema;
  const source = resolved.source as ResolvedToolSource;

  // ── Phase 2: Build safe render contract ────────────────────────
  const contract = buildToolRenderContract({
    source,
    slug,
    schema: sv4Schema,
  });

  if (!contract.ok) {
    // Contract invalid — log diagnostic and render controlled unavailable
    console.error(
      `[GeneratedToolRoutePage] Render contract invalid for ${slug}: ${contract.reason} — ${contract.detail}`,
    );
    return renderContractInaccessible(slug, contract.reason);
  }

  // ── Phase 3: Build SEO/JSON-LD data from the resolved schema ──
  const displayName = contract.contract.toolName;

  // Legacy SEO components still need GeneratedToolSchema for JSON-LD
  const legacySchema = getGeneratedToolSchema(slug)
    ?? (isIndustrialFreeToolSlug(slug) ? buildIndustrialFreeToolSchema(slug) : null);

  const displayDescription = legacySchema
    ? resolveGeneratedToolDescription(slug, legacySchema, locale)
    : `${displayName} — free online calculator`;

  const toolWebPageJsonLd = legacySchema
    ? buildGeneratedToolWebPageJsonLd({ toolName: displayName, description: displayDescription, slug, locale, schema: legacySchema })
    : null;
  const toolProductJsonLd = legacySchema
    ? buildGeneratedToolProductJsonLd({ toolName: displayName, description: displayDescription, slug, locale, schema: legacySchema })
    : null;
  const toolCalculateActionJsonLd = legacySchema
    ? buildGeneratedToolCalculateActionJsonLd({ toolName: displayName, description: displayDescription, slug, locale, schema: legacySchema })
    : null;
  const aboutContent = legacySchema
    ? resolveGeneratedToolAboutContent(slug, legacySchema, locale)
    : null;
  const faqJsonLd = aboutContent ? buildFAQJsonLd(aboutContent.faqs) : null;
  const howToJsonLd = aboutContent
    ? buildGeneratedToolHowToJsonLd({ toolName: displayName, aboutContent, locale })
    : null;
  const featuredCopy = legacySchema
    ? buildGeneratedToolFeaturedCopy(displayName, displayDescription, locale)
    : { question: `What is ${displayName}?`, answer: displayDescription };

  const categoryId = legacySchema
    ? inferFreeTrafficCategory(slug)
    : null;
  const tCatalog = legacySchema ? await getTranslations("freeTrafficCatalog") : null;

  const jsonLd: JsonLdRecord[] = [];
  if (toolWebPageJsonLd) jsonLd.push(toolWebPageJsonLd);
  if (toolProductJsonLd) jsonLd.push(toolProductJsonLd);
  if (toolCalculateActionJsonLd) jsonLd.push(toolCalculateActionJsonLd);
  if (faqJsonLd) jsonLd.push(faqJsonLd);
  if (howToJsonLd) jsonLd.push(howToJsonLd);

  return (
    <PageLayout>
      {jsonLd.length > 0 ? <JsonLd data={jsonLd} /> : null}
      <article aria-label={displayName}>
        <div className="container mx-auto max-w-6xl px-4 pt-6">
          <AnswerBlock question={featuredCopy.question} answer={featuredCopy.answer} />
          {tCatalog && categoryId ? (
            <p className="mb-4 text-sm text-body-charcoal">
              <Link
                href={`/tools/category/${categoryId}`}
                prefetch={false}
                className="font-medium text-deep-navy hover:underline"
              >
                {tCatalog(`categories.${categoryId}`)}
              </Link>
            </p>
          ) : null}
        </div>
        <UniversalIndustrialDecisionForm
          schema={sv4Schema}
          toolKey={slug}
          executeEndpoint="/api/tool-execute"
          initialProfileMode="quick"
          accessTier="FREE"
        />
      </article>
    </PageLayout>
  );
}

function renderContractInaccessible(slug: string, reason: string) {
  return (
    <PageLayout>
      <article aria-label="Tool unavailable">
        <div className="container mx-auto max-w-6xl px-4 pt-6">
          <h1 className="text-2xl font-semibold text-[#1A1915] mb-2">Tool Temporarily Unavailable</h1>
          <p className="text-sm text-[#6B6B6B] mb-4">
            This calculator is undergoing maintenance. Please try again later.
          </p>
        </div>
      </article>
    </PageLayout>
  );
}
