import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { IndustriesTaxonomyGrid } from "@/components/industries/IndustriesTaxonomyGrid";
import { ToolsPageLayout } from "@/components/tools/ToolsPageLayout";
import { ToolsPageSearchProvider } from "@/components/tools/tools-page-search-context";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { getPremiumTools } from "@/lib/tools/all-tools-data";
import { buildTaxonomySectorCards, withTaxonomyCountLabels } from "@/lib/tools/build-taxonomy-sector-cards";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/seo/localized-breadcrumbs";
import { buildItemListJsonLd } from "@/lib/seo/schema-mesh";
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
  const t = await getTranslations({ locale, namespace: "premiumTools" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/pro-tools",
    locale: locale as AppLocale,
  });
}

export default async function ProToolsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tCatalog = await getTranslations({ locale, namespace: "catalogExplorer" });
  const tPage = await getTranslations({ locale, namespace: "premiumTools" });
  const tools = getPremiumTools(locale);
  const taxonomySectorCards = withTaxonomyCountLabels(
    buildTaxonomySectorCards(tools, locale, {
      allLabel: tCatalog("labels.premium-tools.allLabel"),
    }),
    (count) => tCatalog("labels.premium-tools.countLabel", { count }),
  );

  // ── Group premium tools by canonical category ──
  const groupedByCategory = getAllToolsGroupedByCategory(locale, true);
  const orderedCategorySlugs = getOrderedCategorySlugsWithTools(groupedByCategory);

  const jsonLd = [
    await buildLocalizedBreadcrumbJsonLd(
      [
        { key: "home", path: "/" },
        { key: "premiumTools", path: "/pro-tools" },
      ],
      locale,
    ),
    buildItemListJsonLd(
      tools.map((tool) => ({
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
          <ToolsPageLayout
            title={tPage("title")}
            subtitle={tPage("subtitle")}
            searchPlaceholder={tPage("searchPlaceholder")}
            categoryTitle={tPage("categoryTitle")}
          >
            <div className="mb-8">
              <Suspense fallback={<div className="min-h-[12rem]" aria-hidden="true" />}>
                <IndustriesTaxonomyGrid
                  basePath="/pro-tools"
                  sectors={taxonomySectorCards}
                  variant="premium"
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
