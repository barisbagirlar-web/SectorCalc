export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { LandingPageContent } from "@/components/landing/LandingPageContent";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { buildHomeJsonLd } from "@/lib/features/semantic/build-home-jsonld";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { getFreeToolCount } from "@/lib/features/tools/tool-counts";
import { getAllTools } from "@/lib/features/tools/all-tools-data";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  if (locale !== "en") notFound();

  return createPageMetadata({
    title: "SectorCalc - Engineering-Grade Calculation Platform",
    description: "Standards-backed calculation models for manufacturing, engineering, and operations. Calculate, verify, and support your technical decisions.",
    path: "/",
    locale: "en",
  });
}

export default async function HomePage({ params }: PageProps) {
  const locale = "en";
  if (locale !== "en") notFound();

  const freeCount = getFreeToolCount();
  const rawTools = getAllTools(locale);

  const sectorCounts: Record<string, number> = {};

  const allTools = rawTools.map((tool) => {
    const sec = tool.sector || tool.category || "General";
    sectorCounts[sec] = (sectorCounts[sec] || 0) + 1;
    return {
      sec,
      name: tool.name || "Tool",
      eq: tool.description?.substring(0, 40) || "",
      slug: tool.slug || "",
    };
  });

  const sectors = Object.entries(sectorCounts)
    .map(([name, n]) => ({
      k: name.substring(0, 4).toUpperCase(),
      name,
      n,
    }))
    .sort((a, b) => b.n - a.n);

  const popularTools = allTools.slice(0, 12);

  return (
    <PageLayout hideFooterCta={true}>
      <SemanticJsonLd data={buildHomeJsonLd(locale)} />
      <LandingPageContent freeCount={freeCount} sectors={sectors} tools={popularTools} />
    </PageLayout>
  );
}
