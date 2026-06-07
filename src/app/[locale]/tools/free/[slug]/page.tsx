import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FreeToolPage } from "@/components/tools/FreeToolPage";
import { FreeTrafficToolPage } from "@/components/tools/FreeTrafficToolPage";
import { createPageMetadata } from "@/lib/metadata";
import {
  getFreeTrafficToolBySlug,
  listFreeTrafficSlugs,
} from "@/lib/tools/free-traffic-catalog";
import {
  getRevenueToolByFreeSlug,
  revenueTools,
} from "@/lib/tools/revenue-tools";

interface FreeToolPageParams {
  slug: string;
}

export const dynamic = "force-static";
export const dynamicParams = false;

function listAllFreeSlugs(): string[] {
  const revenueSlugs = revenueTools.map((tool) => tool.freeSlug);
  const trafficOnly = listFreeTrafficSlugs().filter(
    (slug) => !revenueSlugs.includes(slug),
  );
  return [...revenueSlugs, ...trafficOnly];
}

export async function generateStaticParams(): Promise<FreeToolPageParams[]> {
  return listAllFreeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<FreeToolPageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const revenueTool = getRevenueToolByFreeSlug(slug);
  if (revenueTool) {
    return createPageMetadata({
      title: `${revenueTool.freeTitle} | SectorCalc`,
      description: `${revenueTool.freeValue} Unlock premium decision tools for pricing, cost and margin risk.`,
      path: `/tools/free/${revenueTool.freeSlug}`,
    });
  }

  const trafficTool = getFreeTrafficToolBySlug(slug);
  if (!trafficTool) {
    return {};
  }

  return createPageMetadata({
    title: trafficTool.seoTitle,
    description: trafficTool.seoDescription,
    path: `/tools/free/${trafficTool.slug}`,
  });
}

export default async function FreeRevenueToolRoute({
  params,
}: {
  params: Promise<FreeToolPageParams>;
}) {
  const { slug } = await params;
  const revenueTool = getRevenueToolByFreeSlug(slug);

  if (revenueTool) {
    return <FreeToolPage tool={revenueTool} />;
  }

  const trafficTool = getFreeTrafficToolBySlug(slug);
  if (!trafficTool) {
    notFound();
  }

  return <FreeTrafficToolPage tool={trafficTool} />;
}
