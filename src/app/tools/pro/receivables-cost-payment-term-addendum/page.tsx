// SectorCalc PRO — Receivables Cost / Payment Term Addendum
// Dedicated page implementing the x1 reference design.
// Overrides [slug] route via Next.js App Router precedence (specific > dynamic).

import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import ReceivablesCostToolPage from "@/components/ReceivablesCostToolPage";
import "server-only";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Receivables Cost / Payment Term Addendum | SectorCalc PRO",
    description:
      "What it actually costs to carry your accounts receivable, cross-checked against DSO and revenue for internal consistency, with the real value of collecting faster and a sealed audit report.",
    robots: { index: true, follow: true },
    openGraph: {
      title: "Receivables Cost / Payment Term Addendum | SectorCalc PRO",
      description:
        "AR carrying cost, DSO consistency check, and the value of tightening payment terms.",
    },
  };
}

export default function ReceivablesCostPaymentTermAddendumPage() {
  return (
    <PageLayout>
      <article aria-label="Receivables Cost / Payment Term Addendum">
        <ReceivablesCostToolPage />
      </article>
    </PageLayout>
  );
}
