import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageHero } from "@/components/catalog/CatalogPageHero";
import { SectorCatalogExplorer } from "@/components/catalog/SectorCatalogExplorer";
import { StrategicPremiumRoadmapPanel } from "@/components/premium/StrategicPremiumRoadmapPanel";
import { Container } from "@/components/ui/Container";
import { CrawlIndexLinkList } from "@/components/seo/CrawlIndexLinkList";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import {
  DEFAULT_PREMIUM_SCHEMA_CATALOG_GROUP,
  getPremiumSchemaCatalogItems,
} from "@/lib/premium-schema/premium-schema-catalog";
import { getCachedPremiumSchemaCatalogGroups } from "@/lib/catalog/cached-catalog-groups";
import { buildStrategicPremiumRoadmapCards } from "@/lib/catalog/strategic-premium-roadmap";
import type { Locale } from "@/data/strategic-premium-calculators";
import { buildItemListJsonLd } from "@/lib/seo/schema-mesh";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/seo/localized-breadcrumbs";
import { buildPremiumToolsCrawlGroups, buildCoreHubCrawlGroups, buildSeoHubCrawlGroups } from "@/lib/seo/crawl-index";
import { shouldRenderCrawlIndexForLocale } from "@/lib/i18n/catalog-labels-i18n";
import type { AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 3600;
export const dynamic = "force-static";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalogExplorer" });
  return createPageMetadata({
    title: t("premiumTools.metaTitle"),
    description: t("premiumTools.metaDescription"),
    path: "/premium-tools",
    locale: locale as AppLocale,
  });
}

export default async function PremiumToolsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("catalogExplorer");
  const premiumGroups = getCachedPremiumSchemaCatalogGroups(locale);
  const catalogItems = getPremiumSchemaCatalogItems(locale);
  const roadmapItems = buildStrategicPremiumRoadmapCards(locale as Locale);
  const jsonLd = [
    await buildLocalizedBreadcrumbJsonLd(
      [
        { key: "home", path: "/" },
        { key: "premiumTools", path: "/premium-tools" },
      ],
      locale
    ),
    buildItemListJsonLd(
      catalogItems.map((item) => ({
        name: item.title,
        path: item.href.replace(/^\/[a-z]{2}\//, "/"),
      })),
      t("premiumTools.title"),
      locale
    ),
  ];

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <CatalogPageHero
        title={t("premiumTools.title")}
        subtitle={t("premiumTools.subtitle")}
      />

      <section className="sc-pro-section sc-pro-section--border">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <SectorCatalogExplorer
            groups={premiumGroups}
            variant="premium-tools"
            defaultGroupId={DEFAULT_PREMIUM_SCHEMA_CATALOG_GROUP}
          />
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--border sc-pro-section--alt">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <StrategicPremiumRoadmapPanel items={roadmapItems} />
        </Container>
      </section>

      {shouldRenderCrawlIndexForLocale(locale) ? (
        <section className="sc-pro-section sc-pro-section--border">
          <Container className="sc-pro-container">
            <CrawlIndexLinkList
              groups={[
                ...buildCoreHubCrawlGroups(),
                ...buildPremiumToolsCrawlGroups(locale),
                ...buildSeoHubCrawlGroups(),
              ]}
            />
          </Container>
        </section>
      ) : null}
    </PageLayout>
  );
}
