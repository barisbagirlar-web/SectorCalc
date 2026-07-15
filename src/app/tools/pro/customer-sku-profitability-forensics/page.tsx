// SectorCalc — Customer SKU Profitability Forensics Route
// Dedicated route using the custom page component.
// Overrides the dynamic [slug] route for this specific tool.

import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import SKUProfitForensicsPage from "@/tools/pro/customer-sku-profitability-forensics/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Customer SKU Profitability Forensics | SectorCalc PRO",
  description:
    "Diagnose SKU-level profitability by isolating logistics, service, and return burdens. Identify toxic SKUs, margin erosion drivers, and portfolio action recommendations.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Customer SKU Profitability Forensics | SectorCalc PRO",
    description:
      "Diagnose SKU-level profitability by isolating logistics, service, and return burdens. Identify toxic SKUs, margin erosion drivers, and portfolio action recommendations.",
  },
};

export default function SKUProfitForensicsRoute() {
  return (
    <PageLayout>
      <article aria-label="Customer SKU Profitability Forensics" className="pro-shell">
        <SKUProfitForensicsPage />
      </article>
    </PageLayout>
  );
}
