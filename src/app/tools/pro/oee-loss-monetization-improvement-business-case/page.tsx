// SectorCalc — OEE Loss Monetization & Improvement Business Case Route
// Dedicated route using the custom page component.
// Overrides the dynamic [slug] route for this specific tool.

import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import OEELossPage from "@/tools/pro/oee-loss-monetization-improvement-business-case/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "OEE Loss Monetization & Improvement Business Case | SectorCalc PRO",
  description:
    "Quantify OEE losses in monetary terms, model improvement scenarios, and validate the business case for investment. Convert availability, performance, and quality losses into a 3-year improvement ROI.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "OEE Loss Monetization & Improvement Business Case | SectorCalc PRO",
    description:
      "Quantify OEE losses in monetary terms, model improvement scenarios, and validate the business case for investment. Convert availability, performance, and quality losses into a 3-year improvement ROI.",
  },
};

export default function OEELossRoute() {
  return (
    <PageLayout>
      <article aria-label="OEE Loss Monetization & Improvement Business Case" className="pro-shell">
        <OEELossPage />
      </article>
    </PageLayout>
  );
}
