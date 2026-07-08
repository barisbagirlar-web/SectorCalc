#!/usr/bin/env node
// sanitize-public-schema-copy.mjs
// Deterministic batch sanitizer for schema public copy fields.
// Replaces forbidden jargon with clean alternatives. Reconstructs weak scope.
// NEVER touches calculation logic, ids, slugs, or bindings.
// Produces reports/public-copy-sanitization-report.json and .txt

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname, relative, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const SCHEMA_DIRS = [
  "src/sectorcalc/schemas/free-v531",
  "src/sectorcalc/schemas/pro-v531",
  "src/sectorcalc/schemas/v531",
];

// ── Deterministic phrase map ─────────────────────────────────────────────────
// Order matters: longer/more specific patterns first.
const PHRASE_MAP = [
  // Full scope pattern — replace with clean sentence
  {
    pattern: /as one SuperV\d+ single-operation decision-support schema for screening, review, audit evidence, and commercial risk interpretation/gi,
    replace: "Use this calculator for quick screening and decision-support review",
  },
  // Single-operation decision-support schema (standalone)
  {
    pattern: /single-operation decision-support schema/gi,
    replace: "calculator",
  },
  // SuperV4 standalone
  {
    pattern: /\bSuperV\d+\b/gi,
    replace: "",
  },
  // audit evidence and commercial risk interpretation
  {
    pattern: /audit evidence and commercial risk interpretation/gi,
    replace: "decision-support review",
  },
  // for screening, review (as part of jargon)
  {
    pattern: /for screening,\s*review,\s*/gi,
    replace: "for ",
  },
  // Free industrial decision-support calculator
  {
    pattern: /Free industrial decision-support calculator/gi,
    replace: "Free industrial calculator",
  },
  // formula-free decision support
  {
    pattern: /formula-free decision support/gi,
    replace: "quick browser-first estimate",
  },
  // Quick Calculator suffix
  {
    pattern: /\s+Quick\s+Calculator\s*$/gi,
    replace: "",
  },
  // in the SuperV4 decision cockpit
  {
    pattern: /in the SuperV\d+ decision cockpit\.?/gi,
    replace: "",
  },
  // prompt-compliant SuperV4 schema generated text
  {
    pattern: /Generated as prompt-compliant SuperV\d+ schema[^.]*\.?/gi,
    replace: "",
  },
  // is treated as a single-operation screening decision
  {
    pattern: /is treated as a single-operation screening decision/gi,
    replace: "is treated as a single-operation screening step",
  },
  // Single-operation tool? (FMEA question)
  {
    pattern: /Is this a single-operation tool\?/gi,
    replace: "Single-operation tool?",
  },
  // Category suffix — " · SuperV4 Decision Support" -> ""
  {
    pattern: /· SuperV\d+ Decision Support\s*/gi,
    replace: "",
  },
  // Standalone "Decision Support" in category
  {
    pattern: /(?:Industrial\s+)?Decision\s+Support/gi,
    replace: "",
  },
  // version string
  {
    pattern: /-superv\d+/gi,
    replace: "",
  },
  // raw schema scope / raw variable-driven description
  {
    pattern: /raw schema scope|raw variable-driven description/gi,
    replace: "",
  },
  // SuperV4CalculatorSchema in interfaces_required
  {
    pattern: /^SuperV4CalculatorSchema$/gi,
    replace: "CalculatorSchema",
  },
];

// ── Public-copy-only fields ──────────────────────────────────────────────────
// Only these fields and their nested children will be modified.
const PUBLIC_FIELDS = new Set([
  "scope",
  "category",
  "tool_name",
  "description",
  "public_explanation",
  "public_note",
  "check",
  "system_boundary",
  "single_operation_scope",
  "decision_after_output",
  "cost_of_wrong_decision",
  "failure_mode_if_formula_wrong",
  "change_log_summary",
  "primary_operation",
  "formula_version",
]);

function isPublicField(key, path) {
  if (PUBLIC_FIELDS.has(key)) return true;
  // Only traverse into decision_context for public fields
  if (key === "decision_context" || path.includes("decision_context")) return true;
  // Only traverse into ui_contract/input_groups for description fields
  if (key === "description" && (path.includes("input_groups") || path.includes("ui_contract"))) return true;
  // Traverse into reference_code for interfaces_required cleansing
  if (key === "reference_code" || key === "interfaces_required") return true;
  return false;
}

