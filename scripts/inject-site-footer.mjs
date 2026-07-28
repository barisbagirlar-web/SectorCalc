#!/usr/bin/env node
/**
 * Inject content/partials/site-footer.html into public HTML trust/content surfaces.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const PARTIAL = readFileSync(join(ROOT, 'content/partials/site-footer.html'), 'utf8').trim();
const START = '<!--SC-SITE-FOOTER-START-->';
const END = '<!--SC-SITE-FOOTER-END-->';

const DIRS = [
  'public/about',
  'public/contact',
  'public/privacy',
  'public/terms',
  'public/security',
  'public/status',
  'public/refund',
  'public/case-studies',
  'public/blog',
  'public/glossary',
  'public/compare',
  'public/guides',
  'public/topics',
  'public/resources',
];

function listHtml(dir) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return [];
  const out = [];
  for (const name of readdirSync(abs)) {
    const p = join(abs, name);
    if (statSync(p).isDirectory()) continue;
    if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

function inject(html) {
  let out = html.replace(new RegExp(`${START}[\\s\\S]*?${END}\\n?`, 'g'), '');
  out = out.replace(/<footer class="sc-footer"[\s\S]*?<\/footer>\s*/gi, '');
  const block = `${START}\n${PARTIAL}\n${END}`;
  if (/<!--SC-CALC-SHEET-TB-START-->/i.test(out)) {
    return out.replace(/<!--SC-CALC-SHEET-TB-START-->/i, `${block}\n<!--SC-CALC-SHEET-TB-START-->`);
  }
  if (/<\/body>/i.test(out)) {
    return out.replace(/<\/body>/i, `${block}\n</body>`);
  }
  return `${out}\n${block}\n`;
}

let n = 0;
for (const dir of DIRS) {
  for (const file of listHtml(dir)) {
    const before = readFileSync(file, 'utf8');
    const after = inject(before);
    if (after !== before) {
      writeFileSync(file, after);
      n += 1;
      console.log(`[OK] footer → ${relative(ROOT, file)}`);
    }
  }
}
console.log(`[PASS] site-footer injected (${n} writes)`);
