/**
 * Phase 5E / 5F-A — batch expansion contract coverage tests.
 */

import { describe, expect, test } from "vitest";
import { runGovernanceAudit } from "@/lib/formula-governance/audit-runner";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  BATCH_EXPANSION_CRITICAL_FORMULA_CONTRACTS,
  BATCH_EXPANSION_CRITICAL_SLUGS,
  BATCH_FREE_ORACLE_WIRED_SLUGS,
  BATCH_PREMIUM_ORACLE_WIRED_SLUGS,
} from "@/lib/formula-governance/contracts/batch-expansion-critical";
import { buildFormulaInventory, summarizeInventory } from "@/lib/formula-governance/inventory";

const BATCH_ORACLE_WIRED_SLUGS = [
  ...BATCH_FREE_ORACLE_WIRED_SLUGS,
  ...BATCH_PREMIUM_ORACLE_WIRED_SLUGS,
] as const;

describe("phase 5E batch expansion contracts", () => {
  test("all 10 slugs resolve from registry", () => {
    for (const slug of BATCH_EXPANSION_CRITICAL_SLUGS) {
      expect(getFormulaContractBySlug(slug)?.slug).toBe(slug);
    }
  });

  test("all 10 batch expansion tools have assured oracle coverage", () => {
    for (const contract of BATCH_EXPANSION_CRITICAL_FORMULA_CONTRACTS) {
      expect(contract.riskLevel).toBe("critical");
      expect(contract.warningPolicy).toBeDefined();
      expect(contract.scenarioTests.length).toBeGreaterThanOrEqual(5);
      expect(contract.monotonicityRules.length).toBeGreaterThanOrEqual(3);
      expect(contract.oracleRequired).toBe(true);

      const isWired = (BATCH_ORACLE_WIRED_SLUGS as readonly string[]).includes(contract.slug);
      expect(isWired).toBe(true);
      expect(contract.scenarioTests.every((s) => s.present === true)).toBe(true);
      expect(contract.propertyTestsRegistered).toBe(true);
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

  test("all 10 batch expansion tools clear oracle, property and scenario blockers", () => {
    const report = runGovernanceAudit();
    for (const slug of BATCH_ORACLE_WIRED_SLUGS) {
      const result = report.results.find((r) => r.slug === slug);
      expect(result).toBeDefined();
      expect(result?.findings.some((f) => f.code === "CRIT_ORACLE_MISSING")).toBe(false);
      expect(result?.findings.some((f) => f.code === "CRIT_PROPERTY_TESTS")).toBe(false);
      expect(result?.findings.some((f) => f.code === "CRIT_SCENARIO_TESTS")).toBe(false);
      expect(result?.findings.some((f) => f.code === "ORACLE_COMPARISON_PASS")).toBe(true);
    }
  });
});
