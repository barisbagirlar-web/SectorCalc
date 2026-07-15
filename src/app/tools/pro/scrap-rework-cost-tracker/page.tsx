// SectorCalc — Scrap & Rework Cost Tracker Route
// Dedicated route using the custom page component.
// Overrides the dynamic [slug] route for this specific tool.

import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import ScrapReworkCostPage from "@/tools/pro/scrap-rework-cost-tracker/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Scrap & Rework Cost Tracker | SectorCalc PRO",
  description:
    "Track scrap and rework cost by cause, operation, and customer-impact driver. Identify dominant quality cost driver and quantify monthly loss.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Scrap & Rework Cost Tracker | SectorCalc PRO",
    description:
      "Track scrap and rework cost by cause, operation, and customer-impact driver. Identify dominant quality cost driver and quantify monthly loss.",
  },
};

export default function ScrapReworkCostRoute() {
  return (
    <PageLayout>
      <article aria-label="Scrap & Rework Cost Tracker" className="pro-shell">
        <ScrapReworkCostPage />
      </article>
    </PageLayout>
  );
}
