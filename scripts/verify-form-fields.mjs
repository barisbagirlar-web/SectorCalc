#!/usr/bin/env node
/**
 * Hard gate: every calculator page must use the shared form-field layout.
 * Fails the build if digits can clip (min-width:0 on value inputs) or if
 * sc-form-fields.css is missing from a *-pro page / dist.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const FORM_CSS = join(ROOT, 'public', 'sc-form-fields.css');
const FORM_CSS_NAME = 'sc-form-fields.css';
const issues = [];

function listProPages() {
  return readdirSync(ROOT)
    .filter((f) => f.endsWith('-pro.html') && !f.includes('/'))
    .sort();
}

function styleBlocks(html) {
  return [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]);
}

/** Detect flex value-input rules that allow the field to shrink below readable width. */
function findClipRisks(css, page) {
  const compact = css.replace(/\s+/g, ' ');
  const patterns = [
    {
      re: /\.uwrap\s+input\s*\{[^}]*min-width\s*:\s*0\s*[;}]/i,
      msg: `${page}: .uwrap input uses min-width:0 (digits will clip)`
    },
    {
      re: /\.sc-input\s*\{[^}]*min-width\s*:\s*0\s*[;}]/i,
      msg: `${page}: .sc-input uses min-width:0 (digits will clip)`
    },
    {
      re: /\.uwrap\s+input\s*\{[^}]*min-width\s*:\s*0px\s*[;}]/i,
      msg: `${page}: .uwrap input uses min-width:0px (digits will clip)`
    }
  ];
  for (const p of patterns) {
    if (p.re.test(compact)) issues.push(p.msg);
  }
}

function checkProPage(page) {
  const path = join(ROOT, page);
  const html = readFileSync(path, 'utf8');

  if (!/<link[^>]+sc-form-fields\.css/i.test(html)) {
    issues.push(`${page}: missing <link> to ${FORM_CSS_NAME} (run inject:nav)`);
  }

  // Must have at least one recognized value+unit wrap pattern OR a number field
  const hasForm =
    html.includes('class="uwrap"') ||
    html.includes("class='uwrap'") ||
    html.includes('sc-input-wrap') ||
    /type=["']number["']/.test(html);
  if (!hasForm) {
    issues.push(`${page}: no calculator inputs found (expected .uwrap / .sc-input-wrap / type=number)`);
  }

  // Prefer structured wraps when a unit select sits beside a number
  if (/type=["']number["']/.test(html) && /class=["'][^"']*units/.test(html) && !html.includes('uwrap')) {
    if (!html.includes('sc-input-wrap')) {
      issues.push(`${page}: number+unit fields must use .uwrap or .sc-input-wrap`);
    }
  }

  for (const block of styleBlocks(html)) findClipRisks(block, page);
}

if (!existsSync(FORM_CSS)) {
  issues.push(`public/${FORM_CSS_NAME}: FILE MISSING (canonical form layout)`);
} else {
  const css = readFileSync(FORM_CSS, 'utf8');
  for (const need of [
    '.uwrap',
    'min-width:5.75rem',
    '.sc-input-wrap',
    'tabular-nums',
    '-webkit-appearance:none'
  ]) {
    if (!css.includes(need)) {
      issues.push(`public/${FORM_CSS_NAME}: missing required rule/token "${need}"`);
    }
  }
}

const proPages = listProPages();
if (!proPages.length) issues.push('no *-pro.html calculator pages at repo root');
for (const page of proPages) checkProPage(page);

// Form fields are linked explicitly on pages — theme must NOT @import them
// (duplicate render-blocking CSS was a Lighthouse regression).
const themePath = join(ROOT, 'public', 'sc-theme.css');
if (existsSync(themePath)) {
  const theme = readFileSync(themePath, 'utf8');
  if (/@import\s+url\(['"]?\.\/sc-form-fields\.css['"]?\)/i.test(theme)) {
    issues.push(`public/sc-theme.css: must not @import ${FORM_CSS_NAME} (link it from HTML only)`);
  }
}

// Source of truth for Lit tools
const proTheme = join(ROOT, 'src', 'styles', 'pro-theme.css');
if (existsSync(proTheme)) {
  const t = readFileSync(proTheme, 'utf8');
  findClipRisks(t, 'src/styles/pro-theme.css');
  if (/min-width:\s*0/.test(t) && /\.sc-input\s*\{[^}]*min-width:\s*0/.test(t.replace(/\s+/g, ' '))) {
    issues.push('src/styles/pro-theme.css: .sc-input must not use min-width:0');
  }
}

const distCss = join(ROOT, 'dist', FORM_CSS_NAME);
if (existsSync(join(ROOT, 'dist'))) {
  if (!existsSync(distCss)) {
    issues.push(`dist/${FORM_CSS_NAME}: missing after build`);
  }
  for (const page of proPages) {
    const distPage = join(ROOT, 'dist', page);
    if (!existsSync(distPage)) continue;
    const html = readFileSync(distPage, 'utf8');
    if (!/<link[^>]+sc-form-fields\.css/i.test(html)) {
      issues.push(`dist/${page}: missing ${FORM_CSS_NAME} link`);
    }
  }
}

if (issues.length) {
  console.error('[FAIL] Form-field layout gate\n' + issues.map((i) => ' - ' + i).join('\n'));
  process.exit(1);
}
console.log(`[PASS] Form-field layout: ${proPages.length} tools + canonical CSS OK`);
