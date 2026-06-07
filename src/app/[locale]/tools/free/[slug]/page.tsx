import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { FreeToolPage } from "@/components/tools/FreeToolPage";
import { FreeTrafficToolPage } from "@/components/tools/FreeTrafficToolPage";
import type { AppLocale } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/metadata";
import { getFreeTrafficToolBySlug } from "@/lib/tools/free-traffic-catalog";
import { listAllFreeToolSlugs } from "@/lib/tools/free-traffic-routes";
import { getRevenueToolByFreeSlug } from "@/lib/tools/revenue-tools";

interface FreeToolPageParams {
  slug: string;
}

interface FreeToolRouteParams extends FreeToolPageParams {
  locale: string;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<FreeToolPageParams[]> {
  const slugs = listAllFreeToolSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<FreeToolRouteParams>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const appLocale = locale as AppLocale;
  const revenueTool = getRevenueToolByFreeSlug(slug);
  if (revenueTool) {
    return createPageMetadata({
      title: `${revenueTool.freeTitle} | SectorCalc`,
      description: `${revenueTool.freeValue} Unlock premium decision tools for pricing, cost and margin risk.`,
      path: `/tools/free/${revenueTool.freeSlug}`,
      locale: appLocale,
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
    locale: appLocale,
  });
}

export default async function FreeRevenueToolRoute({
  params,
}: {
  params: Promise<FreeToolRouteParams>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

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
