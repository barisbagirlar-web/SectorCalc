export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { PricingPageContent } from "@/components/pricing/PricingPageContent";
import { PricingPageTracker } from "@/components/campaign/PricingPageTracker";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

export const revalidate = 3600;

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pricing_v2" });

  return createPageMetadata({
    title: "Pricing for Sector Calculators and Decision Reports | SectorCalc",
    description: "Free sector checks, premium decision reports, sector packs, and Pro workspace. Pay only for what you calculate.",
    path: "/pricing",
    locale: locale as AppLocale,
  });
}

export default async function PricingPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageLayout>
      <div className="public-demo-page">
        <PricingPageTracker />
        <PricingPageContent />
      </div>
    </PageLayout>
  );
}
