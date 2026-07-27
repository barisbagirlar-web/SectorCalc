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
import { AEO_EMPATHY } from '../seo/aeo-empathy.mjs';
import { topicalMapForEntity } from '../seo/topical-maps.mjs';
import { publishedCalculators } from '../seo/registry.mjs';

const ROOT = process.cwd();
const CSS = '/sc-money.css?v=2';
const CALC_BY_PATH = new Map(publishedCalculators().map((c) => [c.canonicalPath, c]));

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Human label for glossary / guide / calculator paths (never dump raw href as link text). */
function linkLabel(href) {
  const calc = CALC_BY_PATH.get(href);
  if (calc) {
    let title = String(calc.name || calc.h1 || '').trim();
    // Strip a leading tool id (do not treat the hyphen inside SC-038 as a title separator).
    title = title.replace(new RegExp(`^${calc.id}\\s*[·:.—–-]?\\s*`, 'i'), '').trim();
    title = title.replace(/\s*[—–].*$/, '').trim();
    return title ? `${calc.id} ${title}` : calc.id;
  }
  const known = {
    '/glossary/tolerance-stack-up': 'Tolerance stack-up',
    '/glossary/rss-tolerance': 'RSS tolerance',
    '/glossary/monte-carlo-simulation': 'Monte Carlo simulation',
    '/glossary/worst-case-analysis': 'Worst-case analysis',
    '/glossary/process-capability-cpk': 'Process capability (Cpk)',
    '/glossary/asme-y14-5': 'ASME Y14.5',
    '/glossary/iso-286-fits': 'ISO 286 fits',
    '/glossary/labor-burden-rate': 'Labor burden rate',
    '/glossary/machine-hour-rate': 'Machine hour rate',
    '/glossary/bearing-l10-life': 'Bearing L10 life',
    '/glossary/cnc-feeds-and-speeds': 'CNC feeds and speeds',
    '/glossary/weld-throat': 'Weld throat',
    '/glossary/taylor-tool-life': 'Taylor tool life',
    '/glossary/chip-thinning': 'Chip thinning',
    '/glossary/oee-overall-equipment-effectiveness': 'OEE',
    '/glossary/surface-finish-ra-rz': 'Surface finish Ra/Rz',
    '/glossary/bolt-preload': 'Bolt preload',
    '/glossary/sheet-metal-k-factor': 'Sheet metal K-factor',
    '/glossary/sling-angle-factor': 'Sling angle factor',
    '/glossary/vdi-2230-bolted-joint': 'VDI 2230 bolted joint',
    '/glossary/asme-viii-pressure-vessel': 'ASME VIII pressure vessel',
    '/glossary/asme-b31-pipe-wall': 'ASME B31 pipe wall',
    '/glossary/heat-input-t85': 'Heat input / t8/5',
    '/glossary/iso-281': 'ISO 281',
    '/glossary/deterministic-engine': 'Deterministic engine',
    '/guides/tolerance-stack-up-complete': 'Tolerance stack-up complete guide',
    '/guides/cnc-optimization-complete': 'CNC optimization complete guide',
    '/guides/bearing-life-complete': 'Bearing life complete guide',
    '/guides/weld-sizing-complete': 'Weld sizing complete guide',
    '/guides/labor-costing-complete': 'Labor costing complete guide',
  };
  if (known[href]) return known[href];
  const slug = String(href).replace(/\/$/, '').split('/').pop() || href;
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
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
  return `<section class="sc-money-block" data-money-block="06" id="money-worked-example" data-aeo-step="evidence">
  <h2>Evidence — worked example</h2>
  <p class="sc-money-lede">${esc(fx.title)}. ${esc(fx.narrative)}</p>
  <p class="sc-money-engine" data-worked-provenance="engine-generated">Engine source: <code>${esc(fx.engineSource)}</code> · tool <code>${esc(fx.toolId)}</code></p>
  <h3>Golden inputs</h3>
  <table class="sc-money-table"><tbody>${inRows}</tbody></table>
  <h3>Verified engine outputs</h3>
  <table class="sc-money-table"><tbody>${outRows}</tbody></table>
</section>`;
}

function topicalFanOutHtml(page) {
  const map = topicalMapForEntity(page.primaryEntity);
  if (!map) return '';
  const { topic, subtopic } = map;
  const fan = (subtopic.fanOutQueries || [])
    .map((q) => `<li><span class="sc-aeo-query">${esc(q)}</span></li>`)
    .join('');
  const links = (subtopic.links || [])
    .filter((href) => href !== page.canonicalPath)
    .map((href) => `<li><a href="${esc(href)}">${esc(linkLabel(href))}</a></li>`)
    .join('');
  return `<section class="sc-money-block sc-aeo-topical" data-money-block="15b" data-aeo-step="related-problems" data-topic-id="${esc(topic.topicId)}" data-subtopic-id="${esc(subtopic.id)}">
  <h2>Topical map &amp; related problems</h2>
  <p class="sc-money-lede"><strong>${esc(topic.topic)}</strong> · ${esc(subtopic.name)}. ${esc(topic.problem)}</p>
  <h3>Query fan-out (same problem cluster)</h3>
  <ul class="sc-aeo-fanout">${fan}</ul>
  <h3>Internal authority links</h3>
  <ul>${links}</ul>
</section>`;
}

