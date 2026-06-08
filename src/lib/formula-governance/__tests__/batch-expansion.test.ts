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
} from "@/lib/formula-governance/contracts/batch-expansion-critical";
import { buildFormulaInventory, summarizeInventory } from "@/lib/formula-governance/inventory";

const BATCH_PREMIUM_PENDING_SLUGS = BATCH_EXPANSION_CRITICAL_SLUGS.filter(
  (slug) => !(BATCH_FREE_ORACLE_WIRED_SLUGS as readonly string[]).includes(slug),
);

describe("phase 5E batch expansion contracts", () => {
  test("all 10 slugs resolve from registry", () => {
    for (const slug of BATCH_EXPANSION_CRITICAL_SLUGS) {
      expect(getFormulaContractBySlug(slug)?.slug).toBe(slug);
    }
  });

  test("wired free tools have assured coverage; premium batch tools remain skeletons", () => {
    for (const contract of BATCH_EXPANSION_CRITICAL_FORMULA_CONTRACTS) {
      expect(contract.riskLevel).toBe("critical");
      expect(contract.warningPolicy).toBeDefined();
      expect(contract.scenarioTests.length).toBeGreaterThanOrEqual(5);
      expect(contract.monotonicityRules.length).toBeGreaterThanOrEqual(3);
      expect(contract.oracleRequired).toBe(true);

      const isWired = (BATCH_FREE_ORACLE_WIRED_SLUGS as readonly string[]).includes(contract.slug);
      if (isWired) {
        expect(contract.scenarioTests.every((s) => s.present === true)).toBe(true);
        expect(contract.propertyTestsRegistered).toBe(true);
      } else {
        expect(contract.scenarioTests.every((s) => s.present === false)).toBe(true);
        expect(contract.propertyTestsRegistered).toBe(false);
      }
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

  test("first 5 batch free tools clear oracle, property and scenario blockers", () => {
    const report = runGovernanceAudit();
    for (const slug of BATCH_FREE_ORACLE_WIRED_SLUGS) {
      const result = report.results.find((r) => r.slug === slug);
      expect(result).toBeDefined();
      expect(result?.findings.some((f) => f.code === "CRIT_ORACLE_MISSING")).toBe(false);
      expect(result?.findings.some((f) => f.code === "CRIT_PROPERTY_TESTS")).toBe(false);
      expect(result?.findings.some((f) => f.code === "CRIT_SCENARIO_TESTS")).toBe(false);
      expect(result?.findings.some((f) => f.code === "ORACLE_COMPARISON_PASS")).toBe(true);
    }
  });

  test("remaining premium batch tools still fail assurance gates", () => {
    const report = runGovernanceAudit();
    for (const slug of BATCH_PREMIUM_PENDING_SLUGS) {
      const result = report.results.find((r) => r.slug === slug);
      expect(result).toBeDefined();
      expect(result?.status).toBe("FAIL");
      expect(result?.findings.some((f) => f.code === "CRIT_ORACLE_MISSING")).toBe(true);
      expect(result?.findings.some((f) => f.code === "CRIT_PROPERTY_TESTS")).toBe(true);
      expect(result?.findings.some((f) => f.code === "CRIT_SCENARIO_TESTS")).toBe(true);
    }
  });
});
