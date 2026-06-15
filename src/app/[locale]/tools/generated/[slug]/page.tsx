import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { GeneratedToolFormView } from "@/components/tools/GeneratedToolFormView";
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
import { createPageMetadata } from "@/lib/metadata";

interface GeneratedToolRouteParams {
  slug: string;
  locale: string;
}

export const dynamic = "force-static";
export const dynamicParams = true;

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
  const schema = getGeneratedToolSchema(slug);
  if (!schema) {
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
  if (!schema) {
    notFound();
  }

  return (
    <PageLayout>
      <GeneratedToolFormView slug={slug} schema={schema} />
    </PageLayout>
  );
}
