#!/usr/bin/env node
// guard-public-copy-no-schema-jargon.mjs
// Scans all public-facing source files + schema JSON files for forbidden
// SuperV4 / raw schema jargon that must never reach users, Google snippets,
// or catalog cards.
// - TSX/TS files: checks string literals and JSX content (not type annotations)
// - JSON files: checks only public-facing text fields (not technical refs)
// Excludes API routes, generated code, test fixtures.

import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname, relative, join, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ── Forbidden public-facing jargon ───────────────────────────────────────────
const FORBIDDEN_PHRASES = [
  { phrase: "single-operation decision-support schema", severity: "FAIL" },
  { phrase: "schema for screening", severity: "FAIL" },
  { phrase: "audit evidence and commercial risk interpretation", severity: "FAIL" },
  { phrase: "Free industrial decision-support calculator", severity: "FAIL" },
  { phrase: "formula-free decision support", severity: "FAIL" },
  { phrase: "raw schema scope", severity: "FAIL" },
  { phrase: "raw variable-driven description", severity: "FAIL" },
];

const SUPERV4_RX = /SuperV\d+/;

// ── Scan targets ─────────────────────────────────────────────────────────────
const ALL_SCAN_DIRS = [
  "src",
  "public",
  "generated",
  "data",
  "references",
  "messages",
];

const EXCLUDE_PATTERNS = [
  "node_modules", ".next", ".git", "archive", "backup", "quarantine", "coverage",
  "__tests__", ".firebase", "pro_tools_baris_",
];

const ALLOWED_PATHS = [
  "form-render-helpers.ts",
  "public-tool-copy-adapter.ts",
  "guard-public-copy-no-schema-jargon.mjs",
];

// ── For JSON schema files: only scan known public text fields ────────────────
const PUBLIC_JSON_FIELDS = new Set([
  "scope", "category", "tool_name", "description", "public_explanation",
  "public_note", "check", "system_boundary", "single_operation_scope",
  "decision_after_output", "cost_of_wrong_decision", "failure_mode_if_formula_wrong",
  "change_log_summary", "primary_operation", "formula_version",
]);

// Always skip these field names in JSON (technical references only)
const TECHNICAL_FIELD_NAMES = new Set([
  "interfaces_required", "checker_trace", "golden_hash", "audit_seal",
]);

// ── Helpers ──────────────────────────────────────────────────────────────────
let failures = 0;
let totalFiles = 0;
let totalMatches = 0;

function fail(msg) { console.error("  \u274C FAIL: " + msg); failures++; }
function warn(msg) { console.log("  \u26A0 WARN: " + msg); }
function pass(msg) { console.log("  \u2705 PASS: " + msg); }

function shouldExclude(filePath) {
  const rel = relative(ROOT, filePath);
  if (EXCLUDE_PATTERNS.some(p => rel.includes(p))) return true;
  if (ALLOWED_PATHS.some(p => rel.endsWith(p))) return true;
  return false;
}

function getFiles(dir, exts) {
  const results = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!EXCLUDE_PATTERNS.some(p => fullPath.includes(p)))
          results.push(...getFiles(fullPath, exts));
      } else if (entry.isFile()) {
        const ext = extname(entry.name);
        if (exts.includes(ext)) results.push(fullPath);
      }
    }
  } catch { /* skip */ }
  return results;
}

// ── JSON schema scanner ──────────────────────────────────────────────────────
function scanJsonForJargon(obj, path, relPath) {
  if (typeof obj === "string") {
    const leaf = (path.split(".").pop() || "").replace(/\[\d+\]/g, "");
    // Skip technical-only fields
    if (TECHNICAL_FIELD_NAMES.has(leaf)) return;
    // Only check if field is a known public field or inside decision_context
    const isPublic = PUBLIC_JSON_FIELDS.has(leaf)
      || path.includes("decision_context")
      || (leaf === "description" && (path.includes("input_groups") || path.includes("ui_contract")));
    if (!isPublic) return;

    const lower = obj.toLowerCase();
    for (const entry of FORBIDDEN_PHRASES) {
      if (lower.includes(entry.phrase.toLowerCase())) {
        totalMatches++;
        const snippet = obj.substring(0, 100);
        fail(`${relPath} | ${path} \u2014 "${entry.phrase}"`);
      }
    }
    if (SUPERV4_RX.test(obj)) {
      totalMatches++;
      const snippet = obj.substring(0, 100);
      fail(`${relPath} | ${path} \u2014 "SuperV4" in public field: "${snippet}"`);
    }
    return;
  }
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++)
      scanJsonForJargon(obj[i], `${path}[${i}]`, relPath);
    return;
  }
  if (obj !== null && typeof obj === "object") {
    for (const [key, val] of Object.entries(obj)) {
      scanJsonForJargon(val, path ? `${path}.${key}` : key, relPath);
    }
  }
}

