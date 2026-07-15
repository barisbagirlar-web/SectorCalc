// SectorCalc — Energy Efficiency Grant & Incentive Feasibility Pack Route
// Dedicated route using the custom page component.

import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import EnergyEfficiencyGrantPage from
  "@/tools/pro/energy-efficiency-grant-incentive-feasibility-pack/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Energy Efficiency Grant & Incentive Feasibility Pack | SectorCalc PRO",
  description:
    "Evaluate the financial and environmental feasibility of energy efficiency improvements. Compute payback, ROI, CO2 reduction, and grant-adjusted net cost.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Energy Efficiency Grant & Incentive Feasibility Pack | SectorCalc PRO",
    description:
      "Evaluate the financial and environmental feasibility of energy efficiency improvements. Compute payback, ROI, CO2 reduction, and grant-adjusted net cost.",
  },
};

export default function EnergyEfficiencyGrantRoute() {
  return (
    <PageLayout>
      <article aria-label="Energy Efficiency Grant & Incentive Feasibility Pack" className="pro-shell">
        <EnergyEfficiencyGrantPage />
      </article>
    </PageLayout>
  );
}
