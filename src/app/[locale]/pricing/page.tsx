import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { PricingToolUnlockBanner } from "@/components/billing/PricingToolUnlockBanner";
import { PricingSubscribedBanner, PricingCheckoutCanceledBanner } from "@/components/billing/SubscriptionActivationBanner";
import { PricingPlansGrid } from "@/components/sections/PricingPlansGrid";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";
import { Link } from "@/i18n/routing";
import { getFreeToolsHref, getPremiumToolsHref, getSampleReportHref } from "@/lib/tools/tool-links";
import { PRICING_CHECKOUT_LEGAL } from "@/lib/billing/subscription";
import { PRICING_REFUND_POLICY } from "@/lib/pricing/plan-catalog";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });

  return createPageMetadata({
    title: `${t("title")} — SectorCalc`,
    description: `${t("tagline")} Single report $9, Pro $19/month, Annual $149, Team $49.`,
    path: `/${locale}/pricing`,
  });
}

export default async function PricingPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pricing");

  return (
    <PageLayout>
      <Suspense fallback={null}>
        <PricingCheckoutCanceledBanner />
      </Suspense>
      <Suspense fallback={null}>
        <PricingSubscribedBanner />
      </Suspense>
      <Suspense fallback={null}>
        <PricingToolUnlockBanner />
      </Suspense>

      <section className="border-b border-border-subtle bg-bg-subtle py-10 sm:py-12">
        <Container>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-teal">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate">
            {t("tagline")}
          </p>
          <p className="mt-3 max-w-2xl text-base font-semibold text-text-primary">
            {t("roiCopy")}
          </p>
          <p className="mt-4 text-sm">
            <Link href={getSampleReportHref()} className="font-semibold text-accent-teal hover:underline">
              {t("sampleReport")}
            </Link>
          </p>
        </Container>
      </section>

      <Suspense fallback={null}>
        <PricingPlansGrid showHeader={false} embedded />
      </Suspense>

      <section className="border-t border-border-subtle bg-white py-10 sm:py-12">
        <Container>
          <p className="text-xs leading-relaxed text-slate">{PRICING_CHECKOUT_LEGAL}</p>
          <p className="mt-4 text-xs leading-relaxed text-slate">{PRICING_REFUND_POLICY}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={getPremiumToolsHref()}
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-accent-teal hover:underline"
            >
              {t("browsePremium")}
            </Link>
            <Link
              href={getFreeToolsHref()}
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-slate hover:text-accent-teal"
            >
              {t("startFree")}
            </Link>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
