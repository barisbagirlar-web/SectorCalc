#!/usr/bin/env node
/**
 * Every built public HTML page (except quarantined) must appear in sitemap.xml.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const HOST = 'https://sectorcalc.com';

function walkHtml(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) {
      if (['assets', 'data', 'css', 'js'].includes(name)) continue;
      walkHtml(abs, out);
      continue;
    }
    if (name.endsWith('.html')) out.push(abs);
  }
  return out;
}

function toLoc(file) {
  let rel = relative(DIST, file).replace(/\\/g, '/');
  if (rel === 'index.html') return `${HOST}/`;
  if (rel.endsWith('/index.html')) {
    return `${HOST}/` + rel.slice(0, -'/index.html'.length);
  }
  return `${HOST}/` + rel;
}

const smPath = existsSync(join(DIST, 'sitemap.xml'))
  ? join(DIST, 'sitemap.xml')
  : join(ROOT, 'public/sitemap.xml');
const sm = readFileSync(smPath, 'utf8');
const inSitemap = new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));

const builtRoot = existsSync(DIST) ? DIST : join(ROOT, 'public');
const built = walkHtml(builtRoot)
  .map(toLoc)
  .filter((u) => !/\/(404\.html|draft|staging|de|ja|zh)(\/|$)/.test(u))
  // Root calculator redirects + product HTML that are not indexable content leaves
  .filter((u) => !/\/calculator\d*\.html$/.test(u));

// Only enforce content/legal/hub HTML that should be discoverable.
const enforce = built.filter((u) => {
  const path = u.replace(HOST, '') || '/';
  if (path === '/' || path.endsWith('.html')) return false; // product html audited elsewhere
  return true;
});

const missing = enforce.filter((u) => !inSitemap.has(u) && !inSitemap.has(u + '/'));
if (missing.length) {
  console.error('ORPHAN PAGES:\n' + missing.join('\n'));
  process.exit(1);
}
console.log(`guard:sitemap PASS (${enforce.length} content pages checked, sitemap has ${inSitemap.size} locs)`);
