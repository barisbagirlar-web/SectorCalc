export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { InvestorDemoPageContent } from "@/components/investor-demo/InvestorDemoPageContent";
import { loadInvestorPageMetrics } from "@/lib/commercial/investor-metrics-bridge";
import { createPageMetadata } from "@/lib/metadata";

const LOCALE = "en";

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata({
    title: "Investor Demo — SectorCalc Operating System",
    description:
      "Investor-ready overview: live Smart Form pilots, dual-core calculation intelligence, formula governance proof, calculation summary vision, and Tool Factory scale path.",
    path: "/investor-demo",
    locale: LOCALE as "en",
  });
}

export default async function InvestorDemoPage() {
  const metrics = loadInvestorPageMetrics();
  return (
    <PageLayout>
      <InvestorDemoPageContent metrics={metrics} />
    </PageLayout>
  );
}
