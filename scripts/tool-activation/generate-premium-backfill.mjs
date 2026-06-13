#!/usr/bin/env node
import fs from "node:fs";
import {
  FACTORY_PLAN_PATH,
  buildFactoryPlan,
  formatDryRunReport,
  parseCliArgs,
  writeFactoryPlan,
} from "./lib/premium-backfill-factory-lib.mjs";
import { QUALITY_SCAN_REPORT_PATH } from "./lib/quality-backfill-scan-lib.mjs";
import { QUALITY_BACKFILL_PLAN_PATH } from "./lib/quality-backfill-plan-lib.mjs";

function ensureScanAndPlan() {
  if (!fs.existsSync(QUALITY_SCAN_REPORT_PATH) || !fs.existsSync(QUALITY_BACKFILL_PLAN_PATH)) {
    console.log("Scan/plan missing — run scan and plan first.");
    console.log("  npm run scan:quality-backfill");
    console.log("  npm run plan:quality-backfill");
    process.exit(1);
  }
}

function main() {
  const options = parseCliArgs(process.argv.slice(2));
  ensureScanAndPlan();

  const plan = buildFactoryPlan(options);
  writeFactoryPlan(plan);

  console.log(formatDryRunReport(plan));
  console.log(`\nOutput: ${FACTORY_PLAN_PATH}`);
  if (options.dryRun) {
    console.log("Dry-run only — no source files modified.");
  }
}

main();
