import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { IndustryPageContent } from "@/components/pages/IndustryPageContent";
import { getIndustryBySlug } from "@/data/industries";
import { getLocalizedIndustryHub } from "@/data/industry-hub-i18n";
import { industryRegistry, type IndustrySlug } from "@/lib/tools/industry-registry";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

interface IndustryPageParams {
 locale: string;
 slug: IndustrySlug;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ slug: IndustrySlug }[]> {
 return industryRegistry.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
 params,
}: {
 params: Promise<IndustryPageParams>;
}): Promise<Metadata> {
 const { locale, slug } = await params;
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
 locale: locale as AppLocale,
 });
}

export default async function IndustryDetailPage({
 params,
}: {
 params: Promise<IndustryPageParams>;
}) {
 const { locale, slug } = await params;
 setRequestLocale(locale);
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
