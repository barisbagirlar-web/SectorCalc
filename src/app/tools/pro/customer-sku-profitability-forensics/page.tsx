import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import CustomerSkuProfitabilityForensicsToolPage from "@/components/CustomerSkuProfitabilityForensicsToolPage";
import "server-only";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Customer / SKU Profitability Forensics | SectorCalc PRO",
    description: "Is this SKU actually profitable once logistics, service, and returns are burdened in? A full contribution-margin forensic with a sealed proof report.",
    robots: { index: true, follow: true },
  };
}

export default function CustomerSkuProfitabilityForensicsToolPagePage() {
  return (
    <PageLayout>
      <article aria-label="Customer / SKU Profitability Forensics">
        <CustomerSkuProfitabilityForensicsToolPage />
      </article>
    </PageLayout>
  );
}
