/**
 * Phase 5H-C — input design audit CLI shape tests.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import {
  formatBatchInputDesignAuditReport,
  runBatchInputDesignAudit,
} from "@/lib/formula-governance/input-design-audit/batch-input-design-audit";

const ROOFING_SLUG = "roofing-contract-margin-guard";
const CNC_SLUG = "cnc-quote-risk-analyzer";

describe("input design audit script shape", () => {
  test("produces summary shape with total contracts", () => {
    const result = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const formatted = formatBatchInputDesignAuditReport(result);

    expect(result.totalContracts).toBe(41);
    expect(formatted).toContain("Input Design Audit Summary");
    expect(formatted).toContain("Total contracts: 41");
    expect(formatted).toContain("Professional ready:");
    expect(formatted).toContain("Contract-only analysis:");
  });

  test("formatted report does not throw for blocked audits", () => {
    const result = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });

    expect(() => formatBatchInputDesignAuditReport(result)).not.toThrow();
    expect(result.blocked).toBeLessThan(32);
  });

  test("top risks include roofing and cnc", () => {
    const result = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const formatted = formatBatchInputDesignAuditReport(result);

    expect(formatted).toContain(ROOFING_SLUG);
    expect(formatted).toContain(CNC_SLUG);
    expect(formatted).toContain("Top risks:");
    expect(result.topRisks.some((line) => line.includes(CNC_SLUG))).toBe(true);
  });
});
