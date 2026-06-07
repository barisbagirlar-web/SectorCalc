import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PremiumToolPage } from "@/components/tools/PremiumToolPage";
import { createPageMetadata } from "@/lib/metadata";
import {
 getRevenueToolByPaidSlug,
 revenueTools,
} from "@/lib/tools/revenue-tools";

interface PremiumToolPageParams {
 slug: string;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<PremiumToolPageParams[]> {
 return revenueTools.map((tool) => ({ slug: tool.paidSlug }));
}

export async function generateMetadata({
 params,
}: {
 params: Promise<PremiumToolPageParams>;
}): Promise<Metadata> {
 const { slug } = await params;
 const tool = getRevenueToolByPaidSlug(slug);
 if (!tool) {
 return {};
 }

 return createPageMetadata({
 title: `${tool.paidTitle} | SectorCalc Pro`,
 description: `${tool.paidValue} Premium decision tool for pricing, cost and margin risk.`,
 path: `/tools/premium/${tool.paidSlug}`,
 });
}

export default async function PremiumRevenueToolRoute({
 params,
}: {
 params: Promise<PremiumToolPageParams>;
}) {
 const { slug } = await params;
 const tool = getRevenueToolByPaidSlug(slug);

 if (!tool) {
 notFound();
 }

 return <PremiumToolPage tool={tool} />;
}
