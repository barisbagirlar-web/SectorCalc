import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { IndustriesTaxonomyGrid } from "@/components/industries/IndustriesTaxonomyGrid";
import { ToolsPageLayout } from "@/components/tools/ToolsPageLayout";
import { ToolsPageSearchProvider } from "@/components/tools/tools-page-search-context";
import { CategoryCatalogView } from "@/components/categories/CategoryCatalogView";
import { CatalogSearchUrlSync } from "@/components/tools/CatalogSearchUrlSync";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildItemListJsonLd } from "@/lib/seo/schema-mesh";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/seo/localized-breadcrumbs";
import { createPageMetadata } from "@/lib/metadata";
import { getFreeTools } from "@/lib/tools/all-tools-data";
import { buildTaxonomyCategoryCards } from "@/lib/tools/build-taxonomy-category-cards";
import { buildTaxonomySectorCards, withTaxonomyCountLabels } from "@/lib/tools/build-taxonomy-sector-cards";
import { CATALOG_HUB_JSONLD_MAX_ITEMS } from "@/lib/tools/filter-catalog-hub-tools";
import type { AppLocale } from "@/i18n/routing";
// ── ToolAlphaList imports ──
import { Link } from "@/i18n/routing";
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

// ─── Helper: group tools by first character for A–Z index ───────────────────

type ToolIndexItem = { title: string; slug: string; href: string; isPremium: boolean; categorySlug: string };

function groupByFirstLetter(
  tools: readonly ToolIndexItem[],
  locale: string,
): Map<string, ToolIndexItem[]> {
  const groups = new Map<string, ToolIndexItem[]>();
  for (const tool of tools) {
    const char = tool.title.charAt(0).toUpperCase();
    const key = /[A-Za-z0-9]/.test(char) ? char : "#";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push({ ...tool });
  }
  // Sort within each group
  for (const [, list] of groups) {
    list.sort((a, b) => a.title.localeCompare(b.title, locale));
  }
  return groups;
}

export default async function FreeToolsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tCatalog = await getTranslations({ locale, namespace: "catalogExplorer" });
  const tPage = await getTranslations({ locale, namespace: "freeTools" });
  const tools = getFreeTools(locale);
  const toolSlugs = new Set(tools.map(t => t.slug));
  const categoryCards = buildTaxonomyCategoryCards(locale, "free", toolSlugs);
  const taxonomySectorCards = withTaxonomyCountLabels(
    buildTaxonomySectorCards(tools, locale, {
      allLabel: tCatalog("labels.free-tools.allLabel"),
    }),
    (count) => tCatalog("labels.free-tools.countLabel", { count }),
  );

  // ── Group free tools by canonical category for ToolAlphaList sections ──
  const groupedByCategory = getAllToolsGroupedByCategory(locale, false);
  const orderedCategorySlugs = getOrderedCategorySlugsWithTools(groupedByCategory);

  // ── Group all tools by first letter for A–Z index ──
  const allAlphabetGroups = groupByFirstLetter(
    tools.map((t) => ({
      title: t.name,
      slug: t.slug,
      href: t.href,
      isPremium: t.premiumRequired,
      categorySlug: t.categoryKey,
    })),
    locale,
  );
  const sortedLetters = Array.from(allAlphabetGroups.keys()).sort((a, b) => {
    if (a === "#") return 1;
    if (b === "#") return -1;
    return a.localeCompare(b, locale);
  });

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

            <Suspense fallback={<div className="min-h-[20rem] animate-pulse rounded bg-gray-50" aria-hidden="true" />}>
              <CategoryCatalogView
                basePath="/free-tools"
                categories={categoryCards}
                tools={tools}
                locale={locale}
                pageVariant="free-tools"
              />
            </Suspense>

            {/* ── Per-category alphabetical tool lists ── */}
            {orderedCategorySlugs.length > 0 && (
              <div className="mt-12 space-y-10">
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

            {/* ── All Tools A–Z Index ── */}
            {sortedLetters.length > 0 && (
              <div className="mt-16">
                <h2 className="mb-5 text-lg font-bold text-gray-900">
                  {tPage("allToolsTitle")}
                </h2>

                {/* Alphabet navigation */}
                <nav className="mb-5 flex flex-wrap gap-1.5" aria-label={tPage("alphabetIndex")}>
                  {sortedLetters.map((letter) => (
                    <a
                      key={letter}
                      href={`#az-${letter}`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
                    >
                      {letter}
                    </a>
                  ))}
                </nav>

                {/* A-Z tool list with same visual style as ToolAlphaList */}
                <div className="w-full rounded-lg bg-[#F1F5F9] p-4 sm:p-5">
                  <div className="space-y-6">
                    {sortedLetters.map((letter) => {
                      const letterTools = allAlphabetGroups.get(letter)!;
                      return (
                        <div key={letter} id={`az-${letter}`}>
                          <h3 className="mb-2 text-xs font-bold text-gray-500 sticky top-0 py-1">
                            {letter}
                          </h3>
                          <div className="grid grid-cols-1 gap-x-6 gap-y-[6px] md:grid-cols-2 lg:grid-cols-3">
                            {letterTools.map((tool) => (
                              <div key={tool.slug} className="flex items-baseline gap-1.5 min-w-0">
                                <span className="text-gray-400 shrink-0 select-none text-sm" aria-hidden="true">
                                  &bull;
                                </span>
                                <Link
                                  href={tool.href}
                                  className="text-sm text-blue-700 hover:text-blue-800 hover:underline truncate"
                                >
                                  {tool.title}
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

          </ToolsPageLayout>
        </ToolsPageSearchProvider>
      </section>
    </PageLayout>
  );
}
