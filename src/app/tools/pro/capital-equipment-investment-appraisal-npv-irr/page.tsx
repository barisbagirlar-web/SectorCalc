// SectorCalc PRO — Capital Equipment Investment Appraisal: NPV/IRR
// Dedicated page implementing the x1 reference design.
// Overrides [slug] route via Next.js App Router precedence (specific > dynamic).

import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import CapitalEquipmentNpvIrrToolPage from "@/components/CapitalEquipmentNpvIrrToolPage";
import "server-only";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Capital Equipment Investment Appraisal — NPV/IRR | SectorCalc PRO",
    description:
      "Standard capital budgeting appraisal: discounted NPV, Newton-Raphson IRR, simple and discounted payback, and profitability index — with sensitivity, break-even, and a sealed audit report.",
    robots: { index: true, follow: true },
    openGraph: {
      title: "Capital Equipment Investment Appraisal — NPV/IRR | SectorCalc PRO",
      description:
        "Discounted NPV, Newton-Raphson IRR, payback, and profitability index for capital equipment investment decisions.",
    },
  };
}

export default function CapitalEquipmentInvestmentAppraisalPage() {
  return (
    <PageLayout>
      <article aria-label="Capital Equipment Investment Appraisal — NPV/IRR">
        <CapitalEquipmentNpvIrrToolPage />
      </article>
    </PageLayout>
  );
}
