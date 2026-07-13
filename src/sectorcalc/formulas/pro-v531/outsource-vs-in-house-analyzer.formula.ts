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

export const toolKey = "outsource-vs-in-house-analyzer";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function get(inputs: Record<string, number>, key: string): number {
  const v = inputs[key];
  return isFiniteNumber(v) ? v : 0;
}

function safeDiv(n: number, d: number): number {
  if (!isFiniteNumber(n) || !isFiniteNumber(d) || Math.abs(d) < 1e-12) return 0;
  return n / d;
}

function round(v: number, d: number): number {
  if (!isFiniteNumber(v)) return 0;
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  // Validate required inputs
  const requiredInputs = [
    "n_in_house_material_cost",
    "n_in_house_labor_cost",
    "n_in_house_overhead",
    "n_in_house_setup_cost",
    "n_outsource_unit_price",
    "n_outsource_logistics_cost",
    "n_annual_volume",
    "n_quality_risk_premium_pct",
    "n_capacity_utilization_pct",
    "n_source_confidence_ratio"
  ];
  for (const key of requiredInputs) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Extract inputs
  const materialCost = get(inputs, "n_in_house_material_cost");
  const laborCost = get(inputs, "n_in_house_labor_cost");
  const overhead = get(inputs, "n_in_house_overhead");
  const setupCost = get(inputs, "n_in_house_setup_cost");
  const outsourceUnitPrice = get(inputs, "n_outsource_unit_price");
  const logisticsCost = get(inputs, "n_outsource_logistics_cost");
  const annualVolume = get(inputs, "n_annual_volume");
  const qualityRiskPremiumPct = get(inputs, "n_quality_risk_premium_pct");
  const capacityUtilizationPct = get(inputs, "n_capacity_utilization_pct");
  const sourceConfidenceRatio = get(inputs, "n_source_confidence_ratio");

  // Annualize volume (input is per-second)
  const SECONDS_PER_YEAR = 31536000;
  const annual_vol = annualVolume * SECONDS_PER_YEAR;

  // Core calculations
  const setupCostPerUnit = safeDiv(setupCost, Math.max(annual_vol, 1));
  const inHouseUnitCost = materialCost + laborCost + overhead + setupCostPerUnit;
  const inHouseTotalCost = inHouseUnitCost * annual_vol;
  const outsourceUnitCost = outsourceUnitPrice + logisticsCost;
  const outsourceTotalCost = outsourceUnitCost * annual_vol;
  const capacityOppCost = (1 - capacityUtilizationPct / 100) * inHouseTotalCost * 0.3;
  const riskPremium = outsourceTotalCost * qualityRiskPremiumPct / 100;
  const riskAdjDelta = (inHouseTotalCost + capacityOppCost) - (outsourceTotalCost + riskPremium);
  const savingsPerUnit = safeDiv(riskAdjDelta, Math.max(annual_vol, 1));

  // Decision logic: 0=MAKE, 1=BUY, 2=REVIEW
  const threshold = inHouseTotalCost * 0.1;
  let decisionFlag: number;
  if (riskAdjDelta <= -threshold) {
    decisionFlag = 0; // MAKE
  } else if (riskAdjDelta >= threshold) {
    decisionFlag = 1; // BUY
  } else {
    decisionFlag = 2; // REVIEW
  }

  // Map to all 15 output IDs
  outputs["out_evidence_completeness"] = round(sourceConfidenceRatio, 4);
  outputs["out_normalized_demand"] = round(annualVolume, 4);
  outputs["out_reference_deviation"] = round(qualityRiskPremiumPct / 100, 4);
  outputs["out_derating_factor"] = round(capacityUtilizationPct / 100, 4);
  outputs["out_demand_metric"] = round(inHouseUnitCost, 4);
  outputs["out_capacity_metric"] = round(outsourceUnitCost, 4);
  outputs["out_utilization_margin"] = round(capacityUtilizationPct / 100, 4);
  outputs["out_expanded_uncertainty"] = round(1 - sourceConfidenceRatio, 4);
  outputs["out_threshold_crossing"] = round(decisionFlag, 4);
  outputs["out_sensitivity_driver"] = round(Math.max(materialCost, laborCost, overhead, outsourceUnitPrice), 4);
  outputs["out_fmea_trigger"] = round(decisionFlag === 2 ? 1 : 0, 4);
  outputs["out_money_at_risk"] = round(Math.abs(riskAdjDelta), 4);
  outputs["out_scenario_delta"] = round(savingsPerUnit, 4);
  outputs["out_audit_hash_payload"] = round(annualVolume + sourceConfidenceRatio, 4);
  outputs["out_final_decision_state"] = round(decisionFlag, 4);

  // Sanity check
  for (const key of Object.keys(outputs)) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push("Non-finite output corrected to zero: " + key);
    }
  }

  const ok = warnings.length === 0;
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings: warnings.length ? warnings : [],
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
