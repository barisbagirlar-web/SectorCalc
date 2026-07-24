#!/usr/bin/env node
/**
 * Inject SEO guide fragments into live calculator pages.
 * Idempotent: replaces between <!--SC-GUIDE-START--> and <!--SC-GUIDE-END-->.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

const MAP = [
  { page: 'sc008-pro.html', guide: 'content/guides/sc008.html', mode: 'before-body' },
  { page: 'labor-pro.html', guide: 'content/guides/sc010.html', mode: 'before-body' },
  { page: 'quote-pro.html', guide: 'content/guides/sc012.html', mode: 'before-body' },
  { page: 'weld-pro.html', guide: 'content/guides/sc001.html', mode: 'before-body' },
  { page: 'machining-pro.html', guide: 'content/guides/sc020.html', mode: 'before-footer' },
  { page: 'bearing-pro.html', guide: 'content/guides/sc021.html', mode: 'before-footer' }
];

const GUIDE_ASSETS_V = 3;
const ASSETS = `
<link rel="stylesheet" href="./sc-tool-guide.css?v=${GUIDE_ASSETS_V}">
<script src="./sc-tool-guide.js?v=${GUIDE_ASSETS_V}" defer></script>
`.trim();

function ensureAssets(html) {
  let out = html;
  if (!out.includes('sc-tool-guide.css')) {
    if (out.includes('</head>')) out = out.replace('</head>', `${ASSETS}\n</head>`);
  } else {
    out = out
      .replace(/sc-tool-guide\.css\?v=\d+/g, `sc-tool-guide.css?v=${GUIDE_ASSETS_V}`)
      .replace(/sc-tool-guide\.js\?v=\d+/g, `sc-tool-guide.js?v=${GUIDE_ASSETS_V}`);
  }
  return out;
}

function wrap(fragment) {
  return `<!--SC-GUIDE-START-->\n${fragment.trim()}\n<!--SC-GUIDE-END-->`;
}

function stripOld(html) {
  return html.replace(/<!--SC-GUIDE-START-->[\s\S]*?<!--SC-GUIDE-END-->\n?/g, '');
}

function inject(html, block, mode) {
  html = stripOld(html);
  if (mode === 'before-footer') {
    const re = /<footer\b[\s\S]*?<\/footer>/i;
    if (re.test(html)) return html.replace(re, `${block}\n$&`);
    // fallback: before theme toggle or body end
  }
  if (html.includes('<script type="module"')) {
    return html.replace(/<script type="module"/, `${block}\n<script type="module"`);
  }
  return html.replace(/<\/body>/i, `${block}\n</body>`);
}

let ok = 0;
for (const row of MAP) {
  const pagePath = join(ROOT, row.page);
  const guidePath = join(ROOT, row.guide);
  if (!existsSync(pagePath) || !existsSync(guidePath)) {
    console.error('[FAIL] missing', row.page, row.guide);
    process.exit(1);
  }
  let html = readFileSync(pagePath, 'utf8');
  const fragment = readFileSync(guidePath, 'utf8');
  html = ensureAssets(html);
  html = inject(html, wrap(fragment), row.mode);
  writeFileSync(pagePath, html);
  ok++;
  console.log(`[OK] ${row.page} ← ${row.guide}`);
}
console.log(`[PASS] Injected ${ok} tool guides`);
