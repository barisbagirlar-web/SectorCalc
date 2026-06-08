#!/usr/bin/env npx tsx
/**
 * Patch plan audit CLI — Phase 5I-B (read-only).
 */

import { FORMULA_CONTRACTS } from "../src/lib/formula-governance/contracts";
import { runFullExistingToolAudit } from "../src/lib/formula-governance/full-tool-audit/full-tool-audit-runner";
import {
  formatBatchPatchPlanAuditReport,
  runBatchPatchPlanAudit,
} from "../src/lib/formula-governance/tool-factory-orchestrator/patch-plan/batch-patch-plan-audit";

const fullToolAudit = runFullExistingToolAudit(FORMULA_CONTRACTS);
const result = runBatchPatchPlanAudit(fullToolAudit);
console.log(formatBatchPatchPlanAuditReport(result));
process.exit(0);
