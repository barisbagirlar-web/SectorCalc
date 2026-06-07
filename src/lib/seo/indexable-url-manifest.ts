/**
 * Public indexable URL manifest for GSC inspection and IndexNow submission.
 * EN/TR locales only. Excludes admin, api, print, checkout and debug routes.
 */

import { listAuthorityGuideSlugs } from "@/lib/content/authority-guides";
import { getAuthorityGuideRoutePath } from "@/lib/content/authority-links";
import { getPremiumSchemaRoutePath } from "@/lib/seo/build-sitemap";
import { listProgrammaticSeoSlugs } from "@/lib/seo/programmatic-seo-pages";
import {
  getFreeToolRoutePath,
  listAllFreeToolSlugs,
} from "@/lib/tools/free-traffic-routes";
import { listPremiumSchemaSlugs } from "@/lib/premium-schema/schemas/index";

export type IndexableUrlType =
  | "core"
  | "hub"
  | "free_tool"
  | "premium_analyzer"
  | "seo_landing"
  | "authority_guide";

export type IndexableUrlPriority = "critical" | "high" | "medium";

export type IndexableLocale = "en" | "tr";

export type IndexableUrlItem = {
  readonly path: string;
  readonly type: IndexableUrlType;
  readonly priority: IndexableUrlPriority;
  readonly locale: IndexableLocale;
  readonly inspectionOrder: number;
};

export const INDEXABLE_LOCALES: readonly IndexableLocale[] = ["en", "tr"] as const;

/** Static public hub paths (no locale prefix). */
const CORE_HUB_STATIC_PATHS: readonly {
  readonly path: string;
  readonly type: IndexableUrlType;
  readonly priority: IndexableUrlPriority;
}[] = [
  { path: "/", type: "core", priority: "critical" },
  { path: "/free-tools", type: "hub", priority: "critical" },
  { path: "/premium-tools", type: "hub", priority: "critical" },
  { path: "/categories", type: "hub", priority: "critical" },
  { path: "/industries", type: "hub", priority: "critical" },
  { path: "/pricing", type: "hub", priority: "critical" },
  { path: "/beta-partner", type: "hub", priority: "high" },
  { path: "/how-it-works", type: "hub", priority: "medium" },
  { path: "/for-consultants", type: "hub", priority: "medium" },
  { path: "/privacy", type: "core", priority: "medium" },
  { path: "/terms", type: "core", priority: "medium" },
  { path: "/disclaimer", type: "core", priority: "medium" },
] as const;

/** GSC-critical paths (EN) — used to seed inspectionOrder. */
const CRITICAL_INSPECTION_PATHS: readonly string[] = [
  "/en",
  "/en/free-tools",
  "/en/premium-tools",
  "/en/categories",
  "/en/industries",
  "/en/pricing",
  "/en/seo/manufacturing-cost-calculators",
  "/en/guides/what-is-oee-and-how-to-calculate-it",
  "/en/tools/free/area-converter",
  "/en/tools/free/oee-calculator",
  "/en/tools/free/concrete-volume-calculator",
  "/en/tools/premium-schema/cnc-oee-loss",
  "/en/tools/premium-schema/carbon-footprint-compliance-risk",
] as const;

const HIGH_PRIORITY_FREE_SLUGS = new Set([
  "area-converter",
  "oee-calculator",
  "concrete-volume-calculator",
  "scrap-rate-calculator",
  "route-cost-calculator",
  "food-cost-calculator",
  "kwh-cost-calculator",
  "break-even-calculator",
]);

const HIGH_PRIORITY_PREMIUM_SLUGS = new Set([
  "cnc-oee-loss",
  "carbon-footprint-compliance-risk",
  "construction-project-overrun",
  "logistics-route-loss",
  "energy-peak-cost",
  "restaurant-menu-margin-leak",
]);

const EXCLUDED_PATH_PATTERNS: readonly RegExp[] = [
  /\/admin(?:\/|$)/,
  /^\/api(?:\/|$)/,
  /\/print(?:\/|$)/,
  /^\/checkout(?:\/|$)/,
  /\/debug(?:\/|$)/,
];

function normalizeStaticPath(path: string): string {
  if (!path.startsWith("/")) {
    return `/${path}`;
  }
  return path === "" ? "/" : path;
}

function buildLocalizedPath(locale: IndexableLocale, staticPath: string): string {
  const normalized = normalizeStaticPath(staticPath);
  if (normalized === "/") {
    return `/${locale}`;
  }
  return `/${locale}${normalized}`;
}

function getProgrammaticSeoRoutePath(slug: string): string {
  return `/seo/${slug}`;
}

export function isPathIndexable(path: string): boolean {
  const normalized = normalizeStaticPath(path);
  return !EXCLUDED_PATH_PATTERNS.some((pattern) => pattern.test(normalized));
}

