import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import JobQuoteBuilderProPackToolPage from "@/components/JobQuoteBuilderProPackToolPage";
import "server-only";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Job Quote Builder Pro Pack | SectorCalc PRO",
    description: "What should this job be quoted at? Computes full job cost, target-margin markup, and a risk-adjusted price — with a sealed proof report.",
    robots: { index: true, follow: true },
  };
}

export default function JobQuoteBuilderProPackToolPagePage() {
  return (
    <PageLayout>
      <article aria-label="Job Quote Builder Pro Pack">
        <JobQuoteBuilderProPackToolPage />
      </article>
    </PageLayout>
  );
}
