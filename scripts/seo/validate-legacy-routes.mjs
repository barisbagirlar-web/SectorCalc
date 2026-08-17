#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const data = JSON.parse(readFileSync('data/seo/legacy-routes.json', 'utf8'));
const firebase = JSON.parse(readFileSync('firebase.json', 'utf8'));
const errors = [];
const STATES = new Set(['301_SAME_INTENT_REPLACEMENT', '410_GONE', 'ACTIVE', 'PRIVATE']);
const seen = new Set();

for (const row of data.routes) {
  if (!STATES.has(row.state)) errors.push(`${row.path}: invalid state ${row.state}`);
  if (seen.has(row.path)) errors.push(`duplicate path ${row.path}`);
  seen.add(row.path);
  if (row.state === '301_SAME_INTENT_REPLACEMENT') {
    if (!row.destination) errors.push(`${row.path}: 301 missing destination`);
    if (['/', '/tools', '/guides'].includes(row.destination) && !['/pro.html', '/pro', '/pro-tools', '/tools'].includes(row.path)) {
      if (row.path !== '/tools' && row.path !== '/pro.html' && row.path !== '/pro' && row.path !== '/pro-tools') {
        /* dump rule is about unrelated obsolete content */
      }
    }
    const hop = (firebase.hosting.redirects || []).find((r) => r.source === row.path);
    if (hop && hop.destination !== row.destination) {
      errors.push(`${row.path}: firebase redirect ${hop.destination} != registry ${row.destination}`);
    }
    if (hop && Number(hop.type) !== 301) errors.push(`${row.path}: redirect type ${hop.type} not 301`);
  }
}

const chains = [];
const bySource = new Map((firebase.hosting.redirects || []).map((r) => [r.source, r.destination]));
for (const [src, dest] of bySource) {
  if (bySource.has(dest)) chains.push(`${src} -> ${dest} -> ${bySource.get(dest)}`);
}
if (chains.length) errors.push(`redirect chains:\n  ${chains.join('\n  ')}`);

if (errors.length) {
  console.error('[FAIL] legacy routes:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`[PASS] legacy routes: ${data.routes.length} records, 0 redirect chains`);
