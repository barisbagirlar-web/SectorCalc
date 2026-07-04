/**
 * Single source of truth - approved slug lists only (premium-slugs.json).
 * Free tool slugs have been permanently purged.
 */

import premiumSlugs from "../../../../premium-slugs.json";

export const CANONICAL_PREMIUM_SLUGS = Object.freeze([...(premiumSlugs as readonly string[])]);
export const CANONICAL_FREE_SLUGS = Object.freeze([] as readonly string[]);

const premiumSlugSet = new Set<string>(CANONICAL_PREMIUM_SLUGS);

/** Free-only slugs (excludes overlap with premium list). Now always empty. */
export const CANONICAL_TRAFFIC_FREE_SLUGS = Object.freeze([] as readonly string[]);

export function isCanonicalPremiumSlug(slug: string): boolean {
  return premiumSlugSet.has(slug.replace(/-premium$/, ""));
}

export function isCanonicalFreeSlug(_slug: string): boolean {
  return false;
}

export function humanizeCanonicalSlug(slug: string): string {
  return slug
    .replace(/-premium$/, "")
    .replace(/-calculator$/i, "")
    .replace(/-converter$/i, "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function countCanonicalCatalogTools(): number {
  return new Set(CANONICAL_PREMIUM_SLUGS).size;
}

export function hasCanonicalToolCatalog(): boolean {
  return countCanonicalCatalogTools() > 0;
}
