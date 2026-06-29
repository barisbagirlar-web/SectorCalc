export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import {
  getGeneratedToolSchema,
} from "@/lib/generated-tools/schema-loader";
import { resolveGeneratedToolTitle } from "@/lib/generated-tools/resolve-tool-display";
import { createPageMetadata } from "@/lib/metadata";
import { GeneratedToolFormViewShell } from "@/components/tools/GeneratedToolFormViewShell";

type EmbedRouteParams = {
  slug: string;
  locale: string;
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
  const { slug, locale } = await params;
  const schema = getGeneratedToolSchema(slug);
  if (!schema) return {};

  const displayName = resolveGeneratedToolTitle(slug, schema, locale);
  const meta = createPageMetadata({
    title: `${displayName} — Embed`,
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
  const { slug, locale } = await params;
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
      <GeneratedToolFormViewShell slug={slug} schema={schema} />
    </div>
  );
}
