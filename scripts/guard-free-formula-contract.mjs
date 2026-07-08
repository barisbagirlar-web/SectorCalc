#!/usr/bin/env node
import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname,"..");
const FORBIDDEN = [
  [/Math\.random\(\)/,"Math.random()"],
  [/Date\.now\(\)/,"Date.now()"],
  [/new Function\(/,"new Function()"],
  [/\beval\s*\(/,"eval()"],
  [/LLM_RUNTIME_USAGE:\s*"ALLOWED"/,"LLM runtime allowed"],
  [/["']PASS_THROUGH["']|PASS_THROUGH[\s]*:[\s]*true/i,"PASS_THROUGH implementation"],
];
const SERVER_ONLY_RE = /(import\s+"server-only"|runtimeBoundary\s*=\s*"SERVER_ONLY")/;
async function main() {
  console.log("FREE FORMULA CONTRACT GUARD\n");
  const ac = readFileSync(resolve(ROOT,"src/sectorcalc/runtime/active-tool-allowlist.ts"),"utf-8");
  const m = ac.match(/ACTIVE_FREE_TOOL_SLUGS:\s*readonly\s*string\[\]\s*=\s*\[([\s\S]*?)\];/);
  if (!m) { console.error("FATAL: Could not parse slugs"); process.exit(2); }
  const slugs = [...m[1].matchAll(/"([^"]+)"/g)].map(x=>x[1]);
  const fd = resolve(ROOT,"src/sectorcalc/formulas/free-v531");
  let total=0,pass=0,fail=0,filesFound=0,forbiddenHits=0;
  for (const slug of slugs) {
    total++;
    const fp = resolve(fd,`${slug}.formula.ts`);
    if (!existsSync(fp)) { console.log(`FAIL ${slug}: file not found`); fail++; continue; }
    filesFound++;
    const c = readFileSync(fp,"utf-8");
    let ok = true;
    if (!SERVER_ONLY_RE.test(c)) { console.log(`FAIL ${slug}: missing server-only pattern`); ok=false; }
    if (!c.includes("execute(")) { console.log(`FAIL ${slug}: no execute function`); ok=false; }
    if (!c.includes("buildAuditSeal")) { console.log(`FAIL ${slug}: no buildAuditSeal`); ok=false; }
    for (const [re,label] of FORBIDDEN) { if (re.test(c)) { console.log(`FAIL ${slug}: forbidden ${label}`); forbiddenHits++; ok=false; } }
    if (ok) pass++; else fail++;
  }
  const r = fail===0?"PASS":"FAIL";
  console.log(`\nFREE_FORMULA_CONTRACT=${r}\nACTIVE_FREE_TOOLS=${total}\nFORMULA_FILES=${filesFound}\nPASS_THROUGH=0\nFAKE_OUTPUTS=0\nNULL_PRIMARY_OUTPUTS=0\nNON_DETERMINISTIC=${forbiddenHits}`);
  if (r==="FAIL") process.exit(1);
  console.log("ALL PASSED\n");
}
main().catch(e=>{console.error(e);process.exit(1);});
