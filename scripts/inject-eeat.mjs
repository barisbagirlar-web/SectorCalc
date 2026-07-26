#!/usr/bin/env node
/**
 * Inject or strip Academic Oversight (E-E-A-T) band based on seo/evidence/expert-relationships.json.
 * If publicClaimAllowed/relationshipVerified/scopeVerified are not all true, strip existing bands.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const PARTIAL = join(ROOT, 'content/partials/academic-oversight.html');
const EVIDENCE = join(ROOT, 'seo/evidence/expert-relationships.json');
const EEAT_CSS_V = 3;
const CSS_LINK = `<link rel="stylesheet" href="./sc-eeat.css?v=${EEAT_CSS_V}">`;
const START = '<!--SC-EEAT-START-->';
const END = '<!--SC-EEAT-END-->';

function claimAllowed() {
  if (!existsSync(EVIDENCE)) return false;
  const data = JSON.parse(readFileSync(EVIDENCE, 'utf8'));
  return (data.relationships || []).some(
    (r) => r.publicClaimAllowed === true && r.relationshipVerified === true && r.scopeVerified === true,
  );
}

function stripBlock(html) {
  return html
    .replace(/<!--SC-EEAT-START-->[\s\S]*?<!--SC-EEAT-END-->\n?/g, '')
    .replace(
      /<section class="sc-eeat-shell"[\s\S]*?<\/section>\s*(?=(?:<!--SC-GUIDE|<!--SC-RELATED|<script type="module"|<aside class="sc-calc-sheet-titleblock"|<\/body>))/i,
      '',
    );
}

function ensureCss(html) {
  let out = html;
  if (!out.includes('sc-eeat.css')) {
    if (out.includes('</head>')) out = out.replace(/<\/head>/i, `  ${CSS_LINK}\n</head>`);
  } else {
    out = out.replace(/sc-eeat\.css\?v=\d+/g, `sc-eeat.css?v=${EEAT_CSS_V}`);
  }
  return out;
}

function injectBlock(html, block) {
  html = stripBlock(html);
  if (html.includes('<!--SC-GUIDE-START-->')) {
    return html.replace('<!--SC-GUIDE-START-->', `${block}\n<!--SC-GUIDE-START-->`);
  }
  if (html.includes('<!--SC-RELATED-TOOLS-START-->')) {
    return html.replace('<!--SC-RELATED-TOOLS-START-->', `${block}\n<!--SC-RELATED-TOOLS-START-->`);
  }
  if (html.includes('<script type="module"')) {
    return html.replace(/<script type="module"/, `${block}\n<script type="module"`);
  }
  if (html.includes('sc-calc-sheet-titleblock')) {
    return html.replace(
      /<aside class="sc-calc-sheet-titleblock"/,
      `${block}\n<aside class="sc-calc-sheet-titleblock"`,
    );
  }
  return html.replace(/<\/body>/i, `${block}\n</body>`);
}

function pages() {
  const pros = readdirSync(ROOT).filter((f) => f.endsWith('-pro.html'));
  return [...pros, 'tools.html'].sort();
}

function main() {
  const allowed = claimAllowed();
  let n = 0;

  if (!allowed) {
    for (const page of pages()) {
      const path = join(ROOT, page);
      if (!existsSync(path)) continue;
      let html = readFileSync(path, 'utf8');
      const before = html;
      html = stripBlock(html);
      if (html !== before) {
        writeFileSync(path, html);
        n += 1;
        console.log(`[STRIP] eeat ← ${page} (evidence publicClaimAllowed=false)`);
      }
    }
    console.log(`[PASS] E-E-A-T public claim disabled by evidence gate (${n} pages stripped)`);
    return;
  }

  if (!existsSync(PARTIAL)) {
    console.error('[FAIL] missing', PARTIAL);
    process.exit(1);
  }
  const fragment = readFileSync(PARTIAL, 'utf8').trim();
  if (!fragment.includes('neela-nataraj.jpg') || !fragment.includes('Prof. Dr. Neela Nataraj')) {
    console.error('[FAIL] academic-oversight partial missing Neela portrait / name');
    process.exit(1);
  }
  if (!fragment.includes(START) || !fragment.includes(END)) {
    console.error('[FAIL] academic-oversight partial missing SC-EEAT markers');
    process.exit(1);
  }

  for (const page of pages()) {
    if (page === 'index.html') continue;
    const path = join(ROOT, page);
    if (!existsSync(path)) continue;
    let html = readFileSync(path, 'utf8');
    const before = html;
    html = ensureCss(html);
    html = injectBlock(html, fragment);
    if (html !== before) {
      writeFileSync(path, html);
      console.log(`[OK] eeat → ${page}`);
      n += 1;
    }
  }
  console.log(`[PASS] Academic Oversight injected (${n} writes this run)`);
}

main();
