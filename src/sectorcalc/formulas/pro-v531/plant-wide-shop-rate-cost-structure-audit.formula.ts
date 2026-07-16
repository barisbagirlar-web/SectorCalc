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

export const toolKey = "plant-wide-shop-rate-cost-structure-audit";
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
    "n_total_annual_cost",
    "n_total_productive_hours",
    "n_machine_group_cost",
    "n_machine_group_hours",
    "n_overhead_pool",
    "n_overhead_allocation_base",
    "n_current_shop_rate",
    "n_target_margin_pct",
    "n_utilization_pct",
    "n_source_confidence_ratio"
  ];
  for (const key of requiredInputs) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Extract inputs
  const totalAnnualCost = get(inputs, "n_total_annual_cost");
  const totalProductiveHours = get(inputs, "n_total_productive_hours");
  const machineGroupCost = get(inputs, "n_machine_group_cost");
  const machineGroupHours = get(inputs, "n_machine_group_hours");
  const overheadPool = get(inputs, "n_overhead_pool");
  const overheadAllocationBase = get(inputs, "n_overhead_allocation_base");
  const currentShopRate = get(inputs, "n_current_shop_rate");
  const targetMarginPct = get(inputs, "n_target_margin_pct");
  const utilizationPct = get(inputs, "n_utilization_pct");
  const sourceConfidenceRatio = get(inputs, "n_source_confidence_ratio");

  // Core calculations
  const plantWideRate = safeDiv(totalAnnualCost, Math.max(totalProductiveHours, 1));
  const machineGroupRate = safeDiv(machineGroupCost, Math.max(machineGroupHours, 1));
  const overheadAbsRate = safeDiv(overheadPool, Math.max(overheadAllocationBase, 1));
  // NOTE (2026-07-15 audit): n_target_margin_pct and n_utilization_pct both have schema
  // base_unit "ratio" (0..1) -- the normalizer already converts a "percent" display entry to
  // ratio before calculate() sees it. Dividing by 100 again shrank both 100x, meaning
  // under-recovery and pricing floor were computed from a near-100% utilization assumption
  // regardless of the real input.
  const underRecovery = plantWideRate - (plantWideRate * utilizationPct);
  const pricingFloor = plantWideRate * (1 + targetMarginPct);
  const moneyAtRisk = underRecovery * totalProductiveHours;

  // Decision logic: 0=OK, 1=REPRICE, 2=REVIEW
  let decisionFlag: number;
  if (currentShopRate >= pricingFloor) {
    decisionFlag = 0; // OK
  } else if (currentShopRate > 0 && currentShopRate < pricingFloor) {
    decisionFlag = 1; // REPRICE
  } else {
    decisionFlag = 2; // REVIEW
  }

  // Map to all 15 output IDs
  outputs["out_evidence_completeness"] = round(sourceConfidenceRatio, 4);
  outputs["out_normalized_demand"] = round(totalProductiveHours, 4);
  outputs["out_reference_deviation"] = round(utilizationPct, 4);
  outputs["out_derating_factor"] = round(safeDiv(underRecovery, Math.max(plantWideRate, 1)), 4);
  outputs["out_demand_metric"] = round(plantWideRate, 4);
  outputs["out_capacity_metric"] = round(machineGroupRate, 4);
  outputs["out_utilization_margin"] = round(utilizationPct, 4);
  outputs["out_expanded_uncertainty"] = round(overheadAbsRate, 4);
  outputs["out_threshold_crossing"] = round(decisionFlag, 4);
  outputs["out_sensitivity_driver"] = round(Math.max(plantWideRate, machineGroupRate, overheadAbsRate), 4);
  outputs["out_fmea_trigger"] = round(decisionFlag === 2 ? 1 : 0, 4);
  outputs["out_money_at_risk"] = round(Math.max(moneyAtRisk, 0), 4);
  outputs["out_scenario_delta"] = round(pricingFloor - currentShopRate, 4);
  outputs["out_audit_hash_payload"] = round(totalProductiveHours + sourceConfidenceRatio, 4);
  outputs["out_final_decision_state"] = round(decisionFlag, 4);
  outputs["out_machine_group_cost_component"] = round(machineGroupCost, 2);
  outputs["out_overhead_pool_component"] = round(overheadPool, 2);

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
