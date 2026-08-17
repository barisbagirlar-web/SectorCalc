#!/usr/bin/env node
/**
 * Internal link graph checks for indexable SEO surface.
 * Fail-closed: collect all failures, report, exit 1. Never throw on missing files.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { HOST, indexablePages, toolCanonicalBySourceFile } from '../seo/registry.mjs';

const ROOT = process.cwd();
const errors = [];
const indexable = indexablePages();
const indexableSet = new Set(indexable.map((p) => p.canonicalPath));
const incoming = new Map([...indexableSet].map((p) => [p, 0]));
incoming.set('/', 1);
const fileCache = new Map();

/** Normalize site-relative and absolute same-host hrefs to canonical pathname form. */
function normalizeHref(href) {
  if (!href) return null;
  if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return null;
  if (href.startsWith('#')) return null;
  let path = null;
  if (href.startsWith('http://') || href.startsWith('https://')) {
    if (!href.startsWith(HOST)) return null;
    try {
      path = new URL(href).pathname || '/';
    } catch {
      return null;
    }
  } else if (href.startsWith('/')) {
    path = href.split('?')[0].split('#')[0];
  } else {
    return null;
  }
  if (path === '/' || path === '') return '/';
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  return path;
}

function readCached(relPath) {
  if (fileCache.has(relPath)) return fileCache.get(relPath);
  const abs = join(ROOT, relPath);
  if (!existsSync(abs)) {
    errors.push(`missing source file ${relPath}`);
    fileCache.set(relPath, null);
    return null;
  }
  try {
    const html = readFileSync(abs, 'utf8');
    fileCache.set(relPath, html);
    return html;
  } catch (err) {
    errors.push(`unreadable source file ${relPath}: ${err.message}`);
    fileCache.set(relPath, null);
    return null;
  }
}

for (const page of indexable) {
  const file = page.sourceFile;
  const html = readCached(file);
  if (!html) continue;
  const hrefs = [...html.matchAll(/\bhref=["']([^"']+)["']/gi)].map((m) => m[1]);
  for (const raw of hrefs) {
    if (/\/[a-z0-9-]+-pro\.html(\b|$|\?|#)/i.test(raw)) {
      errors.push(`legacy internal link ${raw} on ${page.canonicalPath}`);
    }
    const norm = normalizeHref(raw);
    if (!norm) continue;
    if (indexableSet.has(norm) && norm !== page.canonicalPath) {
      incoming.set(norm, (incoming.get(norm) || 0) + 1);
    }
  }
  if (page.parentHub && indexableSet.has(page.parentHub)) {
    const parent = indexable.find((p) => p.canonicalPath === page.parentHub);
    if (parent) {
      const parentHtml = readCached(parent.sourceFile);
      if (parentHtml) {
        const child = page.canonicalPath;
        if (
          parentHtml.includes(`href="${child}"`)
          || parentHtml.includes(`href='${child}'`)
          || parentHtml.includes(`href="${child}/"`)
          || parentHtml.includes(`"${HOST}${child}"`)
          || parentHtml.includes(child)
        ) {
          incoming.set(page.canonicalPath, (incoming.get(page.canonicalPath) || 0) + 1);
        }
      }
    }
  }
}

for (const [path, count] of incoming) {
  if (path === '/' || path === '/tools' || path === '/pricing' || path === '/trust') continue;
  if (count === 0) errors.push(`orphan indexable page: ${path}`);
}

const toolsHtml = readCached('tools.html');
if (toolsHtml) {
  for (const p of indexable.filter((x) => x.role === 'calculator' && x.revenueTier === 'A')) {
    const idOk = p.id && toolsHtml.includes(p.id);
    const pathOk = toolsHtml.includes(p.canonicalPath);
    if (!idOk && !pathOk) errors.push(`Tier-A calculator not referenced from tools.html: ${p.canonicalPath}`);
  }
}

const canon = toolCanonicalBySourceFile();
for (const p of indexable.filter((x) => x.role === 'calculator')) {
  if (!canon[p.sourceFile]) errors.push(`canonical map missing ${p.sourceFile}`);
}

if (errors.length) {
  console.error('[FAIL] internal link graph:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`[PASS] internal link graph: ${indexable.length} indexable pages checked`);
