#!/usr/bin/env node
/**
 * Inject Pricing open-bench vs decision-tool chips from seo/free-tools.mjs SSOT.
 * Idempotent. Keeps commerce honesty: free chips ≠ credit chips.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  FREE_TOOLS,
  DECISION_TOOL_CHIPS,
  assertFreeUpsellsAreTierA,
} from '../seo/free-tools.mjs';
import { resolveToolCost } from '../seo/tool-pricing.mjs';

const ROOT = process.cwd();
const PAGE = join(ROOT, 'pricing.html');
const START = '<!--SC-PRICING-FLOOR-START-->';
const END = '<!--SC-PRICING-FLOOR-END-->';

const upsellErrors = assertFreeUpsellsAreTierA();
if (upsellErrors.length) {
  console.error('[FAIL] free upsells:\n' + upsellErrors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function chip(href, code, name, blurb, access) {
  let badge;
  if (access === 'free') {
    badge = '<span class="chip-access chip-free">Open bench · no session</span>';
  } else {
    const pricing = resolveToolCost(code);
    const tier = pricing?.tier || 'PRO';
    const cost = pricing?.creditCost ?? 7;
    badge = `<span class="chip-access chip-paid">${tier} · ${cost} cr · 24h</span>`;
  }
  return `<a class="tool-chip" data-access="${esc(access)}" href="${esc(href)}"><span class="sc">${esc(code)}</span>${badge}<span class="nm">${esc(name)}</span><span class="ds">${esc(blurb)}</span></a>`;
}

const freeChips = FREE_TOOLS.map((t) =>
  chip(t.canonicalPath, t.toolId, t.name, 'Open bench · no sign-in · no session debit', 'free'),
).join('\n        ');

const paidChips = DECISION_TOOL_CHIPS.map((t) =>
  chip(t.href, t.toolId, t.name, t.blurb, 'paid'),
).join('\n        ');

const block = `${START}
      <div class="section-label" style="margin-top:22px"><strong>02 · Open reference bench</strong><span>Five instruments · calculate immediately · wallet not required</span></div>
      <div class="tools-grid" data-pricing-floor="free" aria-label="Open reference bench calculators">
        ${freeChips}
      </div>
      <p class="floor-note">These five tools are free SEO-bait / shop reference instruments. Instant results — no login, no debit. They are not Tier-A decision engines.</p>
      <div class="section-label" style="margin-top:18px"><strong>03 · Decision tools</strong><span>CORE 3 · PRO 7 · ADVANCED 15 · 24h session before results run</span></div>
      <div class="tools-grid" data-pricing-floor="paid" aria-label="Tier-A decision calculators">
        ${paidChips}
      </div>
${END}`;

if (!existsSync(PAGE)) {
  console.error('[FAIL] pricing.html missing');
  process.exit(1);
}

let html = readFileSync(PAGE, 'utf8');
html = html.replace(new RegExp(`${START}[\\s\\S]*?${END}\\n?`, 'g'), '');

// Ensure chip access styles exist once
if (!html.includes('.chip-access{')) {
  const css = `
  .tool-chip .chip-access{display:inline-block;margin-top:4px;font-family:var(--mono);font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
  .tool-chip .chip-free{color:#0a7a3e}
  .tool-chip .chip-paid{color:var(--blue)}
  .floor-note{margin:10px 0 0;font-size:12.5px;color:var(--ink2);max-width:62rem;line-height:1.45}
`;
  html = html.replace('</style>', `${css}</style>`);
}

if (html.includes(START)) {
  html = html.replace(new RegExp(`${START}[\\s\\S]*?${END}`), block);
} else if (/<div class="section-label"[^>]*>\s*<strong>02 · Start on the floor/.test(html)) {
  html = html.replace(
    /<div class="section-label"[^>]*>\s*<strong>02 · Start on the floor[\s\S]*?<\/div>\s*<div class="tools-grid">[\s\S]*?<\/div>/,
    block,
  );
} else if (/data-pricing-floor="free"/.test(html) === false && /class="tools-grid"/.test(html)) {
  html = html.replace(
    /<div class="section-label"[^>]*>[\s\S]*?<div class="tools-grid">[\s\S]*?<\/div>/,
    block,
  );
} else if (/<div class="cta-row">/.test(html)) {
  html = html.replace('<div class="cta-row">', `${block}\n      <div class="cta-row">`);
} else {
  console.error('[FAIL] pricing.html missing floor / cta anchors');
  process.exit(1);
}

// Footer honesty line
html = html.replace(
  /Tier-A calculators require a credit session before results run\. Five open reference tools calculate without credits\./,
  'Open bench (section 02) calculates without credits. Decision tools (section 03) require a credit session before results run.',
);

writeFileSync(PAGE, html);
console.log(
  `[PASS] pricing floor injected: ${FREE_TOOLS.length} free + ${DECISION_TOOL_CHIPS.length} decision chips`,
);
