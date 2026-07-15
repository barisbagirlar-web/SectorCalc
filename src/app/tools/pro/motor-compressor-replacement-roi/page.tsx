// SectorCalc — Motor Compressor Replacement ROI Route
// Dedicated route using the custom page component.

import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import MotorCompressorReplacementRoiPage from
  "@/tools/pro/motor-compressor-replacement-roi/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Motor Compressor Replacement ROI | SectorCalc PRO",
  description:
    "Evaluate the financial viability of replacing an existing motor or compressor with a high-efficiency unit. Compute payback period, NPV, ROI, and energy savings.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Motor Compressor Replacement ROI | SectorCalc PRO",
    description:
      "Evaluate the financial viability of replacing an existing motor or compressor with a high-efficiency unit. Compute payback period, NPV, ROI, and energy savings.",
  },
};

export default function MotorCompressorReplacementRoiRoute() {
  return (
    <PageLayout>
      <article aria-label="Motor Compressor Replacement ROI" className="pro-shell">
        <MotorCompressorReplacementRoiPage />
      </article>
    </PageLayout>
  );
}
