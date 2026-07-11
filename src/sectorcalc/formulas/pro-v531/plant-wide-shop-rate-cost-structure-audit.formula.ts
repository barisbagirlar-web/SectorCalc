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

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }
function safeDiv(n: number, d: number): number { if (!isFiniteNumber(n) || !isFiniteNumber(d) || Math.abs(d) < 1e-12) return 0; return n / d; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const totalAnnualCost = get(inputs, "n_total_annual_cost");
  const totalProdHours = get(inputs, "n_total_productive_hours");
  const machineGroupCost = get(inputs, "n_machine_group_cost");
  const machineGroupHours = get(inputs, "n_machine_group_hours");
  const overheadPool = get(inputs, "n_overhead_pool");
  const overheadAllocBase = get(inputs, "n_overhead_allocation_base");
  const currentShopRate = get(inputs, "n_current_shop_rate");
  const targetMarginPct = get(inputs, "n_target_margin_pct");
  const utilizationPct = get(inputs, "n_utilization_pct");

  if (totalAnnualCost <= 0) warnings.push("Total annual cost must be positive");
  if (totalProdHours <= 0) warnings.push("Total productive hours must be positive");

  const plantWideRate = safeDiv(totalAnnualCost, Math.max(totalProdHours, 1));
  const machineGroupRate = safeDiv(machineGroupCost, Math.max(machineGroupHours, 1));
  const overheadAbsRate = safeDiv(overheadPool, Math.max(overheadAllocBase, 1));
  const underRecovery = plantWideRate - (plantWideRate * utilizationPct / 100);
  const pricingFloor = plantWideRate * (1 + targetMarginPct / 100);
  const recoveryGap = pricingFloor - currentShopRate;
  const moneyAtRisk = underRecovery * totalProdHours;
  const utilizationRatio = utilizationPct / 100;

  // Identify primary cost driver
  const rates = [plantWideRate, machineGroupRate, overheadAbsRate];
  const maxRate = Math.max(...rates);
  const primaryDriver = rates.indexOf(maxRate);

  // Decision: 0=GOOD, 1=REVIEW, 2=BLOCKED
  let decision = 2;
  if (currentShopRate >= pricingFloor && utilizationPct >= 75) decision = 0;
  else if (currentShopRate > 0 && currentShopRate < pricingFloor) decision = 1;

  outputs["out_total_annual_cost"] = round(totalAnnualCost, 2);
  outputs["out_total_productive_hours"] = round(totalProdHours, 2);
  outputs["out_plant_wide_rate"] = round(plantWideRate, 2);
  outputs["out_machine_group_rate"] = round(machineGroupRate, 2);
  outputs["out_overhead_absorption_rate"] = round(overheadAbsRate, 2);
  outputs["out_actual_utilization_pct"] = round(utilizationPct, 1);
  outputs["out_under_recovery_per_hour"] = round(underRecovery, 2);
  outputs["out_pricing_floor_rate"] = round(pricingFloor, 2);
  outputs["out_current_shop_rate"] = round(currentShopRate, 2);
  outputs["out_recovery_gap"] = round(recoveryGap, 2);
  outputs["out_money_at_risk"] = round(Math.max(moneyAtRisk, 0), 2);
  outputs["out_primary_cost_driver"] = primaryDriver;
  outputs["out_pricing_headroom"] = round(currentShopRate - plantWideRate, 2);
  outputs["out_utilization_leverage"] = round(utilizationRatio, 4);
  outputs["out_final_decision_state"] = decision;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? (warnings.length === 0 ? "OK" : "REVIEW") : "REVIEW",
    outputs, warnings: warnings.length ? warnings : [],
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
