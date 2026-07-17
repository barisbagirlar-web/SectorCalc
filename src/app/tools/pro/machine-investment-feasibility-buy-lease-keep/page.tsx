// SectorCalc PRO — Machine Investment Feasibility: Buy vs Lease vs Keep
// Dedicated page implementing the x1 reference design.
// Overrides [slug] route via Next.js App Router precedence (specific > dynamic).

import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import BuyLeaseKeepToolPage from "@/components/BuyLeaseKeepToolPage";
import "server-only";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Machine Investment Feasibility — Buy vs Lease vs Keep | SectorCalc PRO",
    description:
      "Compare buying, leasing, and keeping a machine using VDI 2067 lease-factor recovery, ISO 15686-5 life-cycle costing, and discounted NPV — with sensitivity, break-even, and a sealed audit report.",
    robots: { index: true, follow: true },
    openGraph: {
      title: "Machine Investment Feasibility — Buy vs Lease vs Keep | SectorCalc PRO",
      description:
        "VDI 2067 lease recovery, ISO 15686-5 life-cycle cost, and discounted NPV verdict for buy vs lease vs keep decisions.",
    },
  };
}

export default function MachineInvestmentFeasibilityPage() {
  return (
    <PageLayout>
      <article aria-label="Machine Investment Feasibility — Buy vs Lease vs Keep">
        <BuyLeaseKeepToolPage />
      </article>
    </PageLayout>
  );
}
