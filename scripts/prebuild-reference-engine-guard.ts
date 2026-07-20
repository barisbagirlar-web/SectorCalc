#!/usr/bin/env node
/**
 * Pre-build Reference Engine Rule Guard
 *
 * Scans codebase for violations of the Global Reference Engine Integration rule:
 *   05-global-reference-engine.mdc
 *
 * Detects:
 *   1. Inline reference arrays in JSX/TSX (hardcoded data[])
 *   2. Local/national standards mentions (TS, GOST, JIS, DIN, BS)
 *   3. Non-English strings in code (Turkish characters in source)
 *   4. Manual unit conversion inside components
 *   5. API calls or DB queries for reference data
 *
 * Auto-fix: Reports all violations with file:line. Hard violations exit 1.
 *
 * Usage:
 *   npx tsx scripts/prebuild-reference-engine-guard.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = process.cwd();

// Only scan Cursor's own territory (per 03-ai-territory.mdc) + references/
// to avoid flagging pre-existing Turkish UI in components/admin (Google Antigravity territory).
const CURSOR_TERRITORY = [
  "src/lib",
  "src/config",
  "src/data",
  "src/app/api",
  "src/generated",
  "scripts",
  "references",
];

const SKIP_DIRS = new Set([
  path.join(ROOT, "node_modules"),
  path.join(ROOT, ".next"),
  path.join(ROOT, ".cursor"),
  path.join(ROOT, "generated"),
  path.join(ROOT, "functions/node_modules"),
]);

const SKIP_FILES = new Set([
  "src/lib/core/schema/schema-loader.ts",
  "src/lib/core/schema/schema-registry.ts",
  // DIN/ISO bridge intentional — German engineering trust signal in entity graph
  "src/lib/infrastructure/seo/entity-graph.ts",
]);

interface Violation {
  file: string;
  line: number;
  column: number;
  message: string;
  severity: "error" | "warn";
  autoFixable: boolean;
}

// Known local/national standards (forbidden)
const LOCAL_STANDARD_RE =
  /\b(?:TS\s+\d+|GOST\s+\d+|JIS\s+[A-Z]\s*\d+|DIN\s+\d+|BS\s+\d+|NF\s+[A-Z]|GB\s+\d+|SIS\s+\d+|UNI\s+\d+|NEN\s+\d+|SS\s+\d+)\b/i;

// Turkish/Non-English character detection in string literals
// Matches Turkish specific chars in quoted strings
const TR_CHARS_IN_STR_RE = new RegExp('["\'`][^"\'`]*(?:[\\u015F\\u015E\\u0131\\u0130\\u011F\\u011E\\u00FC\\u00DC\\u00F6\\u00D6\\u00E7\\u00C7])[^"\'`]*["\'`]');

// Inline reference array detection in TSX/JSX — finds const data = [...] patterns
const INLINE_REF_ARRAY_RE =
  /(?:const|let|var)\s+\w*(?:data|ref|reference|material|standard|property|value)s?\s*[:=]\s*\[[\s\S]{0,200}?\{[^}]*?(?:value|label|name|key)\s*:/;

// Manual unit conversion inside components
const MANUAL_UNIT_CONV_RE =
  /(?:\.\s*\/\s*|[\*\/]\s*)\d*\.?\d+\s*(?:25\.4|0\.03937|0\.453592|2\.20462|1\.60934|0\.621371|3\.28084|0\.3048)\s*[\)\*\/\s,;]/;

// API/DB reference fetch patterns
const API_REF_FETCH_RE =
  /(?:fetch|axios|request)\([^)]*(?:reference|standard|material|property)\s*[=/]/i;

function findFiles(dir: string): string[] {
  const results: string[] = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(fullPath) && !entry.name.startsWith(".")) {
          results.push(...findFiles(fullPath));
        }
      } else if (
        entry.isFile() &&
        (entry.name.endsWith(".ts") ||
          entry.name.endsWith(".tsx") ||
          entry.name.endsWith(".js") ||
          entry.name.endsWith(".jsx"))
      ) {
        results.push(fullPath);
      }
    }
  } catch {
    // skip inaccessible
  }
  return results;
}

function scanFile(filePath: string): Violation[] {
  const violations: Violation[] = [];
  const relativePath = path.relative(ROOT, filePath);
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Check for local standards
    const localMatch = line.match(LOCAL_STANDARD_RE);
    if (localMatch) {
      const col = (localMatch.index ?? 0) + 1;
      violations.push({
        file: relativePath,
        line: lineNum,
        column: col,
        message: `Local/national standard detected: "${localMatch[0]}". Use only ISO, ASTM, EN, ACI, AISC, ASME, IEC, IEEE.`,
        severity: "warn",
        autoFixable: false,
      });
    }

    // Check for Turkish characters in string literals (ERROR — English only policy)
    const trMatch = line.match(TR_CHARS_IN_STR_RE);
    if (trMatch && !relativePath.includes("prebuild-reference-engine-guard")) {
      const col = (trMatch.index ?? 0) + 1;
      violations.push({
        file: relativePath,
        line: lineNum,
        column: col,
        message: `Non-English characters in string: "${trMatch[0].slice(0, 60)}". English only policy.`,
        severity: "error",
        autoFixable: false,
      });
    }

    // Check for inline reference arrays
    const inlineMatch = line.match(INLINE_REF_ARRAY_RE);
    if (inlineMatch) {
      const col = (inlineMatch.index ?? 0) + 1;
      violations.push({
        file: relativePath,
        line: lineNum,
        column: col,
        message:
          "Inline reference array detected. Move to references/ YAML and use GlobalReferenceInput binding.",
        severity: "warn",
        autoFixable: false,
      });
    }

    // Check for manual unit conversion
    const convMatch = line.match(MANUAL_UNIT_CONV_RE);
    if (convMatch && !relativePath.includes("lib/units")) {
      const col = (convMatch.index ?? 0) + 1;
      violations.push({
        file: relativePath,
        line: lineNum,
        column: col,
        message: `Manual unit conversion constant detected. Use centralized unit utility.`,
        severity: "warn",
        autoFixable: false,
      });
    }

    // Check for API reference fetches
    const apiMatch = line.match(API_REF_FETCH_RE);
    if (apiMatch) {
      const col = (apiMatch.index ?? 0) + 1;
      violations.push({
        file: relativePath,
        line: lineNum,
        column: col,
        message: `API/DB call for reference data detected. References must be build-time validated.`,
        severity: "warn",
        autoFixable: false,
      });
    }
  }

  return violations;
}

function main(): void {
  console.log("🔍 Scanning for Reference Engine Rule Violations...\n");

  const allViolations: Violation[] = [];
  let fileCount = 0;

  // Only scan Cursor's territory — skip components/, admin/, messages/ etc.
  for (const srcDir of CURSOR_TERRITORY) {
    const dirPath = path.join(ROOT, srcDir);
    if (!fs.existsSync(dirPath)) continue;
    const files = findFiles(dirPath);
    for (const file of files) {
      const relativePath = path.relative(ROOT, file);
      if (SKIP_FILES.has(relativePath)) continue;
      fileCount++;
      const violations = scanFile(file);
      allViolations.push(...violations);
    }
  }

  const errors = allViolations.filter((v) => v.severity === "error");
  const warnings = allViolations.filter((v) => v.severity === "warn");

  if (allViolations.length === 0) {
    console.log(
      `✅ Scanned ${fileCount} files — 0 violations. Reference Engine rule is clean.\n`,
    );
    process.exit(0);
  }

  // Group by file
  const grouped = new Map<string, Violation[]>();
  for (const v of allViolations) {
    if (!grouped.has(v.file)) grouped.set(v.file, []);
    grouped.get(v.file)!.push(v);
  }

  console.log(
    `⚠  Found ${errors.length} error(s) + ${warnings.length} warning(s) across ${grouped.size} file(s):\n`,
  );

  for (const [file, fileViolations] of grouped) {
    console.log(`  📄 ${file}`);
    for (const v of fileViolations) {
      const tag = v.severity === "error" ? "❌" : "⚠️";
      console.log(`    ${tag} Ln ${v.line}:${v.column} — ${v.message}`);
    }
    console.log("");
  }

  if (errors.length > 0) {
    console.error(
      "❌ Reference Engine violations found. Fix errors before proceeding.\n" +
        "   Run: npm run prebuild\n",
    );
    process.exit(1);
  }

  console.log(
    "⚠️  Warnings found but no errors. Review suggested fixes.\n",
  );
  process.exit(0);
}

main();
