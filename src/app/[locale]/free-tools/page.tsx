import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { IndustriesTaxonomyGrid } from "@/components/industries/IndustriesTaxonomyGrid";
import { ToolsPageLayout } from "@/components/tools/ToolsPageLayout";
import { ToolsPageSearchProvider } from "@/components/tools/tools-page-search-context";
import { CatalogSearchUrlSync } from "@/components/tools/CatalogSearchUrlSync";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildItemListJsonLd } from "@/lib/seo/schema-mesh";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/seo/localized-breadcrumbs";
import { createPageMetadata } from "@/lib/metadata";
import { getFreeTools } from "@/lib/tools/all-tools-data";
import { buildTaxonomySectorCards, withTaxonomyCountLabels } from "@/lib/tools/build-taxonomy-sector-cards";
import { CATALOG_HUB_JSONLD_MAX_ITEMS } from "@/lib/tools/filter-catalog-hub-tools";
import type { AppLocale } from "@/i18n/routing";
// ── ToolAlphaList imports ──
import { ToolAlphaList } from "@/components/tools/ToolAlphaList";
import {
  getAllToolsGroupedByCategory,
  getOrderedCategorySlugsWithTools,
} from "@/lib/tools/getToolsByCategory";
import { resolveFreeToolCategoryTitle } from "@/lib/free-tools/free-tool-categories";

type PageProps = {
  params: Promise<{ locale: string }>;
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

export default async function FreeToolsPage({ params }: PageProps) {
  const { locale } = await params;
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

  // ── Group free tools by canonical category for ToolAlphaList sections ──
  const groupedByCategory = getAllToolsGroupedByCategory(locale, false);
  const orderedCategorySlugs = getOrderedCategorySlugsWithTools(groupedByCategory);

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

            {/* ── Per-category alphabetical tool lists ── */}
            {orderedCategorySlugs.length > 0 && (
              <div className="mt-4 space-y-10">
                <h2 className="text-lg font-bold text-gray-900">
                  {tPage("byCategoryTitle")}
                </h2>

                {orderedCategorySlugs.map((catSlug) => {
                  const catTools = groupedByCategory[catSlug];
                  if (!catTools || catTools.length === 0) return null;
                  const catTitle = resolveFreeToolCategoryTitle(catSlug, locale);

                  return (
                    <section key={catSlug}>
                      <h3
                        id={`cat-${catSlug}`}
                        className="mb-3 text-base font-semibold text-gray-800"
                      >
                        {catTitle}
                        <span className="ml-2 text-sm font-normal text-gray-400">
                          {tPage("toolsCount", { count: catTools.length })}
                        </span>
                      </h3>
                      <ToolAlphaList
                        tools={catTools}
                        locale={locale}
                        categoryName={catTitle}
                      />
                    </section>
                  );
                })}
              </div>
            )}

          </ToolsPageLayout>
        </ToolsPageSearchProvider>
      </section>
    </PageLayout>
  );
}