function assignInspectionOrders(items: IndexableUrlItem[]): IndexableUrlItem[] {
  const orderByPath = new Map<string, number>();
  CRITICAL_INSPECTION_PATHS.forEach((path, index) => {
    orderByPath.set(path, index + 1);
  });

  let nextOrder = CRITICAL_INSPECTION_PATHS.length + 1;

  const priorityRank: Record<IndexableUrlPriority, number> = {
    critical: 0,
    high: 1,
    medium: 2,
  };

  const sorted = [...items].sort((a, b) => {
    const rankDiff = priorityRank[a.priority] - priorityRank[b.priority];
    if (rankDiff !== 0) {
      return rankDiff;
    }
    if (a.locale !== b.locale) {
      return a.locale === "en" ? -1 : 1;
    }
    return a.path.localeCompare(b.path);
  });

  return sorted.map((item) => {
    const existing = orderByPath.get(item.path);
    if (existing !== undefined) {
      return { ...item, inspectionOrder: existing };
    }
    const assigned = nextOrder;
    nextOrder += 1;
    return { ...item, inspectionOrder: assigned };
  });
}

export function getIndexableUrlManifest(): IndexableUrlItem[] {
  const items: IndexableUrlItem[] = [];

  for (const locale of INDEXABLE_LOCALES) {
    for (const entry of CORE_HUB_STATIC_PATHS) {
      const path = buildLocalizedPath(locale, entry.path);
      if (!isPathIndexable(path)) {
        continue;
      }
      items.push({
        path,
        type: entry.type,
        priority: entry.priority,
        locale,
        inspectionOrder: 0,
      });
    }

    for (const seoSlug of listProgrammaticSeoSlugs()) {
      const path = buildLocalizedPath(locale, getProgrammaticSeoRoutePath(seoSlug));
      items.push({
        path,
        type: "seo_landing",
        priority: seoSlug === "manufacturing-cost-calculators" ? "critical" : "high",
        locale,
        inspectionOrder: 0,
      });
    }

    for (const guideSlug of listAuthorityGuideSlugs()) {
      const path = buildLocalizedPath(locale, getAuthorityGuideRoutePath(guideSlug));
      items.push({
        path,
        type: "authority_guide",
        priority:
          guideSlug === "what-is-oee-and-how-to-calculate-it" ? "critical" : "high",
        locale,
        inspectionOrder: 0,
      });
    }

    for (const freeSlug of listAllFreeToolSlugs()) {
      const path = buildLocalizedPath(locale, getFreeToolRoutePath(freeSlug));
      items.push({
        path,
        type: "free_tool",
        priority: HIGH_PRIORITY_FREE_SLUGS.has(freeSlug) ? "high" : "medium",
        locale,
        inspectionOrder: 0,
      });
    }

    for (const premiumSlug of listPremiumSchemaSlugs()) {
      const path = buildLocalizedPath(locale, getPremiumSchemaRoutePath(premiumSlug));
      items.push({
        path,
        type: "premium_analyzer",
        priority: HIGH_PRIORITY_PREMIUM_SLUGS.has(premiumSlug) ? "high" : "medium",
        locale,
        inspectionOrder: 0,
      });
    }
  }

  const deduped = dedupeManifestItems(items);
  return assignInspectionOrders(deduped).sort((a, b) => a.inspectionOrder - b.inspectionOrder);
}

function dedupeManifestItems(items: IndexableUrlItem[]): IndexableUrlItem[] {
  const byPath = new Map<string, IndexableUrlItem>();
  for (const item of items) {
    if (!isPathIndexable(item.path)) {
      continue;
    }
    if (!byPath.has(item.path)) {
      byPath.set(item.path, item);
    }
  }
  return [...byPath.values()];
}

export function getIndexableUrlPaths(): readonly string[] {
  return getIndexableUrlManifest().map((item) => item.path);
}

export function normalizeSiteHost(hostOrUrl: string): string {
  const trimmed = hostOrUrl.trim().replace(/\/$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return new URL(trimmed).host;
  }
  return trimmed.replace(/^\/\//, "");
}

export function buildIndexableFullUrl(path: string, host: string): string {
  const normalizedHost = normalizeSiteHost(host);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `https://${normalizedHost}${normalizedPath}`;
}

export function getIndexableFullUrls(host = "sectorcalc-bf412.web.app"): readonly string[] {
  const normalizedHost = normalizeSiteHost(host);
  return getIndexableUrlPaths().map((path) => buildIndexableFullUrl(path, normalizedHost));
}

export function countIndexableUrlsByType(): Record<IndexableUrlType, number> {
  const counts: Record<IndexableUrlType, number> = {
    core: 0,
    hub: 0,
    free_tool: 0,
    premium_analyzer: 0,
    seo_landing: 0,
    authority_guide: 0,
  };
  for (const item of getIndexableUrlManifest()) {
    counts[item.type] += 1;
  }
  return counts;
}

export function getManifestEnPathSet(): ReadonlySet<string> {
  return new Set(
    getIndexableUrlManifest()
      .filter((item) => item.locale === "en")
      .map((item) => item.path),
  );
}
