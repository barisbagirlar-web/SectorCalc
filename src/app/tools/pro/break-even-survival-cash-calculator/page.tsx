import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import BreakEvenSurvivalCashToolPage from "@/components/BreakEvenSurvivalCashToolPage";
import "server-only";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Break-Even & Survival Cash Calculator | SectorCalc PRO",
    description: "Where is your break-even? How much cash do you need to survive a downside? Sealed audit report with margin-of-safety, runway, and funding gap analysis.",
    robots: { index: true, follow: true },
  };
}

export default function BreakEvenSurvivalCashPage() {
  return (
    <PageLayout>
      <article aria-label="Break-Even & Survival Cash Calculator">
        <BreakEvenSurvivalCashToolPage />
      </article>
    </PageLayout>
  );
}
