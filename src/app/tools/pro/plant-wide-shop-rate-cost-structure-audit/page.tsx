import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import PlantWideShopRateAuditToolPage from "@/components/PlantWideShopRateAuditToolPage";
import "server-only";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Plant-Wide Shop Rate & Cost Structure Audit | SectorCalc PRO",
    description: "Is your current shop rate right? Audits plant-wide cost structure against actual productive hours and overhead allocation — with a sealed proof report.",
    robots: { index: true, follow: true },
  };
}

export default function PlantWideShopRateAuditToolPagePage() {
  return (
    <PageLayout>
      <article aria-label="Plant-Wide Shop Rate & Cost Structure Audit">
        <PlantWideShopRateAuditToolPage />
      </article>
    </PageLayout>
  );
}
