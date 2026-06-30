import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { listFirestoreCaseStudies } from "@/lib/case-studies/firestore-case-studies";
import { listPublishedCaseStudies } from "@/lib/case-studies/published-case-study-locale";
import { getGeneratedToolLastUpdatedIso } from "@/lib/generated-tools/resolve-tool-updated-at";
import { getActiveSitemapLocales } from "@/lib/seo/global-seo-config";
import { getStaticPages } from "@/lib/seo/static-pages";

const GENERATED_TOOL_PATH = /^\/tools\/generated\/([^/]+)$/;
const PREMIUM_SCHEMA_PATH = /^\/tools\/premium-schema\/([^/]+)$/;
const CASE_STUDY_PATH = /^\/case-studies\/([^/]+)$/;
const AUTHORITY_GUIDE_PATH = /^\/guides\/([^/]+)$/;
const SEO_LANDING_PATH = /^\/seo\/([^/]+)$/;

const CONTENT_SOURCE_FILES = {
  guides: path.join(process.cwd(), "src/lib/content/authority-guides.ts"),
  seoLandings: path.join(process.cwd(), "src/lib/seo/programmatic-seo-pages.ts"),
  premiumRegistry: path.join(process.cwd(), "src/lib/premium-schema/schema-registry.ts"),
  manifest: path.join(process.cwd(), "src/lib/seo/sitemap-manifest.ts"),
} as const;

const staticPagePathSet = new Set(getStaticPages().map((page) => page.path));

function readFileMtime(filePath: string): Date | null {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return fs.statSync(filePath).mtime;
  } catch {
    return null;
  }
}

function parseIsoDate(value: string | undefined, fallback: Date): Date {
  if (!value) {
    return fallback;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function readCachedFileMtime(key: keyof typeof CONTENT_SOURCE_FILES): Date | null {
  return readFileMtime(CONTENT_SOURCE_FILES[key]);
}

function resolveGeneratedOrPremiumToolLastMod(slug: string, fallback: Date): Date {
  const iso = getGeneratedToolLastUpdatedIso(slug);
  if (iso) {
    const parsed = new Date(iso);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  const premiumSchemaPath = path.join(
    process.cwd(),
    "src/lib/premium-schema/schemas",
    `${slug}.ts`,
  );
  const premiumMtime = readFileMtime(premiumSchemaPath);
  if (premiumMtime) {
    return premiumMtime;
  }

  const registryMtime = readCachedFileMtime("premiumRegistry");
  return registryMtime ?? fallback;
}

/** Merged static + Firestore case study lastmod (deduped by slug, latest wins). */
export const getCaseStudyLastModMap = cache(async (): Promise<ReadonlyMap<string, Date>> => {
  const map = new Map<string, Date>();

  for (const locale of getActiveSitemapLocales()) {
    for (const study of listPublishedCaseStudies(locale)) {
      const date = parseIsoDate(study.updatedAt ?? study.publishedAt, new Date(0));
      const existing = map.get(study.slug);
      if (!existing || date > existing) {
        map.set(study.slug, date);
      }
    }
  }

  try {
    const firestoreStudies = await listFirestoreCaseStudies();
    for (const study of firestoreStudies) {
      const date = parseIsoDate(study.updatedAt ?? study.publishedAt, new Date(0));
      const existing = map.get(study.slug);
      if (!existing || date > existing) {
        map.set(study.slug, date);
      }
    }
  } catch (error) {
    console.warn("Case studies not available for sitemap lastmod:", error);
  }

  return map;
});

export function resolveSitemapLastModified(
  routePath: string,
  fallback: Date,
  caseStudyLastMod: ReadonlyMap<string, Date>,
): Date {
  const generatedMatch = routePath.match(GENERATED_TOOL_PATH);
  if (generatedMatch) {
    return resolveGeneratedOrPremiumToolLastMod(generatedMatch[1], fallback);
  }

  const premiumMatch = routePath.match(PREMIUM_SCHEMA_PATH);
  if (premiumMatch) {
    return resolveGeneratedOrPremiumToolLastMod(premiumMatch[1], fallback);
  }

  const caseStudyMatch = routePath.match(CASE_STUDY_PATH);
  if (caseStudyMatch) {
    return caseStudyLastMod.get(caseStudyMatch[1]) ?? fallback;
  }

  if (routePath.match(AUTHORITY_GUIDE_PATH)) {
    return readCachedFileMtime("guides") ?? fallback;
  }

  if (routePath.match(SEO_LANDING_PATH)) {
    return readCachedFileMtime("seoLandings") ?? fallback;
  }

  if (staticPagePathSet.has(routePath)) {
    return readCachedFileMtime("manifest") ?? fallback;
  }

  return fallback;
}

export function getSitemapSourceLastModified(now = new Date()): Date {
  const mtimes = Object.values(CONTENT_SOURCE_FILES)
    .map((filePath) => readFileMtime(filePath))
    .filter((value): value is Date => value !== null);

  if (mtimes.length === 0) {
    return now;
  }

  return mtimes.reduce((latest, current) => (current > latest ? current : latest));
}
