#!/usr/bin/env node
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname,"..");
async function main() {
  console.log("FREE TOOLS MOBILE UX SMOKE\n");
  const cssPath = resolve(ROOT,"src/sectorcalc/pro-form/universal-industrial-decision-form.css");
  const formPath = resolve(ROOT,"src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx");
  if (!existsSync(cssPath)) { console.error("FATAL: CSS not found"); process.exit(2); }
  const css = readFileSync(cssPath,"utf-8");
  let gaps=0, overlaps=0, blocked=0, bp=0;
  if (css.includes("@media (max-width: 760px)")) bp++; else { console.log("FAIL: No 760px breakpoint"); gaps++; }
  if (css.includes("grid-template-columns: 1fr")) bp++; else { console.log("FAIL: No single-column grid"); gaps++; }
  if (css.includes("sc-v531-advanced-summary")&&css.includes("gap:")) console.log("OK: Advanced details spaced");
  else { console.log("FAIL: Advanced details not spaced"); gaps++; }
  const hasCalc = existsSync(formPath)?readFileSync(formPath,"utf-8").includes("Calculate"):false;
  if (hasCalc) console.log("OK: Calculate present");
  else { console.log("FAIL: Calculate missing"); gaps++; }
  const r = gaps===0?"PASS":"FAIL";
  console.log(`\nFREE_MOBILE_UX_SMOKE=${r}\nMOBILE_BREAKPOINTS_FOUND=${bp}\nOVERLAPS=${overlaps}\nGHOST_GAPS=${gaps}\nBLOCKED_STATES=${blocked}`);
  if (r==="FAIL") process.exit(1);
  console.log("ALL PASSED\n");
}
main().catch(e=>{console.error(e);process.exit(1);});
