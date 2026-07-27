#!/usr/bin/env node
/**
 * Inject Enterprise/Exclusive engineering graph-paper overlays.
 * Targets: *-pro.html, tools.html, pricing.html, account/login/ops,
 *          public/glossary/*.html, public/compare/*.html (term pages),
 *          and ensures CSS link on guide/hub shells via builders.
 * FORBIDDEN: index.html, public/sc-hero-*.js
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const CSS_HREF = '/sc-calc-sheet.css?v=3';
const CSS_HREF_ISOLATED = '/css/calculation-sheet.css?v=2';
const LINK = `<link rel="stylesheet" href="${CSS_HREF}">`;
const LINK_ISOLATED = `<link rel="stylesheet" href="${CSS_HREF_ISOLATED}">`;
const START = '<!--SC-CALC-SHEET-START-->';
const END = '<!--SC-CALC-SHEET-END-->';
const TB_START = '<!--SC-CALC-SHEET-TB-START-->';
const TB_END = '<!--SC-CALC-SHEET-TB-END-->';

/** SC-008 uses isolated cs-prefix theme (sectorcalc-calc-sheet-theme pack). */
const ISOLATED_CALC_PAGES = new Set(['sc008-pro.html']);

const FORBIDDEN = new Set([
  'index.html',
  'calculator.html',
  'calculator2.html',
  'calculator3.html',
  'calculator4.html',
  'pro.html',
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
  let out = html
    .replace(/<link[^>]+sc-calc-sheet\.css[^>]*>\s*/gi, '')
    .replace(/<link[^>]+calculation-sheet\.css[^>]*>\s*/gi, '');
  const href = isolated ? CSS_HREF_ISOLATED : CSS_HREF;
  const link = isolated ? LINK_ISOLATED : LINK;
  if (out.includes(href)) return out;
  if (/<\/head>/i.test(out)) {
    return out.replace(/<\/head>/i, `  ${link}\n</head>`);
  }
  return out;
}

function setBodyTheme(html, themeClass, { isolated = false, preserveGuidesShell = false } = {}) {
  const addClasses = themeClass.split(/\s+/).filter(Boolean);
  return html.replace(/<body([^>]*)>/i, (full, attrs) => {
    let a = attrs || '';
    a = a.replace(/\sclass=(["'])([\s\S]*?)\1/i, (m, q, cls) => {
      const cleaned = cls
        .split(/\s+/)
        .filter(Boolean)
        .filter((c) => !/^theme-(calc-sheet|drawing-index|bom|blueprint|eng-paper)$/.test(c))
        .filter((c) => c !== 'calc-sheet' && c !== 'has-grid');
      if (isolated) {
        cleaned.push('calc-sheet', 'has-grid');
      } else if (preserveGuidesShell && cleaned.includes('sc-guides-shell')) {
        // Paper comes from sc-guides-shell selector in CSS — keep exclusive modifiers
      } else {
        cleaned.push(...addClasses);
      }
      return ` class=${q}${[...new Set(cleaned)].join(' ')}${q}`;
    });
    if (!/\sclass=/i.test(a)) {
      a = isolated
        ? `${a} class="calc-sheet has-grid"`
        : `${a} class="${themeClass}"`;
    }
    return `<body${a}>`;
  });
}

function titleBlock(dwg, kind) {
  return `${TB_START}
<aside class="sc-calc-sheet-titleblock" aria-hidden="true">
  <div class="tb-row"><span class="tb-label">DWG</span><span class="tb-value">${dwg}</span></div>
  <div class="tb-row"><span class="tb-label">FMT</span><span class="tb-value">${kind}</span></div>
  <div class="tb-row"><span class="tb-label">REV</span><span class="tb-value">B</span></div>
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
  if (file === 'index.html' || (base === 'index.html' && !file.includes('/'))) {
    throw new Error('inject-calc-sheet refused to touch index.html');
  }
  if (FORBIDDEN.has(base) && !file.includes('/')) {
    throw new Error(`inject-calc-sheet refused to touch ${file}`);
  }

  const isolated = ISOLATED_CALC_PAGES.has(base);
  const preserveGuidesShell = opts.preserveGuidesShell === true;
  const markerTheme = isolated
    ? 'calc-sheet has-grid (isolated v2)'
    : preserveGuidesShell
      ? 'sc-guides-shell + eng-paper v3'
      : `${themeClass} v3`;

  let html = readFileSync(path, 'utf8');
  const before = html;
  html = stripMarkers(html, START, END);
  html = ensureCssLink(html, { isolated });
  html = setBodyTheme(html, themeClass, { isolated, preserveGuidesShell });
  html = injectTitleBlock(html, dwg, kind);
  if (!html.includes(START)) {
    html = html.replace(
      /<\/head>/i,
      `  ${START}\n  <!-- calc-sheet theme: ${markerTheme} -->\n  ${END}\n</head>`
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

function assertHomepageUntouched() {
  const indexPath = join(ROOT, 'index.html');
  const html = readFileSync(indexPath, 'utf8');
  if (
    html.includes('sc-calc-sheet.css') ||
    html.includes('calculation-sheet.css') ||
    html.includes('theme-calc-sheet') ||
    html.includes('theme-blueprint') ||
    html.includes('theme-eng-paper') ||
    /\bclass=["'][^"']*\bcalc-sheet\b/.test(html)
  ) {
    throw new Error('GUARD: index.html must not receive calc-sheet / blueprint / eng-paper theme');
  }
  if (!html.includes('sc-hero-cell-v24.js') && !html.includes('sc-hero-cell')) {
    throw new Error('GUARD: index.html missing sc-hero-cell — abort');
  }
  if (!html.includes('sc-hero-cell-v24.js')) {
    throw new Error('GUARD: index.html must reference immutable sc-hero-cell-v24.js');
  }
}

function main() {
  assertHomepageUntouched();

  let n = 0;
  const pros = readdirSync(ROOT).filter((f) => f.endsWith('-pro.html')).sort();
  for (const file of pros) {
    const dwg = TOOL_DWG[file] || file.replace(/-pro\.html$/, '').toUpperCase();
    if (processPage(file, 'theme-calc-sheet', dwg, 'CALC SHEET')) n += 1;
  }
  if (processPage('tools.html', 'theme-drawing-index', 'SC-TOOLS-001', 'DRAWING INDEX')) n += 1;
  if (processPage('pricing.html', 'theme-bom', 'SC-BOM-001', 'BOM')) n += 1;
  if (processPage('account.html', 'theme-eng-paper', 'SC-ACCT-001', 'ACCOUNT')) n += 1;
  if (processPage('login.html', 'theme-eng-paper', 'SC-AUTH-001', 'AUTH')) n += 1;
  if (processPage('sc-ops.html', 'theme-eng-paper', 'SC-OPS-001', 'OPS')) n += 1;

  for (const file of listHtml('public/glossary')) {
    if (file.endsWith('/index.html')) {
      if (processPage(file, 'sc-guides-shell', 'SC-GLOSS-HUB', 'GLOSSARY HUB', { preserveGuidesShell: true })) n += 1;
      continue;
    }
    const slug = file.split('/').pop().replace(/\.html$/, '').toUpperCase().slice(0, 12);
    if (processPage(file, 'theme-eng-paper', `SC-GL-${slug}`, 'GLOSSARY')) n += 1;
  }

  for (const file of listHtml('public/compare')) {
    if (file.endsWith('/index.html')) {
      if (processPage(file, 'sc-guides-shell', 'SC-CMP-HUB', 'COMPARE HUB', { preserveGuidesShell: true })) n += 1;
      continue;
    }
    const slug = file.split('/').pop().replace(/\.html$/, '').toUpperCase().slice(0, 12);
    if (processPage(file, 'theme-eng-paper', `SC-CMP-${slug}`, 'COMPARE')) n += 1;
  }

  for (const file of listHtml('public/guides')) {
    if (processPage(file, 'sc-guides-shell', 'SC-GUIDE', 'GUIDE', { preserveGuidesShell: true })) n += 1;
  }

  for (const file of listHtml('public/blog')) {
    if (processPage(file, 'theme-eng-paper', 'SC-BLOG', 'BLOG')) n += 1;
  }

  assertHomepageUntouched();
  console.log(`[PASS] Enterprise engineering paper overlay applied (${n} writes this run)`);
}

main();
