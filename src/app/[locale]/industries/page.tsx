import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageHero } from "@/components/catalog/CatalogPageHero";
import { SectorCatalogExplorer } from "@/components/catalog/SectorCatalogExplorer";
import { Container } from "@/components/ui/Container";
import { CrawlIndexLinkList } from "@/components/seo/CrawlIndexLinkList";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCachedIndustryCatalogGroups } from "@/lib/catalog/cached-catalog-groups";
import { INDUSTRIES } from "@/data/industries";
import { createPageMetadata } from "@/lib/metadata";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/seo/schema-mesh";
import { buildCoreHubCrawlGroups, buildFreeToolsCrawlGroups, buildSeoHubCrawlGroups } from "@/lib/seo/crawl-index";
import type { IndustryCategory } from "@/lib/tools/industry-registry";
import type { AppLocale } from "@/i18n/routing";

const DEFAULT_INDUSTRY_CATEGORY: IndustryCategory = "heavy-industry";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 3600;
export const dynamic = "force-static";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalogExplorer" });
  return createPageMetadata({
    title: t("industries.metaTitle"),
    description: t("industries.metaDescription"),
    path: "/industries",
    locale: locale as AppLocale,
  });
}

export default async function IndustriesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("catalogExplorer");
  const industryGroups = getCachedIndustryCatalogGroups(locale);
  const jsonLd = [
    buildBreadcrumbJsonLd(
      [
        { name: "Home", path: "/" },
        { name: "Industries", path: "/industries" },
      ],
      locale
    ),
    buildItemListJsonLd(
      INDUSTRIES.map((industry) => ({
        name: industry.name,
        path: `/industries/${industry.slug}`,
      })),
      "Industry tool packs",
      locale
    ),
  ];

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <CatalogPageHero
        title={t("industries.title")}
        subtitle={t("industries.subtitle")}
      />

      <section className="sc-pro-section sc-pro-section--border">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <SectorCatalogExplorer
            groups={industryGroups}
            variant="industries"
            defaultGroupId={DEFAULT_INDUSTRY_CATEGORY}
          />
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--border">
        <Container className="sc-pro-container">
          <CrawlIndexLinkList
            groups={[
              ...buildCoreHubCrawlGroups(),
              ...buildFreeToolsCrawlGroups(),
              ...buildSeoHubCrawlGroups(),
            ]}
          />
        </Container>
      </section>
    </PageLayout>
  );
}
