#!/usr/bin/env node
/**
 * Enterprise guides builder — hub + new long-form guides + polish existing guides.
 * Idempotent. English-only. No fabricated ROI / Review / AggregateRating.
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

function headLinks() {
  return `<link rel="stylesheet" href="/css/seo-content.css">
<link rel="stylesheet" href="/sc-theme.css?v=12">
<link rel="stylesheet" href="/sc-site-nav.css?v=5">
<link rel="stylesheet" href="/css/sc-guides.css?v=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Sans:wght@400;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<script src="/sc-theme.js?v=12" defer></script>
<script src="/sc-site-nav.js?v=2" defer></script>
<script type="module" src="/src/auth-nav.ts"></script>`;
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
      {
        '@type': 'FAQPage',
        '@id': `${HOST}/guides#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Are all SectorCalc guides free to read?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Every guide is free to read. Some linked calculators are free (ISO fits, surface finish, bend, punching, weld thickness). Tier-A decision calculators unlock with a credit session.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do guides invent customer ROI or star ratings?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Guides use problem → methodology → calculator → mistakes → FAQ. SectorCalc does not publish fabricated ROI percentages or AggregateRating/Review schema.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do guides connect to calculators?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Each guide owns one primary calculator CTA and related entities (glossary, topics, sibling tools) so answer engines can retrieve a closed problem–method–tool chain.',
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
  ${headLinks()}
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
    <p class="sc-guides-lead">Each guide opens with the decision that hurts on the shop floor, then methodology, formulas, calculator CTA, and related entities. Free reference guides calculate instantly. Tier-A decision guides unlock with credits — no invented certifications or fake case-study ROI.</p>
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

  <section class="sc-guides-section" aria-labelledby="hub-faq-heading">
    <h2 id="hub-faq-heading">Guides hub FAQ</h2>
    <details class="sc-faq-item"><summary>Are guides free to read?</summary><p>Yes. Reading is free. Calculator access depends on the linked tool: five free calculators need no sign-in; Tier-A tools unlock with credits.</p></details>
    <details class="sc-faq-item"><summary>Why separate free and decision guides?</summary><p>Free guides own high-traffic reference queries. Decision guides own high-stakes release math where an A1–A5 audit trail matters.</p></details>
    <details class="sc-faq-item"><summary>Where do topic hubs fit?</summary><p>Topic hubs cluster free tools and fan-out blogs. Guides carry the long-form methodology. Calculators own the computation.</p></details>
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

/** Dense long-form bodies for new free guides — must not ship thin. */
function guideSections(slug) {
  const map = {
    'iso-286-fits-complete': {
      what: `<p>ISO 286 defines hole and shaft tolerance zones relative to a nominal size. Letters like H7 or g6 are not millimetre clearances — they are zone identities whose limit deviations change with diameter band. Treating “H7/g6” as a constant clearance is the most common drawing-room error.</p>
        <p>This guide covers hole-basis vs shaft-basis thinking, how limit deviations are looked up for a size range, when a local fit still fails the assembly, and how SectorCalc’s free SC-027 calculator exposes equation-backed families without inventing unsupported zones.</p>
        <p>Use it when you are selecting or checking a fit before drawings freeze. Escalate to tolerance stack-up when the question becomes assembly closure under stacked contributors.</p>`,
      standards: `<ul class="sc-standards-list">
          <li><strong>ISO 286-1 / ISO 286-2:</strong> Basis of fits and tabulated limit deviations for hole and shaft tolerance zones.</li>
          <li><strong>ISO 2768:</strong> General tolerances — complementary language when individual fits are not fully specified.</li>
          <li><strong>ASME Y14.5:</strong> Drawing language and datum practice that surrounds fit callouts on North American prints.</li>
        </ul>`,
      method: `<h3>3.1 Hole vs shaft basis</h3>
        <p>Confirm whether the hole or shaft is the basic feature. H-system holes are common in production; shaft grades (g, f, e…) set clearance or transition behavior against that hole. Mixing systems without documenting which feature is basic creates ambiguous inspection plans.</p>
        <h3>3.2 Limit deviations are size-dependent</h3>
        <div class="sc-formula-block"><code>ES / EI (hole) and es / ei (shaft) from ISO 286 tables for the selected size range</code>
        <p>Always evaluate at the actual nominal diameter. The same grade letters are not a constant clearance across diameters.</p></div>
        <h3>3.3 Clearance, transition, interference</h3>
        <p>After both zones are known, the extreme material conditions define the possible assembly states. Document the condition you intend (easy sliding vs light press) in the traveler — not only the letter pair.</p>
        <h3>3.4 When to escalate</h3>
        <p>If the question is assembly closure under stacked contributors (housings, bearings, spacers), move from fit selection to the credit-backed tolerance stack-up calculator. Local fit success does not guarantee gap closure.</p>`,
      calcSteps: [
        'Open the free SC-027 ISO 286 Fits calculator — no sign-in required.',
        'Enter the nominal diameter and select the hole/shaft family you need to screen.',
        'Read limit deviations and resulting clearance/interference extremes for that size band.',
        'If assembly risk remains, open SC-008 Tolerance Stack-Up (credits) with the same nominal chain.',
      ],
      mistakes: [
        ['Treating H7/g6 as a constant clearance', 'Look up limit deviations for the diameter band you actually machine.'],
        ['Mixing unsupported zone letters', 'SectorCalc exposes equation-backed families only — unsupported zones are not guessed.'],
        ['Skipping stack-up after fit pick', 'Local fit success does not guarantee assembly gap closure.'],
        ['Ignoring temperature and coating', 'Fits change when plating or operating temperature shifts diameter.'],
      ],
      faq: [
        ['Is the ISO 286 calculator free?', 'Yes. SC-027 runs without sign-in or credits.'],
        ['Does this replace the full ISO 286 standard?', 'No. Use it for exposed families and screening; keep the governing edition for release.'],
        ['Can I use SC-027 results on a PPAP cover sheet?', 'Use them as engineering screening evidence. Customer-specific acceptance still governs.'],
        ['When should I open tolerance stack-up instead?', 'When multiple contributors — not a single hole/shaft pair — control the functional gap.'],
        ['Are all ISO letters supported?', 'Only equation-backed families exposed in the calculator. Unsupported zones are not invented.'],
      ],
    },
    'surface-finish-complete': {
      what: `<p>Ra (arithmetical mean) and Rz (average peak-to-valley) describe different statistics of the same profile. Treating them as interchangeable without an explicit conversion assumption causes scrap, supplier fights, and metrology reject loops.</p>
        <p>This guide separates drawing language from shop measurement practice, shows how to convert with visible assumptions, and links the free SC-028 Surface Finish calculator. Converters align language; measured capability still owns production release.</p>`,
      standards: `<ul class="sc-standards-list">
          <li><strong>ISO 21920 / ISO 4287 family:</strong> Surface texture parameters and filtering language used on modern prints.</li>
          <li><strong>ASME B46.1:</strong> Surface texture definitions commonly referenced on North American drawings.</li>
          <li><strong>Customer material/finish specs:</strong> Often override generic conversion tables — document the governing source.</li>
        </ul>`,
      method: `<h3>3.1 Read the acceptance language first</h3>
        <p>Confirm which parameter the drawing and customer standard actually use before converting. Ra callouts released as Rz limits are a classic first-article failure.</p>
        <h3>3.2 Convert with visible assumptions</h3>
        <div class="sc-formula-block"><code>Parameter translation only with documented conversion basis</code>
        <p>Put the assumption on the traveler — not in tribal memory. SectorCalc shows the conversion basis on the calculator page.</p></div>
        <h3>3.3 Validate on process data</h3>
        <p>Converters align language. Instrument capability and process capability still own production release. If the customer requires Rz, measure Rz.</p>
        <h3>3.4 Pair with fits when needed</h3>
        <p>Finish and fit often travel together on bearing seats and sealing surfaces. Use the free fits calculator alongside finish conversion when both callouts gate release.</p>`,
      calcSteps: [
        'Open free SC-028 Surface Finish — no sign-in.',
        'Enter the known parameter and target parameter from the drawing/customer standard.',
        'Review the conversion assumption shown on the page; copy it into the traveler.',
        'Confirm metrology can measure the accepted parameter before releasing first article.',
      ],
      mistakes: [
        ['Ra callout released as Rz limit', 'Confirm the governing surface-texture parameter first.'],
        ['Converting “by feel”', 'Use the free converter and document the basis.'],
        ['Ignoring instrument capability', 'Shop metrology must match the accepted parameter.'],
        ['Using converter output as PPAP proof alone', 'Customers accept parameters and methods — not anonymous conversions.'],
      ],
      faq: [
        ['Is the surface finish calculator free?', 'Yes. SC-028 requires no sign-in.'],
        ['Can I use converted values on PPAP?', 'Only if the customer accepts the parameter and conversion basis — converters do not invent acceptance.'],
        ['Does SectorCalc invent Ra↔Rz ratios?', 'No. The page exposes the conversion assumption; you remain responsible for the governing standard.'],
        ['Should I also check ISO fits?', 'Yes when seats or clearances share the same feature — open free SC-027.'],
        ['Where is the long-form Ra vs Rz explainer?', 'See the fan-out blog on Ra vs Rz surface finish linked from related entities.'],
      ],
    },
    'sheet-metal-bend-complete': {
      what: `<p>Bend allowance and bend deduction translate a 3D bend into a flat blank. Wrong K-factor or inside radius assumptions produce parts that miss the brake setup by millimetres — expensive when the blank is already nested.</p>
        <p>This guide covers the inputs that matter, flat-length workflow, when to calibrate K-factor against your brake, and how free SC-030 computes allowance and deduction with visible formulas.</p>`,
      standards: `<ul class="sc-standards-list">
          <li><strong>Shop brake manufacturer charts:</strong> Often govern practical K-factor and minimum flange lengths for your tooling.</li>
          <li><strong>Material supplier data:</strong> Alloy temper and thickness tolerance change springback and allowance.</li>
          <li><strong>Customer flat-pattern specifications:</strong> Some OEMs lock K-factor or deduction method on the print.</li>
        </ul>`,
      method: `<h3>3.1 Inputs that matter</h3>
        <p>Thickness, bend angle, inside radius, and K-factor drive allowance. Material and tooling change K-factor in the real shop. Catalog defaults are a starting point — not a substitute for your brake’s proven values.</p>
        <h3>3.2 Flat length</h3>
        <div class="sc-formula-block"><code>Flat ≈ legs + bend allowance (or legs − bend deduction)</code>
        <p>Pick one accounting style and stick to it across the nest. Mixing allowance and deduction without documenting the method creates blank chaos.</p></div>
        <h3>3.3 Calibrate</h3>
        <p>Run a coupon on the production brake, measure developed length, and back-calculate an effective K-factor for that alloy/tooling pair. Store it where programmers can find it.</p>
        <h3>3.4 Adjacent checks</h3>
        <p>When die work follows, pair bend with the free punching force calculator so press capacity is screened before tooling.</p>`,
      calcSteps: [
        'Open free SC-030 Sheet Metal Bend — no sign-in.',
        'Enter thickness, bend angle, inside radius, and K-factor (shop-proven when available).',
        'Review bend allowance / deduction and flat length.',
        'Update traveler with the K-factor basis used; recalibrate after material or tooling changes.',
      ],
      mistakes: [
        ['Using one K-factor for every alloy', 'Calibrate against your brake and material lot.'],
        ['Ignoring inside radius growth', 'Radius changes move allowance nonlinearly.'],
        ['Skipping punch capacity check', 'Pair bend with the free punching force calculator when die work follows.'],
        ['Mixing BA and BD without a method note', 'Document which accounting style the nest uses.'],
      ],
      faq: [
        ['Is the bend calculator free?', 'Yes. SC-030 calculates without credits.'],
        ['Does this replace a forming simulation?', 'No — it screens blank length before first hit.'],
        ['Where do I get K-factor?', 'Start from tooling charts, then calibrate with a coupon on your brake.'],
        ['Can I link this to punching force?', 'Yes — both SC-030 and SC-039 are free and listed under sheet-metal fabrication topics.'],
        ['What if the customer locks deduction method?', 'Follow the customer method; use SectorCalc to cross-check, not to override the contract.'],
      ],
    },
    'punching-force-complete': {
      what: `<p>Punching force estimates the press load needed to shear a perimeter through thickness at a given shear strength. Guessing tonnage from habit breaks punches and rings frames — and it shows up as downtime, not just scrap.</p>
        <p>This guide covers the force estimate, unit discipline, capacity screening against press and tooling ratings, and how free SC-039 helps before tooling is ordered. Manufacturer charts and safety factors still govern final selection.</p>`,
      standards: `<ul class="sc-standards-list">
          <li><strong>Press manufacturer capacity charts:</strong> Govern allowable tonnage, stroke, and energy for your frame.</li>
          <li><strong>Tooling OEM recommendations:</strong> Die clearance and punch material limits change force and edge quality.</li>
          <li><strong>Material shear strength data:</strong> Must match material state (annealed vs hard) — do not invent.</li>
        </ul>`,
      method: `<h3>3.1 Force estimate</h3>
        <div class="sc-formula-block"><code>F ≈ perimeter × thickness × shear strength</code>
        <p>Handle units explicitly. Apply the safety factors required by your press standard before release.</p></div>
        <h3>3.2 Geometry matters</h3>
        <p>Complex punches increase effective shear length. Slots, windows, and irregular contours are not “same as a round hole of equal area.”</p>
        <h3>3.3 Capacity screening</h3>
        <p>Compare estimated force to press and tooling ratings. If you are near the limit, redesign the hit sequence or tool before steel is ordered.</p>
        <h3>3.4 Pair with bend</h3>
        <p>Many sheet-metal jobs punch then bend. Keep both free calculators in the same traveler package.</p>`,
      calcSteps: [
        'Open free SC-039 Punching Force — no sign-in.',
        'Enter perimeter, thickness, and shear strength with consistent units.',
        'Compare estimated force to press and tooling ratings with your required safety factor.',
        'Document die clearance practice and material state alongside the result.',
      ],
      mistakes: [
        ['Ignoring perimeter geometry', 'Complex punches increase effective shear length.'],
        ['Forgetting shear strength basis', 'Document material state (annealed vs hard).'],
        ['No die clearance plan', 'Force and edge quality both depend on clearance practice.'],
        ['Skipping OEM charts', 'Calculators screen; manufacturer data wins for release.'],
      ],
      faq: [
        ['Is punching force free?', 'Yes. SC-039 is free and instant.'],
        ['Does this replace OEM tonnage charts?', 'No — it screens before tooling; OEM data wins for release.'],
        ['What units should I use?', 'Stay consistent (N and mm, or tonf and in) and convert carefully.'],
        ['Should I also run bend allowance?', 'Yes when the blank will be formed after punching — open free SC-030.'],
        ['Can I cite SC-039 alone for press purchase?', 'Use it as a screening estimate; purchase decisions need OEM capacity data.'],
      ],
    },
  };
  return map[slug];
}

