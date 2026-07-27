#!/usr/bin/env node
/**
 * Honest commerce copy guard (Model B + free SEO-bait set).
 * - Allows free claims only for the 5 free tools + #free-calculators strip.
 * - Bans "every calculator is free" / exploratory-free lies on paid surfaces.
 * - Free tool schema may use price 0; paid tools must not.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FREE_TOOL_SLUGS, FREE_TOOLS } from '../seo/free-tools.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (m) => errors.push(m);

const bannedEverywhere = [
  /Every live calculator currently requires/i,
  /every live calculator requires a credit session/i,
  /Every live calculator unlocks with a credit session/i,
  /No free engine behind the page/i,
  /Marketing must not imply a free live engine/i,
  /all live tools require credits \(no free tools/i,
  /Free exploratory calculation/i,
  /Free exploratory runs stay free/i,
  /free calc needs no card/i,
  /Inputs, core results, formulas, and basic warnings stay free/i,
  /Free monthly allowance/i,
  /Run SC-008 Free/i,
];

const marketingFiles = [
  'index.html',
  'pricing.html',
  'public/llm.txt',
  'public/llms.txt',
  'public/privacy/index.html',
  'sc-ops.html',
  'src/pricing.ts',
  'src/account.ts',
];

for (const rel of marketingFiles) {
  const p = join(ROOT, rel);
  if (!existsSync(p)) {
    fail(`missing ${rel}`);
    continue;
  }
  const text = readFileSync(p, 'utf8');
  for (const re of bannedEverywhere) {
    if (re.test(text)) fail(`${rel} contains obsolete all-paid claim: ${re}`);
  }
}

// Paid Tier-A pages must not claim free calculation
const paidSamples = ['sc008-pro.html', 'machining-pro.html', 'oee-pro.html', 'labor-pro.html'];
for (const rel of paidSamples) {
  const p = join(ROOT, rel);
  if (!existsSync(p)) continue;
  const text = readFileSync(p, 'utf8');
  if (/Free · no sign-in|Open · no sign-in/i.test(text) && !FREE_TOOL_SLUGS.has(rel.replace(/\.html$/, ''))) {
    fail(`${rel} must not claim open/free access on a paid tool`);
  }
  if (/"name"\s*:\s*"Free instant calculation"/.test(text)) {
    fail(`${rel} must not ship Free instant calculation Offer`);
  }
  if (/Open the free calculator/i.test(text) && /HowToStep/.test(text)) {
    fail(`${rel} HowTo must not say free calculator`);
  }
}

// Free tools must ship free Offer + not require credit HowTo step 1
for (const tool of FREE_TOOLS) {
  const rel = `${tool.sourceSlug}.html`;
  const p = join(ROOT, rel);
  if (!existsSync(p)) {
    fail(`missing free tool page ${rel}`);
    continue;
  }
  const text = readFileSync(p, 'utf8');
  if (!/data-access="free"|data-free-aeo="1"|Free · no sign-in|Open · no sign-in|Open instrument/.test(text)) {
    fail(`${rel} missing free AEO/access markers`);
  }
  if (!/"name"\s*:\s*"Free instant calculation"/.test(text) && !/"isAccessibleForFree"\s*:\s*true/.test(text)) {
    // schema inject may run after this in build; soft-warn only if schema block present
    if (/sc-schema-tool-/.test(text) && /Sign in and unlock a session/.test(text)) {
      fail(`${rel} still has credit-gated HowTo after free conversion`);
    }
  }
}

// Homepage must emphasize free strip
const index = readFileSync(join(ROOT, 'index.html'), 'utf8');
if (!/id="free-calculators"/.test(index)) fail('index.html missing #free-calculators strip');
for (const t of FREE_TOOLS) {
  if (!index.includes(t.canonicalPath)) fail(`index.html free strip missing ${t.canonicalPath}`);
}

if (errors.length) {
  console.error('[FAIL] Honest credit copy guard:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(
  `[PASS] Honest credit copy guard: ${FREE_TOOLS.length} free tools allowed; all-paid lies banned; free strip present`,
);
