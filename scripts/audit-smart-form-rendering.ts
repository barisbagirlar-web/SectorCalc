#!/usr/bin/env npx tsx
/**
 * SectorCalc Formula Governance — smart form rendering audit CLI (Phase 5H-G-B).
 * Read-only report; exit code 0; no file writes; no production calculator execution.
 */

import { FORMULA_CONTRACTS } from "../src/lib/formula-governance/contracts";
import { CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY } from "../src/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import { runBatchInputDesignAudit } from "../src/lib/formula-governance/input-design-audit/batch-input-design-audit";
import { buildExistingToolMigrationPlan } from "../src/lib/formula-governance/input-design-audit/migration-plan/migration-planner";
import { runBatchSmartFormPlanAudit } from "../src/lib/formula-governance/smart-form-architecture/batch-smart-form-plan-audit";
import {
  formatBatchSmartFormRenderAuditReport,
  runBatchSmartFormRenderAudit,
} from "../src/lib/formula-governance/smart-form-rendering/batch-smart-form-render-audit";
import { runBatchAlignmentAudit } from "../src/lib/formula-governance/requirement-engine/batch-alignment-audit";

const jsonExport = process.argv.includes("--json");

const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
const alignmentAudit = runBatchAlignmentAudit({ contracts: FORMULA_CONTRACTS });
const migrationPlan = buildExistingToolMigrationPlan({
  inputDesignAudit,
  alignmentAudit,
  contracts: FORMULA_CONTRACTS,
});

const smartFormAudit = runBatchSmartFormPlanAudit({
  migrationPlan,
  controlledPatchRegistry: CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY,
  alignmentAudit,
});

const result = runBatchSmartFormRenderAudit({
  smartFormPlans: smartFormAudit.plans,
  renderMode: "free_quick_check",
});

console.log(formatBatchSmartFormRenderAuditReport(result));

if (jsonExport) {
  console.log("");
  console.log(JSON.stringify(result, null, 2));
}

process.exit(0);
