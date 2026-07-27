#!/usr/bin/env node
/**
 * Inject visible AEO empathy + topical problem map on hub pages (idempotent).
 * Does NOT modify the sacred homepage hero — inserts after </section> of .sc-hero.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { TOPICAL_MAPS } from '../seo/topical-maps.mjs';

const ROOT = process.cwd();
const CSS = '/sc-aeo-hub.css?v=1';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function hubHtml() {
  const cards = TOPICAL_MAPS.map((t) => {
    const primary = t.subtopics[0]?.links?.find((l) => l.startsWith('/calculator/')) || t.subtopics[0]?.links?.[0] || '/tools.html';
    const queries = (t.subtopics[0]?.fanOutQueries || []).slice(0, 2)
      .map((q) => `<li>${esc(q)}</li>`)
      .join('');
    return `<article class="sc-aeo-hub-card" data-topic-id="${esc(t.topicId)}">
  <h3>${esc(t.topic)}</h3>
  <p class="sc-aeo-hub-problem">${esc(t.problem)}</p>
  <ul class="sc-aeo-hub-queries">${queries}</ul>
  <p><a href="${esc(primary)}">Open the calculator →</a></p>
</article>`;
  }).join('\n');

  return `<!--SC-AEO-HUB-START-->
<section class="sc-aeo-hub" id="problems-we-solve" aria-labelledby="aeo-hub-heading" data-aeo-hub="problems">
  <div class="sc-aeo-hub-inner">
    <p class="sc-aeo-hub-kicker">Answer engine · problem first</p>
    <h2 id="aeo-hub-heading">Touch the real shop-floor problem first</h2>
    <p class="sc-aeo-hub-lead">SectorCalc pages open with the decision that hurts — then the calculator, then methodology, evidence, and related problems. No filler. No invented certifications.</p>
    <div class="sc-aeo-hub-grid">
${cards}
    </div>
  </div>
</section>
<!--SC-AEO-HUB-END-->`;
}

function ensureCss(html) {
  if (html.includes('sc-aeo-hub.css')) {
    return html.replace(/sc-aeo-hub\.css\?v=\d+/g, 'sc-aeo-hub.css?v=1');
  }
  return html.replace(/<\/head>/i, `<link rel="stylesheet" href="${CSS}">\n</head>`);
}

function strip(html) {
  return html.replace(/<!--SC-AEO-HUB-START-->[\s\S]*?<!--SC-AEO-HUB-END-->\n?/g, '');
}

function inject(html) {
  html = strip(html);
  html = ensureCss(html);
  const block = hubHtml();
  // Homepage: before blueprint (keep sacred hero + trust strips intact)
  if (/class="sc-hero"/.test(html) && /id="blueprint"/.test(html)) {
    if (/<!--SC-AEO-HUB-START-->/.test(html) === false) {
      return html.replace(
        /(\s*)(<!-- ================= BLUEPRINT|<\s*section[^>]*id="blueprint")/,
        `$1${block}\n$1$2`
      );
    }
  }
  // tools / pro / pricing: after first H1 block or site-header
  if (/<!--SC-SITE-NAV-END-->/.test(html)) {
    return html.replace(/<!--SC-SITE-NAV-END-->/, `<!--SC-SITE-NAV-END-->\n${block}`);
  }
  if (/<main\b/i.test(html)) {
    return html.replace(/<main\b[^>]*>/i, (m) => `${m}\n${block}`);
  }
  return html.replace(/<body[^>]*>/i, (m) => `${m}\n${block}`);
}

const TARGETS = ['index.html', 'tools.html', 'pro.html', 'pricing.html'];
let n = 0;
for (const page of TARGETS) {
  const path = join(ROOT, page);
  if (!existsSync(path)) {
    console.warn(`[SKIP] missing ${page}`);
    continue;
  }
  let html = readFileSync(path, 'utf8');
  const next = inject(html);
  if (next !== html) {
    writeFileSync(path, next);
    n += 1;
    console.log(`[OK] AEO hub → ${page}`);
  } else {
    console.log(`[OK] AEO hub unchanged ${page}`);
  }
}
console.log(`[PASS] AEO hub inject on ${n}/${TARGETS.length} pages`);
