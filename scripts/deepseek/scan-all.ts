#!/usr/bin/env node
/**
 * Full pipeline: discover → DeepSeek scan → TypeScript generation → report.
 *
 * Usage:
 *   npm run scan:all
 *   npm run scan:all -- --limit 5
 *   npm run scan:all -- --skip-existing
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateFromSchemaFile } from "./generate-from-schema";
import { parseCliOptions, scanTools } from "./scan-tools";
import { PROJECT_ROOT } from "./load-env";

async function main(): Promise<void> {
  const options = parseCliOptions(process.argv.slice(2));
  const startedAt = Date.now();

  console.log("=== SectorCalc DeepSeek scan:all ===");
  console.log(`Rate limit: 5 req/s | Schemas: generated/schemas/ | Output: generated/*.ts`);
  console.log("");

  const records = await scanTools(options);
  if (options.dryRun || records.length === 0) {
    return;
  }

  const generationResults: Array<{ slug: string; ok: boolean; outFile?: string; error?: string }> =
    [];

  for (const record of records) {
    if (!record.ok || !record.schemaPath) {
      generationResults.push({
        slug: record.slug,
        ok: false,
        error: record.error ?? "Scan failed — no schema file.",
      });
      continue;
    }

    try {
      const baseName = path.basename(record.schemaPath).replace(/-schema\.json$/i, "").replace(/\.json$/i, "");
      const outFile = path.join(PROJECT_ROOT, "generated", `${baseName}.ts`);
      generateFromSchemaFile(record.schemaPath, outFile);
      generationResults.push({ slug: record.slug, ok: true, outFile });
      console.log(`Generated ${outFile}`);
    } catch (error) {
      generationResults.push({
        slug: record.slug,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
      console.warn(`Generate FAIL (${record.slug}): ${generationResults.at(-1)?.error}`);
    }
  }

  const scanSucceeded = records.filter((record) => record.ok).length;
  const scanFailed = records.length - scanSucceeded;
  const generated = generationResults.filter((result) => result.ok).length;
  const generateFailed = generationResults.length - generated;
  const elapsedMinutes = ((Date.now() - startedAt) / 60_000).toFixed(1);

  const reportPath = path.join(PROJECT_ROOT, "generated", "scan-all-report.json");
  fs.writeFileSync(
    reportPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        elapsedMinutes: Number(elapsedMinutes),
        scan: { total: records.length, succeeded: scanSucceeded, failed: scanFailed },
        generate: {
          total: generationResults.length,
          succeeded: generated,
          failed: generateFailed,
        },
        tools: records.map((record) => ({
          slug: record.slug,
          scanOk: record.ok,
          schemaPath: record.schemaPath ?? null,
          generateOk:
            generationResults.find((result) => result.slug === record.slug)?.ok ?? false,
          error:
            record.error ??
            generationResults.find((result) => result.slug === record.slug)?.error ??
            null,
        })),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log("");
  console.log("=== Final report ===");
  console.log(`Scan:     ${scanSucceeded}/${records.length} succeeded (${scanFailed} failed)`);
  console.log(`Generate: ${generated}/${generationResults.length} succeeded (${generateFailed} failed)`);
  console.log(`Elapsed:  ${elapsedMinutes} min`);
  console.log(`Report:   ${reportPath}`);

  if (scanFailed > 0 || generateFailed > 0) {
    process.exitCode = 1;
  }
}

const isDirectRun =
  Boolean(process.argv[1]) &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
