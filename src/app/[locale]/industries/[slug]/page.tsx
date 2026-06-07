import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { IndustryPageContent } from "@/components/pages/IndustryPageContent";
import { getIndustryBySlug } from "@/data/industries";
import { industryRegistry, type IndustrySlug } from "@/lib/tools/industry-registry";
import { createPageMetadata } from "@/lib/metadata";

interface IndustryPageParams {
 slug: IndustrySlug;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<IndustryPageParams[]> {
 return industryRegistry.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
 params,
}: {
 params: Promise<IndustryPageParams>;
}): Promise<Metadata> {
 const { slug } = await params;
 const industry = getIndustryBySlug(slug);
 if (!industry) {
 return {};
 }

 return createPageMetadata({
 title: `${industry.name} Cost & Margin Tools`,
 description: `Use SectorCalc tools to check ${industry.name} cost risk, bid margin and hidden profit leaks before accepting work.`,
 path: industry.href,
 });
}

export default async function IndustryDetailPage({
 params,
}: {
 params: Promise<IndustryPageParams>;
}) {
 const { slug } = await params;
 const industry = getIndustryBySlug(slug);

 if (!industry) {
 notFound();
 }

 return (
 <PageLayout>
 <IndustryPageContent industry={industry} />
 </PageLayout>
 );
}
