#!/usr/bin/env node
/**
 * Light AEO contract for free Tier-B tools (idempotent).
 * Empathy → direct answer → free badge → upsell to Tier-A / sibling free tools.
 * Does NOT inject the full 16-block money contract.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { FREE_TOOLS } from '../seo/free-tools.mjs';

const ROOT = process.cwd();
const START = '<!--SC-FREE-AEO-START-->';
const END = '<!--SC-FREE-AEO-END-->';
const CSS = '/sc-free-tools.css?v=2';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function block(tool) {
  const words = tool.directAnswer.trim().split(/\s+/).length;
  if (words < 35 || words > 110) {
    throw new Error(`${tool.toolId} directAnswer word count ${words} outside 35–110`);
  }
  return `${START}
<aside class="sc-free-aeo" data-free-aeo="1" data-tool-id="${esc(tool.toolId)}" data-aeo-chain="empathy-direct-calc-upsell" data-access="free">
  <p class="sc-free-badge">Open instrument · no sign-in · no credits</p>
  <p class="sc-aeo-problem"><strong>The floor problem:</strong> ${esc(tool.problem)}</p>
  <p class="sc-direct-answer" data-aeo-step="direct-answer">${esc(tool.directAnswer)}</p>
  <p class="sc-free-aeo-note">Enter inputs below and press Calculate — this open instrument returns results immediately.</p>
  <p class="sc-free-aeo-upsell"><a href="${esc(tool.upsell.href)}">${esc(tool.upsell.label)} →</a></p>
</aside>
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

function inject(html, tool) {
  html = strip(html);
  html = ensureCss(html);
  const b = block(tool);
  // Prefer after H1 / header title
  if (/class="sc-header-title"|<h1\b/i.test(html)) {
    const next = html.replace(/(<h1\b[^>]*>[\s\S]*?<\/h1>)/i, `$1\n${b}`);
    if (next !== html) return next;
  }
  if (/<!--SC-GUIDE-START-->/.test(html)) {
    return html.replace(/<!--SC-GUIDE-START-->/, `${b}\n<!--SC-GUIDE-START-->`);
  }
  if (/<main\b/i.test(html)) {
    return html.replace(/<main\b[^>]*>/i, (m) => `${m}\n${b}`);
  }
  return html.replace(/<body[^>]*>/i, (m) => `${m}\n${b}`);
}

let n = 0;
for (const tool of FREE_TOOLS) {
  const path = join(ROOT, `${tool.sourceSlug}.html`);
  if (!existsSync(path)) {
    console.warn(`[SKIP] missing ${tool.sourceSlug}.html`);
    continue;
  }
  const html = readFileSync(path, 'utf8');
  const next = inject(html, tool);
  writeFileSync(path, next);
  n += 1;
  console.log(`[OK] free AEO → ${tool.sourceSlug}.html`);
}
console.log(`[PASS] free AEO injected on ${n}/${FREE_TOOLS.length} tools`);
