/**
 * Canonical free-tool route slugs — revenue free pages take precedence over traffic catalog.
 */

import { listFreeTrafficSlugs } from "@/lib/tools/free-traffic-catalog";
import { revenueTools } from "@/lib/tools/revenue-tools";

export function listRevenueFreeSlugs(): readonly string[] {
  return revenueTools.map((tool) => tool.freeSlug);
}

export function listTrafficOnlyFreeSlugs(): readonly string[] {
  const revenueSlugs = new Set(listRevenueFreeSlugs());
  return listFreeTrafficSlugs().filter((slug) => !revenueSlugs.has(slug));
}

/** All `/tools/free/[slug]` static routes (revenue + traffic-only). */
export function listAllFreeToolSlugs(): readonly string[] {
  return [...listRevenueFreeSlugs(), ...listTrafficOnlyFreeSlugs()];
}

export function getFreeToolRoutePath(slug: string): string {
  return `/tools/free/${slug}`;
}
