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

export const toolKey = "scrap-rework-cost-tracker";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function safeDiv(n: number, d: number): number { if (!isFiniteNumber(n) || !isFiniteNumber(d) || Math.abs(d) < 1e-12) return 0; return n / d; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const total_produced = Math.max(0, get(inputs, "n_total_produced"));
  const scrap_quantity = Math.max(0, get(inputs, "n_scrap_quantity"));
  const rework_quantity = Math.max(0, get(inputs, "n_rework_quantity"));
  const unit_material_cost = Math.max(0, get(inputs, "n_unit_material_cost"));
  const unit_labor_cost = Math.max(0, get(inputs, "n_unit_labor_cost"));
  const rework_labor_rate = Math.max(0, get(inputs, "n_rework_labor_rate"));
  const rework_time_per_unit = Math.max(0, get(inputs, "n_rework_time_per_unit"));
  const defect_rate_target_pct = Math.max(0, get(inputs, "n_defect_rate_target_pct"));
  const monthly_volume = Math.max(0, get(inputs, "n_monthly_volume"));

  if (!isFiniteNumber(inputs["n_total_produced"])) warnings.push("Missing: n_total_produced");
  if (!isFiniteNumber(inputs["n_scrap_quantity"])) warnings.push("Missing: n_scrap_quantity");
  if (!isFiniteNumber(inputs["n_rework_quantity"])) warnings.push("Missing: n_rework_quantity");

  // Scrap rate
  const scrap_rate_pct = safeDiv(scrap_quantity, total_produced) * 100;

  // Material loss = scrapped units x material cost per unit
  const material_loss = scrap_quantity * unit_material_cost;

  // Machine loss = scrapped labor value + overhead proxy (50% of labor)
  const machine_loss = scrap_quantity * unit_labor_cost * 0.5;

  // Labor loss = scrapped labor content
  const labor_loss = scrap_quantity * unit_labor_cost;

  // Rework cost = rework hours x rework labor rate
  const rework_cost = rework_quantity * rework_time_per_unit * rework_labor_rate;

  // Inspection & disposal cost = 8% of material loss (estimated)
  const inspection_cost = material_loss * 0.08;
  const disposal_cost = scrap_quantity * 2; // $2/unit estimated disposal

  // Replacement production cost = scrap units x (material + labor)
  const replacement_production_cost = scrap_quantity * (unit_material_cost + unit_labor_cost);

  // Total loss
  const total_loss = material_loss + machine_loss + labor_loss + rework_cost + inspection_cost + disposal_cost + replacement_production_cost;

  // Annualized (assume monthly volume is consistent)
  const annualized_loss = monthly_volume > 0
    ? total_loss * safeDiv(monthly_volume, total_produced) * 12
    : total_loss * 12;

  // Cost per rejected unit
  const total_defect_units = scrap_quantity + rework_quantity;
  const cost_per_rejected_unit = total_defect_units > 0 ? total_loss / total_defect_units : 0;

  // Primary defect cost driver: 0=material, 1=machine, 2=labor, 3=rework
  const drivers = [material_loss, machine_loss, labor_loss, rework_cost];
  const maxDriver = Math.max(...drivers);
  const primary_driver = maxDriver > 0 ? drivers.indexOf(maxDriver) : 0;

  // Decision state: 0=GOOD (below target), 1=REVIEW (moderate), 2=BLOCKED (high)
  let decision: number;
  if (scrap_rate_pct <= defect_rate_target_pct) {
    decision = 0; // GOOD — within target
  } else if (scrap_rate_pct <= defect_rate_target_pct * 2) {
    decision = 1; // REVIEW — above target but manageable
  } else {
    decision = 2; // BLOCKED — significantly above target
  }

  outputs["out_scrap_quantity"] = round(scrap_quantity, 0);
  outputs["out_scrap_rate_pct"] = round(scrap_rate_pct, 2);
  outputs["out_material_loss"] = round(material_loss, 2);
  outputs["out_machine_loss"] = round(machine_loss, 2);
  outputs["out_labor_loss"] = round(labor_loss, 2);
  outputs["out_rework_cost"] = round(rework_cost, 2);
  outputs["out_inspection_cost"] = round(inspection_cost, 2);
  outputs["out_disposal_cost"] = round(disposal_cost, 2);
  outputs["out_replacement_production_cost"] = round(replacement_production_cost, 2);
  outputs["out_total_loss"] = round(total_loss, 2);
  outputs["out_annualized_loss"] = round(annualized_loss, 2);
  outputs["out_cost_per_rejected_unit"] = round(cost_per_rejected_unit, 2);
  outputs["out_primary_defect_cost_driver"] = primary_driver;
  outputs["out_final_decision_state"] = decision;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings: warnings.length ? warnings : [],
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
