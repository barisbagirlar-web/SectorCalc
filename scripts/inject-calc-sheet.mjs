#!/usr/bin/env node
/**
 * Inject ONE engineering graph-paper SSOT (body.sc-eng-paper).
 * All pages including index.html get BACKGROUND paper only via sc-eng-paper.
 * Theme chrome (wrap/titleblock) stays off the homepage.
 * FORBIDDEN on index: theme-calc-sheet, theme-blueprint, titleblock, hero rewrites.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
// Shared sc-calc-sheet.css is owned by content/partials/head-assets.html (inject-head-assets).
const CSS_HREF = '/sc-calc-sheet.css?v=4';
const CSS_HREF_ISOLATED = '/css/calculation-sheet.css?v=2';
const LINK_ISOLATED = `<link rel="stylesheet" href="${CSS_HREF_ISOLATED}">`;
const START = '<!--SC-CALC-SHEET-START-->';
const END = '<!--SC-CALC-SHEET-END-->';
const TB_START = '<!--SC-CALC-SHEET-TB-START-->';
const TB_END = '<!--SC-CALC-SHEET-TB-END-->';

const ISOLATED_CALC_PAGES = new Set(['sc008-pro.html']);

const FORBIDDEN_ROOT = new Set([
  'calculator.html',
  'calculator2.html',
  'calculator3.html',
  'calculator4.html',
]);

/** Live public surfaces that must share sc-eng-paper (registry + product chrome). */
const EXTRA_SURFACE_DIRS = Object.freeze([
  'public/topics',
  'public/about',
  'public/contact',
  'public/privacy',
  'public/terms',
  'public/security',
  'public/status',
  'public/refund',
  'public/resources',
  'public/case-studies',
]);

const TOOL_DWG = Object.freeze({
  'sc008-pro.html': 'SC-008-001',
  'weld-pro.html': 'SC-001-001',
  'labor-pro.html': 'SC-010-001',
  'quote-pro.html': 'SC-012-001',
  'machining-pro.html': 'SC-020-001',
  'bearing-pro.html': 'SC-021-001',
  'tap-thread-pro.html': 'SC-022-001',
  'cycle-cost-pro.html': 'SC-023-001',
  'bearing-freq-pro.html': 'SC-024-001',
  'belt-chain-pro.html': 'SC-025-001',
  'shaft-pro.html': 'SC-026-001',
  'fits-pro.html': 'SC-027-001',
  'surface-finish-pro.html': 'SC-028-001',
  'heat-input-pro.html': 'SC-029-001',
  'bend-pro.html': 'SC-030-001',
  'sling-pro.html': 'SC-031-001',
  'shackle-eyebolt-pro.html': 'SC-032-001',
  'pressure-vessel-pro.html': 'SC-033-001',
  'pipe-wall-pro.html': 'SC-034-001',
  'bolt-pro.html': 'SC-035-001',
  'bolted-joint-pro.html': 'SC-036-001',
  'oee-pro.html': 'SC-037-001',
  'machine-rate-pro.html': 'SC-038-001',
  'punching-pro.html': 'SC-039-001',
  'hydraulic-pro.html': 'SC-040-001',
});

const TODAY = new Date().toISOString().slice(0, 10);

function stripMarkers(html, start, end) {
  const re = new RegExp(`${start}[\\s\\S]*?${end}\\n?`, 'g');
  return html.replace(re, '');
}

function ensureCssLink(html, { isolated = false } = {}) {
  // Shared sc-calc-sheet.css is injected by inject-head-assets (SSOT).
  // Only the isolated SC-008 calculation-sheet remains page-specific here.
  let out = html.replace(/<link[^>]+calculation-sheet\.css[^>]*>\s*/gi, '');
  if (isolated && /<\/head>/i.test(out)) {
    out = out.replace(/<\/head>/i, `  ${LINK_ISOLATED}\n</head>`);
  }
  return out;
}

