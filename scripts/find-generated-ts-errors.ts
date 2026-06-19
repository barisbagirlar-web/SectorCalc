#!/usr/bin/env node
/**
 * Quick script to find ALL TypeScript type errors in generated/*.ts files.
 * Uses the TypeScript compiler API with a strict config.
 */
import * as path from "node:path";
import * as fs from "node:fs";
import ts from "typescript";

const GENERATED_DIR = path.join(process.cwd(), "generated");

function main() {
  const files = fs.readdirSync(GENERATED_DIR)
    .filter(f => f.endsWith(".ts") && f !== "index.ts")
    .sort()
    .map(f => path.join(GENERATED_DIR, f));

  console.log(`Found ${files.length} generated .ts files`);

  // Create a program from the generated files, using strict settings
  const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    resolveJsonModule: true,
    isolatedModules: true,
    esModuleInterop: true,
    allowJs: true,
    paths: {
      "@/*": ["./src/*"],
      "@generated/*": ["./generated/*"],
    },
    baseUrl: process.cwd(),
  };

  const program = ts.createProgram(files, compilerOptions);
  const diagnostics = ts.getPreEmitDiagnostics(program);

  const errors = diagnostics.filter(d => d.category === ts.DiagnosticCategory.Error);
  const warnings = diagnostics.filter(d => d.category === ts.DiagnosticCategory.Warning);

  console.log(`\nTotal diagnostics: ${diagnostics.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}\n`);

  if (errors.length === 0) {
    console.log("✅ ALL GENERATED FILES ARE TYPE-SAFE");
    process.exit(0);
  }

  // Group errors by file
  const byFile = new Map<string, ts.Diagnostic[]>();
  for (const err of errors) {
    const filePath = err.file ? err.file.fileName : "<unknown>";
    if (!byFile.has(filePath)) byFile.set(filePath, []);
    byFile.get(filePath)!.push(err);
  }

  console.log(`Files with errors: ${byFile.size}\n`);

  for (const [filePath, fileErrors] of byFile) {
    const relPath = path.relative(process.cwd(), filePath);
    console.log(`\n=== ${relPath} (${fileErrors.length} error(s)) ===`);
    for (const err of fileErrors) {
      const pos = err.file ? err.file.getLineAndCharacterOfPosition(err.start!) : null;
      const line = pos ? pos.line + 1 : 0;
      const col = pos ? pos.column + 1 : 0;
      const msg = ts.flattenDiagnosticMessageText(err.messageText, "\n");
      console.log(`  ${line}:${col} — ${msg}`);
    }
  }

  process.exit(1);
}

main();
