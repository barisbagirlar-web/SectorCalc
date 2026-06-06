import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PricingToolUnlockBanner } from "@/components/billing/PricingToolUnlockBanner";
import { PricingSubscribedBanner } from "@/components/billing/SubscriptionActivationBanner";
import { PricingPlansGrid } from "@/components/sections/PricingPlansGrid";
import { Container } from "@/components/ui/Container";
import { PRICING_PRO_TAGLINE } from "@/data/pricing-plans";
import { createPageMetadata } from "@/lib/metadata";
import { getFreeToolsHref, getPremiumToolsHref } from "@/lib/tools/tool-links";
import { PRICING_CHECKOUT_LEGAL } from "@/lib/billing/subscription";

export const metadata: Metadata = createPageMetadata({
  title: "Pricing",
  description:
    "SectorCalc Pro — $29/month. Unlock sector-specific decision analyzers for pricing, cost and margin risk.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <PageLayout headerTheme="light">
      <Suspense fallback={null}>
        <PricingSubscribedBanner />
      </Suspense>
      <Suspense fallback={null}>
        <PricingToolUnlockBanner />
      </Suspense>

      <section className="border-b border-slate/10 bg-off-white py-10 sm:py-12">
        <Container>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-professional-blue">
            Pricing
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-deep-navy sm:text-4xl">
            SectorCalc Pro
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate">
            {PRICING_PRO_TAGLINE}
          </p>
        </Container>
      </section>

      <Suspense fallback={null}>
        <PricingPlansGrid showHeader={false} embedded />
      </Suspense>

      <section className="border-t border-slate/10 bg-white py-10 sm:py-12">
        <Container>
          <p className="text-xs leading-relaxed text-slate">{PRICING_CHECKOUT_LEGAL}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={getPremiumToolsHref()}
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-professional-blue hover:underline"
            >
              Browse premium analyzers →
            </Link>
            <Link
              href={getFreeToolsHref()}
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-slate hover:text-professional-blue"
            >
              Start with free tools →
            </Link>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
