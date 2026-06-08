/**
 * Phase 5E / 5F-A — batch expansion contract coverage tests.
 */

import { describe, expect, test } from "vitest";
import { runGovernanceAudit } from "@/lib/formula-governance/audit-runner";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  BATCH_EXPANSION_ORACLE_WIRED_SLUGS,
  BATCH_FREE_ORACLE_WIRED_SLUGS,
} from "@/lib/formula-governance/contracts/batch-expansion-critical";
import { buildFormulaInventory, summarizeInventory } from "@/lib/formula-governance/inventory";

describe("phase 5E/5F batch expansion contracts", () => {
  test("all 10 oracle-wired slugs resolve from registry", () => {
    for (const slug of BATCH_EXPANSION_ORACLE_WIRED_SLUGS) {
      expect(getFormulaContractBySlug(slug)?.slug).toBe(slug);
    }
  });

  test("oracle-wired batch expansion tools have assured coverage", () => {
    for (const slug of BATCH_EXPANSION_ORACLE_WIRED_SLUGS) {
      const contract = getFormulaContractBySlug(slug);
      expect(contract?.riskLevel).toBe("critical");
      expect(contract?.warningPolicy).toBeDefined();
      expect(contract?.scenarioTests.length).toBeGreaterThanOrEqual(5);
      expect(contract?.monotonicityRules.length).toBeGreaterThanOrEqual(3);
      expect(contract?.oracleRequired).toBe(true);
      expect(contract?.scenarioTests.every((s) => s.present === true)).toBe(true);
      expect(contract?.propertyTestsRegistered).toBe(true);
    }
  });

  test("oracle-wired slugs no longer appear in critical missing contracts", () => {
    const missing = summarizeInventory(buildFormulaInventory()).criticalMissingContracts.map(
      (entry) => entry.slug,
    );
    for (const slug of BATCH_EXPANSION_ORACLE_WIRED_SLUGS) {
      expect(missing).not.toContain(slug);
    }
  });

  test("oracle-wired batch tools clear oracle, property and scenario blockers", () => {
    const report = runGovernanceAudit();
    for (const slug of BATCH_EXPANSION_ORACLE_WIRED_SLUGS) {
      const result = report.results.find((r) => r.slug === slug);
      expect(result).toBeDefined();
      expect(result?.findings.some((f) => f.code === "CRIT_ORACLE_MISSING")).toBe(false);
      expect(result?.findings.some((f) => f.code === "CRIT_PROPERTY_TESTS")).toBe(false);
      expect(result?.findings.some((f) => f.code === "CRIT_SCENARIO_TESTS")).toBe(false);
      expect(result?.findings.some((f) => f.code === "ORACLE_COMPARISON_PASS")).toBe(true);
    }
  });
});
