#!/usr/bin/env node
/**
 * Exclusive guides release gate — density, AEO chain, sitemap/llm discovery parity.
 * Fail closed. No fabricated ROI / Review schema.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { GUIDE_ASSEMBLY } from '../seo/guides-assembly.mjs';
import { HOST, sitemapLocs } from '../seo/registry.mjs';

const ROOT = process.cwd();
const MIN_BYTES = 20000;
const errors = [];
const fail = (m) => errors.push(m);

const hubPath = join(ROOT, 'public/guides/index.html');
if (!existsSync(hubPath)) fail('missing public/guides/index.html');
else {
  const hub = readFileSync(hubPath, 'utf8');
  for (const needle of [
    'money-page depth',
    'Editorial contract',
    'sc-guides-exclusive',
    'CollectionPage',
    'A1–A5',
  ]) {
    if (!hub.includes(needle)) fail(`guides hub missing exclusive marker: ${needle}`);
  }
}

const locs = new Set(sitemapLocs());
if (!locs.has(`${HOST}/guides`)) fail('sitemapLocs missing /guides hub');

for (const g of GUIDE_ASSEMBLY) {
  const file = join(ROOT, 'public/guides', `${g.slug}.html`);
  if (!existsSync(file)) {
    fail(`missing guide ${g.slug}.html`);
    continue;
  }
  const html = readFileSync(file, 'utf8');
  const bytes = Buffer.byteLength(html, 'utf8');
  if (bytes < MIN_BYTES) fail(`${g.slug} thin: ${bytes} < ${MIN_BYTES} bytes`);

  for (const needle of [
    'data-aeo-step="empathy"',
    'data-aeo-step="direct-answer"',
    'data-aeo-step="methodology"',
    'data-aeo-step="accountability"',
    'Deep methodology library',
    'sc-aeo-rail',
    g.calculator.href,
  ]) {
    if (!html.includes(needle)) fail(`${g.slug} missing exclusive block: ${needle}`);
  }

  if (/AggregateRating|"@type":\s*"Review"|85 percent review time|Free preview\. Full A1/i.test(html)) {
    fail(`${g.slug} has forbidden review/ROI/free-preview claim`);
  }

  const pretty = `${HOST}/guides/${g.slug}`;
  if (!locs.has(pretty)) fail(`sitemapLocs missing ${pretty}`);
}

const llm = readFileSync(join(ROOT, 'public/llms.txt'), 'utf8');
const llmTwin = readFileSync(join(ROOT, 'public/llm.txt'), 'utf8');
if (llm !== llmTwin) fail('llm.txt and llms.txt drift');
if (!llm.includes('exclusive money-parity') && !llm.includes('exclusive methodologies')) {
  fail('llms.txt missing exclusive guides discovery language');
}
if (!llm.includes('money-parity answer-engine chain')) {
  fail('llms.txt missing money-parity answer-engine chain for guides');
}
if (!llm.includes('## Enterprise discovery contract')) {
  fail('llms.txt missing Enterprise discovery contract section');
}
if (!llm.includes('Playwright `@critical`') && !llm.includes('Playwright @critical')) {
  fail('llms.txt missing preview Playwright @critical promote seal language');
}
for (const g of GUIDE_ASSEMBLY) {
  if (!llm.includes(`${HOST}/guides/${g.slug}`)) fail(`llms.txt missing guide ${g.slug}`);
  if (!llm.includes(`${HOST}${g.calculator.href}`)) fail(`llms.txt missing calculator CTA for ${g.slug}`);
}
if (!llm.includes(`**${locs.size}**`)) fail(`llms.txt must declare sitemap count **${locs.size}**`);

const sm = readFileSync(join(ROOT, 'public/sitemap.xml'), 'utf8');
const smLocs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (smLocs.length !== locs.size) fail(`sitemap.xml count ${smLocs.length} != registry ${locs.size}`);
for (const g of GUIDE_ASSEMBLY) {
  if (!sm.includes(`<loc>${HOST}/guides/${g.slug}</loc>`)) fail(`sitemap.xml missing ${g.slug}`);
}
if (!sm.includes(`<loc>${HOST}/guides</loc>`)) fail('sitemap.xml missing /guides hub');

if (errors.length) {
  console.error('[FAIL] verify-guides-exclusive\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(
  `[PASS] exclusive guides gate: ${GUIDE_ASSEMBLY.length} guides ≥${MIN_BYTES}B, hub+AEO+sitemap(${locs.size})+llms parity`,
);
