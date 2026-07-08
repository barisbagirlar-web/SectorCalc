#!/usr/bin/env node
import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const FORBIDDEN = ["SuperV4","single-operation decision-support schema","Quick Calculator","raw scope text","audit evidence and commercial risk interpretation","formula-free decision support"];
const REQUIRED_FIELDS = ["tool_id","tool_key","tool_name","category","scope","inputs","outputs","risk_level"];
async function main() {
  console.log("FREE SCHEMA CONTRACT GUARD\n");
  const ac = readFileSync(resolve(ROOT,"src/sectorcalc/runtime/active-tool-allowlist.ts"),"utf-8");
  const m = ac.match(/ACTIVE_FREE_TOOL_SLUGS:\s*readonly\s*string\[\]\s*=\s*\[([\s\S]*?)\];/);
  if (!m) { console.error("FATAL: Could not parse slugs"); process.exit(2); }
  const slugs = [...m[1].matchAll(/"([^"]+)"/g)].map(x=>x[1]);
  console.log(`Slugs: ${slugs.length}\n`);
  let pass=0,fail=0,missSchema=0,missInputs=0,missOutputs=0,forbidden=0;
  const sd = resolve(ROOT,"src/sectorcalc/schemas/free-v531");
  const idx = new Map();
  for (const f of readdirSync(sd).filter(f=>f.endsWith(".json"))) {
    try { const c = JSON.parse(readFileSync(resolve(sd,f),"utf-8")); if (c.tool_key) idx.set(c.tool_key,c); } catch {}
  }
  for (const slug of slugs) {
    const ent = idx.get(slug);
    if (!ent) { console.log(`  FAIL ${slug}: schema not found`); missSchema++; fail++; continue; }
    const s = ent;
    let ok = true;
    for (const f of REQUIRED_FIELDS) { if (s[f]===undefined) { console.log(`  FAIL ${slug}: missing ${f}`); ok=false; } }
    if (ok) pass++; else fail++;
    if (!Array.isArray(s.inputs)||s.inputs.length===0) { console.log(`  FAIL ${slug}: empty inputs`); missInputs++; }
    if (!Array.isArray(s.outputs)||s.outputs.length===0) { console.log(`  FAIL ${slug}: empty outputs`); missOutputs++; }
    const str = JSON.stringify(s);
    for (const p of FORBIDDEN) { if (str.includes(p)) { console.log(`  FAIL ${slug}: forbidden "${p}"`); forbidden++; } }
  }
  const r = fail===0?"PASS":"FAIL";
  console.log(`\nFREE_SCHEMA_CONTRACT=${r}\nACTIVE_FREE_TOOLS=${slugs.length}\nMISSING_SCHEMA=${missSchema}\nMISSING_INPUTS=${missInputs}\nMISSING_OUTPUTS=${missOutputs}\nFORBIDDEN_COPY=${forbidden}`);
  if (r==="FAIL") process.exit(1);
  console.log("ALL PASSED\n");
}
main().catch(e=>{console.error(e);process.exit(1);});
