/**
 * Production vs oracle comparison tests (Phase 5A).
 */

import { describe, expect, test } from "vitest";
import {
  compareProductionVsOracle,
  FINANCE_COMPARISON_SCENARIOS,
  runAllFinanceOracleComparisonAudits,
  runFinanceOracleComparisonAudit,
} from "@/lib/formula-governance/oracle/compare-production-oracle";
import { FINANCE_ORACLE_SLUGS } from "@/lib/formula-governance/oracle/finance-oracles";
import { FINANCE_PRODUCTION_FORMULA_LOCATORS } from "@/lib/formula-governance/oracle/production-formula-locator";

describe("production formula locator", () => {
  test("documents all five finance production paths", () => {
    expect(FINANCE_PRODUCTION_FORMULA_LOCATORS).toHaveLength(5);
    for (const slug of FINANCE_ORACLE_SLUGS) {
      const locator = FINANCE_PRODUCTION_FORMULA_LOCATORS.find((entry) => entry.slug === slug);
      expect(locator?.productionFilePath).toBe("src/lib/tools/free-traffic-calculators.ts");
      expect(locator?.productionFunctionName).toBe("calculateFreeTrafficTool");
      expect(locator?.comparisonWired).toBe(true);
    }
  });
});

describe("production vs oracle comparison", () => {
  for (const slug of FINANCE_ORACLE_SLUGS) {
    describe(slug, () => {
      const scenarios = FINANCE_COMPARISON_SCENARIOS[slug];

      test("has 3 normal, 1 edge, and 1 absurd scenario", () => {
        expect(scenarios.filter((s) => s.kind === "normal")).toHaveLength(3);
        expect(scenarios.filter((s) => s.kind === "edge")).toHaveLength(1);
        expect(scenarios.filter((s) => s.kind === "absurd")).toHaveLength(1);
      });

      for (const scenario of scenarios.filter((s) => s.kind === "normal" || s.kind === "edge")) {
        test(`${scenario.kind} scenario ${scenario.id} matches oracle`, () => {
          const result = compareProductionVsOracle({
            slug,
            scenarioId: scenario.id,
            values: scenario.values,
          });
          expect(result.status).toBe("PASS");
          expect(result.diffs).toHaveLength(0);
        });
      }

      test("absurd scenario diverges or rejects as expected", () => {
        const absurd = scenarios.find((s) => s.kind === "absurd");
        expect(absurd).toBeDefined();
        const result = compareProductionVsOracle({
          slug,
          scenarioId: absurd!.id,
          values: absurd!.values,
        });
        expect(result.status).not.toBe("PASS");
      });
    });
  }

  test("finance audit summaries pass comparable scenarios", () => {
    const summaries = runAllFinanceOracleComparisonAudits();
    expect(summaries).toHaveLength(5);
    for (const summary of summaries) {
      expect(summary.status).toBe("PASS");
      expect(summary.failCount).toBe(0);
      expect(summary.needsAdapterCount).toBe(0);
      expect(summary.passCount).toBe(4);
    }
  });

  test("individual slug audit returns ORACLE_COMPARISON_PASS status", () => {
    for (const slug of FINANCE_ORACLE_SLUGS) {
      const summary = runFinanceOracleComparisonAudit(slug);
      expect(summary.status).toBe("PASS");
    }
  });
});
