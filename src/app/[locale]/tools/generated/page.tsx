/* eslint-disable */
// @ts-nocheck

export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageHero } from "@/components/catalog/CatalogPageHero";
import { Container } from "@/components/ui/Container";
import { Suspense } from "react";
import { GeneratedToolsHub } from "@/components/tools/GeneratedToolsHub";
import { ToolsCategoryHub } from "@/components/tools/ToolsCategoryHub";
import { buildGeneratedCatalogIndex as buildGeneratedToolCatalog } from "@/lib/features/generated-tools/build-generated-catalog";
import type { AppLocale } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildItemListJsonLd } from "@/lib/infrastructure/seo/schema-mesh";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/infrastructure/seo/localized-breadcrumbs";

type PageProps = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "generatedToolCatalog" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/tools/generated",
    locale: locale as AppLocale,
  });
}

export default async function GeneratedToolsHubPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("generatedToolCatalog");
  const tools = buildGeneratedToolCatalog(locale);

  const jsonLd = [
    await buildLocalizedBreadcrumbJsonLd(
      [
        { key: "home", path: "/" },
        { key: "generatedTools", path: "/tools/generated" },
      ],
      locale,
    ),
    buildItemListJsonLd(
      tools.map((tool) => ({
        name: tool.name,
        path: tool.href,
      })),
      t("title"),
      locale,
    ),
  ];

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <CatalogPageHero
        title={t("title")}
        subtitle={t("subtitleCompact")}
        eyebrow={t("eyebrow")}
      />
      <Container className="pb-12 pt-4 sm:pb-16">
        <Suspense fallback={<GeneratedToolsHub tools={tools} />}>
          <ToolsCategoryHub tools={tools} />
        </Suspense>
      </Container>
    </PageLayout>
  );
}
