/**
 * Single source of truth — approved slug lists only (premium-slugs.json + free-slugs.json).
 */

import freeSlugs from "../../../free-slugs.json";
import premiumSlugs from "../../../premium-slugs.json";

export const CANONICAL_PREMIUM_SLUGS = Object.freeze([...(premiumSlugs as readonly string[])]);
export const CANONICAL_FREE_SLUGS = Object.freeze([...(freeSlugs as readonly string[])]);

const premiumSlugSet = new Set<string>(CANONICAL_PREMIUM_SLUGS);

/** Free-only slugs (excludes overlap with premium list). */
export const CANONICAL_TRAFFIC_FREE_SLUGS = Object.freeze(
  CANONICAL_FREE_SLUGS.filter((slug) => !premiumSlugSet.has(slug)),
);

export function isCanonicalPremiumSlug(slug: string): boolean {
  return premiumSlugSet.has(slug.replace(/-premium$/, ""));
}

export function isCanonicalFreeSlug(slug: string): boolean {
  return (CANONICAL_FREE_SLUGS as readonly string[]).includes(slug);
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
  return new Set([...CANONICAL_PREMIUM_SLUGS, ...CANONICAL_FREE_SLUGS]).size;
}
