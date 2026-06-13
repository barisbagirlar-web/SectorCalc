#!/usr/bin/env node
/**
 * P2.5 — Enterprise Control Plane (read-only aggregation).
 * Merges P2.4, Runtime Trust, legacy conflict findings into unified tool quality map.
 */
import fs from "node:fs";
import path from "node:path";
import {
  CONTROL_PLANE_REPORT_PATH,
  buildControlPlaneReport,
  formatControlPlaneStdout,
} from "./lib/p25-control-plane-lib.mjs";
import { P24_REPORT_PATH } from "./lib/p24-tool-quality-lib.mjs";
import { RUNTIME_TRUST_REPORT_PATH } from "./lib/p25-control-plane-lib.mjs";

function warnMissing(pathLabel, filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`audit:p25-control-plane WARN missing source: ${pathLabel} (${path.relative(process.cwd(), filePath)})`);
    return false;
  }
  return true;
}

function main() {
  warnMissing("p24", P24_REPORT_PATH);
  warnMissing("runtime-trust", RUNTIME_TRUST_REPORT_PATH);

  let report;
  try {
    report = buildControlPlaneReport();
  } catch (error) {
    console.error("audit:p25-control-plane ERROR");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(CONTROL_PLANE_REPORT_PATH), { recursive: true });
  fs.writeFileSync(CONTROL_PLANE_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(formatControlPlaneStdout(report));
}

main();
