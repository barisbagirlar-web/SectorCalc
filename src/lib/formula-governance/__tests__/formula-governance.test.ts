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
import {
  buildContractGapReport,
  buildAuditPriorities,
} from "@/lib/formula-governance/contract-gap";
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

  test("inventory scans free and premium sources (phase 2)", () => {
    const entries = buildFormulaInventory();
    const summary = summarizeInventory(entries);

    expect(summary.free).toBeGreaterThanOrEqual(100);
    expect(summary.premium).toBeGreaterThanOrEqual(27);
    expect(summary.premiumSchema).toBe(27);
    expect(entries.some((e) => e.tier === "premium-schema")).toBe(true);
    expect(entries.some((e) => e.tier === "revenue-premium")).toBe(true);
    expect(entries.some((e) => e.source === "risk-engine")).toBe(true);
  });

  test("rent vs buy is classified critical by heuristics", () => {
    expect(
      suggestRiskLevel({ slug: "rent-vs-buy-calculator", name: "Rent vs Buy Comparison" }),
    ).toBe("critical");
  });

  test("critical heuristics detect loan, mortgage, margin, break-even", () => {
    expect(suggestRiskLevel({ slug: "loan-calculator", name: "Loan Payment" })).toBe("critical");
    expect(suggestRiskLevel({ slug: "mortgage-estimator", name: "Mortgage Estimator" })).toBe(
      "critical",
    );
    expect(suggestRiskLevel({ slug: "menu-margin-tool", name: "Menu Margin Check" })).toBe(
      "critical",
    );
    expect(suggestRiskLevel({ slug: "break-even-calculator", name: "Break Even Point" })).toBe(
      "critical",
    );
  });

  test("high heuristics detect scrap, OEE, route, food waste", () => {
    expect(suggestRiskLevel({ slug: "sheet-metal-scrap", name: "Scrap Risk" })).toBe("high");
    expect(suggestRiskLevel({ slug: "cnc-oee-loss", name: "CNC OEE Loss" })).toBe("high");
    expect(suggestRiskLevel({ slug: "logistics-route-loss", name: "Route Loss" })).toBe("high");
    expect(suggestRiskLevel({ slug: "food-waste-tracker", name: "Food Waste Loss" })).toBe("high");
  });

  test("generated contract gap report has expected shape", () => {
    const entries = buildFormulaInventory();
    const gap = buildContractGapReport(entries);
    const priorities = buildAuditPriorities(entries, 20);

    expect(gap.generatedAt).toBeTruthy();
    expect(Array.isArray(gap.criticalWithoutContract)).toBe(true);
    expect(Array.isArray(gap.highWithoutContract)).toBe(true);
    expect(Array.isArray(gap.premiumWithoutGovernance)).toBe(true);
    expect(Array.isArray(gap.launchBlockers)).toBe(true);
    expect(priorities.length).toBeLessThanOrEqual(20);
    expect(priorities.every((entry) => !entry.hasContract)).toBe(true);
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
