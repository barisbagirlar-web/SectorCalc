// SectorCalc — FX & Commodity Pass-Through Pricer Route
// Dedicated route using the custom page component.

import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import FxCommodityPassThroughPage from
  "@/tools/pro/fx-commodity-pass-through-pricer/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FX & Commodity Pass-Through Pricer | SectorCalc PRO",
  description:
    "Calculate pass-through adjustments for FX rate and commodity index movements. Determine adjusted price, escalation amount, and decision state.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "FX & Commodity Pass-Through Pricer | SectorCalc PRO",
    description:
      "Calculate pass-through adjustments for FX rate and commodity index movements. Determine adjusted price, escalation amount, and decision state.",
  },
};

export default function FxCommodityPassThroughRoute() {
  return (
    <PageLayout>
      <article aria-label="FX & Commodity Pass-Through Pricer" className="pro-shell">
        <FxCommodityPassThroughPage />
      </article>
    </PageLayout>
  );
}
