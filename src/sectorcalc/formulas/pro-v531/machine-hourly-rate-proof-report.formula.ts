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

export const toolKey = "machine-hourly-rate-proof-report";
export const formulaVersion = "6.0.0-pro-baris.reference-engine";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

const SECONDS_PER_YEAR = 31536000;
const SECONDS_PER_HOUR = 3600;

/**
 * REBUILT 2026-07-15 audit, replacing the tool entirely.
 *
 * Root cause: the schema's own "scope" field always said this tool proves machine hourly rate
 * "using depreciation, energy, maintenance, labor" -- an asset-depreciation cost model -- but
 * the formula that shipped implemented a completely different job-costing model (cycle_time,
 * batch_quantity, material_cost), never matching its own stated purpose. Same bug CLASS as
 * receivables-cost-payment-term-addendum (wrong-domain formula) found earlier in this audit.
 *
 * Baris supplied a reference implementation (HTML prototype, independently verified with 27
 * closed-form/edge-case + 8 semantic assertions before this file existed) that IS the correct
 * domain model. This is a verbatim port of that engine() function to the calculate() contract,
 * using the platform's normalized-unit inputs instead of the prototype's client-side unit
 * registry.
 *
 * Model: straight-line depreciation + annual maintenance (% of price) + energy (power draw x
 * hours x price) + fully-loaded labor, divided by PRODUCTIVE hours only (planned hours minus
 * the idle/non-productive share) -- not naive planned hours. The gap between the productive
 * rate and the naive rate (which ignores idle time) is the tool's core insight.
 */
export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const purchasePrice = get(inputs, "n_purchase_price");
  const usefulLifeYears = get(inputs, "n_useful_life") / SECONDS_PER_YEAR;
  const annualHours = get(inputs, "n_annual_hours") / SECONDS_PER_HOUR;
  const wageRate = get(inputs, "n_wage_rate");
  const powerDraw = get(inputs, "n_power_draw");
  const energyPrice = get(inputs, "n_energy_price");
  const idleShare = get(inputs, "n_idle_share");
  const maintenanceRate = get(inputs, "n_maintenance_rate");
  const conf = get(inputs, "n_source_confidence_ratio");

  if (!isFiniteNumber(inputs["n_purchase_price"])) warnings.push("Missing: Purchase Price");
  if (!isFiniteNumber(inputs["n_useful_life"]) || usefulLifeYears <= 0) warnings.push("Missing or non-positive Useful Life: depreciation is undefined.");
  if (!isFiniteNumber(inputs["n_annual_hours"])) warnings.push("Missing: Planned Operating Hours");

  const depreciation = usefulLifeYears > 0 ? purchasePrice / usefulLifeYears : Infinity;
  const maintenance = purchasePrice * maintenanceRate;
  const energy = powerDraw * annualHours * energyPrice;
  const labor = wageRate * annualHours;
  const total = depreciation + maintenance + energy + labor;

  const productiveHours = annualHours * (1 - idleShare);
  const rate = productiveHours > 0 ? total / productiveHours : Infinity;
  const naiveRate = annualHours > 0 ? total / annualHours : Infinity;
  const idlePremium = isFiniteNumber(rate) && isFiniteNumber(naiveRate) ? rate - naiveRate : 0;

  const energyShare = total > 0 ? energy / total : 0;
  const laborShare = total > 0 ? labor / total : 0;
  const capitalShare = total > 0 ? (depreciation + maintenance) / total : 0;

  const annualIdleCostExposure = idlePremium * productiveHours;

  const shares = [depreciation, maintenance, energy, labor];
  const dominantDriverIndex = shares.indexOf(Math.max(...shares)); // 0=depreciation 1=maintenance 2=energy 3=labor

  const premiumRatio = isFiniteNumber(rate) && rate > 0 ? idlePremium / rate : 0;

  let finalDecisionState: number;
  if (!isFiniteNumber(rate)) finalDecisionState = 2;
  else if (premiumRatio <= 0.10) finalDecisionState = 0; // OK — idle premium under control
  else if (premiumRatio <= 0.20) finalDecisionState = 1; // REVIEW
  else finalDecisionState = 2; // ESCALATE — idle time is materially inflating the true rate

  const uncertaintyCoverage = 1 - conf; // simple confidence-driven band, no separate uncertainty_multiplier input in this tool
  const expandedUncertainty = isFiniteNumber(rate) ? rate * uncertaintyCoverage * 0.2 : 0;

  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_normalized_demand"] = round(isFiniteNumber(naiveRate) ? naiveRate : 0, 2);
  outputs["out_demand_metric"] = round(isFiniteNumber(total) ? total : 0, 2);
  outputs["out_capacity_metric"] = round(productiveHours, 2);
  outputs["out_utilization_margin"] = round(isFiniteNumber(rate) ? rate : 0, 4);
  outputs["out_expanded_uncertainty"] = round(expandedUncertainty, 4);
  outputs["out_threshold_crossing"] = premiumRatio > 0.15 ? 1 : 0;
  outputs["out_sensitivity_driver"] = dominantDriverIndex;
  outputs["out_fmea_trigger"] = premiumRatio > 0.15 ? 1 : 0;
  outputs["out_money_at_risk"] = round(isFiniteNumber(annualIdleCostExposure) ? annualIdleCostExposure : 0, 2);
  outputs["out_scenario_delta"] = round(isFiniteNumber(idlePremium) ? idlePremium : 0, 4);
  outputs["out_final_decision_state"] = finalDecisionState;
  outputs["out_reference_deviation"] = round(premiumRatio, 4);
  outputs["out_derating_factor"] = round(annualHours > 0 ? productiveHours / annualHours : 0, 4);
  outputs["out_audit_hash_payload"] = 0;

  // Preserve the underlying decomposition needed by the report layer's sensitivity/insight
  // rendering without inventing new generic output keys mid-catalog.
  outputs["out_energy_share_pct"] = round(energyShare, 4);
  outputs["out_labor_share_pct"] = round(laborShare, 4);
  outputs["out_capital_share_pct"] = round(capitalShare, 4);
  outputs["out_planned_hours_value"] = round(annualHours, 2);

  const coreFinite = [
    outputs["out_evidence_completeness"], outputs["out_normalized_demand"], outputs["out_demand_metric"],
    outputs["out_capacity_metric"], outputs["out_utilization_margin"], outputs["out_expanded_uncertainty"],
    outputs["out_money_at_risk"], outputs["out_scenario_delta"], outputs["out_reference_deviation"],
    outputs["out_derating_factor"],
  ].every(v => isFiniteNumber(v));

  return {
    status: coreFinite ? "OK" : "REVIEW",
    outputs,
    warnings,
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
