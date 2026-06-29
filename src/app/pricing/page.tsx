export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { PricingPageContent } from "@/components/pricing/PricingPageContent";
import { PricingPageTracker } from "@/components/campaign/PricingPageTracker";
import { createPageMetadata } from "@/lib/metadata";

export const revalidate = 3600;

const LOCALE = "en";

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata({
    title: "Pricing for Sector Calculators and Decision Reports | SectorCalc",
    description:
      "Free sector checks, premium decision reports, sector packs, and Pro workspace. Pay only for what you calculate.",
    path: "/pricing",
    locale: LOCALE as "en",
  });
}

export default async function PricingPage() {
  return (
    <PageLayout>
      <div className="public-demo-page">
        <PricingPageTracker />
        <PricingPageContent />
      </div>
    </PageLayout>
  );
}
