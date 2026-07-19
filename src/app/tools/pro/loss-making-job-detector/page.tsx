// SectorCalc PRO — Loss-Making Job Detector
// Dedicated page implementing the x1 reference design.
// Overrides [slug] route via Next.js App Router precedence (specific > dynamic).

import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import LossMakingJobDetectorToolPage from "@/components/LossMakingJobDetectorToolPage";
import "server-only";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Loss-Making Job Detector | SectorCalc PRO",
    description:
      "Compare a quoted price against the true fully-loaded cost per unit — machine, labor, overhead, material, defect, and amortized setup — and find out whether the job actually makes money.",
    robots: { index: true, follow: true },
    openGraph: {
      title: "Loss-Making Job Detector | SectorCalc PRO",
      description:
        "True fully-loaded unit cost vs quoted price, with annualized loss exposure and a sealed audit report.",
    },
  };
}

export default function LossMakingJobDetectorPage() {
  return (
    <PageLayout>
      <article aria-label="Loss-Making Job Detector">
        <LossMakingJobDetectorToolPage />
      </article>
    </PageLayout>
  );
}
