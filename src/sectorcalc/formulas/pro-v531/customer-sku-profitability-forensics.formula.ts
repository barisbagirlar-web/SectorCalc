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

export const toolKey = "customer-sku-profitability-forensics";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }
function safeDiv(n: number, d: number): number { if (!isFiniteNumber(n) || !isFiniteNumber(d) || Math.abs(d) < 1e-12) return 0; return n / d; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const unitPrice = get(inputs, "n_unit_price");
  const unitVarCost = get(inputs, "n_unit_variable_cost");
  const annualVol = get(inputs, "n_annual_volume");
  const logisticsPct = get(inputs, "n_logistics_cost_pct");
  const servicePct = get(inputs, "n_service_cost_pct");
  const returnPct = get(inputs, "n_return_rate_pct");
  const targetMargin = get(inputs, "n_target_margin");

  if (unitPrice <= 0) warnings.push("Unit price must be positive");
  if (annualVol <= 0) warnings.push("Annual volume must be positive");

  const unitContribution = unitPrice - unitVarCost;
  const cmRatio = unitPrice > 0 ? unitContribution / unitPrice : 0;
  const logisticsBurden = unitPrice * (logisticsPct / 100);
  const serviceBurden = unitPrice * (servicePct / 100);
  const returnBurden = unitPrice * (returnPct / 100);
  const totalBurdenPerUnit = logisticsBurden + serviceBurden + returnBurden;
  const netMarginPerUnit = unitContribution - totalBurdenPerUnit;
  const netMarginPct = unitPrice > 0 ? netMarginPerUnit / unitPrice : 0;
  const totalAnnualProfit = netMarginPerUnit * annualVol;
  const totalRevenue = unitPrice * annualVol;

  const biggestBurden = Math.max(logisticsBurden, serviceBurden, returnBurden);
  let primaryDriver = 0;
  if (biggestBurden === serviceBurden) primaryDriver = 1;
  else if (biggestBurden === returnBurden) primaryDriver = 2;

  const contributionRatio = unitPrice > 0 ? (unitPrice - unitVarCost) / unitPrice : 0;
  const targetMarginRatio = targetMargin / 100;

  // Decision: 0=GOOD (grow), 1=REVIEW (hold), 2=BLOCKED (cut)
  let decision = 2;
  if (contributionRatio > targetMarginRatio) decision = 0;
  else if (contributionRatio > 0) decision = 1;

  outputs["out_unit_price"] = round(unitPrice, 2);
  outputs["out_unit_variable_cost"] = round(unitVarCost, 2);
  outputs["out_unit_contribution"] = round(unitContribution, 2);
  outputs["out_contribution_margin_pct"] = round(cmRatio * 100, 1);
  outputs["out_logistics_burden_per_unit"] = round(logisticsBurden, 2);
  outputs["out_service_burden_per_unit"] = round(serviceBurden, 2);
  outputs["out_return_burden_per_unit"] = round(returnBurden, 2);
  outputs["out_total_burden_per_unit"] = round(totalBurdenPerUnit, 2);
  outputs["out_net_margin_per_unit"] = round(netMarginPerUnit, 2);
  outputs["out_net_margin_pct"] = round(netMarginPct * 100, 1);
  outputs["out_total_annual_revenue"] = round(totalRevenue, 2);
  outputs["out_total_annual_profit"] = round(totalAnnualProfit, 2);
  outputs["out_primary_burden_driver"] = primaryDriver;
  outputs["out_contribution_ratio"] = round(contributionRatio, 4);
  outputs["out_final_decision_state"] = decision;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? (warnings.length === 0 ? "OK" : "REVIEW") : "REVIEW",
    outputs, warnings: warnings.length ? warnings : [],
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
