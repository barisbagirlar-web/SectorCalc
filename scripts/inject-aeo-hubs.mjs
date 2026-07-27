#!/usr/bin/env node
/**
 * Inject visible AEO empathy + topical problem map on discovery hubs (idempotent).
 * Does NOT modify the sacred homepage hero — inserts after .sc-hero / before blueprint.
 * FORBIDDEN:
 *   - pricing.html — commerce BOM page must keep its own soul
 *   - tools.html — catalog DNA is sacred; problem map lives on / and /topics
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { TOPICAL_MAPS } from '../seo/topical-maps.mjs';

const ROOT = process.cwd();
const CSS = '/sc-aeo-hub.css?v=1';
const FORBIDDEN = new Set(['pricing.html', 'tools.html']);
const TARGETS = ['index.html', 'pro.html'];

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function hubHtml() {
  const cards = TOPICAL_MAPS.map((t) => {
    const primary =
      t.subtopics[0]?.links?.find((l) => l.startsWith('/calculator/')) ||
      t.subtopics[0]?.links?.[0] ||
      '/tools.html';
    const queries = (t.subtopics[0]?.fanOutQueries || [])
      .slice(0, 2)
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

function stripHub(html) {
  return html.replace(/<!--SC-AEO-HUB-START-->[\s\S]*?<!--SC-AEO-HUB-END-->\n?/g, '');
}

function stripCss(html) {
  return html.replace(/\s*<link[^>]+sc-aeo-hub\.css[^>]*>\s*/gi, '\n');
}

function stripFromForbidden(html) {
  return stripCss(stripHub(html));
}

function inject(html) {
  html = stripHub(html);
  html = ensureCss(html);
  const block = hubHtml();
  // Homepage: before blueprint (keep sacred hero + trust strips intact).
  // Collapse leftover blank runs so rebuilds cannot double whitespace forever.
  if (/class="sc-hero"/.test(html) && /id="blueprint"/.test(html)) {
    html = html.replace(
      /\n(?:[ \t]*\n){2,}(?=\s*(?:<!-- ================= BLUEPRINT|<\s*section[^>]*id="blueprint"))/,
      '\n\n'
    );
    if (/<!--SC-AEO-HUB-START-->/.test(html)) return html;
    return html.replace(
      /(\n)([ \t]*)(<!-- ================= BLUEPRINT|<\s*section[^>]*id="blueprint")/,
      `$1${block}\n$2$3`
    );
  }
  // pro: after site-header
  if (/<!--SC-SITE-NAV-END-->/.test(html)) {
    return html.replace(/<!--SC-SITE-NAV-END-->/, `<!--SC-SITE-NAV-END-->\n${block}`);
  }
  if (/<main\b/i.test(html)) {
    return html.replace(/<main\b[^>]*>/i, (m) => `${m}\n${block}`);
  }
  return html.replace(/<body[^>]*>/i, (m) => `${m}\n${block}`);
}

let n = 0;

// Always scrub forbidden pages so a stale block cannot survive a rebuild.
for (const page of FORBIDDEN) {
  const path = join(ROOT, page);
  if (!existsSync(path)) continue;
  const html = readFileSync(path, 'utf8');
  const next = stripFromForbidden(html);
  if (next !== html) {
    writeFileSync(path, next);
    n += 1;
    console.log(`[OK] AEO hub stripped from forbidden page → ${page}`);
  } else {
    console.log(`[OK] AEO hub absent on forbidden page → ${page}`);
  }
  if (/sc-aeo-hub|problems-we-solve|SC-AEO-HUB/i.test(next)) {
    console.error(`[FAIL] ${page} still contains AEO hub after strip`);
    process.exit(1);
  }
}

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

console.log(`[PASS] AEO hub inject on ${n} pages (forbidden: ${[...FORBIDDEN].join(', ')})`);
