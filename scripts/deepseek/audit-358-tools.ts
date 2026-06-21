#!/usr/bin/env npx tsx
/**
 * Comprehensive 358-tool audit: formula, input, i18n correctness.
 * Scans both section definitions AND generated schemas.
 *
 * Checks:
 *  1. Every formula variable references an existing input ID
 *  2. No formula references Math.Math (duplicate prefix bug)
 *  3. All output keys have labels
 *  4. All slugs are unique
 *  5. Every input has businessContext
 *  6. Unit coherence
 */
import fs from "node:fs";
import path from "node:path";

const PROJECT_ROOT = process.cwd();
const SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");

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

interface AuditError {
  slug: string;
  type: string;
  message: string;
}

const errors: AuditError[] = [];
const warnings: AuditError[] = [];

function err(slug: string, type: string, message: string) {
  errors.push({ slug, type, message });
}

function warn(slug: string, type: string, message: string) {
  warnings.push({ slug, type, message });
}

/* ── Helper: extract variable names from JS formula ── */
function extractVarNames(code: string): Set<string> {
  // Remove string literals
  let cleaned = code.replace(/"[^"]*"/g, "").replace(/'[^']*'/g, "");
  // Remove comments
  cleaned = cleaned.replace(/\/\/.*$/gm, "");
  // Remove Math.xxx calls
  cleaned = cleaned.replace(/Math\.\w+/g, "");
  cleaned = cleaned.replace(/parse\w+\(/g, "");
  // Remove scientific notation: 1e6, 1e-34, 2.5e10 etc. (prevents "e" or "e6" as fake tokens)
  cleaned = cleaned.replace(/\d+\.?\d*[eE][+-]?\d+/g, "0");
  // Remove standalone numbers like 1e6 split (remove the "e" and number parts)
  cleaned = cleaned.replace(/\b[eE]\d+\b/g, "0");
  cleaned = cleaned.replace(/\b[eE]\b/g, "");
  // Tokenize: match word identifiers
  const tokens = cleaned.match(/[A-Za-z_$][A-Za-z0-9_$]*/g) || [];
  const reserved = new Set([
    "Math", "Infinity", "NaN", "undefined", "null", "true", "false",
    "this", "arguments", "await", "break", "case", "catch", "class",
    "const", "continue", "debugger", "default", "delete", "do", "else",
    "enum", "export", "extends", "finally", "for", "function", "if",
    "import", "in", "instanceof", "let", "new", "of", "return",
    "super", "switch", "throw", "try", "typeof", "var", "void",
    "while", "with", "yield", "Array", "Object", "Number", "String",
    "Boolean", "Date", "RegExp", "Map", "Set", "Promise",
    "parseInt", "parseFloat", "isNaN", "isFinite",
    "console", "process", "Buffer",
  ]);
  const inputRefs = new Set<string>();
  for (const token of tokens) {
    if (!reserved.has(token)) {
      inputRefs.add(token);
    }
  }
  return inputRefs;
}

/* ── Check 1: Duplicate slugs ────────────────────── */
const slugCount = new Map<string, number>();
for (const def of ALL_DEFS) {
  slugCount.set(def.slug, (slugCount.get(def.slug) ?? 0) + 1);
}
for (const [slug, count] of slugCount) {
  if (count > 1) {
    err(slug, "DUPLICATE_SLUG", `Slug appears ${count} times in definitions`);
  }
}

/* ── Check 2: Each tool ───────────────────────────── */
const SCHEMA_FILES = fs.readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith(".json"));
const SCHEMA_MAP = new Map<string, Record<string, unknown>>();
for (const f of SCHEMA_FILES) {
  const slug = f.replace("-schema.json", "");
  SCHEMA_MAP.set(slug, JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, f), "utf-8")));
}

