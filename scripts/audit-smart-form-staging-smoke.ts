#!/usr/bin/env npx tsx
/**
 * SectorCalc — smart form staging smoke test gate audit CLI (Phase 5H-G-N).
 * Read-only report; exit code 0; no deploy actions.
 */

import {
  formatSmartFormPilotStagingSmokeTestReport,
  runSmartFormPilotStagingSmokeTestAudit,
} from "../src/components/tools/smart-form/pilot-staging-smoke-test-audit";

const jsonExport = process.argv.includes("--json");
const result = runSmartFormPilotStagingSmokeTestAudit();

console.log(formatSmartFormPilotStagingSmokeTestReport(result));

if (jsonExport) {
  console.log("");
  console.log(JSON.stringify(result, null, 2));
}

process.exit(0);
