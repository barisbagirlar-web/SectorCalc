#!/usr/bin/env node
/**
 * Fail-closed: tools.html catalog DNA must lead with search + categories.
 * Open-bench / AEO problem-map marketing must not prepend the drawing index.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (m) => errors.push(m);

const toolsPath = join(ROOT, 'tools.html');
if (!existsSync(toolsPath)) {
  console.error('[FAIL] tools.html missing');
  process.exit(1);
}

const html = readFileSync(toolsPath, 'utf8');

for (const marker of [
  '<!--SC-FREE-TOOLS-START-->',
  '<!--SC-AEO-HUB-START-->',
  'id="free-calculators"',
  'id="problems-we-solve"',
  'Prove the engine before you commission a session',
  'Touch the real shop-floor problem first',
  'Open reference bench · five instruments',
]) {
  if (html.includes(marker)) {
    fail(`tools.html must not host open-bench/AEO marketing (${marker}) — use / or /topics`);
  }
}

if (!/id="q"/.test(html)) fail('tools.html missing omni-search #q');
if (!/What do you need to calculate today\?/.test(html)) {
  fail('tools.html missing catalog H1 DNA');
}
if (!/id="tiles"/.test(html) || !/id="catalog"/.test(html)) {
  fail('tools.html missing category tiles / catalog mounts');
}

const navEnd = html.indexOf('<!--SC-SITE-NAV-END-->');
const h1 = html.indexOf('What do you need to calculate today');
const q = html.indexOf('id="q"');
if (navEnd < 0 || h1 < 0 || q < 0) {
  fail('tools.html missing nav/H1/search anchors');
} else if (!(navEnd < h1 && h1 < q)) {
  fail('tools.html catalog H1 + search must be the first content after site nav');
}

const between = html.slice(navEnd, h1);
if (/sc-free-tools|sc-aeo-hub|data-aeo-hub/.test(between)) {
  fail('tools.html has marketing sections between site nav and catalog H1');
}

const topicsPath = join(ROOT, 'public/topics/index.html');
if (!existsSync(topicsPath)) {
  fail('public/topics/index.html missing (open-bench destination)');
} else {
  const topics = readFileSync(topicsPath, 'utf8');
  if (!/id="free-calculators"/.test(topics)) fail('topics hub missing #free-calculators open bench');
  if (!/id="problems-we-solve"/.test(topics)) fail('topics hub missing #problems-we-solve map');
  if (!/What do you need to calculate today|href="\/tools"/.test(topics)) {
    fail('topics hub must point readers back to /tools catalog DNA');
  }
}

if (errors.length) {
  console.error('[FAIL] tools catalog DNA:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('[PASS] tools.html catalog DNA: search-first; open-bench/AEO on /topics');
