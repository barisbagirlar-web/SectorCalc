import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import DowntimeScrapLossStatementToolPage from "@/components/DowntimeScrapLossStatementToolPage";
import "server-only";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Downtime & Scrap Loss Statement | SectorCalc PRO",
    description: "What did downtime and defects cost this period? Quantifies downtime cost, scrap material loss, and rework cost in a single sealed proof report.",
    robots: { index: true, follow: true },
  };
}

export default function DowntimeScrapLossStatementToolPagePage() {
  return (
    <PageLayout>
      <article aria-label="Downtime & Scrap Loss Statement">
        <DowntimeScrapLossStatementToolPage />
      </article>
    </PageLayout>
  );
}
