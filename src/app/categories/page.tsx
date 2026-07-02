export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageHero } from "@/components/catalog/CatalogPageHero";
import { SectorCatalogExplorer } from "@/components/catalog/SectorCatalogExplorer";
import { Container } from "@/components/ui/Container";
import { getCachedCategoryPageCatalogGroups } from "@/lib/catalog/cached-catalog-groups";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/infrastructure/seo/schema-mesh";
import type { AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "categoriesPage" });
  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/categories",
    locale: locale as AppLocale,
  });
}

export const revalidate = 3600;

export default async function CategoriesPage({ params }: PageProps) {
  const locale = "en";
  setRequestLocale(locale);
  const t = await getTranslations("catalogExplorer");
  const tPage = await getTranslations("categoriesPage");
  const groups = getCachedCategoryPageCatalogGroups(locale);
  const jsonLd = [
    buildBreadcrumbJsonLd(
      [
        { name: tPage("breadcrumbHome"), path: "/" },
        { name: tPage("breadcrumbCategories"), path: "/categories" },
      ],
      locale
    ),
    buildItemListJsonLd(
      groups.flatMap((group) =>
        group.items.map((item) => ({ name: item.title, path: item.href }))
      ),
      tPage("itemListName"),
      locale
    ),
  ];

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <CatalogPageHero
        eyebrow={t("categories.eyebrow")}
        title={t("categories.title")}
        subtitle={t("categories.subtitle")}
      />

      <section className="sc-pro-section sc-pro-section--border">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <SectorCatalogExplorer groups={groups} variant="categories" />
        </Container>
      </section>
    </PageLayout>
  );
}
