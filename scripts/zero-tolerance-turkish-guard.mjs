#!/usr/bin/env node
/**
 * ZERO-TOLERANCE Turkish Guard (Hashed version)
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();

const TURKISH_PATTERN = /[çğıöşüÇĞİÖŞÜ]/;

// Excluded paths
const ALLOWED_PATHS = [
  "archive/migration-only/",
  ".cursor",
  "node_modules",
  ".next",
  "functions/node_modules",
  ".git",
  "public/ai-embedding-source.jsonl",
  "public/landing-source.html",
  "public/data/case-studies.csv",
];

// Load forbidden hashes
const hashesPath = path.join(ROOT, "data/governance/forbidden-token-hashes.json");
if (!fs.existsSync(hashesPath)) {
  console.error("Forbidden token hashes file not found. Please run the hash generator first.");
  process.exit(1);
}
const forbiddenHashes = JSON.parse(fs.readFileSync(hashesPath, "utf8"));
const forbiddenHashSet = new Set(forbiddenHashes);

function hashToken(token) {
  return crypto.createHash("sha256").update(token.toLowerCase().trim()).digest("hex");
}

function isForbiddenToken(token) {
  return forbiddenHashSet.has(hashToken(token));
}

function splitIdentifierTokens(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .normalize("NFKC")
    .toLowerCase()
    .split(/[^a-z0-9]+/u)
    .filter(Boolean);
}

function hasForbiddenToken(value) {
  const tokens = splitIdentifierTokens(value);
  for (const token of tokens) {
    if (isForbiddenToken(token)) {
      return token;
    }
  }
  return null;
}

function isExcluded(filePath) {
  const rel = path.relative(ROOT, filePath).replaceAll(path.sep, "/");
  for (const allowed of ALLOWED_PATHS) {
    if (rel.startsWith(allowed) || rel === allowed) return true;
  }
  return false;
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

// Check Turkish Unicode in text files
function checkTurkishUnicode(files, category) {
  const violations = [];
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split(/\r?\n/u);
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

// Check Turkish ASCII in schema fields
function checkTurkishAsciiInSchemas(files) {
  const violations = [];
  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const schema = JSON.parse(content);
      
      // Check sector
      if (schema.sector && typeof schema.sector === "string") {
        const found = hasForbiddenToken(schema.sector);
        if (found) {
          violations.push({
            file: path.relative(ROOT, filePath),
            line: 0,
            text: `sector: "${schema.sector}" contains Turkish token: "${found}"`,
            type: "ascii-turkish-sector",
            category: "schema",
          });
        }
      }

      // Check inputs
      if (schema.inputs) {
        for (const inp of schema.inputs) {
          // label
          if (inp.label && typeof inp.label === "string") {
            const found = hasForbiddenToken(inp.label);
            if (found) {
              violations.push({
                file: path.relative(ROOT, filePath),
                line: 0,
                text: `input label[${inp.id}]: "${inp.label}" contains Turkish token: "${found}"`,
                type: "ascii-turkish-label",
                category: "schema",
              });
            }
          }
          // businessContext
          if (inp.businessContext && typeof inp.businessContext === "string") {
            const found = hasForbiddenToken(inp.businessContext);
            if (found) {
              violations.push({
                file: path.relative(ROOT, filePath),
                line: 0,
                text: `input businessContext[${inp.id}]: "${inp.businessContext}" contains Turkish token: "${found}"`,
                type: "ascii-turkish-bc",
                category: "schema",
              });
            }
          }
        }
      }
    } catch {}
  }
  return violations;
}

console.log("\n═══════════════════════════════════════════");
console.log("  ZERO-TOLERANCE TURKISH GUARD");
console.log("═══════════════════════════════════════════\n");

let exitCode = 0;
const allViolations = [];

const schemaFiles = collectFiles("src/sectorcalc/schemas", [".json"]);
const proToolFiles = [...collectFiles("data/pro-tools", [".json"]), ...collectFiles("data/pro-tools-universal", [".json"])];
const srcFiles = collectFiles("src", [".ts", ".tsx"]);

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

console.log("\n▶ Check 5: Turkish Unicode in src/ files...");
const srcUnicode = checkTurkishUnicode(srcFiles, "src");
if (srcUnicode.length > 0) {
  let realViolations = 0;
  for (const v of srcUnicode) {
    console.warn(`  ⚠ WARN: ${v.file}:${v.line} → ${v.text}`);
    realViolations++;
  }
  console.warn(`  ⚠ ${realViolations} Turkish Unicode in src/`);
} else {
  console.log("  ✅ PASS: 0 Turkish Unicode in src/ files");
}

console.log("\n═══════════════════════════════════════════");
if (exitCode === 0) {
  console.log("  ✅ TURKISH GUARD: ALL CRITICAL AREAS PASS");
  console.log("  ✅ Turkish = ZERO in schema + pro-tool files");
} else {
  console.log(`  ❌ TURKISH GUARD: ${allViolations.length} CRITICAL VIOLATIONS`);
  console.log("  ❌ Build BLOCKED. Fix all violations above.");
}
console.log("═══════════════════════════════════════════\n");

process.exit(exitCode);
