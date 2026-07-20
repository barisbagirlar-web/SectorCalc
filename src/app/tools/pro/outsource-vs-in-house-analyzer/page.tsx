import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import OutsourceVsInHouseAnalyzerToolPage from "@/components/OutsourceVsInHouseAnalyzerToolPage";
import "server-only";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Outsource vs In-House Analyzer | SectorCalc PRO",
    description: "Should this part be made in-house or outsourced? Compares total in-house cost against outsourced price plus logistics and quality risk — with a sealed proof report.",
    robots: { index: true, follow: true },
  };
}

export default function OutsourceVsInHouseAnalyzerToolPagePage() {
  return (
    <PageLayout>
      <article aria-label="Outsource vs In-House Analyzer">
        <OutsourceVsInHouseAnalyzerToolPage />
      </article>
    </PageLayout>
  );
}
