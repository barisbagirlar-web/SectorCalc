/**
 * Sitemap source of truth - all public indexable routes derived from catalogs.
 * Free V5.3.1 tool routes are quarantined (placeholder-polluted) — not included.
 * Only the /free-tools hub page appears (nofollow). Pro routes remain active.
 */

import { listAuthorityGuideSlugs } from "@/lib/content/authority-guides";
import { getAuthorityGuideRoutePath } from "@/lib/content/authority-links";
import { SITE_BASE_URL } from "@/lib/infrastructure/seo/global-seo-config";
import { listProgrammaticSeoSlugs } from "@/lib/infrastructure/seo/programmatic-seo-pages";
import { listPremiumToolSeoLandingSlugs } from "@/lib/infrastructure/seo/premium-tool-seo-landings";
import { listCaseStudySlugs } from "@/lib/features/case-studies/case-study-registry";
import { listPremiumSchemaSlugs } from "@/lib/features/premium-schema/schemas/index";

import { listGlobalCategories } from "@/lib/catalog/global-tool-category-taxonomy";
import { buildCategorizedToolIndex } from "@/lib/catalog/build-categorized-tool-index";
import { getPremiumRevenueRouteSlugs } from "@/lib/features/tools/revenue-tools";
import { listMigratedPremiumRouteSlugs } from "@/lib/features/freemium/resolve-free-to-premium-migration";

export type SitemapRouteType =
  | "core"
  | "hub"
  | "free_tool"
  | "premium_analyzer"
  | "seo_landing"
  | "authority_guide"
  | "ai_index";

export type SitemapChangeFrequency = "daily" | "weekly" | "monthly" | "yearly";

// V5.3.1 root-only: no locale alternates, single-en locale only.
export type SitemapManifestItem = {
  readonly path: string;
  readonly type: SitemapRouteType;
  readonly priority: number;
  readonly changeFrequency: SitemapChangeFrequency;
  readonly updatedAt?: Date;
};

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
  updatedAt?: Date,
): SitemapManifestItem {
  return {
    path: normalizePath(path),
    type,
    priority,
    changeFrequency,
    ...(updatedAt !== undefined ? { updatedAt } : {}),
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
    createItem("/calculators/fmea-rpn", "core", 0.9, "weekly"),
    createItem("/resources/fmea-rpn-technical-note", "core", 0.8, "weekly"),
  ];
}

export function getHubSitemapRoutes(): readonly SitemapManifestItem[] {
  return [
    createItem("/categories", "hub", 0.9, "weekly"),
    createItem("/premium-tools", "hub", 0.9, "weekly"),
    createItem("/calculator-library", "hub", 0.85, "monthly"),
    createItem("/industries", "hub", 0.9, "monthly"),
    createItem("/how-it-works", "hub", 0.7, "monthly"),
    createItem("/operating-system", "hub", 0.65, "monthly"),
    createItem("/for-consultants", "hub", 0.7, "monthly"),
  ];
}

export function getMigratedPremiumToolSitemapRoutes(): readonly SitemapManifestItem[] {
  return listMigratedPremiumRouteSlugs().map((slug) =>
    createItem(`/tools/premium/${slug}`, "premium_analyzer", 0.8, "monthly"),
  );
}

export function getActiveCategorizedToolSitemapRoutes(): readonly SitemapManifestItem[] {
  return buildCategorizedToolIndex()
    .filter((item) => item.publicStatus === "active" && item.routePath)
    .map((item) =>
      createItem(
        item.routePath!,
        "premium_analyzer",
        0.8,
        "monthly",
      ),
    );
}

export function getPremiumRevenueToolSitemapRoutes(): readonly SitemapManifestItem[] {
  return getPremiumRevenueRouteSlugs().map((slug) =>
    createItem(`/tools/pro/${slug}`, "premium_analyzer", 0.8, "monthly"),
  );
}

export function getAiIndexSitemapRoutes(): readonly SitemapManifestItem[] {
  const files = [
    "/llms.txt",
    "/ai.txt",
  ];
  return files.map((path) => createItem(path, "ai_index", 0.55, "weekly"));
}

export function getPremiumAnalyzerSitemapRoutes(): readonly SitemapManifestItem[] {
  return listPremiumSchemaSlugs().map((slug) =>
    createItem(getPremiumSchemaRoutePath(slug), "premium_analyzer", 0.8, "monthly"),
  );
}

export function getFreeToolSitemapRoutes(): readonly SitemapManifestItem[] {
  // V5.4 Core — Only the allowlisted Free pilot is indexed.
  // All other Free tools remain quarantined until V5.4 Core rebuild.
  // PRO inactive tools removed from sitemap.
  return [
    createItem("/free-tools", "hub", 0.3, "monthly"),
    createItem("/tools/free/break-even-and-margin-of-safety-analysis", "free_tool", 0.8, "monthly"),
  ];
}

export function getCaseStudySitemapRoutes(): readonly SitemapManifestItem[] {
  return [
    createItem("/case-studies", "hub", 0.74, "monthly"),
    ...listCaseStudySlugs().map((slug) =>
      createItem(`/case-studies/${slug}`, "hub", 0.72, "monthly"),
    ),
  ];
}

export function getSeoLandingSitemapRoutes(): readonly SitemapManifestItem[] {
  const programmatic = listProgrammaticSeoSlugs().map((slug) =>
    createItem(getProgrammaticSeoRoutePath(slug), "seo_landing", 0.85, "monthly"),
  );
  const premiumToolLandings = listPremiumToolSeoLandingSlugs().map((slug) =>
    createItem(getProgrammaticSeoRoutePath(slug), "seo_landing", 0.84, "monthly"),
  );
  return [...programmatic, ...premiumToolLandings];
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
    ...getActiveCategorizedToolSitemapRoutes(),
    ...getSeoLandingSitemapRoutes(),
    ...getCaseStudySitemapRoutes(),
    ...getAuthorityGuideSitemapRoutes(),
    ...getPremiumAnalyzerSitemapRoutes(),
    ...getFreeToolSitemapRoutes(),
    ...getAiIndexSitemapRoutes(),
  ]);
}

// V5.3.1 root-only stub: returns path as-is, no locale prefix.
export function buildLocalizedUrl(
  path: string,
  _locale: string,
  baseUrl: string = SITE_BASE_URL,
): string {
  const base = baseUrl.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

// V5.3.1 root-only stub: returns path as-is, no locale prefix.
export function buildLocalizedPath(path: string, _locale?: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export function countSitemapEntries(): number {
  return getSitemapManifest().length;
}

export function countAuthorityGuideSitemapEntries(): number {
  return getAuthorityGuideSitemapRoutes().length;
}

/** @deprecated Use getSitemapManifest - legacy static route list for tests. */
export const SITEMAP_STATIC_ROUTES = [
  "/",
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
  "/calculators/fmea-rpn",
  "/resources/fmea-rpn-technical-note",
] as const;

export function countExpectedSitemapMinimum(): number {
  return countSitemapEntries();
}
