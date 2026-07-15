// SectorCalc — Loss-Making Job Detector Route
// Dedicated route using the custom page component.
// Overrides the dynamic [slug] route for this specific tool.

import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import LossMakingJobDetectorPage from "@/tools/pro/loss-making-job-detector/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Loss-Making Job Detector | SectorCalc PRO",
  description:
    "Identify jobs that are priced below cost and quantify total loss exposure. Evaluate unit economics, margin gaps, and annual profit erosion.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Loss-Making Job Detector | SectorCalc PRO",
    description:
      "Identify jobs that are priced below cost and quantify total loss exposure. Evaluate unit economics, margin gaps, and annual profit erosion.",
  },
};

export default function LossMakingJobDetectorRoute() {
  return (
    <PageLayout>
      <article aria-label="Loss-Making Job Detector" className="pro-shell">
        <LossMakingJobDetectorPage />
      </article>
    </PageLayout>
  );
}
