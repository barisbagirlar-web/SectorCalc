/**
 * Phase 5G-B — batch free/revenue oracle assurance tests.
 */

import { describe, expect, test } from "vitest";
import { runGovernanceAudit } from "@/lib/formula-governance/audit-runner";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  BATCH_FREE_BATCH2_CRITICAL_FORMULA_CONTRACTS,
  BATCH_FREE_BATCH2_CRITICAL_SLUGS,
  BATCH_FREE_BATCH2_ORACLE_WIRED_SLUGS,
} from "@/lib/formula-governance/contracts/batch-expansion-critical";
import { summarizeInventory, buildFormulaInventory } from "@/lib/formula-governance/inventory";
import { runBatchFreeBatch2OracleComparisonAudit } from "@/lib/formula-governance/oracle/compare-batch-free-batch2-oracle";

describe("phase 5G-B batch free oracle assurance", () => {
  test("all 10 slugs resolve from registry", () => {
    for (const slug of BATCH_FREE_BATCH2_CRITICAL_SLUGS) {
      expect(getFormulaContractBySlug(slug)?.slug).toBe(slug);
    }
  });

  test("assured contracts declare oracle, property and scenario coverage", () => {
    for (const contract of BATCH_FREE_BATCH2_CRITICAL_FORMULA_CONTRACTS) {
      expect(contract.riskLevel).toBe("critical");
      expect(contract.warningPolicy).toBeDefined();
      expect(contract.scenarioTests.length).toBeGreaterThanOrEqual(5);
      expect(contract.scenarioTests.every((s) => s.present === true)).toBe(true);
      expect(contract.propertyTestsRegistered).toBe(true);
      expect(contract.oracleRequired).toBe(true);
      expect(contract.assumptions.some((line) => line.includes("Production:"))).toBe(true);
    }
  });

  test("batch 2 slugs no longer appear in critical missing contracts", () => {
    const missing = summarizeInventory(buildFormulaInventory()).criticalMissingContracts.map(
      (entry) => entry.slug,
    );
    for (const slug of BATCH_FREE_BATCH2_CRITICAL_SLUGS) {
      expect(missing).not.toContain(slug);
    }
  });

  test("batch 2 tools clear oracle, property and scenario blockers", () => {
    const report = runGovernanceAudit();
    for (const slug of BATCH_FREE_BATCH2_ORACLE_WIRED_SLUGS) {
      const result = report.results.find((r) => r.slug === slug);
      expect(result).toBeDefined();
      expect(result?.findings.some((f) => f.code === "CRIT_ORACLE_MISSING")).toBe(false);
      expect(result?.findings.some((f) => f.code === "CRIT_PROPERTY_TESTS")).toBe(false);
      expect(result?.findings.some((f) => f.code === "CRIT_SCENARIO_TESTS")).toBe(false);
      expect(result?.status === "FAIL" || result?.status === "DISABLE_OR_SOFTEN").toBe(false);
    }
  });

  test("oracle comparison passes for all batch 2 tools", () => {
    for (const slug of BATCH_FREE_BATCH2_ORACLE_WIRED_SLUGS) {
      const summary = runBatchFreeBatch2OracleComparisonAudit(slug);
      expect(summary.status).toBe("PASS");
      expect(summary.passCount).toBe(4);
      expect(summary.failCount).toBe(0);
    }
  });
});
