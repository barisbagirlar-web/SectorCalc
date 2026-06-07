import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import { INDUSTRIES } from "@/data/industries";
import { ALL_TOOLS } from "@/data/tools";
import { locales } from "@/i18n/locales";
import { listSectorRegistryKeys } from "@/lib/os/registry/sectors";
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

export function getPremiumSchemaRoutePath(slug: string): string {
  return `/tools/premium-schema/${slug}`;
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
        priority: path === "/" ? 1 : 0.8,
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
        priority: 0.72,
      });
    }

    for (const premiumSlug of listPremiumSchemaSlugs()) {
      entries.push({
        url: `${base}/${locale}${getPremiumSchemaRoutePath(premiumSlug)}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.78,
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
    INDUSTRIES.length +
    ALL_TOOLS.length +
    listAllFreeToolSlugs().length +
    listPremiumSchemaSlugs().length +
    listSectorRegistryKeys().length;

  return localeCount * perLocale;
}