// ── TSX/TS string literal scanner ────────────────────────────────────────────
function hasPhraseInStringLiteral(line, phrase) {
  if (line.trimStart().startsWith("import ")) return false;
  const lower = line.toLowerCase();
  const lowerPhrase = phrase.toLowerCase();
  const idx = lower.indexOf(lowerPhrase);
  if (idx === -1) return false;
  const before = line.substring(0, idx);
  const after = line.substring(idx + phrase.length);
  if (before.lastIndexOf('"') !== -1 && after.indexOf('"') !== -1) return true;
  if (before.lastIndexOf("'") !== -1 && after.indexOf("'") !== -1) return true;
  if (before.lastIndexOf("`") !== -1 && after.indexOf("`") !== -1) return true;
  return false;
}

function hasPhraseInJsxContent(line, phrase) {
  const lower = line.toLowerCase();
  const lowerPhrase = phrase.toLowerCase();
  const idx = lower.indexOf(lowerPhrase);
  if (idx === -1) return false;
  const before = line.substring(0, idx);
  const after = line.substring(idx + phrase.length);
  return before.includes(">") && after.includes("<");
}

// ── Main ─────────────────────────────────────────────────────────────────────
console.log("\n" + "\u2550".repeat(60));
console.log("  SECTORCALC \u2014 PUBLIC COPY: NO SCHEMA JARGON");
console.log("\u2550".repeat(60) + "\n");

const SCHEMA_JSON_DIRS = [
  "src/sectorcalc/schemas/free-v531",
  "src/sectorcalc/schemas/pro-v531",
  "src/sectorcalc/schemas/v531",
];

// Scan all directories with appropriate check per file type
for (const scanDir of ALL_SCAN_DIRS) {
  const fullDir = resolve(ROOT, scanDir);
  if (!existsSync(fullDir)) { warn("Not found: " + scanDir); continue; }

  const files = getFiles(fullDir, [".ts", ".tsx", ".js", ".jsx", ".json", ".yaml", ".yml", ".txt", ".md", ".html"]);

  for (const fp of files) {
    if (shouldExclude(fp)) continue;
    const relPath = relative(ROOT, fp);

    // Check if this is a schema JSON file — use public-field-only scanner
    const isSchemaJson = SCHEMA_JSON_DIRS.some(d => relPath.startsWith(d))
      && fp.endsWith(".json")
      && !fp.includes("registry");

    if (isSchemaJson) {
      let obj;
      try {
        obj = JSON.parse(readFileSync(fp, "utf-8"));
      } catch { continue; }
      totalFiles++;
      scanJsonForJargon(obj, "", relPath);
      continue;
    }

    // For TS/TSX files — use string-literal-aware scanner
    if (fp.endsWith(".ts") || fp.endsWith(".tsx") || fp.endsWith(".js") || fp.endsWith(".jsx")) {
      const lines = readFileSync(fp, "utf-8").split("\n");
      totalFiles++;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trimStart().startsWith("import ")) continue;
        const trimmed = line.trim();
        if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) continue;
        if (trimmed.includes("FORBIDDEN") || trimmed.includes("forbidden")) continue;

        // Check SuperV4 in strings
        const sv4Match = /["'`][^"'`]*SuperV\d{1,2}[^"'`]*["'`]/g.exec(line);
        if (sv4Match) {
          totalMatches++;
          fail(`${relPath}:${i+1} \u2014 "SuperV4" in string: "${trimmed.substring(0,100)}"`);
        }

        // Check other forbidden phrases
        for (const entry of FORBIDDEN_PHRASES) {
          if (hasPhraseInStringLiteral(line, entry.phrase) || hasPhraseInJsxContent(line, entry.phrase)) {
            totalMatches++;
            fail(`${relPath}:${i+1} \u2014 "${entry.phrase}"`);
          }
        }
      }
      continue;
    }

    // For all other file types (YAML, txt, md, etc.) — plain text scan
    const content = readFileSync(fp, "utf-8");
    totalFiles++;

    for (const entry of FORBIDDEN_PHRASES) {
      if (content.toLowerCase().includes(entry.phrase.toLowerCase())) {
        totalMatches++;
        fail(`${relPath} \u2014 "${entry.phrase}" found in file`);
      }
    }
    // Check SuperV4 in text content (only if not in TypeScript annotations)
    const textSuperV4Matches = content.match(/["'`]?SuperV\d{1,2}["'`]?/g);
    if (textSuperV4Matches) {
      for (const m of textSuperV4Matches) {
        // Skip if this is a TypeScript type annotation (e.g. SuperV4Schema, SuperV4Input)
        if (m.includes("Schema") || m.includes("Input") || m.includes("Interface") || m.includes("Calculator")) continue;
        totalMatches++;
        fail(`${relPath} \u2014 "SuperV4" in text: "${m}"`);
      }
    }
  }
}

if (totalMatches === 0) {
  pass(`Scanned ${totalFiles} files \u2014 zero forbidden jargon in public-facing text`);
}

console.log(`\nScanned: ${totalFiles} files`);
console.log(`Matches: ${totalMatches}`);

const verdict = failures === 0 ? "PASS" : "FAIL";
console.log(`\nPUBLIC_COPY_NO_SCHEMA_JARGON=${verdict}`);
console.log(`BLOCKERS=${failures > 0 ? failures + " occurrence(s) of forbidden jargon" : "NONE"}`);

process.exit(failures > 0 ? 1 : 0);
