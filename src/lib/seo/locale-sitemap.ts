import type { MetadataRoute } from "next";
import { listFirestoreCaseStudies } from "@/lib/case-studies/firestore-case-studies";
import { getGeneratedToolLastUpdatedIso } from "@/lib/generated-tools/resolve-tool-updated-at";
import type { SupportedLocale } from "@/lib/i18n/locale-config";
import { isSupportedLocale } from "@/lib/i18n/locale-config";
import { getActiveSitemapLocales, SITE_BASE_URL } from "@/lib/seo/global-seo-config";
import type { SitemapUrlRecord } from "@/lib/seo/generate-sitemap-xml";
import {
  buildAlternates,
  buildLocalizedUrl,
  getSitemapManifest,
  type SitemapChangeFrequency,
  type SitemapManifestItem,
} from "@/lib/seo/sitemap-manifest";

const GENERATED_TOOL_PATH = /^\/tools\/generated\/([^/]+)$/;
const CASE_STUDY_PATH = /^\/case-studies\/([^/]+)$/;

type CaseStudyLastModMap = ReadonlyMap<string, Date>;

async function loadCaseStudyLastModMap(): Promise<CaseStudyLastModMap> {
  const map = new Map<string, Date>();

  try {
    const studies = await listFirestoreCaseStudies();
    for (const study of studies) {
      const raw = study.updatedAt ?? study.publishedAt;
      const parsed = new Date(raw);
      if (!Number.isNaN(parsed.getTime())) {
        map.set(study.slug, parsed);
      }
    }
  } catch (error) {
    console.warn("Case studies not available for sitemap lastmod:", error);
  }

  return map;
}

function resolvePathLastModified(
  path: string,
  fallback: Date,
  caseStudyLastMod: CaseStudyLastModMap,
): Date {
  const generatedMatch = path.match(GENERATED_TOOL_PATH);
  if (generatedMatch) {
    const iso = getGeneratedToolLastUpdatedIso(generatedMatch[1]);
    if (iso) {
      const parsed = new Date(iso);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
  }

  const caseStudyMatch = path.match(CASE_STUDY_PATH);
  if (caseStudyMatch) {
    const lastMod = caseStudyLastMod.get(caseStudyMatch[1]);
    if (lastMod) {
      return lastMod;
    }
  }

  return fallback;
}

function manifestItemToEntry(
  item: SitemapManifestItem,
  locale: SupportedLocale,
  fallback: Date,
  caseStudyLastMod: CaseStudyLastModMap,
): MetadataRoute.Sitemap[number] {
  return {
    url: buildLocalizedUrl(item.path, locale, SITE_BASE_URL),
    lastModified: resolvePathLastModified(item.path, fallback, caseStudyLastMod),
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
  caseStudyLastMod: CaseStudyLastModMap,
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

/** Locale-scoped sitemap entries with dynamic lastmod for tools and Firestore case studies. */
export async function buildLocaleSitemapEntries(
  locale: SupportedLocale,
  now = new Date(),
): Promise<MetadataRoute.Sitemap> {
  const manifest = getSitemapManifest();
  const caseStudyLastMod = await loadCaseStudyLastModMap();
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

  return entries;
}

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
  }));
}

export function parseLocaleSitemapParam(value: string): SupportedLocale | null {
  const normalized = value.replace(/\.xml$/i, "");
  return isSupportedLocale(normalized) ? normalized : null;
}
