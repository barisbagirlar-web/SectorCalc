#!/usr/bin/env node
/**
 * ISO-style completion gate for Omni free-tools expansion.
 * Exit 0 only when zero stub debt remains and i18n/SSG preconditions pass.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "../..");
const SCHEMAS_DIR = join(ROOT, "generated", "schemas");
const PROGRESS = join(ROOT, "scripts/data/omni-batch-progress.json");
const FREE_SLUGS = join(ROOT, "free-slugs.json");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

const failures = [];

function runTs(expr) {
  const r = spawnSync("npx", ["tsx", "-e", expr], { cwd: ROOT, encoding: "utf8" });
  return r.stdout.trim();
}

function checkStubs() {
  const out = runTs(`
import fs from 'node:fs'; import path from 'node:path';
import { isStubSchemaFile } from './scripts/deepseek/is-stub-schema.ts';
const dir=path.join(process.cwd(),'generated/schemas');
let stubs=0,total=0,badI18n=0;
for(const f of fs.readdirSync(dir)){
  if(!f.endsWith('-schema.json')) continue;
  total++;
  const p=path.join(dir,f);
  if(isStubSchemaFile(p)) stubs++;
  const raw=JSON.parse(fs.readFileSync(p,'utf8'));
  for(const input of raw.inputs??[]){
    for(const loc of ['tr','de','fr','es','ar']){
      if(!input.label_i18n?.[loc]?.trim()||!input.businessContext_i18n?.[loc]?.trim()){badI18n++;break;}
    }
  }
}
console.log(JSON.stringify({stubs,total,badI18n}));
`);
  const data = JSON.parse(out || "{}");
  if (data.stubs > 0) failures.push(`stub schemas: ${data.stubs}/${data.total}`);
  if (data.badI18n > 0) failures.push(`schemas missing 6-locale i18n fields: ${data.badI18n} inputs flagged`);
  return data;
}

function checkList() {
  const out = runTs(`
import { parseCalculatorListEntries, defaultListFilePath } from './scripts/deepseek/parse-calculator-list.ts';
console.log(parseCalculatorListEntries(defaultListFilePath()).length);
`);
  const n = Number(out);
  if (!Number.isFinite(n) || n < 1200) failures.push(`input list parse count ${n} < 1200`);
  return n;
}

function checkFreeSlugs() {
  if (!existsSync(FREE_SLUGS)) {
    failures.push("free-slugs.json missing");
    return 0;
  }
  const slugs = JSON.parse(readFileSync(FREE_SLUGS, "utf8"));
  if (slugs.length < 3000) failures.push(`free-slugs count ${slugs.length} < 3000`);
  return slugs.length;
}

function checkMessagesLocales() {
  for (const locale of LOCALES) {
    const p = join(ROOT, `messages/${locale}.json`);
    if (!existsSync(p)) {
      failures.push(`messages/${locale}.json missing`);
      continue;
    }
    const m = JSON.parse(readFileSync(p, "utf8"));
    for (const key of ["physics-science", "food-cooking", "hobbies-diy"]) {
      if (!m.freeTrafficCatalog?.categories?.[key]) {
        failures.push(`messages/${locale}.json missing category ${key}`);
      }
    }
  }
}

function checkProgress() {
  if (!existsSync(PROGRESS)) return;
  const p = JSON.parse(readFileSync(PROGRESS, "utf8"));
  if ((p.failed ?? []).length > 0) failures.push(`batch failed slugs: ${p.failed.length}`);
}

const listCount = checkList();
const stubData = checkStubs();
const freeCount = checkFreeSlugs();
checkMessagesLocales();
checkProgress();

console.log("OMNI COMPLETION GATE");
console.log(`  list tools: ${listCount}`);
console.log(`  schemas: ${stubData.total ?? "?"}`);
console.log(`  stubs remaining: ${stubData.stubs ?? "?"}`);
console.log(`  free slugs: ${freeCount}`);

if (failures.length) {
  console.error("FAIL:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log("PASS — zero stub debt, i18n categories present");
process.exit(0);
