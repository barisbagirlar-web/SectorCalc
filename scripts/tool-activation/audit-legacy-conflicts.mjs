#!/usr/bin/env node
/**
 * P1A — Legacy conflict audit (scan-only).
 * Classifies stale Formula Gate surfaces, copy mismatches, generic guides,
 * verify/certification claims, build drift, P9 WIP, guide CMS cross-wires,
 * and slug alias collisions.
 *
 * Does not delete tools, routes, formulas, or payment code.
 */
import fs from "node:fs";
import path from "node:path";
import {
  LEGACY_CONFLICT_REPORT_PATH,
  buildLegacyConflictReport,
  formatLegacyConflictStdout,
} from "./lib/legacy-conflict-audit-lib.mjs";

function main() {
  let report;

  try {
    report = buildLegacyConflictReport();
  } catch (error) {
    console.error("audit:legacy-conflicts ERROR");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(LEGACY_CONFLICT_REPORT_PATH), { recursive: true });
  fs.writeFileSync(LEGACY_CONFLICT_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(formatLegacyConflictStdout(report));
}

main();
