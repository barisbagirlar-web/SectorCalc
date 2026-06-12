#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  QUALITY_BACKFILL_PLAN_PATH,
  buildQualityBackfillPlan,
  formatQualityBackfillPlanStdout,
  loadQualityBackfillPlanInput,
} from "./lib/quality-backfill-plan-lib.mjs";

function main() {
  let qualityReport;

  try {
    qualityReport = loadQualityBackfillPlanInput();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  const plan = buildQualityBackfillPlan(qualityReport);

  fs.mkdirSync(path.dirname(QUALITY_BACKFILL_PLAN_PATH), { recursive: true });
  fs.writeFileSync(QUALITY_BACKFILL_PLAN_PATH, `${JSON.stringify(plan, null, 2)}\n`, "utf8");

  console.log(formatQualityBackfillPlanStdout(plan));
}

main();
