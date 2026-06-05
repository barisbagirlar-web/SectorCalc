import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import PageHero from "@/components/shared/PageHero";
import { IndustryCard } from "@/components/cards/IndustryCard";
import { INDUSTRIES } from "@/data/industries";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Industries",
  description:
    "Industry-specific tools for cost, margin, capacity and pricing decisions. Five live sectors, each with a free estimator and premium decision analyzer.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <PageLayout headerTheme="light">
      <PageHero
        eyebrow="Industries"
        title="Choose the sector you want to analyze"
        description="Start with free tools for quick estimates, then use premium reports when pricing, margin or risk needs a clearer decision."
      />
      <div id="sector-product">
        <section className="fourth-tab">
          <div className="container">
            <div className="row mc-industry-grid">
              {INDUSTRIES.map((industry) => (
                <IndustryCard key={industry.slug} industry={industry} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
