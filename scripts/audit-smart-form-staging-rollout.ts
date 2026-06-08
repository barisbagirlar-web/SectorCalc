#!/usr/bin/env npx tsx
/**
 * SectorCalc — smart form staging rollout gate audit CLI (Phase 5H-G-L).
 * Read-only report; exit code 0; no deploy actions.
 */

import {
  formatSmartFormPilotStagingRolloutReport,
  runSmartFormPilotStagingRolloutAudit,
} from "../src/components/tools/smart-form/pilot-staging-rollout-audit";

const jsonExport = process.argv.includes("--json");
const result = runSmartFormPilotStagingRolloutAudit();

console.log(formatSmartFormPilotStagingRolloutReport(result));

if (jsonExport) {
  console.log("");
  console.log(JSON.stringify(result, null, 2));
}

process.exit(0);
