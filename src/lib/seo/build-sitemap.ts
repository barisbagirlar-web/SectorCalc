import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import { INDUSTRIES } from "@/data/industries";
import { ALL_TOOLS } from "@/data/tools";
import { locales } from "@/i18n/locales";
import { listSectorRegistryKeys } from "@/lib/os/registry/sectors";
import { listProgrammaticSeoSlugs } from "@/lib/seo/programmatic-seo-pages";
import { listPremiumSchemaSlugs } from "@/lib/premium-schema/schemas/index";
import { listAuthorityGuideSlugs } from "@/lib/content/authority-guides";
import { getAuthorityGuideRoutePath } from "@/lib/content/authority-links";
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
const GUIDE_PRIORITY = 0.82;
const DEFAULT_STATIC_PRIORITY = 0.8;

function getGuideRoutePath(slug: string): string {
  return getAuthorityGuideRoutePath(slug);
}

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

const SITEMAP_HREFLANG_LOCALES = ["en", "tr"] as const;

function buildLocalizedUrl(base: string, locale: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}/${locale}${normalized === "/" ? "" : normalized}`;
}

function buildEnTrAlternates(base: string, path: string): MetadataRoute.Sitemap[number]["alternates"] {
  const languages: Record<string, string> = {};
  for (const locale of SITEMAP_HREFLANG_LOCALES) {
    languages[locale] = buildLocalizedUrl(base, locale, path);
  }
  languages["x-default"] = buildLocalizedUrl(base, "en", path);
  return { languages };
}

export function buildSitemapEntries(now = new Date()): MetadataRoute.Sitemap {
  const base = siteUrl;
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of SITEMAP_STATIC_ROUTES) {
      entries.push({
        url: buildLocalizedUrl(base, locale, path),
        lastModified: now,
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: getStaticPriority(path),
        alternates: buildEnTrAlternates(base, path),
      });
    }

    for (const seoSlug of listProgrammaticSeoSlugs()) {
      const seoPath = getProgrammaticSeoRoutePath(seoSlug);
      entries.push({
        url: buildLocalizedUrl(base, locale, seoPath),
        lastModified: now,
        changeFrequency: "monthly",
        priority: SEO_HUB_PRIORITY,
        alternates: buildEnTrAlternates(base, seoPath),
      });
    }

    for (const industry of INDUSTRIES) {
      entries.push({
        url: buildLocalizedUrl(base, locale, industry.href),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: buildEnTrAlternates(base, industry.href),
      });
    }

    for (const tool of ALL_TOOLS) {
      entries.push({
        url: buildLocalizedUrl(base, locale, tool.href),
        lastModified: now,
        changeFrequency: "monthly",
        priority: tool.tier === "premium" ? 0.75 : 0.7,
        alternates: buildEnTrAlternates(base, tool.href),
      });
    }

    for (const freeSlug of listAllFreeToolSlugs()) {
      const freePath = getFreeToolRoutePath(freeSlug);
      entries.push({
        url: buildLocalizedUrl(base, locale, freePath),
        lastModified: now,
        changeFrequency: "monthly",
        priority: FREE_TOOL_PRIORITY,
        alternates: buildEnTrAlternates(base, freePath),
      });
    }

    for (const premiumSlug of listPremiumSchemaSlugs()) {
      const premiumPath = getPremiumSchemaRoutePath(premiumSlug);
      entries.push({
        url: buildLocalizedUrl(base, locale, premiumPath),
        lastModified: now,
        changeFrequency: "monthly",
        priority: PREMIUM_SCHEMA_PRIORITY,
        alternates: buildEnTrAlternates(base, premiumPath),
      });
    }

    for (const sectorKey of listSectorRegistryKeys()) {
      const auditPath = `/audit/${sectorKey}`;
      entries.push({
        url: buildLocalizedUrl(base, locale, auditPath),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.85,
        alternates: buildEnTrAlternates(base, auditPath),
      });
    }

    for (const guideSlug of listAuthorityGuideSlugs()) {
      const guidePath = getGuideRoutePath(guideSlug);
      entries.push({
        url: buildLocalizedUrl(base, locale, guidePath),
        lastModified: now,
        changeFrequency: "monthly",
        priority: GUIDE_PRIORITY,
        alternates: buildEnTrAlternates(base, guidePath),
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
    listSectorRegistryKeys().length +
    listAuthorityGuideSlugs().length;

  return localeCount * perLocale;
}

export function countAuthorityGuideSitemapEntries(localeCount = locales.length): number {
  return localeCount * listAuthorityGuideSlugs().length;
}
