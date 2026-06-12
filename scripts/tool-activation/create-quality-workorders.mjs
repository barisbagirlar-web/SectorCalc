#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  QUALITY_WORKORDERS_PATH,
  buildQualityWorkorders,
  formatQualityWorkordersStdout,
  loadQualityBackfillPlanInput,
} from "./lib/quality-backfill-workorder-lib.mjs";

function main() {
  let plan;

  try {
    plan = loadQualityBackfillPlanInput();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  const report = buildQualityWorkorders(plan);

  fs.mkdirSync(path.dirname(QUALITY_WORKORDERS_PATH), { recursive: true });
  fs.writeFileSync(QUALITY_WORKORDERS_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(formatQualityWorkordersStdout(report));
}

main();
