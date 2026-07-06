#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = path.join(process.cwd(), 'src/sectorcalc/formulas/free-v531');
const forbidden = [
  /LLM_RUNTIME_USAGE:\s*ALLOWED/i,
  /clientFormulaExecution\s*=\s*["']ALLOWED/i,
  /CERTIFIED|APPROVED BY|LEGAL PROOF|AUTHORITY APPROVAL/i,
  /new Function\s*\(/,
  /eval\s*\(/,
];
let failed = false;
for (const file of fs.readdirSync(root).filter(f => f.endsWith('.ts'))) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  for (const re of forbidden) {
    if (re.test(text)) {
      console.error(`PUBLIC_SAFETY_FAIL:${file}:${re}`);
      failed = true;
    }
  }
}
if (failed) process.exit(1);
console.log('FREE_V531_FORMULA_PUBLIC_SAFETY_PASS=YES');
