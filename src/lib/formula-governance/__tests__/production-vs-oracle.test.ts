/**
 * Production vs oracle comparison tests (Phase 5A).
 */

import { describe, expect, test } from "vitest";
import {
  compareProductionVsOracle,
  compareRentVsBuyProductionVsOracle,
  FINANCE_COMPARISON_SCENARIOS,
  RENT_VS_BUY_COMPARISON_SCENARIOS,
  runAllFinanceOracleComparisonAudits,
  runFinanceOracleComparisonAudit,
  runRentVsBuyOracleComparisonAudit,
} from "@/lib/formula-governance/oracle/compare-production-oracle";
import { FINANCE_ORACLE_SLUGS } from "@/lib/formula-governance/oracle/finance-oracles";
import {
  BUSINESS_OPERATIONS_ORACLE_SLUGS,
  BUSINESS_OPERATIONS_PRODUCTION_FORMULA_LOCATORS,
  FINANCE_PRODUCTION_FORMULA_LOCATORS,
} from "@/lib/formula-governance/oracle/production-formula-locator";
import {
  BUSINESS_OPERATIONS_COMPARISON_SCENARIOS,
  compareBusinessOperationsProductionVsOracle,
  runBusinessOperationsOracleComparisonAudit,
} from "@/lib/formula-governance/oracle/compare-business-operations-oracle";
import {
  BATCH_FREE_COMPARISON_SCENARIOS,
  BATCH_FREE_ORACLE_SLUGS,
  compareBatchFreeProductionVsOracle,
  runBatchFreeOracleComparisonAudit,
} from "@/lib/formula-governance/oracle/compare-batch-free-oracle";
import {
  BATCH_FREE_BATCH2_COMPARISON_SCENARIOS,
  BATCH_FREE_BATCH2_ORACLE_SLUGS,
  compareBatchFreeBatch2ProductionVsOracle,
  runBatchFreeBatch2OracleComparisonAudit,
} from "@/lib/formula-governance/oracle/compare-batch-free-batch2-oracle";
import {
  BATCH_FREE_BATCH2_PRODUCTION_FORMULA_LOCATORS,
  BATCH_FREE_PRODUCTION_FORMULA_LOCATORS,
  BATCH_PREMIUM_PRODUCTION_FORMULA_LOCATORS,
} from "@/lib/formula-governance/oracle/production-formula-locator";
import {
  BATCH_PREMIUM_COMPARISON_SCENARIOS,
  BATCH_PREMIUM_ORACLE_SLUGS,
  compareBatchPremiumProductionVsOracle,
  runBatchPremiumOracleComparisonAudit,
} from "@/lib/formula-governance/oracle/compare-batch-premium-oracle";

