#!/usr/bin/env npx tsx
/**
 * SectorCalc Formula Governance — batch input design audit CLI (Phase 5H-C).
 * Read-only report; exit code 0 even when audits are blocked.
 */

import { FORMULA_CONTRACTS } from "../src/lib/formula-governance/contracts";
import {
  exportBatchInputDesignAuditResult,
  formatBatchInputDesignAuditReport,
  runBatchInputDesignAudit,
} from "../src/lib/formula-governance/input-design-audit/batch-input-design-audit";

const jsonExport = process.argv.includes("--json");
const result = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });

console.log(formatBatchInputDesignAuditReport(result));

if (jsonExport) {
  console.log("");
  console.log(JSON.stringify(exportBatchInputDesignAuditResult(result), null, 2));
}

process.exit(0);
