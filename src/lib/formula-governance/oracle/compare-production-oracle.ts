/**
 * Production vs oracle comparison runner (Phase 5A).
 * Does not mutate production calculators or oracle baselines.
 */

import type { FreeTrafficInputValues } from "@/lib/tools/free-traffic-calculators";
import {
  calculateCompoundInterestOracle,
  calculateLoanPaymentOracle,
  calculateMortgagePaymentOracle,
  calculateProfitMarginOracle,
  calculateSimpleInterestOracle,
  FINANCE_ORACLE_SLUGS,
  isFinanceOracleSlug,
  type FinanceOracleSlug,
} from "@/lib/formula-governance/oracle/finance-oracles";
import { getProductionFormulaLocator } from "@/lib/formula-governance/oracle/production-formula-locator";
import {
  adaptProductionFinanceOutput,
  type NormalizedFinanceProductionOutput,
} from "@/lib/formula-governance/oracle/production-adapters";
import { hasOracleForTool } from "@/lib/formula-governance/oracle/registry";
import { OracleValidationError } from "@/lib/formula-governance/oracle/oracle-types";

export type OracleComparisonStatus = "PASS" | "FAIL" | "NEEDS_ADAPTER" | "NOT_WIRED";

export type FieldComparisonDiff = {
  readonly field: string;
  readonly production: number;
  readonly oracle: number;
  readonly delta: number;
  readonly tolerance: number;
};

export type OracleComparisonResult = {
  readonly slug: FinanceOracleSlug;
  readonly toolId: string;
  readonly scenarioId: string;
  readonly status: OracleComparisonStatus;
  readonly diffs: readonly FieldComparisonDiff[];
  readonly message?: string;
};

export type OracleComparisonAuditSummary = {
  readonly slug: FinanceOracleSlug;
  readonly toolId: string;
  readonly status: OracleComparisonStatus;
  readonly passCount: number;
  readonly failCount: number;
  readonly needsAdapterCount: number;
  readonly notWiredCount: number;
  readonly results: readonly OracleComparisonResult[];
};

export const CURRENCY_TOLERANCE = 0.01;
export const PERCENT_TOLERANCE = 0.01;
export const RATIO_TOLERANCE = 0.0001;

type ComparableField = {
  readonly field: string;
  readonly production: number;
  readonly oracle: number;
  readonly tolerance: number;
};

function compareNumericFields(fields: readonly ComparableField[]): {
  readonly passed: boolean;
  readonly diffs: readonly FieldComparisonDiff[];
} {
  const diffs: FieldComparisonDiff[] = [];
  for (const entry of fields) {
    const delta = Math.abs(entry.production - entry.oracle);
    if (delta > entry.tolerance) {
      diffs.push({
        field: entry.field,
        production: entry.production,
        oracle: entry.oracle,
        delta,
        tolerance: entry.tolerance,
      });
    }
  }
  return { passed: diffs.length === 0, diffs };
}

function buildOracleOutput(
  slug: FinanceOracleSlug,
  values: FreeTrafficInputValues,
): NormalizedFinanceProductionOutput {
  switch (slug) {
    case "loan-payment-calculator": {
      const oracle = calculateLoanPaymentOracle({
        principal: Number(values.principal),
        annualRate: Number(values.annualRate),
        months: Number(values.months),
      });
      return { monthlyPayment: oracle.monthlyPayment };
    }
    case "mortgage-calculator": {
      const oracle = calculateMortgagePaymentOracle({
        principal: Number(values.principal),
        annualRate: Number(values.annualRate),
        months: Number(values.months),
      });
      return {
        monthlyPayment: oracle.monthlyPayment,
        totalPaid: oracle.totalPaid,
        totalInterest: oracle.totalInterest,
      };
    }
    case "interest-calculator": {
      const oracle = calculateSimpleInterestOracle({
        principal: Number(values.principal),
        ratePercent: Number(values.ratePercent),
        years: Number(values.years),
      });
      return {
        interestAmount: oracle.interestAmount,
        totalRepayment: oracle.totalRepayment,
      };
    }
    case "compound-interest-calculator": {
      const oracle = calculateCompoundInterestOracle({
        principal: Number(values.principal),
        annualRate: Number(values.annualRate),
        years: Number(values.years),
        compoundsPerYear: Number(values.compoundsPerYear),
      });
      return {
        futureValue: oracle.futureValue,
        interestEarned: oracle.interestEarned,
      };
    }
    case "profit-margin-calculator": {
      const oracle = calculateProfitMarginOracle({
        sellingPrice: Number(values.sellingPrice),
        cost: Number(values.cost),
      });
      return {
        marginPercent: oracle.marginPercent,
        markupPercent: oracle.markupPercent,
      };
    }
    default: {
      const unsupported: never = slug;
      throw new Error(`Unsupported finance slug: ${unsupported}`);
    }
  }
}

