export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "@/lib/i18n-stub";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageShell } from "@/components/catalog/CatalogPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildItemListJsonLd } from "@/lib/infrastructure/seo/schema-mesh";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/infrastructure/seo/localized-breadcrumbs";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { getFreeTools } from "@/lib/features/tools/all-tools-data";
import {
  buildTaxonomySectorCards,
  withTaxonomyCountLabels,
} from "@/lib/features/tools/build-taxonomy-sector-cards";
import { CATALOG_HUB_JSONLD_MAX_ITEMS } from "@/lib/features/tools/filter-catalog-hub-tools";
import {
  getAllToolsGroupedByCategory,
  getOrderedCategorySlugsWithTools,
} from "@/lib/features/tools/getToolsByCategory";

type PageProps = {
  params: Promise<{  }>;
};

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "freeTools" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/free-tools",
    locale: locale as AppLocale,
  });
}

export default async function FreeToolsPage({ params }: PageProps) {
  const locale = "en";
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
