#!/usr/bin/env node
/**
 * Scan generated/public artifacts for private leaks.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const errors = [];
const warnings = [];
const SKIP_DIR = new Set(['node_modules', 'coverage', '.git']);

const BLOCK = [
  [/AIza[0-9A-Za-z_-]{19,}/, 'google-api-key'],
  [/sk_live_[0-9a-zA-Z]+/, 'stripe-live-key'],
  [/-----BEGIN (RSA )?PRIVATE KEY-----/, 'private-key'],
  [/Cloud Scheduler/i, 'cloud-scheduler'],
  [/\/api\/billing\/health/, 'billing-health'],
  [/firebase-debug/, 'firebase-debug'],
  [/PLAYWRIGHT_/, 'playwright-secret'],
];

const WARN = [
  [/seo\/registry\.mjs/, 'private-registry-path'],
  [/scripts\/verify-/, 'internal-script-path'],
  [/hosting:channel:deploy/, 'preview-deploy'],
];

function walk(dir, acc) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIR.has(name)) continue;
    const abs = join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) walk(abs, acc);
    else acc.push(abs);
  }
}

const files = [];
for (const root of ['public', 'dist']) {
  try {
    walk(join(ROOT, root), files);
  } catch {
    /* dist may be absent before build */
  }
}

for (const file of files) {
  const rel = relative(ROOT, file).replaceAll('\\', '/');
  if (!/\.(txt|xml|html|json|md|js|css)$/.test(rel)) continue;
  if (rel.includes('vendor/')) continue;
  const text = readFileSync(file, 'utf8');
  for (const [re, label] of BLOCK) {
    if (re.test(text)) errors.push(`${rel}: ${label}`);
  }
  if (rel.endsWith('llms.txt') || rel.endsWith('llm.txt') || rel.endsWith('llms-full.txt')) {
    for (const [re, label] of WARN) {
      if (re.test(text)) errors.push(`${rel}: ${label}`);
    }
  }
}

if (errors.length) {
  console.error('[FAIL] public leaks:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
if (warnings.length) {
  console.warn('[WARN] public leaks:\n' + warnings.map((e) => `  - ${e}`).join('\n'));
}
console.log(`[PASS] public leak scan: ${files.length} files`);
