#!/usr/bin/env node
/**
 * 360 navigation audit (n8n-style edge check):
 * every internal href must resolve to an existing file or on-page anchor.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const PAGES = [
  'index.html',
  'pricing.html',
  'sc008-pro.html',
  'labor-pro.html',
  'quote-pro.html',
  'weld-pro.html',
  'calculator.html',
  'calculator2.html',
  'calculator3.html',
  'calculator4.html'
];

const EXPECTED = {
  'index.html': {
    mustInclude: [
      '/sc008-pro.html',
      '/quote-pro.html',
      '/labor-pro.html',
      '/weld-pro.html',
      '/pricing.html',
      '#decide',
      '#method',
      '#standards',
      '#evidence',
      '#verify'
    ],
    mustHaveIds: [
      'main-content',
      'decide',
      'method',
      'standards',
      'pricing',
      'evidence',
      'verify',
      'run',
      'testimonials',
      'mobileMenuBtn',
      'mobileNav'
    ]
  },
  'pricing.html': {
    mustInclude: ['/', '/sc008-pro.html', '/quote-pro.html', '/labor-pro.html', '/weld-pro.html']
  }
};

const issues = [];

function anchorsIn(html) {
  const ids = new Set();
  for (const m of html.matchAll(/\bid=["']([^"']+)["']/g)) ids.add(m[1]);
  for (const m of html.matchAll(/\bname=["']([^"']+)["']/g)) ids.add(m[1]);
  return ids;
}

function checkPage(page) {
  const path = join(ROOT, page);
  if (!existsSync(path)) {
    issues.push(`${page}: FILE MISSING`);
    return;
  }
  const html = readFileSync(path, 'utf8');
  const ids = anchorsIn(html);
  const hrefs = [...html.matchAll(/\bhref=["']([^"']+)["']/g)].map((m) => m[1]);

  for (const href of hrefs) {
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('javascript:')) continue;
    if (href.startsWith('#')) {
      const id = href.slice(1);
      if (id && !ids.has(id)) issues.push(`${page}: dead anchor ${href}`);
      continue;
    }
    let target = href.split('?')[0].split('#')[0];
    if (target === '/' || target === '') target = 'index.html';
    if (target.startsWith('/')) target = target.slice(1);
    if (!target) continue;
    if (!existsSync(join(ROOT, target))) issues.push(`${page}: dead link ${href} -> ${target}`);
  }

  const req = EXPECTED[page];
  if (req) {
    for (const need of req.mustInclude || []) {
      if (!hrefs.includes(need) && !html.includes(`href="${need}"`) && !html.includes(`href='${need}'`)) {
        issues.push(`${page}: missing required link ${need}`);
      }
    }
    for (const id of req.mustHaveIds || []) {
      if (!ids.has(id)) issues.push(`${page}: missing required id #${id}`);
    }
  }

  // Pro pages must link home + pricing
  if (page.endsWith('-pro.html')) {
    if (!hrefs.some((h) => h === '/')) issues.push(`${page}: no home link (/)`);
    if (!hrefs.some((h) => h === '/pricing.html')) issues.push(`${page}: no pricing link`);
  }
}

for (const page of PAGES) checkPage(page);

// Category map on homepage (role cards)
const index = readFileSync(join(ROOT, 'index.html'), 'utf8');
const roleMap = [
  ['Engineering', '/sc008-pro.html'],
  ['Estimating', '/quote-pro.html'],
  ['Costing', '/labor-pro.html'],
  ['Fabrication', '/weld-pro.html'],
  ['Quality', '/sc008-pro.html']
];
for (const [role, href] of roleMap) {
  const re = new RegExp(`href="${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>[\\s\\S]{0,400}?${role}`);
  if (!re.test(index)) issues.push(`index.html: role "${role}" not wired to ${href}`);
}

if (!index.includes('id="mobileMenuBtn"') || !index.includes('id="mobileNav"')) {
  issues.push('index.html: mobile nav hamburger missing');
}
if (!index.includes('id="main-content"')) {
  issues.push('index.html: skip-link target #main-content missing');
}

const discovery = ['robots.txt', 'sitemap.xml', 'llms.txt', 'llm.txt'];
for (const f of discovery) {
  if (!existsSync(join(ROOT, 'public', f))) issues.push(`public/${f}: FILE MISSING`);
}

if (issues.length) {
  console.error('[FAIL] Navigation audit\n' + issues.map((i) => ' - ' + i).join('\n'));
  process.exit(1);
}
console.log(`[PASS] Navigation audit: ${PAGES.length} pages, category map OK`);
// list dist presence
const dist = join(ROOT, 'dist');
if (existsSync(dist)) {
  const missing = PAGES.filter((p) => !existsSync(join(dist, p)));
  if (missing.length) {
    console.error('[FAIL] dist missing: ' + missing.join(', '));
    process.exit(1);
  }
  const missingDiscovery = discovery.filter((f) => !existsSync(join(dist, f)));
  if (missingDiscovery.length) {
    console.error('[FAIL] dist missing discovery files: ' + missingDiscovery.join(', '));
    process.exit(1);
  }
  console.log('[PASS] dist contains all audited pages + discovery files');
}
