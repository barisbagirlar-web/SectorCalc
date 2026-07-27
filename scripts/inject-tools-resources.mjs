#!/usr/bin/env node
/**
 * Keep tools.html Engineering Resources inside .wrap (before footer).
 * Fail-closed if the block would sit as an orphan body child (broken CSS layout).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const PAGE = join(ROOT, 'tools.html');
const START = '<!--SC-SEO-SPRINT-LINKS-START-->';
const END = '<!--SC-SEO-SPRINT-LINKS-END-->';

const BLOCK = `${START}
<section class="sc-seo-sprint-links" aria-label="Engineering resources">
  <h2>Engineering Resources</h2>
  <p>Glossary, comparison pages, and complete guides for shop-floor decision making.</p>
  <ul>
    <li><a href="/glossary">Engineering Glossary</a></li>
    <li><a href="/compare">SectorCalc vs Alternatives</a></li>
    <li><a href="/guides">Complete Engineering Guides</a></li>
  </ul>
</section>
${END}`;

if (!existsSync(PAGE)) {
  console.error('[FAIL] tools.html missing');
  process.exit(1);
}

let html = readFileSync(PAGE, 'utf8');

// Strip any prior placement (orphan body or inside wrap).
html = html.replace(new RegExp(`${START}[\\s\\S]*?${END}\\n?`, 'g'), '');

if (!html.includes('<footer>')) {
  console.error('[FAIL] tools.html missing <footer> anchor for resources block');
  process.exit(1);
}

// Prefer insertion immediately before the tools catalog footer inside .wrap.
html = html.replace('<footer>', `${BLOCK}\n  <footer>`);

// Guard: block must appear before footer, and footer must still be inside .wrap.
const wrapIdx = html.indexOf('class="wrap"');
const blockIdx = html.indexOf(START);
const footerIdx = html.indexOf('<footer>');
const wrapCloseApprox = html.indexOf('</div>\n\n<script>', footerIdx); // wrap closes after footer

if (wrapIdx < 0 || blockIdx < 0 || footerIdx < 0) {
  console.error('[FAIL] tools.html resources placement markers missing after inject');
  process.exit(1);
}
if (!(wrapIdx < blockIdx && blockIdx < footerIdx)) {
  console.error('[FAIL] tools.html Engineering Resources must sit inside .wrap before <footer>');
  process.exit(1);
}
if (html.indexOf(START, blockIdx + 1) !== -1) {
  console.error('[FAIL] duplicate SC-SEO-SPRINT-LINKS blocks');
  process.exit(1);
}

writeFileSync(PAGE, html);
console.log('[PASS] tools.html Engineering Resources mounted inside .wrap before footer');
