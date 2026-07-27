#!/usr/bin/env node
/**
 * Inject homepage free-calculators strip (idempotent).
 * Does NOT modify sacred .sc-hero markup beyond post-hero insertion.
 * tools.html catalog DNA is sacred — open bench lives on / and /topics only.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { FREE_TOOLS } from '../seo/free-tools.mjs';

const ROOT = process.cwd();
const CSS = '/sc-free-tools.css?v=2';
const START = '<!--SC-FREE-TOOLS-START-->';
const END = '<!--SC-FREE-TOOLS-END-->';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripHtml() {
  const cards = FREE_TOOLS.map(
    (t) => `<article class="sc-free-card" data-free-tool="${esc(t.toolId)}" data-entity="${esc(t.entity)}">
  <p class="sc-free-badge">Open · no sign-in</p>
  <h3>${esc(t.name)}</h3>
  <p class="sc-free-problem">${esc(t.problem)}</p>
  <a class="sc-free-cta" href="${esc(t.canonicalPath)}">Run this instrument →</a>
</article>`,
  ).join('\n');

  return `${START}
<section class="sc-free-tools" id="free-calculators" aria-labelledby="free-calculators-heading" data-aeo-hub="free">
  <div class="sc-free-inner">
    <p class="sc-free-kicker">Open reference bench · five instruments · wallet not required</p>
    <h2 id="free-calculators-heading">Prove the engine before you commission a session</h2>
    <p class="sc-free-lead">These five shop instruments calculate immediately — surface finish, ISO fits, bend allowance, punching force, weld thickness. No login. No debit. When the decision must survive a design review (tolerance stack-up, feeds &amp; speeds, quoting, OEE, pressure, heat input), unlock a Tier-A credit session. Explore the <a href="/topics">topic hubs</a> for related shop problems.</p>
    <div class="sc-free-grid">
${cards}
    </div>
  </div>
</section>
${END}`;
}

function ensureCss(html) {
  if (html.includes('sc-free-tools.css')) {
    return html.replace(/sc-free-tools\.css\?v=\d+/g, 'sc-free-tools.css?v=2');
  }
  return html.replace(/<\/head>/i, `<link rel="stylesheet" href="${CSS}">\n</head>`);
}

function strip(html) {
  return html.replace(new RegExp(`${START}[\\s\\S]*?${END}\\n?`, 'g'), '');
}

function injectHome(html) {
  html = strip(html);
  html = ensureCss(html);
  const block = stripHtml();
  // After sacred hero section, before trust-strip
  if (/class="sc-hero"/.test(html) && /trust-strip/.test(html)) {
    return html.replace(
      /(<\/section>\s*\n\s*)(<!-- ================= TRUST STRIP|<div class="trust-strip")/,
      `$1${block}\n\n  $2`,
    );
  }
  return html;
}

const targets = [
  { page: 'index.html', fn: injectHome },
];

let n = 0;
for (const { page, fn } of targets) {
  const path = join(ROOT, page);
  if (!existsSync(path)) {
    console.warn(`[SKIP] missing ${page}`);
    continue;
  }
  const html = readFileSync(path, 'utf8');
  const next = fn(html);
  if (next !== html) {
    writeFileSync(path, next);
    n += 1;
    console.log(`[OK] free-tools strip → ${page}`);
  } else {
    console.log(`[OK] free-tools strip unchanged ${page}`);
  }
}
console.log(`[PASS] free-tools strip on ${n}/${targets.length} pages`);
