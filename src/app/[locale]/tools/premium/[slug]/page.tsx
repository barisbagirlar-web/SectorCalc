import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PremiumToolPage } from "@/components/tools/PremiumToolPage";
import type { AppLocale } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/metadata";
import {
  getPremiumRevenueRouteSlugs,
  getRevenueToolByPremiumRouteSlug,
} from "@/lib/tools/revenue-tools";

interface PremiumToolPageParams {
  slug: string;
}

interface PremiumToolRouteParams extends PremiumToolPageParams {
  locale: string;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<PremiumToolPageParams[]> {
  return getPremiumRevenueRouteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PremiumToolRouteParams>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const tool = getRevenueToolByPremiumRouteSlug(slug);
  if (!tool) {
    return {};
  }

  return createPageMetadata({
    title: `${tool.paidTitle} | SectorCalc Pro`,
    description: `${tool.paidValue} Premium decision tool for pricing, cost and margin risk.`,
    path: `/tools/premium/${slug}`,
    locale: locale as AppLocale,
  });
}

export default async function PremiumRevenueToolRoute({
  params,
}: {
  params: Promise<PremiumToolRouteParams>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const tool = getRevenueToolByPremiumRouteSlug(slug);

  if (!tool) {
    notFound();
  }

  return (
    <>
      <div className="sr-only">
        <h1>{tool.paidTitle}</h1>
        <p>{tool.paidValue}</p>
      </div>
      <PremiumToolPage tool={tool} routeSlug={slug} />
    </>
  );
}
