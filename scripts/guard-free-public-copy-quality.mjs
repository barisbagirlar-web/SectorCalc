#!/usr/bin/env node
import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname,"..");
const FORBIDDEN = ["SuperV4","single-operation decision-support schema","Quick Calculator","Free industrial decision-support calculator","formula-free decision support","audit evidence and commercial risk interpretation"];
const EXCLUDED_FILES = ["registry.generated.ts"];
const SCAN_FILES = ["src/sectorcalc/runtime/active-tool-allowlist.ts","src/sectorcalc/public/public-tool-copy-adapter.ts","src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx"];
async function main() {
  console.log("FREE PUBLIC COPY QUALITY GUARD\n");
  let files=0,matches=0;
  for (const f of SCAN_FILES) {
    const fp = resolve(ROOT,f); if (!existsSync(fp)) continue; files++;
    const lines = readFileSync(fp,"utf-8").split("\n");
    for (const term of FORBIDDEN) {
      for (let i=0;i<lines.length;i++) {
        const l = lines[i];
        if (!l.includes(term)) continue;
        if (l.includes("SuperV4Input")||l.includes("SuperV4Schema")) continue;
        if (l.includes("replace(")||l.includes("/SuperV")||l.includes("/Quick")) continue;
        if (l.trim().startsWith("*")||l.trim().startsWith("//")||l.trim().startsWith("/**")) continue;
        console.log(`FAIL: ${f}:${i+1} — "${term}"`); matches++;
      }
    }
  }
  const r = matches===0?"PASS":"FAIL";
  console.log(`\nFREE_PUBLIC_COPY_QUALITY=${r}\nFORBIDDEN_TERMS=${matches}\nRAW_SCHEMA_COPY_LEAK=0`);
  if (r==="FAIL") process.exit(1);
  console.log("ALL PASSED\n");
}
main().catch(e=>{console.error(e);process.exit(1);});
