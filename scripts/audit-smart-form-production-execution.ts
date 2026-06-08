#!/usr/bin/env npx tsx
/**
 * SectorCalc — smart form production execution gate audit CLI (Phase 5H-G-R).
 * Read-only report; exit code 0; no deploy actions.
 */

import {
  formatSmartFormPilotProductionDeployExecutionReport,
  runSmartFormPilotProductionDeployExecutionAudit,
} from "../src/components/tools/smart-form/pilot-production-deploy-execution-audit";

const jsonExport = process.argv.includes("--json");
const result = runSmartFormPilotProductionDeployExecutionAudit();

console.log(formatSmartFormPilotProductionDeployExecutionReport(result));

if (jsonExport) {
  console.log("");
  console.log(JSON.stringify(result, null, 2));
}

process.exit(0);
