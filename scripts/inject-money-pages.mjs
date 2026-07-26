#!/usr/bin/env node
/**
 * Inject Tier-A money-page contract into calculator HTML (idempotent).
 * Direct answer sits immediately after H1 (calculator-first preserved).
 * Blocks 03–16 inject before related-tools / </body>.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tierAMoneyCalculators, ownershipForPath } from '../seo/money-pages.mjs';
import { MONEY_CONTENT } from '../seo/money-content.mjs';

const ROOT = process.cwd();
const CSS = '/sc-money.css?v=1';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function loadWorked(entity) {
  const path = join(ROOT, 'seo/worked-examples', `${entity}.json`);
  if (!existsSync(path)) throw new Error(`missing worked example fixture: ${entity}`);
  return JSON.parse(readFileSync(path, 'utf8'));
}

function workedHtml(fx) {
  const inRows = Object.entries(fx.inputs)
    .map(([k, v]) => {
      const val = typeof v === 'object' ? JSON.stringify(v) : String(v);
      return `<tr><th scope="row">${esc(k)}</th><td><code>${esc(val)}</code></td></tr>`;
    })
    .join('');
  const outRows = Object.entries(fx.outputs)
    .map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td><code>${esc(String(v))}</code></td></tr>`)
    .join('');
  return `<section class="sc-money-block" data-money-block="06" id="money-worked-example">
  <h2>Worked example</h2>
  <p class="sc-money-lede">${esc(fx.title)}. ${esc(fx.narrative)}</p>
  <p class="sc-money-engine" data-worked-provenance="engine-generated">Engine source: <code>${esc(fx.engineSource)}</code> · tool <code>${esc(fx.toolId)}</code></p>
  <h3>Golden inputs</h3>
  <table class="sc-money-table"><tbody>${inRows}</tbody></table>
  <h3>Verified engine outputs</h3>
  <table class="sc-money-table"><tbody>${outRows}</tbody></table>
</section>`;
}

function contractHtml(page, content, fx) {
  const own = ownershipForPath(page.canonicalPath);
  const cluster = own?.clusterId || page.queryCluster;
  const primaryQuery = own?.primaryQuery || page.primaryIntent || '';
  const gloss = (content.glossary || [])
    .map((href) => `<li><a href="${esc(href)}">${esc(href)}</a></li>`)
    .join('');
  const guide = content.guide
    ? `<p><a href="${esc(content.guide)}">${esc(content.guide)}</a></p>`
    : '<p>No dedicated long-form guide yet — use glossary + related calculators in this cluster.</p>';
  const related = (page.relatedRoutes || [])
    .map((href) => `<li><a href="${esc(href)}">${esc(href)}</a></li>`)
    .join('');

  return `<!--SC-MONEY-START-->
<aside class="sc-money-contract" data-money-contract="tier-a" data-tool-id="${esc(page.id)}" data-primary-entity="${esc(page.primaryEntity)}" data-query-cluster="${esc(cluster)}" data-primary-query="${esc(primaryQuery)}" data-canonical="${esc(page.canonicalPath)}">
<section class="sc-money-block" data-money-block="03"><h2>Decision this supports</h2><p>${esc(content.decision)}</p></section>
<section class="sc-money-block" data-money-block="04"><h2>Required inputs</h2><p>${esc(content.inputs)}</p></section>
<section class="sc-money-block" data-money-block="05"><h2>Formula / method</h2><p>${esc(content.formula)}</p></section>
${workedHtml(fx)}
<section class="sc-money-block" data-money-block="07"><h2>What the result means</h2><p>${esc(content.interpretation)}</p></section>
<section class="sc-money-block" data-money-block="08"><h2>What moves the result</h2><p>${esc(content.sensitivity)}</p></section>
<section class="sc-money-block" data-money-block="09"><h2>Assumptions</h2><p>${esc(content.assumptions)}</p></section>
<section class="sc-money-block" data-money-block="10"><h2>Model boundaries</h2><p>${esc(content.limitations)}</p></section>
<section class="sc-money-block" data-money-block="11"><h2>Common engineering mistakes</h2><p>${esc(content.mistakes)}</p></section>
<section class="sc-money-block" data-money-block="12"><h2>Standard / reference scope</h2><p>${esc(content.standards)}</p></section>
<section class="sc-money-block" data-money-block="13"><h2>A1–A5 audit trail</h2><p>${esc(content.audit)}</p></section>
<section class="sc-money-block" data-money-block="14"><h2>Related glossary</h2><ul>${gloss}</ul></section>
<section class="sc-money-block" data-money-block="15"><h2>Related guide &amp; calculators</h2>${guide}<ul>${related}</ul></section>
<section class="sc-money-block sc-money-cta" data-money-block="16"><h2>Commercial next step</h2><p>${esc(content.commercial)}</p>
<p class="sc-money-cta-actions"><a class="sc-money-link" href="/pricing.html" data-sc-funnel="pricing">View pricing</a>
<a class="sc-money-link" href="/pro.html">Pro hub</a></p></section>
</aside>
<!--SC-MONEY-END-->`;
}

function ensureCss(html) {
  if (html.includes('sc-money.css')) {
    return html.replace(/sc-money\.css\?v=\d+/g, 'sc-money.css?v=1');
  }
  return html.replace(/<\/head>/i, `<link rel="stylesheet" href="${CSS}">\n</head>`);
}

function injectDirectAnswer(html, page, content) {
  const answer = `<p class="sc-direct-answer" data-money-block="01" data-tool-id="${esc(page.id)}">${esc(content.directAnswer)}</p>`;
  html = html.replace(/<p class="sc-direct-answer" data-money-block="01"[^>]*>[\s\S]*?<\/p>\n?/g, '');
  // Prefer first real H1 in body
  const re = /(<h1\b[^>]*>[\s\S]*?<\/h1>)/i;
  if (!re.test(html)) throw new Error(`${page.sourceFile}: missing H1 for direct answer`);
  return html.replace(re, `$1\n${answer}`);
}

function stripMoney(html) {
  return html.replace(/<!--SC-MONEY-START-->[\s\S]*?<!--SC-MONEY-END-->\n?/g, '');
}

let n = 0;
for (const page of tierAMoneyCalculators()) {
  const content = MONEY_CONTENT[page.primaryEntity];
  if (!content) throw new Error(`MONEY_CONTENT missing ${page.primaryEntity}`);
  const fx = loadWorked(page.primaryEntity);
  const path = join(ROOT, page.sourceFile);
  let html = readFileSync(path, 'utf8');
  html = stripMoney(html);
  html = ensureCss(html);
  html = injectDirectAnswer(html, page, content);
  const block = contractHtml(page, content, fx);
  if (/<!--SC-RELATED-TOOLS-START-->/.test(html)) {
    html = html.replace(/<!--SC-RELATED-TOOLS-START-->/, `${block}\n<!--SC-RELATED-TOOLS-START-->`);
  } else if (/<\/body>/i.test(html)) {
    html = html.replace(/<\/body>/i, `${block}\n</body>`);
  } else {
    html += `\n${block}\n`;
  }
  // Funnel identity on body for analytics
  if (!/data-sc-tool-id=/.test(html)) {
    html = html.replace(/<body([^>]*)>/i, `<body$1 data-sc-tool-id="${esc(page.id)}" data-sc-primary-entity="${esc(page.primaryEntity)}" data-sc-canonical="${esc(page.canonicalPath)}" data-sc-query-cluster="${esc(page.queryCluster)}" data-sc-revenue-tier="A">`);
  } else {
    html = html.replace(/<body[^>]*>/i, (m) => {
      let tag = m;
      const attrs = {
        'data-sc-tool-id': page.id,
        'data-sc-primary-entity': page.primaryEntity,
        'data-sc-canonical': page.canonicalPath,
        'data-sc-query-cluster': page.queryCluster,
        'data-sc-revenue-tier': 'A',
      };
      for (const [k, v] of Object.entries(attrs)) {
        if (tag.includes(k)) tag = tag.replace(new RegExp(`${k}="[^"]*"`), `${k}="${esc(v)}"`);
        else tag = tag.replace(/>$/, ` ${k}="${esc(v)}">`);
      }
      return tag;
    });
  }
  writeFileSync(path, html);
  n += 1;
  console.log(`[OK] money contract → ${page.sourceFile} (${page.canonicalPath})`);
}
console.log(`[PASS] Money contracts injected on ${n} Tier-A calculator pages`);
