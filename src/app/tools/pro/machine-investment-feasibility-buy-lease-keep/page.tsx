// SectorCalc — Machine Investment Feasibility: Buy vs Lease vs Keep Route
// Dedicated route using the custom page component.
// Overrides the dynamic [slug] route for this specific tool.

import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import InvestmentFeasibilityPage from "@/tools/pro/machine-investment-feasibility-buy-lease-keep/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Machine Investment Feasibility: Buy vs Lease vs Keep | SectorCalc PRO",
  description:
    "Compare Buy vs. Lease vs. Keep scenarios using NPV analysis. Identify the highest-value investment path and quantify uncertainty.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Machine Investment Feasibility: Buy vs Lease vs Keep | SectorCalc PRO",
    description:
      "Compare Buy vs. Lease vs. Keep scenarios using NPV analysis. Identify the highest-value investment path and quantify uncertainty.",
  },
};

export default function MachineInvestmentFeasibilityRoute() {
  return (
    <PageLayout>
      <article aria-label="Machine Investment Feasibility" className="pro-shell">
        <InvestmentFeasibilityPage />
      </article>
    </PageLayout>
  );
}
