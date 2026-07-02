#!/usr/bin/env node
/**
 * SectorCalc — Unit Issue Classifier (advisory)
 * Categorizes the 48 [MISSING UNIT] tools into A/B/C candidates based on repair strategy.
 *   A = missing metadata, formula dimensionally correct -> just add unit: (safe)
 *   B = un-converted multiplication (mm x m, g x kg-price) -> boundary normalize + golden
 *   C = percent/semantic ( missing (1 + rate) or /100) -> unit:"percent" + normalize + golden
 * OUTPUT IS A CANDIDATE: dimensional correctness requires human verification.
 */
import fs from "node:fs";
import path from "node:path";
import { globSync } from "glob";

const SCHEMAS = path.join(process.cwd(), "generated/schemas");
const FORMULA_SRC = globSync(path.join(process.cwd(), "src/**/formula-registry.*"))
  .map((f) => fs.readFileSync(f, "utf8")).join("\n");

const PERCENT_ID = /rate|ratio|factor|percent|margin|scrap|efficiency|utiliz|yield/i;

const files = globSync(`${SCHEMAS}/**/*.json`);
const report = { A: [], B: [], C: [] };

for (const file of files) {
  let data; try { data = JSON.parse(fs.readFileSync(file, "utf8")); } catch { continue; }
  if (!Array.isArray(data?.inputs)) continue;
  const toolId = path.basename(file).replace(/(-schema)?\.json$/, "");

  for (const inp of data.inputs) {
    if (inp.type !== "number") continue;
    if (inp.unit) continue;                          // has unit -> not in the 48
    const id = inp.id;

    // Candidate C: named percent + formula missing /100
    const inOnePlus = new RegExp(`1\\s*[+\\-]\\s*${id}\\b`).test(FORMULA_SRC);
    const hasDiv100 = new RegExp(`${id}\\s*/\\s*100`).test(FORMULA_SRC);
    if (PERCENT_ID.test(id) && (inOnePlus || !hasDiv100)) {
      report.C.push(`${toolId}.${id}  (percent smell)`); continue;
    }
    // Candidate B: enters mass/length/volume/density formula but is unitless
    if (/volume|density|length|area|mass|weight|leg|diameter|thickness/i.test(id)) {
      report.B.push(`${toolId}.${id}  (dimensional, needs conversion)`); continue;
    }
    // else Candidate A
    report.A.push(`${toolId}.${id}`);
  }
}

for (const cls of ["C", "B", "A"]) {
  console.log(`\n=== CLASS ${cls} (${report[cls].length}) ===`);
  for (const line of report[cls]) console.log(`  • ${line}`);
}
console.log(`\nTotal: A=${report.A.length} B=${report.B.length} C=${report.C.length}`);
console.log("NOTE: These are CANDIDATES. Write golden tests after B/C repair; for A, just add unit: property.");
