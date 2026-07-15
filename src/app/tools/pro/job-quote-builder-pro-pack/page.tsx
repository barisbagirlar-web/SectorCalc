// SectorCalc — Job Quote Builder Pro Pack Route
// Dedicated route using the custom page component.
// Overrides the dynamic [slug] route for this specific tool.

import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import JobQuoteBuilderProPackPage from "@/tools/pro/job-quote-builder-pro-pack/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Job Quote Builder Pro Pack | SectorCalc PRO",
  description:
    "Build accurate job quotes with machine rate, labor, material, overhead, and risk-adjusted pricing. Identify margin gaps, cost drivers, and pricing opportunities.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Job Quote Builder Pro Pack | SectorCalc PRO",
    description:
      "Build accurate job quotes with machine rate, labor, material, overhead, and risk-adjusted pricing. Identify margin gaps, cost drivers, and pricing opportunities.",
  },
};

export default function JobQuoteBuilderProPackRoute() {
  return (
    <PageLayout>
      <article aria-label="Job Quote Builder Pro Pack" className="pro-shell">
        <JobQuoteBuilderProPackPage />
      </article>
    </PageLayout>
  );
}
