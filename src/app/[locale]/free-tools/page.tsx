import type { Metadata } from "next";
import { Suspense } from "react";
import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { IndustriesTaxonomyGrid } from "@/components/industries/IndustriesTaxonomyGrid";
import { ToolsPageLayout } from "@/components/tools/ToolsPageLayout";
import { ToolsPageSearchProvider } from "@/components/tools/tools-page-search-context";
import { CatalogHubToolsSection } from "@/components/tools/CatalogHubToolsSection";
import { CatalogSearchUrlSync } from "@/components/tools/CatalogSearchUrlSync";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildItemListJsonLd } from "@/lib/seo/schema-mesh";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/seo/localized-breadcrumbs";
import { createPageMetadata } from "@/lib/metadata";
import { getPremiumToolsHref } from "@/lib/tools/tool-links";
import { getFreeTools } from "@/lib/tools/all-tools-data";
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
  const t = await getTranslations({ locale, namespace: "freeTools" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/free-tools",
    locale: locale as AppLocale,
  });
}

function resolveSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function FreeToolsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  setRequestLocale(locale);
  const tCatalog = await getTranslations({ locale, namespace: "catalogExplorer" });
  const tPage = await getTranslations({ locale, namespace: "freeTools" });
  const tools = getFreeTools(locale);
  const taxonomySectorCards = withTaxonomyCountLabels(
    buildTaxonomySectorCards(tools, locale, {
      allLabel: tCatalog("labels.free-tools.allLabel"),
    }),
    (count) => tCatalog("labels.free-tools.countLabel", { count }),
  );

  const jsonLd = [
    await buildLocalizedBreadcrumbJsonLd(
      [
        { key: "home", path: "/" },
        { key: "freeTools", path: "/free-tools" },
      ],
      locale,
    ),
    buildItemListJsonLd(
      tools.slice(0, CATALOG_HUB_JSONLD_MAX_ITEMS).map((tool) => ({
        name: tool.name,
        path: tool.href,
      })),
      tPage("title"),
      locale,
    ),
  ];

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <section className="sc-pro-section sc-pro-section--border">
        <ToolsPageSearchProvider>
          <Suspense fallback={null}>
            <CatalogSearchUrlSync />
          </Suspense>
          <ToolsPageLayout
            title={tPage("title")}
            subtitle={tPage("subtitle")}
            searchPlaceholder={tPage("searchPlaceholder")}
            categoryTitle={tPage("categoryTitle")}
          >
            <div className="mb-8">
              <Suspense fallback={<div className="min-h-[12rem]" aria-hidden="true" />}>
                <IndustriesTaxonomyGrid
                  basePath="/free-tools"
                  sectors={taxonomySectorCards}
                  variant="free"
                />
              </Suspense>
            </div>

            <Suspense fallback={<div className="min-h-[12rem]" aria-hidden="true" />}>
              <CatalogHubToolsSection
                locale={locale}
                tools={tools}
                variant="free-tools"
                sectorFilter={resolveSearchParam(resolvedSearchParams.sector)}
                searchQuery={resolveSearchParam(resolvedSearchParams.q)}
              />
            </Suspense>

            <div className="sc-discovery-footer">
              <p className="sc-discovery-footer__lead">{tCatalog("discoveryFooter.freeToolsLead")}</p>
              <Link href={getPremiumToolsHref()} prefetch={false} className="sc-discovery-footer__link">
                {tCatalog("discoveryFooter.freeToolsCta")}
              </Link>
            </div>
          </ToolsPageLayout>
        </ToolsPageSearchProvider>
      </section>
    </PageLayout>
  );
}
