import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { IndustriesOmniHub } from "@/components/industries/IndustriesOmniHub";
import { Container } from "@/components/ui/Container";
import { buildIndustryCatalogGroups } from "@/lib/catalog/build-catalog-groups";
import { INDUSTRIES } from "@/data/industries";
import { createPageMetadata } from "@/lib/metadata";
import { getPremiumToolsHref, getPricingHref } from "@/lib/tools/tool-links";

const SECTOR_COUNT = INDUSTRIES.length;

export const metadata: Metadata = createPageMetadata({
  title: "Industry Tools — Free Checks & Premium Reports",
  description: `${SECTOR_COUNT} industry packs with free calculators and premium loss decision reports.`,
  path: "/industries",
});

export default function IndustriesPage() {
  const industryGroups = buildIndustryCatalogGroups();

  return (
    <PageLayout>
      <section className="sc-pro-section sc-pro-section--border">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <IndustriesOmniHub groups={industryGroups} sectorCount={SECTOR_COUNT} />
        </Container>
      </section>

      <section className="sc-pro-section">
        <Container className="sc-pro-container">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={getPremiumToolsHref()} className="sc-cta-primary">
              Browse premium analyzers
            </Link>
            <Link href={getPricingHref()} className="sc-cta-secondary">
              View pricing
            </Link>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