function setBodyClasses(html, extraClasses, { isolated = false } = {}) {
  const add = new Set(['sc-eng-paper', ...extraClasses.filter(Boolean)]);
  if (isolated) {
    add.add('calc-sheet');
    add.add('has-grid');
  }
  return html.replace(/<body([^>]*)>/i, (full, attrs) => {
    let a = attrs || '';
    a = a.replace(/\sclass=(["'])([\s\S]*?)\1/i, (m, q, cls) => {
      const cleaned = cls
        .split(/\s+/)
        .filter(Boolean)
        .filter((c) => !/^theme-(calc-sheet|drawing-index|bom|blueprint|eng-paper)$/.test(c))
        .filter((c) => c !== 'calc-sheet' && c !== 'has-grid' && c !== 'sc-eng-paper');
      for (const c of add) cleaned.push(c);
      return ` class=${q}${[...new Set(cleaned)].join(' ')}${q}`;
    });
    if (!/\sclass=/i.test(a)) {
      a = `${a} class="${[...add].join(' ')}"`;
    }
    return `<body${a}>`;
  });
}

function titleBlock(dwg, kind) {
  return `${TB_START}
<aside class="sc-calc-sheet-titleblock" aria-hidden="true">
  <div class="tb-row"><span class="tb-label">DWG</span><span class="tb-value">${dwg}</span></div>
  <div class="tb-row"><span class="tb-label">FMT</span><span class="tb-value">${kind}</span></div>
  <div class="tb-row"><span class="tb-label">REV</span><span class="tb-value">C</span></div>
  <div class="tb-row"><span class="tb-label">DATE</span><span class="tb-value">${TODAY}</span></div>
</aside>
${TB_END}`;
}

function injectTitleBlock(html, dwg, kind) {
  let out = stripMarkers(html, TB_START, TB_END);
  const block = titleBlock(dwg, kind);
  if (/<\/body>/i.test(out)) {
    return out.replace(/<\/body>/i, `${block}\n</body>`);
  }
  return `${out}\n${block}\n`;
}

function processPage(file, themeClass, dwg, kind, opts = {}) {
  const path = join(ROOT, file);
  if (!existsSync(path)) {
    console.warn(`[WARN] missing ${file}`);
    return false;
  }
  const base = file.split('/').pop();
  if (FORBIDDEN_ROOT.has(base) && !file.includes('/')) {
    throw new Error(`inject-calc-sheet refused to touch ${file}`);
  }

  const isHome = file === 'index.html';
  const isolated = ISOLATED_CALC_PAGES.has(base);
  const paperOnly = opts.paperOnly === true || isHome;
  const preserveGuidesShell = opts.preserveGuidesShell === true;

  const extra = [];
  if (!paperOnly) {
    if (preserveGuidesShell) {
      // keep sc-guides-shell; paper via sc-eng-paper
    } else if (themeClass) {
      extra.push(themeClass);
    }
  }

  const markerTheme = paperOnly
    ? 'sc-eng-paper v4 (background only)'
    : isolated
      ? 'calc-sheet has-grid + sc-eng-paper v4'
      : preserveGuidesShell
        ? 'sc-guides-shell + sc-eng-paper v4'
        : `${themeClass} + sc-eng-paper v4`;

  let html = readFileSync(path, 'utf8');
  const before = html;
  html = stripMarkers(html, START, END);
  if (paperOnly) {
    // Homepage: never leave a titleblock behind
    html = stripMarkers(html, TB_START, TB_END);
  }
  html = ensureCssLink(html, { isolated });
  html = setBodyClasses(html, extra, { isolated });
  if (!paperOnly) {
    html = injectTitleBlock(html, dwg, kind);
  }
  if (!html.includes(START)) {
    html = html.replace(
      /<\/head>/i,
      `  ${START}\n  <!-- eng-paper: ${markerTheme} -->\n  ${END}\n</head>`
    );
  }
  if (html !== before) {
    writeFileSync(path, html);
    console.log(`[OK] eng-paper → ${file} (${markerTheme})`);
    return true;
  }
  console.log(`[SKIP] ${file} already themed`);
  return false;
}

function listHtml(dir) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .filter((f) => f.endsWith('.html'))
    .map((f) => join(dir, f).replace(/\\/g, '/'));
}

