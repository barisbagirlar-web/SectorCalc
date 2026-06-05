import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { HeroSection } from "@/components/sections/HeroSection";
import { PlatformIntroSection } from "@/components/sections/PlatformIntroSection";
import SectorSelectorSection from "@/components/home/SectorSelectorSection";
import { PlatformPillarsSection } from "@/components/sections/PlatformPillarsSection";
import { MagiClickSplitSection } from "@/components/sections/MagiClickSplitSection";
import { PlatformCapabilitiesSection } from "@/components/sections/PlatformCapabilitiesSection";
import { createPageMetadata } from "@/lib/metadata";

/**
 * Homepage mirrors MagiClick product page architecture:
 * first-tab → third-tab → fourth-tab → fifth-tab → sixth-tab → eigth-tab → ninth-tab
 * @see https://www.magiclick.com/products/true-omnichannel-banking-platform.aspx
 */
export const metadata: Metadata = createPageMetadata({
  title: "Stop pricing work that loses money",
  description:
    "Sector-specific cost and risk reports for manufacturing, small industry and service businesses — without expensive ERP or consulting overhead.",
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
              <PlatformIntroSection />
              <SectorSelectorSection />
              <PlatformPillarsSection />
              <MagiClickSplitSection
                tabClass="fifth-tab"
                imageClass="fifth-tab-image"
                layout="7-5"
                title="Calculation Engine"
                paragraphs={[
                  "Reusable, validated tool definitions and transparent formulas across sectors — one engine powers free estimators and premium analyzers so outputs stay consistent from quick numbers to decision reports.",
                  "Construction, Cleaning, Restaurant, E-commerce and CNC & Manufacturing each connect to the same calculation architecture, reducing rework when teams move from estimate to premium analysis.",
                ]}
                visual="report"
              />
              <MagiClickSplitSection
                tabClass="sixth-tab"
                imageClass="sixth-tab-image"
                layout="7-5"
                title="Decision Report Layer"
                paragraphs={[
                  "Premium tools package executive summaries, key findings, scenario analysis, risk levels and recommendations — so stakeholders see a decision-ready narrative, not just calculator output.",
                  "Report structure is live in the MVP with export preview states. Payment and file export unlock in a future release; you can request premium access through lead intent today.",
                ]}
                visual="validation"
              />
              <MagiClickSplitSection
                tabClass="eigth-tab"
                imageClass="eigth-tab-image"
                layout="8-4"
                title="Sector Expansion Model"
                paragraphs={[
                  "Construction, Cleaning, Restaurant, E-commerce and CNC & Manufacturing are live now. Each sector pairs a free quick estimator with a premium decision analyzer on the same engine.",
                  "Additional industries can be added through the same tool-definition and report layer — without rebuilding the platform from scratch.",
                ]}
                visual="scenario"
              />
              <PlatformCapabilitiesSection />
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
