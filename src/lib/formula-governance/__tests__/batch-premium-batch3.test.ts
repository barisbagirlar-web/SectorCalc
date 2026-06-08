/**
 * Phase 5G-C — paired premium / sector contract skeleton coverage tests.
 */

import { describe, expect, test } from "vitest";
import { runGovernanceAudit } from "@/lib/formula-governance/audit-runner";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  BATCH_PREMIUM_BATCH3_CRITICAL_FORMULA_CONTRACTS,
  BATCH_PREMIUM_BATCH3_CRITICAL_SLUGS,
} from "@/lib/formula-governance/contracts/batch-expansion-critical";
import { buildFormulaInventory, summarizeInventory } from "@/lib/formula-governance/inventory";

describe("phase 5G-C premium batch-3 contract skeletons", () => {
  test("all 10 slugs resolve from registry", () => {
    for (const slug of BATCH_PREMIUM_BATCH3_CRITICAL_SLUGS) {
      expect(getFormulaContractBySlug(slug)?.slug).toBe(slug);
    }
  });

  test("skeleton contracts declare critical metadata without oracle assurance", () => {
    for (const contract of BATCH_PREMIUM_BATCH3_CRITICAL_FORMULA_CONTRACTS) {
      expect(contract.riskLevel).toBe("critical");
      expect(contract.warningPolicy).toBeDefined();
      expect(contract.warningPolicy?.acceptedAssumptions.length).toBeGreaterThan(0);
      expect(contract.warningPolicy?.modelLimitations.length).toBeGreaterThan(0);
      expect(contract.warningPolicy?.futureExtensions.length).toBeGreaterThan(0);
      expect(contract.scenarioTests.length).toBeGreaterThanOrEqual(5);
      expect(contract.scenarioTests.every((s) => s.present === false)).toBe(true);
      expect(contract.propertyTestsRegistered).toBe(false);
      expect(contract.oracleRequired).toBe(true);
      expect(contract.formulaSummary.length).toBeGreaterThan(10);
      expect(contract.assumptions.some((line) => line.includes("Production:"))).toBe(true);
      expect(contract.monotonicityRules.length).toBeGreaterThanOrEqual(3);
    }
  });

  test("batch 3 slugs no longer appear in critical missing contracts", () => {
    const missing = summarizeInventory(buildFormulaInventory()).criticalMissingContracts.map(
      (entry) => entry.slug,
    );
    for (const slug of BATCH_PREMIUM_BATCH3_CRITICAL_SLUGS) {
      expect(missing).not.toContain(slug);
    }
  });

  test("batch 3 tools still fail oracle, property and scenario assurance gates", () => {
    const report = runGovernanceAudit();
    for (const slug of BATCH_PREMIUM_BATCH3_CRITICAL_SLUGS) {
      const result = report.results.find((r) => r.slug === slug);
      expect(result).toBeDefined();
      expect(result?.status).toBe("FAIL");
      expect(result?.findings.some((f) => f.code === "CRIT_ORACLE_MISSING")).toBe(true);
      expect(result?.findings.some((f) => f.code === "CRIT_PROPERTY_TESTS")).toBe(true);
      expect(result?.findings.some((f) => f.code === "CRIT_SCENARIO_TESTS")).toBe(true);
    }
  });
});
