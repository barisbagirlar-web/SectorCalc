#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { SCAN_REPORT_PATH } from "./lib/activation-paths.mjs";
import {
  QUALITY_SCAN_REPORT_PATH,
  assertReferenceGate,
  buildQualityScanReport,
  formatQualityScanStdout,
} from "./lib/quality-backfill-scan-lib.mjs";

function main() {
  if (!fs.existsSync(SCAN_REPORT_PATH)) {
    console.error(
      [
        "Scan report missing. Run activation scan first:",
        "  npm run scan:tool-activation",
        `  expected: ${SCAN_REPORT_PATH}`,
      ].join("\n"),
    );
    process.exit(1);
  }

  let report;

  try {
    report = buildQualityScanReport();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(QUALITY_SCAN_REPORT_PATH), { recursive: true });
  fs.writeFileSync(QUALITY_SCAN_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(formatQualityScanStdout(report));

  try {
    assertReferenceGate(report);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
