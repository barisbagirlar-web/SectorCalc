import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import FxCommodityPassThroughPricerToolPage from "@/components/FxCommodityPassThroughPricerToolPage";
import "server-only";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "FX & Commodity Pass-Through Pricer | SectorCalc PRO",
    description: "How much should price move given FX and commodity swings? Computes the pass-through price adjustment accounting for hedging — with a sealed proof report.",
    robots: { index: true, follow: true },
  };
}

export default function FxCommodityPassThroughPricerToolPagePage() {
  return (
    <PageLayout>
      <article aria-label="FX & Commodity Pass-Through Pricer">
        <FxCommodityPassThroughPricerToolPage />
      </article>
    </PageLayout>
  );
}
