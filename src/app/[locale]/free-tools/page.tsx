import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageShell } from "@/components/catalog/CatalogPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildItemListJsonLd } from "@/lib/seo/schema-mesh";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/seo/localized-breadcrumbs";
import { createPageMetadata } from "@/lib/metadata";
import { getFreeTools } from "@/lib/tools/all-tools-data";
import {
  buildTaxonomySectorCards,
  withTaxonomyCountLabels,
} from "@/lib/tools/build-taxonomy-sector-cards";
import { CATALOG_HUB_JSONLD_MAX_ITEMS } from "@/lib/tools/filter-catalog-hub-tools";
import type { AppLocale } from "@/i18n/routing";
import {
  getAllToolsGroupedByCategory,
  getOrderedCategorySlugsWithTools,
} from "@/lib/tools/getToolsByCategory";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 3600;

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

  // Flat tool list from grouped categories
  const groupedByCategory = getAllToolsGroupedByCategory(locale, false);
  const orderedCategorySlugs = getOrderedCategorySlugsWithTools(groupedByCategory);
  const allTools = orderedCategorySlugs.flatMap((slug) => groupedByCategory[slug] ?? []);

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

  const proToolsHref = locale === "en" ? "/pro-tools" : `/${locale}/pro-tools`;

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <section className="sc-pro-section sc-pro-section--border">
        <CatalogPageShell
          tools={allTools}
          sectors={taxonomySectorCards}
          title={tPage("title")}
          subtitle={tPage("subtitle")}
          searchPlaceholder={tPage("searchPlaceholder")}
          categoryTitle={tPage("categoryTitle")}
          proToolsHref={proToolsHref}
        />
      </section>
    </PageLayout>
  );
}
