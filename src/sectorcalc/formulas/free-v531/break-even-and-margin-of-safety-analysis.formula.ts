// SECTORCALC FREE V5.3.1 SERVER-ONLY FORMULA MODULE
// TOOL: Break-Even & Margin of Safety Analysis
// TOOL_ID: FREE_030_BREAK_EVEN_MARGIN_OF_SAFETY_ANALYSIS
// TOOL_KEY: break-even-and-margin-of-safety-analysis
// CATEGORY: finance_investment_decision_support
// FUNNEL_TARGET: Break-Even Survival Cash PRO
// RISK_LEVEL: HIGH
// PUBLIC FORMULA EXPOSURE: FORBIDDEN
// CLIENT FORMULA EXECUTION: FORBIDDEN
// LLM RUNTIME USAGE: FORBIDDEN
// PRECISION: All monetary arithmetic is performed with Big.js (CR-1 compliant).
// METHOD: Cost-Volume-Profit (CVP) screening. Deterministic, single-operation.

import Big from "big.js";
import type { FreeV531ExecuteResponse, FreeV531FormulaModule, FreeV531InputSpec, FreeV531OutputMetric, FreeV531Warning } from "./types";
import { buildAuditSeal, deriveStatus, finiteNumber, outputMetric, warning } from "./shared";

const TOOL_ID = "FREE_030_BREAK_EVEN_MARGIN_OF_SAFETY_ANALYSIS";
const TOOL_KEY = "break-even-and-margin-of-safety-analysis";
const TOOL_NAME = "Break-Even & Margin of Safety Analysis";
const CATEGORY = "finance_investment_decision_support";
const FUNNEL_TARGET = "Break-Even Survival Cash PRO";
const PRIMARY_METRIC_ID = "break_even_units";
const DEFAULT_DECISION_STATE = "PASS" as const;

export const runtimeBoundary = "SERVER_ONLY" as const;
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;
export const llmRuntimeUsage = "FORBIDDEN" as const;
export const clientFormulaExecution = "FORBIDDEN" as const;

export const inputs: readonly FreeV531InputSpec[] = [
  {
    id: "fixed_costs",
    label: "Fixed Costs",
    quantityKind: "currency",
    required: true,
    criticality: "HIGH",
    baseUnit: "user_unit",
    sourceStatus: "NEEDS_SOURCE_VERIFICATION",
    defaultPolicy: "NO_DEFAULT_ALLOWED",
    publicHelpText: "Total fixed costs for the period. User-entered verified value only.",
  },
  {
    id: "selling_price_per_unit",
    label: "Selling Price per Unit",
    quantityKind: "currency",
    required: true,
    criticality: "HIGH",
    baseUnit: "user_unit",
    sourceStatus: "NEEDS_SOURCE_VERIFICATION",
    defaultPolicy: "NO_DEFAULT_ALLOWED",
    publicHelpText: "Net selling price per unit. User-entered verified value only.",
  },
  {
    id: "variable_cost_per_unit",
    label: "Variable Cost per Unit",
    quantityKind: "currency",
    required: true,
    criticality: "HIGH",
    baseUnit: "user_unit",
    sourceStatus: "NEEDS_SOURCE_VERIFICATION",
    defaultPolicy: "NO_DEFAULT_ALLOWED",
    publicHelpText: "Variable cost per unit. User-entered verified value only.",
  },
  {
    id: "actual_sales_units",
    label: "Actual Sales Volume (Units)",
    quantityKind: "count",
    required: true,
    criticality: "HIGH",
    baseUnit: "user_unit",
    sourceStatus: "NEEDS_SOURCE_VERIFICATION",
    defaultPolicy: "NO_DEFAULT_ALLOWED",
    publicHelpText: "Actual or expected sales volume in units. User-entered verified value only.",
  },
];

