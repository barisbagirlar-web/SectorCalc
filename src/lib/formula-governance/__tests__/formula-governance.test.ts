/**
 * Formula Assurance & Governance Platform — Phase 1 tests.
 */

import { describe, expect, test } from "vitest";
import {
  formatGovernanceAuditReport,
  runGovernanceAudit,
  shouldFailStrictAudit,
} from "@/lib/formula-governance/audit-runner";
import { rentVsBuyContract, getFormulaContractBySlug, FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import { TOP_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/top-critical";
import {
  BATCH_EXPANSION_CRITICAL_FORMULA_CONTRACTS,
  BATCH_EXPANSION_CRITICAL_SLUGS,
} from "@/lib/formula-governance/contracts/batch-expansion-critical";
import { buildFormulaInventory, summarizeInventory } from "@/lib/formula-governance/inventory";
import {
  buildContractGapReport,
  buildAuditPriorities,
} from "@/lib/formula-governance/contract-gap";
import { suggestRiskLevel } from "@/lib/formula-governance/risk-rules";
import {
  hasOracleForTool,
  isOraclePending,
  listFinanceOracleToolIds,
  listPendingOracleToolIds,
} from "@/lib/formula-governance/oracle/registry";
import { runContractScenarioTests } from "@/lib/formula-governance/scenario-runner";
import { FINANCE_ORACLE_SLUGS } from "@/lib/formula-governance/oracle/finance-oracles";
import { BUSINESS_OPERATIONS_ORACLE_SLUGS } from "@/lib/formula-governance/oracle/production-formula-locator";

const TOP_CRITICAL_SLUGS = [
  "loan-payment-calculator",
  "mortgage-calculator",
  "interest-calculator",
  "compound-interest-calculator",
  "profit-margin-calculator",
  "break-even-calculator",
  "salary-cost-calculator",
  "cash-flow-gap-calculator",
  "machine-time-calculator",
  "cnc-quote-risk-analyzer",
] as const;

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

  test("phase 5G-C registers 41 formula contracts", () => {
    expect(FORMULA_CONTRACTS.length).toBe(131);
    expect(TOP_CRITICAL_FORMULA_CONTRACTS.length).toBe(10);
    expect(BATCH_EXPANSION_CRITICAL_FORMULA_CONTRACTS.length).toBe(30);
  });

  test("phase 5C assured contracts wire runtime scenarios and property gate", () => {
    for (const slug of BUSINESS_OPERATIONS_ORACLE_SLUGS) {
      const contract = getFormulaContractBySlug(slug);
      expect(contract?.propertyTestsRegistered).toBe(true);
      expect(contract?.scenarioTests.every((s) => s.present)).toBe(true);
      const summary = runContractScenarioTests(slug);
      expect(summary.failed).toBe(0);
      expect(summary.passed).toBe(5);
    }
  });

  test("finance assured contracts wire runtime scenarios and property gate", () => {
    for (const slug of FINANCE_ORACLE_SLUGS) {
      const contract = getFormulaContractBySlug(slug);
      expect(contract?.propertyTestsRegistered).toBe(true);
      expect(contract?.scenarioTests.every((s) => s.present)).toBe(true);
      const summary = runContractScenarioTests(slug);
      expect(summary.failed).toBe(0);
      expect(summary.passed).toBe(5);
    }
  });

  test("top critical slugs resolve from registry", () => {
    for (const slug of TOP_CRITICAL_SLUGS) {
      expect(getFormulaContractBySlug(slug)?.slug).toBe(slug);
    }
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
  test("rent vs buy audit returns PASS or NEEDS_REVIEW after phase 5B model fix", () => {
    const report = runGovernanceAudit();
    const rent = report.results.find((r) => r.slug === "rent-vs-buy-calculator");
    expect(rent).toBeDefined();
    expect(rent?.status).not.toBe("FAIL");
    expect(rent?.findings.some((f) => f.code === "PURPOSE_MISMATCH")).toBe(false);
    expect(rent?.findings.some((f) => f.code === "CRIT_MISSING_INPUTS")).toBe(false);
    expect(rent?.findings.some((f) => f.code === "CRIT_ORACLE_MISSING")).toBe(false);
    expect(rent?.findings.some((f) => f.code === "CRIT_PROPERTY_TESTS")).toBe(false);
    expect(rent?.findings.some((f) => f.code === "CRIT_SCENARIO_TESTS")).toBe(false);
    expect(rent?.findings.some((f) => f.code === "ORACLE_COMPARISON_PASS")).toBe(true);
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

  test("rent vs buy oracle is registered in phase 5B", () => {
    expect(hasOracleForTool("free-traffic.rent-vs-buy-calculator")).toBe(true);
  });

  test("phase 4 registers finance oracles and clears pending list in phase 5C", () => {
    expect(listFinanceOracleToolIds().length).toBe(5);
    expect(listPendingOracleToolIds().length).toBe(0);
    expect(isOraclePending("free-traffic.loan-payment-calculator")).toBe(false);
    expect(isOraclePending("free-traffic.rent-vs-buy-calculator")).toBe(false);
    expect(isOraclePending("free-traffic.break-even-calculator")).toBe(false);
    expect(hasOracleForTool("free-traffic.loan-payment-calculator")).toBe(true);
    expect(hasOracleForTool("free-traffic.rent-vs-buy-calculator")).toBe(true);
    expect(hasOracleForTool("free-traffic.break-even-calculator")).toBe(true);
    expect(hasOracleForTool("revenue-premium.cnc-quote-risk-analyzer")).toBe(true);
  });

  test("phase 4 finance tools no longer report oracle missing", () => {
    const report = runGovernanceAudit();
    for (const slug of FINANCE_ORACLE_SLUGS) {
      const result = report.results.find((r) => r.slug === slug);
      expect(result).toBeDefined();
      expect(result?.findings.some((f) => f.code === "CRIT_ORACLE_MISSING")).toBe(false);
      expect(result?.findings.some((f) => f.code === "CRIT_PROPERTY_TESTS")).toBe(false);
      expect(result?.findings.some((f) => f.code === "CRIT_SCENARIO_TESTS")).toBe(false);
    }
  });

  test("phase 5A finance tools report oracle comparison pass", () => {
    const report = runGovernanceAudit();
    for (const slug of FINANCE_ORACLE_SLUGS) {
      const result = report.results.find((r) => r.slug === slug);
      expect(result?.findings.some((f) => f.code === "ORACLE_COMPARISON_PASS")).toBe(true);
      expect(result?.findings.some((f) => f.code === "ORACLE_COMPARISON_FAIL")).toBe(false);
      expect(result?.findings.some((f) => f.code === "ORACLE_COMPARISON_NEEDS_ADAPTER")).toBe(false);
    }
  });

  test("phase 5C business and operations tools clear oracle/scenario/property blockers", () => {
    const report = runGovernanceAudit();
    for (const slug of BUSINESS_OPERATIONS_ORACLE_SLUGS) {
      const result = report.results.find((r) => r.slug === slug);
      expect(result).toBeDefined();
      expect(result?.findings.some((f) => f.code === "CRIT_ORACLE_MISSING")).toBe(false);
      expect(result?.findings.some((f) => f.code === "CRIT_PROPERTY_TESTS")).toBe(false);
      expect(result?.findings.some((f) => f.code === "CRIT_SCENARIO_TESTS")).toBe(false);
      expect(result?.findings.some((f) => f.code === "ORACLE_COMPARISON_PASS")).toBe(true);
    }
  });

  test("phase 3 top critical audits are NEEDS_REVIEW under warning policy (not blanket PASS or FAIL)", () => {
    const report = runGovernanceAudit();
    for (const slug of TOP_CRITICAL_SLUGS) {
      const result = report.results.find((r) => r.slug === slug);
      expect(result).toBeDefined();
      expect(result?.status).toBe("NEEDS_REVIEW");
      expect(result?.findings.some((f) => f.code === "CRIT_UNRESOLVED_WARNINGS")).toBe(false);
      expect(result?.warningPolicySummary).toBeDefined();
    }
  });

  test("phase 5D audit report includes warning policy breakdown", () => {
    const report = runGovernanceAudit({ strict: false });
    const text = formatGovernanceAuditReport(report);
    expect(text).toContain("Critical NEEDS_REVIEW (warning policy):");
    expect(text).toContain("accepted=");
    expect(text).toContain("limitations=");
    expect(text).toContain("loan-payment-calculator");
  });

  test("premium-schema batch reduces critical missing contracts", () => {
    const summary = summarizeInventory(buildFormulaInventory());
    expect(summary.criticalMissingContracts.length).toBeGreaterThanOrEqual(0);
    expect(summary.criticalMissingContracts.length).toBeLessThanOrEqual(5);
  });
});
