export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { NewLandingContent } from "@/components/landing/NewLandingContent";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { buildHomeJsonLd } from "@/lib/features/semantic/build-home-jsonld";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { getFreeToolCount } from "@/lib/features/tools/tool-counts";
import { getAllTools } from "@/lib/features/tools/all-tools-data";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata({
    title: "SectorCalc — Industrial Engineering Calculators",
    description: "Audit-proof engineering calculations built on VDI, ISO, and DIN standards. Stop guessing. Start calculating.",
    path: "/",
    locale: "en",
  });
}

export default async function HomePage() {
  const locale = "en";
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
    <PageLayout>
      <SemanticJsonLd data={buildHomeJsonLd(locale)} />
      <NewLandingContent freeCount={freeCount} sectors={sectors} tools={popularTools} />
    </PageLayout>
  );
}
