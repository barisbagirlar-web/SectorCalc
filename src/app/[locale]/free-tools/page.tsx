import type { Metadata } from "next";
import { Suspense } from "react";
import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageHero } from "@/components/catalog/CatalogPageHero";
import { SectorCatalogExplorer } from "@/components/catalog/SectorCatalogExplorer";
import { Container } from "@/components/ui/Container";
import {
  DEFAULT_FREE_TRAFFIC_CATEGORY,
  getCachedFreeTrafficCatalogGroups,
} from "@/lib/catalog/cached-catalog-groups";
import type { FreeTrafficCategoryMeta } from "@/lib/tools/free-traffic-categories";
import { CrawlIndexLinkList } from "@/components/seo/CrawlIndexLinkList";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildItemListJsonLd } from "@/lib/seo/schema-mesh";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/seo/localized-breadcrumbs";
import { buildFreeToolsCrawlGroups, buildCoreHubCrawlGroups } from "@/lib/seo/crawl-index";
import { shouldRenderCrawlIndexForLocale } from "@/lib/i18n/catalog-labels-i18n";
import { createPageMetadata } from "@/lib/metadata";
import { getPremiumToolsHref } from "@/lib/tools/tool-links";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export const revalidate = 3600;
export const dynamic = "force-static";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("freeTrafficCatalog");
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/free-tools",
    locale: locale as AppLocale,
  });
}

export default async function FreeToolsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tCatalog = await getTranslations("catalogExplorer");
  const t = await getTranslations("freeTrafficCatalog");

  const groups = getCachedFreeTrafficCatalogGroups(
    locale,
    (meta: FreeTrafficCategoryMeta) => ({
      label: t(meta.labelKey),
      description: t(meta.descriptionKey),
    }),
    t("decisionAnalyzerNote"),
    t("openCalculator")
  );

  const jsonLd = [
    await buildLocalizedBreadcrumbJsonLd(
      [
        { key: "home", path: "/" },
        { key: "freeTools", path: "/free-tools" },
      ],
      locale
    ),
    buildItemListJsonLd(
      groups.flatMap((group) =>
        group.items.map((item) => ({
          name: item.title,
          path: item.href,
        }))
      ),
      tCatalog("freeTools.title"),
      locale
    ),
  ];

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <CatalogPageHero
        title={tCatalog("freeTools.title")}
        subtitle={tCatalog("freeTools.subtitle")}
      />

      <section className="sc-pro-section sc-pro-section--border">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <Suspense fallback={<div className="min-h-[12rem]" aria-hidden="true" />}>
            <SectorCatalogExplorer
              groups={groups}
              variant="free-tools"
              defaultGroupId={DEFAULT_FREE_TRAFFIC_CATEGORY}
            />
          </Suspense>
          <div className="sc-discovery-footer">
            <p className="sc-discovery-footer__lead">{tCatalog("discoveryFooter.freeToolsLead")}</p>
            <Link href={getPremiumToolsHref()} prefetch={false} className="sc-discovery-footer__link">
              {tCatalog("discoveryFooter.freeToolsCta")}
            </Link>
          </div>
        </Container>
      </section>

      {shouldRenderCrawlIndexForLocale(locale) ? (
        <section className="sc-pro-section sc-pro-section--border">
          <Container className="sc-pro-container">
            <CrawlIndexLinkList
              groups={[...buildCoreHubCrawlGroups(), ...buildFreeToolsCrawlGroups()]}
            />
          </Container>
        </section>
      ) : null}
    </PageLayout>
  );
}
