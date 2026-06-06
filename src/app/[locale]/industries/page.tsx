import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { buildIndustryCardProps, type IndustryCardProps } from "@/components/industries/IndustryCard";
import { IndustriesGrid } from "@/components/industries/IndustriesGrid";
import { Container } from "@/components/ui/Container";
import {
  FEATURED_INDUSTRY_SLUGS,
  getAllIndustryCategories,
  getIndustriesByCategory,
  INDUSTRY_CATEGORY_LABELS,
} from "@/lib/tools/industry-registry";
import { getIndustryBySlug, type Industry } from "@/data/industries";
import { createPageMetadata } from "@/lib/metadata";
import { getPremiumToolsHref, getPricingHref } from "@/lib/tools/tool-links";

export const metadata: Metadata = createPageMetadata({
  title: "Industry Cost and Margin Tools",
  description:
    "Seventeen active industry packs with free cost calculators and premium margin analyzers for pricing and bid decisions.",
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

  return (
    <PageLayout headerTheme="light">
      <section className="border-b border-slate/10 bg-off-white py-10 sm:py-12">
        <Container>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-professional-blue">
            Sector decision tools
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-deep-navy sm:text-4xl">
            Choose the sector where margin risk starts
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate">
            Start with a free quick check, then unlock premium analyzers for safe price, bid
            risk and margin leak decisions across seventeen active sectors.
          </p>
        </Container>
      </section>

      <section className="border-b border-slate/10 bg-white py-10 sm:py-12">
        <Container>
          <h2 className="text-xl font-bold text-deep-navy">Featured sectors</h2>
          <div className="mt-6">
            <IndustriesGrid items={featuredCards} />
          </div>
        </Container>
      </section>

      {getAllIndustryCategories().map((category) => {
        const entries = getIndustriesByCategory(category);
        const industries = entries
          .map((entry) => getIndustryBySlug(entry.slug))
          .filter((industry): industry is Industry => industry !== undefined);
        const cards = resolveIndustryCards(industries);

        return (
          <section
            key={category}
            className="border-b border-slate/10 bg-off-white py-10 sm:py-12 even:bg-white"
          >
            <Container>
              <h2 className="text-xl font-bold text-deep-navy">
                {INDUSTRY_CATEGORY_LABELS[category]}
              </h2>
              <div className="mt-6">
                <IndustriesGrid items={cards} />
              </div>
            </Container>
          </section>
        );
      })}

      <section className="bg-off-white py-8">
        <Container>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <Link
              href={getPremiumToolsHref()}
              className="text-sm font-semibold text-professional-blue hover:underline"
            >
              Browse premium analyzers →
            </Link>
            <Link
              href={getPricingHref()}
              className="text-sm font-semibold text-slate hover:text-professional-blue"
            >
              View SectorCalc Pro pricing →
            </Link>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
