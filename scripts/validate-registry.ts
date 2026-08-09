#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import {
  PAGES,
  sitemapPages,
  validateRegistryInvariants,
} from '../seo/registry.mjs';

const DIRECT_ROLES = new Set([
  'home', 'hub', 'category', 'tool', 'service', 'article', 'research',
  'comparison', 'product', 'local', 'legal',
]);
const ROLE_ALIASES = new Map([
  ['calculator', 'tool'],
  ['pricing', 'service'],
  ['pro', 'hub'],
  ['guide', 'article'],
  ['methodology', 'article'],
]);
const RICH_RESULTS = new Set([
  'Article', 'BreadcrumbList', 'Dataset', 'Event', 'JobPosting',
  'LocalBusiness', 'Organization', 'Product', 'ProfilePage', 'QAPage',
  'Recipe', 'ReviewSnippet', 'SoftwareApplication', 'VideoObject',
]);

export function normalizeIndexDirective(value: unknown): 'index' | 'noindex' {
  const tokens = String(value ?? '').toLowerCase().split(/[,\s]+/).filter(Boolean);
  if (tokens.includes('noindex') || tokens.includes('none')) return 'noindex';
  if (tokens.includes('index')) return 'index';
  throw new Error(`unknown index directive: ${String(value)}`);
}

export function mapRole(value: unknown): string {
  const role = String(value ?? '');
  if (DIRECT_ROLES.has(role)) return role;
  const alias = ROLE_ALIASES.get(role);
  if (alias) return alias;
  throw new Error(`unmapped registry role: ${role || '<empty>'}`);
}

function gitModifiedAt(record: Record<string, any>): string {
  const candidates = [record.sourceFile, ...(record.contentSources ?? [])]
    .filter((x: unknown) => typeof x === 'string' && x.length > 0)
    .map((x: string) => x.replace(/^\//, ''));
  candidates.push('seo/registry-data.mjs');
  for (const candidate of candidates) {
    if (!existsSync(candidate)) continue;
    try {
      const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', candidate], {
        encoding: 'utf8',
      }).trim();
      if (iso) return iso;
    } catch {
      // Try the next evidence-backed source path.
    }
  }
  throw new Error(`no git modifiedAt evidence for ${record.id ?? record.canonicalPath ?? '?'}`);
}

export function adaptRegistryRecord(record: Record<string, any>) {
  const rich = Array.isArray(record.schemaTypes)
    ? record.schemaTypes.filter((x: unknown) => RICH_RESULTS.has(String(x)))
    : [];
  const canonical = String(record.canonicalPath ?? '');
  return {
    route: canonical,
    locale: String(record.locale ?? ''),
    role: mapRole(record.role),
    indexDirective: normalizeIndexDirective(record.indexDirective),
    canonicalRoute: canonical,
    title: String(record.title ?? ''),
    metaDescription: String(record.description ?? ''),
    h1: String(record.h1 ?? record.title ?? ''),
    primaryIntent: String(record.primaryIntent ?? ''),
    primaryEntityId: String(record.primaryEntity ?? record.id ?? ''),
    secondaryEntityIds: Array.isArray(record.secondaryEntityIds) ? record.secondaryEntityIds : [],
    modifiedAt: gitModifiedAt(record),
    richResultTypes: rich.length ? rich : ['None'],
    conversionEvent: String(record.conversionEvent ?? 'none'),
    sourceRefs: Array.isArray(record.contentSources) && record.contentSources.length
      ? record.contentSources.map(String)
      : [String(record.sourceFile ?? canonical)],
    ...(record.parentHub && record.parentHub !== '/' ? { parentHubRoute: String(record.parentHub) } : {}),
    relatedRoutes: Array.isArray(record.relatedRoutes) ? record.relatedRoutes.map(String) : [],
    ...(record.sourceFile ? { contentSourcePath: String(record.sourceFile) } : {}),
  };
}

const pageSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  additionalProperties: true,
  required: [
    'route', 'locale', 'role', 'indexDirective', 'canonicalRoute', 'title',
    'metaDescription', 'h1', 'primaryIntent', 'primaryEntityId',
    'secondaryEntityIds', 'modifiedAt', 'richResultTypes', 'conversionEvent',
    'sourceRefs', 'relatedRoutes',
  ],
  properties: {
    route: { type: 'string', pattern: '^/' },
    locale: { type: 'string', minLength: 1 },
    role: { enum: [...DIRECT_ROLES] },
    indexDirective: { enum: ['index', 'noindex'] },
    canonicalRoute: { type: 'string', pattern: '^/' },
    title: { type: 'string', minLength: 1 },
    metaDescription: { type: 'string', minLength: 1 },
    h1: { type: 'string', minLength: 1 },
    primaryIntent: { type: 'string', minLength: 1 },
    primaryEntityId: { type: 'string', minLength: 1 },
    secondaryEntityIds: { type: 'array', items: { type: 'string' } },
    modifiedAt: { type: 'string', format: 'date-time' },
    richResultTypes: { type: 'array', minItems: 1, items: { type: 'string' } },
    conversionEvent: { type: 'string', minLength: 1 },
    sourceRefs: { type: 'array', minItems: 1, items: { type: 'string', minLength: 1 } },
    parentHubRoute: { type: 'string', pattern: '^/' },
    relatedRoutes: { type: 'array', items: { type: 'string', pattern: '^/' } },
  },
} as const;

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validatePage = ajv.compile(pageSchema);

export function assertNotFuture(iso: string, now = new Date()): void {
  const parsed = new Date(iso);
  if (!Number.isFinite(parsed.getTime())) throw new Error(`invalid modifiedAt: ${iso}`);
  if (parsed.getTime() > now.getTime()) throw new Error(`future modifiedAt: ${iso}`);
}

export function assertNoindexNotInSitemap(
  records: Array<{ canonicalRoute: string; indexDirective: string }>,
  sitemapRoutes: Iterable<string>,
): void {
  const set = new Set(sitemapRoutes);
  for (const record of records) {
    if (record.indexDirective === 'noindex' && set.has(record.canonicalRoute)) {
      throw new Error(`noindex route leaked into sitemap: ${record.canonicalRoute}`);
    }
  }
}

export function validateCurrentRegistry() {
  const invariantErrors = validateRegistryInvariants();
  if (invariantErrors.length) throw new Error(invariantErrors.join(' | '));

  const adapted = PAGES.map((record: Record<string, any>) => adaptRegistryRecord(record));
  for (const record of adapted) {
    if (!validatePage(record)) {
      throw new Error(`${record.canonicalRoute}: ${ajv.errorsText(validatePage.errors)}`);
    }
    assertNotFuture(record.modifiedAt);
  }
  assertNoindexNotInSitemap(
    adapted,
    sitemapPages().map((record: Record<string, any>) => String(record.canonicalPath)),
  );
  return adapted;
}

function main() {
  try {
    const adapted = validateCurrentRegistry();
    console.log(`SEO_V3_REGISTRY=PASS records=${adapted.length} ssot=seo/registry.mjs schema=draft-2020-12`);
  } catch (error) {
    console.error(`SEO_V3_REGISTRY=FAIL ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) main();
