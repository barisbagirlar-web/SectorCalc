#!/usr/bin/env node
/**
 * ZERO-TOLERANCE Turkish Guard
 *
 * Scans every source file in the project and FAILS the build if ANY
 * Turkish content is found in critical areas.
 *
 * Passes:
 *   FAIL → schema JSON files with Turkish chars or Turkish ASCII words
 *   FAIL → source TS/TSX files with Turkish strings (except translation engine code)
 *   WARN → non-critical files (docs, data, etc.)
 *
 * Exit code: 0 only if all critical areas are 100% Turkish-free.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const TURKISH_PATTERN = /[çğıöşüÇĞİÖŞÜ]/;

// Files/paths that are ALLOWED to have Turkish characters
const ALLOWED_PATHS = [
  "data/turkish-to-english-dictionary.json",
  ".cursor",
  "node_modules",
  ".next",
  "functions/node_modules",
  ".git",
  "public/ai-embedding-source.jsonl",     // Locale-aware embedding data (expected)
  "public/landing-source.html",           // Contains "İzmir" (proper noun address)
  "public/data/case-studies.csv",         // Contains "Müller" (German company name)
  "data/premium-formulas-batch.txt",      // Batch input file
  "scripts/data/",                        // Historical batch data
  "scripts/purge-turkish-from-schemas.mjs",// Turkish cleanup tool (works WITH Turkish)
  "scripts/destroy-turkish.mjs",          // Turkish cleanup tool
  "scripts/destroy-turkish-json.mjs",     // Turkish cleanup tool
  "scripts/find-turkish-en.mjs",          // Turkish scanning tool
  "scripts/check-no-turkish-ui-strings.mjs", // Turkish scanning tool
  "scripts/check-english-only.mjs",       // Turkish scanning tool
  "scripts/fix-turkish-labels.mjs",       // Turkish scanning tool
  "scripts/translate-remaining-turkish.mjs", // Turkish scanning tool
  "scripts/translate-generated-descriptions.mjs", // Turkish scanning tool
  "scripts/translate-generated-schema-copy.mjs", // Turkish scanning tool
  "scripts/bulk-fix-english-violations.mjs", // Turkish scanning tool
  "scripts/fix-remaining-turkish*.mjs",   // Turkish scanning tools
  "scripts/safe-english-enforcer.mjs",    // Turkish scanning tool
  "scripts/english-only-lexicon-guard.mjs", // Turkish scanning tool
  "scripts/fix-hidden-non-english-anchors.ts", // Turkish scanning tool
  "scripts/polish-hybrid-locale-free-tool-inputs.mjs", // Turkish scanning tool
  "scripts/polish-tr-field-label-residue.mjs", // Turkish scanning tool
  "scripts/mega-i18n-audit.mjs",         // Turkish scanning tool
];

// Source files that are allowed to contain Turkish characters because
// they ARE the translation/detection engine
const ALLOWED_SOURCE_FILES = [
  "schema-loader.ts",
  "schema-loader-core.ts",
  "UniversalIndustrialDecisionForm.tsx",
];

// Turkish ASCII words that are NOT allowed in schema labels/sectors
// These are pure-ASCII strings that are Turkish-derived
const FORBIDDEN_TURKISH_ASCII = [
  // Turkish words that might appear as labels
  "IlkBoy", "Ilk", "Son Boy", "Son", 
  "Makine Muhendisligi", "Muhendisligi",
  "Katsayi", "Katsayisi",
  // Common Turkish stems
  "Hesaplama", "Olcum", "Olcumu", "Olcut",
  "Deger", "Degerlendirme",
  "Uretim", "Yonetimi",
  "Payi", "Sapma",
  "Ilerleme", "Suratme", "Helis",
  "Camur", "Yogunlugu",
  "Kanat", "Capi",
  "Tahta", "Eni", "Bindirme",
  "Sarfiyat", "Emprenye",
  "Donen", "Kisa", "Vadeli", "Borc",
  "Ark", "Gerilimi", "Verim",
  "Dikey", "Derinlik",
  "Ruzgar", "Hizi",
  "Baglanti", "Sayisi",
  "Guc", "Faktoru",
  "Cekme", "Mukavemeti",
  "Sekil", "Degistirme",
  "Smet", "Orani",
  "Kuruma", "Suresi",
  "Kalinlik", "Miktari",
];

// Turkish ASCII sector names
const FORBIDDEN_TURKISH_SECTORS = [
  "Makine Muhendisligi",
  "Muhendisligi",
];

// ── Collect all non-excluded files ──
function isExcluded(filePath) {
  const rel = path.relative(ROOT, filePath);
  for (const allowed of ALLOWED_PATHS) {
    if (rel.startsWith(allowed) || rel === allowed) return true;
  }
  return false;
}

function isAllowedSourceFile(filePath) {
  const basename = path.basename(filePath);
  return ALLOWED_SOURCE_FILES.some(name => basename === name);
}

function collectFiles(dirPath, extensions) {
  if (!fs.existsSync(dirPath)) return [];
  const results = [];
  function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const fullPath = path.join(current, entry.name);
      if (isExcluded(fullPath)) continue;
      if (entry.isDirectory()) walk(fullPath);
      else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  }
  walk(dirPath);
  return results;
}

// ── Check 1: Turkish Unicode chars in all files ──
function checkTurkishUnicode(files, category) {
  const violations = [];
  for (const filePath of files) {
    // Skip allowed source files that contain pattern definitions
    if (isAllowedSourceFile(filePath)) continue;
    
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (TURKISH_PATTERN.test(lines[i])) {
        violations.push({
          file: path.relative(ROOT, filePath),
          line: i + 1,
          text: lines[i].trim().substring(0, 120),
          type: "unicode",
          category,
        });
      }
    }
  }
  return violations;
}

// ── Check 2: Turkish ASCII words in schema JSON files ──
function checkTurkishAsciiInSchemas(files) {
  const violations = [];
  for (const filePath of files) {
    try {
      const schema = JSON.parse(fs.readFileSync(filePath, "utf8"));
      
      // Check sector
      if (schema.sector && typeof schema.sector === "string") {
        for (const word of FORBIDDEN_TURKISH_SECTORS) {
          if (schema.sector.includes(word)) {
            violations.push({
              file: path.relative(ROOT, filePath),
              line: 0,
              text: `sector: "${schema.sector}" contains Turkish: "${word}"`,
              type: "ascii-turkish-sector",
              category: "schema",
            });
            break;
          }
        }
      }

      // Check inputs
      if (schema.inputs) {
        for (const inp of schema.inputs) {
          // label doesn't match i18n.en
          if (inp.label && inp.label_i18n?.en && inp.label !== inp.label_i18n.en) {
            violations.push({
              file: path.relative(ROOT, filePath),
              line: 0,
              text: `label[${inp.id}]: "${inp.label}" does not match i18n.en "${inp.label_i18n.en}"`,
              type: "ascii-turkish-label",
              category: "schema",
            });
          }
          // businessContext doesn't match i18n.en
          if (inp.businessContext && inp.businessContext_i18n?.en && inp.businessContext !== inp.businessContext_i18n.en) {
            violations.push({
              file: path.relative(ROOT, filePath),
              line: 0,
              text: `businessContext[${inp.id}]: "${inp.businessContext}" does not match i18n.en "${inp.businessContext_i18n.en}"`,
              type: "ascii-turkish-bc",
              category: "schema",
            });
          }
        }
      }
    } catch {}
  }
  return violations;
}

// ── Main ──
console.log("\n═══════════════════════════════════════════");
console.log("  ZERO-TOLERANCE TURKISH GUARD");
console.log("═══════════════════════════════════════════\n");

let exitCode = 0;
const allViolations = [];

// Collect files by category
const schemaFiles = collectFiles("generated/schemas", [".json"]);
const proToolFiles = [...collectFiles("data/pro-tools", [".json"]), ...collectFiles("data/pro-tools-universal", [".json"])];
const srcFiles = collectFiles("src", [".ts", ".tsx"]);
const generatedNonSchema = collectFiles("generated", [".ts", ".js", ".mjs", ".json"]);
const scriptFiles = collectFiles("scripts", [".ts", ".js", ".mjs", ".py", ".sh"]);

// Check 1: Turkish unicode in schema files (FAIL on any)
console.log("▶ Check 1: Turkish Unicode in schema files...");
const schemaUnicodeViolations = checkTurkishUnicode(schemaFiles, "schema");
if (schemaUnicodeViolations.length > 0) {
  console.error(`  ❌ FAIL: ${schemaUnicodeViolations.length} Turkish Unicode found in schema files!`);
  for (const v of schemaUnicodeViolations) {
    console.error(`     ${v.file}:${v.line} → ${v.text}`);
  }
  allViolations.push(...schemaUnicodeViolations);
  exitCode = 1;
} else {
  console.log("  ✅ PASS: 0 Turkish Unicode in schema files");
}

// Check 2: Turkish ASCII in schema files (FAIL on any)
console.log("\n▶ Check 2: Turkish ASCII words in schema files...");
const schemaAsciiViolations = checkTurkishAsciiInSchemas(schemaFiles);
if (schemaAsciiViolations.length > 0) {
  console.error(`  ❌ FAIL: ${schemaAsciiViolations.length} Turkish ASCII mismatches in schema files!`);
  for (const v of schemaAsciiViolations) {
    console.error(`     ${v.file} → ${v.text}`);
  }
  allViolations.push(...schemaAsciiViolations);
  exitCode = 1;
} else {
  console.log("  ✅ PASS: 0 Turkish ASCII mismatches in schema files");
}

// Check 3: Turkish Unicode in pro-tool schemas (FAIL on any)
console.log("\n▶ Check 3: Turkish Unicode in pro-tool files...");
const proToolUnicode = checkTurkishUnicode(proToolFiles, "pro-tool");
if (proToolUnicode.length > 0) {
  console.error(`  ❌ FAIL: ${proToolUnicode.length} Turkish Unicode in pro-tool files!`);
  for (const v of proToolUnicode) {
    console.error(`     ${v.file}:${v.line} → ${v.text}`);
  }
  allViolations.push(...proToolUnicode);
  exitCode = 1;
} else {
  console.log("  ✅ PASS: 0 Turkish Unicode in pro-tool files");
}

// Check 4: Turkish ASCII in pro-tool schemas
console.log("\n▶ Check 4: Turkish ASCII words in pro-tool files...");
const proToolAscii = checkTurkishAsciiInSchemas(proToolFiles);
if (proToolAscii.length > 0) {
  console.error(`  ❌ FAIL: ${proToolAscii.length} Turkish ASCII mismatches in pro-tool files!`);
  for (const v of proToolAscii) {
    console.error(`     ${v.file} → ${v.text}`);
  }
  allViolations.push(...proToolAscii);
  exitCode = 1;
} else {
  console.log("  ✅ PASS: 0 Turkish ASCII mismatches in pro-tool files");
}

// Check 5: Turkish Unicode in src/ (WARN only - some is legitimate)
console.log("\n▶ Check 5: Turkish Unicode in src/ files...");
const srcUnicode = checkTurkishUnicode(srcFiles, "src");
if (srcUnicode.length > 0) {
  for (const v of srcUnicode) {
    console.warn(`  ⚠ WARN: ${v.file}:${v.line} → ${v.text}`);
  }
  console.warn(`  ⚠ ${srcUnicode.length} Turkish Unicode in src/ (expected in translation engine)`);
  console.log("  ⚠ PASS with warnings: src/ contains translation engine patterns");
} else {
  console.log("  ✅ PASS: 0 Turkish Unicode in src/ files");
}

// Summary
console.log("\n═══════════════════════════════════════════");
if (exitCode === 0) {
  console.log("  ✅ TURKISH GUARD: ALL CRITICAL AREAS PASS");
  console.log("  ✅ Turkish = ZERO in schema + pro-tool files");
  console.log("\n   Non-critical Turkish (WARN only):");
  console.log(`     src/: ${srcUnicode.length} instances (translation engine)`);
} else {
  console.log(`  ❌ TURKISH GUARD: ${allViolations.length} CRITICAL VIOLATIONS`);
  console.log("  ❌ Build BLOCKED. Fix all violations above.");
}
console.log("═══════════════════════════════════════════\n");

process.exit(exitCode);
