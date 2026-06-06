import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FreeToolPage } from "@/components/tools/FreeToolPage";
import { createPageMetadata } from "@/lib/metadata";
import {
  getRevenueToolByFreeSlug,
  revenueTools,
} from "@/lib/tools/revenue-tools";

interface FreeToolPageParams {
  slug: string;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<FreeToolPageParams[]> {
  return revenueTools.map((tool) => ({ slug: tool.freeSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<FreeToolPageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getRevenueToolByFreeSlug(slug);
  if (!tool) {
    return {};
  }

  return createPageMetadata({
    title: `${tool.freeTitle} | SectorCalc`,
    description: `${tool.freeValue} Unlock premium decision tools for pricing, cost and margin risk.`,
    path: `/tools/free/${tool.freeSlug}`,
  });
}

export default async function FreeRevenueToolRoute({
  params,
}: {
  params: Promise<FreeToolPageParams>;
}) {
  const { slug } = await params;
  const tool = getRevenueToolByFreeSlug(slug);

  if (!tool) {
    notFound();
  }

  return <FreeToolPage tool={tool} />;
}
