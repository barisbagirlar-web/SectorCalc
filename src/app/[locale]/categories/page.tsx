import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageHero } from "@/components/catalog/CatalogPageHero";
import { SectorCatalogExplorer } from "@/components/catalog/SectorCatalogExplorer";
import { Container } from "@/components/ui/Container";
import { FREE_TOOLS } from "@/data/tools";
import { buildSectorToolCatalogGroups } from "@/lib/catalog/build-catalog-groups";
import { buildCategoryPageCatalogGroups } from "@/lib/premium-schema/premium-schema-catalog";
import { createPageMetadata } from "@/lib/metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata({
    title: "Calculator Categories",
    description:
      "Browse SectorCalc tools by function: OEE, scrap, routing, calibration, energy, margin and more.",
    path: "/categories",
  });
}

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CategoriesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("catalogExplorer");
  const groups = buildCategoryPageCatalogGroups(buildSectorToolCatalogGroups(FREE_TOOLS), locale);

  return (
    <PageLayout>
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
