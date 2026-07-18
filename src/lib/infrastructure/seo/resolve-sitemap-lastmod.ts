import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { listFirestoreCaseStudies } from "@/lib/features/case-studies/firestore-case-studies";
import { listPublishedCaseStudies } from "@/lib/features/case-studies/published-case-study-locale";
import { getGeneratedToolLastUpdatedIso } from "@/lib/features/generated-tools/resolve-tool-updated-at";
import { getActiveSitemapLocales } from "@/lib/infrastructure/seo/global-seo-config";
import { getStaticPages } from "@/lib/infrastructure/seo/static-pages";
import toolGitDatesJson from "../../../../generated/tool-git-dates.json";

const toolGitDates = toolGitDatesJson as Record<string, string>;

const PREMIUM_ANALYZER_TO_SCHEMA_ID: Record<string, string> = {
  "darcy-weisbach-analyzer": "darcy-weisbach-pipe-flow-calculator",
  "lmtd-heat-exchanger-analyzer": "lmtd-heat-exchanger-calculator",
  "standard-time-work-study": "standard-time-work-study-calculator",
  "learning-curve-cost-projector": "learning-curve-calculator",
  "spring-design-analyzer": "spring-design-calculator",
  "carbon-footprint-full-analyzer": "carbon-footprint-calculator",
  "regression-correlation-analyzer": "regression-analyzer",
  "sample-size-power-analyzer": "sample-size-calculator",
  "anova-variance-analyzer": "anova-analyzer",
  "roi-payback-analyzer": "roi-analyzer",
  "belt-pulley-gear-analyzer": "belt-pulley-gear-calculator",
  "hydraulic-cylinder-force-analyzer": "hydraulic-cylinder-tonnage-power-calculator",
};

const TOOL_PATH = /^\/tools\/(?:generated|premium-schema|premium|pro)\/([^/]+)$/;
const CASE_STUDY_PATH = /^\/case-studies\/([^/]+)$/;
const AUTHORITY_GUIDE_PATH = /^\/guides\/([^/]+)$/;
const SEO_LANDING_PATH = /^\/seo\/([^/]+)$/;

const CONTENT_SOURCE_FILES = {
  guides: path.join(process.cwd(), "src/lib/content/authority-guides.ts"),
  seoLandings: path.join(process.cwd(), "src/lib/infrastructure/seo/programmatic-seo-pages.ts"),
  premiumRegistry: path.join(process.cwd(), "src/lib/features/premium-schema/schema-registry.ts"),
  manifest: path.join(process.cwd(), "src/lib/infrastructure/seo/sitemap-manifest.ts"),
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

function readCachedFileGitDate(key: string, fallback: Date): Date {
  const gitDateStr = toolGitDates[`source:${key}`];
  if (gitDateStr) {
    const parsed = new Date(gitDateStr);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return fallback;
}

function resolveGeneratedOrPremiumToolLastMod(slug: string, fallback: Date): Date {
  const lookupSlug = PREMIUM_ANALYZER_TO_SCHEMA_ID[slug] ?? slug;
  const gitDateStr = toolGitDates[lookupSlug];
  if (gitDateStr) {
    const parsed = new Date(gitDateStr);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  const iso = getGeneratedToolLastUpdatedIso(lookupSlug);
  if (iso) {
    const parsed = new Date(iso);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  const premiumSchemaPath = path.join(
    process.cwd(),
    "src/lib/features/premium-schema/schemas",
    `${lookupSlug}.ts`,
  );
  const premiumMtime = readFileMtime(premiumSchemaPath);
  if (premiumMtime) {
    return premiumMtime;
  }

  const registryMtime = readCachedFileMtime("premiumRegistry");
  if (registryMtime) {
    return registryMtime;
  }

  // Serverless bundles expose no reliable file mtime; never emit request-time
  // (new Date()) here or the sitemap <lastmod> would churn on every crawl.
  // Fall back to the premium registry's stable git commit date instead.
  return readCachedFileGitDate("premiumRegistry", fallback);
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
  const toolMatch = routePath.match(TOOL_PATH);
  if (toolMatch) {
    return resolveGeneratedOrPremiumToolLastMod(toolMatch[1], fallback);
  }

  const caseStudyMatch = routePath.match(CASE_STUDY_PATH);
  if (caseStudyMatch) {
    return caseStudyLastMod.get(caseStudyMatch[1]) ?? readCachedFileGitDate("manifest", fallback);
  }

  if (routePath.match(AUTHORITY_GUIDE_PATH)) {
    return readCachedFileGitDate("guides", fallback);
  }

  if (routePath.match(SEO_LANDING_PATH)) {
    return readCachedFileGitDate("seoLandings", fallback);
  }

  if (staticPagePathSet.has(routePath)) {
    return readCachedFileGitDate("manifest", fallback);
  }

  return readCachedFileGitDate("manifest", fallback);
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
