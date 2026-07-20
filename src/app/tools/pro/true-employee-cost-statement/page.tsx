import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import TrueEmployeeCostStatementToolPage from "@/components/TrueEmployeeCostStatementToolPage";
import "server-only";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "True Employee Cost Statement | SectorCalc PRO",
    description: "What does an employee actually cost? Computes the fully-loaded annual cost including payroll taxes, benefits, insurance, training, and overhead — with a sealed proof report.",
    robots: { index: true, follow: true },
  };
}

export default function TrueEmployeeCostStatementToolPagePage() {
  return (
    <PageLayout>
      <article aria-label="True Employee Cost Statement">
        <TrueEmployeeCostStatementToolPage />
      </article>
    </PageLayout>
  );
}