describe("production formula locator", () => {
  test("documents finance production paths including rent-vs-buy locator", () => {
    expect(FINANCE_PRODUCTION_FORMULA_LOCATORS).toHaveLength(6);
    for (const slug of FINANCE_ORACLE_SLUGS) {
      const locator = FINANCE_PRODUCTION_FORMULA_LOCATORS.find((entry) => entry.slug === slug);
      expect(locator?.productionFilePath).toBe("src/lib/tools/free-traffic-calculators.ts");
      expect(locator?.productionFunctionName).toBe("calculateFreeTrafficTool");
      expect(locator?.comparisonWired).toBe(true);
    }
    const rentVsBuy = FINANCE_PRODUCTION_FORMULA_LOCATORS.find(
      (entry) => entry.slug === "rent-vs-buy-calculator",
    );
    expect(rentVsBuy?.productionFilePath).toBe("src/lib/tools/free-traffic-calculators.ts");
    expect(rentVsBuy?.oracleFunctionName).toBe("calculateRentVsBuyOracle");
    expect(rentVsBuy?.comparisonWired).toBe(true);
  });

  test("documents all five business and operations production paths", () => {
    expect(BUSINESS_OPERATIONS_PRODUCTION_FORMULA_LOCATORS).toHaveLength(5);
    for (const slug of BUSINESS_OPERATIONS_ORACLE_SLUGS) {
      const locator = BUSINESS_OPERATIONS_PRODUCTION_FORMULA_LOCATORS.find((entry) => entry.slug === slug);
      expect(locator?.comparisonWired).toBe(true);
      expect(locator?.oracleFunctionName.length).toBeGreaterThan(0);
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

  test("all wired oracle audit summaries pass comparable scenarios", () => {
    const summaries = runAllFinanceOracleComparisonAudits();
    expect(summaries.length).toBeGreaterThan(280);
    for (const summary of summaries) {
      expect(summary.status).toBe("PASS");
      expect(summary.failCount).toBe(0);
      expect(summary.needsAdapterCount).toBe(0);
      expect(summary.passCount).toBeGreaterThan(0);
    }
  });

  test("individual slug audit returns ORACLE_COMPARISON_PASS status", () => {
    for (const slug of FINANCE_ORACLE_SLUGS) {
      const summary = runFinanceOracleComparisonAudit(slug);
      expect(summary.status).toBe("PASS");
    }
  });
});

describe("rent vs buy production vs oracle", () => {
  test("audit summary passes comparable scenarios", () => {
    const summary = runRentVsBuyOracleComparisonAudit();
    expect(summary.status).toBe("PASS");
    expect(summary.passCount).toBe(4);
    expect(summary.failCount).toBe(0);
  });

  for (const scenario of RENT_VS_BUY_COMPARISON_SCENARIOS.filter(
    (entry) => entry.kind === "normal" || entry.kind === "edge",
  )) {
    test(`${scenario.kind} scenario ${scenario.id} matches oracle`, () => {
      const result = compareRentVsBuyProductionVsOracle({
        scenarioId: scenario.id,
        values: scenario.values,
      });
      expect(result.status).toBe("PASS");
    });
  }

  test("invalid calendar year scenario diverges", () => {
    const absurd = RENT_VS_BUY_COMPARISON_SCENARIOS.find((s) => s.id === "invalid-calendar-year");
    expect(absurd).toBeDefined();
    const result = compareRentVsBuyProductionVsOracle({
      scenarioId: absurd!.id,
      values: absurd!.values,
    });
    expect(result.status).not.toBe("PASS");
  });

  test("all audits include rent vs buy", () => {
    const summaries = runAllFinanceOracleComparisonAudits();
    expect(summaries.some((summary) => summary.slug === "rent-vs-buy-calculator")).toBe(true);
    expect(summaries.some((summary) => summary.slug === "break-even-calculator")).toBe(true);
    expect(summaries.some((summary) => summary.slug === "cnc-quote-risk-analyzer")).toBe(true);
  });
});

describe("business and operations production vs oracle", () => {
  for (const slug of BUSINESS_OPERATIONS_ORACLE_SLUGS) {
    describe(slug, () => {
      const scenarios = BUSINESS_OPERATIONS_COMPARISON_SCENARIOS[slug];

      test("has 3 normal, 1 edge, and 1 absurd scenario", () => {
        expect(scenarios.filter((s) => s.kind === "normal")).toHaveLength(3);
        expect(scenarios.filter((s) => s.kind === "edge")).toHaveLength(1);
        expect(scenarios.filter((s) => s.kind === "absurd")).toHaveLength(1);
      });

      for (const scenario of scenarios.filter((s) => s.kind === "normal" || s.kind === "edge")) {
        test(`${scenario.kind} scenario ${scenario.id} matches oracle`, () => {
          const result = compareBusinessOperationsProductionVsOracle({
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
        const result = compareBusinessOperationsProductionVsOracle({
          slug,
          scenarioId: absurd!.id,
          values: absurd!.values,
        });
        expect(result.status).not.toBe("PASS");
      });

      test("audit summary passes comparable scenarios", () => {
        const summary = runBusinessOperationsOracleComparisonAudit(slug);
        expect(summary.status).toBe("PASS");
        expect(summary.passCount).toBe(4);
      });
    });
  }
});

describe("batch free production vs oracle", () => {
  test("documents all five batch free production paths", () => {
    expect(BATCH_FREE_PRODUCTION_FORMULA_LOCATORS).toHaveLength(5);
    for (const slug of BATCH_FREE_ORACLE_SLUGS) {
      const locator = BATCH_FREE_PRODUCTION_FORMULA_LOCATORS.find((entry) => entry.slug === slug);
      expect(locator?.comparisonWired).toBe(true);
      expect(locator?.oracleFunctionName.length).toBeGreaterThan(0);
    }
  });

  for (const slug of BATCH_FREE_ORACLE_SLUGS) {
    describe(slug, () => {
      const scenarios = BATCH_FREE_COMPARISON_SCENARIOS[slug];

      test("has 3 normal, 1 edge, and 1 absurd scenario", () => {
        expect(scenarios.filter((s) => s.kind === "normal")).toHaveLength(3);
        expect(scenarios.filter((s) => s.kind === "edge")).toHaveLength(1);
        expect(scenarios.filter((s) => s.kind === "absurd")).toHaveLength(1);
      });

      for (const scenario of scenarios.filter((s) => s.kind === "normal" || s.kind === "edge")) {
        test(`${scenario.kind} scenario ${scenario.id} matches oracle`, () => {
          const result = compareBatchFreeProductionVsOracle({
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
        const result = compareBatchFreeProductionVsOracle({
          slug,
          scenarioId: absurd!.id,
          values: absurd!.values,
        });
        expect(result.status).not.toBe("PASS");
      });

      test("audit summary passes comparable scenarios", () => {
        const summary = runBatchFreeOracleComparisonAudit(slug);
        expect(summary.status).toBe("PASS");
        expect(summary.passCount).toBe(4);
      });
    });
  }
});

describe("batch premium production vs oracle", () => {
  test("documents all five batch premium production paths", () => {
    expect(BATCH_PREMIUM_PRODUCTION_FORMULA_LOCATORS).toHaveLength(5);
    for (const slug of BATCH_PREMIUM_ORACLE_SLUGS) {
      const locator = BATCH_PREMIUM_PRODUCTION_FORMULA_LOCATORS.find((entry) => entry.slug === slug);
      expect(locator?.comparisonWired).toBe(true);
      expect(locator?.oracleFunctionName.length).toBeGreaterThan(0);
    }
  });

  for (const slug of BATCH_PREMIUM_ORACLE_SLUGS) {
    describe(slug, () => {
      const scenarios = BATCH_PREMIUM_COMPARISON_SCENARIOS[slug];

      test("has 3 normal, 1 edge, and 1 absurd scenario", () => {
        expect(scenarios.filter((s) => s.kind === "normal")).toHaveLength(3);
        expect(scenarios.filter((s) => s.kind === "edge")).toHaveLength(1);
        expect(scenarios.filter((s) => s.kind === "absurd")).toHaveLength(1);
      });

      for (const scenario of scenarios.filter((s) => s.kind === "normal" || s.kind === "edge")) {
        test(`${scenario.kind} scenario ${scenario.id} matches oracle`, () => {
          const result = compareBatchPremiumProductionVsOracle({
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
        const result = compareBatchPremiumProductionVsOracle({
          slug,
          scenarioId: absurd!.id,
          values: absurd!.values,
        });
        expect(result.status).not.toBe("PASS");
      });

      test("audit summary passes comparable scenarios", () => {
        const summary = runBatchPremiumOracleComparisonAudit(slug);
        expect(summary.status).toBe("PASS");
        expect(summary.passCount).toBe(4);
      });
    });
  }
});

describe("batch free batch-2 production vs oracle", () => {
  test("documents all ten batch-2 production paths", () => {
    expect(BATCH_FREE_BATCH2_PRODUCTION_FORMULA_LOCATORS).toHaveLength(10);
    for (const slug of BATCH_FREE_BATCH2_ORACLE_SLUGS) {
      const locator = BATCH_FREE_BATCH2_PRODUCTION_FORMULA_LOCATORS.find((entry) => entry.slug === slug);
      expect(locator?.comparisonWired).toBe(true);
      expect(locator?.oracleFunctionName.length).toBeGreaterThan(0);
    }
  });

  for (const slug of BATCH_FREE_BATCH2_ORACLE_SLUGS) {
    describe(slug, () => {
      const scenarios = BATCH_FREE_BATCH2_COMPARISON_SCENARIOS[slug];

      test("has 3 normal, 1 edge, and 1 absurd scenario", () => {
        expect(scenarios.filter((s) => s.kind === "normal")).toHaveLength(3);
        expect(scenarios.filter((s) => s.kind === "edge")).toHaveLength(1);
        expect(scenarios.filter((s) => s.kind === "absurd")).toHaveLength(1);
      });

      for (const scenario of scenarios.filter((s) => s.kind === "normal" || s.kind === "edge")) {
        test(`${scenario.kind} scenario ${scenario.id} matches oracle`, () => {
          const result = compareBatchFreeBatch2ProductionVsOracle({
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
        const result = compareBatchFreeBatch2ProductionVsOracle({
          slug,
          scenarioId: absurd!.id,
          values: absurd!.values,
        });
        expect(result.status).not.toBe("PASS");
      });

      test("audit summary passes comparable scenarios", () => {
        const summary = runBatchFreeBatch2OracleComparisonAudit(slug);
        expect(summary.status).toBe("PASS");
        expect(summary.passCount).toBe(4);
      });
    });
  }
});
