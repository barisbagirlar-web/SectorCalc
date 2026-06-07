import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageHero } from "@/components/catalog/CatalogPageHero";
import { SectorCatalogExplorer } from "@/components/catalog/SectorCatalogExplorer";
import { Container } from "@/components/ui/Container";
import { buildIndustryCatalogGroups } from "@/lib/catalog/build-catalog-groups";
import { INDUSTRIES } from "@/data/industries";
import { createPageMetadata } from "@/lib/metadata";
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

export default async function IndustriesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("catalogExplorer");
  const industryGroups = buildIndustryCatalogGroups();

  return (
    <PageLayout>
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
            <Link href={getPremiumToolsHref()} className="sc-cta-primary">
              Browse premium analyzers
            </Link>
            <Link href="/free-tools" className="sc-cta-secondary">
              Browse free calculators
            </Link>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
