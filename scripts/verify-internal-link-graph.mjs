#!/usr/bin/env node
/**
 * Internal link graph checks for indexable SEO surface.
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

function normalizeHref(href) {
  if (!href) return null;
  if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return null;
  if (href.startsWith('#')) return null;
  if (href.startsWith('http')) {
    if (!href.startsWith(HOST)) return null;
    const u = new URL(href);
    return u.pathname === '' ? '/' : u.pathname;
  }
  if (href.startsWith('/')) {
    let p = href.split('?')[0].split('#')[0];
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    return p || '/';
  }
  return null;
}

function sourceFile(record) {
  return record.sourceFile.startsWith('public/') ? record.sourceFile : record.sourceFile;
}

for (const page of indexable) {
  const file = sourceFile(page);
  const abs = join(ROOT, file);
  if (!existsSync(abs)) {
    errors.push(`missing ${file}`);
    continue;
  }
  const html = readFileSync(abs, 'utf8');
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
  // Parent hub credit
  if (page.parentHub && indexableSet.has(page.parentHub)) {
    // ensure parent mentions child when parent is a listing hub
    const parent = indexable.find((p) => p.canonicalPath === page.parentHub);
    if (parent) {
      const parentHtml = readFileSync(join(ROOT, sourceFile(parent)), 'utf8');
      if (parentHtml.includes(page.canonicalPath) || parentHtml.includes(page.canonicalPath + '/')) {
        incoming.set(page.canonicalPath, (incoming.get(page.canonicalPath) || 0) + 1);
      }
    }
  }
}

for (const [path, count] of incoming) {
  if (path === '/' || path === '/tools.html' || path === '/pro.html' || path === '/pricing.html') continue;
  if (count === 0) errors.push(`orphan indexable page: ${path}`);
}

// Tier-A must appear on tools catalog HTML (pretty path or SC id)
const toolsHtml = readFileSync(join(ROOT, 'tools.html'), 'utf8');
for (const p of indexable.filter((x) => x.role === 'calculator' && x.revenueTier === 'A')) {
  const idOk = p.id && toolsHtml.includes(p.id);
  const pathOk = toolsHtml.includes(p.canonicalPath);
  if (!idOk && !pathOk) errors.push(`Tier-A calculator not referenced from tools.html: ${p.canonicalPath}`);
}

// Registry calculators must have canonical map entries
const canon = toolCanonicalBySourceFile();
for (const p of indexable.filter((x) => x.role === 'calculator')) {
  if (!canon[p.sourceFile]) errors.push(`canonical map missing ${p.sourceFile}`);
}

if (errors.length) {
  console.error('[FAIL] internal link graph:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`[PASS] internal link graph: ${indexable.length} indexable pages checked`);
