// SectorCalc — Weld Procedure Cost & Consumable Estimation Suite Route
// Dedicated route using the custom page component.

import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import WeldProcedureCostPage from
  "@/tools/pro/weld-procedure-cost-consumable-estimation-suite/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Weld Procedure Cost & Consumable Estimation Suite | SectorCalc PRO",
  description:
    "Estimate total weld cost including consumables, labor, and overhead. Compute cost per meter and identify the dominant cost driver.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Weld Procedure Cost & Consumable Estimation Suite | SectorCalc PRO",
    description:
      "Estimate total weld cost including consumables, labor, and overhead. Compute cost per meter and identify the dominant cost driver.",
  },
};

export default function WeldProcedureCostRoute() {
  return (
    <PageLayout>
      <article aria-label="Weld Procedure Cost & Consumable Estimation Suite" className="pro-shell">
        <WeldProcedureCostPage />
      </article>
    </PageLayout>
  );
}
