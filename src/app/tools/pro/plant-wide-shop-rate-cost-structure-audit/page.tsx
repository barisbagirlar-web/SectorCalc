// SectorCalc — Plant-Wide Shop Rate Cost Structure Audit Route
// Dedicated route using the custom page component.

import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import PlantWideShopRatePage from
  "@/tools/pro/plant-wide-shop-rate-cost-structure-audit/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Plant-Wide Shop Rate Cost Structure Audit | SectorCalc PRO",
  description:
    "Audit plant-wide shop rates against actual cost structure. Compute plant-wide rate, machine group rate, overhead absorption, and pricing floor.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Plant-Wide Shop Rate Cost Structure Audit | SectorCalc PRO",
    description:
      "Audit plant-wide shop rates against actual cost structure. Compute plant-wide rate, machine group rate, overhead absorption, and pricing floor.",
  },
};

export default function PlantWideShopRateRoute() {
  return (
    <PageLayout>
      <article aria-label="Plant-Wide Shop Rate Cost Structure Audit" className="pro-shell">
        <PlantWideShopRatePage />
      </article>
    </PageLayout>
  );
}
