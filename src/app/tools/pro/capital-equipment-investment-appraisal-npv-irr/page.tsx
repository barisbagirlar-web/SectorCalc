// SectorCalc — Capital Equipment Investment Appraisal (NPV/IRR) Route
// Dedicated route using the custom page component.
// Overrides the dynamic [slug] route for this specific tool.

import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import NPVIRRPage from "@/tools/pro/capital-equipment-investment-appraisal-npv-irr/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Capital Equipment Investment Appraisal (NPV/IRR) | SectorCalc PRO",
  description:
    "Evaluate capital equipment investments with NPV, IRR, payback period, and profitability index analysis. Rigorous financial modeling for informed decisions.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Capital Equipment Investment Appraisal (NPV/IRR) | SectorCalc PRO",
    description:
      "Evaluate capital equipment investments with NPV, IRR, payback period, and profitability index analysis.",
  },
};

export default function CapitalEquipmentInvestmentAppraisalRoute() {
  return (
    <PageLayout>
      <article aria-label="Capital Equipment Investment Appraisal" className="pro-shell">
        <NPVIRRPage />
      </article>
    </PageLayout>
  );
}
