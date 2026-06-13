#!/usr/bin/env node
/**
 * P2.4 — Full tool inventory & quality audit (scan-only).
 * Classifies tools: PASS / WARN / FAIL / QUARANTINE.
 * No repairs, no catalog/route/formula changes.
 */
import fs from "node:fs";
import path from "node:path";
import {
  P24_REPORT_PATH,
  buildP24ToolQualityReport,
  formatP24Stdout,
} from "./lib/p24-tool-quality-lib.mjs";

function main() {
  let report;

  try {
    report = buildP24ToolQualityReport();
  } catch (error) {
    console.error("audit:p24-tool-quality ERROR");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(P24_REPORT_PATH), { recursive: true });
  fs.writeFileSync(P24_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(formatP24Stdout(report));
}

main();