function compareNormalizedOutputs(
  slug: FinanceOracleSlug,
  production: NormalizedFinanceProductionOutput,
  oracle: NormalizedFinanceProductionOutput,
): { readonly passed: boolean; readonly diffs: readonly FieldComparisonDiff[] } {
  switch (slug) {
    case "loan-payment-calculator": {
      const prod = production as { monthlyPayment: number };
      const orc = oracle as { monthlyPayment: number };
      return compareNumericFields([
        {
          field: "monthlyPayment",
          production: prod.monthlyPayment,
          oracle: orc.monthlyPayment,
          tolerance: CURRENCY_TOLERANCE,
        },
      ]);
    }
    case "mortgage-calculator": {
      const prod = production as {
        monthlyPayment: number;
        totalPaid: number;
        totalInterest: number;
      };
      const orc = oracle as {
        monthlyPayment: number;
        totalPaid: number;
        totalInterest: number;
      };
      return compareNumericFields([
        {
          field: "monthlyPayment",
          production: prod.monthlyPayment,
          oracle: orc.monthlyPayment,
          tolerance: CURRENCY_TOLERANCE,
        },
        {
          field: "totalPaid",
          production: prod.totalPaid,
          oracle: orc.totalPaid,
          tolerance: CURRENCY_TOLERANCE,
        },
        {
          field: "totalInterest",
          production: prod.totalInterest,
          oracle: orc.totalInterest,
          tolerance: CURRENCY_TOLERANCE,
        },
      ]);
    }
    case "interest-calculator": {
      const prod = production as { interestAmount: number; totalRepayment: number };
      const orc = oracle as { interestAmount: number; totalRepayment: number };
      return compareNumericFields([
        {
          field: "interestAmount",
          production: prod.interestAmount,
          oracle: orc.interestAmount,
          tolerance: CURRENCY_TOLERANCE,
        },
        {
          field: "totalRepayment",
          production: prod.totalRepayment,
          oracle: orc.totalRepayment,
          tolerance: CURRENCY_TOLERANCE,
        },
      ]);
    }
    case "compound-interest-calculator": {
      const prod = production as { futureValue: number; interestEarned: number };
      const orc = oracle as { futureValue: number; interestEarned: number };
      return compareNumericFields([
        {
          field: "futureValue",
          production: prod.futureValue,
          oracle: orc.futureValue,
          tolerance: CURRENCY_TOLERANCE,
        },
        {
          field: "interestEarned",
          production: prod.interestEarned,
          oracle: orc.interestEarned,
          tolerance: CURRENCY_TOLERANCE,
        },
      ]);
    }
    case "profit-margin-calculator": {
      const prod = production as { marginPercent: number; markupPercent: number };
      const orc = oracle as { marginPercent: number; markupPercent: number };
      return compareNumericFields([
        {
          field: "marginPercent",
          production: prod.marginPercent,
          oracle: orc.marginPercent,
          tolerance: PERCENT_TOLERANCE,
        },
        {
          field: "markupPercent",
          production: prod.markupPercent,
          oracle: orc.markupPercent,
          tolerance: PERCENT_TOLERANCE,
        },
      ]);
    }
    default:
      return { passed: false, diffs: [] };
  }
}

