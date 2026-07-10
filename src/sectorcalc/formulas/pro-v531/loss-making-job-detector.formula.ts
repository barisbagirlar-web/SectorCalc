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

export const toolKey = "loss-making-job-detector";
export const formulaVersion = "5.3.1-pro-baris.2";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  // ── Extract inputs with safe defaults ──────────────────────────
  const batchQty        = get(inputs, "n_batch_quantity");
  const sellingPricePU  = get(inputs, "n_selling_price_per_unit");
  const matCostPU       = get(inputs, "n_material_cost_per_unit");
  const cycleTimeSec    = get(inputs, "n_cycle_time_seconds_per_unit");
  const setupTimeMin    = get(inputs, "n_setup_time_minutes_per_batch");
  const machineRatePH   = get(inputs, "n_machine_rate_per_hour");
  const operatorCount   = get(inputs, "n_operator_count");
  const laborRatePH     = get(inputs, "n_labor_rate_per_hour");
  const extProcessing   = get(inputs, "n_external_processing_per_batch");
  const packagingFreight = get(inputs, "n_packaging_freight_per_batch");
  const otherJobCost    = get(inputs, "n_other_job_cost_per_batch");
  const allocatedOverhead = get(inputs, "n_allocated_overhead");
  const scrapPct        = get(inputs, "n_scrap_rework_percent");
  const targetMarginPct = get(inputs, "n_target_revenue_margin_percent");
  const annualVolume    = get(inputs, "n_annual_volume_units");

  // ── Validation ─────────────────────────────────────────────────
  const hasInvalidInput = batchQty <= 0 || sellingPricePU <= 0 || cycleTimeSec < 0 || machineRatePH < 0 ||
    laborRatePH < 0 || scrapPct < 0 || targetMarginPct <= 0 || targetMarginPct >= 100;

  if (!isFiniteNumber(batchQty) || !isFiniteNumber(sellingPricePU)) {
    warnings.push("BLOCKED: batch_quantity or selling_price_per_unit is non-finite");
  }

  // ── Dimensional calculations ───────────────────────────────────
  const machineHrsPerUnit  = cycleTimeSec / 3600;
  const totalMachineHrs    = machineHrsPerUnit * batchQty + setupTimeMin / 60;
  const machineCost        = totalMachineHrs * machineRatePH;

  const laborHrsPerUnit    = machineHrsPerUnit * operatorCount;
  const totalLaborHrs      = laborHrsPerUnit * batchQty + setupTimeMin / 60 * operatorCount;
  const laborCost          = totalLaborHrs * laborRatePH;

  const directMaterial     = matCostPU * batchQty;
  const revenue            = sellingPricePU * batchQty;

  const variableCosts = directMaterial + machineCost + laborCost + extProcessing + packagingFreight + otherJobCost;

  // Scrap cost applies to reworkable costs (material + machine + labor)
  const scrapCost = (directMaterial + machineCost + laborCost) * (scrapPct / 100);

  const fullyLoadedCosts = variableCosts + allocatedOverhead + scrapCost;

  const contributionProfit = revenue - (directMaterial + machineCost + laborCost + extProcessing + packagingFreight + otherJobCost);
  const operatingProfit    = revenue - fullyLoadedCosts;

  const revenueMarginPct   = revenue > 0 ? (operatingProfit / revenue) * 100 : 0;
  const profitLossPerUnit  = batchQty > 0 ? operatingProfit / batchQty : 0;

  const minSustainPricePU  = batchQty > 0 ? fullyLoadedCosts / batchQty : 0;
  const targetPricePU      = (batchQty > 0 && targetMarginPct < 100)
    ? (fullyLoadedCosts / batchQty) / (1 - targetMarginPct / 100)
    : 0;
  const repricingGapPU     = targetPricePU - sellingPricePU;

  // Break-even
  const fixedCostsPerBatch = allocatedOverhead + (setupTimeMin / 60) * (machineRatePH + laborRatePH * operatorCount);
  const variableCostPerUnit = (batchQty > 0)
    ? (directMaterial + machineCost + laborCost + extProcessing + packagingFreight + otherJobCost) / batchQty
    : 0;
  const beQty = (sellingPricePU > variableCostPerUnit)
    ? fixedCostsPerBatch / (sellingPricePU - variableCostPerUnit)
    : 0;

  // Annualized risk
  const annualBatches = annualVolume > 0 && batchQty > 0 ? annualVolume / batchQty : 0;
  const annualMoneyAtRisk = operatingProfit < 0 ? Math.abs(operatingProfit) * annualBatches : 0;

  // Primary loss driver
  const costs = [
    { idx: 0, label: "Material", val: directMaterial },
    { idx: 1, label: "Machine", val: machineCost },
    { idx: 2, label: "Labor", val: laborCost },
    { idx: 3, label: "External", val: extProcessing },
    { idx: 4, label: "Packaging/Freight", val: packagingFreight },
    { idx: 5, label: "Other Job Cost", val: otherJobCost },
    { idx: 6, label: "Overhead", val: allocatedOverhead },
    { idx: 7, label: "Scrap", val: scrapCost },
  ];
  let primaryDriverIdx = 0;
  let maxCost = 0;
  for (const c of costs) {
    if (c.val > maxCost) { maxCost = c.val; primaryDriverIdx = c.idx; }
  }

  // ── Decision engine ────────────────────────────────────────────
  // BLOCKED: revenue <= 0, fully_loaded > revenue, contribution < 0, invalid inputs
  // REVIEW: margin > 0 but below target, or structurally risky
  // GOOD: margin >= target, no blockers

  let decision: number;
  if (hasInvalidInput || revenue <= 0 || fullyLoadedCosts > revenue || contributionProfit < 0) {
    decision = 0; // BLOCKED
  } else if (revenueMarginPct >= targetMarginPct) {
    decision = 2; // GOOD
  } else {
    decision = 1; // REVIEW
  }

  // ── Populate outputs ───────────────────────────────────────────
  outputs["out_job_revenue"]            = round(revenue, 2);
  outputs["out_direct_material_cost"]   = round(directMaterial, 2);
  outputs["out_machine_cost"]           = round(machineCost, 2);
  outputs["out_labor_cost"]             = round(laborCost, 2);
  outputs["out_external_processing_cost"] = round(extProcessing, 2);
  outputs["out_packaging_freight_cost"] = round(packagingFreight, 2);
  outputs["out_other_job_cost"]         = round(otherJobCost, 2);
  outputs["out_allocated_overhead"]     = round(allocatedOverhead, 2);
  outputs["out_scrap_rework_cost"]      = round(scrapCost, 2);
  outputs["out_fully_loaded_job_cost"]  = round(fullyLoadedCosts, 2);
  outputs["out_contribution_profit"]    = round(contributionProfit, 2);
  outputs["out_operating_profit"]       = round(operatingProfit, 2);
  outputs["out_revenue_margin_percent"] = round(revenueMarginPct, 2);
  outputs["out_profit_loss_per_unit"]   = round(profitLossPerUnit, 2);
  outputs["out_minimum_sustainable_price"] = round(minSustainPricePU, 2);
  outputs["out_target_price"]           = round(targetPricePU, 2);
  outputs["out_repricing_gap"]          = round(repricingGapPU, 2);
  outputs["out_break_even_quantity"]    = round(beQty, 2);
  outputs["out_annualized_money_at_risk"] = round(annualMoneyAtRisk, 2);
  outputs["out_primary_loss_driver"]    = primaryDriverIdx;
  outputs["out_final_decision_state"]   = decision;

  // ── Reconciliation check ──────────────────────────────────────
  const reconciled = Math.abs((directMaterial + machineCost + laborCost + extProcessing + packagingFreight + otherJobCost + allocatedOverhead + scrapCost) - fullyLoadedCosts);
  if (reconciled > 0.02) {
    warnings.push("RECONCILIATION: Component sum mismatch detected");
  }

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings: warnings.length ? warnings : [],
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
