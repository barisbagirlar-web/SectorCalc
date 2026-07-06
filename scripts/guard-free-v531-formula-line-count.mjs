#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = path.join(process.cwd(), 'src/sectorcalc/formulas/free-v531');
const files = fs.readdirSync(root).filter(f => f.endsWith('.formula.ts'));
let failed = false;
for (const file of files) {
  const full = path.join(root, file);
  const lines = fs.readFileSync(full, 'utf8').split(/\r?\n/).length;
  if (lines < 1000) {
    console.error(`LINE_COUNT_FAIL:${file}:${lines}`);
    failed = true;
  }
}
if (files.length !== 50) {
  console.error(`FORMULA_COUNT_FAIL:${files.length}`);
  failed = true;
}
if (failed) process.exit(1);
console.log(`FREE_V531_FORMULA_LINE_COUNT_PASS=YES files=${files.length}`);
