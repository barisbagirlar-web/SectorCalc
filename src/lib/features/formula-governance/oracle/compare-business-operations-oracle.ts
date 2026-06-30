/**
 * Business & operations production vs oracle comparison (Phase 5C).
 */

import type { FreeTrafficInputValues } from "@/lib/features/tools/free-traffic-calculators";
import type { PremiumInputValues } from "@/lib/features/tools/premium-decision-engine";
import {
  calculateBreakEvenOracle,
  calculateCashFlowGapOracle,
  calculateSalaryCostOracle,
  isBusinessOracleSlug,
  type BusinessOracleSlug,
} from "@/lib/features/formula-governance/oracle/business-oracles";
import {
  calculateCncQuoteRiskOracle,
  calculateMachineTimeOracle,
  isOperationsOracleSlug,
  type OperationsOracleSlug,
} from "@/lib/features/formula-governance/oracle/operations-oracles";
import {
  adaptProductionBusinessOperationsOutput,
  type NormalizedBreakEvenProductionOutput,
  type NormalizedBusinessOperationsProductionOutput,
  type NormalizedCashFlowGapProductionOutput,
  type NormalizedCncQuoteRiskProductionOutput,
  type NormalizedMachineTimeProductionOutput,
  type NormalizedSalaryCostProductionOutput,
} from "@/lib/features/formula-governance/oracle/production-adapters";
import {
  BUSINESS_OPERATIONS_ORACLE_SLUGS,
  getBusinessOperationsProductionFormulaLocator,
  type BusinessOperationsOracleSlug,
} from "@/lib/features/formula-governance/oracle/production-formula-locator";
import { hasOracleForTool } from "@/lib/features/formula-governance/oracle/registry";
import { OracleValidationError } from "@/lib/features/formula-governance/oracle/oracle-types";
import type {
  FieldComparisonDiff,
  OracleComparisonAuditSummary,
  OracleComparisonResult,
  OracleComparisonStatus,
} from "@/lib/features/formula-governance/oracle/compare-production-oracle";

export { BUSINESS_OPERATIONS_ORACLE_SLUGS };

const CURRENCY_TOLERANCE = 0.01;

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

export type BusinessOperationsComparisonScenario = {
  readonly id: string;
  readonly kind: "normal" | "edge" | "absurd";
  readonly values: FreeTrafficInputValues | PremiumInputValues;
  readonly expectPass?: boolean;
};

function buildBusinessOracleOutput(
  slug: BusinessOracleSlug,
  values: FreeTrafficInputValues,
): NormalizedBreakEvenProductionOutput | NormalizedSalaryCostProductionOutput | NormalizedCashFlowGapProductionOutput {
  switch (slug) {
    case "break-even-calculator": {
      const oracle = calculateBreakEvenOracle({
        fixedCost: Number(values.fixedCost),
        unitPrice: Number(values.unitPrice),
        variableCost: Number(values.variableCost),
      });
      return oracle;
    }
    case "salary-cost-calculator": {
      return calculateSalaryCostOracle({
        grossSalary: Number(values.grossSalary),
        employerRatePercent: Number(values.employerRatePercent),
      });
    }
    case "cash-flow-gap-calculator": {
      return calculateCashFlowGapOracle({
        receivablesDays: Number(values.receivablesDays),
        payableDays: Number(values.payableDays),
        dailyCost: Number(values.dailyCost),
      });
    }
    default: {
      const unsupported: never = slug;
      throw new Error(`Unsupported business slug: ${unsupported}`);
    }
  }
}

function buildOperationsOracleOutput(
  slug: OperationsOracleSlug,
  values: FreeTrafficInputValues | PremiumInputValues,
): NormalizedMachineTimeProductionOutput | NormalizedCncQuoteRiskProductionOutput {
  switch (slug) {
    case "machine-time-calculator": {
      const input = values as FreeTrafficInputValues;
      return calculateMachineTimeOracle({
        setupMinutes: Number(input.setupMinutes),
        cycleSeconds: Number(input.cycleSeconds),
        quantity: Number(input.quantity),
        machineRate: Number(input.machineRate),
      });
    }
    case "cnc-quote-risk-analyzer": {
      const input = values as PremiumInputValues;
      return calculateCncQuoteRiskOracle({
        setupTime: Number(input.setupTime),
        cycleTime: Number(input.cycleTime),
        quantity: Number(input.quantity),
        toolCost: Number(input.toolCost),
        materialCost: Number(input.materialCost),
        machineRate: Number(input.machineRate),
        scrapRatePercent:
          input.scrapRatePercent !== undefined
            ? Number(input.scrapRatePercent)
            : input.scrapRate !== undefined
              ? Number(input.scrapRate)
              : undefined,
      });
    }
    default: {
      const unsupported: never = slug;
      throw new Error(`Unsupported operations slug: ${unsupported}`);
    }
  }
}

