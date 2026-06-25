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

// removed ToolPageRouteParams

export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams(): Promise<ToolPageParams[]> {
  return []; // HACK: bypass huge SSG build for fast Firebase deploy
 return [];
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
 const locale = "en";
 

 if (!isValidToolTier(tier)) {
  notFound();
 }

 const definition = getToolDefinition(tier, slug as ToolSlug);

 if (!definition) {
  notFound();
 }

 return (
  <>
   <div className="sr-only" aria-hidden="true" data-calculation-form-shell="true" />
   <ToolPageShell definition={definition} locale={locale} />
  </>
 );
}
