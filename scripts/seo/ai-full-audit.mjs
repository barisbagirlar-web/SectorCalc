#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { OPERATOR_JARGON_RE } from '../../seo/operator-jargon.mjs';

const ROOT = process.cwd();
const errors = [];
const budget = JSON.parse(readFileSync('data/seo/discovery-budget.json', 'utf8'));

function fail(m) {
  errors.push(m);
}

const gen = spawnSync('node', ['scripts/generate-llm-discovery.mjs'], { cwd: ROOT, encoding: 'utf8' });
if (gen.status !== 0) {
  console.error(gen.stdout + gen.stderr);
  process.exit(1);
}

const llms = readFileSync('public/llms.txt', 'utf8');
const pointer = readFileSync('public/llm.txt', 'utf8');
const full = readFileSync('public/llms-full.txt', 'utf8');

if (Buffer.byteLength(llms, 'utf8') > budget.llmsMaxBytes) fail(`llms.txt too large: ${Buffer.byteLength(llms, 'utf8')}`);
if ((llms.match(/^- \[/gm) || []).length < budget.llmsMinResources) fail('llms.txt resource count below budget');
if ((llms.match(/^- \[/gm) || []).length > budget.llmsMaxResources) fail('llms.txt resource count above operational budget');
if (OPERATOR_JARGON_RE.test(llms) || OPERATOR_JARGON_RE.test(full) || OPERATOR_JARGON_RE.test(pointer)) {
  fail('llms artifacts contain operator jargon');
}
if (/billing\/health|Cloud Scheduler|\/src\/industrial/.test(llms + full)) fail('llms leaked internal endpoint or source path');
if (!pointer.includes('/llms.txt')) fail('llm.txt pointer missing /llms.txt');
if (pointer.length > budget.llmPointerMaxBytes) fail('llm.txt is not a tiny pointer');
if (!llms.includes('/guides')) fail('llms.txt missing /guides');
if (!llms.includes('/tools')) fail('llms.txt missing /tools');
if (llms.includes('/pro.html') || full.includes('/pro.html')) fail('llms still cites /pro.html');
if (llms.includes('/account')) fail('llms includes private account route');

const mdHero = [
  'public/calculator/tolerance-stack-up/index.md',
  'public/guides/tolerance-stack-up-complete/index.md',
  'public/glossary/tolerance-stack-up/index.md',
];
for (const f of mdHero) {
  if (!existsSync(f)) {
    fail(`missing markdown alternate ${f}`);
    continue;
  }
  const md = readFileSync(f, 'utf8');
  if (!/engineVersion:/i.test(md) && !/engine version/i.test(md)) fail(`${f} missing engine version`);
}

if (errors.length) {
  console.error('[FAIL] ai:full-audit:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('[PASS] ai:full-audit');
