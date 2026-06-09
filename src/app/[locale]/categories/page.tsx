import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageHero } from "@/components/catalog/CatalogPageHero";
import { SectorCatalogExplorer } from "@/components/catalog/SectorCatalogExplorer";
import { Container } from "@/components/ui/Container";
import { FREE_TOOLS } from "@/data/tools";
import { buildSectorToolCatalogGroups } from "@/lib/catalog/build-catalog-groups";
import { buildCategoryPageCatalogGroups } from "@/lib/premium-schema/premium-schema-catalog";
import { CrawlIndexLinkList } from "@/components/seo/CrawlIndexLinkList";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/seo/schema-mesh";
import { buildCoreHubCrawlGroups, buildFreeToolsCrawlGroups, buildPremiumToolsCrawlGroups } from "@/lib/seo/crawl-index";

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

export const revalidate = 3600;
export const dynamic = "force-static";

export default async function CategoriesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("catalogExplorer");
  const groups = buildCategoryPageCatalogGroups(buildSectorToolCatalogGroups(FREE_TOOLS), locale);
  const jsonLd = [
    buildBreadcrumbJsonLd(
      [
        { name: "Home", path: "/" },
        { name: "Categories", path: "/categories" },
      ],
      locale
    ),
    buildItemListJsonLd(
      groups.flatMap((group) =>
        group.items.map((item) => ({ name: item.title, path: item.href }))
      ),
      "Calculator categories",
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

      <section className="sc-pro-section sc-pro-section--border">
        <Container className="sc-pro-container">
          <CrawlIndexLinkList
            groups={[
              ...buildCoreHubCrawlGroups(),
              ...buildFreeToolsCrawlGroups(),
              ...buildPremiumToolsCrawlGroups(locale),
            ]}
          />
        </Container>
      </section>
    </PageLayout>
  );
}
