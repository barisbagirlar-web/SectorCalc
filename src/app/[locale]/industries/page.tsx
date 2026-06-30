export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageShell } from "@/components/catalog/CatalogPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { buildItemListJsonLd } from "@/lib/infrastructure/seo/schema-mesh";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/infrastructure/seo/localized-breadcrumbs";
import { getAllTools } from "@/lib/features/tools/all-tools-data";
import {
  buildTaxonomySectorCards,
  withTaxonomyCountLabels,
} from "@/lib/features/tools/build-taxonomy-sector-cards";
import { CATALOG_HUB_JSONLD_MAX_ITEMS } from "@/lib/features/tools/filter-catalog-hub-tools";
import type { AppLocale } from "@/i18n/routing";
import {
  getAllToolsGroupedByCategory,
  getOrderedCategorySlugsWithTools,
} from "@/lib/features/tools/getToolsByCategory";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 3600;

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
  const tPage = await getTranslations({ locale, namespace: "freeTools" });
  const tools = getAllTools(locale);
  const taxonomySectorCards = withTaxonomyCountLabels(
    buildTaxonomySectorCards(tools, locale, {
      allLabel: tCatalog("labels.industries.allLabel"),
    }),
    (count) => tCatalog("labels.industries.countLabel", { count }),
  );

  // Flat tool list from grouped categories
  const groupedByCategory = getAllToolsGroupedByCategory(locale);
  const orderedCategorySlugs = getOrderedCategorySlugsWithTools(groupedByCategory);
  const allTools = orderedCategorySlugs.flatMap((slug) => groupedByCategory[slug] ?? []);

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
        <CatalogPageShell
          tools={allTools}
          sectors={taxonomySectorCards}
          title={t("title")}
          subtitle={t("subtitle")}
          searchPlaceholder={t("searchPlaceholder")}
          categoryTitle={t("categoryTitle")}
          freeToolsHref={locale === "en" ? "/free-tools" : `/${locale}/free-tools`}
          proToolsHref={locale === "en" ? "/pro-tools" : `/${locale}/pro-tools`}
        />
      </section>
    </PageLayout>
  );
}
