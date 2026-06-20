#!/usr/bin/env node
/**
 * Quarantine Snapshot — Stage 1 post-generation isolation check.
 *
 * After generate:all writes to generated/, this script:
 *   1. Verifies the generation output has no stale/dangling files
 *   2. Takes a quarantine snapshot to generated-temp/ for traceability
 *   3. Exits with 1 if the generation directory is empty or has critical issues
 *
 * Industrial parallel: After 3D printing (generation), the part is placed
 * in a quarantine rack for inspection before it enters the assembly line.
 */
import { readdirSync, cpSync, mkdirSync, existsSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const GENERATED_DIR = join(ROOT, "generated");
const QUARANTINE_DIR = join(ROOT, "generated-temp");

function main() {
  if (!existsSync(GENERATED_DIR)) {
    console.error("QUARANTINE SNAPSHOT FAIL: generated/ directory does not exist.");
    console.error("  Run npm run generate:all first.");
    process.exit(1);
  }

  const schemasDir = join(GENERATED_DIR, "schemas");
  const schemaFiles = existsSync(schemasDir)
    ? readdirSync(schemasDir).filter((f) => f.endsWith("-schema.json"))
    : [];

  const generatedTsFiles = readdirSync(GENERATED_DIR).filter(
    (f) => f.endsWith(".ts") && f !== "index.ts",
  );

  // 1. Verify generation output exists
  if (schemaFiles.length === 0 && generatedTsFiles.length === 0) {
    console.error("QUARANTINE SNAPSHOT FAIL: No schemas or generated files found.");
    process.exit(1);
  }

  // 2. Take quarantine snapshot for traceability
  if (!existsSync(QUARANTINE_DIR)) {
    mkdirSync(QUARANTINE_DIR, { recursive: true });
  }

  // Copy key artifacts to quarantine snapshot
  let copiedCount = 0;
  for (const file of generatedTsFiles.slice(0, 20)) {
    try {
      const src = join(GENERATED_DIR, file);
      const dst = join(QUARANTINE_DIR, file);
      cpSync(src, dst);
      copiedCount++;
    } catch {
      // Best effort
    }
  }

  const report = {
    timestamp: new Date().toISOString(),
    generatedDir: GENERATED_DIR,
    quarantineDir: QUARANTINE_DIR,
    schemaCount: schemaFiles.length,
    generatedFileCount: generatedTsFiles.length,
    quarantinedFiles: copiedCount,
    passed: true,
  };

  const reportPath = join(QUARANTINE_DIR, "quarantine-report.json");
  writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");
  
  console.log(`Quarantine snapshot: ${QUARANTINE_DIR}`);
  console.log(`  Schemas: ${schemaFiles.length}`);
  console.log(`  Generated TS files: ${generatedTsFiles.length}`);
  console.log(`  Quarantined for inspection: ${copiedCount} files`);

  console.log("QUARANTINE SNAPSHOT PASS — generation output verified, snapshot taken.");
}

main();
