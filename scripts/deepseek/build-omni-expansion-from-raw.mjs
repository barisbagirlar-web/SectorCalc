#!/usr/bin/env node
/** Parse scripts/data/omni-expansion-raw.txt → input_calculators.txt */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "../..");
const RAW = join(ROOT, "scripts/data/omni-expansion-raw.txt");

if (!existsSync(RAW)) {
  console.error(`Paste the full Omni list into: ${RAW}`);
  process.exit(1);
}

execFileSync("npx", ["tsx", "-e", `
import fs from 'node:fs';
import { parseCalculatorListEntries, defaultListFilePath } from './scripts/deepseek/parse-calculator-list.ts';
const raw = fs.readFileSync('${RAW}', 'utf8');
fs.writeFileSync(defaultListFilePath(), raw);
const n = parseCalculatorListEntries(defaultListFilePath()).length;
console.log('input_calculators.txt updated, parsed', n, 'tools');
`], { cwd: ROOT, stdio: "inherit" });
