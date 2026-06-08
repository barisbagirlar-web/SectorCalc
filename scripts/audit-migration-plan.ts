#!/usr/bin/env npx tsx
/**
 * SectorCalc Formula Governance — existing tool migration plan CLI (Phase 5H-E).
 * Read-only report; exit code 0; no file writes; no production calculator execution.
 */

import { FORMULA_CONTRACTS } from "../src/lib/formula-governance/contracts";
import { runBatchInputDesignAudit } from "../src/lib/formula-governance/input-design-audit/batch-input-design-audit";
import {
  buildExistingToolMigrationPlan,
  exportBatchMigrationPlan,
  formatMigrationPlanReport,
} from "../src/lib/formula-governance/input-design-audit/migration-plan/migration-planner";
import { runBatchAlignmentAudit } from "../src/lib/formula-governance/requirement-engine/batch-alignment-audit";

const jsonExport = process.argv.includes("--json");

const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
const alignmentAudit = runBatchAlignmentAudit({ contracts: FORMULA_CONTRACTS });
const plan = buildExistingToolMigrationPlan({
  inputDesignAudit,
  alignmentAudit,
  contracts: FORMULA_CONTRACTS,
});

console.log(formatMigrationPlanReport(plan));

if (jsonExport) {
  console.log("");
  console.log(JSON.stringify(exportBatchMigrationPlan(plan), null, 2));
}

process.exit(0);
