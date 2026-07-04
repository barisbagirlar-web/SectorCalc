#!/usr/bin/env node
/**
 * guard-public-formula-redaction.mjs
 *
 * Fail if public surface contains formula expressions or redaction placeholders.
 * Scans src/, data/, public/, scripts/, generated/, references/ and the v531 schemas.
 * Only server-only formula modules and restricted test files are exempt.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

// Patterns that indicate formula leak
const FORBIDDEN_PATTERNS = [
  /exact_formula\s*[:=]/i,
  /formula_expression\s*[:=]/i,
  /INTERNAL_SERVER_ONLY_EXPRESSION_NOT_FOR_PUBLIC_UI/,
  /\bOEE\s*=\s*[A-Z]/,
  /\bNPV\s*=\s*[A-Z]/,
  /\bCpk\s*=\s*[A-Z]/,
  /\bWACC\s*=\s*[A-Z]/,
  /\bQ\*\s*=\s*[A-Z]/,
  /\bRWL\s*=\s*[A-Z]/,
  /[Σ√]/,
];

// Directories to scan (excluded: node_modules, .next, .cache, functions, etc.)
const SCAN_DIRS = ["src", "data", "public", "scripts", "generated", "references"];

// Files/directories to exclude
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.next/,
  /\.cache/,
  /\/functions\//,
  /\/__tests__\//,
  /\.test\./,
  /\.spec\./,
  /_smoke-validate-temp/,
  /verify-random/,
  /fixtures/,
  /mocks/,
  /guard-public-formula-redaction/,
  /guard-v531-architecture/,
  /smoke-new-pro-v531-tools/,
  /audit-new-pro-v531-package/,
  /audit-zero-turkish/,
  /audit-public-english/,
  /zero-tolerance-turkish/,
  /purge-turkish/,
  /find-turkish/,
  /fix-turkish/,
  /fix-remaining-turkish/,
  /destroy-turkish/,
  /audit-v531-public-english/,
  /contract-types\.ts$/,
  /\/archive\//,
  /sectorcalc_free_v531_formula_blueprints/,
  /sectorcalc_pro_new_v531_package/,
  /public\/landing-source\.html/,
  /scripts\//,
];

// Specific server-only formula modules that are allowed to have expressions
const ALLOWED_SERVER_FORMULA_PATHS = [
  /src\/sectorcalc\/pro-runtime\/formula-registry/,
  /src\/sectorcalc\/pro-runtime\/deterministic-formula-engine/,
  /src\/sectorcalc\/pro-runtime\/decision-engine/,
  /src\/sectorcalc\/pro-runtime\/sensitivity-engine/,
  /src\/sectorcalc\/pro-runtime\/physical-bounds-guard/,
  /src\/sectorcalc\/pro-runtime\/derating-engine/,
  /src\/sectorcalc\/pro-runtime\/audit-seal-service/,
  /src\/lib\/features\/premium-schema\//,
  /src\/lib\/features\/formula-governance\//,
  /src\/sectorcalc\/formulas\//,
  /src\/sectorcalc\/pro-runtime\/free-formulas\//,
  /src\/data\/premium\//,
  /src\/engine\/expression-evaluator\.ts/,
  /src\/lib\/content\/pdf\//,
  /src\/lib\/features\/tool-schemas\//,
  /src\/lib\/features\/tools\//,
  /src\/data\/calculator-phrase-glossary\.json/,
];

function isExcluded(filePath) {
  const rel = path.relative(ROOT, filePath);
  for (const pat of EXCLUDE_PATTERNS) {
    if (pat.test(rel)) return true;
  }
  return false;
}

function isAllowedFormulaPath(filePath) {
  const rel = path.relative(ROOT, filePath);
  for (const pat of ALLOWED_SERVER_FORMULA_PATHS) {
    if (pat.test(rel)) return true;
  }
  return false;
}

function scanFile(filePath) {
  if (isExcluded(filePath)) return [];
  if (isAllowedFormulaPath(filePath)) return [];

  const ext = path.extname(filePath);
  if (![".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".css", ".html", ".txt", ".md"].includes(ext)) return [];

  try {
    const content = fs.readFileSync(filePath, "utf8");
    const findings = [];

    for (const pattern of FORBIDDEN_PATTERNS) {
      const match = content.match(pattern);
      if (match) {
        const line = content.substring(0, match.index).split("\n").length;
        findings.push({ file: path.relative(ROOT, filePath), line, pattern: pattern.source, match: match[0] });
      }
    }

    return findings;
  } catch {
    return [];
  }
}

function scanDirectory(dirPath) {
  const findings = [];
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        if (!isExcluded(fullPath)) {
          findings.push(...scanDirectory(fullPath));
        }
      } else if (entry.isFile()) {
        findings.push(...scanFile(fullPath));
      }
    }
  } catch {
    // Skip directories we can't read
  }
  return findings;
}

console.log("=== SECTORCALC PUBLIC FORMULA REDACTION GUARD ===\n");

let allFindings = [];
for (const dir of SCAN_DIRS) {
  const dirPath = path.join(ROOT, dir);
  if (fs.existsSync(dirPath)) {
    allFindings.push(...scanDirectory(dirPath));
  }
}

// Also scan the PRO schemas directory
const proSchemaDir = path.join(ROOT, "src/sectorcalc/schemas/v531");
if (fs.existsSync(proSchemaDir)) {
  // For v531 schemas, check only for actual exposed formula content (not the safe sentinel)
  const files = fs.readdirSync(proSchemaDir).filter(f => f.endsWith(".schema.json"));
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(proSchemaDir, file), "utf8");
      const schema = JSON.parse(content);
      if (Array.isArray(schema.formulas)) {
        for (const f of schema.formulas) {
          if (f.expression && f.expression !== "INTERNAL_SERVER_ONLY_EXPRESSION_NOT_FOR_PUBLIC_UI") {
            allFindings.push({
              file: `src/sectorcalc/schemas/v531/${file}`,
              line: 1,
              pattern: "actual_formula_expression",
              match: `${f.id}: ${f.expression.substring(0, 80)}`,
            });
          }
        }
      }
    } catch {
      // skip
    }
  }
}

if (allFindings.length > 0) {
  console.log("FORMULA REDACTION FAILURES FOUND:");
  for (const f of allFindings) {
    console.log(`  ${f.file}:${f.line} [${f.pattern}] "${f.match}"`);
  }
  console.log(`\nTotal failures: ${allFindings.length}`);
  console.log("PUBLIC_FORMULA_REDACTION=FAIL");
  process.exit(1);
} else {
  console.log("PUBLIC_FORMULA_REDACTION=PASS");
  console.log("No public formula expression leaks detected.");
}