export function execute(rawInputs: Readonly<Record<string, unknown>>): FreeV531ExecuteResponse {
  const fixedCosts = finiteNumber(rawInputs["fixed_costs"], "fixed_costs");
  const sellingPrice = finiteNumber(rawInputs["selling_price_per_unit"], "selling_price_per_unit");
  const variableCost = finiteNumber(rawInputs["variable_cost_per_unit"], "variable_cost_per_unit");
  const actualSalesUnits = finiteNumber(rawInputs["actual_sales_units"], "actual_sales_units");

  const contributionMargin = new Big(sellingPrice).minus(variableCost);
  if (contributionMargin.lte(0)) {
    throw new Error("BLOCKED_NON_POSITIVE_CONTRIBUTION_MARGIN:selling_price_per_unit");
  }
  if (new Big(actualSalesUnits).lte(0)) {
    throw new Error("BLOCKED_NON_POSITIVE_SALES_VOLUME:actual_sales_units");
  }

  const breakEvenUnits = new Big(fixedCosts).div(contributionMargin);
  const breakEvenRevenue = breakEvenUnits.times(sellingPrice);
  const marginOfSafetyUnits = new Big(actualSalesUnits).minus(breakEvenUnits);
  const marginOfSafetyPercent = marginOfSafetyUnits.div(actualSalesUnits).times(100);

  const normalized: Record<string, number> = {
    n_fixed_costs: fixedCosts,
    n_selling_price_per_unit: sellingPrice,
    n_variable_cost_per_unit: variableCost,
    n_actual_sales_units: actualSalesUnits,
  };

  const outputs: FreeV531OutputMetric[] = [
    outputMetric("contribution_margin_per_unit", Number(contributionMargin), "currency", "BUSINESS_IMPACT", "Contribution margin per unit is selling price minus variable cost, computed by the protected server-side CVP kernel."),
    outputMetric("break_even_units", Number(breakEvenUnits), "units", "PRIMARY_DECISION", "Break-even units is fixed costs divided by contribution margin per unit, computed by the protected server-side CVP kernel."),
    outputMetric("break_even_revenue", Number(breakEvenRevenue), "currency", "BUSINESS_IMPACT", "Break-even revenue is break-even units multiplied by selling price, computed by the protected server-side CVP kernel."),
    outputMetric("margin_of_safety_units", Number(marginOfSafetyUnits), "units", "SECONDARY_METRIC", "Margin of safety in units is actual sales volume minus break-even units, computed by the protected server-side CVP kernel."),
    outputMetric("margin_of_safety_percent", Number(marginOfSafetyPercent), "percent", "SECONDARY_METRIC", "Margin of safety percent is margin of safety units divided by actual sales volume, computed by the protected server-side CVP kernel."),
  ];

  const warnings: FreeV531Warning[] = [];
  if (marginOfSafetyPercent.lt(0)) {
    warnings.push(warning("REPRICE", "Actual sales volume is below the break-even point.", "Reprice, cut fixed costs, or raise volume; unlock the PRO target for survival-cash scenarios and evidence."));
  } else if (marginOfSafetyPercent.lt(10)) {
    warnings.push(warning("REVIEW", "Margin of safety is below 10 percent of current volume.", "Treat the result as a screening signal; unlock the PRO target for scenario, sensitivity, and proof pack."));
  }

  const auditSeal = buildAuditSeal(TOOL_ID, TOOL_KEY, normalized, outputs);
  return {
    status: deriveStatus(warnings, DEFAULT_DECISION_STATE),
    toolId: TOOL_ID,
    toolKey: TOOL_KEY,
    primaryMetricId: PRIMARY_METRIC_ID,
    outputs,
    warnings,
    hiddenRiskSummary: "The free result is a screening-level decision signal. The hidden risk is unverified source data, omitted mixed-product effects, tolerance and evidence gaps, and scenario sensitivity that can flip the decision.",
    nextAction: "Use the result to decide whether to proceed, hold, reprice, or escalate the pricing and volume plan. For customer-facing or audit-facing evidence, unlock the linked PRO workflow.",
    proUnlockReason: "Unlock Break-Even Survival Cash PRO for scenario comparison, sensitivity ranking, PDF proof pack, audit seal export, and decision history.",
    redactionStatus: "PUBLIC_SAFE_REDACTED",
    auditSeal,
  };
}

export const breakEvenMarginOfSafetyFormula: FreeV531FormulaModule = {
  toolId: TOOL_ID,
  toolKey: TOOL_KEY,
  toolName: TOOL_NAME,
  category: CATEGORY,
  funnelTarget: FUNNEL_TARGET,
  riskLevel: "HIGH",
  primaryMetricId: PRIMARY_METRIC_ID,
  runtimeBoundary,
  publicFormulaExpressionPolicy,
  llmRuntimeUsage,
  clientFormulaExecution,
  inputs,
  execute,
};

export default breakEvenMarginOfSafetyFormula;
