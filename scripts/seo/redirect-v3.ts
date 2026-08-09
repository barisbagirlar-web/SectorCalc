#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const firebase = JSON.parse(fs.readFileSync(path.join(root, 'firebase.json'), 'utf8'));
const hosting = firebase.hosting ?? {};
const redirects = Array.isArray(hosting.redirects) ? hosting.redirects : [];
const errors: string[] = [];

if (hosting.trailingSlash !== false) errors.push('trailingSlash must be false');

const bySource = new Map<string, any>();
for (const r of redirects) {
  if (!r?.source || !r?.destination) { errors.push('redirect missing source/destination'); continue; }
  if (r.type !== 301 && r.type !== 308) errors.push(`${r.source}: redirect must be permanent`);
  if (r.source === r.destination) errors.push(`${r.source}: self redirect`);
  if (bySource.has(r.source)) errors.push(`${r.source}: duplicate redirect source`);
  bySource.set(r.source, r);
}

for (const r of redirects) {
  const seen = new Set<string>([r.source]);
  let current = r.destination;
  let hops = 1;
  while (bySource.has(current)) {
    if (seen.has(current)) { errors.push(`${r.source}: redirect loop through ${current}`); break; }
    seen.add(current);
    current = bySource.get(current).destination;
    hops += 1;
    if (hops > 1) { errors.push(`${r.source}: redirect chain exceeds one hop (${hops})`); break; }
  }
}

const globalHeaders = (hosting.headers ?? []).find((x: any) => x.source === '**')?.headers ?? [];
const header = (name: string) => globalHeaders.find((x: any) => String(x.key).toLowerCase() === name.toLowerCase())?.value;
if (header('X-Content-Type-Options') !== 'nosniff') errors.push('missing X-Content-Type-Options:nosniff');
if (header('Referrer-Policy') !== 'strict-origin-when-cross-origin') errors.push('missing strict Referrer-Policy');
const csp = String(header('Content-Security-Policy') ?? '');
if (!csp.includes('upgrade-insecure-requests')) errors.push('CSP missing upgrade-insecure-requests');
if (/\bpreload\b/i.test(String(header('Strict-Transport-Security') ?? ''))) errors.push('HSTS preload must not be enabled automatically');

if (errors.length) {
  console.error('[FAIL] V3 redirect contract\n' + errors.map((e) => ` - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`[PASS] V3 redirect contract redirects=${redirects.length} trailingSlash=false chains=0 loops=0`);
