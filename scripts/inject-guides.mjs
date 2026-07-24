#!/usr/bin/env node
/**
 * Inject SEO guide fragments into live calculator pages.
 * Idempotent: replaces between <!--SC-GUIDE-START--> and <!--SC-GUIDE-END-->.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const CANONICAL_ORIGIN = 'https://sectorcalc.com';
const LEGACY_ORIGIN = 'https://www.sectorcalc.com';

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

const SC021_VARIABLE_LOAD = `
<h2 id="variable-load-spectrum">How to calculate bearing L10 life under variable load</h2>
<p><strong>SC-021 evaluates one operating point at a time.</strong> When bearing load or speed changes through a duty cycle, first reduce the spectrum to equivalent operating values or calculate segment-by-segment fatigue damage using the current bearing manufacturer's method. Do not enter the peak load as though it were a constant duty unless that is intentionally the conservative design case.</p>

<div class="sc-formula">
  p = 3 for ball bearings · p = 10/3 for roller bearings<br>
  P<sub>m</sub> = [Σ(P<sub>i</sub><sup>p</sup> · n<sub>i</sub> · t<sub>i</sub>) / Σ(n<sub>i</sub> · t<sub>i</sub>)]<sup>1/p</sup><br>
  n<sub>m</sub> = Σ(n<sub>i</sub> · t<sub>i</sub>) / Σt<sub>i</sub><br>
  L<sub>10h</sub> = 10<sup>6</sup>/(60 · n<sub>m</sub>) · (C/P<sub>m</sub>)<sup>p</sup>
</div>

<p>At constant speed, the revolution weighting reduces to the time fraction q<sub>i</sub>: <strong>P<sub>m</sub> = [Σ(q<sub>i</sub> · P<sub>i</sub><sup>p</sup>)]<sup>1/p</sup></strong>. Each P<sub>i</sub> must already be the equivalent dynamic bearing load for that operating segment, including the appropriate radial/axial load factors for the exact bearing family.</p>

<h3>Worked example — two-step ball-bearing duty</h3>
<p>Assume a ball bearing with <strong>C = 40 kN</strong> at a constant <strong>1,500 rpm</strong>. The equivalent dynamic load is <strong>5 kN for 70%</strong> of the duty and <strong>10 kN for 30%</strong>. With p = 3, P<sub>m</sub> = [0.70·5³ + 0.30·10³]^(1/3) ≈ <strong>7.29 kN</strong>. The corresponding basic rating life is approximately <strong>1,835 hours</strong>. This example is basic L<sub>10</sub> screening only; it does not combine segment-specific lubrication, contamination, temperature, reliability, misalignment or a<sub>ISO</sub> effects.</p>

<div class="sc-tip"><span class="ico" aria-hidden="true">!</span><div><strong>Modified-life caution:</strong> if κ, e<sub>C</sub>, temperature or a<sub>ISO</sub> changes materially between duty segments, do not average those modifiers blindly. Evaluate each segment with the governing manufacturer/ISO method and accumulate fatigue damage. SC-021 does not currently claim a direct variable-load-spectrum solver.</div></div>

<p class="note">Reference basis: ISO 281 basic rating-life relationships and bearing-manufacturer guidance for equivalent operating values under variable load and speed. Final selection remains subject to the current bearing catalog, exact duty spectrum and competent engineering review.</p>
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

function enrichFragment(row, fragment) {
  let out = fragment.replaceAll(LEGACY_ORIGIN, CANONICAL_ORIGIN);
  if (row.page !== 'bearing-pro.html' || out.includes('id="variable-load-spectrum"')) return out;
  out = out.replace(
    '<li><a href="#faqs">Frequently asked questions</a></li>',
    '<li><a href="#variable-load-spectrum">Variable load and speed</a></li>\n    <li><a href="#faqs">Frequently asked questions</a></li>'
  );
  out = out.replace('<h2 id="faqs">Frequently asked questions</h2>', `${SC021_VARIABLE_LOAD}\n\n<h2 id="faqs">Frequently asked questions</h2>`);
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
  }
  if (html.includes('<script type="module"')) return html.replace(/<script type="module"/, `${block}\n<script type="module"`);
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
  const fragment = enrichFragment(row, readFileSync(guidePath, 'utf8'));
  html = ensureAssets(html);
  html = inject(html, wrap(fragment), row.mode);
  writeFileSync(pagePath, html);
  ok++;
  console.log(`[OK] ${row.page} ← ${row.guide}`);
}
console.log(`[PASS] Injected ${ok} tool guides`);
