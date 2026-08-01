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
  { page: 'bearing-pro.html', guide: 'content/guides/sc021.html', mode: 'before-footer' },
  { page: 'fits-pro.html', guide: 'content/guides/sc027.html', mode: 'before-footer' },
  { page: 'surface-finish-pro.html', guide: 'content/guides/sc028.html', mode: 'before-footer' },
  { page: 'bend-pro.html', guide: 'content/guides/sc030.html', mode: 'before-footer' },
  { page: 'punching-pro.html', guide: 'content/guides/sc039.html', mode: 'before-footer' },
];

const GUIDE_ASSETS_V = 3;
const ASSETS = `
<link rel="stylesheet" href="/sc-tool-guide.css?v=${GUIDE_ASSETS_V}">
<script src="/sc-tool-guide.js?v=${GUIDE_ASSETS_V}" defer></script>
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

const MOUNT = '<!--SC-GUIDE-MOUNT-->';

function stripOld(html) {
  return html.replace(/<!--SC-GUIDE-START-->[\s\S]*?<!--SC-GUIDE-END-->\n?/g, '');
}

function inject(html, block, pageFile) {
  // Idempotent: drop any previously injected guide block first.
  html = stripOld(html);
  if (!html.includes(MOUNT)) {
    throw new Error(`SC_GUIDE_MOUNT_MISSING: ${pageFile}`);
  }
  // Calculator-first DOM order: the guide must mount at the SC-GUIDE-MOUNT
  // marker, which authors place AFTER the calculator layout. Never fall back to
  // </head>/<body>/<script type="module"> anchors — those pushed the guide above
  // the form and hid the calculator 4000px+ down the page.
  return html.replace(MOUNT, `${block}\n${MOUNT}`);
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
  try {
    html = inject(html, wrap(fragment), row.page);
  } catch (err) {
    console.error(`[FAIL] ${err.message}`);
    process.exit(1);
  }
  writeFileSync(pagePath, html);
  ok++;
  console.log(`[OK] ${row.page} ← ${row.guide}`);
}
console.log(`[PASS] Injected ${ok} tool guides`);
