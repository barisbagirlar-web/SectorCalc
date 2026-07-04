type AppLocale = "en";
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "@/lib/i18n-stub";
import {
  getGeneratedToolSchema,
} from "@/lib/features/generated-tools/schema-loader";
import { resolveGeneratedToolTitle } from "@/lib/features/generated-tools/resolve-tool-display";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { UniversalIndustrialDecisionForm, generatedToolSchemaToSuperV4Schema } from "@/sectorcalc/pro-form";

type EmbedRouteParams = {
  slug: string;
  };

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<EmbedRouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = "en";
  const schema = getGeneratedToolSchema(slug);
  if (!schema) return {};

  const displayName = resolveGeneratedToolTitle(slug, schema, locale);
  const meta = createPageMetadata({
    title: `${displayName} - Embed`,
    description: `Embeddable ${displayName} calculator widget.`,
    path: `/embed/${slug}`,
    locale: locale as AppLocale,
  });
  return {
    ...meta,
    robots: { index: false, follow: false },
  };
}

export default async function EmbedToolPage({
  params,
}: {
  params: Promise<EmbedRouteParams>;
}) {
  const { slug } = await params;
  const locale = "en";
  setRequestLocale(locale);

  const schema = getGeneratedToolSchema(slug);
  if (!schema) {
    notFound();
  }

  return (
    <div
      className="mx-auto max-w-4xl px-3 py-4"
      data-embed-calculator={slug}
    >
      <UniversalIndustrialDecisionForm schema={generatedToolSchemaToSuperV4Schema(schema as any, slug)} executeEndpoint="/api/tool-execute" initialProfileMode="quick" accessTier="FREE" />
    </div>
  );
}
