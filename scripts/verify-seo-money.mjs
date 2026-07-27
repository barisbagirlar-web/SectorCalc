#!/usr/bin/env node
/**
 * Phase 2 money-page gate — Tier-A 16-block contract, ownership, clusters, conversion path.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  TIER_A_MONEY_ENTITIES,
  MONEY_BLOCKS,
  tierAMoneyCalculators,
  ownershipForPath,
  findPrimaryQueryConflicts,
} from '../seo/money-pages.mjs';
import { findDuplicatePrimaryOwners } from '../seo/query-ownership.mjs';
import { MONEY_CONTENT } from '../seo/money-content.mjs';

const ROOT = process.cwd();
const errors = [];
const fail = (m) => errors.push(m);

const gscPath = join(ROOT, 'seo/gsc-baseline.json');
if (!existsSync(gscPath)) fail('seo/gsc-baseline.json missing');
else {
  const gsc = JSON.parse(readFileSync(gscPath, 'utf8'));
  if (gsc.status !== 'NOT_AVAILABLE' && gsc.status !== 'CAPTURED') fail(`GSC baseline status invalid: ${gsc.status}`);
  if (gsc.status === 'NOT_AVAILABLE' && (gsc.organicClicks28d != null || gsc.organicImpressions28d != null)) {
    fail('GSC marked NOT_AVAILABLE but numeric metrics are present (do not invent data)');
  }
}

const dup = findDuplicatePrimaryOwners();
if (dup.length) fail(`query ownership conflicts: ${JSON.stringify(dup)}`);
const pq = findPrimaryQueryConflicts();
if (pq.length) fail(`primary query conflicts: ${JSON.stringify(pq)}`);

if (TIER_A_MONEY_ENTITIES.length !== 12) fail(`expected 12 Tier-A money entities, got ${TIER_A_MONEY_ENTITIES.length}`);

for (const page of tierAMoneyCalculators()) {
  const htmlPath = join(ROOT, page.sourceFile);
  if (!existsSync(htmlPath)) {
    fail(`${page.primaryEntity}: missing source ${page.sourceFile}`);
    continue;
  }
  const html = readFileSync(htmlPath, 'utf8');
  const content = MONEY_CONTENT[page.primaryEntity];
  if (!content) fail(`${page.primaryEntity}: MONEY_CONTENT missing`);

  const own = ownershipForPath(page.canonicalPath);
  if (!own) fail(`${page.primaryEntity}: no QUERY_OWNERSHIP owner for ${page.canonicalPath}`);
  else if (own.owner !== page.canonicalPath) fail(`${page.primaryEntity}: ownership mismatch`);

  if (!/<h1\b/i.test(html)) fail(`${page.primaryEntity}: missing H1`);

  // AEO empathy + chain markers
  if (!/data-aeo-step="empathy"/.test(html)) fail(`${page.primaryEntity}: missing empathy block`);
  if (!/data-aeo-chain=/.test(html)) fail(`${page.primaryEntity}: missing aeo chain marker`);
  if (!/data-aeo-step="direct-answer"/.test(html)) fail(`${page.primaryEntity}: missing direct-answer aeo step`);
  if (!/sc-aeo-topical|data-topic-id=/.test(html)) fail(`${page.primaryEntity}: missing topical map block`);

  // Block 01
  if (!/data-money-block="01"/.test(html)) fail(`${page.primaryEntity}: missing direct-answer block 01`);
  const da = html.match(/data-money-block="01"[^>]*>([\s\S]*?)<\/p>/);
  if (da) {
    const words = da[1].replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    if (words < 35 || words > 110) fail(`${page.primaryEntity}: direct answer word count ${words} outside 35–110`);
  }

  // Block 02 calculator UI
  const hasCalc = /id=["']calcBtn["']|#calcBtn|id=["']genReport["']|Generate Report|CALCULATE/i.test(html);
  if (!hasCalc) fail(`${page.primaryEntity}: missing working calculator controls (block 02)`);

  // Contract shell
  if (!/data-money-contract="tier-a"/.test(html)) fail(`${page.primaryEntity}: missing money contract shell`);
  if (!html.includes(`data-primary-entity="${page.primaryEntity}"`)) fail(`${page.primaryEntity}: contract entity mismatch`);

  for (const b of MONEY_BLOCKS) {
    if (b === '02') continue;
    if (!html.includes(`data-money-block="${b}"`)) fail(`${page.primaryEntity}: missing money block ${b}`);
  }

  // Worked example provenance
  if (!/data-worked-provenance="engine-generated"/.test(html)) fail(`${page.primaryEntity}: worked example not marked engine-generated`);
  const fxPath = join(ROOT, 'seo/worked-examples', `${page.primaryEntity}.json`);
  if (!existsSync(fxPath)) fail(`${page.primaryEntity}: missing worked-example JSON`);
  else {
    const fx = JSON.parse(readFileSync(fxPath, 'utf8'));
    if (fx.primaryEntity !== page.primaryEntity) fail(`${page.primaryEntity}: fixture entity mismatch`);
    if (!fx.engineSource || !fx.outputs || !fx.inputs) fail(`${page.primaryEntity}: fixture incomplete`);
  }

  // Limitations / trust
  if (!/data-money-block="10"/.test(html)) fail(`${page.primaryEntity}: missing limitations block`);
  const lim = html.match(/data-money-block="10"[\s\S]*?<p>([\s\S]*?)<\/p>/);
  if (lim && /full compliance|certified calculations|ASME reviewer|VDI reviewer/i.test(lim[1])) {
    fail(`${page.primaryEntity}: forbidden overclaim in limitations`);
  }

  // Related cluster
  if (content?.glossary?.length) {
    for (const g of content.glossary) {
      if (!html.includes(`href="${g}"`)) fail(`${page.primaryEntity}: glossary link missing ${g}`);
      const p = join(ROOT, 'public', `${g.slice(1)}.html`);
      if (!existsSync(p)) fail(`${page.primaryEntity}: glossary file missing for ${g} (expected ${p})`);
    }
  }
  if (content?.guide) {
    if (!html.includes(`href="${content.guide}"`)) fail(`${page.primaryEntity}: guide link missing`);
    const gf = join(ROOT, 'public', `${content.guide.slice(1)}.html`);
    if (!existsSync(gf)) fail(`${page.primaryEntity}: guide file missing ${content.guide}`);
  }

  // Conversion path
  if (!/data-money-block="16"/.test(html)) fail(`${page.primaryEntity}: missing commercial CTA`);
  if (!/href="\/pricing\.html"/.test(html)) fail(`${page.primaryEntity}: commercial path missing /pricing.html`);

  // No legacy primary hrefs inside money contract
  const money = html.match(/<!--SC-MONEY-START-->[\s\S]*?<!--SC-MONEY-END-->/);
  if (money && /href="[^"]*-pro\.html"/i.test(money[0])) {
    fail(`${page.primaryEntity}: legacy *-pro.html href inside money contract`);
  }

  // Body funnel attrs
  if (!html.includes(`data-sc-tool-id="${page.id}"`)) fail(`${page.primaryEntity}: missing data-sc-tool-id`);
  if (!html.includes('data-sc-revenue-tier="A"')) fail(`${page.primaryEntity}: missing revenue tier attr`);

  // Calculator-first: direct answer must appear before money contract, and a calc control before money contract
  const iH1 = html.search(/<h1\b/i);
  const iDA = html.indexOf('data-money-block="01"');
  const iCalc = html.search(/id=["']calcBtn["']|id=["']genReport["']/i);
  const iMoney = html.indexOf('<!--SC-MONEY-START-->');
  if (iH1 < 0 || iDA < 0 || iMoney < 0) fail(`${page.primaryEntity}: ordering markers missing`);
  else {
    if (!(iH1 < iDA && iDA < iMoney)) fail(`${page.primaryEntity}: direct answer must sit between H1 and money contract`);
    if (iCalc > 0 && !(iCalc < iMoney)) fail(`${page.primaryEntity}: calculator controls must appear before money SEO contract`);
  }
}

// Analytics assets
for (const f of ['public/assets/js/sc-funnel-analytics.js', 'public/sc-money.css']) {
  if (!existsSync(join(ROOT, f))) fail(`missing ${f}`);
}

// Funnel script must define required events
const funnel = readFileSync(join(ROOT, 'public/assets/js/sc-funnel-analytics.js'), 'utf8');
for (const ev of [
  'calculator_view',
  'calculator_start',
  'calculator_complete',
  'demo_load',
  'audit_open',
  'guide_click',
  'pricing_view',
  'checkout_start',
  'purchase',
]) {
  if (!funnel.includes(`'${ev}'`) && !funnel.includes(`"${ev}"`)) fail(`funnel analytics missing event ${ev}`);
}
if (/netSalary|materialCost|password|email|phone/i.test(funnel) && /gtag\([\s\S]{0,80}(netSalary|email)/.test(funnel)) {
  fail('funnel analytics appears to send sensitive calculator inputs / PII');
}

if (errors.length) {
  console.error('[FAIL] verify:seo:money:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(
  `[PASS] money-page gate: ${TIER_A_MONEY_ENTITIES.length} Tier-A pages, 16-block contract, query ownership, worked examples, conversion path, funnel events`,
);