function compareBusinessOperationsNormalized(
  slug: BusinessOperationsOracleSlug,
  production:
    | NormalizedBreakEvenProductionOutput
    | NormalizedSalaryCostProductionOutput
    | NormalizedCashFlowGapProductionOutput
    | NormalizedMachineTimeProductionOutput
    | NormalizedCncQuoteRiskProductionOutput,
  oracle:
    | NormalizedBreakEvenProductionOutput
    | NormalizedSalaryCostProductionOutput
    | NormalizedCashFlowGapProductionOutput
    | NormalizedMachineTimeProductionOutput
    | NormalizedCncQuoteRiskProductionOutput,
): { readonly passed: boolean; readonly diffs: readonly FieldComparisonDiff[] } {
  switch (slug) {
    case "break-even-calculator": {
      const prod = production as NormalizedBreakEvenProductionOutput;
      const orc = oracle as NormalizedBreakEvenProductionOutput;
      return compareNumericFields([
        { field: "breakEvenUnits", production: prod.breakEvenUnits, oracle: orc.breakEvenUnits, tolerance: 1 },
        {
          field: "contributionMargin",
          production: prod.contributionMargin,
          oracle: orc.contributionMargin,
          tolerance: CURRENCY_TOLERANCE,
        },
      ]);
    }
    case "salary-cost-calculator": {
      const prod = production as NormalizedSalaryCostProductionOutput;
      const orc = oracle as NormalizedSalaryCostProductionOutput;
      return compareNumericFields([
        {
          field: "totalEmployerCost",
          production: prod.totalEmployerCost,
          oracle: orc.totalEmployerCost,
          tolerance: CURRENCY_TOLERANCE,
        },
      ]);
    }
    case "cash-flow-gap-calculator": {
      const prod = production as NormalizedCashFlowGapProductionOutput;
      const orc = oracle as NormalizedCashFlowGapProductionOutput;
      return compareNumericFields([
        { field: "gapDays", production: prod.gapDays, oracle: orc.gapDays, tolerance: 0.01 },
        {
          field: "workingCapitalGap",
          production: prod.workingCapitalGap,
          oracle: orc.workingCapitalGap,
          tolerance: CURRENCY_TOLERANCE,
        },
      ]);
    }
    case "machine-time-calculator": {
      const prod = production as NormalizedMachineTimeProductionOutput;
      const orc = oracle as NormalizedMachineTimeProductionOutput;
      return compareNumericFields([
        { field: "totalMinutes", production: prod.totalMinutes, oracle: orc.totalMinutes, tolerance: 0.01 },
        { field: "machineCost", production: prod.machineCost, oracle: orc.machineCost, tolerance: CURRENCY_TOLERANCE },
      ]);
    }
    case "cnc-quote-risk-analyzer": {
      const prod = production as NormalizedCncQuoteRiskProductionOutput;
      const orc = oracle as NormalizedCncQuoteRiskProductionOutput;
      return compareNumericFields([
        { field: "baseCost", production: prod.baseCost, oracle: orc.baseCost, tolerance: CURRENCY_TOLERANCE },
      ]);
    }
    default: {
      const unsupported: never = slug;
      throw new Error(`Unsupported slug: ${unsupported}`);
    }
  }
}

export const BUSINESS_OPERATIONS_COMPARISON_SCENARIOS: Record<
  BusinessOperationsOracleSlug,
  readonly BusinessOperationsComparisonScenario[]
