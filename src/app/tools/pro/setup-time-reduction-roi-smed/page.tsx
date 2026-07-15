// SectorCalc — Setup Time Reduction ROI (SMED) Route
// Dedicated route using the custom page component.
// Overrides the dynamic [slug] route for this specific tool.

import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import SetupTimeReductionRoiPage from "@/tools/pro/setup-time-reduction-roi-smed/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Setup Time Reduction ROI (SMED) | SectorCalc PRO",
  description:
    "Calculate the return on investment for Single-Minute Exchange of Die (SMED) implementation. Evaluate payback period, annual savings, and capacity recovery.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Setup Time Reduction ROI (SMED) | SectorCalc PRO",
    description:
      "Calculate the return on investment for Single-Minute Exchange of Die (SMED) implementation. Evaluate payback period, annual savings, and capacity recovery.",
  },
};

export default function SetupTimeReductionRoiRoute() {
  return (
    <PageLayout>
      <article aria-label="Setup Time Reduction ROI (SMED)" className="pro-shell">
        <SetupTimeReductionRoiPage />
      </article>
    </PageLayout>
  );
}
