#!/usr/bin/env npx tsx
/**
 * Deploy ready gate audit CLI — Phase 5I-G (no deploy command).
 */

import {
  formatBatchDeployReadyAuditReport,
  runBatchDeployReadyAudit,
} from "../src/lib/formula-governance/tool-factory-orchestrator/human-approval/deploy-ready-audit";

const result = runBatchDeployReadyAudit();
console.log(formatBatchDeployReadyAuditReport(result));
process.exit(0);
