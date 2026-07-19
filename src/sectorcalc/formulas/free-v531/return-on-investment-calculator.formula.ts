// SECTORCALC FREE V5.3.1 SERVER-ONLY FORMULA MODULE
// TOOL: Return on Investment Calculator
// TOOL_ID: FREE_401_RETURN_ON_INVESTMENT_CALCULATOR
// TOOL_KEY: return-on-investment-calculator
// CATEGORY: quote_sme_finance
// FUNNEL_TARGET: Capital Equipment Investment Appraisal PRO
// RISK_LEVEL: HIGH
// PUBLIC FORMULA EXPOSURE: FORBIDDEN
// CLIENT FORMULA EXECUTION: FORBIDDEN
// LLM RUNTIME USAGE: FORBIDDEN
// PRECISION: All capital-budgeting arithmetic is performed with Big.js (CR-1 compliant).
// THEORY: Standard return-on-investment screening model with optional payback and compound annualized ROI.
// MODEL: Single-period total return versus investment cost, linear payback on annual net benefit, compound annualized ROI over stated horizon.
// EQUATION: ROI_pct = (net_gain / investment_cost) × 100, net_gain = total_return − investment_cost
// REFERENCE: Brealey, Myers & Allen — Principles of Corporate Finance; Ross, Westerfield & Jordan — Fundamentals of Corporate Finance.

import Big from "big.js";
import type {
  FreeV531ExecuteResponse,
  FreeV531FormulaModule,
  FreeV531InputSpec,
  FreeV531OutputMetric,
  FreeV531Warning,
} from "./types";
import { buildAuditSeal, deriveStatus, finiteNumber, outputMetric, warning } from "./shared";

const TOOL_ID = "FREE_401_RETURN_ON_INVESTMENT_CALCULATOR";
const TOOL_KEY = "return-on-investment-calculator";
const TOOL_NAME = "Return on Investment Calculator";
const CATEGORY = "quote_sme_finance";
const FUNNEL_TARGET = "Capital Equipment Investment Appraisal PRO";
const PRIMARY_METRIC_ID = "roi_pct";
const DEFAULT_DECISION_STATE = "PASS" as const;
const MAX_HORIZON = 30;
const DEFAULT_HURDLE_RATE_PCT = 0;

export const runtimeBoundary = "SERVER_ONLY" as const;
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;
export const llmRuntimeUsage = "FORBIDDEN" as const;
export const clientFormulaExecution = "FORBIDDEN" as const;

export const inputs: readonly FreeV531InputSpec[] = [
  {
    id: "investment_cost",
    label: "Investment Cost",
    quantityKind: "currency",
    required: true,
    criticality: "HIGH",
    baseUnit: "user_unit",
    sourceStatus: "USER_VERIFIED",
    defaultPolicy: "NO_DEFAULT_ALLOWED",
    publicHelpText: "Total capital outlay for the project. Must be greater than zero.",
  },
  {
    id: "total_return",
    label: "Total Return",
    quantityKind: "currency",
    required: true,
    criticality: "HIGH",
    baseUnit: "user_unit",
    sourceStatus: "USER_VERIFIED",
    defaultPolicy: "NO_DEFAULT_ALLOWED",
    publicHelpText: "Total project return including recovered capital and net gain. Must be zero or greater.",
  },
  {
    id: "annual_net_benefit",
    label: "Annual Net Benefit",
    quantityKind: "currency",
    required: true,
    criticality: "HIGH",
    baseUnit: "user_unit",
    sourceStatus: "USER_VERIFIED",
    defaultPolicy: "NO_DEFAULT_ALLOWED",
    publicHelpText: "Average annual net benefit used for simple payback screening. Must be zero or greater.",
  },
  {
    id: "horizon_years",
    label: "Horizon (Years)",
    quantityKind: "dimensionless",
    required: true,
    criticality: "HIGH",
    baseUnit: "years",
    sourceStatus: "USER_VERIFIED",
    defaultPolicy: "NO_DEFAULT_ALLOWED",
    publicHelpText: "Study horizon in whole years from 1 to 30 for compound annualized ROI.",
  },
  {
    id: "hurdle_rate_pct",
    label: "Hurdle Rate (%)",
    quantityKind: "ratio_or_percent",
    required: true,
    criticality: "MEDIUM",
    baseUnit: "percent",
    sourceStatus: "USER_VERIFIED",
    defaultPolicy: "NON_CRITICAL_SAFE_DEFAULT",
    publicHelpText: "Minimum acceptable ROI percent for PASS screening. Enter zero when no hurdle is set.",
  },
];

