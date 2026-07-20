import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import EnergyEfficiencyGrantFeasibilityToolPage from "@/components/EnergyEfficiencyGrantFeasibilityToolPage";
import "server-only";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Energy Efficiency Grant & Incentive Feasibility Pack | SectorCalc PRO",
    description: "Does an energy efficiency project pay off after grants? Computes energy savings, emissions reduction, and payback net of incentives — with a sealed proof report.",
    robots: { index: true, follow: true },
  };
}

export default function EnergyEfficiencyGrantFeasibilityToolPagePage() {
  return (
    <PageLayout>
      <article aria-label="Energy Efficiency Grant & Incentive Feasibility Pack">
        <EnergyEfficiencyGrantFeasibilityToolPage />
      </article>
    </PageLayout>
  );
}
