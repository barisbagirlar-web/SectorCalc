// SECTORCALC FREE V5.3.1 SERVER-ONLY FORMULA MODULE
// TOOL: Net Present Value Calculator
// TOOL_ID: FREE_400_NET_PRESENT_VALUE_CALCULATOR
// TOOL_KEY: net-present-value-calculator
// CATEGORY: quote_sme_finance
// FUNNEL_TARGET: Capital Equipment Investment Appraisal PRO
// RISK_LEVEL: HIGH
// PUBLIC FORMULA EXPOSURE: FORBIDDEN
// CLIENT FORMULA EXECUTION: FORBIDDEN
// LLM RUNTIME USAGE: FORBIDDEN
// PRECISION: All capital-budgeting arithmetic is performed with Big.js (CR-1 compliant).
// THEORY: Standard discounted cash-flow net present value screening model.
// MODEL: Discrete annual cash flows, end-of-period convention, constant discount rate.
// EQUATION: NPV = sum(CF_t / (1 + r)^t) - initial_investment
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

const TOOL_ID = "FREE_400_NET_PRESENT_VALUE_CALCULATOR";
const TOOL_KEY = "net-present-value-calculator";
const TOOL_NAME = "Net Present Value Calculator";
const CATEGORY = "quote_sme_finance";
const FUNNEL_TARGET = "Capital Equipment Investment Appraisal PRO";
const PRIMARY_METRIC_ID = "npv";
const DEFAULT_DECISION_STATE = "PASS" as const;
const MAX_HORIZON = 10;
const IRR_TOLERANCE = new Big("1e-8");
const IRR_MAX_ITERATIONS = 100;

export const runtimeBoundary = "SERVER_ONLY" as const;
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;
export const llmRuntimeUsage = "FORBIDDEN" as const;
export const clientFormulaExecution = "FORBIDDEN" as const;

export const inputs: readonly FreeV531InputSpec[] = [
  {
    id: "initial_investment",
    label: "Initial Investment",
    quantityKind: "currency",
    required: true,
    criticality: "HIGH",
    baseUnit: "user_unit",
    sourceStatus: "USER_VERIFIED",
    defaultPolicy: "NO_DEFAULT_ALLOWED",
    publicHelpText: "Up-front capital outlay at time zero. Must be greater than zero.",
  },
  {
    id: "discount_rate_pct",
    label: "Discount Rate (%)",
    quantityKind: "ratio_or_percent",
    required: true,
    criticality: "HIGH",
    baseUnit: "percent",
    sourceStatus: "USER_VERIFIED",
    defaultPolicy: "NO_DEFAULT_ALLOWED",
    publicHelpText: "Nominal discount rate as a percentage (for example 10 means 10 percent). Must be between 0 and 100 exclusive.",
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
    publicHelpText: "Study horizon in whole years from 1 to 10. Cash flows beyond this horizon are ignored.",
  },
  ...Array.from({ length: MAX_HORIZON }, (_, index) => {
    const year = Number(new Big(index).plus(1));
    return {
      id: `cf_y${year}`,
      label: `Cash Flow Year ${year}`,
      quantityKind: "currency",
      required: true as const,
      criticality: (year <= 3 ? "HIGH" : "MEDIUM") as "HIGH" | "MEDIUM",
      baseUnit: "user_unit",
      sourceStatus: "USER_VERIFIED" as const,
      defaultPolicy: "NO_DEFAULT_ALLOWED" as const,
      publicHelpText:
        year === 1
          ? "Net cash inflow for year 1. Required when horizon is at least 1."
          : `Net cash inflow for year ${year}. Required when horizon reaches year ${year}; ignored when horizon is shorter.`,
    } satisfies FreeV531InputSpec;
  }),
];

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

function readDiscountRatePct(raw: unknown): Big {
  const parsed = finiteNumber(raw, "discount_rate_pct");
  const rate = new Big(parsed);
  if (rate.lte(0) || rate.gte(100)) {
    throw new Error("BLOCKED_DISCOUNT_RATE_OUT_OF_RANGE:discount_rate_pct");
  }
  return rate;
}

function readInitialInvestment(raw: unknown): Big {
  const parsed = finiteNumber(raw, "initial_investment");
  const investment = new Big(parsed);
  if (investment.lte(0)) {
    throw new Error("BLOCKED_NON_POSITIVE_INITIAL_INVESTMENT:initial_investment");
  }
  return investment;
}

function readCashFlows(rawInputs: Readonly<Record<string, unknown>>, horizonYears: number): Big[] {
  const cashFlows: Big[] = [];
  for (let year = 1; year <= horizonYears; year += 1) {
    const key = `cf_y${year}`;
    cashFlows.push(new Big(finiteNumber(rawInputs[key], key)));
  }
  return cashFlows;
}

