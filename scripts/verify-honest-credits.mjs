#!/usr/bin/env node
/**
 * Honest Model-B commerce copy guard.
 * Fails if marketing claims free calculation while live tools require credit sessions.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (m) => errors.push(m);

const banned = [
  /Run free/i,
  /Run SC-008 Free/i,
  /Open a calculator free/i,
  /Free exploratory calculation/i,
  /Free exploratory runs stay free/i,
  /free calc needs no card/i,
  /Inputs, core results, formulas, and basic warnings stay free/i,
  /Free monthly allowance/i,
  /no account required to try/i,
  /free calculator engines/i,
];

const files = [
  'index.html',
  'pricing.html',
  'public/llm.txt',
  'public/llms.txt',
  'public/privacy/index.html',
  'sc-ops.html',
  'src/pricing.ts',
  'src/account.ts',
];

for (const rel of files) {
  const p = join(ROOT, rel);
  if (!existsSync(p)) {
    fail(`missing ${rel}`);
    continue;
  }
  const text = readFileSync(p, 'utf8');
  for (const re of banned) {
    if (re.test(text)) fail(`${rel} contains banned free-calc claim: ${re}`);
  }
}

// Spot-check a few calculator schema blocks after inject
for (const rel of ['sc008-pro.html', 'surface-finish-pro.html', 'weld-pro.html']) {
  const p = join(ROOT, rel);
  if (!existsSync(p)) continue;
  const text = readFileSync(p, 'utf8');
  if (/Free exploratory calculation/i.test(text)) {
    fail(`${rel} still ships Free exploratory calculation Offer`);
  }
  if (/"price"\s*:\s*"0(\.00)?"/.test(text) && /SoftwareApplication/.test(text)) {
    // allow only if not in offers for software — soft check on Product free offer
    if (/Free exploratory/i.test(text)) fail(`${rel} still has free price offer`);
  }
}

if (errors.length) {
  console.error('[FAIL] Honest credit copy guard:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('[PASS] Honest credit copy guard: no free-calc marketing claims on Model-B surfaces');
