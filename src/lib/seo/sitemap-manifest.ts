/**
 * Sitemap source of truth — all public indexable routes derived from catalogs.
 */

import { listAuthorityGuideSlugs } from "@/lib/content/authority-guides";
import { getAuthorityGuideRoutePath } from "@/lib/content/authority-links";
import {
  DEFAULT_LOCALE,
  getActiveSitemapLocales,
  SITE_BASE_URL,
  type SupportedLocale,
} from "@/lib/seo/global-seo-config";
import { listProgrammaticSeoSlugs } from "@/lib/seo/programmatic-seo-pages";
import { listPremiumSchemaSlugs } from "@/lib/premium-schema/schemas/index";
import {
  getFreeToolRoutePath,
  listAllFreeToolSlugs,
} from "@/lib/tools/free-traffic-routes";

export type SitemapRouteType =
  | "core"
  | "hub"
  | "free_tool"
  | "premium_analyzer"
  | "seo_landing"
  | "authority_guide";

export type SitemapChangeFrequency = "daily" | "weekly" | "monthly" | "yearly";

export type SitemapManifestItem = {
  readonly path: string;
  readonly type: SitemapRouteType;
  readonly priority: number;
  readonly changeFrequency: SitemapChangeFrequency;
  readonly locales: readonly SupportedLocale[];
};

const DEFAULT_LOCALES = getActiveSitemapLocales();

const EXCLUDED_PATH_PATTERNS: readonly RegExp[] = [
  /\/admin(?:\/|$)/,
  /^\/api(?:\/|$)/,
  /\/print(?:\/|$)/,
  /^\/checkout(?:\/|$)/,
  /\/debug(?:\/|$)/,
  /\/preview(?:\/|$)/,
];

function normalizePath(path: string): string {
  if (!path.startsWith("/")) {
    return `/${path}`;
  }
  return path === "" ? "/" : path;
}

function createItem(
  path: string,
  type: SitemapRouteType,
  priority: number,
  changeFrequency: SitemapChangeFrequency,
  locales: readonly SupportedLocale[] = DEFAULT_LOCALES,
): SitemapManifestItem {
  return {
    path: normalizePath(path),
    type,
    priority,
    changeFrequency,
    locales,
  };
}

export function isSitemapPathAllowed(path: string): boolean {
  const normalized = normalizePath(path);
  return !EXCLUDED_PATH_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function getPremiumSchemaRoutePath(slug: string): string {
  return `/tools/premium-schema/${slug}`;
}

export function getProgrammaticSeoRoutePath(slug: string): string {
  return `/seo/${slug}`;
}

export function getCoreSitemapRoutes(): readonly SitemapManifestItem[] {
  return [
    createItem("/", "core", 1.0, "weekly"),
    createItem("/pricing", "core", 0.85, "monthly"),
    createItem("/privacy", "core", 0.5, "yearly"),
    createItem("/terms", "core", 0.5, "yearly"),
    createItem("/disclaimer", "core", 0.5, "yearly"),
  ];
}

export function getHubSitemapRoutes(): readonly SitemapManifestItem[] {
  return [
    createItem("/categories", "hub", 0.9, "weekly"),
    createItem("/free-tools", "hub", 0.9, "weekly"),
    createItem("/premium-tools", "hub", 0.9, "weekly"),
    createItem("/industries", "hub", 0.9, "monthly"),
    createItem("/beta-partner", "hub", 0.75, "monthly"),
    createItem("/how-it-works", "hub", 0.7, "monthly"),
    createItem("/for-consultants", "hub", 0.7, "monthly"),
  ];
}

export function getFreeToolSitemapRoutes(): readonly SitemapManifestItem[] {
  return listAllFreeToolSlugs().map((slug) =>
    createItem(getFreeToolRoutePath(slug), "free_tool", 0.75, "monthly"),
  );
}

export function getPremiumAnalyzerSitemapRoutes(): readonly SitemapManifestItem[] {
  return listPremiumSchemaSlugs().map((slug) =>
    createItem(getPremiumSchemaRoutePath(slug), "premium_analyzer", 0.8, "monthly"),
  );
}

export function getSeoLandingSitemapRoutes(): readonly SitemapManifestItem[] {
  return listProgrammaticSeoSlugs().map((slug) =>
    createItem(getProgrammaticSeoRoutePath(slug), "seo_landing", 0.85, "monthly"),
  );
}

export function getAuthorityGuideSitemapRoutes(): readonly SitemapManifestItem[] {
  return listAuthorityGuideSlugs().map((slug) =>
    createItem(getAuthorityGuideRoutePath(slug), "authority_guide", 0.8, "monthly"),
  );
}

function dedupeManifestItems(items: readonly SitemapManifestItem[]): SitemapManifestItem[] {
  const byPath = new Map<string, SitemapManifestItem>();
  for (const item of items) {
    if (!isSitemapPathAllowed(item.path)) {
      continue;
    }
    if (!byPath.has(item.path)) {
      byPath.set(item.path, item);
    }
  }
  return [...byPath.values()];
}

export function getSitemapManifest(): readonly SitemapManifestItem[] {
  return dedupeManifestItems([
    ...getCoreSitemapRoutes(),
    ...getHubSitemapRoutes(),
    ...getFreeToolSitemapRoutes(),
    ...getPremiumAnalyzerSitemapRoutes(),
    ...getSeoLandingSitemapRoutes(),
    ...getAuthorityGuideSitemapRoutes(),
  ]);
}

export function buildLocalizedUrl(
  path: string,
  locale: SupportedLocale,
  baseUrl: string = SITE_BASE_URL,
): string {
  const normalizedPath = normalizePath(path);
  const base = baseUrl.replace(/\/$/, "");
  if (normalizedPath === "/") {
    return `${base}/${locale}`;
  }
  return `${base}/${locale}${normalizedPath}`;
}

export function buildLocalizedPath(path: string, locale: SupportedLocale): string {
  const normalizedPath = normalizePath(path);
  if (normalizedPath === "/") {
    return `/${locale}`;
  }
  return `/${locale}${normalizedPath}`;
}

export function buildAlternates(
  path: string,
  locales: readonly SupportedLocale[],
  baseUrl: string = SITE_BASE_URL,
): { languages: Record<string, string> } {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = buildLocalizedUrl(path, locale, baseUrl);
  }
  languages["x-default"] = buildLocalizedUrl(path, DEFAULT_LOCALE, baseUrl);
  return { languages };
}

export function countSitemapEntries(): number {
  return getSitemapManifest().reduce((sum, item) => sum + item.locales.length, 0);
}

export function countAuthorityGuideSitemapEntries(): number {
  return getAuthorityGuideSitemapRoutes().reduce((sum, item) => sum + item.locales.length, 0);
}

/** @deprecated Use getSitemapManifest — legacy static route list for tests. */
export const SITEMAP_STATIC_ROUTES = [
  "/",
  "/free-tools",
  "/premium-tools",
  "/categories",
  "/industries",
  "/pricing",
  "/beta-partner",
  "/how-it-works",
  "/for-consultants",
  "/privacy",
  "/terms",
  "/disclaimer",
] as const;

export function countExpectedSitemapMinimum(): number {
  return countSitemapEntries();
}
