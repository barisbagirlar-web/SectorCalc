#!/usr/bin/env npx tsx
/**
 * SectorCalc — smart form production deploy gate audit CLI (Phase 5H-G-P).
 * Read-only report; exit code 0; no deploy actions.
 */

import {
  formatSmartFormPilotProductionDeployReport,
  runSmartFormPilotProductionDeployAudit,
} from "../src/components/tools/smart-form/pilot-production-deploy-audit";

const jsonExport = process.argv.includes("--json");
const result = runSmartFormPilotProductionDeployAudit();

console.log(formatSmartFormPilotProductionDeployReport(result));

if (jsonExport) {
  console.log("");
  console.log(JSON.stringify(result, null, 2));
}

process.exit(0);
