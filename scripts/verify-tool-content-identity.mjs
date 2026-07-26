#!/usr/bin/env node
/**
 * Tool identity ↔ content cross-contamination firewall.
 * Catches wrong visible IDs (e.g. SC-010 label on SC-021 Bearing Life links).
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { publishedCalculators, HOST } from '../seo/registry.mjs';

const ROOT = process.cwd();
const errors = [];
const calcs = publishedCalculators();
const byId = new Map(calcs.map((c) => [c.id, c]));
const byPath = new Map(calcs.map((c) => [c.canonicalPath, c]));

/** Expected vocabulary tokens by topical family (positive identity, not brittle SEO stuffing). */
const FAMILY_EXPECT = {
  'pipe-wall-thickness': [/pipe|piping|B31|MAWP|wall/i],
  'pressure-vessel-shell': [/vessel|ASME|VIII|shell|pressure/i],
  'bearing-life-l10': [/bearing|L10|ISO\s*281|life/i],
  'cnc-feeds-speeds': [/feed|speed|CNC|Taylor|tool life|spindle/i],
  'tolerance-stack-up': [/tolerance|stack|RSS|Monte Carlo|Cpk/i],
  'quote-pricing': [/quote|margin|markup|cost/i],
  'true-labor-cost': [/labor|burden|loaded/i],
  'oee-teep': [/OEE|TEEP|availability|performance|quality/i],
  'machine-hour-rate': [/machine|hour|rate|depreciation|overhead/i],
  'bolt-torque-preload': [/bolt|torque|preload|VDI/i],
  'bolted-joint': [/joint|stiffness|preload|VDI/i],
  'weld-heat-input': [/heat input|t8\/5|weld|cooling/i],
};

const FAMILY_FORBIDDEN = {
  'pipe-wall-thickness': [/paintCost|painting price|scaffoldCost|Enerji and Emisyons|emission forecast/i],
  'bearing-life-l10': [/True Labor Cost|paintCost|painting/i],
  'tolerance-stack-up': [/paintCost|minimum painting/i],
};

for (const calc of calcs) {
  const file = join(ROOT, calc.sourceFile);
  if (!existsSync(file)) {
    errors.push(`missing source ${calc.sourceFile}`);
    continue;
  }
  const html = readFileSync(file, 'utf8');

  if (!html.includes(calc.id)) errors.push(`${calc.canonicalPath} missing tool id ${calc.id}`);
  if (!html.includes(`rel="canonical" href="${HOST}${calc.canonicalPath}"`)) {
    errors.push(`${calc.sourceFile} canonical mismatch vs registry ${calc.canonicalPath}`);
  }
  if (!html.includes(`sc-schema-tool-${calc.sourceSlug || calc.sourceFile.replace('.html', '')}`)) {
    errors.push(`${calc.sourceFile} missing schema tool marker for ${calc.id}`);
  }

  // Cross-link label integrity: href to another calculator must not show a third tool's SC-xxx id as the link text.
  const linkRe = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = linkRe.exec(html))) {
    const href = m[1];
    const text = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    let path = href;
    if (href.startsWith(HOST)) {
      try { path = new URL(href).pathname; } catch { continue; }
    }
    if (!path.startsWith('/calculator/')) continue;
    const target = byPath.get(path);
    if (!target) continue;
    const idMentions = [...text.matchAll(/\bSC-\d{3}\b/g)].map((x) => x[0]);
    for (const mentioned of idMentions) {
      if (mentioned !== target.id) {
        errors.push(`${calc.sourceFile}: link to ${path} (${target.id}) shows wrong id ${mentioned} in "${text}"`);
      }
    }
  }

  const entity = calc.primaryEntity;
  const expectList = FAMILY_EXPECT[entity] || [];
  if (expectList.length && !expectList.some((re) => re.test(html))) {
    errors.push(`${calc.canonicalPath} missing expected family vocabulary (${expectList.join('|')})`);
  }
  for (const re of FAMILY_FORBIDDEN[entity] || []) {
    if (re.test(html)) errors.push(`${calc.canonicalPath} contains forbidden cross-family content ${re}`);
  }
}

// Explicit fixture from review: SC-008 must not label bearing links as SC-010
const sc008 = readFileSync(join(ROOT, 'sc008-pro.html'), 'utf8');
if (/SC-010\s+Bearing Life/i.test(sc008)) {
  errors.push('sc008-pro.html still labels Bearing Life as SC-010 (must be SC-021)');
}
if (!/SC-021\s+Bearing Life/i.test(sc008)) {
  errors.push('sc008-pro.html missing correct SC-021 Bearing Life label');
}

if (errors.length) {
  console.error('[FAIL] tool content identity:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`[PASS] tool content identity: ${calcs.length} calculators, cross-link ID integrity OK`);
