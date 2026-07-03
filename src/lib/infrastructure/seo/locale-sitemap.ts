/**
 * locale-sitemap.ts — V5.3.1 root-only: no locale-sharded sitemaps.
 * Only single-locale English sitemap. All alternate/hreflang removed.
 */

import { unstable_cache } from "next/cache";
import { SITE_BASE_URL } from "@/lib/infrastructure/seo/global-seo-config";
import type { SitemapUrlRecord } from "@/lib/infrastructure/seo/generate-sitemap-xml";
import {
  getCaseStudyLastModMap,
  getSitemapSourceLastModified,
  resolveSitemapLastModified,
} from "@/lib/infrastructure/seo/resolve-sitemap-lastmod";
import {
  buildLocalizedUrl,
  getSitemapManifest,
  type SitemapChangeFrequency,
  type SitemapManifestItem,
} from "@/lib/infrastructure/seo/sitemap-manifest";

const VALID_CHANGE_FREQUENCIES = new Set<SitemapChangeFrequency>([
  "daily",
  "weekly",
  "monthly",
  "yearly",
]);

function normalizeChangeFrequency(
  value: string | undefined,
  fallback: SitemapChangeFrequency,
): SitemapChangeFrequency {
  if (value && VALID_CHANGE_FREQUENCIES.has(value as SitemapChangeFrequency)) {
    return value as SitemapChangeFrequency;
  }
  return fallback;
}

function manifestItemToEntry(
  item: SitemapManifestItem,
  fallback: Date,
  caseStudyLastMod: ReadonlyMap<string, Date>,
  baseUrl: string = SITE_BASE_URL,
): { url: string; lastModified: Date; changeFrequency: SitemapChangeFrequency; priority: number } {
  return {
    url: buildLocalizedUrl(item.path, "en", baseUrl),
    lastModified: resolveSitemapLastModified(item.path, fallback, caseStudyLastMod),
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  };
}

function firestoreCaseStudyItem(
  slug: string,
  fallback: Date,
  caseStudyLastMod: ReadonlyMap<string, Date>,
  baseUrl: string = SITE_BASE_URL,
): { url: string; lastModified: Date; changeFrequency: SitemapChangeFrequency; priority: number } {
  const path = `/case-studies/${slug}`;
  return {
    url: buildLocalizedUrl(path, "en", baseUrl),
    lastModified: caseStudyLastMod.get(slug) ?? fallback,
    changeFrequency: "monthly",
    priority: 0.72,
  };
}

function dedupeAndSortEntries(entries: { url: string; lastModified: Date; changeFrequency: SitemapChangeFrequency; priority: number }[]) {
  const byUrl = new Map<string, typeof entries[number]>();
  for (const entry of entries) {
    if (!byUrl.has(entry.url)) {
      byUrl.set(entry.url, entry);
    }
  }
  return [...byUrl.values()].sort((left, right) => left.url.localeCompare(right.url));
}

/** Build root-only sitemap entries (no locale sharding, no hreflang). */
export async function buildLocaleSitemapEntries(
  _locale: string,
  now = new Date(),
  baseUrl: string = SITE_BASE_URL,
): Promise<{ url: string; lastModified: Date; changeFrequency: SitemapChangeFrequency; priority: number }[]> {
  const manifest = getSitemapManifest();
  const caseStudyLastMod = await getCaseStudyLastModMap();
  const manifestPaths = new Set(manifest.map((item) => item.path));
  const entries: Array<{ url: string; lastModified: Date; changeFrequency: SitemapChangeFrequency; priority: number }> = [];

  for (const item of manifest) {
    entries.push(manifestItemToEntry(item, now, caseStudyLastMod, baseUrl));
  }

  for (const [slug] of caseStudyLastMod) {
    const path = `/case-studies/${slug}`;
    if (manifestPaths.has(path)) {
      continue;
    }
    entries.push(firestoreCaseStudyItem(slug, now, caseStudyLastMod, baseUrl));
  }

  return dedupeAndSortEntries(entries);
}

export async function buildLocaleSitemapUrlRecords(
  _locale: string,
  now = new Date(),
  baseUrl: string = SITE_BASE_URL,
): Promise<SitemapUrlRecord[]> {
  const entries = await buildLocaleSitemapEntries("en", now, baseUrl);
  return entries.map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified instanceof Date ? entry.lastModified : new Date(entry.lastModified ?? now),
    changeFrequency: normalizeChangeFrequency(entry.changeFrequency, "weekly"),
    priority: entry.priority ?? 0.5,
    alternates: undefined,
  }));
}

function remapSitemapRecordsBaseUrl(
  records: readonly SitemapUrlRecord[],
  baseUrl: string,
): SitemapUrlRecord[] {
  const fromOrigin = SITE_BASE_URL.replace(/\/$/, "");
  const toOrigin = baseUrl.replace(/\/$/, "");
  if (fromOrigin === toOrigin) {
    return [...records];
  }

  const replaceOrigin = (value: string): string =>
    value.startsWith(fromOrigin) ? `${toOrigin}${value.slice(fromOrigin.length)}` : value;

  return records.map((record) => ({
    ...record,
    url: replaceOrigin(record.url),
    alternates: undefined,
  }));
}

const getCachedLocaleSitemapRecords = (_locale: string) =>
  unstable_cache(
    async () => buildLocaleSitemapUrlRecords("en"),
    ["locale-sitemap-records", "en"],
    { revalidate: 3600, tags: ["sitemap", "sitemap-en"] },
  )();

async function tryReadCachedLocaleRecords(_locale: string): Promise<SitemapUrlRecord[] | null> {
  try {
    return await getCachedLocaleSitemapRecords("en");
  } catch {
    return null;
  }
}

/** Production route handler entry - uses ISR cache when Next runtime is available. */
export async function getLocaleSitemapUrlRecords(
  _locale: string,
  baseUrl: string = SITE_BASE_URL,
): Promise<SitemapUrlRecord[]> {
  const cached = await tryReadCachedLocaleRecords("en");
  const records = cached ?? (await buildLocaleSitemapUrlRecords("en"));
  return remapSitemapRecordsBaseUrl(records, baseUrl);
}

export async function getLocaleSitemapShardLastModified(_locale: string): Promise<Date> {
  const records = await buildLocaleSitemapUrlRecords("en");
  if (records.length === 0) {
    return getSitemapSourceLastModified();
  }
  return records.reduce(
    (latest, record) => (record.lastModified > latest ? record.lastModified : latest),
    records[0].lastModified,
  );
}

export async function getSitemapIndexEntries(
  now = new Date(),
  baseUrl: string = SITE_BASE_URL,
): Promise<readonly { url: string; lastModified: Date }[]> {
  const base = baseUrl.replace(/\/$/, "");
  return [
    {
      url: `${base}/sitemap.xml`,
      lastModified: await getLocaleSitemapShardLastModified("en"),
    },
  ];
}

export function parseLocaleSitemapParam(value: string): string | null {
  return value.replace(/\.xml$/i, "") === "en" ? "en" : null;
}

export async function countLocaleSitemapUrls(_locale: string): Promise<number> {
  return (await buildLocaleSitemapUrlRecords("en")).length;
}
