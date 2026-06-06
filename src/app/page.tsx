import type { Metadata } from "next";
import { Suspense } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { HeroSection } from "@/components/sections/HeroSection";
import {
  HomeFreeCheckSection,
  HomeFreeVsProSection,
  HomePainSection,
  HomeSampleVerdictSection,
  HomeTrustSection,
} from "@/components/sections/HomeConversionSections";
import { CTASection } from "@/components/sections/CTASection";
import { PricingPreview } from "@/components/sections/PricingPreview";
import SectorSelectorSection from "@/components/home/SectorSelectorSection";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Stop pricing work that loses money",
  description:
    "Calculate costs, detect losses, and optimize operations across 18 sectors. Free calculators and premium verdict reports without ERP complexity.",
  path: "/",
});

export default function HomePage() {
  return (
    <PageLayout headerTheme="light">
      <section id="sector-calc-platform">
        <div className="row">
          <div className="col-xs-12">
            <div id="sector-product">
              <HeroSection />
              <HomePainSection />
              <HomeFreeCheckSection />
              <HomeSampleVerdictSection />
              <SectorSelectorSection />
              <HomeFreeVsProSection />
              <Suspense fallback={null}>
                <PricingPreview />
              </Suspense>
              <HomeTrustSection />
              <CTASection
                eyebrow="Margin decision platform"
                title="Protect your margin before you send the quote"
                subtitle="Start with a free sector check, then unlock premium verdict analyzers when the decision affects real money."
                primaryLabel="Run a Free Margin Check"
                primaryHref="/free-tools"
                secondaryLabel="View Sample Verdict Report"
                secondaryHref="/reports/sample-decision-report"
              />
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
