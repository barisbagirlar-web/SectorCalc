#!/usr/bin/env node
import {
  UI_I18N_PLAN_PATH,
  buildUiI18nPlan,
  formatUiI18nDryRunReport,
  parseCliArgs,
  writeUiI18nPlan,
} from "./lib/premium-ui-i18n-backfill-lib.mjs";

function main() {
  const options = parseCliArgs(process.argv.slice(2));
  const plan = buildUiI18nPlan(options);
  writeUiI18nPlan(plan);

  console.log(formatUiI18nDryRunReport(plan));
  console.log(`\nOutput: ${UI_I18N_PLAN_PATH}`);
  if (options.dryRun) {
    console.log("Dry-run only — no source files modified.");
  }
}

main();
