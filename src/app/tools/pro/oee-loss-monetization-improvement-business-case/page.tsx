import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import OeeLossMonetizationToolPage from "@/components/OeeLossMonetizationToolPage";
import "server-only";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "OEE Loss Monetization & Improvement Business Case | SectorCalc PRO",
    description: "What is lost OEE actually costing you, and does an improvement project pay off? Computes availability/performance/quality losses in currency and a real ROI.",
    robots: { index: true, follow: true },
  };
}

export default function OeeLossMonetizationToolPagePage() {
  return (
    <PageLayout>
      <article aria-label="OEE Loss Monetization & Improvement Business Case">
        <OeeLossMonetizationToolPage />
      </article>
    </PageLayout>
  );
}
