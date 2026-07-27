#!/usr/bin/env node
/**
 * Homepage credit-band must match pricing package SSOT (src/lib/pricing-packages.ts).
 * Prevents stale $1.99 packs or "payments not live" copy from shipping.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (m) => errors.push(m);

const ssot = readFileSync(join(ROOT, 'src/lib/pricing-packages.ts'), 'utf8');
const PACKAGES = [];
const re =
  /\{\s*key:\s*'(STARTER|WORKSHOP|PROFESSIONAL|TEAM_WALLET)',\s*credits:\s*(\d+),\s*price:\s*'(\$[^']+)',\s*perCredit:\s*'(\$[^']+)'/g;
let m;
while ((m = re.exec(ssot))) {
  PACKAGES.push({ key: m[1], credits: Number(m[2]), price: m[3], perCredit: m[4] });
}

const indexPath = join(ROOT, 'index.html');
if (!existsSync(indexPath)) fail('index.html missing');
const html = readFileSync(indexPath, 'utf8');
const section = html.match(/id="pricing"[\s\S]*?<\/section>/i)?.[0] || '';
if (!section) fail('index.html missing #pricing credit section');

const banned = [
  /Payments are not live yet/i,
  /notify-only/i,
  /free until Paddle checkout launches/i,
  /12 MONTH VALIDITY/i,
  /Planned:\s*Paddle/i,
  /\$1\.99/,
  /\$4\.99/,
  /\$7\.99/,
  /\$11\.99/,
  /\$24\.99/,
];
for (const br of banned) {
  if (br.test(section)) fail(`homepage pricing section contains banned stale copy: ${br}`);
}

if (!/NEVER EXPIRE/i.test(section)) {
  fail('homepage pricing section must state purchased credits never expire');
}

if (PACKAGES.length !== 4) {
  fail(`expected 4 SSOT packages in pricing-packages.ts, got ${PACKAGES.length}`);
}

for (const p of PACKAGES) {
  if (!section.includes(`data-package-key="${p.key}"`)) {
    fail(`homepage missing data-package-key="${p.key}"`);
  }
  if (
    !new RegExp(
      `data-package-key="${p.key}"[\\s\\S]*?<div class="cr-amount">${p.credits}</div>`
    ).test(section)
  ) {
    fail(`homepage pack ${p.key} missing credits amount ${p.credits}`);
  }
  if (
    !new RegExp(
      `data-package-key="${p.key}"[\\s\\S]*?<div class="cr-price">${p.price.replace('$', '\\$')}</div>`
    ).test(section)
  ) {
    fail(`homepage pack ${p.key} missing price ${p.price}`);
  }
  if (!section.includes(`/pricing.html#${p.key}`)) {
    fail(`homepage pack ${p.key} must deep-link to /pricing.html#${p.key}`);
  }
}

const cardCount = (section.match(/data-package-key="/g) || []).length;
if (cardCount !== 4) fail(`homepage must render exactly 4 credit packs, found ${cardCount}`);

if (errors.length) {
  console.error('[FAIL] Homepage credit packs guard:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(
  `[PASS] Homepage credit packs match SSOT (${PACKAGES.map((p) => `${p.key}:${p.credits}${p.price}`).join(', ')})`
);
