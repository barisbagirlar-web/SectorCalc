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
import { FREE_TOOL_SLUGS, FREE_TOOLS, FREE_TOOL_PATHS, assertFreeUpsellsAreTierA } from '../seo/free-tools.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (m) => errors.push(m);

for (const e of assertFreeUpsellsAreTierA()) fail(e);

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
  /Valid\s+12\s+months/i,
  /credits?[^\n.]{0,40}expire in 12 months/i,
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
  'public/compare/sectorcalc-vs-excel-tolerance.html',
  'public/compare/sectorcalc-vs-solidworks.html',
  'public/compare/sectorcalc-vs-catia.html',
  'public/compare/sectorcalc-vs-machinist-calculator.html',
  'public/compare/sectorcalc-vs-minitab.html',
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
if (!/sc-free-actions|Start with /.test(index)) fail('index.html free strip missing primary CTA actions');
for (const t of FREE_TOOLS) {
  if (!index.includes(t.canonicalPath)) fail(`index.html free strip missing ${t.canonicalPath}`);
}

// Pricing must separate open bench from decision tools
const pricing = readFileSync(join(ROOT, 'pricing.html'), 'utf8');
if (!/data-pricing-floor="free"/.test(pricing)) fail('pricing.html missing open-bench floor (data-pricing-floor=free)');
if (!/data-pricing-floor="paid"/.test(pricing)) fail('pricing.html missing decision-tools floor (data-pricing-floor=paid)');
if (/02 · Start on the floor/i.test(pricing)) fail('pricing.html still uses ambiguous Start on the floor label');
for (const t of FREE_TOOLS) {
  if (!pricing.includes(t.canonicalPath)) fail(`pricing.html open bench missing ${t.canonicalPath}`);
  if (!pricing.includes(t.toolId)) fail(`pricing.html open bench missing ${t.toolId}`);
}

// tools.html must badge free cards without hosting the marketing strip
const tools = readFileSync(join(ROOT, 'tools.html'), 'utf8');
if (/<!--SC-FREE-TOOLS-START-->/.test(tools)) fail('tools.html must not host free marketing strip');
if (!/access-plate--bench|Open bench/.test(tools)) fail('tools.html missing Open bench access plates');
if (!/access-plate--tier/.test(tools)) fail('tools.html missing session-tier access plates');
if (!/data-tier="CORE"|data-tier="PRO"|data-tier="ADVANCED"/.test(tools)) {
  fail('tools.html missing CORE/PRO/ADVANCED data-tier on paid cards');
}
if (!/>CORE<|>PRO<|>ADVANCED</.test(tools)) {
  fail('tools.html missing visible CORE/PRO/ADVANCED access plate labels');
}
if (/badge-l">Live</.test(tools) && /badge-s">Credits</.test(tools)) {
  fail('tools.html still uses basic Live+Credits dual chips');
}
if (!/data-tools-free-hint="1"/.test(tools)) fail('tools.html missing free-access hint');
for (const t of FREE_TOOLS) {
  const re = new RegExp(`data-code="${t.toolId}"[^>]*data-access="free"|data-access="free"[^>]*data-code="${t.toolId}"`);
  // attribute order is data-code then data-access in inject
  if (!tools.includes(`data-code="${t.toolId}"`) || !new RegExp(`data-code="${t.toolId}"[\\s\\S]{0,220}?data-access="free"`).test(tools)) {
    fail(`tools.html free card missing data-access=free for ${t.toolId}`);
  }
}

// Free AEO upsells must disclose credits and not loop free→free
for (const t of FREE_TOOLS) {
  const rel = `${t.sourceSlug}.html`;
  const text = readFileSync(join(ROOT, rel), 'utf8');
  if (!text.includes(t.upsell.href)) fail(`${rel} missing Tier-A upsell href ${t.upsell.href}`);
  if (/Also free:/i.test(text)) fail(`${rel} still has free→free Also free upsell`);
  if (FREE_TOOL_PATHS.has(t.upsell.href)) fail(`${rel} upsell still points at free path`);
}

if (errors.length) {
  console.error('[FAIL] Honest credit copy guard:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(
  `[PASS] Honest credit copy guard: ${FREE_TOOLS.length} free tools; Tier-A upsells; pricing floors; tools badges`,
);
