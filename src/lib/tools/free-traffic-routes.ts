/**
 * Canonical tool route slugs — all calculators use /tools/generated/[slug].
 */

import {
  isFreeToolMigratedToPremium,
  listMigratedPremiumRouteSlugs,
} from "@/lib/freemium/resolve-free-to-premium-migration";
import { listFreeTrafficCalculatorSlugs } from "@/lib/tools/free-traffic-calculators";
import { getPremiumRevenueRouteSlugs, revenueTools } from "@/lib/tools/revenue-tools";

export function listRevenueFreeSlugs(): readonly string[] {
  return revenueTools.map((tool) => tool.freeSlug);
}

export function listTrafficOnlyFreeSlugs(): readonly string[] {
  const revenueSlugs = new Set(listRevenueFreeSlugs());
  return listFreeTrafficCalculatorSlugs().filter((slug) => !revenueSlugs.has(slug));
}

export function listAllFreeToolSlugs(): readonly string[] {
  return [...listRevenueFreeSlugs(), ...listTrafficOnlyFreeSlugs()];
}

export function listPublicFreeToolSlugs(): readonly string[] {
  return listAllFreeToolSlugs().filter((slug) => !isFreeToolMigratedToPremium(slug));
}

export function getFreeToolRoutePath(slug: string): string {
  return `/tools/generated/${slug}`;
}

export function getPremiumToolRoutePath(slug: string): string {
  return `/tools/generated/${slug.replace(/-premium$/, "")}`;
}

export function listAllPremiumToolRouteSlugs(): readonly string[] {
  const slugs = new Set<string>([
    ...getPremiumRevenueRouteSlugs(),
    ...listMigratedPremiumRouteSlugs(),
  ]);
  return [...slugs].sort((a, b) => a.localeCompare(b));
}
