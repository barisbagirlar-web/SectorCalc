// SectorCalc — Outsource vs In-House Analyzer Route
// Dedicated route using the custom page component.

import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import OutsourceVsInHousePage from
  "@/tools/pro/outsource-vs-in-house-analyzer/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Outsource vs In-House Analyzer | SectorCalc PRO",
  description:
    "Compare total cost of in-house production vs outsourcing. Risk-adjusted deltas including quality premium and capacity opportunity cost.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Outsource vs In-House Analyzer | SectorCalc PRO",
    description:
      "Compare total cost of in-house production vs outsourcing. Risk-adjusted deltas including quality premium and capacity opportunity cost.",
  },
};

export default function OutsourceVsInHouseRoute() {
  return (
    <PageLayout>
      <article aria-label="Outsource vs In-House Analyzer" className="pro-shell">
        <OutsourceVsInHousePage />
      </article>
    </PageLayout>
  );
}
