// SectorCalc — Machine Hourly Rate Proof Report Route
// Dedicated route using the custom page component (z1 reference implementation).
// Overrides the dynamic [slug] route for this specific tool.

import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import MachineHourlyRatePage from "@/tools/pro/machine-hourly-rate-proof-report/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Machine Hourly Rate Proof Report | SectorCalc PRO",
  description:
    "Prove the true cost of every productive machine hour — depreciation, maintenance, energy, and labor spread only across hours that make something sellable. Full absorption costing with sensitivity analysis.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Machine Hourly Rate Proof Report | SectorCalc PRO",
    description:
      "Prove the true cost of every productive machine hour — depreciation, maintenance, energy, and labor spread only across hours that make something sellable.",
  },
};

export default function MachineHourlyRateRoute() {
  return (
    <PageLayout>
      <article aria-label="Machine Hourly Rate Proof Report" className="pro-shell">
        <MachineHourlyRatePage />
      </article>
    </PageLayout>
  );
}
