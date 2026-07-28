#!/usr/bin/env node
/**
 * Replace leaf-page sc-header chrome with the shared site-nav partial
 * so Compare / Glossary / Guides stay consistent everywhere.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const NAV = readFileSync(join(ROOT, 'content/partials/site-nav.html'), 'utf8').trim();
const DIRS = [
  'public/glossary',
  'public/compare',
  'public/blog',
  'public/case-studies',
  'public/about',
  'public/contact',
  'public/topics',
  'public/guides',
  'public/privacy',
  'public/terms',
  'public/security',
  'public/status',
  'public/refund',
  'public/resources',
];

function listHtml(dir) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .filter((n) => n.endsWith('.html') && statSync(join(abs, n)).isFile())
    .map((n) => join(abs, n));
}

function inject(html) {
  let out = html;
  // Drop legacy leaf headers and any previous shared mount
  out = out.replace(/<!--SC-SITE-NAV-START-->[\s\S]*?<!--SC-SITE-NAV-END-->\n?/g, '');
  out = out.replace(/<header class="sc-header"[\s\S]*?<\/header>\s*/i, '');
  out = out.replace(/<header class="site-header"[\s\S]*?<\/header>\s*/i, '');
  out = out.replace(/<div class="mobile-nav-overlay" id="mobileNav"[\s\S]*?<\/div>\s*/i, '');
  if (!/<body[^>]*>/i.test(out)) return html;
  return out.replace(/<body([^>]*)>/i, `<body$1>\n${NAV}\n`);
}

let n = 0;
for (const dir of DIRS) {
  for (const file of listHtml(dir)) {
    const before = readFileSync(file, 'utf8');
    const after = inject(before);
    if (after !== before) {
      writeFileSync(file, after);
      n += 1;
      console.log(`[OK] leaf-nav → ${relative(ROOT, file)}`);
    }
  }
}
console.log(`[PASS] leaf site-nav injected (${n} writes)`);
