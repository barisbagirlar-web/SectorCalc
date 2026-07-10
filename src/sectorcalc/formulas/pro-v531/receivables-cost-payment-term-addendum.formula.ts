import "server-only";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";
export interface CalculationResult { status: CalculationStatus; outputs: Record<string, number>; warnings: string[]; outputKeys: string[]; redaction_status: RedactionStatus; }

export const toolKey = "receivables-cost-payment-term-addendum";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }
export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = []; const outputs: Record<string, number> = {};

  const invoiceValue = get(inputs, "n_invoice_value");
  const paymentDays = get(inputs, "n_payment_days");
  const earlyDiscountPct = get(inputs, "n_early_payment_discount_pct");
  const costOfCapitalPct = get(inputs, "n_cost_of_capital_pct");
  const adminCost = get(inputs, "n_admin_collection_cost");
  const defaultRiskAllowance = get(inputs, "n_default_risk_allowance");

  let invalid = false;
  if (invoiceValue <= 0) { warnings.push("Invoice value must be positive"); invalid = true; }
  if (paymentDays <= 0) { warnings.push("Payment term must be positive days"); invalid = true; }

  // Financing cost = invoice * cost_of_capital_pct * (payment_days / 365)
  const financingCost = invoiceValue * (costOfCapitalPct / 100) * (paymentDays / 365);

  // Effective term cost = financing + admin + default risk
  const effectiveTermCost = financingCost + adminCost + defaultRiskAllowance;
  const effectiveTermCostPct = invoiceValue > 0 ? (effectiveTermCost / invoiceValue) * 100 : 0;

  // Margin erosion: what % of invoice value is consumed by term cost
  const marginErosion = effectiveTermCost;

  // Required addendum: amount needed to cover the effective term cost
  const requiredAddendumAmount = effectiveTermCost;
  const requiredAddendumPct = invoiceValue > 0 ? (requiredAddendumAmount / invoiceValue) * 100 : 0;

  // Revised invoice = original + addendum
  const revisedInvoice = invoiceValue + requiredAddendumAmount;

  // Breakeven payment term: at what days does cost = early discount saved?
  const breakevenTerm = costOfCapitalPct > 0 ? (earlyDiscountPct / costOfCapitalPct) * 365 : 0;

  // Decision state
  let decision: number;
  if (invalid) decision = 2;
  else if (effectiveTermCostPct > 5) decision = 2; // BLOCKED — term cost > 5% of invoice
  else if (effectiveTermCostPct > 2) decision = 1; // REVIEW — term cost 2-5%
  else decision = 0; // GOOD — term cost < 2%

  outputs["out_invoice_value"] = round(invoiceValue, 2);
  outputs["out_financing_cost"] = round(financingCost, 2);
  outputs["out_admin_collection_cost"] = round(adminCost, 2);
  outputs["out_default_risk_allowance"] = round(defaultRiskAllowance, 2);
  outputs["out_effective_term_cost"] = round(effectiveTermCost, 2);
  outputs["out_effective_term_cost_pct"] = round(effectiveTermCostPct, 2);
  outputs["out_margin_erosion_amount"] = round(marginErosion, 2);
  outputs["out_required_addendum_amount"] = round(requiredAddendumAmount, 2);
  outputs["out_required_addendum_pct"] = round(requiredAddendumPct, 2);
  outputs["out_revised_invoice_amount"] = round(revisedInvoice, 2);
  outputs["out_breakeven_payment_term_days"] = round(breakevenTerm, 0);
  outputs["out_final_decision_state"] = decision;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return { status: ok ? "OK" : "REVIEW", outputs, warnings: warnings.length ? warnings : [], outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
