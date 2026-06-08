#!/usr/bin/env npx tsx
/**
 * Controlled patch draft audit CLI — Phase 5I-E (dry-run only).
 */

import { FORMULA_CONTRACTS } from "../src/lib/formula-governance/contracts";
import { runFullExistingToolAudit } from "../src/lib/formula-governance/full-tool-audit/full-tool-audit-runner";
import {
  formatBatchControlledPatchAuditReport,
  runBatchControlledPatchDraftAudit,
} from "../src/lib/formula-governance/tool-factory-orchestrator/controlled-patch-generator/batch-controlled-patch-audit";
import { runBatchPatchPlanAudit } from "../src/lib/formula-governance/tool-factory-orchestrator/patch-plan/batch-patch-plan-audit";

const fullToolAudit = runFullExistingToolAudit(FORMULA_CONTRACTS);
const patchPlanAudit = runBatchPatchPlanAudit(fullToolAudit);
const result = runBatchControlledPatchDraftAudit(patchPlanAudit);
console.log(formatBatchControlledPatchAuditReport(result));
process.exit(0);
