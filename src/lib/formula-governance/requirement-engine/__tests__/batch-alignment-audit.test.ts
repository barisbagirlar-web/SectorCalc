/**
 * Phase 5H-B-6 — batch alignment audit tests.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS, getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { runGovernanceAudit } from "@/lib/formula-governance/audit-runner";
import { buildFormulaInventory, summarizeInventory } from "@/lib/formula-governance/inventory";
import { runBatchAlignmentAudit } from "@/lib/formula-governance/requirement-engine/batch-alignment-audit";

const ROOFING_SLUG = "roofing-contract-margin-guard";
const CNC_SLUG = "cnc-quote-risk-analyzer";

describe("runBatchAlignmentAudit", () => {
  test("counts totalContracts", () => {
    const result = runBatchAlignmentAudit({ contracts: FORMULA_CONTRACTS });

    expect(result.totalContracts).toBe(41);
    expect(result.summaries.length).toBe(41);
  });

  test("produces roofing evaluated summary", () => {
    const result = runBatchAlignmentAudit({ contracts: FORMULA_CONTRACTS });
    const roofing = result.summaries.find((summary) => summary.slug === ROOFING_SLUG);

    expect(roofing).toBeDefined();
    expect(roofing?.aliasCount).toBeGreaterThan(0);
    expect(["needs_review", "low_risk"]).toContain(roofing?.status);
    expect(roofing?.safeToUseContractOntologyForRequirementEngine).toBe(true);
    expect(result.evaluatedContracts).toBeGreaterThanOrEqual(2);
  });

  test("evaluates CNC with production metadata and needs_review alignment", () => {
    const result = runBatchAlignmentAudit({ contracts: FORMULA_CONTRACTS });
    const cnc = result.summaries.find((summary) => summary.slug === CNC_SLUG);

    expect(cnc).toBeDefined();
    expect(cnc?.status).toBe("needs_review");
    expect(cnc?.safeToUseContractOntologyForRequirementEngine).toBe(true);
    expect(cnc?.blockerCount).toBe(0);
    expect(result.blocked).toBe(0);
  });

  test("marks contracts without fixture as contract_only_analysis", () => {
    const result = runBatchAlignmentAudit({ contracts: FORMULA_CONTRACTS });
    const rentVsBuy = result.summaries.find(
      (summary) => summary.slug === "rent-vs-buy-calculator",
    );

    expect(rentVsBuy?.status).toBe("contract_only_analysis");
    expect(rentVsBuy?.aliasCount).toBe(0);
    expect(result.skipped).toBeGreaterThan(38);
  });

  test("produces deterministic batch summary", () => {
    const first = runBatchAlignmentAudit({ contracts: FORMULA_CONTRACTS });
    const second = runBatchAlignmentAudit({ contracts: FORMULA_CONTRACTS });

    expect(first).toEqual(second);
  });

  test("does not import or execute production calculators", () => {
    const source = readFileSync(
      join(process.cwd(), "src/lib/formula-governance/requirement-engine/batch-alignment-audit.ts"),
      "utf8",
    );

    expect(source).not.toContain("premium-decision-engine");
    expect(source).not.toContain("calculatePremiumDecisionReport");
    expect(
      runBatchAlignmentAudit({
        contracts: [getFormulaContractBySlug(ROOFING_SLUG)!],
      }).evaluatedContracts,
    ).toBe(1);
  });

  test("does not change existing formula audit metrics", () => {
    const inventoryBefore = summarizeInventory(buildFormulaInventory());
    const report = runGovernanceAudit({ strict: false });

    expect(FORMULA_CONTRACTS.length).toBe(41);
    expect(report.results.filter((result) => result.status === "FAIL").length).toBe(0);
    expect(report.criticalToolsWithoutContract.length).toBe(
      inventoryBefore.criticalMissingContracts.length,
    );
  });
});
