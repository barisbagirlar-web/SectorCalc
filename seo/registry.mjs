/**
 * SectorCalc Enterprise SEO Registry — SINGLE SOURCE OF TRUTH.
 *
 * Consumed by: verify-seo, generate-sitemap, generate-llm-discovery,
 * export-seo-registry (Python inject), query/indexability gates.
 *
 * DO NOT duplicate TOOL_CANONICAL / TOOL_META elsewhere.
 */
import { PAGES, HOST, CURRENT_INDEXABLE_BASELINE, CURRENT_CALCULATOR_COUNT } from './registry-data.mjs';
import { isSeoIndexable, evaluateSeoIndexable } from './indexability.mjs';
import { findDuplicatePrimaryOwners, QUERY_OWNERSHIP } from './query-ownership.mjs';
import { discoveryAllowBots, CRAWLER_POLICY } from './crawler-policy.mjs';

export {
  PAGES,
  HOST,
  CURRENT_INDEXABLE_BASELINE,
  CURRENT_CALCULATOR_COUNT,
  isSeoIndexable,
  evaluateSeoIndexable,
  QUERY_OWNERSHIP,
  findDuplicatePrimaryOwners,
  discoveryAllowBots,
  CRAWLER_POLICY,
};

export function allPages() {
  return PAGES;
}

export function calculators() {
  return PAGES.filter((p) => p.role === 'calculator');
}

export function publishedCalculators() {
  return calculators().filter((p) => p.publicationStatus === 'published');
}

export function indexablePages() {
  return PAGES.filter((p) => isSeoIndexable(p));
}

export function sitemapPages() {
  return indexablePages().filter((p) => p.sitemapEligible === true);
}

export function llmEligiblePages() {
  return indexablePages().filter((p) => p.llmEligible === true);
}

export function llmEligibleCalculators() {
  return publishedCalculators().filter((p) => p.llmEligible !== false && isSeoIndexable(p));
}

/** Legacy *-pro.html → pretty path map (for redirects / verify / inject). */
export function toolCanonicalBySourceFile() {
  /** @type {Record<string, string>} */
  const map = {};
  for (const p of calculators()) {
    map[p.sourceFile] = p.canonicalPath;
  }
  return map;
}

/** Slug without .html → pretty path without leading slash (Python inject format). */
export function toolCanonicalBySlug() {
  /** @type {Record<string, string>} */
  const map = {};
  for (const p of calculators()) {
    const slug = p.sourceSlug || p.sourceFile.replace(/\.html$/, '');
    map[slug] = p.canonicalPath.replace(/^\//, '');
  }
  return map;
}

/** Slug → TOOL_META-compatible object for inject-seo.py */
export function toolMetaBySlug() {
  /** @type {Record<string, any>} */
  const map = {};
  for (const p of calculators()) {
    const slug = p.sourceSlug || p.sourceFile.replace(/\.html$/, '');
    map[slug] = {
      name: p.name || p.h1,
      short: p.short || p.name,
      category: p.category,
      anchor: p.categoryAnchor,
      sub: p.subcategory,
      desc: p.description,
      version: p.engineVersion || '1.0.0',
      canonicalPath: p.canonicalPath,
      id: p.id,
    };
  }
  return map;
}

export function absoluteUrl(path) {
  if (!path || path === '/') return `${HOST}/`;
  return `${HOST}${path.startsWith('/') ? path : `/${path}`}`;
}

export function sitemapLocs() {
  return sitemapPages().map((p) => absoluteUrl(p.canonicalPath));
}

export function validateRegistryInvariants() {
  const errors = [];
  const paths = new Set();
  const intents = new Map();

  for (const p of PAGES) {
    if (!p.canonicalPath) errors.push(`record missing canonicalPath: ${p.id || '?'}`);
    if (paths.has(p.canonicalPath)) errors.push(`duplicate canonical: ${p.canonicalPath}`);
    paths.add(p.canonicalPath);

    if (p.role === 'calculator') {
      if (!p.sourceFile?.endsWith('-pro.html')) errors.push(`${p.canonicalPath} calculator missing *-pro.html source`);
      if (!Array.isArray(p.legacyPaths) || !p.legacyPaths.includes(`/${p.sourceFile}`)) {
        errors.push(`${p.canonicalPath} missing legacyPaths for source file`);
      }
    }

    if (isSeoIndexable(p)) {
      const key = String(p.primaryIntent || '').toLowerCase().trim();
      if (key) {
        if (intents.has(key) && intents.get(key) !== p.canonicalPath) {
          errors.push(`DUPLICATE_PRIMARY_QUERY_OWNER: "${key}" -> ${intents.get(key)} and ${p.canonicalPath}`);
        } else {
          intents.set(key, p.canonicalPath);
        }
      }
    }
  }

  for (const c of findDuplicatePrimaryOwners()) {
    errors.push(`query-ownership conflict: ${JSON.stringify(c)}`);
  }

  const calcCount = publishedCalculators().length;
  if (calcCount !== CURRENT_CALCULATOR_COUNT) {
    errors.push(`published calculator count ${calcCount} != CURRENT_CALCULATOR_COUNT ${CURRENT_CALCULATOR_COUNT}`);
  }

  const smCount = sitemapPages().length;
  if (smCount < Math.floor(CURRENT_INDEXABLE_BASELINE * 0.5)) {
    errors.push(`UNEXPECTED_SITEMAP_SHRINK: registry sitemapEligible indexable=${smCount} baseline=${CURRENT_INDEXABLE_BASELINE}`);
  }

  return errors;
}
