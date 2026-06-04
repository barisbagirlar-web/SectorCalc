import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
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
      <div id="sector-product">
        <PageHero
          eyebrow="Industries"
          title="Industry-specific tools for cost, margin, capacity and pricing decisions"
          subtitle="Each sector includes a quick estimator and a premium analyzer. Start with a number, then move into a decision report when the outcome affects profit or risk."
        />
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
