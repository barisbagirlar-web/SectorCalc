import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { PricingPlansGrid } from "@/components/sections/PricingPlansGrid";
import { Container } from "@/components/ui/Container";
import { ToolCard } from "@/components/cards/ToolCard";
import { PREMIUM_TOOLS } from "@/data/tools";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Pricing",
  description:
    "SectorCalc pricing: Free quick estimates, Single Report, Sector Pass and Pro for premium decision reports. Payment and export are not live in the MVP.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Pricing"
        title="Plans for sector tools and decision reports"
        subtitle="Free tools are for quick estimates. Single Report, Sector Pass and Pro are for premium decision reports — honest pricing with clear coming-soon labels until billing launches."
      />
      <section className="border-b border-amber/30 bg-amber/5 py-8">
        <Container size="narrow">
          <p className="text-center text-sm leading-relaxed text-deep-navy">
            <strong>Current MVP status:</strong> Payment and export are not live yet. You can
            request access to premium report flows and help shape the next release. All premium
            analyzers are runnable today; checkout and file export unlock later.
          </p>
        </Container>
      </section>
      <PricingPlansGrid showHeader={false} />
      <section className="border-t border-slate/10 bg-[#f4f6f8] py-16 md:py-20 lg:py-24">
        <Container size="wide">
          <h2 className="text-2xl font-bold text-deep-navy">Premium sector tools</h2>
          <p className="mt-2 max-w-2xl text-slate">
            Included with Single Report, Sector Pass and Pro when billing launches. Open any
            analyzer now; request access through pricing CTAs if you need premium report flows.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PREMIUM_TOOLS.map((tool) => (
              <div key={tool.slug} id={tool.slug}>
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
