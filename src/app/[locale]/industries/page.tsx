import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectorCatalogExplorer } from "@/components/catalog/SectorCatalogExplorer";
import { buildIndustryCardProps, type IndustryCardProps } from "@/components/industries/IndustryCard";
import { IndustriesGrid } from "@/components/industries/IndustriesGrid";
import { Container } from "@/components/ui/Container";
import { buildIndustryCatalogGroups } from "@/lib/catalog/build-catalog-groups";
import { FEATURED_INDUSTRY_SLUGS } from "@/lib/tools/industry-registry";
import { INDUSTRIES, getIndustryBySlug, type Industry } from "@/data/industries";
import { createPageMetadata } from "@/lib/metadata";
import { getPremiumToolsHref, getPricingHref } from "@/lib/tools/tool-links";

const SECTOR_COUNT = INDUSTRIES.length;

export const metadata: Metadata = createPageMetadata({
  title: "Industry Tools — Free Checks & Premium Reports",
  description: `${SECTOR_COUNT} industry packs with free calculators and premium loss decision reports.`,
  path: "/industries",
});

function resolveIndustryCards(
  industries: Industry[],
  featured = false
): IndustryCardProps[] {
  return industries
    .map((industry) => buildIndustryCardProps(industry, { featured }))
    .filter((item): item is IndustryCardProps => item !== null);
}

export default function IndustriesPage() {
  const featured = FEATURED_INDUSTRY_SLUGS.map((slug) => getIndustryBySlug(slug)).filter(
    (industry): industry is Industry => industry !== undefined
  );
  const featuredCards = resolveIndustryCards(featured, true);
  const industryGroups = buildIndustryCatalogGroups();

  return (
    <PageLayout>
      <section className="sc-pro-section sc-pro-section--alt sc-pro-section--border">
        <Container className="sc-pro-container">
          <p className="sc-craft-eyebrow">Industry packs</p>
          <h1 className="sc-craft-headline">Where loss starts in your sector</h1>
          <p className="sc-craft-lead">
            Start with a free quick check, then unlock premium loss and efficiency reports across{" "}
            {INDUSTRIES.length} active sectors.
          </p>
        </Container>
      </section>

      <section className="sc-craft-section sc-craft-section--border">
        <Container className="sc-craft-container">
          <h2 className="sc-craft-headline text-xl">Featured sectors</h2>
          <div className="mt-5">
            <IndustriesGrid items={featuredCards} />
          </div>
        </Container>
      </section>

      <section className="sc-craft-section sc-craft-section--border">
        <Container size="wide" className="sc-craft-container min-w-0">
          <h2 className="sc-craft-headline text-xl">Browse by sector group</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-body-charcoal">
            Pick your industry area first — free checks and premium analyzers open inside each
            sector.
          </p>
          <div className="mt-6">
            <SectorCatalogExplorer groups={industryGroups} variant="industries" />
          </div>
        </Container>
      </section>

      <section className="sc-craft-section">
        <Container className="sc-craft-container">
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