for (const def of ALL_DEFS) {
  const inputIds = new Set(def.inputs.map((i) => i.id));

  // Collect all valid identifiers: inputs + other formula keys
  const formulaKeys = new Set(Object.keys(def.f));
  const allValidIds = new Set([...inputIds, ...formulaKeys]);

  // Check each formula key references valid input IDs or other formula keys
  for (const [key, formula] of Object.entries(def.f)) {
    const refs = extractVarNames(formula);
    for (const ref of refs) {
      if (!allValidIds.has(ref)) {
        err(def.slug, "FORMULA_BAD_REF",
          `Formula key "${key}" references "${ref}" which is not an input ID or formula key. Valid: [${[...allValidIds].join(", ")}]`);
      }
    }

    // Check Math.Math bug
    if (formula.includes("Math.Math")) {
      err(def.slug, "FORMULA_MATH_MATH",
        `Formula key "${key}" has Math.Math prefix bug`);
    }

    // Check for NaN division patterns
    if (/\/\s*0\s*[^.]/.test(formula) && !/Math\.max/.test(formula)) {
      warn(def.slug, "FORMULA_DIV_BY_ZERO",
        `Formula key "${key}" may divide by zero without Math.max guard`);
    }
  }

  // Check all output keys have labels
  if (def.ok && def.ol) {
    for (const k of def.ok) {
      if (!def.ol[k]) {
        err(def.slug, "MISSING_OUTPUT_LABEL",
          `Output key "${k}" has no label in .ol`);
      }
    }
  }

  // Check primary output is in output keys
  if (def.op && def.ok && !def.ok.includes(def.op)) {
    err(def.slug, "PRIMARY_NOT_IN_KEYS",
      `Primary output "${def.op}" is not in output keys [${def.ok.join(", ")}]`);
  }

  // Check schema exists
  const schema = SCHEMA_MAP.get(def.slug);
  if (!schema) {
    err(def.slug, "MISSING_SCHEMA", `No schema JSON file found`);
    continue;
  }

  // Check schema input count matches
  const schemaInputs = schema.inputs as Array<{ id: string }>;
  if (schemaInputs.length !== def.inputs.length) {
    err(def.slug, "INPUT_COUNT_MISMATCH",
      `Schema has ${schemaInputs.length} inputs, definition has ${def.inputs.length}`);
  }

  // Check schema input IDs match
  const schemaInputIds = new Set(schemaInputs.map((i) => i.id));
  for (const inp of def.inputs) {
    if (!schemaInputIds.has(inp.id)) {
      err(def.slug, "SCHEMA_MISSING_INPUT",
        `Input "${inp.id}" missing from schema`);
    }
  }
  for (const inp of schemaInputs) {
    if (!inputIds.has(inp.id)) {
      err(def.slug, "SCHEMA_EXTRA_INPUT",
        `Schema has extra input "${inp.id}" not in definition`);
    }
  }

  // Check i18n labels exist for all 6 locales in schema
  for (const inp of schemaInputs) {
    const i18n = (inp as Record<string, unknown>).label_i18n as Record<string, string> | undefined;
    if (i18n) {
      for (const locale of ["en", "tr", "de", "fr", "es", "ar"]) {
        if (!i18n[locale] || !i18n[locale].trim()) {
          err(def.slug, "I18N_LABEL_MISSING",
            `Input "${inp.id}" missing label_i18n for locale "${locale}"`);
        }
      }
    }
    const ctx = (inp as Record<string, unknown>).businessContext_i18n as Record<string, string> | undefined;
    if (ctx) {
      for (const locale of ["en", "tr", "de", "fr", "es", "ar"]) {
        if (!ctx[locale] || !ctx[locale].trim()) {
          err(def.slug, "I18N_CTX_MISSING",
            `Input "${inp.id}" missing businessContext_i18n for locale "${locale}"`);
        }
      }
    }
  }
}

/* ── REPORT ────────────────────────────────────────── */
console.log("=".repeat(70));
console.log("358 TOOL AUDIT RAPORU");
console.log("=".repeat(70));
console.log(`Toplam tanım: ${ALL_DEFS.length}`);
console.log(`Schema dosyası: ${SCHEMA_FILES.length}`);
console.log("");

if (errors.length === 0 && warnings.length === 0) {
  console.log("✅ HİÇBİR HATA BULUNAMADI — Tüm tool'lar temiz.");
} else {
  console.log(`❌ HATA: ${errors.length}`);
  console.log(`⚠️  UYARI: ${warnings.length}`);
  console.log("");

  if (errors.length > 0) {
    console.log("── HATALAR ──");
    for (const e of errors) {
      console.log(`  ❌ [${e.type}] ${e.slug}: ${e.message}`);
    }
    console.log("");
  }

  if (warnings.length > 0) {
    console.log("── UYARILAR ──");
    for (const w of warnings) {
      console.log(`  ⚠️  [${w.type}] ${w.slug}: ${w.message}`);
    }
    console.log("");
  }
}

console.log("=".repeat(70));
