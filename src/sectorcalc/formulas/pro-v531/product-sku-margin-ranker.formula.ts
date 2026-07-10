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

export const toolKey = "product-sku-margin-ranker";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function get(inputs: Record<string, number>, key: string): number {
  const v = inputs[key];
  return isFiniteNumber(v) ? v : 0;
}

function round(v: number, d: number): number {
  if (!isFiniteNumber(v)) return 0;
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

function safeDiv(n: number, d: number): number {
  if (!isFiniteNumber(n) || !isFiniteNumber(d) || Math.abs(d) < 1e-12) return 0;
  return n / d;
}

function clamp(v: number): number {
  return Math.max(0, v);
}

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  // --- Validate required inputs ---
  const requiredKeys = [
    "n_unit_price",
    "n_material_cost_per_unit",
    "n_labor_cost_per_unit",
    "n_overhead_per_unit",
    "n_logistics_cost_per_unit",
    "n_annual_volume_units",
    "n_target_margin_percent",
    "n_total_portfolio_revenue",
    "n_total_portfolio_profit",
  ];

  let evidenceCount = 0;
  for (const key of requiredKeys) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    } else {
      evidenceCount++;
    }
  }

  // --- Extract and clamp inputs ---
  const n_unit_price = clamp(get(inputs, "n_unit_price"));
  const n_material_cost_per_unit = clamp(get(inputs, "n_material_cost_per_unit"));
  const n_labor_cost_per_unit = clamp(get(inputs, "n_labor_cost_per_unit"));
  const n_overhead_per_unit = clamp(get(inputs, "n_overhead_per_unit"));
  const n_logistics_cost_per_unit = clamp(get(inputs, "n_logistics_cost_per_unit"));
  const n_annual_volume_units = clamp(get(inputs, "n_annual_volume_units"));
  const n_target_margin_percent = clamp(get(inputs, "n_target_margin_percent"));
  const n_total_portfolio_revenue = clamp(get(inputs, "n_total_portfolio_revenue"));
  const n_total_portfolio_profit = clamp(get(inputs, "n_total_portfolio_profit"));

  // --- Core calculations ---
  const variable_cost = n_material_cost_per_unit + n_labor_cost_per_unit + n_overhead_per_unit + n_logistics_cost_per_unit;
  const unit_cost = variable_cost;
  const sku_revenue = n_unit_price * n_annual_volume_units;
  const contribution_amount = n_unit_price > 0 ? n_unit_price - variable_cost : 0;
  const contribution_margin_percent = safeDiv(contribution_amount, n_unit_price) * 100;
  const fully_loaded_profit = contribution_amount * n_annual_volume_units;
  const fully_loaded_margin = safeDiv(fully_loaded_profit, sku_revenue) * 100;
  const revenue_share_percent = safeDiv(sku_revenue, n_total_portfolio_revenue) * 100;
  const profit_share_percent = safeDiv(fully_loaded_profit, n_total_portfolio_profit) * 100;

  // --- Margin classification ---
  // 0=HIGH (>=30%), 1=MEDIUM (15-30%), 2=LOW (0-15%), 3=NEGATIVE (<0%)
  let margin_classification: number;
  if (contribution_margin_percent >= 30) {
    margin_classification = 0; // HIGH
  } else if (contribution_margin_percent >= 15) {
    margin_classification = 1; // MEDIUM
  } else if (contribution_margin_percent >= 0) {
    margin_classification = 2; // LOW
  } else {
    margin_classification = 3; // NEGATIVE
  }

  // --- Repricing priority ---
  // 0=LOW, 1=MEDIUM, 2=HIGH, 3=URGENT
  let repricing_priority: number;
  if (margin_classification === 0) {
    repricing_priority = 0; // LOW
  } else if (margin_classification === 1) {
    repricing_priority = 1; // MEDIUM
  } else if (margin_classification === 2) {
    repricing_priority = 2; // HIGH
  } else {
    repricing_priority = 3; // URGENT
  }

  // --- Concentration risk ---
  // 0=LOW (<10%), 1=MEDIUM (10-30%), 2=HIGH (>30%)
  let concentration_risk: number;
  if (revenue_share_percent >= 30) {
    concentration_risk = 2; // HIGH
  } else if (revenue_share_percent >= 10) {
    concentration_risk = 1; // MEDIUM
  } else {
    concentration_risk = 0; // LOW
  }

  // --- Decision state ---
  // 0=GOOD, 1=REVIEW, 2=BLOCKED
  let decision: number;
  if (margin_classification === 0 || margin_classification === 1) {
    decision = 0; // GOOD
  } else if (margin_classification === 2) {
    decision = 1; // REVIEW — low margin SKU needs attention
  } else {
    decision = 2; // BLOCKED — negative margin SKU
  }

  // --- Outputs ---
  outputs["out_sku_revenue"] = round(sku_revenue, 2);
  outputs["out_variable_cost"] = round(variable_cost, 4);
  outputs["out_contribution_amount"] = round(contribution_amount, 4);
  outputs["out_contribution_margin_percent"] = round(contribution_margin_percent, 4);
  outputs["out_fully_loaded_profit"] = round(fully_loaded_profit, 2);
  outputs["out_fully_loaded_margin"] = round(fully_loaded_margin, 4);
  outputs["out_unit_cost"] = round(unit_cost, 4);
  outputs["out_revenue_share_percent"] = round(revenue_share_percent, 4);
  outputs["out_profit_share_percent"] = round(profit_share_percent, 4);
  outputs["out_margin_classification"] = margin_classification;
  outputs["out_repricing_priority"] = repricing_priority;
  outputs["out_concentration_risk"] = concentration_risk;
  outputs["out_final_decision_state"] = decision;

  // --- Sanity check ---
  const allOutputKeys = [
    "out_sku_revenue",
    "out_variable_cost",
    "out_contribution_amount",
    "out_contribution_margin_percent",
    "out_fully_loaded_profit",
    "out_fully_loaded_margin",
    "out_unit_cost",
    "out_revenue_share_percent",
    "out_profit_share_percent",
    "out_margin_classification",
    "out_repricing_priority",
    "out_concentration_risk",
    "out_final_decision_state",
  ];

  for (const key of allOutputKeys) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push("Non-finite output corrected to zero: " + key);
    }
  }

  // Derive status
  let status: CalculationStatus = "OK";
  if (warnings.length > 0) status = "REVIEW";
  if (decision === 2) status = "BLOCKED";

  return {
    status,
    outputs,
    warnings,
    outputKeys: allOutputKeys,
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
