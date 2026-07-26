#!/usr/bin/env node
/**
 * After Vite build: keep calculator bodies as *.engine.html, replace *-pro.html
 * with static redirect stubs so legacy URLs never serve full duplicate HTML
 * even if a CDN edge misses the Firebase 301 rule.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const HOST = 'https://sectorcalc.com';

const MAP = {
  'sc008-pro.html': '/calculator/tolerance-stack-up',
  'machining-pro.html': '/calculator/cnc-feeds-speeds',
  'tap-thread-pro.html': '/calculator/tap-thread-milling',
  'cycle-cost-pro.html': '/calculator/cycle-time-cost',
  'bearing-pro.html': '/calculator/bearing-life-l10',
  'bearing-freq-pro.html': '/calculator/bearing-frequencies',
  'belt-chain-pro.html': '/calculator/belt-chain-drive',
  'shaft-pro.html': '/calculator/shaft-design',
  'fits-pro.html': '/calculator/iso-286-fits',
  'surface-finish-pro.html': '/calculator/surface-finish',
  'weld-pro.html': '/calculator/weld-thickness',
  'heat-input-pro.html': '/calculator/weld-heat-input',
  'bend-pro.html': '/calculator/sheet-metal-bend',
  'punching-pro.html': '/calculator/punching-force',
  'sling-pro.html': '/calculator/sling-capacity',
  'shackle-eyebolt-pro.html': '/calculator/shackle-eyebolt',
  'pressure-vessel-pro.html': '/calculator/pressure-vessel-shell',
  'pipe-wall-pro.html': '/calculator/pipe-wall-thickness',
  'hydraulic-pro.html': '/calculator/hydraulic-cylinder',
  'bolt-pro.html': '/calculator/bolt-torque-preload',
  'bolted-joint-pro.html': '/calculator/bolted-joint',
  'labor-pro.html': '/calculator/true-labor-cost',
  'quote-pro.html': '/calculator/quote-pricing',
  'oee-pro.html': '/calculator/oee-teep',
  'machine-rate-pro.html': '/calculator/machine-hour-rate',
};

function stub(prettyPath) {
  const abs = `${HOST}${prettyPath}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex, follow">
  <meta http-equiv="refresh" content="0; url=${abs}">
  <link rel="canonical" href="${abs}">
  <title>Moved Permanently — SectorCalc</title>
  <script>window.location.replace(${JSON.stringify(abs)});</script>
  <style>
    body{font-family:IBM Plex Sans,Segoe UI,sans-serif;background:#0a0e1a;color:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
    a{color:#34d399;font-weight:600}
  </style>
</head>
<body>
  <p>This page moved permanently. <a href="${abs}">Continue to the calculator</a>.</p>
</body>
</html>
`;
}

if (!existsSync(DIST)) {
  console.error('[FAIL] dist/ missing — run vite build first');
  process.exit(1);
}

const firebasePath = join(ROOT, 'firebase.json');
const firebase = JSON.parse(readFileSync(firebasePath, 'utf8'));
const rewrites = firebase.hosting.rewrites || [];

let n = 0;
for (const [file, pretty] of Object.entries(MAP)) {
  const src = join(DIST, file);
  if (!existsSync(src)) {
    console.warn('[skip missing]', file);
    continue;
  }
  const engine = file.replace(/\.html$/, '.engine.html');
  const enginePath = join(DIST, engine);
  // Move full calculator HTML to sibling engine file (same folder => relative ./assets still work)
  writeFileSync(enginePath, readFileSync(src));
  writeFileSync(src, stub(pretty));

  // Point pretty URL rewrite at engine file (not the stub)
  const idx = rewrites.findIndex((r) => r.source === pretty);
  const dest = `/${engine}`;
  if (idx >= 0) rewrites[idx].destination = dest;
  else rewrites.push({ source: pretty, destination: dest });
  n += 1;
}

firebase.hosting.rewrites = rewrites;
writeFileSync(firebasePath, JSON.stringify(firebase, null, 2) + '\n');

// Proof artifact for humans / CI
const proof = {
  generatedAt: new Date().toISOString(),
  legacyFilesStubbed: n,
  note: 'Legacy *-pro.html in dist are redirect stubs (noindex). Calculators live at *.engine.html and /calculator/* rewrites.',
  schemaProofUrl: `${HOST}/calculator/tolerance-stack-up`,
  schemaIdsExpected: [
    'sc-schema-global',
    'sc-schema-tool-sc008-pro',
    'sc-schema-dataset-sc008-pro',
  ],
};
writeFileSync(join(DIST, 'seo-redirect-proof.json'), JSON.stringify(proof, null, 2));
console.log(`[PASS] finalize-legacy-redirects: stubbed ${n} legacy files → *.engine.html`);
