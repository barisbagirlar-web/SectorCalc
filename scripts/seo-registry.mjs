import { UNIFIED_TOOL_CODES } from './unified-tool-html.mjs';

export const SITE_ORIGIN = 'https://sectorcalc.com';
export const LEGACY_WWW_ORIGIN = 'https://www.sectorcalc.com';
export const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;

export const CORE_PAGES = Object.freeze([
  { file: 'index.html', path: '/', kind: 'home' },
  { file: 'tools.html', path: '/tools.html', kind: 'collection' },
  { file: 'pro.html', path: '/pro.html', kind: 'collection' },
  { file: 'pricing.html', path: '/pricing.html', kind: 'page' }
]);

export const TOOL_FILES = Object.freeze([
  'sc008-pro.html',
  ...Object.keys(UNIFIED_TOOL_CODES)
]);

export const TOOL_PAGES = Object.freeze(
  TOOL_FILES.map((file) => ({ file, path: `/${file}`, kind: 'tool' }))
);

export const INDEXABLE_PAGES = Object.freeze([...CORE_PAGES, ...TOOL_PAGES]);

const BY_FILE = new Map(INDEXABLE_PAGES.map((page) => [page.file, page]));

export function pageForFile(file) {
  return BY_FILE.get(file) ?? null;
}

export function canonicalUrlForFile(file) {
  const page = pageForFile(file);
  return page ? `${SITE_ORIGIN}${page.path}` : null;
}

export function canonicalUrls() {
  return INDEXABLE_PAGES.map((page) => `${SITE_ORIGIN}${page.path}`);
}
