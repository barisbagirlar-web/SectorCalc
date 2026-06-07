import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import { INDUSTRIES } from "@/data/industries";
import { ALL_TOOLS } from "@/data/tools";
import { locales } from "@/i18n/locales";
import { listSectorRegistryKeys } from "@/lib/os/registry/sectors";
import { listProgrammaticSeoSlugs } from "@/lib/seo/programmatic-seo-pages";
import { listPremiumSchemaSlugs } from "@/lib/premium-schema/schemas/index";
import {
  getFreeToolRoutePath,
  listAllFreeToolSlugs,
} from "@/lib/tools/free-traffic-routes";

/** Public indexable static routes (no admin, api, print). */
export const SITEMAP_STATIC_ROUTES = [
  "/",
  "/free-tools",
  "/premium-tools",
  "/categories",
  "/how-it-works",
  "/industries",
  "/pricing",
  "/beta-partner",
  "/for-consultants",
  "/reports/sample-decision-report",
  "/cnc-quote-risk",
  "/construction-bid-margin",
  "/cleaning-contract-margin",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/audit",
  "/benchmarks",
  "/sustainability",
  "/os",
] as const;

const HIGH_PRIORITY_HUBS = new Set([
  "/",
  "/free-tools",
  "/premium-tools",
  "/categories",
  "/industries",
  "/pricing",
]);

const SEO_HUB_PRIORITY = 0.85;
const FREE_TOOL_PRIORITY = 0.75;
const PREMIUM_SCHEMA_PRIORITY = 0.8;
const DEFAULT_STATIC_PRIORITY = 0.8;

function getStaticPriority(path: string): number {
  if (path === "/") {
    return 1;
  }
  if (HIGH_PRIORITY_HUBS.has(path)) {
    return 0.9;
  }
  return DEFAULT_STATIC_PRIORITY;
}

export function getPremiumSchemaRoutePath(slug: string): string {
  return `/tools/premium-schema/${slug}`;
}

export function getProgrammaticSeoRoutePath(slug: string): string {
  return `/seo/${slug}`;
}

export function buildSitemapEntries(now = new Date()): MetadataRoute.Sitemap {
  const base = siteUrl;
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of SITEMAP_STATIC_ROUTES) {
      entries.push({
        url: `${base}/${locale}${path === "/" ? "" : path}`,
        lastModified: now,
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: getStaticPriority(path),
      });
    }

    for (const seoSlug of listProgrammaticSeoSlugs()) {
      entries.push({
        url: `${base}/${locale}${getProgrammaticSeoRoutePath(seoSlug)}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: SEO_HUB_PRIORITY,
      });
    }

    for (const industry of INDUSTRIES) {
      entries.push({
        url: `${base}/${locale}${industry.href}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    for (const tool of ALL_TOOLS) {
      entries.push({
        url: `${base}/${locale}${tool.href}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: tool.tier === "premium" ? 0.75 : 0.7,
      });
    }

    for (const freeSlug of listAllFreeToolSlugs()) {
      entries.push({
        url: `${base}/${locale}${getFreeToolRoutePath(freeSlug)}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: FREE_TOOL_PRIORITY,
      });
    }

    for (const premiumSlug of listPremiumSchemaSlugs()) {
      entries.push({
        url: `${base}/${locale}${getPremiumSchemaRoutePath(premiumSlug)}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: PREMIUM_SCHEMA_PRIORITY,
      });
    }

    for (const sectorKey of listSectorRegistryKeys()) {
      entries.push({
        url: `${base}/${locale}/audit/${sectorKey}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.85,
      });
    }
  }

  return entries;
}

export function countExpectedSitemapMinimum(): number {
  const localeCount = locales.length;
  const perLocale =
    SITEMAP_STATIC_ROUTES.length +
    listProgrammaticSeoSlugs().length +
    INDUSTRIES.length +
    ALL_TOOLS.length +
    listAllFreeToolSlugs().length +
    listPremiumSchemaSlugs().length +
    listSectorRegistryKeys().length;

  return localeCount * perLocale;
}
