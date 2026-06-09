import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import {
 getToolDefinition,
 isValidToolTier,
} from "@/data/tool-definitions";
import type { ToolSlug } from "@/data/tools";
import { createPageMetadata } from "@/lib/metadata";

interface ToolPageParams {
 tier: string;
 slug: string;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<ToolPageParams[]> {
 return [
 { tier: "free", slug: "machine-hour-estimator" },
 { tier: "free", slug: "project-cost-estimator" },
 { tier: "free", slug: "cleaning-cost-estimator" },
 { tier: "free", slug: "food-cost-calculator" },
 { tier: "free", slug: "product-margin-calculator" },
 // Legacy premium slugs only — revenue tools use /tools/premium/[paidSlug].
 { tier: "premium", slug: "cnc-minimum-safe-quote-analyzer" },
 { tier: "premium", slug: "return-rate-profit-erosion-tool" },
 ];
}

export async function generateMetadata({
 params,
}: {
 params: Promise<ToolPageParams>;
}): Promise<Metadata> {
 const { tier, slug } = await params;
 if (!isValidToolTier(tier)) return {};
 const definition = getToolDefinition(tier, slug as ToolSlug);
 if (!definition) return {};

 return createPageMetadata({
 title: definition.seo.title,
 description: definition.seo.description,
 path: definition.seo.canonicalPath,
 });
}

export default async function ToolPage({
 params,
}: {
 params: Promise<ToolPageParams>;
}) {
 const { tier, slug } = await params;

 if (!isValidToolTier(tier)) {
 notFound();
 }

 const definition = getToolDefinition(tier, slug as ToolSlug);

 if (!definition) {
 notFound();
 }

 return <ToolPageShell definition={definition} />;
}
