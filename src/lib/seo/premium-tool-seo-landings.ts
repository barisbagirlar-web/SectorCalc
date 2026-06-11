/**
 * Premium tool SEO landings (SEO-P2).
 *
 * Extends the existing /seo/[slug] programmatic SEO route with one
 * search-intent landing per premium tool. Tool-specific values are derived
 * from the canonical revenue-tools registry; localized prose lives in the
 * `premiumSeo` i18n namespace and is filled with the tool name at render time.
 *
 * This is NOT a second SEO system: it reuses the /seo/[slug] route, layout,
 * and metadata helpers.
 */

import { getAllRevenueToolSpecs } from "@/lib/tools/revenue-tools";

export type PremiumSeoRelated = {
  readonly slug: string;
  readonly label: string;
};

export type PremiumToolSeoLanding = {
  /** Landing slug, equal to the premium tool route slug (paidSlug). */
  readonly slug: string;
  /** Brand tool name injected into localized templates. */
  readonly toolName: string;
  /** Sector slug from the revenue registry. */
  readonly sector: string;
  /** CTA target — the live premium tool. */
  readonly premiumHref: string;
  /** Canonical SEO landing path. */
  readonly seoHref: string;
  /** Internal-link mesh to sibling premium SEO landings. */
  readonly related: readonly PremiumSeoRelated[];
};

const SPECS = getAllRevenueToolSpecs();
const RELATED_COUNT = 4;

export function listPremiumToolSeoLandingSlugs(): readonly string[] {
  return SPECS.map((tool) => tool.paidSlug);
}

export function getPremiumToolSeoLandingBySlug(slug: string): PremiumToolSeoLanding | null {
  const index = SPECS.findIndex((tool) => tool.paidSlug === slug);
  if (index === -1) {
    return null;
  }

  const tool = SPECS[index];
  const related: PremiumSeoRelated[] = [];
  for (let offset = 1; offset <= RELATED_COUNT; offset += 1) {
    const sibling = SPECS[(index + offset) % SPECS.length];
    if (sibling.paidSlug !== tool.paidSlug) {
      related.push({ slug: sibling.paidSlug, label: sibling.paidTitle });
    }
  }

  return {
    slug: tool.paidSlug,
    toolName: tool.paidTitle,
    sector: tool.sector,
    premiumHref: `/tools/premium/${tool.paidSlug}`,
    seoHref: `/seo/${tool.paidSlug}`,
    related,
  };
}
