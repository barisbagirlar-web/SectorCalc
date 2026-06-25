import { getTranslations } from "next-intl/server";
// @ts-nocheck
import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageHero } from "@/components/catalog/CatalogPageHero";
import { SectorCatalogExplorer } from "@/components/catalog/SectorCatalogExplorer";
import { Container } from "@/components/ui/Container";
import { CrawlIndexLinkList } from "@/components/seo/CrawlIndexLinkList";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCachedIndustryCatalogGroups } from "@/lib/catalog/cached-catalog-groups";
import { createPageMetadata } from "@/lib/metadata";
import { buildItemListJsonLd } from "@/lib/seo/schema-mesh";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/seo/localized-breadcrumbs";
import { buildCoreHubCrawlGroups, buildFreeToolsCrawlGroups, buildSeoHubCrawlGroups } from "@/lib/seo/crawl-index";
import { shouldRenderCrawlIndexForLocale } from "@/lib/i18n/catalog-labels-i18n";
import type { IndustryCategory } from "@/lib/tools/industry-registry";

const DEFAULT_INDUSTRY_CATEGORY: IndustryCategory = "heavy-industry";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 3600;
export const dynamic = "force-static";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations();
  return createPageMetadata({
    title: "industries.metaTitle",
    description: "industries.metaDescription",
    path: "/industries",
    locale: locale as "en",
  });
}

export default async function IndustriesPage({ params }: PageProps) {
  const locale = "en";
  
  const t = await getTranslations();
  const industryGroups = getCachedIndustryCatalogGroups(locale);
  const jsonLd = [
    await buildLocalizedBreadcrumbJsonLd(
      [
        { key: "home", path: "/" },
        { key: "industries", path: "/industries" },
      ],
      locale
    ),
    buildItemListJsonLd(
      industryGroups.flatMap((group) =>
        group.items.map((item) => ({
          name: item.title,
          path: item.href,
        }))
      ),
      "industries.title",
      locale
    ),
  ];

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <CatalogPageHero
        title={"industries.title"}
        subtitle={"industries.subtitle"}
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

      {shouldRenderCrawlIndexForLocale(locale) ? (
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
      ) : null}
    </PageLayout>
  );
}
