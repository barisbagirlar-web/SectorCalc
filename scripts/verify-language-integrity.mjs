#!/usr/bin/env node
/**
 * Lightweight language / placeholder / regeneration firewall for indexable pages.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { indexablePages } from '../seo/registry.mjs';

const ROOT = process.cwd();
const errors = [];
const BAD = [
  /Regeneration pending/i,
  /Formula Gate review in progress/i,
  /mulbah/i,
  /AlD.{0,6}ked/i,
  /PMiluction/i,
  /Enerji and Emisyons/i,
  /TODO_REPLACE/i,
  /lorem ipsum/i,
  /\[placeholder\]/i,
];

function sourcePath(record) {
  if (record.sourceFile.startsWith('public/')) return record.sourceFile;
  return record.sourceFile;
}

for (const page of indexablePages()) {
  const file = sourcePath(page);
  const abs = join(ROOT, file);
  if (!existsSync(abs)) {
    errors.push(`missing source ${file}`);
    continue;
  }
  const html = readFileSync(abs, 'utf8');
  for (const re of BAD) {
    if (re.test(html)) errors.push(`${page.canonicalPath} matched forbidden pattern ${re}`);
  }
}

if (errors.length) {
  console.error('[FAIL] language integrity:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`[PASS] language integrity: ${indexablePages().length} indexable sources clean`);
