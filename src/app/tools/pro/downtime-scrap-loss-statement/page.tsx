// SectorCalc — Downtime & Scrap Loss Statement Route
// Dedicated route using the custom page component.
// Overrides the dynamic [slug] route for this specific tool.

import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import DowntimeScrapLossPage from "@/tools/pro/downtime-scrap-loss-statement/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Downtime & Scrap Loss Statement | SectorCalc PRO",
  description:
    "Quantify the combined financial impact of downtime, scrap, and rework. Identify the dominant loss driver and trigger escalation thresholds.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Downtime & Scrap Loss Statement | SectorCalc PRO",
    description:
      "Quantify the combined financial impact of downtime, scrap, and rework. Identify the dominant loss driver and trigger escalation thresholds.",
  },
};

export default function DowntimeScrapLossRoute() {
  return (
    <PageLayout>
      <article aria-label="Downtime & Scrap Loss Statement" className="pro-shell">
        <DowntimeScrapLossPage />
      </article>
    </PageLayout>
  );
}
