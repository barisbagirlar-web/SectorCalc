/**
 * Fail the production build if proprietary formula modules leak into browser assets.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const ASSETS = join(ROOT, 'dist', 'assets');

const FORBIDDEN = [
  /SC-001-weld-thickness\/v1\.0\.0\/(?:formula|reference|warnings)/,
  /SC-008-tolerance-stack\/v1\.0\.0\/(?:formula|reference|warnings)/,
  /SC-010-labor-cost\/v1\.0\.0\/(?:formula|reference|warnings)/,
  /SC-012-quote-pricing\/v1\.0\.0\/(?:formula|reference|warnings)/,
  /FILLET_FACTOR/,
  /MIN_FILLET_LEG_XS/,
  /assertConservation\(totalCost/,
  /simulateStack\s*\(/,
  /WEEKS_PER_MONTH/
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|mjs|css|map)$/.test(name)) out.push(p);
  }
  return out;
}

const files = walk(ASSETS);
const hits = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  for (const pattern of FORBIDDEN) {
    if (pattern.test(text)) hits.push(`${file}: ${pattern}`);
  }
}

if (hits.length) {
  console.error('[FAIL] proprietary formula markers found in dist assets:');
  for (const h of hits) console.error('  -', h);
  process.exit(1);
}

console.log(`[PASS] formula leak guard: scanned ${files.length} dist assets`);
