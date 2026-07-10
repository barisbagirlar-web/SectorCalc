import "server-only";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export interface CalculationResult {
  status: CalculationStatus;
  outputs: Record<string, number>;
  warnings: string[];
  outputKeys: string[];
  redaction_status: RedactionStatus;
}

export const toolKey = "break-even-survival-cash-calculator";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  // ── Inputs ────────────────────────────────────────────────────────
  const revenueRaw           = get(inputs, "n_annual_revenue");
  const variableCostPctRaw   = get(inputs, "n_variable_cost_percent");
  const fixedCostsRaw        = get(inputs, "n_annual_fixed_costs");
  const cashRaw              = get(inputs, "n_available_cash_liquidity");
  const unitPriceRaw         = get(inputs, "n_unit_selling_price");
  const unitVariableRaw      = get(inputs, "n_unit_variable_cost");

  // Validate
  let hasInvalidInput = false;
  if (revenueRaw <= 0) { warnings.push("Annual revenue must be positive"); hasInvalidInput = true; }
  if (fixedCostsRaw < 0) { warnings.push("Fixed costs cannot be negative"); hasInvalidInput = true; }
  if (cashRaw < 0) { warnings.push("Available cash cannot be negative"); hasInvalidInput = true; }
  if (variableCostPctRaw < 0 || variableCostPctRaw > 100) { warnings.push("Variable cost % must be 0-100"); hasInvalidInput = true; }

  // Clamp invalid values — use safe values for all calculations
  const revenue         = Math.max(0, revenueRaw);
  const variableCostPct = Math.max(0, Math.min(variableCostPctRaw, 99.999));
  const annualFixedCosts = Math.max(0, fixedCostsRaw);
  const availableCash   = Math.max(0, cashRaw);
  const unitPrice       = Math.max(0, unitPriceRaw);
  const unitVariable    = Math.max(0, unitVariableRaw);

  const hasUnitData = unitPrice > 0 && unitVariable >= 0;

  // ── Calculations ──────────────────────────────────────────────────
  const variableCostRatio = variableCostPct / 100;
  const variableCostAmt   = revenue * variableCostRatio;

  const contributionAmount = revenue - variableCostAmt;
  const contributionRatio  = revenue > 0 ? contributionAmount / revenue : 0;

  const operatingProfit    = contributionAmount - annualFixedCosts;

  // Break-even revenue = fixed costs / contribution margin ratio
  const breRevenue  = contributionRatio > 0 ? annualFixedCosts / contributionRatio : 0;

  // Break-even units
  const contributionPerUnit = unitPrice - unitVariable;
  const breUnits    = contributionPerUnit > 0 ? Math.ceil(annualFixedCosts / contributionPerUnit) : 0;

  // Revenue gap
  const revenueGap = Math.max(0, breRevenue - revenue);
  const unitGap    = breUnits > 0 ? Math.max(0, breUnits - (hasUnitData ? revenue / unitPrice : 0)) : 0;

  // Cash metrics
  const monthlyCashBurn   = annualFixedCosts / 12;
  const cashRunwayMonths  = monthlyCashBurn > 0 ? availableCash / monthlyCashBurn : 0;

  // Margin of safety
  const mosAmount     = revenue > 0 ? Math.max(0, revenue - breRevenue) : 0;
  const mosPercent    = revenue > 0 ? (mosAmount / revenue) * 100 : 0;

  // Primary survival driver: 0 = low volume, 1 = high fixed costs, 2 = low margin
  let primaryDriverIdx = 0;
  if (contributionRatio < 0.15) primaryDriverIdx = 2;
  else if (annualFixedCosts > revenue * 0.5) primaryDriverIdx = 1;

  // ── Decision engine ───────────────────────────────────────────────
  // 0 = GOOD, 1 = REVIEW, 2 = BLOCKED
  let decision: number;
  if (hasInvalidInput || revenue <= 0 || contributionRatio <= 0.005 || availableCash <= 0) {
    decision = 2; // BLOCKED
  } else if (operatingProfit < 0 && cashRunwayMonths < 3) {
    decision = 2; // BLOCKED — critically cash-negative
  } else if (operatingProfit < 0 || cashRunwayMonths < 6 || mosPercent < 10) {
    decision = 1; // REVIEW
  } else {
    decision = 0; // GOOD
  }

  // ── Outputs ───────────────────────────────────────────────────────
  outputs["out_revenue"]                    = round(revenue, 2);
  outputs["out_variable_cost"]              = round(variableCostAmt, 2);
  outputs["out_contribution_margin_amount"] = round(contributionAmount, 2);
  outputs["out_contribution_margin_ratio"]  = round(contributionRatio, 4);
  outputs["out_fixed_operating_cost"]       = round(annualFixedCosts, 2);
  outputs["out_operating_profit_or_loss"]   = round(operatingProfit, 2);
  outputs["out_break_even_revenue"]         = round(breRevenue, 2);
  outputs["out_break_even_units"]           = round(breUnits, 0);
  outputs["out_revenue_gap"]                = round(revenueGap, 2);
  outputs["out_unit_gap"]                   = round(unitGap, 0);
  outputs["out_monthly_cash_burn"]          = round(monthlyCashBurn, 2);
  outputs["out_available_liquidity"]        = round(availableCash, 2);
  outputs["out_cash_runway_months"]         = round(cashRunwayMonths, 1);
  outputs["out_margin_of_safety_amount"]    = round(mosAmount, 2);
  outputs["out_margin_of_safety_percent"]   = round(mosPercent, 2);
  outputs["out_primary_survival_driver"]    = primaryDriverIdx;
  outputs["out_final_decision_state"]       = decision;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings: warnings.length ? warnings : [],
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
