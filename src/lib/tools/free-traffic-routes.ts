/**
 * Canonical tool route slugs — all calculators use /tools/generated/[slug].
 */

import { listFreeTrafficCalculatorSlugs } from "@/lib/tools/free-traffic-calculators";
import { CANONICAL_PREMIUM_SLUGS } from "@/lib/tools/canonical-tool-slugs";
import { listTrafficOnlyFreeSlugs } from "@/lib/tools/free-traffic-catalog";
import { getPremiumRevenueRouteSlugs } from "@/lib/tools/revenue-tools";

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
  return `/tools/generated/${slug.replace(/-premium$/, "")}`;
}

export function listAllPremiumToolRouteSlugs(): readonly string[] {
  return getPremiumRevenueRouteSlugs();
}
