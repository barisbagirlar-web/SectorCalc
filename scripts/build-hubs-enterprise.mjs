#!/usr/bin/env node
/**
 * Enterprise hub builder — /glossary and /compare hubs aligned to homepage DNA
 * (site-header + sc-theme + Barlow/IBM Plex/JetBrains + sc-guides chrome).
 * Idempotent. English-only. No fabricated ROI / Review / AggregateRating.
 * Min main-text density: 2000 characters per hub.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { GLOSSARY_GROUPS, GLOSSARY_TERMS } from '../seo/glossary-catalog.mjs';
import { COMPARE_PAGES } from '../seo/compare-catalog.mjs';
import { FREE_TOOLS } from '../seo/free-tools.mjs';
import { TOPICAL_MAPS } from '../seo/topical-maps.mjs';

const ROOT = process.cwd();
const HEADER = readFileSync(join(ROOT, 'content/partials/site-nav.html'), 'utf8').trim();
const HEAD_ASSETS = readFileSync(join(ROOT, 'content/partials/head-assets.html'), 'utf8').trim();
const HOST = 'https://sectorcalc.com';
const MIN_CHARS = 2000;

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function headLinks() {
  return `<!--SC-HEAD-ASSETS-START-->
${HEAD_ASSETS}
<!--SC-HEAD-ASSETS-END-->
<link rel="stylesheet" href="/css/sc-guides.css?v=4">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Sans:wght@400;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<script type="module" src="/src/auth-nav.ts"></script>`;
}

function footer() {
  return `<footer class="sc-footer" style="max-width:1100px;margin:0 auto;padding:1.25rem;border-top:1px solid rgba(11,28,44,.12);display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between">
  <p style="margin:0;color:#3d5366">© 2026 SectorCalc · Deterministic industrial calculators</p>
  <p style="margin:0"><a href="/#free-calculators">Open bench</a> · <a href="/topics">Topics</a> · <a href="/tools.html">All tools</a> · <a href="/pricing.html">Pricing</a></p>
</footer>`;
}

function stripText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function assertDensity(label, html) {
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] || html;
  const n = stripText(main).length;
  if (n < MIN_CHARS) {
    console.error(`[FAIL] ${label} main text is ${n} chars (need ≥ ${MIN_CHARS})`);
    process.exit(1);
  }
  console.log(`[OK] ${label} main text density: ${n} chars`);
}

function glossaryHubHtml() {
  const termCount = GLOSSARY_TERMS.length;
  const groupCount = GLOSSARY_GROUPS.length;
  const withCalc = GLOSSARY_TERMS.filter((t) => t.calculator).length;

  const cards = (terms) =>
    terms
      .map(
        (t) => `<article class="sc-guide-card" data-glossary="${esc(t.slug)}">
  <p class="sc-guide-badge" data-access="free">Glossary entity</p>
  <h3>${esc(t.title)}</h3>
  <p class="sc-guide-problem">${esc(t.blurb)}</p>
  <a class="sc-guide-cta" href="/glossary/${esc(t.slug)}">Open definition →</a>
  ${t.calculator ? `<a class="sc-guide-cta" href="${esc(t.calculator)}">Open related calculator →</a>` : ''}
</article>`
      )
      .join('\n');

  const groupsHtml = GLOSSARY_GROUPS.map(
    (g) => `  <section class="sc-guides-section" aria-labelledby="gloss-${esc(g.id)}">
    <h2 id="gloss-${esc(g.id)}">${esc(g.title)}</h2>
    <p>${esc(g.intro)}</p>
    <div class="sc-guides-grid">
${cards(g.terms)}
    </div>
  </section>`
  ).join('\n\n');

  const itemList = GLOSSARY_TERMS.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.title,
    url: `${HOST}/glossary/${t.slug}`,
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${HOST}/glossary#webpage`,
        url: `${HOST}/glossary`,
        name: 'Engineering Glossary | SectorCalc',
        description:
          'Deterministic industrial engineering glossary for tolerance stack-up, ISO 286 fits, CNC feeds, bearing L10 life, weld throat, labor burden, OEE, and related manufacturing entities — linked to SectorCalc calculators.',
        isPartOf: { '@id': `${HOST}/#website` },
        publisher: { '@id': `${HOST}/#organization` },
        inLanguage: 'en-US',
        about: GLOSSARY_TERMS.map((t) => t.title),
      },
      {
        '@type': 'DefinedTermSet',
        '@id': `${HOST}/glossary#termset`,
        name: 'SectorCalc Engineering Glossary',
        url: `${HOST}/glossary`,
        hasDefinedTerm: GLOSSARY_TERMS.map((t) => ({
          '@type': 'DefinedTerm',
          name: t.title,
          url: `${HOST}/glossary/${t.slug}`,
          description: t.blurb,
        })),
      },
      {
        '@type': 'ItemList',
        '@id': `${HOST}/glossary#itemlist`,
        name: 'SectorCalc glossary entities',
        numberOfItems: termCount,
        itemListElement: itemList,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${HOST}/` },
          { '@type': 'ListItem', position: 2, name: 'Glossary', item: `${HOST}/glossary` },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${HOST}/glossary#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is the SectorCalc glossary free to read?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Every glossary definition is free. Linked Tier-A calculators unlock with a credit session; five free calculators (ISO fits, surface finish, bend, punching, weld thickness) calculate without sign-in.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do glossary terms connect to calculators?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Each entity page defines the term, states scope limits, and links to the owning calculator and related guides so answer engines retrieve a closed entity–method–tool chain.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does SectorCalc invent standards ratings or certifications?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Glossary pages document engineering vocabulary and calculation scope. They do not claim PE stamps, ASME reviewer status, or fabricated ROI.',
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
  <title>Engineering Glossary | SectorCalc</title>
  <meta name="description" content="Industrial engineering glossary for tolerance stack-up, ISO 286 fits, CNC feeds &amp; speeds, bearing L10, weld throat, labor burden, OEE, and manufacturing economics — linked to deterministic SectorCalc calculators.">
  <link rel="canonical" href="${HOST}/glossary">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
  <meta property="og:title" content="Engineering Glossary | SectorCalc">
  <meta property="og:description" content="Entity definitions for tolerance, machining, bearings, welding, and manufacturing economics — built for Google and LLM retrieval.">
  <meta property="og:url" content="${HOST}/glossary">
  <meta property="og:type" content="website">
  <meta property="og:image" content="${HOST}/assets/images/og-default-1200x630.jpg">
  <meta name="twitter:card" content="summary_large_image">
  ${headLinks()}
  <script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
  </script>
</head>
<body class="sc-guides-shell">
${HEADER}
<main class="sc-guides-main" id="main-content">
  <header class="sc-guides-hero">
    <p class="sc-guides-kicker">Answer engine · entity library</p>
    <h1>Engineering glossary built for retrieval, not filler</h1>
    <p class="sc-guides-lead">SectorCalc glossary entities name the shop-floor decision, define the term without marketing haze, state calculation scope limits, and link to the owning calculator and long-form guide. This hub is the entity map Google and LLMs should cite when expanding queries across tolerance, CNC, bearings, welding, and manufacturing economics.</p>
    <div class="sc-guides-stats" aria-label="Glossary library stats">
      <div class="sc-guides-stat"><b>${termCount}</b><span>Defined entities</span></div>
      <div class="sc-guides-stat"><b>${groupCount}</b><span>Topic clusters</span></div>
      <div class="sc-guides-stat"><b>${withCalc}</b><span>Calculator-linked</span></div>
      <div class="sc-guides-stat"><b>A1–A5</b><span>Audit vocabulary</span></div>
    </div>
  </header>

  <section class="sc-guides-section" aria-labelledby="gloss-why">
    <h2 id="gloss-why">Why this glossary exists</h2>
    <div class="sc-guides-prose">
      <p>Industrial search queries rarely stop at a single keyword. An engineer asking about “H7/g6” needs ISO 286 limit deviations, then often escalates to tolerance stack-up, surface finish, or bearing seat clearance. A machinist asking about chip thinning needs feeds and speeds, then tool life. A cost estimator asking about burden rate needs true labor cost and machine hour rate. Answer engines and crawlers need a stable entity graph — not a thin bullet list of slug-looking labels.</p>
      <p>Each SectorCalc glossary page is written as a <strong>DefinedTerm</strong> with a lead definition, operational meaning on the shop floor, common failure modes, and explicit links to the calculator that owns the math. Definitions stay English-only and evidence-first: no invented certifications, no AggregateRating schema, no fabricated customer ROI percentages.</p>
      <p>Use this hub when you need the canonical internal name for a concept before opening a calculator. Use <a href="/guides">Guides</a> when you need the full problem → methodology → calculation chain. Use <a href="/compare">Compare</a> when you are deciding whether SectorCalc replaces a spreadsheet, CAD module, or classic shop calculator for a specific workflow.</p>
    </div>
  </section>

  <section class="sc-guides-section" aria-labelledby="gloss-chain">
    <h2 id="gloss-chain">Entity → method → tool chain</h2>
    <div class="sc-guides-chain">
      <p>Machine-readable authority chain for Google + LLM retrieval:</p>
      <ol>
        <li><strong>Entity</strong> — glossary term with a stable URL and lead definition</li>
        <li><strong>Scope</strong> — what the term includes and what it does not claim</li>
        <li><strong>Method</strong> — long-form guide when the workflow needs depth</li>
        <li><strong>Tool</strong> — free or credit-backed calculator that owns the equation</li>
        <li><strong>Audit</strong> — A1–A5 trail language for inputs, formulas, assumptions, and warnings</li>
        <li><strong>Related</strong> — sibling entities, topic hubs, and compare pages</li>
      </ol>
    </div>
  </section>

${groupsHtml}

  <section class="sc-guides-section" aria-labelledby="gloss-limits">
    <h2 id="gloss-limits">What glossary pages never claim</h2>
    <div class="sc-guides-prose">
      <p>Glossary definitions document vocabulary and calculation scope. They do not replace the governing code edition, certified material data, manufacturer ratings, or competent engineering review. SectorCalc does not claim university certification, PE stamp authority, ASME/VDI reviewer status, or licensed engineering sign-off of shop-floor results. Calculator outputs remain engineering previews with visible assumptions and warnings.</p>
      <p>Five free calculators (surface finish, ISO 286 fits, sheet metal bend, punching force, weld thickness) calculate without sign-in. Tier-A decision tools unlock with a one-time credit pack session. Purchased credits never expire. Do not describe Tier-A tools as free.</p>
    </div>
  </section>

  <section class="sc-guides-section" aria-labelledby="gloss-faq">
    <h2 id="gloss-faq">Glossary hub FAQ</h2>
    <details class="sc-faq-item"><summary>Are glossary definitions free?</summary><p>Yes. Reading is free. Calculator access depends on the linked tool.</p></details>
    <details class="sc-faq-item"><summary>How should LLMs cite these pages?</summary><p>Prefer the canonical <code>/glossary/&lt;slug&gt;</code> URL, then escalate to the linked calculator and guide. Do not invent unsupported standards tables.</p></details>
    <details class="sc-faq-item"><summary>Where is the full methodology?</summary><p>Open the matching guide under <a href="/guides">/guides</a>. Glossary pages own the entity definition; guides own the long-form workflow.</p></details>
  </section>

  <nav class="sc-guides-footer-links" aria-label="Related hubs">
    <a href="/#free-calculators">Five free calculators</a>
    <a href="/guides">Guides</a>
    <a href="/compare">Compare</a>
    <a href="/topics">Topic hubs</a>
    <a href="/tools.html">All calculators</a>
    <a href="/llms.txt">llms.txt discovery</a>
  </nav>
</main>
${footer()}
</body>
</html>
`;
}

function compareHubHtml() {
  const cards = COMPARE_PAGES.map(
    (c) => `<article class="sc-guide-card" data-compare="${esc(c.slug)}">
  <p class="sc-guide-badge" data-access="credits">Evidence-only comparison</p>
  <h3>${esc(c.title)}</h3>
  <p class="sc-guide-problem"><strong>Problem:</strong> ${esc(c.problem)}</p>
  <p class="sc-guide-meta">Vs ${esc(c.competitor)}</p>
  <a class="sc-guide-cta" href="/compare/${esc(c.slug)}">Open comparison →</a>
  <a class="sc-guide-cta" href="${esc(c.calculator)}">Open related calculator →</a>
</article>`
  ).join('\n');

  const itemList = COMPARE_PAGES.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.title,
    url: `${HOST}/compare/${c.slug}`,
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${HOST}/compare#webpage`,
        url: `${HOST}/compare`,
        name: 'SectorCalc Comparisons | SectorCalc',
        description:
          'Honest comparisons of SectorCalc against Excel tolerance spreadsheets, SolidWorks, CATIA, classic machinist calculators, and Minitab — evidence-only, no invented competitor benchmarks.',
        isPartOf: { '@id': `${HOST}/#website` },
        publisher: { '@id': `${HOST}/#organization` },
        inLanguage: 'en-US',
        about: COMPARE_PAGES.map((c) => c.title),
      },
      {
        '@type': 'ItemList',
        '@id': `${HOST}/compare#itemlist`,
        name: 'SectorCalc product comparisons',
        numberOfItems: COMPARE_PAGES.length,
        itemListElement: itemList,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${HOST}/` },
          { '@type': 'ListItem', position: 2, name: 'Compare', item: `${HOST}/compare` },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${HOST}/compare#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Does SectorCalc invent competitor pricing or accuracy scores?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Compare pages describe workflow fit and product category differences only. They do not invent competitor pricing, adoption counts, accuracy benchmarks, or AggregateRating schema.',
            },
          },
          {
            '@type': 'Question',
            name: 'When should I use SectorCalc instead of Excel?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'When you need visible formulas, unit-safe Decimal math, seeded Monte Carlo bounds for stack-up, and an A1–A5 audit trail — not an unprotected spreadsheet template.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does SectorCalc replace CAD or SPC suites?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. CAD owns geometry. SPC suites own capability studies. SectorCalc owns focused industrial calculators with portable audit output.',
            },
          },
        ],
      },
    ],
  };

  const detailBlocks = COMPARE_PAGES.map(
    (c) => `<article class="sc-guides-chain" style="margin:0.85rem 0">
  <h3 style="margin:0 0 0.4rem;font-size:1.05rem">${esc(c.title)}</h3>
  <p style="margin:0 0 0.45rem;color:#3d5366">${esc(c.angle)}</p>
  <p style="margin:0;font-size:0.9rem"><strong>Best for:</strong> ${esc(c.bestFor)} · <a href="/compare/${esc(c.slug)}">Full comparison</a></p>
</article>`
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SectorCalc Comparisons | SectorCalc</title>
  <meta name="description" content="Compare SectorCalc to Excel tolerance spreadsheets, SolidWorks, CATIA, classic machinist calculators, and Minitab. Evidence-only workflow comparisons with links to live deterministic calculators.">
  <link rel="canonical" href="${HOST}/compare">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
  <meta property="og:title" content="SectorCalc Comparisons | SectorCalc">
  <meta property="og:description" content="Honest product-category comparisons — no invented competitor pricing or fake accuracy scores.">
  <meta property="og:url" content="${HOST}/compare">
  <meta property="og:type" content="website">
  <meta property="og:image" content="${HOST}/assets/images/og-default-1200x630.jpg">
  <meta name="twitter:card" content="summary_large_image">
  ${headLinks()}
  <script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
  </script>
</head>
<body class="sc-guides-shell">
${HEADER}
<main class="sc-guides-main" id="main-content">
  <header class="sc-guides-hero">
    <p class="sc-guides-kicker">Answer engine · decision aid</p>
    <h1>Compare SectorCalc without invented benchmarks</h1>
    <p class="sc-guides-lead">These pages help engineers choose the right tool category for a job: spreadsheet, CAD suite, classic shop calculator, SPC package, or SectorCalc’s deterministic industrial calculators. Every comparison stays evidence-only — workflow fit, formula visibility, audit trails, and privacy — never fabricated competitor pricing or accuracy scores.</p>
    <div class="sc-guides-stats" aria-label="Compare library stats">
      <div class="sc-guides-stat"><b>${COMPARE_PAGES.length}</b><span>Comparisons</span></div>
      <div class="sc-guides-stat"><b>0</b><span>Invented scores</span></div>
      <div class="sc-guides-stat"><b>A1–A5</b><span>Audit language</span></div>
      <div class="sc-guides-stat"><b>5</b><span>Free calculators</span></div>
    </div>
  </header>

  <section class="sc-guides-section" aria-labelledby="cmp-why">
    <h2 id="cmp-why">How to read these comparisons</h2>
    <div class="sc-guides-prose">
      <p>Buyers often search “SectorCalc vs Excel”, “vs SolidWorks”, or “vs Minitab” because they already own those tools. The honest answer is rarely a total replacement. Excel remains useful for custom one-off tables. CAD remains the system of record for geometry. Minitab remains strong for statistical process control. Classic machinist calculators remain fast for a single RPM or feed check.</p>
      <p>SectorCalc is built for a different ownership model: client-side industrial decision math with visible formulas, unit-safe Decimal engines where applicable, seeded Monte Carlo bounds for SC-008, and A1–A5 audit trails that travel with the report. Five free reference calculators run without sign-in. Tier-A decision tools unlock with one-time credit packs — purchased credits never expire.</p>
      <p>If you need a glossary entity first, open <a href="/glossary">Glossary</a>. If you need the full methodology before calculating, open <a href="/guides">Guides</a>. If you need the live engine, open the linked calculator and inspect the formulas on the page.</p>
    </div>
  </section>

  <section class="sc-guides-section" aria-labelledby="cmp-policy">
    <h2 id="cmp-policy">Evidence policy</h2>
    <div class="sc-guides-chain">
      <p>Every SectorCalc comparison page follows the same fail-closed policy:</p>
      <ol>
        <li><strong>No invented competitor pricing</strong> — we do not quote or invent rival price lists.</li>
        <li><strong>No fake accuracy shootouts</strong> — we do not publish unsupported ppm or “X% more accurate” claims.</li>
        <li><strong>No AggregateRating / Review schema</strong> — stars and testimonials are not fabricated for SEO.</li>
        <li><strong>Workflow contrast only</strong> — formula visibility, audit trails, privacy, and tool category fit.</li>
        <li><strong>Live proof preferred</strong> — evaluate SectorCalc by running the calculator and reading A1–A5 output.</li>
      </ol>
    </div>
  </section>

  <section class="sc-guides-section" aria-labelledby="cmp-grid">
    <h2 id="cmp-grid">All comparisons</h2>
    <p>Open a page for the full workflow contrast, then jump to the related calculator.</p>
    <div class="sc-guides-grid">
${cards}
    </div>
  </section>

  <section class="sc-guides-section" aria-labelledby="cmp-detail">
    <h2 id="cmp-detail">Decision angles at a glance</h2>
    <div class="sc-guides-prose">
      <p>Use these short angles when an answer engine needs a one-paragraph routing decision. Each angle expands on its dedicated compare page with a feature table and evidence policy callout.</p>
    </div>
${detailBlocks}
  </section>

  <section class="sc-guides-section" aria-labelledby="cmp-when">
    <h2 id="cmp-when">When SectorCalc is the right category</h2>
    <div class="sc-guides-prose">
      <p>Choose SectorCalc when the job is industrial decision math that must survive a review: tolerance stack-up with worst-case / RSS / Monte Carlo, CNC feeds and speeds with chip thinning awareness, bearing L10 screening, weld throat or heat-input estimates, true labor cost, machine hour rate, OEE, ISO 286 fits, surface finish conversion, bend allowance, or punching force screening. Prefer spreadsheets for ad-hoc tables you will never audit. Prefer CAD for geometry. Prefer SPC suites for capability studies and control charts.</p>
      <p>Production release still requires the governing code edition, certified material data, manufacturer ratings, and competent engineering review. SectorCalc outputs are engineering previews with explicit assumptions and warnings — never a silent substitute for measured data.</p>
    </div>
  </section>

  <section class="sc-guides-section" aria-labelledby="cmp-faq">
    <h2 id="cmp-faq">Compare hub FAQ</h2>
    <details class="sc-faq-item"><summary>Are comparisons free to read?</summary><p>Yes. Reading is free. Some linked calculators require a credit session.</p></details>
    <details class="sc-faq-item"><summary>Why no competitor scorecards?</summary><p>Unsupported accuracy and pricing claims create trust debt. We document workflow fit and send you to live calculators instead.</p></details>
    <details class="sc-faq-item"><summary>Where do I start after reading a comparison?</summary><p>Open the linked calculator, or start with a free tool on the <a href="/#free-calculators">homepage free hub</a>.</p></details>
  </section>

  <nav class="sc-guides-footer-links" aria-label="Related hubs">
    <a href="/#free-calculators">Five free calculators</a>
    <a href="/glossary">Glossary</a>
    <a href="/guides">Guides</a>
    <a href="/tools.html">All calculators</a>
    <a href="/pricing.html">Pricing</a>
    <a href="/llms.txt">llms.txt discovery</a>
  </nav>
</main>
${footer()}
</body>
</html>
`;
}

function topicsHubHtml() {
  const freeCards = FREE_TOOLS.map(
    (t) => `<article class="sc-guide-card" data-free-tool="${esc(t.toolId)}" data-entity="${esc(t.entity)}" data-access="free">
  <p class="sc-guide-badge" data-access="free">Open · no sign-in · no credits</p>
  <h3>${esc(t.toolId)} · ${esc(t.name)}</h3>
  <p class="sc-guide-problem">${esc(t.problem)}</p>
  <a class="sc-guide-cta" href="${esc(t.canonicalPath)}">Run free · ${esc(t.toolId)} →</a>
  <a class="sc-guide-cta" href="${esc(t.upsell.href)}">${esc(t.upsell.label)} →</a>
</article>`
  ).join('\n');

  const problemCards = TOPICAL_MAPS.map((t) => {
    const primary =
      t.subtopics[0]?.links?.find((l) => l.startsWith('/calculator/')) ||
      t.subtopics[0]?.links?.[0] ||
      '/tools.html';
    const queries = (t.subtopics[0]?.fanOutQueries || [])
      .slice(0, 2)
      .map((q) => `<li>${esc(q)}</li>`)
      .join('');
    return `<article class="sc-guide-card" data-topic-id="${esc(t.topicId)}">
  <p class="sc-guide-badge">Problem first</p>
  <h3>${esc(t.topic)}</h3>
  <p class="sc-guide-problem">${esc(t.problem)}</p>
  <ul class="sc-guide-queries">${queries}</ul>
  <a class="sc-guide-cta" href="${esc(primary)}">Open the calculator →</a>
</article>`;
  }).join('\n');

  const itemList = [
    ...FREE_TOOLS.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      url: `${HOST}${t.canonicalPath}`,
    })),
    {
      '@type': 'ListItem',
      position: FREE_TOOLS.length + 1,
      name: 'Fits & surface finish',
      url: `${HOST}/topics/fits-and-finish`,
    },
    {
      '@type': 'ListItem',
      position: FREE_TOOLS.length + 2,
      name: 'Sheet metal fabrication',
      url: `${HOST}/topics/sheet-metal-fabrication`,
    },
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Topic Hubs &amp; Open Reference Bench | SectorCalc</title>
<meta name="description" content="Open SectorCalc reference instruments and shop-floor problem hubs — five free calculators, then Tier-A credit sessions when the decision must survive review. Fits, sheet metal, tolerance, CNC, economics.">
<link rel="canonical" href="${HOST}/topics">
<meta name="robots" content="index, follow">
<meta property="og:title" content="Topic Hubs &amp; Open Reference Bench | SectorCalc">
<meta property="og:description" content="Prove the engine on five open instruments, then route to the shop-floor problem that hurts.">
<meta property="og:url" content="${HOST}/topics">
<meta property="og:image" content="${HOST}/assets/images/og-default-1200x630.jpg">
${headLinks()}
<link rel="stylesheet" href="/sc-free-tools.css?v=2">
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'SectorCalc topic hubs & open reference bench',
    url: `${HOST}/topics`,
    description:
      'Open reference instruments and problem-first topic maps for industrial shop-floor decisions.',
    isPartOf: { '@type': 'WebSite', name: 'SectorCalc', url: HOST },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: itemList,
    },
  })}</script>
</head>
<body>
${HEADER}
<main class="sc-guides-hub" id="topics-hub">
  <nav class="sc-breadcrumb" aria-label="Breadcrumb">
    <ol>
      <li><a href="/">Home</a></li>
      <li aria-current="page">Topics</li>
    </ol>
  </nav>

  <header class="sc-guides-hero">
    <p class="sc-guides-kicker">Open reference bench · problem-first routing</p>
    <h1>Prove the engine. Then name the shop problem.</h1>
    <p class="lead-definition">This hub carries the open-bench instruments and answer-engine problem map that must not crowd the <a href="/tools.html">calculators catalog</a>. Search and category tiles stay on Tools. Here you run five wallet-free instruments, then follow the decision that hurts into Tier-A credit sessions when a design review is on the line.</p>
  </header>

  <section class="sc-guides-section" id="free-calculators" aria-labelledby="topics-free-heading" data-aeo-hub="free">
    <h2 id="topics-free-heading">Open reference bench · five instruments · wallet not required</h2>
    <p>These five shop instruments calculate immediately — surface finish, ISO fits, bend allowance, punching force, weld thickness. No login. No debit. When the decision must survive a design review (tolerance stack-up, feeds &amp; speeds, quoting, OEE, pressure, heat input), unlock a Tier-A credit session from <a href="/pricing.html">pricing</a>.</p>
    <div class="sc-guides-grid">
${freeCards}
    </div>
  </section>

  <section class="sc-guides-section" id="problems-we-solve" aria-labelledby="topics-problems-heading" data-aeo-hub="problems">
    <h2 id="topics-problems-heading">Touch the real shop-floor problem first</h2>
    <p>SectorCalc pages open with the decision that hurts — then the calculator, then methodology, evidence, and related problems. No filler. No invented certifications. Use this map when you know the pain but not the tool code.</p>
    <div class="sc-guides-grid">
${problemCards}
    </div>
  </section>

  <section class="sc-guides-section" aria-labelledby="topics-clusters">
    <h2 id="topics-clusters">Crawlable topic clusters</h2>
    <p>Dedicated topic pages keep free instruments adjacent to the related credit-backed decision tools without polluting the drawing-index catalog.</p>
    <div class="sc-guides-grid">
      <article class="sc-guide-card">
        <p class="sc-guide-badge" data-access="free">Topic cluster</p>
        <h3>Fits &amp; surface finish</h3>
        <p class="sc-guide-problem">ISO 286 limit deviations and Ra/Rz release calls that must match what the CMM and the drawing actually say.</p>
        <a class="sc-guide-cta" href="/topics/fits-and-finish">Open fits &amp; finish hub →</a>
      </article>
      <article class="sc-guide-card">
        <p class="sc-guide-badge" data-access="free">Topic cluster</p>
        <h3>Sheet metal fabrication</h3>
        <p class="sc-guide-problem">Bend allowance, punching tonnage, and weld throat calls before the brake, press, and weld bay argue with the flat pattern.</p>
        <a class="sc-guide-cta" href="/topics/sheet-metal-fabrication">Open sheet-metal hub →</a>
      </article>
    </div>
  </section>

  <section class="sc-guides-section" aria-labelledby="topics-catalog">
    <h2 id="topics-catalog">Where the catalog lives</h2>
    <div class="sc-guides-prose">
      <p>Need to search by task, standard, or machine? That DNA belongs exclusively on <a href="/tools.html">All Calculators</a> — omni-search, live/pipeline stats, and category tiles. Homepage keeps a short open-bench strip after the sacred hero for conversion. This Topics page is the long-form problem map and open-bench desk.</p>
      <p>Production release still requires the governing code edition, certified material data, manufacturer ratings, and competent engineering review. Open instruments prove the engine; Tier-A sessions stamp the decision when the room demands an audit trail.</p>
    </div>
  </section>

  <nav class="sc-guides-footer-links" aria-label="Related hubs">
    <a href="/#free-calculators">Homepage open bench</a>
    <a href="/tools.html">All calculators catalog</a>
    <a href="/glossary">Glossary</a>
    <a href="/guides">Guides</a>
    <a href="/compare">Compare</a>
    <a href="/pricing.html">Commission credits</a>
    <a href="/llms.txt">llms.txt discovery</a>
  </nav>
</main>
${footer()}
</body>
</html>
`;
}

function writeHub(relPath, html, label) {
  assertDensity(label, html);
  const out = join(ROOT, relPath);
  writeFileSync(out, html);
  console.log(`[OK] wrote ${relPath}`);
}

// Fail closed if catalog drifts from on-disk articles
for (const t of GLOSSARY_TERMS) {
  const p = join(ROOT, 'public/glossary', `${t.slug}.html`);
  if (!existsSync(p)) {
    console.error(`[FAIL] glossary catalog term missing file: ${t.slug}`);
    process.exit(1);
  }
}
for (const c of COMPARE_PAGES) {
  const p = join(ROOT, 'public/compare', `${c.slug}.html`);
  if (!existsSync(p)) {
    console.error(`[FAIL] compare catalog page missing file: ${c.slug}`);
    process.exit(1);
  }
}

writeHub('public/glossary/index.html', glossaryHubHtml(), 'glossary hub');
writeHub('public/compare/index.html', compareHubHtml(), 'compare hub');
writeHub('public/topics/index.html', topicsHubHtml(), 'topics hub');
console.log(
  `[PASS] Enterprise hubs built (${GLOSSARY_TERMS.length} glossary terms, ${COMPARE_PAGES.length} compares, ${FREE_TOOLS.length} open instruments, ${TOPICAL_MAPS.length} problem maps)`
);
