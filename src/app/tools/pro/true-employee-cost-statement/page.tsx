// SectorCalc — True Employee Cost Statement Route
// Dedicated route using the custom page component.
// Overrides the dynamic [slug] route for this specific tool.

import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import TrueEmployeeCostPage from "@/tools/pro/true-employee-cost-statement/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "True Employee Cost Statement | SectorCalc PRO",
  description:
    "Compute the fully loaded cost of an employee including salary, payroll taxes, benefits, paid leave, training, equipment, and facility overhead. Understand the true cost-to-company multiplier.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "True Employee Cost Statement | SectorCalc PRO",
    description:
      "Compute the fully loaded cost of an employee including salary, payroll taxes, benefits, paid leave, training, equipment, and facility overhead. Understand the true cost-to-company multiplier.",
  },
};

export default function TrueEmployeeCostRoute() {
  return (
    <PageLayout>
      <article aria-label="True Employee Cost Statement" className="pro-shell">
        <TrueEmployeeCostPage />
      </article>
    </PageLayout>
  );
}