function discountedCashFlowSum(cashFlows: readonly Big[], rateDecimal: Big): Big {
  let sum = new Big(0);
  for (let index = 0; index < cashFlows.length; index += 1) {
    const period = Number(new Big(index).plus(1));
    const discountFactor = new Big(1).plus(rateDecimal).pow(period);
    sum = sum.plus(cashFlows[index]!.div(discountFactor));
  }
  return sum;
}

function npvAtRate(initialInvestment: Big, cashFlows: readonly Big[], ratePct: Big): Big {
  const rateDecimal = ratePct.div(100);
  return discountedCashFlowSum(cashFlows, rateDecimal).minus(initialInvestment);
}

function npvDerivativeAtRate(cashFlows: readonly Big[], ratePct: Big): Big {
  const rateDecimal = ratePct.div(100);
  let derivative = new Big(0);
  for (let index = 0; index < cashFlows.length; index += 1) {
    const period = Number(new Big(index).plus(1));
    const base = new Big(1).plus(rateDecimal);
    const discounted = cashFlows[index]!.times(new Big(-period)).div(base.pow(period + 1));
    derivative = derivative.plus(discounted.div(100));
  }
  return derivative;
}

function computeIrrPct(initialInvestment: Big, cashFlows: readonly Big[]): number | null {
  let rate = new Big(10);
  for (let iteration = 0; iteration < IRR_MAX_ITERATIONS; iteration += 1) {
    const npv = npvAtRate(initialInvestment, cashFlows, rate);
    const derivative = npvDerivativeAtRate(cashFlows, rate);
    if (derivative.abs().lte(new Big("1e-12"))) {
      break;
    }
    const next = rate.minus(npv.div(derivative));
    if (!next.gt(new Big(-99)) || !next.lt(new Big(1000))) {
      break;
    }
    if (next.minus(rate).abs().lte(IRR_TOLERANCE)) {
      return Number(next);
    }
    rate = next;
  }

  let low = new Big(-99);
  let high = new Big(1000);
  let npvLow = npvAtRate(initialInvestment, cashFlows, low);
  let npvHigh = npvAtRate(initialInvestment, cashFlows, high);
  if (npvLow.times(npvHigh).gt(0)) {
    return null;
  }

  for (let iteration = 0; iteration < 200; iteration += 1) {
    const mid = low.plus(high).div(2);
    const npvMid = npvAtRate(initialInvestment, cashFlows, mid);
    if (npvMid.abs().lte(new Big("1e-6"))) {
      return Number(mid);
    }
    if (npvMid.times(npvLow).gt(0)) {
      low = mid;
      npvLow = npvMid;
    } else {
      high = mid;
      npvHigh = npvMid;
    }
  }

  return Number(low.plus(high).div(2));
}

function computeSimplePaybackYears(initialInvestment: Big, cashFlows: readonly Big[]): number | null {
  let cumulative = initialInvestment.times(-1);
  for (let index = 0; index < cashFlows.length; index += 1) {
    const previous = cumulative;
    cumulative = cumulative.plus(cashFlows[index]!);
    if (previous.lte(0) && cumulative.gte(0)) {
      const inflow = cashFlows[index]!;
      if (inflow.eq(0)) {
        return Number(new Big(index).plus(1));
      }
      const fraction = previous.abs().div(inflow);
      return Number(new Big(index).plus(fraction));
    }
  }
  return null;
}

function computeDiscountedPaybackYears(
  initialInvestment: Big,
  cashFlows: readonly Big[],
  ratePct: Big,
): number | null {
  const rateDecimal = ratePct.div(100);
  let cumulative = initialInvestment.times(-1);
  for (let index = 0; index < cashFlows.length; index += 1) {
    const period = Number(new Big(index).plus(1));
    const discounted = cashFlows[index]!.div(new Big(1).plus(rateDecimal).pow(period));
    const previous = cumulative;
    cumulative = cumulative.plus(discounted);
    if (previous.lte(0) && cumulative.gte(0)) {
      if (discounted.eq(0)) {
        return period;
      }
      const fraction = previous.abs().div(discounted);
      return Number(new Big(period - 1).plus(fraction));
    }
  }
  return null;
}