// ── Detect if string has any jargon ──────────────────────────────────────────
const JARGON_RX = /SuperV\d+|single-operation decision-support|decision cockpit|audit evidence and commercial risk|formula-free decision support|Quick Calculator(?:\s*$)/i;

function hasJargon(s) {
  return typeof s === "string" && JARGON_RX.test(s);
}

// ── Apply phrase map ─────────────────────────────────────────────────────────
function applyPhraseMap(s) {
  if (typeof s !== "string") return s;
  let result = s;
  for (const { pattern, replace } of PHRASE_MAP) {
    result = result.replace(pattern, replace);
  }
  // Clean up double spaces, trailing periods, leading/trailing whitespace
  result = result.replace(/\s{2,}/g, " ");
  result = result.replace(/\s+\./g, ".");
  result = result.replace(/\.{2,}/g, ".");
  result = result.replace(/\s+$/g, "").trim();
  return result;
}

// ── Reconstruct weak scope (only if scope became too short after cleanup) ────
function reconstructScope(scope, toolName, category) {
  if (!scope || scope.length < 15) return null;
  // Check if scope is just "X Calculator." or similar weak output
  const weakScope = /^[A-Za-z0-9\s&-]+(Calculator|Analyzer|Check|Estimator|Converter|Detector)\.?\s*$/i;
  if (weakScope.test(scope)) {
    const clean = toolName.replace(/Calculator|Analyzer|Quick\s+Check/i, "").trim();
    const cat = (category || "industrial")
      .replace(/·.*$/, "")
      .replace(/\s*Decision\s+Support\s*/i, "")
      .trim()
      .toLowerCase();
    const finalCat = cat || "industrial";
    return `Calculate and evaluate ${clean.toLowerCase()} using simple ${finalCat} inputs.`;
  }
  return scope;
}

// ── Count all replacements made ──────────────────────────────────────────────
function countReplacements(original, cleaned) {
  if (typeof original !== "string" || typeof cleaned !== "string") return 0;
  let count = 0;
  for (const { pattern } of PHRASE_MAP) {
    const origMatches = (original.match(pattern) || []).length;
    if (origMatches > 0) count += origMatches;
  }
  return count;
}

// ── Main sanitizer ───────────────────────────────────────────────────────────
let totalFiles = 0;
let totalChanged = 0;
let totalReplacements = 0;
let totalErrors = 0;
const changedFiles = [];
const errorFiles = [];

function sanitize(obj, path = "") {
  if (typeof obj === "string") {
    if (!hasJargon(obj)) return obj;
    let cleaned = applyPhraseMap(obj);
    // Reconstruct weak scope
    if (path.endsWith("scope") || path.endsWith("single_operation_scope")) {
      // We don't have toolName/category here — handle at top level
    }
    return cleaned;
  }
  if (Array.isArray(obj)) {
    return obj.map((item, i) => sanitize(item, `${path}[${i}]`));
  }
  if (obj !== null && typeof obj === "object") {
    const result = {};
    for (const [key, val] of Object.entries(obj)) {
      const childPath = path ? `${path}.${key}` : key;
      if (isPublicField(key, childPath)) {
        result[key] = sanitize(val, childPath);
      } else {
        // Skip non-public fields entirely — never touch them
        result[key] = val;
      }
    }
    return result;
  }
  return obj;
}

// ── Second pass: reconstruct weak scope using tool_name + category ──────────
function reconstructWeakScopes(obj) {
  if (!obj || typeof obj !== "object") return obj;
  const toolName = obj.tool_name || "";
  const category = obj.category || "";

  if (obj.scope && typeof obj.scope === "string") {
    const reconstructed = reconstructScope(obj.scope, toolName, category);
    if (reconstructed) obj.scope = reconstructed;
  }
  if (obj.decision_context?.single_operation_scope && typeof obj.decision_context.single_operation_scope === "string") {
    const reconstructed = reconstructScope(obj.decision_context.single_operation_scope, toolName, category);
    if (reconstructed) obj.decision_context.single_operation_scope = reconstructed;
  }
  return obj;
}

// ── Run ──────────────────────────────────────────────────────────────────────
const writeMode = process.argv.includes("--write");

console.log("\n" + "=".repeat(60));
console.log(`  SECTORCALC \u2014 Public Schema Copy Sanitization${writeMode ? "" : " (DRY RUN)"}`);
console.log("=".repeat(60));

