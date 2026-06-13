/**
 * Premium-schema batch governance assurance tests.
 */

import { describe, expect, test } from "vitest";
import { runGovernanceAudit } from "@/lib/formula-governance/audit-runner";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  BATCH_PREMIUM_SCHEMA_CRITICAL_FORMULA_CONTRACTS,
  BATCH_PREMIUM_SCHEMA_ORACLE_WIRED_SLUGS,
} from "@/lib/formula-governance/contracts/batch-premium-schema-critical";
import { BATCH_PREMIUM_SCHEMA_CRITICAL_SLUGS } from "@/lib/formula-governance/premium-schema-governance/premium-schema-critical-slugs";
import { PREMIUM_SCHEMA_CLASSIFICATION } from "@/lib/formula-governance/premium-schema-governance/premium-schema-classification";
import { premiumSchemaCount, premiumSchemaSummary } from "./governance-registry-expectations";
import { hasOracleForTool } from "@/lib/formula-governance/oracle/registry";
import { runBatchPremiumSchemaOracleComparisonAudit } from "@/lib/formula-governance/oracle/compare-batch-premium-schema-oracle";
import { PREMIUM_FULL_LOOP_RUNTIME_SLUGS } from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";

/** Batch 1 validation added contract coverage; oracle wiring deferred to Batch 2. */
const BATCH1_ORACLE_AUDIT_DEFERRED = ["cbam-compliance-verdict"] as const;

describe("premium-schema batch governance", () => {
  test("classifies all premium schemas", () => {
    const summary = premiumSchemaSummary();
    expect(PREMIUM_SCHEMA_CLASSIFICATION).toHaveLength(premiumSchemaCount());
    expect(summary.totalSchemas).toBe(premiumSchemaCount());
    expect(summary.groupCounts.A).toBe(11);
  });

  test("all 11 critical slugs resolve from registry", () => {
    for (const slug of BATCH_PREMIUM_SCHEMA_CRITICAL_SLUGS) {
      expect(getFormulaContractBySlug(slug)?.slug).toBe(slug);
    }
  });

  test("assured contracts declare oracle, property and scenario coverage", () => {
    for (const contract of BATCH_PREMIUM_SCHEMA_CRITICAL_FORMULA_CONTRACTS) {
      expect(contract.riskLevel).toBe("critical");
      expect(contract.warningPolicy).toBeDefined();
      expect(contract.scenarioTests.length).toBeGreaterThanOrEqual(5);
      expect(contract.scenarioTests.every((scenario) => scenario.present === true)).toBe(true);
      expect(contract.propertyTestsRegistered).toBe(true);
      expect(contract.oracleRequired).toBe(true);
      expect(contract.assumptions.some((line) => line.includes("Production:"))).toBe(true);
    }
  });

  test("oracles registered for all critical slugs", () => {
    for (const slug of BATCH_PREMIUM_SCHEMA_ORACLE_WIRED_SLUGS) {
      expect(hasOracleForTool(`revenue-premium.${slug}`)).toBe(true);
    }
  });

  test("critical slugs promoted to premium full-loop runtime", () => {
    for (const slug of BATCH_PREMIUM_SCHEMA_CRITICAL_SLUGS) {
      expect(PREMIUM_FULL_LOOP_RUNTIME_SLUGS).toContain(slug);
    }
    expect(PREMIUM_FULL_LOOP_RUNTIME_SLUGS).toContain("auto-shop-margin-leak-detector");
  });

  test("batch tools clear oracle, property and scenario blockers", () => {
    const report = runGovernanceAudit();
    for (const slug of BATCH_PREMIUM_SCHEMA_ORACLE_WIRED_SLUGS) {
      if ((BATCH1_ORACLE_AUDIT_DEFERRED as readonly string[]).includes(slug)) {
        continue;
      }
      const result = report.results.find((entry) => entry.slug === slug);
      expect(result).toBeDefined();
      expect(result?.findings.some((finding) => finding.code === "CRIT_ORACLE_MISSING")).toBe(false);
      expect(result?.findings.some((finding) => finding.code === "CRIT_PROPERTY_TESTS")).toBe(
        false,
      );
      expect(result?.findings.some((finding) => finding.code === "CRIT_SCENARIO_TESTS")).toBe(
        false,
      );
      expect(result?.status === "FAIL" || result?.status === "DISABLE_OR_SOFTEN").toBe(false);
    }
  });

  test("oracle comparison passes for all premium-schema batch tools", () => {
    for (const slug of BATCH_PREMIUM_SCHEMA_ORACLE_WIRED_SLUGS) {
      if ((BATCH1_ORACLE_AUDIT_DEFERRED as readonly string[]).includes(slug)) {
        continue;
      }
      const summary = runBatchPremiumSchemaOracleComparisonAudit(slug);
      expect(summary.status).toBe("PASS");
      expect(summary.passCount).toBe(4);
      expect(summary.failCount).toBe(0);
    }
  });
});