export function execute(rawInputs: Readonly<Record<string, unknown>>): FreeV531ExecuteResponse {
  const initialInvestment = readInitialInvestment(rawInputs["initial_investment"]);
  const discountRatePct = readDiscountRatePct(rawInputs["discount_rate_pct"]);
  const horizonYears = readHorizonYears(rawInputs["horizon_years"]);
  const cashFlows = readCashFlows(rawInputs, horizonYears);

  const npv = npvAtRate(initialInvestment, cashFlows, discountRatePct);
  const irrPct = computeIrrPct(initialInvestment, cashFlows);
  const simplePaybackYears = computeSimplePaybackYears(initialInvestment, cashFlows);
  const discountedPaybackYears = computeDiscountedPaybackYears(initialInvestment, cashFlows, discountRatePct);

  const normalized: Record<string, number> = {
    n_initial_investment: Number(initialInvestment),
    n_discount_rate_pct: Number(discountRatePct),
    n_horizon_years: horizonYears,
  };
  for (let year = 1; year <= MAX_HORIZON; year += 1) {
    const key = `cf_y${year}`;
    if (year <= horizonYears) {
      normalized[`n_${key}`] = Number(new Big(finiteNumber(rawInputs[key], key)));
    } else if (rawInputs[key] !== undefined && rawInputs[key] !== null && rawInputs[key] !== "") {
      normalized[`n_${key}`] = Number(new Big(finiteNumber(rawInputs[key], key)));
    }
  }

  const outputs: FreeV531OutputMetric[] = [
    outputMetric(
      "npv",
      Number(npv),
      "currency",
      "PRIMARY_DECISION",
      "Net present value of the project cash-flow stream after discounting each inflow at the stated rate and subtracting the initial investment.",
    ),
  ];

  if (irrPct !== null && Number.isFinite(irrPct)) {
    outputs.push(
      outputMetric(
        "irr_pct",
        irrPct,
        "percent",
        "SECONDARY_METRIC",
        "Internal rate of return approximated with Newton-Raphson and bisection fallback over a bounded bracket.",
      ),
    );
  }

  if (simplePaybackYears !== null && Number.isFinite(simplePaybackYears)) {
    outputs.push(
      outputMetric(
        "simple_payback_years",
        simplePaybackYears,
        "years",
        "SECONDARY_METRIC",
        "Undiscounted cumulative payback period measured in years, including fractional recovery within the payoff year.",
      ),
    );
  }

  if (discountedPaybackYears !== null && Number.isFinite(discountedPaybackYears)) {
    outputs.push(
      outputMetric(
        "discounted_payback_years",
        discountedPaybackYears,
        "years",
        "SECONDARY_METRIC",
        "Discounted cumulative payback period using the same discount rate as the NPV calculation.",
      ),
    );
  }

  const warnings: FreeV531Warning[] = [];
  let preferredStatus: FreeV531ExecuteResponse["status"] = DEFAULT_DECISION_STATE;

  if (npv.gt(0)) {
    preferredStatus = "PASS";
    warnings.push(
      warning(
        "INFO",
        "The net present value is positive at the stated discount rate.",
        "Proceed to sensitivity review, scenario comparison, and funding approval workflow if other constraints are satisfied.",
      ),
    );
  } else if (npv.eq(0)) {
    preferredStatus = "REVIEW";
    warnings.push(
      warning(
        "REVIEW",
        "The net present value is exactly zero at the stated discount rate.",
        "Verify cash-flow assumptions and compare against hurdle-rate policy before committing capital.",
      ),
    );
  } else {
    preferredStatus = "REJECT";
    warnings.push(
      warning(
        "REJECT",
        "The net present value is negative at the stated discount rate.",
        "Revise scope, pricing, cost structure, or financing terms before approving the investment.",
      ),
    );
  }

  if (irrPct === null) {
    warnings.push(
      warning(
        "WARNING",
        "IRR could not be bracketed from the supplied cash-flow pattern within the search range.",
        "Review whether cash flows change sign across the study horizon or provide an alternate rate-of-return metric.",
      ),
    );
  }

  if (simplePaybackYears === null) {
    warnings.push(
      warning(
        "INFO",
        "Simple payback did not occur within the selected study horizon under undiscounted cumulative cash flows.",
        "Extend the horizon, increase inflows, or reduce the initial investment before relying on payback screening.",
      ),
    );
  }

  if (discountedPaybackYears === null) {
    warnings.push(
      warning(
        "INFO",
        "Discounted payback did not occur within the selected study horizon at the stated discount rate.",
        "Compare against policy payback limits using extended cash-flow evidence or PRO scenario tooling.",
      ),
    );
  }

  warnings.push(
    warning(
      "INFO",
      "Assumption: annual end-of-period cash flows, constant discount rate, no tax shield, inflation, or terminal-value layer in this free screening model.",
      "Confirm that the cash-flow basis matches your capital-budgeting memo before using the result in approval packs.",
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
      "The free result is a screening-level capital-budgeting check using a constant discount rate and discrete annual cash flows. Hidden risks include optimistic cash-flow forecasts, working-capital effects, tax and depreciation shields, inflation mismatch, salvage value omission, and discount-rate estimation error.",
    nextAction:
      "Use the NPV sign and payback metrics to decide whether to proceed, revise the business case, or escalate for full appraisal. For audit-facing investment packs, unlock the linked PRO workflow.",
    proUnlockReason:
      "Unlock Capital Equipment Investment Appraisal PRO for scenario tables, sensitivity grids, PDF proof pack, audit seal export, and decision history.",
    redactionStatus: "PUBLIC_SAFE_REDACTED",
    auditSeal,
  };
}

export const netPresentValueFormula: FreeV531FormulaModule = {
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

export default netPresentValueFormula;
