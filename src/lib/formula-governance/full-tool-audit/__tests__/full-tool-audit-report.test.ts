/**
 * Full tool audit report formatter tests — Phase 5H-J.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import { formatFullExistingToolAuditReport } from "@/lib/formula-governance/full-tool-audit/full-tool-audit-report";
import { runFullExistingToolAudit } from "@/lib/formula-governance/full-tool-audit/full-tool-audit-runner";

describe("full tool audit report — Phase 5H-J", () => {
  test("formatted report includes batch summary", () => {
    const result = runFullExistingToolAudit(FORMULA_CONTRACTS, process.cwd());
    const report = formatFullExistingToolAuditReport(result);

    expect(report).toContain("Full Existing Tool Audit");
    expect(report).toContain("Total tools: 131");
    expect(report).toContain("Top 10 risks:");
    expect(report).toContain("Top 10 quick wins:");
  });
});
