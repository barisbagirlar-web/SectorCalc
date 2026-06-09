import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageHero } from "@/components/catalog/CatalogPageHero";
import { SectorCatalogExplorer } from "@/components/catalog/SectorCatalogExplorer";
import { Container } from "@/components/ui/Container";
import { CrawlIndexLinkList } from "@/components/seo/CrawlIndexLinkList";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildIndustryCatalogGroups } from "@/lib/catalog/build-catalog-groups";
import { INDUSTRIES } from "@/data/industries";
import { createPageMetadata } from "@/lib/metadata";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/seo/schema-mesh";
import { buildCoreHubCrawlGroups, buildFreeToolsCrawlGroups, buildSeoHubCrawlGroups } from "@/lib/seo/crawl-index";
import { getPremiumToolsHref } from "@/lib/tools/tool-links";
import type { IndustryCategory } from "@/lib/tools/industry-registry";

const SECTOR_COUNT = INDUSTRIES.length;
const DEFAULT_INDUSTRY_CATEGORY: IndustryCategory = "heavy-industry";

export const metadata: Metadata = createPageMetadata({
  title: "Industry Tools — Free Checks & Premium Reports",
  description: `${SECTOR_COUNT} industry packs with free calculators and premium loss decision reports.`,
  path: "/industries",
});

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 3600;
export const dynamic = "force-static";

export default async function IndustriesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("catalogExplorer");
  const industryGroups = buildIndustryCatalogGroups(locale);
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
        eyebrow={t("industries.eyebrow")}
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

      <section className="sc-pro-section">
        <Container className="sc-pro-container">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={getPremiumToolsHref()} prefetch={false} className="sc-cta-primary">
              Browse premium analyzers
            </Link>
            <Link href="/free-tools" prefetch={false} className="sc-cta-secondary">
              Browse free calculators
            </Link>
          </div>
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
