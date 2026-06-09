import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageHero } from "@/components/catalog/CatalogPageHero";
import { SectorCatalogExplorer } from "@/components/catalog/SectorCatalogExplorer";
import { DecisionToolLegalDisclaimer } from "@/components/tools/DecisionToolLegalDisclaimer";
import { Container } from "@/components/ui/Container";
import { CrawlIndexLinkList } from "@/components/seo/CrawlIndexLinkList";
import { FeaturedAnswerBlock } from "@/components/seo/FeaturedAnswerBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import {
  DEFAULT_PREMIUM_SCHEMA_CATALOG_GROUP,
  getPremiumSchemaCatalogItems,
} from "@/lib/premium-schema/premium-schema-catalog";
import { getCachedPremiumSchemaCatalogGroups } from "@/lib/catalog/cached-catalog-groups";
import { buildPremiumToolsCrawlGroups, buildCoreHubCrawlGroups, buildSeoHubCrawlGroups } from "@/lib/seo/crawl-index";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/seo/schema-mesh";
import { getFreeToolsHref, getPricingHref, getSampleReportHref } from "@/lib/tools/tool-links";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Hidden-Loss Analyzers and Decision Reports | SectorCalc",
  description:
    "Explore premium analyzers for scrap, OEE, route, energy, carbon, margin, calibration and benchmark decisions.",
  path: "/premium-tools",
});

const VERDICT_EXAMPLES = [
  {
    verdict: "High risk — hidden cost may erase the margin",
    context: "Quoted price sits below buffered exposure floor.",
  },
  {
    verdict: "Reprice before accepting this job",
    context: "Setup overrun and scrap drivers push cost above quote.",
  },
  {
    verdict: "Current inputs are inside the acceptable range",
    context: "Loss buffers hold at your target margin band.",
  },
  {
    verdict: "Energy and delay exposure are the main risk drivers",
    context: "Peak load and schedule slip dominate the sensitivity check.",
  },
] as const;

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 3600;
export const dynamic = "force-static";

export default async function PremiumToolsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("catalogExplorer");
  const premiumGroups = getCachedPremiumSchemaCatalogGroups(locale);
  const catalogItems = getPremiumSchemaCatalogItems(locale);
  const jsonLd = [
    buildBreadcrumbJsonLd(
      [
        { name: "Home", path: "/" },
        { name: "Premium tools", path: "/premium-tools" },
      ],
      locale
    ),
    buildItemListJsonLd(
      catalogItems.map((item) => ({
        name: item.title,
        path: item.href.replace(/^\/[a-z]{2}\//, "/"),
      })),
      "Premium decision analyzers",
      locale
    ),
  ];

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <CatalogPageHero
        eyebrow={t("premiumTools.eyebrow")}
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

      <section className="sc-pro-section sc-pro-section--alt sc-pro-section--border">
        <Container className="sc-pro-container">
          <FeaturedAnswerBlock
            question="What is a premium decision report on SectorCalc?"
            answer="A premium decision report starts from your operational inputs, surfaces hidden-loss drivers, compares warning and critical thresholds, suggests practical actions and can be exported for management review when you have full report access."
            bullets={[
              "27 analyzers across manufacturing, logistics, energy and more",
              "Threshold checks and suggested action plans",
              "Export-ready PDF and CSV on paid plans",
            ]}
          />
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--alt sc-pro-section--border">
        <Container className="sc-pro-container">
          <h2 className="sc-pro-headline text-xl">Verdict examples</h2>
          <p className="sc-pro-lead text-sm">
            Plain-language outputs — no formula dumps, no jargon.
          </p>
          <div className="sc-craft-grid sc-craft-grid--2 mt-5">
            {VERDICT_EXAMPLES.map((item) => (
              <article
                key={item.verdict}
                className="sc-ledger-card sc-industrial-panel sc-ledger-letterpress p-4"
              >
                <p
                  className={`text-sm font-bold ${
                    item.verdict.includes("High risk")
                      ? "text-crit-red"
                      : item.verdict.includes("acceptable")
                        ? "text-safe-green"
                        : "text-premium-velvet"
                  }`}
                >
                  {item.verdict}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-body-charcoal">{item.context}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="sc-pro-section">
        <Container className="sc-pro-container">
          <div className="sc-decision-block">
            <h2 className="sc-pro-headline text-lg">Open a decision report</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-body-charcoal">
              Pick an analyzer above, or review a sample verdict before you commit.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href={getSampleReportHref()} prefetch={false} className="sc-cta-primary">
                View sample report
              </Link>
              <Link href={getPricingHref()} prefetch={false} className="sc-cta-secondary">
                View pricing
              </Link>
              <Link href={getFreeToolsHref()} prefetch={false} className="sc-cta-secondary">
                Browse free tools
              </Link>
            </div>
            <div className="mt-6">
              <DecisionToolLegalDisclaimer variant="paid" />
            </div>
          </div>
        </Container>
      </section>

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
    </PageLayout>
  );
}
