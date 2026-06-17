import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { IndustriesTaxonomyGrid } from "@/components/industries/IndustriesTaxonomyGrid";
import { ToolsPageLayout } from "@/components/tools/ToolsPageLayout";
import { ToolsPageSearchProvider } from "@/components/tools/tools-page-search-context";
import { SchemaToolsCatalogExplorer } from "@/components/tools/SchemaToolsCatalogExplorer";
import { Container } from "@/components/ui/Container";
import { CrawlIndexLinkList } from "@/components/seo/CrawlIndexLinkList";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { buildItemListJsonLd } from "@/lib/seo/schema-mesh";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/seo/localized-breadcrumbs";
import { buildCoreHubCrawlGroups, buildFreeToolsCrawlGroups, buildSeoHubCrawlGroups } from "@/lib/seo/crawl-index";
import { shouldRenderCrawlIndexForLocale } from "@/lib/i18n/catalog-labels-i18n";
import { getAllTools } from "@/lib/tools/all-tools-data";
import { buildTaxonomySectorCards, withTaxonomyCountLabels } from "@/lib/tools/build-taxonomy-sector-cards";
import type { AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
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

export default async function IndustriesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "industries" });
  const tCatalog = await getTranslations({ locale, namespace: "catalogExplorer" });
  const tools = getAllTools(locale);
  const taxonomySectorCards = withTaxonomyCountLabels(
    buildTaxonomySectorCards(tools, locale),
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
      <section className="sc-pro-section sc-pro-section--border">
        <ToolsPageSearchProvider>
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
              <SchemaToolsCatalogExplorer
                tools={tools}
                filterBy="sector"
                variant="industries"
                hideBrowseSection
              />
            </Suspense>
          </ToolsPageLayout>
        </ToolsPageSearchProvider>
      </section>

      {shouldRenderCrawlIndexForLocale(locale) ? (
        <section className="sc-pro-section sc-pro-section--border">
          <Container className="sc-pro-container">
            <CrawlIndexLinkList
              groups={[
                ...buildCoreHubCrawlGroups(),
                ...buildFreeToolsCrawlGroups(),
                ...buildSeoHubCrawlGroups(),
              ]}
            />
          </Container>
        </section>
      ) : null}
    </PageLayout>
  );
}
