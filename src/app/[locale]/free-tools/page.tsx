import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageHero } from "@/components/catalog/CatalogPageHero";
import { SectorCatalogExplorer } from "@/components/catalog/SectorCatalogExplorer";
import { FreeToolPrivacyNote } from "@/components/tools/FreeToolPrivacyNote";
import { Container } from "@/components/ui/Container";
import { IconListItem } from "@/components/icons/ScIcon";
import { UI_ICON } from "@/lib/icons/icon-registry";
import {
  buildFreeTrafficCatalogGroups,
  DEFAULT_FREE_TRAFFIC_CATEGORY,
} from "@/lib/catalog/build-catalog-groups";
import { FREE_TRAFFIC_TOOLS } from "@/lib/tools/free-traffic-catalog";
import type { FreeTrafficCategoryMeta } from "@/lib/tools/free-traffic-categories";
import { CrawlIndexLinkList } from "@/components/seo/CrawlIndexLinkList";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildItemListJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/schema-mesh";
import { buildFreeToolsCrawlGroups, buildCoreHubCrawlGroups } from "@/lib/seo/crawl-index";
import { createPageMetadata } from "@/lib/metadata";
import { getPremiumToolsHref } from "@/lib/tools/tool-links";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

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

  const groups = buildFreeTrafficCatalogGroups(
    FREE_TRAFFIC_TOOLS,
    (meta: FreeTrafficCategoryMeta) => ({
      label: t(meta.labelKey),
      description: t(meta.descriptionKey),
    }),
    t("decisionAnalyzerNote"),
    t("openCalculator")
  );

  const jsonLd = [
    buildBreadcrumbJsonLd(
      [
        { name: "Home", path: "/" },
        { name: "Free tools", path: "/free-tools" },
      ],
      locale
    ),
    buildItemListJsonLd(
      FREE_TRAFFIC_TOOLS.map((tool) => ({
        name: tool.title,
        path: `/tools/free/${tool.slug}`,
      })),
      "Free sector calculators",
      locale
    ),
  ];

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <CatalogPageHero
        eyebrow={tCatalog("freeTools.eyebrow")}
        title={tCatalog("freeTools.title")}
        subtitle={tCatalog("freeTools.subtitle")}
      />

      <section className="sc-pro-section sc-pro-section--border">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <SectorCatalogExplorer
            groups={groups}
            variant="free-tools"
            defaultGroupId={DEFAULT_FREE_TRAFFIC_CATEGORY}
          />
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--alt sc-pro-section--border">
        <Container className="sc-pro-container">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="sc-pro-panel sc-pro-letterpress p-5">
              <h2 className="sc-pro-title text-lg">{t("includesTitle")}</h2>
              <ul className="mt-4 space-y-2">
                {[t("includes1"), t("includes2"), t("includes3"), t("includes4")].map((item) => (
                  <IconListItem key={item} icon={UI_ICON.check} iconClassName="text-premium-velvet">
                    {item}
                  </IconListItem>
                ))}
              </ul>
            </div>
            <div className="sc-pro-panel sc-pro-letterpress p-5">
              <h2 className="sc-pro-title text-lg">{t("excludesTitle")}</h2>
              <ul className="mt-4 space-y-2">
                {[t("excludes1"), t("excludes2"), t("excludes3"), t("excludes4")].map((item) => (
                  <IconListItem key={item} icon={UI_ICON.exclude} iconClassName="text-body-charcoal">
                    {item}
                  </IconListItem>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <FreeToolPrivacyNote />
          </div>
        </Container>
      </section>

      <section className="sc-pro-section">
        <Container className="sc-pro-container">
          <div className="sc-decision-block">
            <h2 className="sc-pro-title text-lg">{t("premiumUpsellTitle")}</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-body-charcoal">
              {t("premiumUpsellBody")}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href={getPremiumToolsHref()} className="sc-cta-primary">
                {t("premiumUpsellCta")}
              </Link>
              <Link href="/industries" className="sc-cta-secondary">
                {t("premiumUpsellIndustries")}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--border">
        <Container className="sc-pro-container">
          <CrawlIndexLinkList groups={[...buildCoreHubCrawlGroups(), ...buildFreeToolsCrawlGroups()]} />
        </Container>
      </section>
    </PageLayout>
  );
}
