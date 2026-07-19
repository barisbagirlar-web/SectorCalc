// SectorCalc PRO — Product SKU Margin Ranker
// Dedicated page implementing the x1 reference design.
// Overrides [slug] route via Next.js App Router precedence (specific > dynamic).

import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import ProductSkuMarginRankerToolPage from "@/components/ProductSkuMarginRankerToolPage";
import "server-only";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Product SKU Margin Ranker | SectorCalc PRO",
    description:
      "True fully-loaded unit cost against selling price, with annual profit contribution — the real metric for ranking SKUs against each other, not margin percentage alone.",
    robots: { index: true, follow: true },
    openGraph: {
      title: "Product SKU Margin Ranker | SectorCalc PRO",
      description:
        "Unit economics and annual profit contribution for ranking product SKUs, with a sealed audit report.",
    },
  };
}

export default function ProductSkuMarginRankerPage() {
  return (
    <PageLayout>
      <article aria-label="Product SKU Margin Ranker">
        <ProductSkuMarginRankerToolPage />
      </article>
    </PageLayout>
  );
}
