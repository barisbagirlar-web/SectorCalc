#!/usr/bin/env node
/**
 * Enterprise guides builder — hub + new long-form guides + polish existing guides.
 * Idempotent. English-only. No fabricated ROI / review stars.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { GUIDES } from '../seo/guides-catalog.mjs';

const ROOT = process.cwd();
const HEADER = readFileSync(join(ROOT, 'content/partials/site-header.html'), 'utf8').trim();
const HOST = 'https://sectorcalc.com';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function accessBadge(access) {
  if (access === 'free') return 'Free calculator · no sign-in';
  if (access === 'mixed') return 'Free weld size · heat input needs credits';
  return 'Calculator unlocks with credits';
}

function headAssets(extra = '') {
  return `<link rel="stylesheet" href="/sc-theme.css?v=12">
<link rel="stylesheet" href="/sc-site-nav.css?v=5">
<link rel="stylesheet" href="/css/sc-guides.css?v=1">
<script src="/sc-theme.js?v=12" defer></script>
<script src="/sc-site-nav.js?v=2" defer></script>
<script type="module" src="/src/auth-nav.ts"></script>
${extra}`;
}

function footer() {
  return `<footer class="sc-footer" style="max-width:1100px;margin:0 auto;padding:1.25rem;border-top:1px solid rgba(11,28,44,.12);display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between">
  <p style="margin:0;color:#3d5366">© 2026 SectorCalc · Deterministic industrial calculators</p>
  <p style="margin:0"><a href="/#free-calculators">Free tools</a> · <a href="/tools.html">All tools</a> · <a href="/pricing.html">Pricing</a></p>
</footer>`;
}

function hubHtml() {
  const free = GUIDES.filter((g) => g.access === 'free');
  const paid = GUIDES.filter((g) => g.access !== 'free');
  const card = (g) => `<article class="sc-guide-card" data-guide="${esc(g.slug)}" data-access="${esc(g.access)}" data-topic="${esc(g.topicId)}">
  <p class="sc-guide-badge" data-access="${esc(g.access)}">${esc(accessBadge(g.access))}</p>
  <h3>${esc(g.title)}</h3>
  <p class="sc-guide-problem"><strong>Problem:</strong> ${esc(g.problem)}</p>
  <p class="sc-guide-meta">${esc(g.topic)} · ${esc(g.calculator.toolId)}</p>
  <a class="sc-guide-cta" href="/guides/${esc(g.slug)}">Open guide →</a>
  <a class="sc-guide-cta" href="${esc(g.calculator.href)}">${esc(g.calculator.label)} →</a>
</article>`;

  const itemList = GUIDES.map((g, i) => ({
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
        name: 'Complete Engineering Guides | SectorCalc',
        description:
          'Problem-first engineering guides for tolerance, CNC, bearings, weld sizing, labor costing, ISO fits, surface finish, bend, and punching — linked to free and credit-backed calculators.',
        isPartOf: { '@id': `${HOST}/#website` },
        publisher: { '@id': `${HOST}/#organization` },
        inLanguage: 'en-US',
        about: GUIDES.map((g) => g.title),
      },
      {
        '@type': 'ItemList',
        '@id': `${HOST}/guides#itemlist`,
        name: 'SectorCalc engineering guides',
        numberOfItems: GUIDES.length,
        itemListElement: itemList,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${HOST}/` },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: `${HOST}/guides` },
        ],
      },
    ],
  };

  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complete Engineering Guides | SectorCalc</title>
  <meta name="description" content="Problem-first engineering guides for tolerance stack-up, CNC feeds, bearing life, labor costing, weld sizing, ISO 286 fits, surface finish, bend, and punching — with free and credit-backed calculators.">
  <link rel="canonical" href="${HOST}/guides">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
  <meta property="og:title" content="Complete Engineering Guides | SectorCalc">
  <meta property="og:description" content="Touch the shop-floor problem first. Then methodology, calculator, and related entities.">
  <meta property="og:url" content="${HOST}/guides">
  <meta property="og:type" content="website">
  <meta property="og:image" content="${HOST}/assets/images/og-default-1200x630.jpg">
  <meta name="twitter:card" content="summary_large_image">
  ${headAssets()}
  <script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
  </script>
</head>
<body class="sc-guides-shell">
${HEADER}
<main class="sc-guides-main" id="main-content">
  <header class="sc-guides-hero">
    <p class="sc-guides-kicker">Answer engine · methodology library</p>
    <h1>Engineering guides that start with the real problem</h1>
    <p class="sc-guides-lead">Each guide opens with the decision that hurts on the shop floor, then methodology, formulas, calculator CTA, and related entities. Free reference guides calculate instantly. Tier-A decision guides unlock with credits — no invented certifications.</p>
    <div class="sc-guides-stats" aria-label="Guide library stats">
      <div class="sc-guides-stat"><b>${GUIDES.length}</b><span>Long-form guides</span></div>
      <div class="sc-guides-stat"><b>${free.length}</b><span>Tied to free calculators</span></div>
      <div class="sc-guides-stat"><b>${paid.length}</b><span>Tier-A / mixed depth</span></div>
      <div class="sc-guides-stat"><b>A1–A5</b><span>Audit trail language</span></div>
    </div>
  </header>

  <section class="sc-guides-section" aria-labelledby="free-guides-heading">
    <h2 id="free-guides-heading">Free calculator guides — instant results</h2>
    <p>No sign-in. Built for citation, shop-floor reference, and query fan-out into ISO fits, finish, bend, and punch.</p>
    <div class="sc-guides-grid">
${free.map(card).join('\n')}
    </div>
  </section>

  <section class="sc-guides-section" aria-labelledby="decision-guides-heading">
    <h2 id="decision-guides-heading">Decision guides — credit-backed calculators</h2>
    <p>Stack-up, feeds &amp; speeds, bearing life, and labor/quote economics. Open the guide first; unlock the calculator when the job is real.</p>
    <div class="sc-guides-grid">
${paid.map(card).join('\n')}
    </div>
  </section>

  <section class="sc-guides-section" aria-labelledby="chain-heading">
    <h2 id="chain-heading">How every SectorCalc guide is structured</h2>
    <div class="sc-guides-chain">
      <p>Machine-readable authority chain for Google + LLM retrieval:</p>
      <ol>
        <li><strong>Empathy / problem</strong> — the shop-floor decision that hurts</li>
        <li><strong>Direct answer</strong> — what the guide + calculator actually deliver</li>
        <li><strong>Methodology</strong> — formulas, standards scope, assumptions</li>
        <li><strong>Calculation</strong> — link to the owning calculator (free or credits)</li>
        <li><strong>Mistakes &amp; FAQ</strong> — failure modes engineers hit in review</li>
        <li><strong>Related entities</strong> — glossary, topics, sibling tools</li>
      </ol>
    </div>
  </section>

  <nav class="sc-guides-footer-links" aria-label="Related hubs">
    <a href="/#free-calculators">Five free calculators</a>
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

function newGuideBody(g) {
  const freeNote =
    g.access === 'free'
      ? 'This calculator is free — no sign-in, instant results.'
      : g.access === 'mixed'
        ? 'Weld thickness is free; weld heat input (SC-029) requires a credit session.'
        : 'This calculator unlocks with a credit session (24h recalculation).';

  const sections = {
    'iso-286-fits-complete': {
      what: `ISO 286 defines hole and shaft tolerance zones relative to a nominal size. Letters like H7 or g6 are not millimetre clearances — they are zone identities whose limit deviations change with diameter band.`,
      method: `<h3>3.1 Hole vs shaft basis</h3><p>Confirm whether the hole or shaft is the basic feature. H-system holes are common; shaft grades (g, f, e…) set clearance or transition behavior.</p>
        <h3>3.2 Limit deviations</h3><div class="sc-formula-block"><code>ES / EI (hole) and es / ei (shaft) from ISO 286 tables for the selected size range</code><p>Always evaluate at the actual nominal diameter — the same grade letters are not a constant clearance.</p></div>
        <h3>3.3 When to escalate</h3><p>If the question is assembly closure under stacked contributors, move from fit selection to the credit-backed tolerance stack-up calculator.</p>`,
      mistakes: [
        ['Treating H7/g6 as a constant clearance', 'Look up limit deviations for the diameter band you actually machine.'],
        ['Mixing unsupported zone letters', 'SectorCalc exposes equation-backed families only — unsupported zones are not guessed.'],
        ['Skipping stack-up after fit pick', 'Local fit success does not guarantee assembly gap closure.'],
      ],
      faq: [
        ['Is the ISO 286 calculator free?', 'Yes. SC-027 runs without sign-in or credits.'],
        ['Does this replace the full ISO 286 standard?', 'No. Use it for exposed families and screening; keep the governing edition for release.'],
      ],
    },
    'surface-finish-complete': {
      what: `Ra (arithmetical mean) and Rz (average peak-to-valley) describe different statistics of the same profile. Treating them as interchangeable without an explicit conversion assumption causes scrap and supplier fights.`,
      method: `<h3>3.1 Read the acceptance language</h3><p>Confirm which parameter the drawing and customer standard actually use before converting.</p>
        <h3>3.2 Convert with visible assumptions</h3><div class="sc-formula-block"><code>Parameter translation only with documented conversion basis</code><p>Put the assumption on the traveler — not in tribal memory.</p></div>
        <h3>3.3 Validate on process data</h3><p>Converters align language; measured capability still owns production release.</p>`,
      mistakes: [
        ['Ra callout released as Rz limit', 'Confirm the governing surface-texture parameter first.'],
        ['Converting “by feel”', 'Use the free converter and document the basis.'],
        ['Ignoring instrument capability', 'Shop metrology must match the accepted parameter.'],
      ],
      faq: [
        ['Is the surface finish calculator free?', 'Yes. SC-028 requires no sign-in.'],
        ['Can I use converted values on PPAP?', 'Only if the customer accepts the parameter and conversion basis — converters do not invent acceptance.'],
      ],
    },
    'sheet-metal-bend-complete': {
      what: `Bend allowance and bend deduction translate a 3D bend into a flat blank. Wrong K-factor or inside radius assumptions produce parts that miss the brake setup by millimetres.`,
      method: `<h3>3.1 Inputs that matter</h3><p>Thickness, bend angle, inside radius, and K-factor drive allowance. Material and tooling change K-factor in the real shop.</p>
        <h3>3.2 Flat length</h3><div class="sc-formula-block"><code>Flat ≈ legs + bend allowance (or legs − bend deduction)</code><p>Use shop-proven K-factors when available; catalog defaults are a starting point.</p></div>`,
      mistakes: [
        ['Using one K-factor for every alloy', 'Calibrate against your brake and material lot.'],
        ['Ignoring inside radius growth', 'Radius changes move allowance nonlinearly.'],
        ['Skipping punch capacity check', 'Pair bend with the free punching force calculator when die work follows.'],
      ],
      faq: [
        ['Is the bend calculator free?', 'Yes. SC-030 calculates without credits.'],
        ['Does this replace a forming simulation?', 'No — it screens blank length before first hit.'],
      ],
    },
    'punching-force-complete': {
      what: `Punching force estimates the press load needed to shear a perimeter through thickness at a given shear strength. Guessing tonnage from habit breaks punches and rings frames.`,
      method: `<h3>3.1 Force estimate</h3><div class="sc-formula-block"><code>F ≈ perimeter × thickness × shear strength</code><p>Handle units explicitly. Apply the safety factors required by your press standard before release.</p></div>
        <h3>3.2 Capacity screening</h3><p>Compare estimated force to press and tooling ratings — manufacturer charts still govern final selection.</p>`,
      mistakes: [
        ['Ignoring perimeter geometry', 'Complex punches increase effective shear length.'],
        ['Forgetting shear strength basis', 'Document material state (annealed vs hard).'],
        ['No die clearance plan', 'Force and edge quality both depend on clearance practice.'],
      ],
      faq: [
        ['Is punching force free?', 'Yes. SC-039 is free and instant.'],
        ['Does this replace OEM tonnage charts?', 'No — it screens before tooling; OEM data wins for release.'],
      ],
    },
  };

  const body = sections[g.slug];
  const mistakeHtml = body.mistakes
    .map(
      ([t, f], i) => `<div class="sc-mistake-card"><h3>Mistake ${i + 1}: ${esc(t)}</h3><p><strong>Fix:</strong> ${esc(f)}</p></div>`,
    )
    .join('\n');
  const faqHtml = body.faq
    .map((qa) => `<details class="sc-faq-item"><summary>${esc(qa[0])}</summary><p>${esc(qa[1])}</p></details>`)
    .join('\n');
  const related = g.related
    .map((href) => `<li><a href="${esc(href)}">${esc(href)}</a></li>`)
    .join('\n');

  const faqSchema = {
    '@type': 'FAQPage',
    '@id': `${HOST}/guides/${g.slug}#faq`,
    mainEntity: body.faq.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${HOST}/guides/${g.slug}#article`,
        url: `${HOST}/guides/${g.slug}`,
        headline: g.h1,
        description: g.lead,
        datePublished: '2026-07-27',
        dateModified: '2026-07-27',
        author: { '@id': `${HOST}/#organization` },
        publisher: { '@id': `${HOST}/#organization` },
        isAccessibleForFree: g.access === 'free',
        inLanguage: 'en-US',
        speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.sc-aeo-problem', '.sc-direct-answer', 'h1'] },
      },
      faqSchema,
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
          { '@type': 'HowToStep', position: 1, name: 'Read the problem', text: g.problem },
          { '@type': 'HowToStep', position: 2, name: 'Open the calculator', text: `${g.calculator.label} at ${HOST}${g.calculator.href}` },
          { '@type': 'HowToStep', position: 3, name: 'Enter inputs and calculate', text: freeNote },
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
  <meta name="description" content="${esc(g.lead)}">
  <link rel="canonical" href="${HOST}/guides/${esc(g.slug)}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
  <meta property="og:title" content="${esc(g.title)} | SectorCalc">
  <meta property="og:description" content="${esc(g.lead)}">
  <meta property="og:url" content="${HOST}/guides/${esc(g.slug)}">
  <meta property="og:type" content="article">
  <meta property="og:image" content="${HOST}/assets/images/og-default-1200x630.jpg">
  ${headAssets()}
  <script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
  </script>
</head>
<body class="sc-guides-shell">
${HEADER}
<main class="sc-guides-main sc-guide-article" id="main-content">
  <nav class="sc-breadcrumb" aria-label="Breadcrumb">
    <ol>
      <li><a href="/">Home</a></li>
      <li><a href="/guides">Guides</a></li>
      <li aria-current="page">${esc(g.title)}</li>
    </ol>
  </nav>
  <article>
    <p class="sc-guides-kicker">${esc(g.topic)} · ${esc(accessBadge(g.access))}</p>
    <h1>${esc(g.h1)}</h1>
    <p class="sc-aeo-problem"><strong>The problem:</strong> ${esc(g.problem)}</p>
    <p class="sc-direct-answer" data-aeo-step="direct-answer">${esc(g.lead)} ${esc(freeNote)}</p>
    <div class="sc-guide-toc">
      <h2>Table of contents</h2>
      <ol>
        <li><a href="#what-is">What this covers</a></li>
        <li><a href="#methodology">Methodology</a></li>
        <li><a href="#calculator">Calculator workflow</a></li>
        <li><a href="#common-mistakes">Common mistakes</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li><a href="#related">Related entities</a></li>
      </ol>
    </div>
    <section id="what-is"><h2>1. What this covers</h2><p>${esc(body.what)}</p></section>
    <section id="methodology"><h2>2. Methodology</h2>${body.method}</section>
    <section id="calculator">
      <h2>3. Calculator workflow</h2>
      <ol class="sc-step-list">
        <li>Open <a href="${esc(g.calculator.href)}">${esc(g.calculator.label)}</a>.</li>
        <li>Enter inputs with units. Read validation banners before running.</li>
        <li>Review formulas, warnings, and results. Export where provided.</li>
      </ol>
      <div class="sc-cta-inline"><a class="sc-btn-primary" href="${esc(g.calculator.href)}">${esc(g.calculator.label)} →</a></div>
    </section>
    <section id="common-mistakes"><h2>4. Common mistakes</h2>${mistakeHtml}</section>
    <section id="faq" class="sc-faq-section"><h2>5. FAQ</h2>${faqHtml}</section>
    <section id="related" class="sc-guide-related"><h2>6. Related entities</h2><ul>${related}</ul></section>
    <section class="sc-cta-panel">
      <h2>Calculate now</h2>
      <p>${esc(freeNote)}</p>
      <a class="sc-btn-primary" href="${esc(g.calculator.href)}">${esc(g.calculator.label)} →</a>
      <p style="margin-top:0.75rem"><a href="/guides">← All engineering guides</a></p>
    </section>
  </article>
</main>
${footer()}
</body>
</html>
`;
}

function polishExisting(path, g) {
  let html = readFileSync(path, 'utf8');
  // Force shared nav + guides CSS
  html = html.replace(/<!--SC-SITE-NAV-START-->[\s\S]*?<!--SC-SITE-NAV-END-->\n?/g, '');
  html = html.replace(/<header class="sc-header">[\s\S]*?<\/header>/, HEADER);
  if (!html.includes('sc-guides.css')) {
    html = html.replace(/<\/head>/i, `${headAssets()}\n</head>`);
  }
  if (!/class="[^"]*sc-guides-shell/.test(html)) {
    html = html.replace(/<body([^>]*)>/i, '<body$1 class="sc-guides-shell">');
  }
  // Empathy block after H1 if missing
  if (!html.includes('sc-aeo-problem')) {
    html = html.replace(
      /(<h1\b[^>]*>[\s\S]*?<\/h1>)/i,
      `$1\n      <p class="sc-aeo-problem"><strong>The problem:</strong> ${esc(g.problem)}</p>\n      <p class="sc-direct-answer">${esc(g.lead)}</p>`,
    );
  }
  // Honest CTA — remove free preview lies on credit tools
  html = html.replace(
    /Free preview\. Full A1-A5 audit report unlocks with credits\. No subscription\./gi,
    g.access === 'free' || g.access === 'mixed'
      ? 'Calculator access: see badge above. No subscription.'
      : 'Unlock a credit session for 24-hour recalculation with A1–A5 audit trail. No subscription.',
  );
  // Strip fabricated ROI case-study claims
  html = html.replace(
    /<section id="case-study">[\s\S]*?<\/section>/i,
    `<section id="case-study">
        <h2>6. Worked decision pattern</h2>
        <p><strong>Problem pattern:</strong> ${esc(g.problem)}</p>
        <p><strong>Method:</strong> Use the calculator linked below with documented inputs, then keep A4 assumptions and A5 warnings with the result. SectorCalc does not publish invented customer ROI percentages.</p>
        <p><strong>Next step:</strong> <a href="${esc(g.calculator.href)}">${esc(g.calculator.label)}</a></p>
      </section>`,
  );
  // Author schema: Organization not unverified person when EEAT public claims disabled
  html = html.replace(
    /"author"\s*:\s*\{\s*"@id"\s*:\s*"https:\/\/sectorcalc\.com\/#person-neela-nataraj"\s*\}/g,
    '"author": { "@id": "https://sectorcalc.com/#organization" }',
  );
  if (!html.includes('sc-guides-main') && html.includes('<main')) {
    html = html.replace(/<main([^>]*)class="([^"]*)"/i, '<main$1class="$2 sc-guides-main sc-guide-article"');
    if (!/sc-guides-main/.test(html)) {
      html = html.replace(/<main\b/i, '<main class="sc-guides-main sc-guide-article"');
    }
  }
  writeFileSync(path, html);
}

// --- run ---
writeFileSync(join(ROOT, 'public/guides/index.html'), hubHtml());
console.log('[OK] guides hub → public/guides/index.html');

for (const g of GUIDES) {
  const path = join(ROOT, 'public/guides', `${g.slug}.html`);
  if (!g.existing) {
    writeFileSync(path, newGuideBody(g));
    console.log(`[OK] new guide → ${g.slug}.html`);
  } else if (existsSync(path)) {
    polishExisting(path, g);
    console.log(`[OK] polished → ${g.slug}.html`);
  } else {
    console.warn(`[SKIP] missing existing ${g.slug}.html`);
  }
}

console.log(`[PASS] enterprise guides build: ${GUIDES.length} guides`);
