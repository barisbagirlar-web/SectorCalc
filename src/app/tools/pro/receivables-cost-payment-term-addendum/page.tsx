// SectorCalc — Receivables Cost / Payment Term Addendum Route
// Dedicated route using the custom page component.
// Overrides the dynamic [slug] route for this specific tool.

import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import ReceivablesCostPage from "@/tools/pro/receivables-cost-payment-term-addendum/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Receivables Cost / Payment Term Addendum | SectorCalc PRO",
  description:
    "Calculate the finance cost of extended payment terms and evaluate payment term addendum impact. Quantify the hidden cost of carrying receivables.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Receivables Cost / Payment Term Addendum | SectorCalc PRO",
    description:
      "Calculate the finance cost of extended payment terms and evaluate payment term addendum impact. Quantify the hidden cost of carrying receivables.",
  },
};

export default function ReceivablesCostRoute() {
  return (
    <PageLayout>
      <article aria-label="Receivables Cost / Payment Term Addendum" className="pro-shell">
        <ReceivablesCostPage />
      </article>
    </PageLayout>
  );
}
