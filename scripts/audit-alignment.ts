#!/usr/bin/env npx tsx
/**
 * SectorCalc Formula Governance — batch alignment audit CLI (Phase 5H-B-7).
 * Read-only report; exit code 0 even when alignments are blocked.
 */

import { FORMULA_CONTRACTS } from "../src/lib/formula-governance/contracts";
import {
  exportBatchAlignmentAuditResult,
  formatBatchAlignmentAuditReport,
  runBatchAlignmentAudit,
} from "../src/lib/formula-governance/requirement-engine/batch-alignment-audit";

const jsonExport = process.argv.includes("--json");
const result = runBatchAlignmentAudit({ contracts: FORMULA_CONTRACTS });

console.log(formatBatchAlignmentAuditReport(result));

if (jsonExport) {
  console.log("");
  console.log(JSON.stringify(exportBatchAlignmentAuditResult(result), null, 2));
}

process.exit(0);
