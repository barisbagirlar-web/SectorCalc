#!/usr/bin/env npx tsx
/**
 * Dual-intelligence runtime coverage CLI — read-only report.
 */

import {
  formatDualIntelligenceRuntimeCoverageReport,
  runDualIntelligenceRuntimeCoverageAudit,
} from "../src/lib/formula-governance/dual-intelligence-runtime-coverage/dual-intelligence-runtime-coverage-audit";

const jsonExport = process.argv.includes("--json");
const result = runDualIntelligenceRuntimeCoverageAudit();

console.log(formatDualIntelligenceRuntimeCoverageReport(result));

if (jsonExport) {
  console.log("");
  console.log(JSON.stringify(result, null, 2));
}

process.exit(0);