function aeoRailHtml() {
  const steps = [
    ['direct-answer', 'Direct answer'],
    ['calculation', 'Calculation'],
    ['explanation', 'Explanation'],
    ['methodology', 'Methodology'],
    ['evidence', 'Evidence'],
    ['accountability', 'Audit trail'],
    ['related-problems', 'Related problems'],
  ];
  const items = steps
    .map(
      ([id, label], i) =>
        `<li data-aeo-rail="${esc(id)}"><span class="sc-aeo-rail-n">${String(i + 1).padStart(2, '0')}</span> ${esc(label)}</li>`
    )
    .join('');
  return `<nav class="sc-aeo-rail" aria-label="Answer engine structure"><ol>${items}</ol></nav>`;
}

function contractHtml(page, content, fx) {
  const own = ownershipForPath(page.canonicalPath);
  const cluster = own?.clusterId || page.queryCluster;
  const primaryQuery = own?.primaryQuery || page.primaryIntent || '';
  const gloss = (content.glossary || [])
    .map((href) => `<li><a href="${esc(href)}">${esc(linkLabel(href))}</a></li>`)
    .join('');
  const guide = content.guide
    ? `<p><a href="${esc(content.guide)}">${esc(linkLabel(content.guide))}</a></p>`
    : '<p>No dedicated long-form guide yet — use glossary + related calculators in this cluster.</p>';
  const related = (page.relatedRoutes || [])
    .map((href) => `<li><a href="${esc(href)}">${esc(linkLabel(href))}</a></li>`)
    .join('');

  return `<!--SC-MONEY-START-->
<aside class="sc-money-contract" data-money-contract="tier-a" data-aeo-chain="direct-calc-explain-method-evidence-audit-related" data-tool-id="${esc(page.id)}" data-primary-entity="${esc(page.primaryEntity)}" data-query-cluster="${esc(cluster)}" data-primary-query="${esc(primaryQuery)}" data-canonical="${esc(page.canonicalPath)}">
${aeoRailHtml()}
<section class="sc-money-block" data-money-block="03" data-aeo-step="explanation"><h2>Explanation — decision this supports</h2><p>${esc(content.decision)}</p></section>
<section class="sc-money-block" data-money-block="04" data-aeo-step="explanation"><h2>Required inputs</h2><p>${esc(content.inputs)}</p></section>
<section class="sc-money-block" data-money-block="05" data-aeo-step="methodology"><h2>Methodology — formula &amp; method</h2><p>${esc(content.formula)}</p></section>
${workedHtml(fx)}
<section class="sc-money-block" data-money-block="07" data-aeo-step="explanation"><h2>What the result means</h2><p>${esc(content.interpretation)}</p></section>
<section class="sc-money-block" data-money-block="08" data-aeo-step="explanation"><h2>What moves the result</h2><p>${esc(content.sensitivity)}</p></section>
<section class="sc-money-block" data-money-block="09" data-aeo-step="methodology"><h2>Assumptions</h2><p>${esc(content.assumptions)}</p></section>
<section class="sc-money-block" data-money-block="10" data-aeo-step="methodology"><h2>Model boundaries</h2><p>${esc(content.limitations)}</p></section>
<section class="sc-money-block" data-money-block="11" data-aeo-step="evidence"><h2>Common engineering mistakes</h2><p>${esc(content.mistakes)}</p></section>
<section class="sc-money-block" data-money-block="12" data-aeo-step="evidence"><h2>Evidence — standard &amp; reference scope</h2><p>${esc(content.standards)}</p></section>
<section class="sc-money-block" data-money-block="13" data-aeo-step="accountability"><h2>Accountability — A1–A5 audit trail</h2><p>${esc(content.audit)}</p>
<p class="sc-money-expert-note">Engineering accountability is carried by visible formulas, assumptions, warnings, and engine version — not by invented reviewer endorsements. Outputs remain engineering previews subject to competent review.</p></section>
<section class="sc-money-block" data-money-block="14" data-aeo-step="related-problems"><h2>Related glossary</h2><ul>${gloss}</ul></section>
<section class="sc-money-block" data-money-block="15" data-aeo-step="related-problems"><h2>Related guide &amp; calculators</h2>${guide}<ul>${related}</ul></section>
${topicalFanOutHtml(page)}
<section class="sc-money-block sc-money-cta" data-money-block="16"><h2>Commercial next step</h2><p>${esc(content.commercial)}</p>
<p class="sc-money-cta-actions"><a class="sc-money-link" href="/pricing.html" data-sc-funnel="pricing">View pricing</a>
<a class="sc-money-link" href="/pro.html">Pro hub</a></p></section>
</aside>
<!--SC-MONEY-END-->`;
}

function ensureCss(html) {
  if (html.includes('sc-money.css')) {
    return html.replace(/sc-money\.css\?v=\d+/g, 'sc-money.css?v=2');
  }
  return html.replace(/<\/head>/i, `<link rel="stylesheet" href="${CSS}">\n</head>`);
}

function injectDirectAnswer(html, page, content) {
  const empathy = AEO_EMPATHY[page.primaryEntity];
  const empathyBlock = empathy
    ? `<div class="sc-aeo-empathy" data-aeo-step="empathy" data-tool-id="${esc(page.id)}">
<p class="sc-aeo-problem"><strong>The problem:</strong> ${esc(empathy.problem)}</p>
<p class="sc-aeo-promise">${esc(empathy.promise)}</p>
</div>`
    : '';
  const answer = `${empathyBlock}<p class="sc-direct-answer" data-money-block="01" data-aeo-step="direct-answer" data-tool-id="${esc(page.id)}">${esc(content.directAnswer)}</p>`;
  html = html.replace(/<div class="sc-aeo-empathy"[\s\S]*?<\/div>\n?/g, '');
  html = html.replace(/<p class="sc-direct-answer" data-money-block="01"[^>]*>[\s\S]*?<\/p>\n?/g, '');
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