function readInvestmentCost(raw: unknown): Big {
  const parsed = finiteNumber(raw, "investment_cost");
  const cost = new Big(parsed);
  if (cost.lte(0)) {
    throw new Error("BLOCKED_NON_POSITIVE_INVESTMENT_COST:investment_cost");
  }
  return cost;
}

function readTotalReturn(raw: unknown): Big {
  const parsed = finiteNumber(raw, "total_return");
  const totalReturn = new Big(parsed);
  if (totalReturn.lt(0)) {
    throw new Error("BLOCKED_NEGATIVE_TOTAL_RETURN:total_return");
  }
  return totalReturn;
}

function readAnnualNetBenefit(raw: unknown): Big {
  const parsed = finiteNumber(raw, "annual_net_benefit");
  const benefit = new Big(parsed);
  if (benefit.lt(0)) {
    throw new Error("BLOCKED_NEGATIVE_ANNUAL_NET_BENEFIT:annual_net_benefit");
  }
  return benefit;
}

function readHorizonYears(raw: unknown): number {
  const parsed = finiteNumber(raw, "horizon_years");
  if (!Number.isInteger(parsed)) {
    throw new Error("BLOCKED_NON_INTEGER_HORIZON:horizon_years");
  }
  if (parsed < 1 || parsed > MAX_HORIZON) {
    throw new Error("BLOCKED_HORIZON_OUT_OF_RANGE:horizon_years");
  }
  return parsed;
}

function readHurdleRatePct(raw: unknown): Big {
  if (raw === undefined || raw === null || raw === "") {
    return new Big(DEFAULT_HURDLE_RATE_PCT);
  }
  const parsed = finiteNumber(raw, "hurdle_rate_pct");
  const hurdle = new Big(parsed);
  if (hurdle.lt(0) || hurdle.gte(100)) {
    throw new Error("BLOCKED_HURDLE_RATE_OUT_OF_RANGE:hurdle_rate_pct");
  }
  return hurdle;
}

function computeCompoundAnnualizedRoiPct(roiPct: Big, horizonYears: number): number {
  const roiDecimal = roiPct.div(100);
  const base = Number(new Big(1).plus(roiDecimal));
  if (!Number.isFinite(base) || base <= 0) {
    throw new Error("BLOCKED_INVALID_ANNUALIZED_ROI_BASE:roi_pct");
  }
  // Fractional exponent via Math.pow; result immediately wrapped in Big.js (CR-1).
  const annualizedDecimal = Number(new Big(String(Math.pow(base, Number(new Big(1).div(horizonYears))))).minus(1));
  if (!Number.isFinite(annualizedDecimal)) {
    throw new Error("BLOCKED_NON_FINITE_OUTPUT:annualized_roi_pct");
  }
  return Number(new Big(annualizedDecimal).times(100));
}

