import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import WeldProcedureCostToolPage from "@/components/WeldProcedureCostToolPage";
import "server-only";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Weld Procedure Cost & Consumable Estimation | SectorCalc PRO",
    description: "What does a weld run cost? Computes wire mass, consumable cost, labour, overhead, and full cost per metre — with a sealed proof report.",
    robots: { index: true, follow: true },
  };
}

export default function WeldProcedureCostToolPagePage() {
  return (
    <PageLayout>
      <article aria-label="Weld Procedure Cost & Consumable Estimation">
        <WeldProcedureCostToolPage />
      </article>
    </PageLayout>
  );
}
