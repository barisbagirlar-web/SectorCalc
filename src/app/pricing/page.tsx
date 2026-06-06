import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PricingToolUnlockBanner } from "@/components/billing/PricingToolUnlockBanner";
import { PricingSubscribedBanner } from "@/components/billing/SubscriptionActivationBanner";
import { PricingPlansGrid } from "@/components/sections/PricingPlansGrid";
import { Container } from "@/components/ui/Container";
import { PRICING_PRO_TAGLINE, PRICING_ROI_COPY, PRICING_PAGE_H1 } from "@/data/pricing-plans";
import { createPageMetadata } from "@/lib/metadata";
import { getFreeToolsHref, getPremiumToolsHref, getSampleReportHref } from "@/lib/tools/tool-links";
import { PRICING_CHECKOUT_LEGAL } from "@/lib/billing/subscription";
import { PRICING_REFUND_POLICY } from "@/lib/pricing/plan-catalog";

export const metadata: Metadata = createPageMetadata({
  title: "Pricing — Protect your margin",
  description:
    "Free checks, Single Verdict $19, Pro $29/month, Annual $249, Team $99. Choose how you protect margin before you quote.",
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
            {PRICING_PAGE_H1}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate">
            {PRICING_PRO_TAGLINE}
          </p>
          <p className="mt-3 max-w-2xl text-base font-semibold text-deep-navy">
            {PRICING_ROI_COPY}
          </p>
          <p className="mt-4 text-sm">
            <Link href={getSampleReportHref()} className="font-semibold text-professional-blue hover:underline">
              View sample verdict report →
            </Link>
          </p>
        </Container>
      </section>

      <Suspense fallback={null}>
        <PricingPlansGrid showHeader={false} embedded />
      </Suspense>

      <section className="border-t border-slate/10 bg-white py-10 sm:py-12">
        <Container>
          <p className="text-xs leading-relaxed text-slate">{PRICING_CHECKOUT_LEGAL}</p>
          <p className="mt-4 text-xs leading-relaxed text-slate">{PRICING_REFUND_POLICY}</p>
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
