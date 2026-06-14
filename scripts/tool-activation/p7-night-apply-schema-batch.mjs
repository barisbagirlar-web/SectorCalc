#!/usr/bin/env node
/**
 * P7 — Generate premium schemas from DeepSeek gate-pass responses, then apply backing.
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvLocal } from "../ai/load-env-local.mjs";
import { ROOT } from "./lib/activation-paths.mjs";
import {
  applyFormulaBatch,
  loadSchemaRegistryAliases,
  resolveSchemaForSlug,
} from "./lib/p6b-formula-factory-lib.mjs";
import { loadFactoryInputs } from "./lib/premium-backfill-factory-lib.mjs";
import {
  buildSchemaDraftFromP7Response,
  removeSchemaRegistryEntry,
  schemaFileExists,
  wireSchemaRegistryEntry,
  writeSchemaFile,
} from "./lib/p7-night-schema-from-response-lib.mjs";
import {
  loadP7AuditOrThrow,
  revertFailedToolFiles,
  writeP7Outputs,
} from "./lib/p7-night-factory-lib.mjs";
import { readToolIndex } from "./lib/activation-scan-lib.mjs";

const COMMITTED_BACKING = new Set([
  "energy-efficiency-report",
  "renovation-budget-optimizer",
  "trip-budget-optimizer",
]);

function slugToTitle(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function removeGeneratedArtifacts(slug, draft) {
  const paths = [
    path.join(ROOT, `src/lib/premium-schema/schemas/${slug}.ts`),
    path.join(ROOT, `src/lib/premium-schema/calculators/${slug}.ts`),
    path.join(ROOT, `src/lib/premium-schema/calculators/${slug}-validation.ts`),
    path.join(ROOT, `src/lib/premium-schema/__tests__/${slug}.test.ts`),
    path.join(ROOT, `src/lib/formula-governance/contracts/${slug}-critical.ts`),
  ];
  for (const filePath of paths) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  if (draft) {
    removeSchemaRegistryEntry(draft);
  }
}

function main() {
  loadEnvLocal();
  console.log("=== apply:p7-night-schema ===\n");

  const audit = loadP7AuditOrThrow();
  const index = readToolIndex();
  const toolBySlug = new Map(index.tools.map((tool) => [tool.slug, tool]));
  const { schemas: schemaIndex } = loadFactoryInputs();
  const aliases = loadSchemaRegistryAliases();

  const candidates = (audit.deepseekResults ?? []).filter((row) => {
    if (!row.patchEligible || !row.response) return false;
    if (COMMITTED_BACKING.has(row.slug)) return false;
    const { schema } = resolveSchemaForSlug(row.slug, schemaIndex, aliases);
    if (schema?.formulaPipeline?.length > 0) return false;
    return true;
  });

  console.log(`Schema generation targets: ${candidates.length}`);

  const schemaGenerated = [];
  const schemaFailed = [];
  const generated = [];
  const passed = [];
  const failed = [];
  const reverted = [];

  for (const row of candidates) {
    const slug = row.slug;
    let draft = null;
    try {
      const tool = toolBySlug.get(slug) ?? { slug, title: slugToTitle(slug), category: "cost" };
      draft = buildSchemaDraftFromP7Response(row.response, tool);
      if (!schemaFileExists(slug)) {
        writeSchemaFile(draft);
      }
      wireSchemaRegistryEntry(draft);
      schemaGenerated.push({ slug, mode: "generated" });
      process.stdout.write(`  schema ${slug}: OK\n`);

      const report = applyFormulaBatch([slug]);
      if (report.failed.length > 0 || report.generated.length === 0) {
        throw new Error(report.failed[0]?.reason ?? report.skipped[0]?.reason ?? "apply_failed");
      }
      generated.push(slug);
      passed.push(slug);
      process.stdout.write(`  backing ${slug}: PASS\n`);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      if (draft) {
        revertFailedToolFiles([slug]);
        removeGeneratedArtifacts(slug, draft);
        reverted.push(slug);
      } else {
        schemaFailed.push({ slug, reason });
      }
      failed.push({ slug, reason });
      process.stdout.write(`  backing ${slug}: FAIL_REVERTED\n`);
    }
  }

  const applyReport = {
    generatedAt: new Date().toISOString(),
    requested: candidates.map((row) => row.slug),
    generated,
    passed,
    failed,
    reverted,
    skipped: [],
    schemaGenerated,
    schemaFailed,
  };

  writeP7Outputs(audit, applyReport, null);

  console.log(`\nschemaGenerated: ${schemaGenerated.length}`);
  console.log(`schemaFailed: ${schemaFailed.length}`);
  console.log(`backingGenerated: ${generated.length}`);
  console.log(`backingPassed: ${passed.length}`);
  console.log(`failedAndReverted: ${reverted.length}`);

  if (failed.length > 0) {
    console.error("\napply:p7-night-schema FAIL");
    process.exit(1);
  }

  console.log("\napply:p7-night-schema PASS");
}

try {
  main();
} catch (error) {
  console.error("apply:p7-night-schema FAIL");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