export function execute(rawInputs: Readonly<Record<string, unknown>>): FreeV531ExecuteResponse {
  const investmentCost = readInvestmentCost(rawInputs["investment_cost"]);
  const totalReturn = readTotalReturn(rawInputs["total_return"]);
  const annualNetBenefit = readAnnualNetBenefit(rawInputs["annual_net_benefit"]);
  const horizonYears = readHorizonYears(rawInputs["horizon_years"]);
  const hurdleRatePct = readHurdleRatePct(rawInputs["hurdle_rate_pct"]);

  const netGain = totalReturn.minus(investmentCost);
  const roiPct = netGain.div(investmentCost).times(100);
  const paybackPeriodYears = annualNetBenefit.gt(0) ? investmentCost.div(annualNetBenefit) : null;
  const annualizedRoiPct = computeCompoundAnnualizedRoiPct(roiPct, horizonYears);
  const simpleAnnualizedRoiPct = roiPct.div(horizonYears);

  const normalized: Record<string, number> = {
    n_investment_cost: Number(investmentCost),
    n_total_return: Number(totalReturn),
    n_annual_net_benefit: Number(annualNetBenefit),
    n_horizon_years: horizonYears,
    n_hurdle_rate_pct: Number(hurdleRatePct),
  };

  const outputs: FreeV531OutputMetric[] = [
    outputMetric(
      "roi_pct",
      Number(roiPct),
      "percent",
      "PRIMARY_DECISION",
      "Return on investment expressed as net gain divided by investment cost, multiplied by 100.",
    ),
    outputMetric(
      "net_gain",
      Number(netGain),
      "currency",
      "SECONDARY_METRIC",
      "Net gain is total return minus investment cost for the selected project boundary.",
    ),
    outputMetric(
      "annualized_roi_pct",
      annualizedRoiPct,
      "percent",
      "SECONDARY_METRIC",
      "Compound annualized ROI derived from total ROI over the stated horizon using a geometric mean assumption.",
    ),
  ];

  if (paybackPeriodYears !== null) {
    outputs.push(
      outputMetric(
        "payback_period_years",
        Number(paybackPeriodYears),
        "years",
        "SECONDARY_METRIC",
        "Simple payback period is investment cost divided by annual net benefit when annual net benefit is positive.",
      ),
    );
  }

  const warnings: FreeV531Warning[] = [];
  let preferredStatus: FreeV531ExecuteResponse["status"] = DEFAULT_DECISION_STATE;

  if (roiPct.gt(hurdleRatePct)) {
    preferredStatus = "PASS";
    warnings.push(
      warning(
        "INFO",
        "Return on investment exceeds the stated hurdle rate.",
        "Proceed to sensitivity review, scenario comparison, and funding approval workflow if other constraints are satisfied.",
      ),
    );
  } else if (roiPct.eq(hurdleRatePct)) {
    preferredStatus = "REVIEW";
    warnings.push(
      warning(
        "REVIEW",
        "Return on investment equals the stated hurdle rate.",
        "Verify return assumptions, cost basis, and policy thresholds before committing capital.",
      ),
    );
  } else {
    preferredStatus = "REJECT";
    warnings.push(
      warning(
        "REJECT",
        "Return on investment is below the stated hurdle rate.",
        "Revise scope, pricing, cost structure, or expected returns before approving the investment.",
      ),
    );
  }

  if (paybackPeriodYears === null) {
    warnings.push(
      warning(
        "INFO",
        "Simple payback cannot be computed because annual net benefit is zero.",
        "Provide a positive annual net benefit or use another liquidity timing metric.",
      ),
    );
  }

  if (netGain.lt(0)) {
    warnings.push(
      warning(
        "WARNING",
        "Total return is below investment cost, producing a negative net gain.",
        "Review whether the project boundary, salvage value, or benefit stream is complete before using the ROI result.",
      ),
    );
  }

  warnings.push(
    warning(
      "INFO",
      "Assumption: compound annualized ROI uses ((1 + ROI_decimal)^(1/horizon) − 1) × 100. Simple linear annualization would be ROI_pct / horizon_years.",
      `For this case, simple linear annualized ROI would be ${Number(simpleAnnualizedRoiPct).toFixed(4)} percent per year versus compound ${annualizedRoiPct.toFixed(4)} percent.`,
    ),
  );

  warnings.push(
    warning(
      "INFO",
      "Assumption: single-period ROI screening without discount-rate adjustment, tax shield, or inflation layer in this free model.",
      "Confirm that total return and investment cost use the same currency basis and project boundary before approval.",
    ),
  );

  const auditSeal = buildAuditSeal(TOOL_ID, TOOL_KEY, normalized, outputs);
  return {
    status: deriveStatus(warnings, preferredStatus),
    toolId: TOOL_ID,
    toolKey: TOOL_KEY,
    primaryMetricId: PRIMARY_METRIC_ID,
    outputs,
    warnings,
    hiddenRiskSummary:
      "The free result is a screening-level ROI check using total return versus investment cost. Hidden risks include optimistic return forecasts, omitted operating costs, salvage-value mismatch, payback timing errors, and hurdle-rate policy drift.",
    nextAction:
      "Use ROI versus the hurdle rate and payback timing to decide whether to proceed, revise the business case, or escalate for full appraisal. For audit-facing investment packs, unlock the linked PRO workflow.",
    proUnlockReason:
      "Unlock Capital Equipment Investment Appraisal PRO for scenario tables, sensitivity grids, PDF proof pack, audit seal export, and decision history.",
    redactionStatus: "PUBLIC_SAFE_REDACTED",
    auditSeal,
  };
}

export const returnOnInvestmentFormula: FreeV531FormulaModule = {
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

export default returnOnInvestmentFormula;