export function compareProductionVsOracle(input: {
  readonly slug: FinanceOracleSlug;
  readonly scenarioId: string;
  readonly values: FreeTrafficInputValues;
}): OracleComparisonResult {
  const locator = getProductionFormulaLocator(input.slug);
  const toolId = locator?.toolId ?? `free-traffic.${input.slug}`;

  if (!locator?.comparisonWired || !hasOracleForTool(toolId)) {
    return {
      slug: input.slug,
      toolId,
      scenarioId: input.scenarioId,
      status: "NOT_WIRED",
      diffs: [],
      message: "Production vs oracle comparison is not wired for this tool.",
    };
  }

  const adapted = adaptProductionFinanceOutput(input.slug, input.values);
  if (adapted.status === "needs_adapter") {
    return {
      slug: input.slug,
      toolId,
      scenarioId: input.scenarioId,
      status: "NEEDS_ADAPTER",
      diffs: [],
      message: adapted.reason,
    };
  }
  if (adapted.status === "error") {
    return {
      slug: input.slug,
      toolId,
      scenarioId: input.scenarioId,
      status: "FAIL",
      diffs: [],
      message: `Production calculator error: ${adapted.reason}`,
    };
  }

  try {
    const oracleOutput = buildOracleOutput(input.slug, input.values);
    const comparison = compareNormalizedOutputs(input.slug, adapted.output, oracleOutput);
    if (!comparison.passed) {
      return {
        slug: input.slug,
        toolId,
        scenarioId: input.scenarioId,
        status: "FAIL",
        diffs: comparison.diffs,
        message: `Field mismatch: ${comparison.diffs.map((d) => d.field).join(", ")}`,
      };
    }
    return {
      slug: input.slug,
      toolId,
      scenarioId: input.scenarioId,
      status: "PASS",
      diffs: [],
    };
  } catch (error) {
    if (error instanceof OracleValidationError) {
      return {
        slug: input.slug,
        toolId,
        scenarioId: input.scenarioId,
        status: "FAIL",
        diffs: [],
        message: `Oracle rejected input while production accepted it: ${error.message}`,
      };
    }
    throw error;
  }
}

export type FinanceComparisonScenario = {
  readonly id: string;
  readonly kind: "normal" | "edge" | "absurd";
  readonly values: FreeTrafficInputValues;
  readonly expectPass?: boolean;
};

export const FINANCE_COMPARISON_SCENARIOS: Record<FinanceOracleSlug, readonly FinanceComparisonScenario[]> = {
  "loan-payment-calculator": [
    {
      id: "normal-consumer-30yr",
      kind: "normal",
      values: { principal: 250_000, annualRate: 6.25, months: 360 },
    },
    {
      id: "normal-auto-5yr",
      kind: "normal",
      values: { principal: 35_000, annualRate: 4.9, months: 60 },
    },
    {
      id: "normal-small-personal",
      kind: "normal",
      values: { principal: 8_000, annualRate: 9.5, months: 36 },
    },
    {
      id: "edge-zero-rate",
      kind: "edge",
      values: { principal: 120_000, annualRate: 0, months: 120 },
    },
    {
      id: "absurd-zero-term",
      kind: "absurd",
      values: { principal: 50_000, annualRate: 5, months: 0 },
      expectPass: false,
    },
  ],
  "mortgage-calculator": [
    {
      id: "normal-30yr-fixed",
      kind: "normal",
      values: { principal: 420_000, annualRate: 6.75, months: 360 },
    },
    {
      id: "normal-15yr-fixed",
      kind: "normal",
      values: { principal: 280_000, annualRate: 5.5, months: 180 },
    },
    {
      id: "normal-starter-home",
      kind: "normal",
      values: { principal: 180_000, annualRate: 7.1, months: 360 },
    },
    {
      id: "edge-low-rate",
      kind: "edge",
      values: { principal: 300_000, annualRate: 0.5, months: 360 },
    },
    {
      id: "absurd-negative-rate",
      kind: "absurd",
      values: { principal: 200_000, annualRate: -2, months: 360 },
      expectPass: false,
    },
  ],
  "interest-calculator": [
    {
      id: "normal-1yr-loan",
      kind: "normal",
      values: { principal: 10_000, ratePercent: 5, years: 1 },
    },
    {
      id: "normal-3yr-note",
      kind: "normal",
      values: { principal: 25_000, ratePercent: 6.5, years: 3 },
    },
    {
      id: "normal-small-deposit",
      kind: "normal",
      values: { principal: 2_500, ratePercent: 4, years: 2 },
    },
    {
      id: "edge-low-rate",
      kind: "edge",
      values: { principal: 15_000, ratePercent: 0.25, years: 5 },
    },
    {
      id: "absurd-zero-years",
      kind: "absurd",
      values: { principal: 5_000, ratePercent: 5, years: 0 },
      expectPass: false,
    },
  ],
  "compound-interest-calculator": [
    {
      id: "normal-monthly-10yr",
      kind: "normal",
      values: { principal: 10_000, annualRate: 6, years: 10, compoundsPerYear: 12 },
    },
    {
      id: "normal-quarterly-5yr",
      kind: "normal",
      values: { principal: 5_000, annualRate: 4.5, years: 5, compoundsPerYear: 4 },
    },
    {
      id: "normal-annual-20yr",
      kind: "normal",
      values: { principal: 20_000, annualRate: 5, years: 20, compoundsPerYear: 1 },
    },
    {
      id: "edge-zero-rate",
      kind: "edge",
      values: { principal: 7_500, annualRate: 0, years: 8, compoundsPerYear: 12 },
    },
    {
      id: "absurd-zero-compounds",
      kind: "absurd",
      values: { principal: 1_000, annualRate: 5, years: 1, compoundsPerYear: 0 },
      expectPass: false,
    },
  ],
  "profit-margin-calculator": [
    {
      id: "normal-retail-sku",
      kind: "normal",
      values: { sellingPrice: 100, cost: 70 },
    },
    {
      id: "normal-service-job",
      kind: "normal",
      values: { sellingPrice: 450, cost: 275 },
    },
    {
      id: "normal-thin-margin",
      kind: "normal",
      values: { sellingPrice: 50, cost: 47.5 },
    },
    {
      id: "edge-break-even",
      kind: "edge",
      values: { sellingPrice: 120, cost: 120 },
    },
    {
      id: "absurd-zero-price",
      kind: "absurd",
      values: { sellingPrice: 0, cost: 10 },
      expectPass: false,
    },
  ],
};

