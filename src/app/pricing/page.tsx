import type { Metadata } from "next";
import { Suspense } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import PageHero from "@/components/shared/PageHero";
import { PricingToolUnlockBanner } from "@/components/billing/PricingToolUnlockBanner";
import { PricingSubscribedBanner } from "@/components/billing/SubscriptionActivationBanner";
import { PricingPlansGrid } from "@/components/sections/PricingPlansGrid";
import { Container } from "@/components/ui/Container";
import { ToolsTileGrid } from "@/components/tools/ToolsTileGrid";
import { PREMIUM_TOOLS } from "@/data/tools";
import { PRICING_PRO_TAGLINE } from "@/data/pricing-plans";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Pricing",
  description:
    "SectorCalc Pro — $29/month. Unlock sector-specific decision tools for pricing, cost and margin risk.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <PageLayout>
      <Suspense fallback={null}>
        <PricingSubscribedBanner />
      </Suspense>
      <Suspense fallback={null}>
        <PricingToolUnlockBanner />
      </Suspense>
      <PageHero
        eyebrow="Pricing"
        title="SectorCalc Pro"
        description={PRICING_PRO_TAGLINE}
      />
      <Suspense fallback={null}>
        <PricingPlansGrid showHeader={false} />
      </Suspense>
      <section
        id="premium-tools"
        className="border-t border-slate/10 bg-[#f4f6f8] py-16 md:py-20 lg:py-24 scroll-mt-24"
      >
        <Container size="wide">
          <h2 className="text-2xl font-bold text-deep-navy">Premium decision tools</h2>
          <p className="mt-2 max-w-2xl text-slate">
            Included with SectorCalc Pro. Free tools stay quick checks; paid tools deliver
            safe price floors, margin leak detection and accept/reject verdicts.
          </p>
          <div className="mt-8">
            <ToolsTileGrid
              tools={PREMIUM_TOOLS}
              className="[&_li]:scroll-mt-24"
            />
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