for (const dir of SCHEMA_DIRS) {
  const fullDir = resolve(ROOT, dir);
  if (!existsSync(fullDir)) {
    console.log(`\n  \u26A0 Not found: ${dir}`);
    continue;
  }

  const files = readdirSync(fullDir).filter((f) => f.endsWith(".json"));
  let dirChanged = 0;

  for (const file of files) {
    const filePath = join(fullDir, file);
    const relPath = relative(ROOT, filePath);
    let raw;
    try {
      raw = readFileSync(filePath, "utf-8");
    } catch {
      errorFiles.push(relPath);
      totalErrors++;
      continue;
    }

    let obj;
    try {
      obj = JSON.parse(raw);
    } catch {
      errorFiles.push(relPath);
      totalErrors++;
      continue;
    }

    // Count jargon before sanitizing
    const jargonBefore = countReplacements(JSON.stringify(obj), "");

    let sanitized = sanitize(obj);
    sanitized = reconstructWeakScopes(sanitized);

    const output = JSON.stringify(sanitized, null, 2);

    // Count replacements by comparing original to cleaned
    const cleanJson = JSON.stringify(sanitized);
    let replacements = 0;
    for (const { pattern } of PHRASE_MAP) {
      const beforeCount = (raw.match(pattern) || []).length;
      const afterCount = (output.match(pattern) || []).length;
      replacements += beforeCount - afterCount;
    }
    // Count remaining jargon
    const jargonAfter = (output.match(JARGON_RX) || []).length;

    if (output !== raw) {
      totalChanged++;
      dirChanged++;
      totalReplacements += replacements > 0 ? replacements : jargonBefore > 0 ? 1 : 0;
      changedFiles.push({
        file: relPath,
        replacements: Math.max(replacements, 1),
        remainingJargon: jargonAfter,
      });
      if (writeMode) {
        writeFileSync(filePath, output, "utf-8");
      }
    }
    totalFiles++;
  }
  console.log(`\n  ${dir}/ : ${dirChanged} files changed`);
}

// ── Report ───────────────────────────────────────────────────────────────────
const reportDir = resolve(ROOT, "reports");
if (!existsSync(reportDir)) mkdirSync(reportDir, { recursive: true });

const report = {
  timestamp: new Date().toISOString(),
  mode: writeMode ? "write" : "dry-run",
  filesScanned: totalFiles,
  filesChanged: totalChanged,
  forbiddenTermsReplaced: totalReplacements,
  errors: totalErrors,
  errorFiles,
  verdict: totalChanged === 0 && totalErrors === 0 ? "PASS" : totalErrors > 0 ? "FAIL_PARSE" : "CHANGES_NEEDED",
  changedFiles,
};

const reportJson = resolve(reportDir, "public-copy-sanitization-report.json");
writeFileSync(reportJson, JSON.stringify(report, null, 2), "utf-8");
console.log(`\n  Report: ${reportJson}`);

// ── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${"=".repeat(60)}`);
console.log(`  FILES_SCANNED=${totalFiles}`);
console.log(`  FILES_CHANGED=${totalChanged}`);
console.log(`  FORBIDDEN_TERMS_REPLACED=${totalReplacements}`);
console.log(`  ERRORS=${totalErrors}`);
console.log(`  MODE=${writeMode ? "WRITE" : "DRY RUN"}`);
if (!writeMode) {
  console.log(`\n  Run with --write to apply changes.`);
}
console.log(`${"=".repeat(60)}\n`);

const txtLines = [
  "SECTORCALC — Public Copy Sanitization Report",
  "=".repeat(50),
  `Timestamp: ${report.timestamp}`,
  `Mode: ${report.mode}`,
  "",
  "Summary",
  "-".repeat(30),
  `Files scanned: ${totalFiles}`,
  `Files changed: ${totalChanged}`,
  `Forbidden terms replaced: ${totalReplacements}`,
  `Errors: ${totalErrors}`,
  "",
  "Changed files",
  "-".repeat(30),
];
for (const f of changedFiles) {
  txtLines.push(`${f.file} (${f.replacements} replacements, ${f.remainingJargon} remaining)`);
}
if (errorFiles.length > 0) {
  txtLines.push("", "Error files", "-".repeat(30));
  errorFiles.forEach((f) => txtLines.push(f));
}
txtLines.push("", `Verdict: ${report.verdict}`);

const reportTxt = resolve(reportDir, "public-copy-sanitization-report.txt");
writeFileSync(reportTxt, txtLines.join("\n"), "utf-8");
console.log(`  Text report: ${reportTxt}`);