function newGuideBody(g) {
  const freeNote =
    g.access === 'free'
      ? 'This calculator is free — no sign-in, instant results.'
      : g.access === 'mixed'
        ? 'Weld thickness is free; weld heat input (SC-029) requires a credit session.'
        : 'This calculator unlocks with a credit session (24h recalculation).';

  const body = guideSections(g.slug);
  if (!body) throw new Error(`Missing dense sections for ${g.slug}`);

  const mistakeHtml = body.mistakes
    .map(
      ([t, f], i) =>
        `<div class="sc-mistake-card"><h3>Mistake ${i + 1}: ${esc(t)}</h3><p><strong>Fix:</strong> ${esc(f)}</p></div>`,
    )
    .join('\n');
  const faqHtml = body.faq
    .map((qa) => `<details class="sc-faq-item"><summary>${esc(qa[0])}</summary><p>${esc(qa[1])}</p></details>`)
    .join('\n');
  const related = g.related
    .map((href) => {
      const label = href
        .replace(/^\//, '')
        .replace(/\.html$/, '')
        .replace(/\//g, ' · ');
      return `<li><a href="${esc(href)}">${esc(label)}</a></li>`;
    })
    .join('\n');
  const steps = body.calcSteps
    .map((s, i) => `<li><strong>Step ${i + 1}:</strong> ${esc(s)}</li>`)
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
        '@type': 'Organization',
        '@id': `${HOST}/#organization`,
        name: 'SectorCalc',
        url: `${HOST}/`,
      },
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
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['.sc-aeo-problem', '.sc-direct-answer', 'h1'],
        },
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
        step: body.calcSteps.map((text, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: `Step ${i + 1}`,
          text,
        })),
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
  <meta name="twitter:card" content="summary_large_image">
  ${headLinks()}
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
        <li><a href="#standards">Applicable standards</a></li>
        <li><a href="#methodology">Methodology</a></li>
        <li><a href="#calculator">Calculator workflow</a></li>
        <li><a href="#common-mistakes">Common mistakes</a></li>
        <li><a href="#worked-pattern">Worked decision pattern</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li><a href="#related">Related entities</a></li>
      </ol>
    </div>
    <section id="what-is"><h2>1. What this covers</h2>${body.what}</section>
    <section id="standards"><h2>2. Applicable standards &amp; references</h2>${body.standards}</section>
    <section id="methodology"><h2>3. Methodology</h2>${body.method}</section>
    <section id="calculator">
      <h2>4. Calculator workflow</h2>
      <ol class="sc-step-list">${steps}</ol>
      <div class="sc-cta-inline"><a class="sc-btn-primary" href="${esc(g.calculator.href)}">${esc(g.calculator.label)} →</a></div>
    </section>
    <section id="common-mistakes"><h2>5. Common mistakes</h2>${mistakeHtml}</section>
    <section id="worked-pattern">
      <h2>6. Worked decision pattern</h2>
      <p><strong>Problem pattern:</strong> ${esc(g.problem)}</p>
      <p><strong>Method:</strong> Follow the methodology above, run ${esc(g.calculator.toolId)}, and keep assumptions + warnings with the result. SectorCalc does not publish invented customer ROI percentages.</p>
      <p><strong>Next step:</strong> <a href="${esc(g.calculator.href)}">${esc(g.calculator.label)}</a></p>
    </section>
    <section id="faq" class="sc-faq-section"><h2>7. FAQ</h2>${faqHtml}</section>
    <section id="related" class="sc-guide-related"><h2>8. Related entities</h2><ul>${related}</ul></section>
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

  html = html.replace(/<!--SC-SITE-NAV-START-->[\s\S]*?<!--SC-SITE-NAV-END-->\n?/g, '');
  html = html.replace(/<header class="sc-header">[\s\S]*?<\/header>/, '');
  html = html.replace(/<header class="site-header"[\s\S]*?<\/header>\s*/i, '');
  html = html.replace(/<div class="mobile-nav-overlay" id="mobileNav"[\s\S]*?<\/div>\s*/i, '');

  if (!html.includes('sc-guides.css')) {
    html = html.replace(/<\/head>/i, `<link rel="stylesheet" href="/css/sc-guides.css?v=1">\n</head>`);
  }
  if (!html.includes('sc-site-nav.css')) {
    html = html.replace(
      /<\/head>/i,
      `<link rel="stylesheet" href="/sc-site-nav.css?v=5">\n<script src="/sc-site-nav.js?v=2" defer></script>\n<script type="module" src="/src/auth-nav.ts"></script>\n</head>`,
    );
  }
  if (!html.includes('sc-theme.css')) {
    html = html.replace(
      /<\/head>/i,
      `<link rel="stylesheet" href="/sc-theme.css?v=12">\n<script src="/sc-theme.js?v=12" defer></script>\n</head>`,
    );
  }

  if (!/class="[^"]*sc-guides-shell/.test(html)) {
    html = html.replace(/<body([^>]*)>/i, (m, attrs) => {
      if (/class=/.test(attrs)) {
        return `<body${attrs.replace(/class=(["'])([^"']*)\1/, 'class=$1$2 sc-guides-shell$1')}>`;
      }
      return `<body${attrs} class="sc-guides-shell">`;
    });
  }

  html = html.replace(/<body([^>]*)>/i, `<body$1>\n${HEADER}\n`);

  if (!html.includes('sc-aeo-problem')) {
    html = html.replace(
      /(<h1\b[^>]*>[\s\S]*?<\/h1>)/i,
      `$1\n      <p class="sc-aeo-problem"><strong>The problem:</strong> ${esc(g.problem)}</p>\n      <p class="sc-direct-answer">${esc(g.lead)}</p>`,
    );
  }

  html = html.replace(
    /Free preview\. Full A1-A5 audit report unlocks with credits\. No subscription\./gi,
    g.access === 'free' || g.access === 'mixed'
      ? 'Calculator access: see badge and CTA above. No subscription.'
      : 'Unlock a credit session for 24-hour recalculation with A1–A5 audit trail. No subscription.',
  );

  html = html.replace(
    /<section id="case-study">[\s\S]*?<\/section>/i,
    `<section id="case-study">
        <h2>6. Worked decision pattern</h2>
        <p><strong>Problem pattern:</strong> ${esc(g.problem)}</p>
        <p><strong>Method:</strong> Use the calculator linked below with documented inputs, then keep A4 assumptions and A5 warnings with the result. SectorCalc does not publish invented customer ROI percentages.</p>
        <p><strong>Next step:</strong> <a href="${esc(g.calculator.href)}">${esc(g.calculator.label)}</a></p>
      </section>`,
  );

  html = html.replace(
    /"author"\s*:\s*\{\s*"@id"\s*:\s*"https:\/\/sectorcalc\.com\/#person-neela-nataraj"\s*\}/g,
    '"author": { "@id": "https://sectorcalc.com/#organization" }',
  );

  if (!/sc-guides-main/.test(html)) {
    html = html.replace(/<main\b([^>]*)class=(["'])([^"']*)\2/i, '<main$1class=$2$3 sc-guides-main sc-guide-article$2');
    if (!/sc-guides-main/.test(html)) {
      html = html.replace(/<main\b/i, '<main class="sc-guides-main sc-guide-article"');
    }
  }

  // Related entities block once
  if (!html.includes('data-guide-related="1"')) {
    const related = g.related
      .map((href) => `<li><a href="${esc(href)}">${esc(href)}</a></li>`)
      .join('');
    html = html.replace(
      /(<section class="sc-cta-panel">)/i,
      `<section class="sc-guide-related" data-guide-related="1"><h2>Related entities</h2><ul>${related}</ul></section>\n      $1`,
    );
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
