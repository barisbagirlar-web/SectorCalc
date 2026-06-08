#!/usr/bin/env npx tsx
/**
 * Tool factory orchestrator audit CLI — Phase 5I-A skeleton (read-only).
 */

import {
  formatToolFactoryOrchestratorAuditReport,
  runToolFactoryOrchestratorAudit,
} from "../src/lib/formula-governance/tool-factory-orchestrator/tool-factory-audit";

const result = runToolFactoryOrchestratorAudit();
console.log(formatToolFactoryOrchestratorAuditReport(result));
process.exit(0);
