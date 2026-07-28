#!/usr/bin/env node
/**
 * Prerender tools.html catalog from src/data/tools-catalog.json.
 * Cards/stats ship in HTML for AEO crawlers that do not execute JS.
 * Client JS only filters (hidden) — it never rebuilds the catalog DOM.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { isFreeToolId } from '../seo/free-tools.mjs';

const ROOT = process.cwd();
const DATA_PATH = join(ROOT, 'src/data/tools-catalog.json');
const PAGE = join(ROOT, 'tools.html');
const PUBLIC_COPY = join(ROOT, 'public/data/tools-catalog.json');

const STATS_START = '<!--SC-TOOLS-STATS-START-->';
const STATS_END = '<!--SC-TOOLS-STATS-END-->';
const TILES_START = '<!--SC-TOOLS-TILES-START-->';
const TILES_END = '<!--SC-TOOLS-TILES-END-->';
const CAT_START = '<!--SC-TOOLS-CATALOG-START-->';
const CAT_END = '<!--SC-TOOLS-CATALOG-END-->';

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripMarkers(html, start, end) {
  return html.replace(new RegExp(`${start}[\\s\\S]*?${end}\\n?`, 'g'), '');
}

function replaceOrInsert(html, start, end, inner, anchorRe, wrap) {
  let out = stripMarkers(html, start, end);
  const block = `${start}\n${inner}\n${end}`;
  if (anchorRe.test(out)) {
    return out.replace(anchorRe, wrap(block));
  }
  throw new Error(`inject-tools-catalog: anchor missing for ${start}`);
}

function renderStats(live, pipe) {
  return `<div><div class="n" id="stLive">${live}</div><div class="l">Live tools</div></div>
      <div><div class="n" id="stPipe">${pipe}</div><div class="l">In pipeline</div></div>
      <div><div class="n">100%</div><div class="l">Deterministic</div></div>
      <div><div class="n">A1–A5</div><div class="l">Audit trail</div></div>
      <div><div class="n">0</div><div class="l">Data leaves browser</div></div>`;
}

function renderTiles(categories, tools) {
  return categories
    .map((c) => {
      const n = tools.filter((t) => t.c === c.id).length;
      const blurb = (c.purpose.split(/[—–-]/)[1] || c.purpose).trim();
      return `<div class="tile" data-cat="${esc(c.id)}" role="button" tabindex="0">
      <svg viewBox="0 0 42 42" aria-hidden="true">${c.icon || ''}</svg>
      <div class="tn">${esc(c.name)}</div>
      <div class="tc">${n} calculator${n !== 1 ? 's' : ''}</div>
      <div class="tp">${esc(blurb)}</div>
    </div>`;
    })
    .join('\n');
}

function renderCatalog(categories, tools) {
  const lines = ['<!-- BUILD-GENERATED — do not edit by hand -->'];
  for (const c of categories) {
    const catTools = tools.filter((t) => t.c === c.id);
    if (!catTools.length) continue;
    lines.push(`<section class="catsec" id="cat-${esc(c.id)}" data-cat="${esc(c.id)}">
      <h2>${esc(c.full)} calculators</h2>
      <div class="cp">${esc(c.purpose)}</div>
      <div class="tool-grid">`);
    for (const t of catTools) {
      const status = t.live ? 'live' : 'pipeline';
      const title = `${t.code} ${t.name}`.replace(/\s+/g, ' ').trim();
      const free = isFreeToolId(t.code);
      const accessBadge = free
        ? `<span class="access-plate access-plate--bench" title="Open reference instrument — calculate immediately, no session debit"><span class="access-k">Access</span><span class="access-v">Open bench</span><span class="access-s">No session debit</span></span>`
        : t.live
          ? `<span class="access-plate access-plate--tier" title="Tier-A decision instrument — one credit unlocks a 24-hour deterministic session"><span class="access-k">Access</span><span class="access-v">Tier-A</span><span class="access-s">Credit session · 24h</span></span>`
          : '';
      const body = t.live
        ? `<a href="${esc(t.url)}"><h3>${esc(title)}</h3></a>
        <p>${esc(t.blurb || '')}</p>
        ${accessBadge}`
        : `<h3 class="planned-i">${esc(title)}</h3>
        <p>${esc(t.blurb || '')}</p>
        <span class="access-plate access-plate--planned" title="In the drawing index but not commissioned yet"><span class="access-k">Status</span><span class="access-v">Planned</span><span class="access-s">Not commissioned</span></span>`;
      lines.push(`<article class="tool-card" data-status="${status}" data-cat="${esc(t.c)}" data-code="${esc(t.code)}" data-kw="${esc(t.kw || '')}" data-live="${t.live ? '1' : '0'}"${free ? ' data-access="free"' : ' data-access="credits"'}>
        ${body}
      </article>`);
    }
    lines.push(`</div>
    </section>`);
  }
  return lines.join('\n');
}

function ensureCss(html) {
  // Idempotent: strip prior access/hint CSS (legacy badges + access plates), then re-append once.
  html = html.replace(/\.tool-card \.badge-f,\.tool-card \.badge-s\{[^}]*\}\n?/g, '');
  html = html.replace(/\.tool-card \.badge-f\{[^}]*\}\n?/g, '');
  html = html.replace(/\.tool-card \.badge-s\{[^}]*\}\n?/g, '');
  html = html.replace(/\.tool-card\[data-access="free"\]\{[^}]*\}\n?/g, '');
  html = html.replace(/\.tools-free-hint\{[^}]*\}\n?/g, '');
  html = html.replace(/\.tools-free-hint strong\{[^}]*\}\n?/g, '');
  html = html.replace(/\.tools-free-hint a\{[^}]*\}\n?/g, '');
  html = html.replace(/\/\* SC-ACCESS-PLATES \*\/[\s\S]*?\/\* SC-ACCESS-PLATES-END \*\//g, '');

  const accessCss = `/* SC-ACCESS-PLATES */
