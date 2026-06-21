#!/usr/bin/env npx tsx
/**
 * Audit: Find formulas that use hardcoded constants instead of input variable names.
 * This detects bugs like using "100e6" instead of the input variable "sigmaX".
 */
import fs from "node:fs";

/* ── Load section definitions ───────────────────── */
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

function extractVarNames(code: string): Set<string> {
  let cleaned = code.replace(/"[^"]*"/g, "").replace(/'[^']*'/g, "");
  cleaned = cleaned.replace(/\/\/.*$/gm, "");
  cleaned = cleaned.replace(/Math\.\w+/g, "");
  cleaned = cleaned.replace(/parse\w+\(/g, "");
  // Remove scientific notation numbers completely BEFORE tokenizing
  cleaned = cleaned.replace(/\b\d+\.?\d*[eE][+-]?\d+\b/g, "0");
  // Remove hex/octal/binary literals
  cleaned = cleaned.replace(/\b0[xXoObB][0-9a-fA-F]+\b/g, "0");
  // Remove standalone numbers
  cleaned = cleaned.replace(/\b\d+\.?\d*\b/g, "");
  const tokens = cleaned.match(/[A-Za-z_$][A-Za-z0-9_$]*/g) || [];
  
  const reserved = new Set([
    "Math", "Infinity", "NaN", "undefined", "null", "true", "false",
    "this", "arguments", "await", "break", "case", "catch", "class",
    "const", "continue", "debugger", "default", "delete", "do", "else",
    "enum", "export", "extends", "finally", "for", "function", "if",
    "import", "in", "instanceof", "let", "new", "of", "return",
    "super", "switch", "throw", "try", "typeof", "var", "void",
    "while", "with", "yield",
    "Array", "Object", "Number", "String", "Boolean", "Date",
    "RegExp", "Map", "Set", "Promise",
    "parseInt", "parseFloat", "isNaN", "isFinite",
    "console", "process", "Buffer",
  ]);
  
  const result = new Set<string>();
  for (const token of tokens) {
    if (!reserved.has(token)) result.add(token);
  }
  return result;
}

let hardcodedErrors = 0;
let cleanTools = 0;

for (const def of ALL_DEFS) {
  const inputIds = new Set(def.inputs.map((i) => i.id));
  
  for (const [key, formula] of Object.entries(def.f)) {
    const refs = extractVarNames(formula);
    
    // Check: does the formula reference ANY input variables?
    let referencesInput = false;
    for (const ref of refs) {
      if (inputIds.has(ref)) {
        referencesInput = true;
        break;
      }
    }
    
    // If formula doesn't reference ANY input, it's hardcoded
    if (!referencesInput && refs.size > 0) {
      // But only flag if it's not a constant/property that shouldn't need inputs
      // (e.g., unit conversions don't need inputs beyond the formula key itself)
      const allFormulaKeys = new Set(Object.keys(def.f));
      const isCrossRef = [...refs].some(r => allFormulaKeys.has(r) && r !== key);
      
      if (!isCrossRef) {
        console.log(`❌ HARDCÖDED: ${def.slug} / "${key}" = ${formula}`);
        console.log(`   Inputs: [${[...inputIds].join(", ")}]`);
        console.log(`   Refs: [${[...refs].join(", ")}]`);
        hardcodedErrors++;
      } else {
        // Cross-references other formula keys, check if those reference inputs
        // This is more complex - flag as warning
        console.log(`⚠️  CHECK: ${def.slug} / "${key}" references other formula keys only`);
      }
    }
  }
  
  // Extra check: flag any formula containing "100e6" or similar hardcoded scientific values
  for (const [key, formula] of Object.entries(def.f)) {
    const hasHardcodedConst = /[1-9]\d*[eE][+-]?\d+/.test(formula);
    if (hasHardcodedConst) {
      const inputVarInFormula = [...inputIds].some(id => formula.includes(id));
      if (!inputVarInFormula) {
        console.log(`🔴 HARDCODED CONST: ${def.slug} / "${key}" has ${formula.match(/\d+[eE]\d+/g)?.join(",")}`);
        hardcodedErrors++;
      }
    }
  }
}

console.log(`\n=== SONUÇ ===`);
console.log(`Hardcoded hata: ${hardcodedErrors}`);
console.log(`Temiz tool: ${cleanTools}`);
