#!/usr/bin/env node
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { ROOT } from "./lib/activation-paths.mjs";
import {
  UI_I18N_PLAN_PATH,
  UI_I18N_RESULT_PATH,
  applyUiI18nPlan,
  buildUiI18nPlan,
  optionsMatch,
  parseCliArgs,
  writeUiI18nPlan,
  writeUiI18nResult,
} from "./lib/premium-ui-i18n-backfill-lib.mjs";

function main() {
  const options = parseCliArgs(process.argv.slice(2));
  options.dryRun = false;

  let plan;
  if (fs.existsSync(UI_I18N_PLAN_PATH) && !options.force) {
    plan = JSON.parse(fs.readFileSync(UI_I18N_PLAN_PATH, "utf8"));
    if (!optionsMatch(plan.options, options)) {
      plan = buildUiI18nPlan(options);
      writeUiI18nPlan(plan);
    }
  } else {
    plan = buildUiI18nPlan(options);
    writeUiI18nPlan(plan);
  }

  if (plan.selected.length === 0) {
    console.log("No selected tools — apply skipped.");
    writeUiI18nResult({
      generatedAt: new Date().toISOString(),
      options,
      selected: [],
      passed: [],
      failed: [],
      skipped: [],
      i18nKeys: [],
      scanStats: plan.scanStats,
      status: "SKIPPED_EMPTY_SELECTION",
    });
    return;
  }

  console.log(`Applying ${plan.selected.length} UI/i18n tool(s)...`);
  const result = applyUiI18nPlan(plan);

  try {
    execFileSync("npx", ["tsc", "--noEmit"], { cwd: ROOT, stdio: "inherit" });
    result.tsc = "PASS";
  } catch {
    result.tsc = "FAIL";
  }

  try {
    execFileSync("npm", ["run", "lint:schemas"], { cwd: ROOT, stdio: "inherit" });
    result.schemaLint = "PASS";
  } catch {
    result.schemaLint = "FAIL";
  }

  writeUiI18nResult(result);

  console.log("\nP68 Premium UI/i18n Backfill Factory — apply result");
  console.log(`selected: ${result.selected.length}`);
  console.log(`passed: ${result.passed.length}`);
  console.log(`failed: ${result.failed.length}`);
  console.log(
    `PASS ${result.scanStats.passBefore} → ${result.scanStats.passAfter} | UPGRADE ${result.scanStats.upgradeBefore} → ${result.scanStats.upgradeAfter}`,
  );
  console.log(`Output: ${UI_I18N_RESULT_PATH}`);

  if (result.failed.length > 0) {
    process.exitCode = 1;
  }
}

main();