function assertHomepageHeroSafe() {
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  if (html.includes('theme-calc-sheet') || html.includes('theme-blueprint')) {
    throw new Error('GUARD: index.html must not use theme-calc-sheet / theme-blueprint');
  }
  if (html.includes('sc-calc-sheet-titleblock') || html.includes(TB_START)) {
    throw new Error('GUARD: index.html must not carry calc-sheet titleblock');
  }
  if (!html.includes('sc-hero-cell-v24.js')) {
    throw new Error('GUARD: index.html must reference immutable sc-hero-cell-v24.js');
  }
  if (!html.includes('sc-eng-paper')) {
    throw new Error('GUARD: index.html must use sc-eng-paper for shared background rhythm');
  }
  // Shared CSS link is owned by head-assets SSOT (may land after this script in the build).
  // Eng-paper body class + hero immutability are the hard checks here.
}

function main() {
  let n = 0;

  // Homepage: identical paper BACKGROUND only — never wrap/titleblock/theme
  if (processPage('index.html', null, null, null, { paperOnly: true })) n += 1;

  const pros = readdirSync(ROOT).filter((f) => f.endsWith('-pro.html')).sort();
  for (const file of pros) {
    const dwg = TOOL_DWG[file] || file.replace(/-pro\.html$/, '').toUpperCase();
    if (processPage(file, 'theme-calc-sheet', dwg, 'CALC SHEET')) n += 1;
  }
  if (processPage('tools.html', 'theme-drawing-index', 'SC-TOOLS-001', 'DRAWING INDEX')) n += 1;
  if (processPage('pricing.html', 'theme-bom', 'SC-BOM-001', 'BOM')) n += 1;
  if (processPage('pro.html', 'theme-drawing-index', 'SC-PRO-001', 'PRO CATALOG')) n += 1;
  if (processPage('account.html', 'theme-eng-paper', 'SC-ACCT-001', 'ACCOUNT')) n += 1;
  if (processPage('login.html', 'theme-eng-paper', 'SC-AUTH-001', 'AUTH')) n += 1;
  if (processPage('sc-ops.html', 'theme-eng-paper', 'SC-OPS-001', 'OPS')) n += 1;

  for (const file of listHtml('public/glossary')) {
    if (file.endsWith('/index.html')) {
      if (processPage(file, null, 'SC-GLOSS-HUB', 'GLOSSARY HUB', { preserveGuidesShell: true })) n += 1;
      continue;
    }
    const slug = file.split('/').pop().replace(/\.html$/, '').toUpperCase().slice(0, 12);
    if (processPage(file, 'theme-eng-paper', `SC-GL-${slug}`, 'GLOSSARY')) n += 1;
  }

  for (const file of listHtml('public/compare')) {
    if (file.endsWith('/index.html')) {
      if (processPage(file, null, 'SC-CMP-HUB', 'COMPARE HUB', { preserveGuidesShell: true })) n += 1;
      continue;
    }
    const slug = file.split('/').pop().replace(/\.html$/, '').toUpperCase().slice(0, 12);
    if (processPage(file, 'theme-eng-paper', `SC-CMP-${slug}`, 'COMPARE')) n += 1;
  }

  for (const file of listHtml('public/guides')) {
    if (processPage(file, null, 'SC-GUIDE', 'GUIDE', { preserveGuidesShell: true })) n += 1;
  }

  for (const file of listHtml('public/blog')) {
    if (processPage(file, 'theme-eng-paper', 'SC-BLOG', 'BLOG')) n += 1;
  }

  for (const dir of EXTRA_SURFACE_DIRS) {
    for (const file of listHtml(dir)) {
      const slug = file.replace(/^public\//, '').replace(/\.html$/, '').toUpperCase().replace(/[^A-Z0-9]+/g, '-').slice(0, 18);
      // Topics / legal / resources / case-studies: shared paper + light chrome
      if (processPage(file, 'theme-eng-paper', `SC-${slug}`, 'SURFACE')) n += 1;
    }
  }

  // Product 404 surface (not always in registry, still must match site DNA)
  if (existsSync(join(ROOT, 'public/404.html'))) {
    if (processPage('public/404.html', 'theme-eng-paper', 'SC-404', 'ERROR', { paperOnly: false })) n += 1;
  }

  assertHomepageHeroSafe();
  console.log(`[PASS] Unified eng-paper v4 applied (${n} writes this run)`);
}

main();