.tool-card .access-plate{display:inline-grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;column-gap:8px;row-gap:1px;align-items:baseline;margin-top:2px;padding:6px 8px;border:1px solid var(--line);background:color-mix(in srgb,var(--panel) 92%,var(--ink));font-family:var(--mono, 'JetBrains Mono', ui-monospace, monospace);line-height:1.2;max-width:100%}
.tool-card .access-k{grid-column:1;grid-row:1 / span 2;align-self:center;font-size:8px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mut);writing-mode:horizontal-tb;border-right:1px solid var(--line);padding-right:8px}
.tool-card .access-v{grid-column:2;font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--ink)}
.tool-card .access-s{grid-column:2;font-size:9px;font-weight:500;letter-spacing:.02em;color:var(--mut)}
.tool-card .access-plate--bench{border-color:color-mix(in srgb,#0a7a3e 55%,var(--line));box-shadow:inset 3px 0 0 #0a7a3e}
.tool-card .access-plate--bench .access-v{color:#0a7a3e}
.tool-card .access-plate--tier{border-color:color-mix(in srgb,var(--accent) 50%,var(--line));box-shadow:inset 3px 0 0 var(--accent)}
.tool-card .access-plate--tier .access-v{color:var(--accent)}
.tool-card .access-plate--planned{opacity:.85}
.tool-card[data-access="free"]{border-color:color-mix(in srgb,#0a7a3e 35%,var(--line));box-shadow:inset 3px 0 0 #0a7a3e}
.tools-free-hint{margin:14px 0 4px;padding:10px 12px;border:1px solid color-mix(in srgb,#0a7a3e 40%,var(--line));border-left:3px solid #0a7a3e;background:color-mix(in srgb,#0a7a3e 6%,var(--panel));font-size:13px;line-height:1.45;color:var(--ink)}
.tools-free-hint strong{color:#0a7a3e;font-family:var(--mono,'JetBrains Mono',ui-monospace,monospace);font-size:11px;letter-spacing:.06em;text-transform:uppercase}
.tools-free-hint a{color:var(--accent);font-weight:700}
/* SC-ACCESS-PLATES-END */
`;

  if (html.includes('.tool-card{') || html.includes('.tool-card {')) {
    if (/\.tool-card \.badge-p\{[^}]+\}/.test(html)) {
      return html.replace(/\.tool-card \.badge-p\{[^}]+\}/, (m) => `${m}\n${accessCss}`);
    }
    return html.replace('</style>', `${accessCss}\n</style>`);
  }
  const cssBits = `
/* ---- prerendered tool cards (AEO-visible) ---- */
.tool-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin-top:8px}
.tool-card{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:16px 16px 14px;break-inside:avoid}
.tool-card h3{font-size:15px;line-height:1.35;color:var(--navy);font-family:'Barlow Condensed',sans-serif;letter-spacing:.3px;margin:0 0 6px}
html[data-theme="dark"] .tool-card h3{color:var(--ink)}
.tool-card a{color:inherit;text-decoration:none}
.tool-card a:hover h3{color:var(--accent);text-decoration:underline;text-underline-offset:3px}
.tool-card p{font-size:12.5px;color:var(--mut);line-height:1.45;margin:0 0 10px}
.tool-card .badge-l,.tool-card .badge-p{font-size:9px;font-weight:800;letter-spacing:.6px;border-radius:9px;padding:1px 6px;text-transform:uppercase}
.tool-card .badge-l{color:var(--ok);border:1px solid var(--ok)}
.tool-card .badge-p{color:var(--mut);border:1px solid var(--line)}
${accessCss}.tool-card[hidden],.catsec[hidden],.tile[hidden]{display:none!important}
`;
  return html.replace('</style>', `${cssBits}\n</style>`);
}

const HINT_START = '<!--SC-TOOLS-FREE-HINT-START-->';
const HINT_END = '<!--SC-TOOLS-FREE-HINT-END-->';

function renderFreeHint() {
  return `<aside class="tools-free-hint" data-tools-free-hint="1" aria-label="Open bench instruments on this catalog">
  <strong>Open bench</strong> — five reference instruments (SC-028, SC-027, SC-030, SC-039, SC-001) calculate immediately with no session debit. Look for the Open bench access plate on cards.
  <a href="/topics">Open-bench map</a> · <a href="/#free-calculators">Homepage bench</a>
</aside>`;
}

function main() {
  if (!existsSync(DATA_PATH)) {
    console.error('[FAIL] missing src/data/tools-catalog.json');
    process.exit(1);
  }
  if (!existsSync(PAGE)) {
    console.error('[FAIL] missing tools.html');
    process.exit(1);
  }

  const data = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
  const categories = data.categories || [];
  const tools = data.tools || [];
  if (tools.length < 25) {
    console.error(`[FAIL] tools-catalog.json has only ${tools.length} tools (need ≥25)`);
    process.exit(1);
  }

  const live = tools.filter((t) => t.live).length;
  const pipe = tools.filter((t) => !t.live).length;

  mkdirSync(dirname(PUBLIC_COPY), { recursive: true });
  copyFileSync(DATA_PATH, PUBLIC_COPY);

  let html = readFileSync(PAGE, 'utf8');
  html = ensureCss(html);

  // Compact free-access hint AFTER search/stats (never between nav and H1 — catalog DNA).
  html = html.replace(new RegExp(`${HINT_START}[\\s\\S]*?${HINT_END}\\n?`, 'g'), '');
  const hintBlock = `${HINT_START}\n${renderFreeHint()}\n${HINT_END}`;
  if (/<div class="tiles" id="tiles">/.test(html)) {
    html = html.replace(/<div class="tiles" id="tiles">/, `${hintBlock}\n    <div class="tiles" id="tiles">`);
  } else if (/id="tiles"/.test(html)) {
    html = html.replace(/<div[^>]*id="tiles"[^>]*>/, (m) => `${hintBlock}\n    ${m}`);
  }

  // Stats block
  if (!html.includes('id="stLive"') && !html.includes(STATS_START)) {
    console.error('[FAIL] tools.html missing stats mount');
    process.exit(1);
  }
  if (html.includes(STATS_START)) {
    html = html.replace(
      new RegExp(`${STATS_START}[\\s\\S]*?${STATS_END}`),
      `${STATS_START}\n${renderStats(live, pipe)}\n${STATS_END}`
    );
  } else {
    html = html.replace(
      /<div class="stats">[\s\S]*?<\/div>\s*(?=<div class="tiles")/,
      `<div class="stats">\n${STATS_START}\n${renderStats(live, pipe)}\n${STATS_END}\n</div>\n\n`
    );
  }

  // Tiles
  if (html.includes(TILES_START)) {
    html = html.replace(
      new RegExp(`${TILES_START}[\\s\\S]*?${TILES_END}`),
      `${TILES_START}\n${renderTiles(categories, tools)}\n${TILES_END}`
    );
  } else {
    html = html.replace(
      /<div class="tiles" id="tiles"><\/div>/,
      `<div class="tiles" id="tiles">\n${TILES_START}\n${renderTiles(categories, tools)}\n${TILES_END}\n</div>`
    );
  }

  // Catalog
  if (html.includes(CAT_START)) {
    html = html.replace(
      new RegExp(`${CAT_START}[\\s\\S]*?${CAT_END}`),
      `${CAT_START}\n${renderCatalog(categories, tools)}\n${CAT_END}`
    );
  } else {
    html = html.replace(
      /<div id="catalog"><\/div>/,
      `<div class="catalog" id="catalog">\n${CAT_START}\n${renderCatalog(categories, tools)}\n${CAT_END}\n</div>`
    );
  }

  // noresults: start hidden (content exists)
  html = html.replace(
    /<div class="noresults[^"]*" id="nores">/,
    '<div class="noresults hidden" id="nores" hidden>'
  );

  writeFileSync(PAGE, html);
  console.log(`[PASS] tools catalog prerendered (${tools.length} tools, live=${live}, pipe=${pipe})`);
}

main();
