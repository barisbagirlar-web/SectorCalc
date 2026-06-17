#!/usr/bin/env npx tsx
/**
 * Katalog vs generated/schemas gap raporu.
 *
 * Usage: npm run audit:missing-schemas
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCalculatorListEntries } from "./parse-calculator-list";
import { PROJECT_ROOT } from "./load-env";
import {
  collectMissingCatalogTools,
  collectScanFailedTools,
  loadAllFailed,
  schemaExists,
} from "./resume-failed-batch";

const LIST_FILE = path.join(PROJECT_ROOT, "input_calculators.txt");
const REPORT_PATH = path.join(PROJECT_ROOT, "generated", "missing-schemas-report.json");

function main(): void {
  const catalog = parseCalculatorListEntries(LIST_FILE);
  const missing = collectMissingCatalogTools();
  const missingSet = new Set(missing);
  const failed = new Set(loadAllFailed());
  const completed = new Set<string>();

  for (const file of fs.readdirSync(PROJECT_ROOT)) {
    if (!file.startsWith(".batch-progress") || !file.endsWith(".json")) continue;
    if (file.includes("backup") || file.includes("queue")) continue;
    try {
      const raw = JSON.parse(
        fs.readFileSync(path.join(PROJECT_ROOT, file), "utf-8"),
      ) as { completed?: string[] };
      for (const name of raw.completed ?? []) completed.add(name);
    } catch {
      // skip
    }
  }

  const buckets = {
    failedListStillMissing: missing.filter((n) => failed.has(n)),
    completedButMissing: missing.filter((n) => completed.has(n) && !failed.has(n)),
    neverProcessed: missing.filter((n) => !completed.has(n) && !failed.has(n)),
  };

  const report = {
    generatedAt: new Date().toISOString(),
    catalogTotal: catalog.length,
    schemaFiles: fs.existsSync(path.join(PROJECT_ROOT, "generated", "schemas"))
      ? fs.readdirSync(path.join(PROJECT_ROOT, "generated", "schemas")).filter((f) =>
          f.endsWith("-schema.json"),
        ).length
      : 0,
    missingTotal: missing.length,
    scanFailedOnly: collectScanFailedTools().length,
    buckets: {
      failedListStillMissing: buckets.failedListStillMissing.length,
      completedButMissing: buckets.completedButMissing.length,
      neverProcessed: buckets.neverProcessed.length,
    },
    missing,
    samples: {
      completedButMissing: buckets.completedButMissing.slice(0, 20),
      neverProcessed: buckets.neverProcessed.slice(0, 20),
    },
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  console.log("\n📋 SCHEMA GAP AUDIT");
  console.log(`   Katalog: ${report.catalogTotal}`);
  console.log(`   Schema dosyası: ${report.schemaFiles}`);
  console.log(`   Eksik: ${report.missingTotal}`);
  console.log(`   └ failed listesinde: ${report.buckets.failedListStillMissing}`);
  console.log(`   └ completed ama dosya yok: ${report.buckets.completedButMissing}`);
  console.log(`   └ hiç işlenmemiş: ${report.buckets.neverProcessed}`);
  console.log(`   Rapor: ${REPORT_PATH}\n`);

  if (missing.length > 0 && missing.some((n) => !schemaExists(n))) {
    console.log("Retry: npm run retry:scan-failed-batch");
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
