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

export const toolKey = "fx-commodity-pass-through-pricer";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }
function safeDiv(n: number, d: number): number { if (!isFiniteNumber(n) || !isFiniteNumber(d) || Math.abs(d) < 1e-12) return 0; return n / d; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const basePrice = get(inputs, "n_base_price");
  const fxSpot = get(inputs, "n_fx_rate_spot");
  const fxBudget = get(inputs, "n_fx_rate_budget");
  const commCurrent = get(inputs, "n_commodity_index_current");
  const commBudget = get(inputs, "n_commodity_index_budget");
  const matCostPct = get(inputs, "n_material_cost_pct");
  const fxHedgePct = get(inputs, "n_fx_hedge_pct");
  const commHedgePct = get(inputs, "n_commodity_hedge_pct");
  const annualVol = get(inputs, "n_annual_volume");

  if (basePrice <= 0) warnings.push("Base price must be positive");
  if (annualVol <= 0) warnings.push("Annual volume must be positive");

  const fxChange = safeDiv(fxSpot - fxBudget, Math.max(fxBudget, 0.0001));
  const commChange = safeDiv(commCurrent - commBudget, Math.max(commBudget, 0.0001));
  const fxImpact = fxChange * (matCostPct / 100) * (1 - fxHedgePct / 100);
  const commImpact = commChange * (matCostPct / 100) * (1 - commHedgePct / 100);
  const totalPassThrough = fxImpact + commImpact;
  const adjustedPrice = basePrice * (1 + totalPassThrough);
  const escalationAmt = adjustedPrice - basePrice;
  const annualEscalation = escalationAmt * annualVol;

  // Identify primary driver
  const absFx = Math.abs(fxImpact);
  const absComm = Math.abs(commImpact);
  const primaryDriver = absFx >= absComm ? (absFx > 0.001 ? 0 : 2) : (absComm > 0.001 ? 1 : 2);

  // Decision: 0=GOOD, 1=REVIEW, 2=BLOCKED
  let decision = 0;
  if (Math.abs(totalPassThrough) * 100 > 15) decision = 2;
  else if (Math.abs(totalPassThrough) * 100 > 5) decision = 1;

  outputs["out_base_price"] = round(basePrice, 2);
  outputs["out_adjusted_price"] = round(adjustedPrice, 2);
  outputs["out_escalation_amount"] = round(escalationAmt, 2);
  outputs["out_fx_change_pct"] = round(fxChange * 100, 2);
  outputs["out_commodity_change_pct"] = round(commChange * 100, 2);
  outputs["out_fx_impact_pct"] = round(fxImpact * 100, 2);
  outputs["out_commodity_impact_pct"] = round(commImpact * 100, 2);
  outputs["out_total_pass_through_pct"] = round(totalPassThrough * 100, 2);
  outputs["out_escalation_cost_per_unit"] = round(escalationAmt, 2);
  outputs["out_annual_escalation_cost"] = round(annualEscalation, 2);
  outputs["out_money_at_risk"] = round(Math.abs(annualEscalation) * 0.5, 2);
  outputs["out_primary_price_driver"] = primaryDriver;
  outputs["out_pass_through_severity"] = round(Math.abs(totalPassThrough * 100), 1);
  outputs["out_hedge_adequacy_score"] = round((fxHedgePct + commHedgePct) / 2, 1);
  outputs["out_final_decision_state"] = decision;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? (warnings.length === 0 ? "OK" : "REVIEW") : "REVIEW",
    outputs, warnings: warnings.length ? warnings : [],
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
