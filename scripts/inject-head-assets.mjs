#!/usr/bin/env node
/**
 * Inject content/partials/head-assets.html into every public HTML page.
 * Core theme/nav/calc-sheet/seo-content assets are SSOT — never hand-edit per page.
 * Page-specific CSS (form-fields, free-tools, aeo-hub, tool-guide, sc-guides) stays outside.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const PARTIAL_PATH = join(ROOT, 'content/partials/head-assets.html');
const START = '<!--SC-HEAD-ASSETS-START-->';
const END = '<!--SC-HEAD-ASSETS-END-->';

const SKIP_DIR = new Set([
  'node_modules',
  'dist',
  '.git',
  'functions',
  'coverage',
  'audit',
  'content',
  'seo',
  'tests',
  'src',
  '.npm-cache',
  '.codebase-memory',
]);

const SKIP_FILE = new Set([
  'calculator.html',
  'calculator2.html',
  'calculator3.html',
  'calculator4.html',
]);

/** Strip hand-written / stale copies of core assets (any version / relative path). */
const CORE_STRIP = [
  /<link[^>]+href=["'][^"']*sc-theme\.css[^"']*["'][^>]*>\s*/gi,
  /<link[^>]+href=["'][^"']*sc-site-nav\.css[^"']*["'][^>]*>\s*/gi,
  /<link[^>]+href=["'][^"']*sc-calc-sheet\.css[^"']*["'][^>]*>\s*/gi,
  /<link[^>]+href=["'][^"']*(?:\.\/|\/)?css\/seo-content\.css[^"']*["'][^>]*>\s*/gi,
  /<script[^>]+src=["'][^"']*sc-theme\.js[^"']*["'][^>]*><\/script>\s*/gi,
  /<script[^>]+src=["'][^"']*sc-site-nav\.js[^"']*["'][^>]*><\/script>\s*/gi,
];

function walkHtml(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (SKIP_DIR.has(name)) continue;
    const abs = join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) {
      walkHtml(abs, out);
      continue;
    }
    if (!name.endsWith('.html')) continue;
    if (SKIP_FILE.has(name) && dir === ROOT) continue;
    out.push(abs);
  }
  return out;
}

function stripMarkers(html) {
  const re = new RegExp(`${START}[\\s\\S]*?${END}\\n?`, 'g');
  return html.replace(re, '');
}

function stripCore(html) {
  let out = html;
  for (const re of CORE_STRIP) out = out.replace(re, '');
  return out;
}

function inject(html, block) {
  let out = stripMarkers(html);
  out = stripCore(out);
  const marked = `${START}\n${block}\n${END}`;
  if (/<\/head>/i.test(out)) {
    return out.replace(/<\/head>/i, `${marked}\n</head>`);
  }
  return `${out}\n${marked}\n`;
}

function main() {
  if (!existsSync(PARTIAL_PATH)) {
    console.error('[FAIL] missing content/partials/head-assets.html');
    process.exit(1);
  }
  const block = readFileSync(PARTIAL_PATH, 'utf8').trim();
  if (!block.includes('sc-theme.css?v=12') || !block.includes('sc-site-nav.css?v=5')) {
    console.error('[FAIL] head-assets partial missing required versioned core links');
    process.exit(1);
  }

  const files = [
    ...walkHtml(ROOT).filter((f) => relative(ROOT, f).split(/[\\/]/).length === 1),
    ...walkHtml(join(ROOT, 'public')),
  ];

  let n = 0;
  for (const abs of files) {
    const before = readFileSync(abs, 'utf8');
    if (!/<head[\s>]/i.test(before)) continue;
    const after = inject(before, block);
    if (after !== before) {
      writeFileSync(abs, after);
      n += 1;
      console.log(`[OK] head-assets → ${relative(ROOT, abs)}`);
    } else {
      console.log(`[SKIP] ${relative(ROOT, abs)}`);
    }
  }
  console.log(`[PASS] head-assets SSOT applied (${n} writes, ${files.length} scanned)`);
}

main();
