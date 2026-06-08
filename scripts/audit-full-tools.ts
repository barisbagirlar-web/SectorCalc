#!/usr/bin/env npx tsx
/**
 * Full existing tool audit CLI — Phase 5H-J (read-only).
 */

import { formatFullExistingToolAuditReport } from "../src/lib/formula-governance/full-tool-audit/full-tool-audit-report";
import { runFullExistingToolAudit } from "../src/lib/formula-governance/full-tool-audit/full-tool-audit-runner";

const result = runFullExistingToolAudit();
console.log(formatFullExistingToolAuditReport(result));
process.exit(0);
