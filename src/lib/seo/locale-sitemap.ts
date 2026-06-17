import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import type { SupportedLocale } from "@/lib/i18n/locale-config";
import { isSupportedLocale } from "@/lib/i18n/locale-config";
import { getActiveSitemapLocales, SITE_BASE_URL } from "@/lib/seo/global-seo-config";
import type { SitemapAlternateLink, SitemapUrlRecord } from "@/lib/seo/generate-sitemap-xml";
import {
  getCaseStudyLastModMap,
  getSitemapSourceLastModified,
  resolveSitemapLastModified,
} from "@/lib/seo/resolve-sitemap-lastmod";
import {
  buildAlternates,
  buildLocalizedUrl,
  getSitemapManifest,
  type SitemapChangeFrequency,
  type SitemapManifestItem,
} from "@/lib/seo/sitemap-manifest";

const VALID_CHANGE_FREQUENCIES = new Set<SitemapChangeFrequency>([
  "daily",
  "weekly",
  "monthly",
  "yearly",
]);

function normalizeChangeFrequency(
  value: MetadataRoute.Sitemap[number]["changeFrequency"],
  fallback: SitemapChangeFrequency,
): SitemapChangeFrequency {
  if (value && VALID_CHANGE_FREQUENCIES.has(value as SitemapChangeFrequency)) {
    return value as SitemapChangeFrequency;
  }
  return fallback;
}

function toAlternateLinks(
  alternates: MetadataRoute.Sitemap[number]["alternates"],
): readonly SitemapAlternateLink[] | undefined {
  if (!alternates?.languages) {
    return undefined;
  }

  return Object.entries(alternates.languages).map(([hreflang, href]) => ({
    hreflang,
    href,
  }));
}

function manifestItemToEntry(
  item: SitemapManifestItem,
  locale: SupportedLocale,
  fallback: Date,
  caseStudyLastMod: ReadonlyMap<string, Date>,
): MetadataRoute.Sitemap[number] {
  return {
    url: buildLocalizedUrl(item.path, locale, SITE_BASE_URL),
    lastModified: resolveSitemapLastModified(item.path, fallback, caseStudyLastMod),
    changeFrequency: item.changeFrequency,
    priority: item.priority,
    alternates: buildAlternates(item.path, item.locales, SITE_BASE_URL),
  };
}

function firestoreCaseStudyItem(
  slug: string,
  locale: SupportedLocale,
  locales: readonly SupportedLocale[],
  fallback: Date,
  caseStudyLastMod: ReadonlyMap<string, Date>,
): MetadataRoute.Sitemap[number] {
  const path = `/case-studies/${slug}`;
  return {
    url: buildLocalizedUrl(path, locale, SITE_BASE_URL),
    lastModified: caseStudyLastMod.get(slug) ?? fallback,
    changeFrequency: "monthly",
    priority: 0.72,
    alternates: buildAlternates(path, locales, SITE_BASE_URL),
  };
}

function dedupeAndSortEntries(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of entries) {
    if (!byUrl.has(entry.url)) {
      byUrl.set(entry.url, entry);
    }
  }

  return [...byUrl.values()].sort((left, right) => left.url.localeCompare(right.url));
}

/** Locale-scoped sitemap entries with dynamic lastmod for tools and case studies. */
export async function buildLocaleSitemapEntries(
  locale: SupportedLocale,
  now = new Date(),
): Promise<MetadataRoute.Sitemap> {
  const manifest = getSitemapManifest();
  const caseStudyLastMod = await getCaseStudyLastModMap();
  const manifestPaths = new Set(manifest.map((item) => item.path));
  const entries: MetadataRoute.Sitemap = [];

  for (const item of manifest) {
    if (!item.locales.includes(locale)) {
      continue;
    }
    entries.push(manifestItemToEntry(item, locale, now, caseStudyLastMod));
  }

  const locales = getActiveSitemapLocales();
  for (const [slug] of caseStudyLastMod) {
    const path = `/case-studies/${slug}`;
    if (manifestPaths.has(path)) {
      continue;
    }
    entries.push(firestoreCaseStudyItem(slug, locale, locales, now, caseStudyLastMod));
  }

  return dedupeAndSortEntries(entries);
}

export async function buildLocaleSitemapUrlRecords(
  locale: SupportedLocale,
  now = new Date(),
): Promise<SitemapUrlRecord[]> {
  const entries = await buildLocaleSitemapEntries(locale, now);
  return entries.map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified instanceof Date ? entry.lastModified : new Date(entry.lastModified ?? now),
    changeFrequency: normalizeChangeFrequency(entry.changeFrequency, "weekly"),
    priority: entry.priority ?? 0.5,
    alternates: toAlternateLinks(entry.alternates),
  }));
}

const getCachedLocaleSitemapRecords = (locale: SupportedLocale) =>
  unstable_cache(
    async () => buildLocaleSitemapUrlRecords(locale),
    ["locale-sitemap-records", locale],
    { revalidate: 3600, tags: ["sitemap", `sitemap-${locale}`] },
  )();

async function tryReadCachedLocaleRecords(locale: SupportedLocale): Promise<SitemapUrlRecord[] | null> {
  try {
    return await getCachedLocaleSitemapRecords(locale);
  } catch {
    return null;
  }
}

/** Production route handler entry — uses ISR cache when Next runtime is available. */
export async function getLocaleSitemapUrlRecords(locale: SupportedLocale): Promise<SitemapUrlRecord[]> {
  const cached = await tryReadCachedLocaleRecords(locale);
  if (cached) {
    return cached;
  }
  return buildLocaleSitemapUrlRecords(locale);
}

export async function getLocaleSitemapShardLastModified(locale: SupportedLocale): Promise<Date> {
  const records = await buildLocaleSitemapUrlRecords(locale);
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
): Promise<readonly { url: string; lastModified: Date }[]> {
  const base = SITE_BASE_URL.replace(/\/$/, "");
  const locales = getActiveSitemapLocales();

  return Promise.all(
    locales.map(async (locale) => ({
      url: `${base}/sitemap/${locale}.xml`,
      lastModified: await getLocaleSitemapShardLastModified(locale),
    })),
  );
}

export function parseLocaleSitemapParam(value: string): SupportedLocale | null {
  const normalized = value.replace(/\.xml$/i, "");
  return isSupportedLocale(normalized) ? normalized : null;
}

export async function countLocaleSitemapUrls(locale: SupportedLocale): Promise<number> {
  return (await buildLocaleSitemapUrlRecords(locale)).length;
}
