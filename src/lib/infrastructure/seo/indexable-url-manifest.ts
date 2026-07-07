/**
 * Public indexable URL manifest for GSC inspection and IndexNow submission.
 * Derived from sitemap-manifest.ts (single source of truth).
 */

import {
  INDEXABLE_LOCALE_ROUTES,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/lib/infrastructure/seo/global-seo-config";
// V5.3.1 root-only: no locale-prefixed imports needed; buildLocalizedPath is a no-op stub.
import {
  buildLocalizedPath,
  getSitemapManifest,
  isSitemapPathAllowed,
  type SitemapManifestItem,
} from "@/lib/infrastructure/seo/sitemap-manifest";

export type IndexableUrlType =
  | "core"
  | "hub"
  | "free_tool"
  | "premium_analyzer"
  | "seo_landing"
  | "authority_guide"
  | "ai_index";

export type IndexableUrlPriority = "critical" | "high" | "medium";

export type IndexableLocale = SupportedLocale;

export type IndexableUrlItem = {
  readonly path: string;
  readonly type: IndexableUrlType;
  readonly priority: IndexableUrlPriority;
  readonly locale: IndexableLocale;
  readonly inspectionOrder: number;
};

export const INDEXABLE_LOCALES: readonly IndexableLocale[] = SUPPORTED_LOCALES.filter(
  (locale) => INDEXABLE_LOCALE_ROUTES[locale],
);

/** GSC-critical paths - used to seed inspectionOrder. */
const CRITICAL_INSPECTION_PATHS: readonly string[] = [
  "/",
  "/free-tools",
  "/pro-tools",
  "/categories",
  "/industries",
  "/pricing",
  "/seo/manufacturing-cost-calculators",
  "/guides/what-is-oee-and-how-to-calculate-it",
  "/tools/free/area-converter",
  "/tools/free/oee-calculator",
  "/tools/free/concrete-volume-calculator",
  "/tools/premium-schema/cnc-oee-loss",
  "/tools/premium-schema/carbon-footprint-compliance-risk",
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

export function isPathIndexable(path: string): boolean {
  if (
    path.endsWith(".json") ||
    path.endsWith(".jsonl") ||
    path.endsWith(".txt") ||
    path.endsWith(".xml")
  ) {
    return false;
  }
  return isSitemapPathAllowed(path);
}

function mapManifestType(type: SitemapManifestItem["type"]): IndexableUrlType {
  return type;
}

function mapManifestPriority(item: SitemapManifestItem): IndexableUrlPriority {
  if (
    item.path === "/" ||
    item.path === "/free-tools" ||
    item.path === "/pro-tools" ||
    item.path === "/categories" ||
    item.path === "/industries" ||
    item.path === "/pricing"
  ) {
    return "critical";
  }

  if (
    item.type === "seo_landing" &&
    item.path === "/seo/manufacturing-cost-calculators"
  ) {
    return "critical";
  }

  if (
    item.type === "authority_guide" &&
    item.path === "/guides/what-is-oee-and-how-to-calculate-it"
  ) {
    return "critical";
  }

  if (item.type === "free_tool") {
    const slug = item.path.replace("/tools/free/", "");
    return HIGH_PRIORITY_FREE_SLUGS.has(slug) ? "high" : "medium";
  }

  if (item.type === "premium_analyzer") {
    const slug = item.path.replace("/tools/premium-schema/", "");
    return HIGH_PRIORITY_PREMIUM_SLUGS.has(slug) ? "high" : "medium";
  }

  if (item.type === "seo_landing" || item.type === "authority_guide") {
    return "high";
  }

  if (item.type === "hub" && item.path === "/beta-partner") {
    return "high";
  }

  return "medium";
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

  for (const manifestItem of getSitemapManifest()) {
    const path = buildLocalizedPath(manifestItem.path);
    if (!isPathIndexable(path)) {
      continue;
    }

    items.push({
      path,
      type: mapManifestType(manifestItem.type),
      priority: mapManifestPriority(manifestItem),
      locale: "en",
      inspectionOrder: 0,
    });
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

export function getIndexableFullUrls(host = "sectorcalc.com"): readonly string[] {
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
    ai_index: 0,
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
