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

export const toolKey = "job-quote-builder-pro-pack";
export const formulaVersion = "5.3.1-pro-baris.2";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const bq        = get(inputs, "n_batch_quantity");
  const mcpu      = get(inputs, "n_material_cost_per_unit");
  const ct        = get(inputs, "n_cycle_time_seconds_per_unit");
  const st        = get(inputs, "n_setup_time_minutes_per_batch");
  const mr        = get(inputs, "n_machine_rate_per_hour");
  const lr        = get(inputs, "n_labor_rate_per_hour");
  const nop       = get(inputs, "n_operator_count");
  const oh        = get(inputs, "n_annual_unallocated_overhead");
  const vol       = get(inputs, "n_annual_volume_units");
  const scr       = get(inputs, "n_scrap_rework_percent");
  const tm        = get(inputs, "n_target_revenue_margin_percent");

  const cTool     = get(inputs, "n_tooling_consumables_cost_per_batch");
  const cExt      = get(inputs, "n_external_processing_cost_per_batch");
  const cPkg      = get(inputs, "n_packaging_cost_per_batch");
  const cFrt      = get(inputs, "n_freight_cost_per_batch");
  const cOth      = get(inputs, "n_other_job_cost_per_batch");
  const conPct    = get(inputs, "n_contingency_percent");
  const curQuote  = get(inputs, "n_current_quote_per_unit");

  // ── Validation / blockers ───────────────────────────────────────────
  let blocked = false;
  if (bq <= 0) { warnings.push("Batch quantity must be greater than zero."); blocked = true; }
  if (vol <= 0) { warnings.push("Annual volume must be greater than zero."); blocked = true; }
  if (tm >= 100) { warnings.push("Target revenue margin must be less than 100%."); blocked = true; }
  if (scr >= 100) { warnings.push("Scrap/rework rate must be less than 100%."); blocked = true; }
  if (mcpu < 0) { warnings.push("Material cost cannot be negative."); blocked = true; }
  if (mr < 0) { warnings.push("Machine rate cannot be negative."); blocked = true; }
  if (lr < 0) { warnings.push("Labor rate cannot be negative."); blocked = true; }
  if (ct < 0) { warnings.push("Cycle time cannot be negative."); blocked = true; }
  if (st < 0) { warnings.push("Setup time cannot be negative."); blocked = true; }
  if (oh < 0) { warnings.push("Overhead cost cannot be negative."); blocked = true; }
  if (cTool < 0 || cExt < 0 || cPkg < 0 || cFrt < 0 || cOth < 0) { warnings.push("Job-specific costs cannot be negative."); blocked = true; }
  if (conPct < 0) { warnings.push("Contingency rate cannot be negative."); blocked = true; }
  if (curQuote < 0) { warnings.push("Current quote cannot be negative."); blocked = true; }
  if (nop < 0) { warnings.push("Operator count cannot be negative."); blocked = true; }

  // ── Core dimensional formulas ──────────────────────────────────────
  const runMachineHrs = bq * ct / 3600;
  const setupHrs = st / 60;
  const totalMachineHrs = runMachineHrs + setupHrs;
  const laborHrsPerBatch = totalMachineHrs * nop;

  const matCostBeforeScrap = mcpu * bq;
  const machCostPerBatch = mr * totalMachineHrs;
  const laborCostPerBatch = lr * laborHrsPerBatch;

  const annualBatches = bq > 0 ? vol / bq : 0;
  const ohPerBatch = annualBatches > 0 ? oh / annualBatches : 0;

  const directCostBeforeScrap =
    matCostBeforeScrap + machCostPerBatch + laborCostPerBatch + ohPerBatch +
    cTool + cExt + cPkg + cFrt + cOth;

  const yieldFactor = 1 - scr / 100;
  const costAfterScrap = yieldFactor > 0 ? directCostBeforeScrap / yieldFactor : 0;
  const scrapAllowance = costAfterScrap - directCostBeforeScrap;
  const contingencyAllowance = costAfterScrap * conPct / 100;

  const totalJobCostPerBatch = costAfterScrap + contingencyAllowance;
  const costPerGoodUnit = bq > 0 ? totalJobCostPerBatch / bq : 0;

  const marginFactor = 1 - tm / 100;
  const targetSellPricePerBatch = marginFactor > 0 ? totalJobCostPerBatch / marginFactor : 0;
  const targetSellPricePerUnit = bq > 0 ? targetSellPricePerBatch / bq : 0;

  const profitPerBatch = targetSellPricePerBatch - totalJobCostPerBatch;
  const profitPerUnit = targetSellPricePerUnit - costPerGoodUnit;

  const annualRevenueAtTarget = targetSellPricePerBatch * annualBatches;
  const annualProfitAtTarget = profitPerBatch * annualBatches;

  // ── Primary cost driver ─────────────────────────────────────────────
  const costComponents: [string, number][] = [
    ["Material", matCostBeforeScrap], ["Machine", machCostPerBatch],
    ["Labor", laborCostPerBatch], ["Overhead", ohPerBatch],
    ["Tooling", cTool], ["External Processing", cExt],
    ["Packaging", cPkg], ["Freight", cFrt], ["Other", cOth],
  ];
  const maxComponent = costComponents.reduce((a, b) => a[1] >= b[1] ? a : b);
  const driverCodes: Record<string, number> = {
    Material:0, Machine:1, Labor:2, Overhead:3, Tooling:4,
    "External Processing":5, Packaging:6, Freight:7, Other:8,
  };
  const driverCode = driverCodes[maxComponent[0]] ?? 0;

  // ── Decision state ──────────────────────────────────────────────────
  const hasCurrentQuote = curQuote > 0;
  const currentQuotePerBatch = hasCurrentQuote ? curQuote * bq : 0;
  const currentProfitPerBatch = hasCurrentQuote ? currentQuotePerBatch - totalJobCostPerBatch : 0;
  const achievedMarginPct = hasCurrentQuote && currentQuotePerBatch > 0
    ? (currentProfitPerBatch / currentQuotePerBatch) * 100 : 0;
  const priceGapPerUnit = hasCurrentQuote ? curQuote - targetSellPricePerUnit : 0;
  const annualUnderpricingRisk = hasCurrentQuote
    ? Math.max(0, targetSellPricePerUnit - curQuote) * vol : 0;

  // Break-even
  const cycleHrsPerUnit = ct / 3600;
  const variableCostPerUnit = mcpu / yieldFactor + mr * cycleHrsPerUnit + lr * cycleHrsPerUnit * nop;
  const fixedCostPerBatch = setupHrs * mr + setupHrs * nop * lr + ohPerBatch + cTool + cExt + cPkg + cFrt + cOth;

  const contributionPerUnit = hasCurrentQuote ? curQuote - variableCostPerUnit : 0;
  let beQty = 0;
  let beStatus = 0; // 0=FEASIBLE, 1=IMPOSSIBLE
  if (hasCurrentQuote && contributionPerUnit <= 0) {
    beStatus = 1;
    blocked = true;
  } else if (hasCurrentQuote && contributionPerUnit > 0) {
    beQty = Math.ceil(fixedCostPerBatch / contributionPerUnit);
  }

  let decisionState = 0; // GOOD
  if (blocked) {
    decisionState = 2; // BLOCKED
  } else if (
    (hasCurrentQuote && achievedMarginPct < tm) || scr > 10 || conPct <= 0
  ) {
    decisionState = 1; // REVIEW
  }

  // ── Assign outputs ──────────────────────────────────────────────────
  outputs.out_run_machine_hours                        = round(runMachineHrs, 4);
  outputs.out_setup_hours                               = round(setupHrs, 4);
  outputs.out_total_machine_hours                       = round(totalMachineHrs, 4);
  outputs.out_labor_hours_per_batch                     = round(laborHrsPerBatch, 4);
  outputs.out_material_cost_before_scrap                = round(matCostBeforeScrap, 2);
  outputs.out_machine_cost_per_batch                    = round(machCostPerBatch, 2);
  outputs.out_labor_cost_per_batch                      = round(laborCostPerBatch, 2);
  outputs.out_overhead_cost_per_batch                   = round(ohPerBatch, 2);
  outputs.out_tooling_consumables_cost_per_batch        = round(cTool, 2);
  outputs.out_external_processing_cost_per_batch        = round(cExt, 2);
  outputs.out_packaging_cost_per_batch                  = round(cPkg, 2);
  outputs.out_freight_cost_per_batch                    = round(cFrt, 2);
  outputs.out_other_job_cost_per_batch                  = round(cOth, 2);
  outputs.out_direct_cost_before_scrap                  = round(directCostBeforeScrap, 2);
  outputs.out_scrap_rework_allowance                    = round(scrapAllowance, 2);
  outputs.out_contingency_allowance                     = round(contingencyAllowance, 2);
  outputs.out_total_job_cost_per_batch                  = round(totalJobCostPerBatch, 2);
  outputs.out_cost_per_good_unit                        = round(costPerGoodUnit, 4);
  outputs.out_target_sell_price_per_batch               = round(targetSellPricePerBatch, 2);
  outputs.out_target_sell_price_per_unit                = round(targetSellPricePerUnit, 4);
  outputs.out_profit_per_batch                          = round(profitPerBatch, 2);
  outputs.out_profit_per_unit                           = round(profitPerUnit, 4);
  outputs.out_annual_batches                            = round(annualBatches, 2);
  outputs.out_annual_revenue_at_target                  = round(annualRevenueAtTarget, 2);
  outputs.out_annual_profit_at_target                   = round(annualProfitAtTarget, 2);
  outputs.out_primary_cost_driver                       = driverCode;
  outputs.out_final_decision_state                      = decisionState;
  outputs.out_current_quote_per_batch                   = round(currentQuotePerBatch, 2);
  outputs.out_current_profit_per_batch                  = round(currentProfitPerBatch, 2);
  outputs.out_achieved_margin_percent                   = round(achievedMarginPct, 2);
  outputs.out_price_gap_per_unit                        = round(priceGapPerUnit, 4);
  outputs.out_annual_underpricing_risk                  = round(annualUnderpricingRisk, 2);
  outputs.out_break_even_batch_quantity                 = beQty;
  outputs.out_break_even_status                         = beStatus;

  const allOk = Object.values(outputs).every(v => isFiniteNumber(v));

  return {
    status: blocked ? "BLOCKED" : allOk ? "OK" : "REVIEW",
    outputs,
    warnings,
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
