/**
 * Premium tool SEO landings (SEO-P2).
 *
 * Extends the existing /seo/[slug] programmatic SEO route with one
 * search-intent landing per prioritized tool. Tool-specific values are derived
 * from the canonical revenue-tools and premium-schema registries; localized prose
 * lives in the `premiumSeo` i18n namespace.
 *
 * This is NOT a second SEO system: it reuses the /seo/[slug] route, layout,
 * and metadata helpers.
 */

import { getLocalizedPremiumSchema } from "@/data/premium-schema-i18n";
import { getLocalizedRevenueToolTitle } from "@/data/revenue-tools-i18n";
import { getPremiumCalculatorSchema } from "@/lib/features/premium-schema/schema-registry";
import {
  getSeoP2First50Entry,
  listSeoP2First50Slugs,
  type SeoP2LandingSource,
} from "@/lib/infrastructure/seo/seo-p2-first-50";
import {
  buildRevenueSeoLandingContext,
  buildSchemaSeoLandingContext,
  type PremiumSeoLandingContext,
} from "@/lib/infrastructure/seo/premium-tool-seo-context";
import { getRevenueToolByPaidSlug, type RevenueTool } from "@/lib/features/tools/revenue-tools";

export type PremiumSeoRelated = {
  readonly slug: string;
  readonly label: string;
};

export type PremiumToolSeoLanding = {
  /** Landing slug - paidSlug or premium-schema id. */
  readonly slug: string;
  readonly source: SeoP2LandingSource;
  /** Brand tool name injected into localized templates. */
  readonly toolName: string;
  /** Sector slug from the revenue or schema registry. */
  readonly sector: string;
  /** CTA target - live premium tool route. */
  readonly premiumHref: string;
  /** Canonical SEO landing path. */
  readonly seoHref: string;
  /** Data-driven placeholders for template fill. */
  readonly context: PremiumSeoLandingContext;
  /** Internal-link mesh to sibling SEO-P2 landings. */
  readonly related: readonly PremiumSeoRelated[];
};

const RELATED_COUNT = 4;

function resolveToolName(
  slug: string,
  source: SeoP2LandingSource,
  locale: string,
  fallback: string,
): string {
  if (source === "revenue") {
    return getLocalizedRevenueToolTitle(slug, "paid", locale, fallback);
  }
  return getLocalizedPremiumSchema(slug, locale)?.title ?? fallback;
}

function resolveSectorForSlug(slug: string, source: SeoP2LandingSource): string | null {
  if (source === "revenue") {
    return getRevenueToolByPaidSlug(slug)?.sector ?? null;
  }
  return getPremiumCalculatorSchema(slug)?.sectorSlug ?? null;
}

function resolveFallbackName(slug: string, source: SeoP2LandingSource): string {
  if (source === "revenue") {
    return getRevenueToolByPaidSlug(slug)?.paidTitle ?? slug;
  }
  return getPremiumCalculatorSchema(slug)?.name ?? slug;
}

function buildRelated(
  slug: string,
  sector: string,
  locale: string,
): readonly PremiumSeoRelated[] {
  const pool = listSeoP2First50Slugs().filter((candidate) => candidate !== slug);
  const sameSector: string[] = [];
  const other: string[] = [];

  for (const candidate of pool) {
    const entry = getSeoP2First50Entry(candidate);
    if (!entry) {
      continue;
    }
    const candidateSector = resolveSectorForSlug(candidate, entry.source);
    if (candidateSector === sector) {
      sameSector.push(candidate);
    } else {
      other.push(candidate);
    }
  }

  const ordered = [...sameSector, ...other];
  const related: PremiumSeoRelated[] = [];
  for (let i = 0; i < Math.min(RELATED_COUNT, ordered.length); i += 1) {
    const relatedSlug = ordered[i];
    const entry = getSeoP2First50Entry(relatedSlug);
    if (!entry) {
      continue;
    }
    related.push({
      slug: relatedSlug,
      label: resolveToolName(
        relatedSlug,
        entry.source,
        locale,
        resolveFallbackName(relatedSlug, entry.source),
      ),
    });
  }
  return related;
}

function buildFromRevenue(tool: RevenueTool, locale: string): PremiumToolSeoLanding {
  return {
    slug: tool.paidSlug,
    source: "revenue",
    toolName: tool.paidTitle,
    sector: tool.sector,
    premiumHref: `/tools/premium/${tool.paidSlug}`,
    seoHref: `/seo/${tool.paidSlug}`,
    context: buildRevenueSeoLandingContext(tool),
    related: buildRelated(tool.paidSlug, tool.sector, locale),
  };
}

function buildFromSchema(schemaId: string, locale: string): PremiumToolSeoLanding | null {
  const schema = getPremiumCalculatorSchema(schemaId);
  if (!schema) {
    return null;
  }

  return {
    slug: schemaId,
    source: "schema",
    toolName: schema.name,
    sector: schema.sectorSlug,
    premiumHref: `/tools/premium-schema/${schemaId}`,
    seoHref: `/seo/${schemaId}`,
    context: buildSchemaSeoLandingContext(schemaId, locale),
    related: buildRelated(schemaId, schema.sectorSlug, locale),
  };
}

export function listPremiumToolSeoLandingSlugs(): readonly string[] {
  return listSeoP2First50Slugs();
}

export function getPremiumToolSeoLandingBySlug(
  slug: string,
  locale = "en",
): PremiumToolSeoLanding | null {
  const entry = getSeoP2First50Entry(slug);
  if (!entry) {
    return null;
  }

  if (entry.source === "revenue") {
    const tool = getRevenueToolByPaidSlug(slug);
    if (!tool) {
      return null;
    }
    return buildFromRevenue(tool, locale);
  }

  return buildFromSchema(slug, locale);
}
