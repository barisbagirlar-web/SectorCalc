import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { IndustriesTaxonomyGrid } from "@/components/industries/IndustriesTaxonomyGrid";
import { ToolsPageLayout } from "@/components/tools/ToolsPageLayout";
import { ToolsPageSearchProvider } from "@/components/tools/tools-page-search-context";
import { CatalogHubToolsSection } from "@/components/tools/CatalogHubToolsSection";
import { CatalogSearchUrlSync } from "@/components/tools/CatalogSearchUrlSync";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { buildItemListJsonLd } from "@/lib/seo/schema-mesh";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/seo/localized-breadcrumbs";
import { getAllTools } from "@/lib/tools/all-tools-data";
import { buildTaxonomySectorCards, withTaxonomyCountLabels } from "@/lib/tools/build-taxonomy-sector-cards";
import { CATALOG_HUB_JSONLD_MAX_ITEMS } from "@/lib/tools/filter-catalog-hub-tools";
import type { AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const revalidate = 3600;
export const dynamic = "force-static";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "industries" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/industries",
    locale: locale as AppLocale,
  });
}

function resolveSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function IndustriesPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "industries" });
  const tCatalog = await getTranslations({ locale, namespace: "catalogExplorer" });
  const tools = getAllTools(locale);
  const taxonomySectorCards = withTaxonomyCountLabels(
    buildTaxonomySectorCards(tools, locale, {
      allLabel: tCatalog("labels.industries.allLabel"),
    }),
    (count) => tCatalog("labels.industries.countLabel", { count }),
  );

  const jsonLd = [
    await buildLocalizedBreadcrumbJsonLd(
      [
        { key: "home", path: "/" },
        { key: "industries", path: "/industries" },
      ],
      locale,
    ),
    buildItemListJsonLd(
      tools.slice(0, CATALOG_HUB_JSONLD_MAX_ITEMS).map((tool) => ({
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
      <section className="sc-pro-section sc-pro-section--border">
        <ToolsPageSearchProvider>
          <CatalogSearchUrlSync />
          <ToolsPageLayout
            title={t("title")}
            subtitle={t("subtitle")}
            searchPlaceholder={t("searchPlaceholder")}
            categoryTitle={t("categoryTitle")}
          >
            <div className="mb-8">
              <Suspense fallback={<div className="min-h-[12rem]" aria-hidden="true" />}>
                <IndustriesTaxonomyGrid
                  basePath="/industries"
                  sectors={taxonomySectorCards}
                  variant="industry"
                />
              </Suspense>
            </div>

            <Suspense fallback={<div className="min-h-[12rem]" aria-hidden="true" />}>
              <CatalogHubToolsSection
                locale={locale}
                tools={tools}
                variant="industries"
                sectorFilter={resolveSearchParam(resolvedSearchParams.sector)}
                searchQuery={resolveSearchParam(resolvedSearchParams.q)}
              />
            </Suspense>
          </ToolsPageLayout>
        </ToolsPageSearchProvider>
      </section>
    </PageLayout>
  );
}
