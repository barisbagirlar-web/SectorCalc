import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import MotorCompressorReplacementRoiToolPage from "@/components/MotorCompressorReplacementRoiToolPage";
import "server-only";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Motor / Compressor Replacement ROI | SectorCalc PRO",
    description: "Does replacing this motor or compressor with a higher-efficiency unit pay off? Computes energy savings and ROI over equipment life — with a sealed proof report.",
    robots: { index: true, follow: true },
  };
}

export default function MotorCompressorReplacementRoiToolPagePage() {
  return (
    <PageLayout>
      <article aria-label="Motor / Compressor Replacement ROI">
        <MotorCompressorReplacementRoiToolPage />
      </article>
    </PageLayout>
  );
}
