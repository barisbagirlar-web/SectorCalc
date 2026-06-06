import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
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
import { ValuePropsSection } from "@/components/sections/ValuePropsSection";
import { PricingPreview } from "@/components/sections/PricingPreview";
import SectorSelectorSection from "@/components/home/SectorSelectorSection";
import { createPageMetadata } from "@/lib/metadata";
import { industryRegistry } from "@/lib/tools/industry-registry";

const SECTOR_COUNT = industryRegistry.length;

export const metadata: Metadata = createPageMetadata({
  title: "Sector-specific calculators and decision reports",
  description: `Calculate costs, detect losses, and optimize operations across ${SECTOR_COUNT} sectors. Free calculators and premium verdict reports without ERP complexity.`,
  path: "/",
});

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <PageLayout>
      <section id="sector-calc-platform">
        <div className="row">
          <div className="col-xs-12">
            <div id="sector-product">
              <HeroSection />
              <ValuePropsSection />
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
                eyebrow={t("cta.eyebrow")}
                title={t("cta.title")}
                subtitle={t("cta.subtitle")}
                primaryLabel={t("cta.primary")}
                primaryHref="/free-tools"
                secondaryLabel={t("cta.secondary")}
                secondaryHref="/reports/sample-decision-report"
              />
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
