import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import ScrapReworkCostTrackerToolPage from "@/components/ScrapReworkCostTrackerToolPage";
import "server-only";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Scrap & Rework Cost Tracker | SectorCalc PRO",
    description: "What are defects actually costing? Computes scrap cost, rework cost, and monthly quality loss — with a sealed proof report and target vs actual comparison.",
    robots: { index: true, follow: true },
  };
}

export default function ScrapReworkCostTrackerToolPagePage() {
  return (
    <PageLayout>
      <article aria-label="Scrap & Rework Cost Tracker">
        <ScrapReworkCostTrackerToolPage />
      </article>
    </PageLayout>
  );
}
