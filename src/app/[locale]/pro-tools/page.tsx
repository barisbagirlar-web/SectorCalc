export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageShell } from "@/components/catalog/CatalogPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { getPremiumTools } from "@/lib/features/tools/all-tools-data";
import {
  buildTaxonomySectorCards,
  withTaxonomyCountLabels,
} from "@/lib/features/tools/build-taxonomy-sector-cards";
import {
  getAllToolsGroupedByCategory,
  getOrderedCategorySlugsWithTools,
} from "@/lib/features/tools/getToolsByCategory";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/infrastructure/seo/localized-breadcrumbs";
import { buildItemListJsonLd } from "@/lib/infrastructure/seo/schema-mesh";
import type { AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 3600;

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

  // Flat tool list from grouped categories
  const groupedByCategory = getAllToolsGroupedByCategory(locale, true);
  const orderedCategorySlugs = getOrderedCategorySlugsWithTools(groupedByCategory);
  const allTools = orderedCategorySlugs.flatMap((slug) => groupedByCategory[slug] ?? []);

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

  const freeToolsHref = locale === "en" ? "/free-tools" : `/${locale}/free-tools`;

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
          freeToolsHref={freeToolsHref}
        />
      </section>
    </PageLayout>
  );
}
