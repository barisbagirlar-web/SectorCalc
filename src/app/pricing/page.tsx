// @ts-nocheck
import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { PricingPageContent } from "@/components/pricing/PricingPageContent";
import { PricingPageTracker } from "@/components/campaign/PricingPageTracker";
import { createPageMetadata } from "@/lib/metadata";

export const revalidate = 3600;
export const dynamic = "force-static";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  return createPageMetadata({
    title: "Pricing for Sector Calculators and Decision Reports | SectorCalc",
    description:
      "Free sector checks, premium decision reports, sector packs, and Pro workspace. Pay only for what you calculate.",
    path: "/pricing",
    locale: locale as "en",
  });
}

export default async function PricingPage({ params }: PageProps) {
  const locale = "en";
  

  return (
    <PageLayout>
      <div className="public-demo-page">
        <PricingPageTracker />
        <PricingPageContent />
      </div>
    </PageLayout>
  );
}
