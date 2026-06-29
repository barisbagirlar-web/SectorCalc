import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { IndustryPageContent } from "@/components/pages/IndustryPageContent";
import { getIndustryBySlug } from "@/data/industries";
import { getLocalizedIndustryHub } from "@/data/industry-hub-i18n";
import { industryRegistry, type IndustrySlug } from "@/lib/tools/industry-registry";
import { createPageMetadata } from "@/lib/metadata";

interface IndustryPageParams {
 locale: string;
 slug: IndustrySlug;
}

export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams(): Promise<{ slug: IndustrySlug }[]> {
  return []; // HACK: bypass huge SSG build for fast Firebase deploy
 return industryRegistry.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
 params,
}: {
 params: Promise<IndustryPageParams>;
}): Promise<Metadata> {
 const { slug } = await params;
  const locale = "en";
 const industry = getIndustryBySlug(slug);
 if (!industry) {
 return {};
 }

 const localizedHub = getLocalizedIndustryHub(slug, locale);
 const title = localizedHub?.hubTitle ?? `${industry.name} Cost & Margin Tools`;
 const description =
 localizedHub?.painStatement ??
 `Use SectorCalc tools to check ${industry.name} cost risk, bid margin and hidden profit leaks before accepting work.`;

 return createPageMetadata({
 title,
 description,
 path: industry.href,
 locale: locale as "en",
 });
}

export default async function IndustryDetailPage({
 params,
}: {
 params: Promise<IndustryPageParams>;
}) {
 const { slug } = await params;
  const locale = "en";
 
 const industry = getIndustryBySlug(slug);

 if (!industry) {
 notFound();
 }

 return (
 <PageLayout>
 <IndustryPageContent industry={industry} locale={locale} />
 </PageLayout>
 );
}
