#!/usr/bin/env node
/**
 * Inject ONE engineering graph-paper SSOT (body.sc-eng-paper).
 * All pages including index.html get BACKGROUND paper only via sc-eng-paper.
 * Theme chrome (wrap) stays off the homepage.
 * Titleblock stamp is retired sitewide — always strip, never inject.
 * FORBIDDEN on index: theme-calc-sheet, theme-blueprint, titleblock, hero rewrites.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
// Shared sc-calc-sheet.css is owned by content/partials/head-assets.html (hashed via hash-head-assets).
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

function stripMarkers(html, start, end) {
  const re = new RegExp(`${start}[\\s\\S]*?${end}\\n?`, 'g');
  return html.replace(re, '');
}

/** Remove retired DWG titleblock stamp (markers + any leftover markup). */
function stripTitleBlock(html) {
  let out = stripMarkers(html, TB_START, TB_END);
  out = out.replace(
    /<footer\b[^>]*\bsc-calc-sheet-titleblock\b[^>]*>[\s\S]*?<\/footer>\s*/gi,
    '',
  );
  out = out.replace(
    /<aside\b[^>]*\bsc-calc-sheet-titleblock\b[^>]*>[\s\S]*?<\/aside>\s*/gi,
    '',
  );
  return out;
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

function processPage(file, themeClass, opts = {}) {
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
  html = stripTitleBlock(html);
  html = ensureCssLink(html, { isolated });
  html = setBodyClasses(html, extra, { isolated });
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

  // Homepage: identical paper BACKGROUND only — never wrap/theme
  if (processPage('index.html', null, { paperOnly: true })) n += 1;

  const pros = readdirSync(ROOT).filter((f) => f.endsWith('-pro.html')).sort();
  for (const file of pros) {
    if (processPage(file, 'theme-calc-sheet')) n += 1;
  }
  if (processPage('tools.html', 'theme-drawing-index')) n += 1;
  if (processPage('pricing.html', 'theme-bom')) n += 1;
  if (processPage('pro.html', 'theme-drawing-index')) n += 1;
  if (processPage('account.html', 'theme-eng-paper')) n += 1;
  if (processPage('login.html', 'theme-eng-paper')) n += 1;
  if (processPage('sc-ops.html', 'theme-eng-paper')) n += 1;

  for (const file of listHtml('public/glossary')) {
    if (file.endsWith('/index.html')) {
      if (processPage(file, null, { preserveGuidesShell: true })) n += 1;
      continue;
    }
    if (processPage(file, 'theme-eng-paper')) n += 1;
  }

  for (const file of listHtml('public/compare')) {
    if (file.endsWith('/index.html')) {
      if (processPage(file, null, { preserveGuidesShell: true })) n += 1;
      continue;
    }
    if (processPage(file, 'theme-eng-paper')) n += 1;
  }

  for (const file of listHtml('public/guides')) {
    if (processPage(file, null, { preserveGuidesShell: true })) n += 1;
  }

  for (const file of listHtml('public/blog')) {
    if (processPage(file, 'theme-eng-paper')) n += 1;
  }

  for (const dir of EXTRA_SURFACE_DIRS) {
    for (const file of listHtml(dir)) {
      // Topics hub shares guides-shell paper islands; leaf topics stay theme-eng-paper.
      if (file === 'public/topics/index.html') {
        if (processPage(file, null, { preserveGuidesShell: true })) n += 1;
        continue;
      }
      if (processPage(file, 'theme-eng-paper')) n += 1;
    }
  }

  // Product 404 surface (not always in registry, still must match site DNA)
  if (existsSync(join(ROOT, 'public/404.html'))) {
    if (processPage('public/404.html', 'theme-eng-paper')) n += 1;
  }

  assertHomepageHeroSafe();
  console.log(`[PASS] Unified eng-paper v4 applied (${n} writes this run; titleblock stripped)`);
}

main();
