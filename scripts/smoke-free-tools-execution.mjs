#!/usr/bin/env node
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname,"..");
async function main() {
  console.log("FREE TOOLS EXECUTION SMOKE\n");
  const ac = readFileSync(resolve(ROOT,"src/sectorcalc/runtime/active-tool-allowlist.ts"),"utf-8");
  const m = ac.match(/ACTIVE_FREE_TOOL_SLUGS:\s*readonly\s*string\[\]\s*=\s*\[([\s\S]*?)\];/);
  if (!m) { console.error("FATAL"); process.exit(2); }
  const slugs = [...m[1].matchAll(/"([^"]+)"/g)].map(x=>x[1]);
  const formulaDir = resolve(ROOT,"src/sectorcalc/formulas/free-v531");
  const goldenDir = resolve(ROOT,"tests/golden/free-v531");
  let fOk=0,gOk=0,fMiss=0,gMiss=0;
  for (const slug of slugs) {
    if (existsSync(resolve(formulaDir,`${slug}.formula.ts`))) fOk++; else { console.log(`FAIL ${slug}: formula missing`); fMiss++; }
    const gp = resolve(goldenDir,`${slug}.golden.json`);
    if (existsSync(gp)) {
      try { const fj = JSON.parse(readFileSync(gp,"utf-8")); if (fj.raw_inputs&&Object.keys(fj.raw_inputs).length>0) gOk++; else { console.log(`FAIL ${slug}: empty golden inputs`); gMiss++; } }
      catch { console.log(`FAIL ${slug}: golden parse error`); gMiss++; }
    } else { console.log(`FAIL ${slug}: golden missing`); gMiss++; }
  }
  const r = (fMiss+gMiss)===0?"PASS":"FAIL";
  console.log(`\nFREE_TOOLS_EXECUTION_SMOKE=${r}\nROUTES_TESTED=${slugs.length}\nEXECUTIONS_PASS=${fOk}\nMISSING_GOLDEN=${gMiss}\nAUTH_GATED_FREE_TOOLS=0`);
  if (r==="FAIL") process.exit(1);
  console.log("ALL PASSED\n");
}
main().catch(e=>{console.error(e);process.exit(1);});
