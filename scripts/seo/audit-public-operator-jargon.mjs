#!/usr/bin/env node
/**
 * Fail if public production artifacts contain operator SEO/AI jargon.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { OPERATOR_JARGON } from '../../seo/operator-jargon.mjs';

const ROOT = process.cwd();
const SKIP_DIR = new Set(['node_modules', 'dist', 'coverage', '.git', 'docs', 'tests']);
const SKIP_FILE = new Set([
  'scripts/seo/audit-public-operator-jargon.mjs',
  'seo/operator-jargon.mjs',
  'data/seo/legacy-routes.json',
]);
const SCAN_EXT = new Set(['.html', '.txt', '.xml', '.md', '.js', '.mjs', '.json']);

const errors = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIR.has(name)) continue;
    const abs = join(dir, name);
    const rel = relative(ROOT, abs).replaceAll('\\', '/');
    let st;
    try {
      st = statSync(abs);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      walk(abs);
      continue;
    }
    if (SKIP_FILE.has(rel)) continue;
    if (![...SCAN_EXT].some((ext) => rel.endsWith(ext))) continue;
    if (!/^(index\.html|pricing\.html|tools\.html|pro\.html|account\.html|login\.html|public\/|content\/|scripts\/build-|scripts\/generate-llm|scripts\/inject-)/.test(rel)) {
      continue;
    }
    const text = readFileSync(abs, 'utf8');
    for (const phrase of OPERATOR_JARGON) {
      if (text.toLowerCase().includes(phrase.toLowerCase())) {
        errors.push(`${rel}: "${phrase}"`);
      }
    }
  }
}

walk(ROOT);
if (errors.length) {
  console.error('[FAIL] public operator jargon:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('[PASS] public operator jargon: 0');
