import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { IndustryCatalogCard } from "@/components/industries/IndustryCatalogCard";
import { Container } from "@/components/ui/Container";
import { FEATURED_INDUSTRY_SLUGS, getAllIndustryCategories, getIndustriesByCategory, INDUSTRY_CATEGORY_LABELS } from "@/lib/tools/industry-registry";
import { getIndustryBySlug } from "@/data/industries";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Industries",
  description:
    "Seventeen active industry packs with free cost calculators and premium margin analyzers for pricing and bid decisions.",
  path: "/industries",
});

export default function IndustriesPage() {
  const featured = FEATURED_INDUSTRY_SLUGS.map((slug) => getIndustryBySlug(slug)).filter(
    (industry): industry is NonNullable<typeof industry> => industry !== undefined
  );

  return (
    <PageLayout headerTheme="light">
      <section className="border-b border-slate/10 bg-off-white py-10 sm:py-12">
        <Container>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-professional-blue">
            Industries
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-deep-navy sm:text-4xl">
            Choose your sector
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate">
            Seventeen active sectors with free quick checks and premium analyzers for safe price,
            bid risk and margin decisions.
          </p>
        </Container>
      </section>

      <section className="border-b border-slate/10 bg-white py-10 sm:py-12">
        <Container>
          <h2 className="text-xl font-bold text-deep-navy">Featured sectors</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((industry) => (
              <IndustryCatalogCard key={industry.slug} industry={industry} featured />
            ))}
          </div>
        </Container>
      </section>

      {getAllIndustryCategories().map((category) => {
        const entries = getIndustriesByCategory(category);
        const industries = entries
          .map((entry) => getIndustryBySlug(entry.slug))
          .filter((industry): industry is NonNullable<typeof industry> => industry !== undefined);

        return (
          <section
            key={category}
            className="border-b border-slate/10 bg-off-white py-10 sm:py-12 even:bg-white"
          >
            <Container>
              <h2 className="text-xl font-bold text-deep-navy">
                {INDUSTRY_CATEGORY_LABELS[category]}
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {industries.map((industry) => (
                  <IndustryCatalogCard key={industry.slug} industry={industry} />
                ))}
              </div>
            </Container>
          </section>
        );
      })}

      <section className="bg-off-white py-8">
        <Container>
          <Link
            href="/pricing"
            className="text-sm font-semibold text-professional-blue hover:underline"
          >
            View SectorCalc Pro pricing →
          </Link>
        </Container>
      </section>
    </PageLayout>
  );
}
