#!/usr/bin/env npx tsx
/**
 * Audit: Find inputs that are NEVER referenced in any formula.
 * This catches hardcoded formulas that ignore user input.
 */
import fs from "node:fs";

import { section1 } from "./lib/359-section1";
import { section2 } from "./lib/359-section2";
import { section3 } from "./lib/359-section3";
import { section4 } from "./lib/359-section4";
import { section5 } from "./lib/359-section5";
import { section6 } from "./lib/359-section6";
import { section7 } from "./lib/359-section7";
import { section8 } from "./lib/359-section8";
import { section9 } from "./lib/359-section9";
import { section10 } from "./lib/359-section10";
import { section11 } from "./lib/359-section11";
import { section12 } from "./lib/359-section12";
import { section13 } from "./lib/359-section13";
import { section14 } from "./lib/359-section14";
import { section15 } from "./lib/359-section15";
import { section16 } from "./lib/359-section16";
import { section17 } from "./lib/359-section17";
import { section18 } from "./lib/359-section18";
import { section19 } from "./lib/359-section19";
import { section20 } from "./lib/359-section20";
import { section21 } from "./lib/359-section21";
import { section22 } from "./lib/359-section22";

const ALL_DEFS = [
  ...section1, ...section2, ...section3, ...section4,
  ...section5, ...section6, ...section7, ...section8,
  ...section9, ...section10, ...section11, ...section12,
  ...section13, ...section14, ...section15, ...section16,
  ...section17, ...section18, ...section19, ...section20,
  ...section21, ...section22,
];

let totalUnused = 0;

for (const def of ALL_DEFS) {
  const inputIds = def.inputs.map((i) => i.id);
  const allFormulas = Object.values(def.f).join(" ");
  
  for (const inputId of inputIds) {
    if (!allFormulas.includes(inputId)) {
      console.log(`❌ UNUSED INPUT: ${def.slug} / "${inputId}" NOT referenced in any formula`);
      console.log(`   Formulas: ${JSON.stringify(def.f)}`);
      console.log(`   Input defaults: ${def.inputs.map(i => `${i.id}=${i.d ?? "-"}`).join(", ")}`);
      totalUnused++;
    }
  }
}

console.log(`\n=== SONUÇ ===`);
console.log(`Kullanılmayan input: ${totalUnused}`);
if (totalUnused === 0) console.log("✅ Tüm input'lar formüllerde kullanılıyor.");
