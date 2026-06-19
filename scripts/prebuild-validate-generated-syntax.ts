#!/usr/bin/env node
/**
 * Pre-build syntax validation for all generated tool files.
 *
 * Purpose:
 *   Catches syntax errors in generated/*.ts files before webpack/SWC
 *   tries to compile them. SWC/webpack error messages are often opaque
 *   ("Syntax Error" without a line number), making debugging painful.
 *   This script uses the TypeScript parser directly — fast, accurate,
 *   and gives file + line + column for every error.
 *
 * Usage:
 *   npx tsx scripts/prebuild-validate-generated-syntax.ts
 *
 * Exit codes:
 *   0  — all files parse successfully
 *   1  — at least one file has a syntax error (list printed to stderr)
 *
 * Performance:
 *   ~1–2 seconds for 3,272 files on M-series Mac.
 *   TypeScript's createSourceFile is a pure parse — no emit, no type-check.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import typescript from "typescript";

const GENERATED_DIR = path.join(process.cwd(), "generated");

interface FileError {
  file: string;
  line: number;
  column: number;
  message: string;
}

function main(): void {
  if (!fs.existsSync(GENERATED_DIR)) {
    console.log("generated/ directory not found — skipping syntax validation.");
    process.exit(0);
  }

  const toolFiles = fs
    .readdirSync(GENERATED_DIR)
    .filter(
      (f) => f.endsWith(".ts") && f !== "index.ts" && f !== "formula-health-report.json",
    )
    .sort();

  if (toolFiles.length === 0) {
    console.log("No generated tool files found — skipping syntax validation.");
    process.exit(0);
  }

  console.log(`🔍 Pre-build syntax validation: ${toolFiles.length} generated files\n`);

  const errors: FileError[] = [];

  for (const file of toolFiles) {
    const filePath = path.join(GENERATED_DIR, file);
    const content = fs.readFileSync(filePath, "utf8");

    const sourceFile = typescript.createSourceFile(
      file,
      content,
      typescript.ScriptTarget.Latest,
      true, // setParentNodes
      typescript.ScriptKind.TS,
    );

    const diagnostics = sourceFile.parseDiagnostics;

    for (const diag of diagnostics) {
      if (diag.category !== typescript.DiagnosticCategory.Error) {
        continue;
      }

      let line = 0;
      let column = 0;
      if (diag.file && diag.start != null) {
        const lc = diag.file.getLineAndCharacterOfPosition(diag.start);
        line = lc.line + 1;
        column = lc.column + 1;
      }

      errors.push({
        file,
        line,
        column,
        message: typescript.flattenDiagnosticMessageText(diag.messageText, "\n"),
      });
    }
  }

  if (errors.length > 0) {
    console.error(`❌ SYNTAX ERROR: ${errors.length} error(s) in ${new Set(errors.map((e) => e.file)).size} file(s):\n`);

    for (const err of errors) {
      console.error(`  ${err.file}:${err.line}:${err.column} — ${err.message}`);
    }

    console.error(
      `\n⚠  Fix the above file(s) before building. Re-run: npx tsx scripts/deepseek/generate-from-schema-all.ts`,
    );
    process.exit(1);
  }

  console.log(`✅ All ${toolFiles.length} generated files pass syntax validation.`);
}

main();
