/**
 * Phase 5E — batch expansion contract coverage tests.
 */

import { describe, expect, test } from "vitest";
import { runGovernanceAudit } from "@/lib/formula-governance/audit-runner";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  BATCH_EXPANSION_CRITICAL_FORMULA_CONTRACTS,
  BATCH_EXPANSION_CRITICAL_SLUGS,
} from "@/lib/formula-governance/contracts/batch-expansion-critical";
import { buildFormulaInventory, summarizeInventory } from "@/lib/formula-governance/inventory";

describe("phase 5E batch expansion contracts", () => {
  test("all 10 slugs resolve from registry", () => {
    for (const slug of BATCH_EXPANSION_CRITICAL_SLUGS) {
      expect(getFormulaContractBySlug(slug)?.slug).toBe(slug);
    }
  });

  test("each contract is critical with warning policy and scenario skeletons", () => {
    for (const contract of BATCH_EXPANSION_CRITICAL_FORMULA_CONTRACTS) {
      expect(contract.riskLevel).toBe("critical");
      expect(contract.warningPolicy).toBeDefined();
      expect(contract.scenarioTests.length).toBeGreaterThanOrEqual(5);
      expect(contract.scenarioTests.every((s) => s.present === false)).toBe(true);
      expect(contract.monotonicityRules.length).toBeGreaterThanOrEqual(3);
      expect(contract.oracleRequired).toBe(true);
      expect(contract.propertyTestsRegistered).toBe(false);
    }
  });

  test("batch expansion slugs no longer appear in critical missing contracts", () => {
    const missing = summarizeInventory(buildFormulaInventory()).criticalMissingContracts.map(
      (entry) => entry.slug,
    );
    for (const slug of BATCH_EXPANSION_CRITICAL_SLUGS) {
      expect(missing).not.toContain(slug);
    }
  });

  test("new contracts fail assurance gates until oracle and scenarios wired", () => {
    const report = runGovernanceAudit();
    for (const slug of BATCH_EXPANSION_CRITICAL_SLUGS) {
      const result = report.results.find((r) => r.slug === slug);
      expect(result).toBeDefined();
      expect(result?.status).toBe("FAIL");
      expect(result?.findings.some((f) => f.code === "CRIT_ORACLE_MISSING")).toBe(true);
      expect(result?.findings.some((f) => f.code === "CRIT_PROPERTY_TESTS")).toBe(true);
      expect(result?.findings.some((f) => f.code === "CRIT_SCENARIO_TESTS")).toBe(true);
    }
  });
});
