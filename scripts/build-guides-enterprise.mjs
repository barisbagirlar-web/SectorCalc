#!/usr/bin/env node
/**
 * Exclusive guides builder — money-parity AEO + dense content/guides bodies.
 * Fully regenerates hub + all guide pages. English-only. No fabricated ROI/reviews.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { GUIDE_ASSEMBLY } from '../seo/guides-assembly.mjs';
import { MONEY_CONTENT } from '../seo/money-content.mjs';
import { FREE_GUIDE_CONTENT } from '../seo/guides-free-content.mjs';
import { TOPICAL_MAPS } from '../seo/topical-maps.mjs';
import { AEO_EMPATHY } from '../seo/aeo-empathy.mjs';

const ROOT = process.cwd();
const HEADER = readFileSync(join(ROOT, 'content/partials/site-header.html'), 'utf8').trim();
const HOST = 'https://sectorcalc.com';
const CSS_V = 4;
const MIN_GUIDE_BYTES = 20000;

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function accessBadge(access) {
  if (access === 'free') return 'Open instrument · no sign-in';
  if (access === 'mixed') return 'Open weld size · heat input needs session';
  return 'Decision tool · credit session';
}

function headLinks() {
  return `<link rel="stylesheet" href="/css/seo-content.css">
<link rel="stylesheet" href="/sc-theme.css?v=12">
<link rel="stylesheet" href="/sc-site-nav.css?v=5">
<link rel="stylesheet" href="/sc-tool-guide.css?v=3">
<link rel="stylesheet" href="/css/sc-guides.css?v=${CSS_V}">
<link rel="stylesheet" href="/sc-calc-sheet.css?v=4">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Sans:wght@400;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<script src="/sc-theme.js?v=12" defer></script>
<script src="/sc-site-nav.js?v=2" defer></script>
<script src="/sc-tool-guide.js?v=3" defer></script>
<script type="module" src="/src/auth-nav.ts"></script>`;
}

function footer() {
  return `<footer class="sc-footer sc-guides-site-footer">
  <p>© 2026 SectorCalc · Deterministic industrial calculators · A1–A5 audit language</p>
  <p><a href="/#free-calculators">Free tools</a> · <a href="/tools.html">All tools</a> · <a href="/topics">Topics</a> · <a href="/pricing.html">Pricing</a> · <a href="/llms.txt">llms.txt</a></p>
</footer>`;
}

function editorialFor(g) {
  if (g.moneyEntity && MONEY_CONTENT[g.moneyEntity]) {
    const m = MONEY_CONTENT[g.moneyEntity];
    const empathy = AEO_EMPATHY[g.moneyEntity];
    return {
      problem: empathy?.problem || g.h1,
      promise: empathy?.promise || '',
      ...m,
    };
  }
  const key = g.calculator.toolId === 'SC-027' ? 'iso-286-fits'
    : g.calculator.toolId === 'SC-028' ? 'surface-finish'
    : g.calculator.toolId === 'SC-030' ? 'sheet-metal-bend'
    : g.calculator.toolId === 'SC-039' ? 'punching-force'
    : g.calculator.toolId === 'SC-001' ? 'surface-finish' // fallback unused
    : null;
  // weld uses moneyEntity weld-heat-input; free weld thickness uses FREE when moneyEntity null
  if (g.slug.startsWith('weld') && MONEY_CONTENT['weld-heat-input']) {
    // when moneyEntity set, handled above
  }
  const freeKey =
    g.calculator.toolId === 'SC-027' ? 'iso-286-fits'
    : g.calculator.toolId === 'SC-028' ? 'surface-finish'
    : g.calculator.toolId === 'SC-030' ? 'sheet-metal-bend'
    : g.calculator.toolId === 'SC-039' ? 'punching-force'
    : null;
  if (freeKey && FREE_GUIDE_CONTENT[freeKey]) return FREE_GUIDE_CONTENT[freeKey];
  throw new Error(`No editorial for ${g.slug}`);
}

function extractBody(path) {
  const abs = join(ROOT, path);
  if (!existsSync(abs)) throw new Error(`missing guide body ${path}`);
  let html = readFileSync(abs, 'utf8');
  // Prefer inner section.sc-guide; else whole file
  const m = html.match(/<section class="sc-guide"[\s\S]*<\/section>/i);
  if (m) return m[0];
  return html.replace(/^[\s\S]*?<body[^>]*>/i, '').replace(/<\/body>[\s\S]*$/i, '');
}

function workedHtml(path) {
  if (!path || !existsSync(join(ROOT, path))) return '';
  const fx = JSON.parse(readFileSync(join(ROOT, path), 'utf8'));
  const inputs = Object.entries(fx.inputs || {})
    .map(([k, v]) => {
      if (Array.isArray(v)) {
        return `<li><strong>${esc(k)}:</strong> ${v.length} component(s)</li>`;
      }
      if (v && typeof v === 'object') {
        return `<li><strong>${esc(k)}:</strong> ${esc(JSON.stringify(v))}</li>`;
      }
      return `<li><strong>${esc(k)}:</strong> ${esc(v)}</li>`;
    })
    .join('');
  const outputs = Object.entries(fx.outputs || {})
    .map(([k, v]) => `<li><strong>${esc(k)}:</strong> <code>${esc(v)}</code></li>`)
    .join('');
  return `<section class="sc-guide-block" data-aeo-step="evidence" id="worked-example">
  <h2>Evidence — worked example</h2>
  <p>${esc(fx.narrative || fx.title || '')}</p>
  <p class="sc-money-engine">Engine source: <code>${esc(fx.engineSource || 'n/a')}</code> · tool <code>${esc(fx.toolId || '')}</code></p>
  <div class="sc-guide-split">
    <div><h3>Inputs</h3><ul>${inputs}</ul></div>
    <div><h3>Outputs</h3><ul>${outputs}</ul></div>
  </div>
  <p><em>SectorCalc does not publish invented customer ROI. These numbers come from the deterministic engine fixture.</em></p>
</section>`;
}

function aeoRail() {
  const steps = [
    ['empathy', 'Problem'],
    ['direct-answer', 'Direct answer'],
    ['explanation', 'Explanation'],
    ['methodology', 'Methodology'],
    ['evidence', 'Evidence'],
    ['accountability', 'A1–A5'],
    ['related-problems', 'Related'],
  ];
  return `<nav class="sc-aeo-rail" aria-label="Answer engine chain">${steps
    .map(([id, label]) => `<a href="#aeo-${id}" data-aeo-rail="${id}">${label}</a>`)
    .join('')}</nav>`;
}

function moneyBlocks(ed, g) {
  return `
<section class="sc-guide-block" data-aeo-step="explanation" id="aeo-explanation-decision">
  <h2>Explanation — decision this supports</h2>
  <p>${esc(ed.decision)}</p>
</section>
<section class="sc-guide-block" data-aeo-step="explanation" id="aeo-explanation-inputs">
  <h2>Required inputs</h2>
  <p>${esc(ed.inputs)}</p>
</section>
<section class="sc-guide-block" data-aeo-step="methodology" id="aeo-methodology">
  <h2>Methodology — formula &amp; method</h2>
  <div class="sc-formula-block"><code>${esc(ed.formula)}</code></div>
</section>
${workedHtml(g.workedExample)}
<section class="sc-guide-block" data-aeo-step="explanation">
  <h2>What the result means</h2>
  <p>${esc(ed.interpretation)}</p>
</section>
<section class="sc-guide-block" data-aeo-step="explanation">
  <h2>What moves the result</h2>
  <p>${esc(ed.sensitivity)}</p>
</section>
<section class="sc-guide-block" data-aeo-step="methodology">
  <h2>Assumptions</h2>
  <p>${esc(ed.assumptions)}</p>
</section>
<section class="sc-guide-block" data-aeo-step="methodology">
  <h2>Model boundaries</h2>
  <p>${esc(ed.limitations)}</p>
</section>
<section class="sc-guide-block" data-aeo-step="evidence">
  <h2>Common engineering mistakes</h2>
  <p>${esc(ed.mistakes)}</p>
</section>
<section class="sc-guide-block" data-aeo-step="evidence">
  <h2>Evidence — standard &amp; reference scope</h2>
  <p>${esc(ed.standards)}</p>
</section>
<section class="sc-guide-block" data-aeo-step="accountability" id="aeo-accountability">
  <h2>Accountability — A1–A5 audit trail</h2>
  <p>${esc(ed.audit)}</p>
  <ol class="sc-a15">
    <li><strong>A1</strong> Engine identity / version</li>
    <li><strong>A2</strong> Inputs snapshot</li>
    <li><strong>A3</strong> Formula path</li>
    <li><strong>A4</strong> Assumptions</li>
    <li><strong>A5</strong> Warnings / out-of-band flags</li>
  </ol>
</section>`;
}

function relatedBlocks(g) {
  const gloss = (g.glossary || [])
    .map((href) => `<li><a href="${esc(href)}">${esc(href.replace(/^\/glossary\//, '').replace(/-/g, ' '))}</a></li>`)
    .join('');
  const rel = (g.related || [])
    .map((href) => `<li><a href="${esc(href)}">${esc(href)}</a></li>`)
    .join('');
  const fan = (g.fanOut || []).map((q) => `<li>${esc(q)}</li>`).join('');
  return `<section class="sc-guide-block" data-aeo-step="related-problems" id="aeo-related-problems">
  <h2>Related entities &amp; query fan-out</h2>
  ${gloss ? `<h3>Glossary</h3><ul>${gloss}</ul>` : ''}
  <h3>Calculators, topics, sibling guides</h3>
  <ul>${rel}</ul>
  <h3>Queries this guide owns in the cluster</h3>
  <ul class="sc-fanout">${fan}</ul>
</section>`;
}

function guidePage(g) {
  const ed = editorialFor(g);
  const bodies = g.bodies.map(extractBody).join('\n<hr class="sc-guide-body-split" />\n');
  const freeNote =
    g.access === 'free'
      ? 'This calculator is free — no sign-in, instant results.'
      : g.access === 'mixed'
        ? 'Weld thickness (SC-001) is free; weld heat input (SC-029) unlocks with credits.'
        : 'Unlock a credit session for 24-hour recalculation with A1–A5 audit trail. No subscription.';

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${HOST}/#organization`, name: 'SectorCalc', url: `${HOST}/` },
      {
        '@type': 'TechArticle',
        '@id': `${HOST}/guides/${g.slug}#article`,
        url: `${HOST}/guides/${g.slug}`,
        headline: g.h1,
        description: ed.directAnswer,
        datePublished: '2026-07-26',
        dateModified: '2026-07-28',
        author: { '@id': `${HOST}/#organization` },
        publisher: { '@id': `${HOST}/#organization` },
        isAccessibleForFree: g.access === 'free' || g.access === 'mixed',
        inLanguage: 'en-US',
        about: g.topic,
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['.sc-aeo-empathy', '.sc-direct-answer', 'h1', '#aeo-methodology'],
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${HOST}/` },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: `${HOST}/guides` },
          { '@type': 'ListItem', position: 3, name: g.title, item: `${HOST}/guides/${g.slug}` },
        ],
      },
      {
        '@type': 'HowTo',
        name: `How to use ${g.title}`,
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Read the problem', text: ed.problem },
          { '@type': 'HowToStep', position: 2, name: 'Open the calculator', text: `${g.calculator.label} at ${HOST}${g.calculator.href}` },
          { '@type': 'HowToStep', position: 3, name: 'Apply methodology', text: ed.formula },
          { '@type': 'HowToStep', position: 4, name: 'Keep A1–A5 notes', text: ed.audit },
        ],
      },
    ],
  };

  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(g.title)} | SectorCalc</title>
  <meta name="description" content="${esc(ed.directAnswer.slice(0, 158))}">
  <link rel="canonical" href="${HOST}/guides/${esc(g.slug)}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
  <meta property="og:title" content="${esc(g.title)} | SectorCalc">
  <meta property="og:description" content="${esc(ed.problem)}">
  <meta property="og:url" content="${HOST}/guides/${esc(g.slug)}">
  <meta property="og:type" content="article">
  <meta property="og:image" content="${HOST}/assets/images/og-default-1200x630.jpg">
  <meta name="twitter:card" content="summary_large_image">
  ${headLinks()}
  <script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
  </script>
</head>
<body class="sc-guides-shell sc-guides-exclusive">
${HEADER}
<main class="sc-guides-main sc-guide-article" id="main-content">
  <nav class="sc-breadcrumb" aria-label="Breadcrumb">
    <ol>
      <li><a href="/">Home</a></li>
      <li><a href="/guides">Guides</a></li>
      <li aria-current="page">${esc(g.title)}</li>
    </ol>
  </nav>

  <header class="sc-guide-hero-block">
    <p class="sc-guides-kicker">${esc(g.topic)} · ${esc(accessBadge(g.access))} · ${esc(g.calculator.toolId)}</p>
    <h1>${esc(g.h1)}</h1>
    <div class="sc-aeo-empathy" data-aeo-step="empathy" id="aeo-empathy">
      <p><strong>The problem:</strong> ${esc(ed.problem)}</p>
      ${ed.promise ? `<p><strong>What you get:</strong> ${esc(ed.promise)}</p>` : ''}
    </div>
    <p class="sc-direct-answer" data-aeo-step="direct-answer" id="aeo-direct-answer">${esc(ed.directAnswer)}</p>
    ${aeoRail()}
    <p class="sc-guide-access-note">${esc(freeNote)}</p>
    <a class="sc-btn-primary" href="${esc(g.calculator.href)}">${esc(g.calculator.label)} →</a>
  </header>

  ${moneyBlocks(ed, g)}

  <section class="sc-guide-deep" id="deep-methodology" aria-label="Deep methodology">
    <h2 class="sc-guide-deep-title">Deep methodology library</h2>
    <p class="sc-guide-deep-lead">The long-form reference below is the same engineering depth injected beside the live calculator — expanded here as a standalone guide for answer engines and humans.</p>
    ${bodies}
  </section>

  ${relatedBlocks(g)}

  <section class="sc-cta-panel" data-aeo-step="related-problems">
    <h2>Commercial next step</h2>
    <p>${esc(ed.commercial)}</p>
    <a class="sc-btn-primary" href="${esc(g.calculator.href)}">${esc(g.calculator.label)} →</a>
    <p class="sc-cta-secondary"><a href="/guides">← All engineering guides</a> · <a href="/#free-calculators">Open reference bench</a></p>
  </section>
</main>
${footer()}
</body>
</html>
`;
}

function hubHtml() {
  const free = GUIDE_ASSEMBLY.filter((g) => g.access === 'free');
  const paid = GUIDE_ASSEMBLY.filter((g) => g.access !== 'free');
  const card = (g) => {
    const ed = editorialFor(g);
    return `<article class="sc-guide-card sc-guide-card-exclusive" data-guide="${esc(g.slug)}" data-access="${esc(g.access)}" data-topic="${esc(g.topicId)}">
  <p class="sc-guide-badge" data-access="${esc(g.access)}">${esc(accessBadge(g.access))}</p>
  <h3>${esc(g.title)}</h3>
  <p class="sc-guide-problem"><strong>Problem:</strong> ${esc(ed.problem)}</p>
  <p class="sc-guide-answer"><strong>Direct answer:</strong> ${esc(ed.directAnswer.slice(0, 220))}${ed.directAnswer.length > 220 ? '…' : ''}</p>
  <p class="sc-guide-meta">${esc(g.topic)} · ${esc(g.calculator.toolId)} · A1–A5 language</p>
  <ul class="sc-guide-fanout">${(g.fanOut || []).slice(0, 3).map((q) => `<li>${esc(q)}</li>`).join('')}</ul>
  <a class="sc-guide-cta" href="/guides/${esc(g.slug)}">Open exclusive guide →</a>
  <a class="sc-guide-cta" href="${esc(g.calculator.href)}">${esc(g.calculator.label)} →</a>
</article>`;
  };

  const topics = TOPICAL_MAPS.map((t) => {
    const links = t.subtopics
      .flatMap((s) => s.links)
      .filter((l) => l.startsWith('/guides/'))
      .filter((v, i, a) => a.indexOf(v) === i);
    if (!links.length) return '';
    const queries = t.subtopics.flatMap((s) => s.fanOutQueries || []).slice(0, 4);
    return `<article class="sc-topic-rail-card">
      <h3>${esc(t.topic)}</h3>
      <p>${esc(t.problem)}</p>
      <ul>${links.map((l) => `<li><a href="${esc(l)}">${esc(l.replace('/guides/', ''))}</a></li>`).join('')}</ul>
      <p class="sc-fan-label">Fan-out</p>
      <ul class="sc-fanout">${queries.map((q) => `<li>${esc(q)}</li>`).join('')}</ul>
    </article>`;
  }).join('\n');

  const itemList = GUIDE_ASSEMBLY.map((g, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: g.title,
    url: `${HOST}/guides/${g.slug}`,
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${HOST}/guides#webpage`,
        url: `${HOST}/guides`,
        name: 'Exclusive Engineering Guides | SectorCalc',
        description:
          'Enterprise engineering guides with money-parity AEO chains: problem, direct answer, methodology, evidence, A1–A5 accountability, and calculator CTAs.',
        isPartOf: { '@id': `${HOST}/#website` },
        publisher: { '@id': `${HOST}/#organization` },
        inLanguage: 'en-US',
        about: GUIDE_ASSEMBLY.map((g) => g.title),
      },
      {
        '@type': 'ItemList',
        '@id': `${HOST}/guides#itemlist`,
        name: 'SectorCalc exclusive engineering guides',
        numberOfItems: GUIDE_ASSEMBLY.length,
        itemListElement: itemList,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${HOST}/` },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: `${HOST}/guides` },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${HOST}/guides#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What makes SectorCalc guides exclusive vs thin blog posts?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Each guide mirrors the Tier-A money-page contract: empathy, direct answer, decision, inputs, methodology, worked evidence when available, interpretation, sensitivity, assumptions, boundaries, mistakes, standards scope, A1–A5 accountability, and related entities — plus the deep methodology library used beside live calculators.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are guides free to read?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Reading is free. Linked calculators are free for ISO fits, surface finish, bend, punching, and weld thickness. Tier-A decision calculators unlock with credits.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do guides invent ROI or star ratings?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. No AggregateRating/Review schema and no fabricated customer ROI percentages. Worked examples come from deterministic engine fixtures when present.',
            },
          },
        ],
      },
    ],
  };

  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exclusive Engineering Guides | SectorCalc</title>
  <meta name="description" content="Enterprise engineering guides with money-parity answer chains for tolerance, CNC, bearings, labor, weld, ISO fits, finish, bend, and punch — free and credit-backed calculators.">
  <link rel="canonical" href="${HOST}/guides">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
  <meta property="og:title" content="Exclusive Engineering Guides | SectorCalc">
  <meta property="og:description" content="Problem → direct answer → methodology → evidence → A1–A5 → calculator. Not a thin slug list.">
  <meta property="og:url" content="${HOST}/guides">
  <meta property="og:type" content="website">
  <meta property="og:image" content="${HOST}/assets/images/og-default-1200x630.jpg">
  <meta name="twitter:card" content="summary_large_image">
  ${headLinks()}
  <script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
  </script>
</head>
<body class="sc-guides-shell sc-guides-exclusive">
${HEADER}
<main class="sc-guides-main" id="main-content">
  <header class="sc-guides-hero">
    <p class="sc-guides-kicker">Exclusive methodology library · answer-engine ready</p>
    <h1>Engineering guides at money-page depth</h1>
    <p class="sc-guides-lead">Every guide opens with the shop-floor problem, ships a direct answer, then the full explanation → methodology → evidence → A1–A5 accountability chain used on Tier-A calculators — plus the deep methodology library. Open-bench instruments calculate instantly. Decision tools unlock with a credit session. No invented certifications. No thin slug lists.</p>
    <div class="sc-guides-stats" aria-label="Guide library stats">
      <div class="sc-guides-stat"><b>${GUIDE_ASSEMBLY.length}</b><span>Exclusive guides</span></div>
      <div class="sc-guides-stat"><b>${free.length}</b><span>Free calculator guides</span></div>
      <div class="sc-guides-stat"><b>${paid.length}</b><span>Decision / mixed depth</span></div>
      <div class="sc-guides-stat"><b>16</b><span>Money-parity block contract</span></div>
    </div>
  </header>

  <section class="sc-guides-section" aria-labelledby="contract-heading">
    <h2 id="contract-heading">Editorial contract (non-negotiable)</h2>
    <div class="sc-guides-chain sc-guides-contract">
      <ol>
        <li><strong>Empathy / problem</strong> — the decision that hurts on the floor</li>
        <li><strong>Direct answer</strong> — what the guide + calculator deliver</li>
        <li><strong>Explanation</strong> — decision, inputs, interpretation, sensitivity</li>
        <li><strong>Methodology</strong> — formulas, assumptions, boundaries</li>
        <li><strong>Evidence</strong> — worked engine fixtures when available + standards scope</li>
        <li><strong>Accountability</strong> — A1–A5 audit language</li>
        <li><strong>Related entities</strong> — glossary, topics, sibling tools, query fan-out</li>
        <li><strong>Deep library</strong> — long-form methodology shared with live calculator pages</li>
      </ol>
    </div>
  </section>

  <section class="sc-guides-section" aria-labelledby="free-guides-heading">
    <h2 id="free-guides-heading">Free calculator guides — instant results</h2>
    <p>No sign-in. Citation-ready. Built for ISO fits, finish, bend, and punch query fan-out.</p>
    <div class="sc-guides-grid">${free.map(card).join('\n')}</div>
  </section>

  <section class="sc-guides-section" aria-labelledby="decision-guides-heading">
    <h2 id="decision-guides-heading">Decision guides — credit-backed depth</h2>
    <p>Stack-up, feeds &amp; speeds, bearing life, labor/quote economics, weld heat. Open the guide first; unlock the calculator when the job is real.</p>
    <div class="sc-guides-grid">${paid.map(card).join('\n')}</div>
  </section>

  <section class="sc-guides-section" aria-labelledby="topics-heading">
    <h2 id="topics-heading">Topical map — guides inside the cluster</h2>
    <p>Same topical SSOT that powers money pages and llms.txt discovery.</p>
    <div class="sc-guides-grid sc-topic-rail">${topics}</div>
  </section>

  <section class="sc-guides-section" aria-labelledby="hub-faq-heading">
    <h2 id="hub-faq-heading">Guides hub FAQ</h2>
    <details class="sc-faq-item"><summary>Why rebuild guides to money-page depth?</summary><p>Thin guides leak topical authority. Exclusive guides close the problem→method→tool→audit loop so Google and LLMs can retrieve a complete answer chain.</p></details>
    <details class="sc-faq-item"><summary>Is deep methodology duplicated on calculators?</summary><p>Yes — intentionally. Calculator pages keep the live UI first; standalone guides carry the same library for people who land on /guides.</p></details>
    <details class="sc-faq-item"><summary>Fake reviews or ROI?</summary><p>Never. Accountability is A1–A5 + Organization authorship.</p></details>
  </section>

  <nav class="sc-guides-footer-links" aria-label="Related hubs">
    <a href="/#free-calculators">Open reference bench</a>
    <a href="/topics">Topic hubs</a>
    <a href="/glossary">Glossary</a>
    <a href="/compare">Compare</a>
    <a href="/tools.html">All 25 calculators</a>
    <a href="/llms.txt">llms.txt discovery</a>
  </nav>
</main>
${footer()}
</body>
</html>
`;
}

// --- run ---
writeFileSync(join(ROOT, 'public/guides/index.html'), hubHtml());
console.log('[OK] exclusive hub → public/guides/index.html');

let fails = [];
for (const g of GUIDE_ASSEMBLY) {
  const html = guidePage(g);
  const path = join(ROOT, 'public/guides', `${g.slug}.html`);
  writeFileSync(path, html);
  const bytes = Buffer.byteLength(html, 'utf8');
  const status = bytes >= MIN_GUIDE_BYTES ? 'OK' : 'THIN';
  console.log(`[${status}] ${g.slug}.html — ${bytes} bytes`);
  if (bytes < MIN_GUIDE_BYTES) fails.push(`${g.slug} only ${bytes} bytes (min ${MIN_GUIDE_BYTES})`);
}
if (fails.length) {
  console.error('[FAIL] exclusive density gate:\n' + fails.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}
console.log(`[PASS] exclusive guides build: ${GUIDE_ASSEMBLY.length} guides ≥ ${MIN_GUIDE_BYTES} bytes`);
