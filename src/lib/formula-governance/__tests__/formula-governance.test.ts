/**
 * Formula Assurance & Governance Platform — Phase 1 tests.
 */

import { describe, expect, test } from "vitest";
import {
  formatGovernanceAuditReport,
  runGovernanceAudit,
  shouldFailStrictAudit,
} from "@/lib/formula-governance/audit-runner";
import { rentVsBuyContract, getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { buildFormulaInventory, summarizeInventory } from "@/lib/formula-governance/inventory";
import { suggestRiskLevel } from "@/lib/formula-governance/risk-rules";
import { hasOracleForTool } from "@/lib/formula-governance/oracle/registry";

describe("formula-governance contracts", () => {
  test("rent vs buy contract is registered as critical", () => {
    const contract = getFormulaContractBySlug("rent-vs-buy-calculator");
    expect(contract?.riskLevel).toBe("critical");
    expect(contract?.oracleRequired).toBe(true);
  });

  test("rent vs buy contract declares mortgage and appreciation inputs", () => {
    expect(rentVsBuyContract.criticalInputs).toContain("mortgageInterestRate");
    expect(rentVsBuyContract.criticalInputs).toContain("annualHomeAppreciation");
  });
});

describe("formula-governance inventory", () => {
  test("inventory scans free traffic catalog", () => {
    const entries = buildFormulaInventory();
    expect(entries.length).toBeGreaterThanOrEqual(100);
    const summary = summarizeInventory(entries);
    expect(summary.critical).toBeGreaterThan(0);
  });

  test("rent vs buy is classified critical by heuristics", () => {
    expect(
      suggestRiskLevel({ slug: "rent-vs-buy-calculator", name: "Rent vs Buy Comparison" }),
    ).toBe("critical");
  });
});

describe("formula-governance audit runner", () => {
  test("rent vs buy audit returns FAIL (purpose mismatch + missing inputs)", () => {
    const report = runGovernanceAudit();
    const rent = report.results.find((r) => r.slug === "rent-vs-buy-calculator");
    expect(rent).toBeDefined();
    expect(rent?.status).toBe("FAIL");
    expect(rent?.findings.some((f) => f.code === "PURPOSE_MISMATCH")).toBe(true);
    expect(rent?.findings.some((f) => f.code === "CRIT_MISSING_INPUTS")).toBe(true);
  });

  test("strict mode would fail while critical tools lack contracts", () => {
    const report = runGovernanceAudit({ strict: true });
    expect(shouldFailStrictAudit(report)).toBe(true);
    expect(report.criticalToolsWithoutContract.length).toBeGreaterThan(0);
  });

  test("non-strict audit produces formatted report", () => {
    const report = runGovernanceAudit({ strict: false });
    const text = formatGovernanceAuditReport(report);
    expect(text).toContain("Formula Governance Audit Report");
    expect(text).toContain("rent-vs-buy-calculator");
    expect(text).toContain("Launch blockers");
  });

  test("rent vs buy oracle not registered in phase 1", () => {
    expect(hasOracleForTool("free-traffic.rent-vs-buy-calculator")).toBe(false);
  });
});
