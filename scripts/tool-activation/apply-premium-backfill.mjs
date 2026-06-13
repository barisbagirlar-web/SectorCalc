#!/usr/bin/env node
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { ROOT } from "./lib/activation-paths.mjs";
import {
  FACTORY_PLAN_PATH,
  FACTORY_RESULT_PATH,
  applyFactoryPlan,
  buildFactoryPlan,
  optionsMatch,
  parseCliArgs,
  writeFactoryPlan,
  writeFactoryResult,
} from "./lib/premium-backfill-factory-lib.mjs";

function main() {
  const options = parseCliArgs(process.argv.slice(2));
  options.dryRun = false;

  let plan;
  if (fs.existsSync(FACTORY_PLAN_PATH) && !options.force) {
    plan = JSON.parse(fs.readFileSync(FACTORY_PLAN_PATH, "utf8"));
    if (!optionsMatch(plan.options, options)) {
      plan = buildFactoryPlan(options);
      writeFactoryPlan(plan);
    }
  } else {
    plan = buildFactoryPlan(options);
    writeFactoryPlan(plan);
  }

  console.log(`Applying ${plan.selected.length} tool(s)...`);
  const result = applyFactoryPlan(plan, options);

  try {
    execFileSync("npx", ["tsc", "--noEmit"], { cwd: ROOT, stdio: "inherit" });
    result.tsc = "PASS";
  } catch {
    result.tsc = "FAIL";
  }

  try {
    execFileSync("npm", ["run", "build"], { cwd: ROOT, stdio: "inherit" });
    result.build = "PASS";
  } catch {
    result.build = "FAIL";
  }

  writeFactoryResult(result);

  console.log("\nP65 Premium Backfill Factory — apply result");
  console.log(`generated: ${result.generated.length}`);
  console.log(`passed vitest: ${result.passed.length}`);
  console.log(`failed: ${result.failed.length}`);
  console.log(`skipped: ${result.skipped.length}`);
  console.log(
    `PASS ${result.scanStats.passBefore} → ${result.scanStats.passAfter} | UPGRADE ${result.scanStats.upgradeBefore} → ${result.scanStats.upgradeAfter}`,
  );
  console.log(`Output: ${FACTORY_RESULT_PATH}`);

  if (result.failed.length > 0) {
    process.exitCode = 1;
  }
}

main();
