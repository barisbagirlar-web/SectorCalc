/**
 * All tools data - Free tools permanently purged.
 */
import type { PremiumCategorySlug } from "@/data/premium-categories";
import { CANONICAL_PREMIUM_SLUGS } from "@/lib/features/tools/canonical-tool-slugs";

export interface ToolEntry {
  slug: string;
  name: string;
  title: string;
  tier: "free" | "premium";
  category: string;
  categoryKey: string;
  categorySlug: string;
  sector: string;
  sectorKey: PremiumCategorySlug;
  premiumCategorySlug?: PremiumCategorySlug;
  premiumRequired: boolean;
  description: string;
  href: string;
  isPremium?: boolean;
  previewImage?: string;
}

export type ToolData = ToolEntry;

function slugToName(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
}

export function getAllTools(_locale?: string): ToolEntry[] {
  return [...CANONICAL_PREMIUM_SLUGS].map((slug) => ({
    slug,
    name: slugToName(slug),
    title: slugToName(slug),
    tier: "premium" as const,
    category: slug,
    categoryKey: slug,
    categorySlug: slug,
    sector: slug,
    sectorKey: "lean-production" as PremiumCategorySlug,
    premiumRequired: true,
    description: "",
    href: `/tools/pro/${slug}`,
  }));
}

export function getToolBySlug(slug: string): ToolEntry | undefined {
  return getAllTools().find((t) => t.slug === slug);
}

export function getPremiumTools(_locale?: string): ToolEntry[] {
  return getAllTools(_locale);
}

export function getFreeTools(): ToolEntry[] {
  return [];
}

export function getToolsByCategory(_category: string, _locale?: string): ToolEntry[] {
  return [];
}
