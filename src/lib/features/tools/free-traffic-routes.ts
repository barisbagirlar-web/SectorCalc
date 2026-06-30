/**
 * Canonical tool route slugs — all calculators use /tools/generated/[slug].
 */

import { listFreeTrafficCalculatorSlugs } from "@/lib/features/tools/free-traffic-calculators";
import { CANONICAL_PREMIUM_SLUGS } from "@/lib/features/tools/canonical-tool-slugs";
import { listTrafficOnlyFreeSlugs } from "@/lib/features/tools/free-traffic-catalog";
import { getPremiumRevenueRouteSlugs } from "@/lib/features/tools/revenue-tools";
import { resolvePremiumToolPath } from "@/lib/features/tools/paths";

export function listRevenueFreeSlugs(): readonly string[] {
  return [...CANONICAL_PREMIUM_SLUGS];
}

export function listAllFreeToolSlugs(): readonly string[] {
  return [...listRevenueFreeSlugs(), ...listTrafficOnlyFreeSlugs()];
}

export function listPublicFreeToolSlugs(): readonly string[] {
  return listFreeTrafficCalculatorSlugs();
}

export function getFreeToolRoutePath(slug: string): string {
  return `/tools/generated/${slug}`;
}

export function getPremiumToolRoutePath(slug: string): string {
  return resolvePremiumToolPath(slug);
}

export function listAllPremiumToolRouteSlugs(): readonly string[] {
  return getPremiumRevenueRouteSlugs();
}
