/**
 * Phase 5H-C — batch input design audit tests.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import { runGovernanceAudit } from "@/lib/formula-governance/audit-runner";
import { buildFormulaInventory, summarizeInventory } from "@/lib/formula-governance/inventory";
import { runBatchInputDesignAudit } from "@/lib/formula-governance/input-design-audit/batch-input-design-audit";
import { governanceFailCount } from "../../__tests__/governance-registry-expectations";

const ROOFING_SLUG = "roofing-contract-margin-guard";
const CNC_SLUG = "cnc-quote-risk-analyzer";

describe("runBatchInputDesignAudit", () => {
  test("counts 41 contracts", () => {
    const result = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });

    expect(result.totalContracts).toBe(FORMULA_CONTRACTS.length);
    expect(result.summaries.length).toBe(FORMULA_CONTRACTS.length);
  });

  test("produces deterministic status counts", () => {
    const first = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const second = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });

    expect(first).toEqual(second);
    expect(
      first.professionalReady +
        first.usable +
        first.shallow +
        first.unsafe +
        first.blocked,
    ).toBe(FORMULA_CONTRACTS.length);
  });

  test("produces recommendedNextBatch", () => {
    const result = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });

    expect(result.recommendedNextBatch.length).toBeGreaterThan(0);
    expect(result.blocked).toBeGreaterThanOrEqual(0);
    expect(result.recommendedNextBatch).not.toContain("electrical-labor-estimator");
  });

  test("produces topRisks with roofing and cnc", () => {
    const result = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });

    expect(result.topRisks.some((line) => line.includes(ROOFING_SLUG))).toBe(true);
    expect(result.topRisks.some((line) => line.includes(CNC_SLUG))).toBe(true);
    expect(result.topRisks.some((line) => line.includes("rent-vs-buy-calculator"))).toBe(true);
  });

  test("evaluates roofing fixture contract", () => {
    const result = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const roofing = result.summaries.find((summary) => summary.slug === ROOFING_SLUG);

    expect(roofing).toBeDefined();
    expect(result.evaluatedContracts).toBeGreaterThanOrEqual(2);
    expect(roofing?.alignmentStatus).toBe("needs_review");
  });

  test("does not change existing formula audit metrics", () => {
    const inventoryBefore = summarizeInventory(buildFormulaInventory());
    const report = runGovernanceAudit({ strict: false });

    const failBefore = report.results.filter((result) => result.status === "FAIL").length;

    runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });

    const inventoryAfter = summarizeInventory(buildFormulaInventory());
    const reportAfter = runGovernanceAudit({ strict: false });
    const failAfter = reportAfter.results.filter((result) => result.status === "FAIL").length;

    expect(FORMULA_CONTRACTS.length).toBe(FORMULA_CONTRACTS.length);
    expect(failBefore).toBe(governanceFailCount());
    expect(failAfter).toBe(failBefore);
    expect(inventoryAfter.criticalMissingContracts.length).toBe(
      inventoryBefore.criticalMissingContracts.length,
    );
    expect(report.criticalToolsWithoutContract.length).toBe(
      inventoryBefore.criticalMissingContracts.length,
    );
  });
});
