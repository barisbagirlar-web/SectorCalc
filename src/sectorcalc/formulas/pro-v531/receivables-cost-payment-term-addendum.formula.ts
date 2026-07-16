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

export const toolKey = "receivables-cost-payment-term-addendum";
export const formulaVersion = "5.3.2-pro-baris.2";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

// REBUILT 2026-07-15: the previous formula used manufacturing job-costing inputs
// (machine_rate, cycle_time, material_cost, batch_quantity) to fabricate a "financing rate"
// via Math.min(Math.max(0.02, oh/mr/100), 0.25) — there was no receivables/DSO/interest-rate
// input anywhere, despite the tool's own scope being "Convert payment terms into financing
// cost percentage." An older form-to-schema map (now dead code) still referenced the correct
// field names (average_receivable_balance, annual_interest_rate, average_collection_days,
// invoice_volume), confirming this is a restoration of a dropped design, not a new concept.
// Unit contract (post-normalization, base units):
//   n_average_receivable_balance   currency_unit
//   n_annual_interest_rate         ratio
//   n_average_collection_days      s (displayed as "day")
//   n_invoice_volume                currency_unit (annual $ volume of invoices)

const SECONDS_PER_DAY = 86400;
const DAYS_PER_YEAR = 365;

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const arBalance = get(inputs, "n_average_receivable_balance");
  const interestRate = get(inputs, "n_annual_interest_rate");
  const dsoSeconds = get(inputs, "n_average_collection_days");
  const invoiceVolume = get(inputs, "n_invoice_volume");
  const conf = get(inputs, "n_source_confidence_ratio");
  const unc = get(inputs, "n_uncertainty_multiplier");

  if (!isFiniteNumber(inputs["n_average_receivable_balance"])) warnings.push("Missing: Average Receivable Balance");
  if (!isFiniteNumber(inputs["n_annual_interest_rate"]) || interestRate <= 0) warnings.push("Missing or non-positive Annual Interest Rate: financing cost cannot be priced.");
  if (!isFiniteNumber(inputs["n_average_collection_days"])) warnings.push("Missing: Average Collection Period (DSO)");
  if (!isFiniteNumber(inputs["n_invoice_volume"]) || invoiceVolume <= 0) warnings.push("Missing or non-positive Annual Invoice Volume.");

  const dsoDays = dsoSeconds / SECONDS_PER_DAY;

  // Direct carrying cost of the AR balance you actually hold today.
  const costOfExtendedTerms = arBalance * interestRate;

  // Financing cost expressed as a % of invoice value, driven by how long collection actually
  // takes (DSO) at the given interest rate — this is the "quote addendum" percentage.
  const financingCostRatio = (dsoDays / DAYS_PER_YEAR) * interestRate;
  const annualReceivablesCost = invoiceVolume * financingCostRatio;

  const workingCapitalImpact = arBalance;

  const uncertaintyCoverage = unc > 1 ? unc - 1 : 0.1;
  const expandedUncertainty = annualReceivablesCost * uncertaintyCoverage;

  // Reference threshold: a commonly used sanity ceiling for "reasonable" DSO-driven financing
  // load — flag for review if the addendum would exceed 5% of invoice value.
  const REVIEW_THRESHOLD_RATIO = 0.05;
  const thresholdCrossed = financingCostRatio > REVIEW_THRESHOLD_RATIO;

  let finalDecisionState: number;
  if (interestRate <= 0 || invoiceVolume <= 0) finalDecisionState = 2;
  else if (thresholdCrossed) finalDecisionState = 1;
  else finalDecisionState = 0;

  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_normalized_demand"] = round(invoiceVolume, 2);
  outputs["out_demand_metric"] = round(annualReceivablesCost, 2);
  outputs["out_capacity_metric"] = round(workingCapitalImpact, 2);
  outputs["out_utilization_margin"] = round(costOfExtendedTerms, 2);
  outputs["out_money_at_risk"] = round(annualReceivablesCost, 2);
  outputs["out_threshold_crossing"] = thresholdCrossed ? 1 : 0;
  outputs["out_fmea_trigger"] = thresholdCrossed ? 1 : 0;
  outputs["out_final_decision_state"] = finalDecisionState;
  outputs["out_reference_deviation"] = round(financingCostRatio / REVIEW_THRESHOLD_RATIO, 4);
  outputs["out_derating_factor"] = round(conf, 4);
  outputs["out_expanded_uncertainty"] = round(expandedUncertainty, 2);
  outputs["out_sensitivity_driver"] = costOfExtendedTerms >= annualReceivablesCost ? 0 : 1; // 0=current AR balance carrying cost dominant, 1=DSO-driven invoice financing cost dominant
  outputs["out_scenario_delta"] = round(annualReceivablesCost * 0.15, 2);
  outputs["out_audit_hash_payload"] = 0;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings,
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
