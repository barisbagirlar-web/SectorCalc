// SectorCalc — Break-Even & Survival Cash Calculator Route
// Dedicated route using the custom page component.
// Overrides the dynamic [slug] route for this specific tool.

import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import BreakEvenSurvivalCashPage from "@/tools/pro/break-even-survival-cash-calculator/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Break-Even & Survival Cash Calculator | SectorCalc PRO",
  description:
    "Calculate break-even revenue, cash runway, survival cash target, and funding gap. Assess how long your business can survive under stressed conditions.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Break-Even & Survival Cash Calculator | SectorCalc PRO",
    description:
      "Calculate break-even revenue, cash runway, survival cash target, and funding gap. Assess how long your business can survive under stressed conditions.",
  },
};

export default function BreakEvenSurvivalCashRoute() {
  return (
    <PageLayout>
      <article aria-label="Break-Even & Survival Cash Calculator" className="pro-shell">
        <BreakEvenSurvivalCashPage />
      </article>
    </PageLayout>
  );
}
