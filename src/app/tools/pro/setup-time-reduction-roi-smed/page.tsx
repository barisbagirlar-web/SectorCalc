// SectorCalc PRO — Setup Time Reduction ROI (SMED)
// Dedicated page implementing the x1 reference design.
// Overrides [slug] route via Next.js App Router precedence (specific > dynamic).

import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import SetupTimeReductionRoiSmedToolPage from "@/components/SetupTimeReductionRoiSmedToolPage";
import "server-only";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Setup Time Reduction ROI (SMED) | SectorCalc PRO",
    description:
      "Does a SMED investment pay? Computes annual savings from reducing changeover time, payback period, and ROI — with a sealed audit report.",
    robots: { index: true, follow: true },
    openGraph: {
      title: "Setup Time Reduction ROI (SMED) | SectorCalc PRO",
      description:
        "SMED ROI, payback, and annual savings from changeover time reduction.",
    },
  };
}

export default function SetupTimeReductionRoiSmedPage() {
  return (
    <PageLayout>
      <article aria-label="Setup Time Reduction ROI (SMED)">
        <SetupTimeReductionRoiSmedToolPage />
      </article>
    </PageLayout>
  );
}