export function runFinanceOracleComparisonAudit(
  slug: FinanceOracleSlug,
): OracleComparisonAuditSummary {
  const locator = getProductionFormulaLocator(slug);
  const toolId = locator?.toolId ?? `free-traffic.${slug}`;
  const scenarios = FINANCE_COMPARISON_SCENARIOS[slug] ?? [];
  const comparableScenarios = scenarios.filter((scenario) => scenario.expectPass !== false);

  if (!locator?.comparisonWired || !hasOracleForTool(toolId)) {
    return {
      slug,
      toolId,
      status: "NOT_WIRED",
      passCount: 0,
      failCount: 0,
      needsAdapterCount: 0,
      notWiredCount: scenarios.length,
      results: scenarios.map((scenario) => ({
        slug,
        toolId,
        scenarioId: scenario.id,
        status: "NOT_WIRED" as const,
        diffs: [],
      })),
    };
  }

  const results = comparableScenarios.map((scenario) =>
    compareProductionVsOracle({
      slug,
      scenarioId: scenario.id,
      values: scenario.values,
    }),
  );

  const passCount = results.filter((result) => result.status === "PASS").length;
  const failCount = results.filter((result) => result.status === "FAIL").length;
  const needsAdapterCount = results.filter((result) => result.status === "NEEDS_ADAPTER").length;

  let status: OracleComparisonStatus = "PASS";
  if (needsAdapterCount > 0) {
    status = "NEEDS_ADAPTER";
  } else if (failCount > 0) {
    status = "FAIL";
  } else if (passCount === 0) {
    status = "NOT_WIRED";
  }

  return {
    slug,
    toolId,
    status,
    passCount,
    failCount,
    needsAdapterCount,
    notWiredCount: 0,
    results,
  };
}

export function runAllFinanceOracleComparisonAudits(): readonly OracleComparisonAuditSummary[] {
  return FINANCE_ORACLE_SLUGS.map((slug) => runFinanceOracleComparisonAudit(slug));
}

export function auditOracleComparisonForSlug(slug: string): OracleComparisonAuditSummary | null {
  if (!isFinanceOracleSlug(slug)) {
    return null;
  }
  return runFinanceOracleComparisonAudit(slug);
}

export function comparisonStatusToAuditCode(
  status: OracleComparisonStatus,
): "ORACLE_COMPARISON_PASS" | "ORACLE_COMPARISON_FAIL" | "ORACLE_COMPARISON_NEEDS_ADAPTER" | "ORACLE_COMPARISON_NOT_WIRED" {
  switch (status) {
    case "PASS":
      return "ORACLE_COMPARISON_PASS";
    case "FAIL":
      return "ORACLE_COMPARISON_FAIL";
    case "NEEDS_ADAPTER":
      return "ORACLE_COMPARISON_NEEDS_ADAPTER";
    case "NOT_WIRED":
      return "ORACLE_COMPARISON_NOT_WIRED";
  }
}
