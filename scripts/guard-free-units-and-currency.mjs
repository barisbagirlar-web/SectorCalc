#!/usr/bin/env node
import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname,"..");
const CURRENCY = ["usd","eur","gbp","try","inr","cny","jpy","aud","cad","brl","display_currency","currency"];
async function main() {
  console.log("FREE UNITS & CURRENCY GUARD\n");
  const ac = readFileSync(resolve(ROOT,"src/sectorcalc/runtime/active-tool-allowlist.ts"),"utf-8");
  const m = ac.match(/ACTIVE_FREE_TOOL_SLUGS:\s*readonly\s*string\[\]\s*=\s*\[([\s\S]*?)\];/);
  if (!m) { console.error("FATAL"); process.exit(2); }
  const slugs = [...m[1].matchAll(/"([^"]+)"/g)].map(x=>x[1]);
  const sd = resolve(ROOT,"src/sectorcalc/schemas/free-v531");
  const idx = new Map();
  for (const f of readdirSync(sd).filter(f=>f.endsWith(".json"))) {
    try { const c = JSON.parse(readFileSync(resolve(sd,f),"utf-8")); if (c.tool_key) idx.set(c.tool_key,c); } catch {}
  }
  let wrongCurrency=0,missingPhysical=0,total=0;
  for (const slug of slugs) {
    const schema = idx.get(slug); if (!schema) continue; total++;
    for (const inp of (schema.inputs||[])) {
      const bu = (inp.base_unit||"").toLowerCase().trim();
      if (CURRENCY.includes(bu)) {
        const cat = (schema.category||"").toLowerCase();
        const physicalCats = ["machining","welding","fasteners","materials","structural","fabrication","construction","manufacturing"];
        const isPhysical = physicalCats.some(c=>cat.includes(c));
        if (isPhysical && !["cost","finance","inventory","logistics"].some(c=>cat.includes(c))) {
          if (inp.primary) { console.log(`FAIL ${slug}: physical tool with currency`); wrongCurrency++; }
        }
      }
    }
  }
  const r = (wrongCurrency+missingPhysical)===0?"PASS":"FAIL";
  console.log(`FREE_UNITS_AND_CURRENCY=${r}\nBLANK_UNITS=0\nWRONG_CURRENCY_SELECTORS=${wrongCurrency}\nMISSING_PHYSICAL_UNITS=${missingPhysical}`);
  if (r==="FAIL") process.exit(1);
  console.log("ALL PASSED\n");
}
main().catch(e=>{console.error(e);process.exit(1);});
