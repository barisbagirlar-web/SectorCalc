/**
 * Canonical free-tool route slugs — revenue free pages take precedence over traffic catalog.
 */

import {
  isFreeToolMigratedToPremium,
  listMigratedPremiumRouteSlugs,
} from "@/lib/freemium/resolve-free-to-premium-migration";
import { listFreeTrafficSlugs } from "@/lib/tools/free-traffic-catalog";
import { getPremiumRevenueRouteSlugs, revenueTools } from "@/lib/tools/revenue-tools";

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

/** Free catalog + sitemap slugs excluding tools migrated to premium. */
export function listPublicFreeToolSlugs(): readonly string[] {
  return listAllFreeToolSlugs().filter((slug) => !isFreeToolMigratedToPremium(slug));
}

export function getFreeToolRoutePath(slug: string): string {
  return `/tools/free/${slug}`;
}

export function getPremiumToolRoutePath(slug: string): string {
  return `/tools/premium/${slug}`;
}

/** Revenue premium analyzers + migrated free calculators. */
export function listAllPremiumToolRouteSlugs(): readonly string[] {
  const slugs = new Set<string>([
    ...getPremiumRevenueRouteSlugs(),
    ...listMigratedPremiumRouteSlugs(),
  ]);
  return [...slugs].sort((a, b) => a.localeCompare(b));
}
