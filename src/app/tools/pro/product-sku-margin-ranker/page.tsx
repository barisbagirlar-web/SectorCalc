// SectorCalc — Product SKU Margin Ranker Route
// Dedicated route using the custom page component.
// Overrides the dynamic [slug] route for this specific tool.

import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import ProductSkuMarginRankerPage from "@/tools/pro/product-sku-margin-ranker/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Product SKU Margin Ranker | SectorCalc PRO",
  description:
    "Rank products by contribution margin and identify margin drivers, erosion risks, and optimization levers. Analyze unit economics across cost, labor, and overhead dimensions.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Product SKU Margin Ranker | SectorCalc PRO",
    description:
      "Rank products by contribution margin and identify margin drivers, erosion risks, and optimization levers. Analyze unit economics across cost, labor, and overhead dimensions.",
  },
};

export default function ProductSkuMarginRankerRoute() {
  return (
    <PageLayout>
      <article aria-label="Product SKU Margin Ranker" className="pro-shell">
        <ProductSkuMarginRankerPage />
      </article>
    </PageLayout>
  );
}