> = {
  "break-even-calculator": [
    {
      id: "normal-standard",
      kind: "normal",
      values: { fixedCost: 50_000, unitPrice: 100, variableCost: 60 },
    },
    {
      id: "normal-thin-margin",
      kind: "normal",
      values: { fixedCost: 12_000, unitPrice: 55, variableCost: 40 },
    },
    {
      id: "normal-high-fixed",
      kind: "normal",
      values: { fixedCost: 250_000, unitPrice: 200, variableCost: 95 },
    },
    {
      id: "edge-zero-fixed",
      kind: "edge",
      values: { fixedCost: 0, unitPrice: 80, variableCost: 35 },
    },
    {
      id: "absurd-negative-contribution",
      kind: "absurd",
      values: { fixedCost: 10_000, unitPrice: 50, variableCost: 60 },
      expectPass: false,
    },
  ],
  "salary-cost-calculator": [
    {
      id: "normal-burden-20",
      kind: "normal",
      values: { grossSalary: 5000, employerRatePercent: 20 },
    },
    {
      id: "normal-burden-35",
      kind: "normal",
      values: { grossSalary: 8200, employerRatePercent: 35 },
    },
    {
      id: "normal-low-burden",
      kind: "normal",
      values: { grossSalary: 4500, employerRatePercent: 8 },
    },
    {
      id: "edge-zero-burden",
      kind: "edge",
      values: { grossSalary: 6000, employerRatePercent: 0 },
    },
    {
      id: "absurd-negative-salary",
      kind: "absurd",
      values: { grossSalary: -1000, employerRatePercent: 20 },
      expectPass: false,
    },
  ],
  "cash-flow-gap-calculator": [
    {
      id: "normal-receivables-longer",
      kind: "normal",
      values: { receivablesDays: 45, payableDays: 30, dailyCost: 1000 },
    },
    {
      id: "normal-wide-gap",
      kind: "normal",
      values: { receivablesDays: 60, payableDays: 20, dailyCost: 2500 },
    },
    {
      id: "normal-tight-gap",
      kind: "normal",
      values: { receivablesDays: 35, payableDays: 28, dailyCost: 750 },
    },
    {
      id: "edge-balanced-days",
      kind: "edge",
      values: { receivablesDays: 30, payableDays: 30, dailyCost: 1200 },
    },
    {
      id: "absurd-negative-days",
      kind: "absurd",
      values: { receivablesDays: -5, payableDays: 30, dailyCost: 1000 },
      expectPass: false,
    },
  ],
  "machine-time-calculator": [
    {
      id: "normal-batch",
      kind: "normal",
      values: { setupMinutes: 30, cycleSeconds: 45, quantity: 100, machineRate: 85 },
    },
    {
      id: "normal-setup-heavy",
      kind: "normal",
      values: { setupMinutes: 120, cycleSeconds: 30, quantity: 25, machineRate: 95 },
    },
    {
      id: "normal-fast-cycle",
      kind: "normal",
      values: { setupMinutes: 15, cycleSeconds: 12, quantity: 500, machineRate: 70 },
    },
    {
      id: "edge-single-part",
      kind: "edge",
      values: { setupMinutes: 90, cycleSeconds: 180, quantity: 1, machineRate: 110 },
    },
    {
      id: "absurd-zero-quantity",
      kind: "absurd",
      values: { setupMinutes: 30, cycleSeconds: 45, quantity: 0, machineRate: 85 },
      expectPass: false,
    },
  ],
  "cnc-quote-risk-analyzer": [
    {
      id: "normal-low-volume",
      kind: "normal",
      values: {
        setupTime: 90,
        cycleTime: 2.5,
        quantity: 50,
        toolCost: 400,
        materialCost: 800,
        machineRate: 95,
      },
    },
    {
      id: "normal-prototype",
      kind: "normal",
      values: {
        setupTime: 120,
        cycleTime: 4,
        quantity: 10,
        toolCost: 650,
        materialCost: 1200,
        machineRate: 110,
      },
    },
    {
      id: "normal-production-run",
      kind: "normal",
      values: {
        setupTime: 60,
        cycleTime: 1.8,
        quantity: 200,
        toolCost: 300,
        materialCost: 1500,
        machineRate: 88,
      },
    },
    {
      id: "edge-setup-heavy",
      kind: "edge",
      values: {
        setupTime: 240,
        cycleTime: 1.2,
        quantity: 5,
        toolCost: 900,
        materialCost: 500,
        machineRate: 100,
      },
    },
    {
      id: "absurd-zero-rate",
      kind: "absurd",
      values: {
        setupTime: 90,
        cycleTime: 2.5,
        quantity: 50,
        toolCost: 400,
        materialCost: 800,
        machineRate: 0,
      },
      expectPass: false,
    },
  ],
};

export function compareBusinessOperationsProductionVsOracle(input: {
  readonly slug: BusinessOperationsOracleSlug;
  readonly scenarioId: string;
  readonly values: FreeTrafficInputValues | PremiumInputValues;
}): OracleComparisonResult {
  const locator = getBusinessOperationsProductionFormulaLocator(input.slug);
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

  const adapted = adaptProductionBusinessOperationsOutput(input.slug, input.values);
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
      message: adapted.reason,
    };
  }

  try {
    const oracleOutput = isBusinessOracleSlug(input.slug)
      ? buildBusinessOracleOutput(input.slug, input.values as FreeTrafficInputValues)
      : buildOperationsOracleOutput(input.slug, input.values);

    const comparison = compareBusinessOperationsNormalized(
      input.slug,
      adapted.output as NormalizedBusinessOperationsProductionOutput,
      oracleOutput,
    );
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
    return { slug: input.slug, toolId, scenarioId: input.scenarioId, status: "PASS", diffs: [] };
  } catch (error) {
    if (error instanceof OracleValidationError) {
      return {
        slug: input.slug,
        toolId,
        scenarioId: input.scenarioId,
        status: "FAIL",
        diffs: [],
        message: error.message,
      };
    }
    throw error;
  }
}

export function runBusinessOperationsOracleComparisonAudit(
  slug: BusinessOperationsOracleSlug,
): OracleComparisonAuditSummary {
  const locator = getBusinessOperationsProductionFormulaLocator(slug);
  const toolId = locator?.toolId ?? `free-traffic.${slug}`;
  const scenarios = BUSINESS_OPERATIONS_COMPARISON_SCENARIOS[slug] ?? [];
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
    compareBusinessOperationsProductionVsOracle({
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

export function runAllBusinessOperationsOracleComparisonAudits(): readonly OracleComparisonAuditSummary[] {
  return BUSINESS_OPERATIONS_ORACLE_SLUGS.map((slug) => runBusinessOperationsOracleComparisonAudit(slug));
}

export function isBusinessOperationsComparisonSlug(slug: string): slug is BusinessOperationsOracleSlug {
  return isBusinessOracleSlug(slug) || isOperationsOracleSlug(slug);
}
